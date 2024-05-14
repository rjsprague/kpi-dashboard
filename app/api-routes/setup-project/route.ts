import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, validateInput } from '@/lib/utils/validation';
import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';


interface EnvVariable {
    key: string;
    value: string;
    type: string;
    target: string;
}

interface CreateRepositoryResponse {
    clone_url: string;
    full_name: string;
}

export const runtime = "edge"

export async function POST(req: NextRequest) {

    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }

    if (!req.body) return NextResponse.json({ success: false, message: 'No data provided' }, { status: 400 });

    console.log('Received request:', req.method, req.body)

    const { templateRepo = 'client-sites-template', formData } = await req.json();

    console.log('Received form data:', { templateRepo, formData });

    const githubToken = process.env.GITHUB_TOKEN as string;
    const vercelToken = process.env.VERCEL_TOKEN as string;

    if (!githubToken || !vercelToken) {
        return NextResponse.json({ success: false, message: 'Missing required environment variables' }, { status: 500 });
    }



    const userEnvVariables = [
        { key: 'NEXT_PUBLIC_BUSINESS_NAME', value: formData.businessName as string, type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_BUSINESS_ADDRESS', value: formData.businessAddress as string, type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_BUSINESS_PHONE', value: formData.businessPhone as string, type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_BUSINESS_EMAIL', value: formData.businessEmail as string, type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_BUSINESS_WEBSITE', value: formData.businessWebsite as string, type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_BUSINESS_LOGO', value: formData.businessLogo as string ? formData.businessLogo : '', type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_PRIMARY_COLOR', value: formData.primaryColor as string ? formData.primaryColor : '#000000', type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_SECONDARY_COLOR', value: formData.secondaryColor as string ? formData.secondaryColor : '#FFFFFF', type: 'plain', target: 'production' },
        { key: 'NEXT_PUBLIC_GTM_ID', value: formData.gtmId as string ? formData.gtmId : '', type: 'plain' },
        { key: 'SEND_TO_EMAILS', value: formData.sendToEmails as string ? formData.sendToEmails : '', type: 'plain' },
        { key: 'TWILIO_TO_PHONE_NUMBERS', value: formData.twilioToPhoneNumbers as string ? formData.twilioToPhoneNumbers : '', type: 'plain', target: 'production' },
    ];


    // Static environment variables (can be moved to a config or .env file)
    const staticEnvVars = [
        { key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', value: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, type: 'plain', target: 'production' },
        { key: 'EMAIL_WEBHOOK_URL', value: process.env.EMAIL_WEBHOOK_URL as string, type: 'plain', target: 'production' },
        { key: 'CRM_WEBHOOK_URL', value: '', type: 'plain' },
        { key: 'TWILIO_ACCOUNT_SID', value: process.env.TWILIO_ACCOUNT_SID as string, type: 'plain', target: 'production' },
        { key: 'TWILIO_AUTH_TOKEN', value: process.env.TWILIO_AUTH_TOKEN as string, type: 'plain', target: 'production' },
        { key: 'TWILIO_FROM_PHONE_NUMBER', value: process.env.TWILIO_FROM_PHONE_NUMBER as string, type: 'plain', target: 'production' },
    ];


    const environmentVariables: EnvVariable[] = [];
    const errors: string[] = [];

    [...staticEnvVars, ...userEnvVariables].forEach(env => {
        if (!validateInput(env.value, 'value') || !validateInput(env.key, 'key')) {
            errors.push(`Invalid input detected for ${env.key}`);
        } else {
            const sanitizedKey = sanitizeInput(env.key);
            const sanitizedValue = sanitizeInput(env.value) || '';
            const envType = env.type || 'plain';
            const envTarget = env.target || 'production';
            environmentVariables.push({ key: sanitizedKey, value: sanitizedValue, type: envType, target: envTarget });
        }
    });

    if (errors.length > 0) {
        return NextResponse.json({ success: false, message: 'Validation errors', errors }, { status: 400 });
    }

    try {
        // Create a new repository from the template
        const repoResponse = await createRepositoryFromTemplate(formData.businessName, templateRepo, githubToken);
        console.log('Repo response:', repoResponse);

        // Extract the 'data' property from the response
        const repoData: CreateRepositoryResponse = repoResponse.data; // Extract the 'data' property from the response
        console.log('Repo data:', repoData);

        // Create a new Vercel project linked to the new repository
        const vercelResponse = await createVercelProject(repoData.full_name, environmentVariables, vercelToken);
        console.log('Vercel response:', vercelResponse);


        // Create a new commit to trigger a Vercel deployment
        const octokit = new Octokit({ auth: githubToken });
        await createAndPushCommit(octokit, repoData.full_name);


        return NextResponse.json({
            success: true,
            message: 'Vercel project created successfully',
            repoUrl: repoData.clone_url,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to create repository or Vercel project' }, { status: 500 });
    }
}

async function createRepositoryFromTemplate(name: string, templateName: string, token: string) {

    const octokit = new Octokit({ auth: token });

    const lowerCaseName = name.toLowerCase();

    const body = {
        name: lowerCaseName,
        owner: "reiautomated",
        description: "New client site based on template",
        private: true,
        template_owner: "reiautomated",
        template_repo: templateName
    };

    const url = `/repos/{template_owner}/{template_repo}/generate`;

    const githubResponse = await octokit.request(`POST ${url}`, body).catch((error) => {
        console.error("Error creating repository from template:", error);
        throw error;
    });

    return githubResponse;
}

const createAndPushCommit = async (octokit: Octokit, repoFullName: string): Promise<void> => {
    const [owner, repo] = repoFullName.split('/');

    try {
        // Get the current reference of the main branch
        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: 'heads/main'
        });

        // Get the current commit object to retrieve the tree it points to
        const { data: commitData } = await octokit.rest.git.getCommit({
            owner,
            repo,
            commit_sha: refData.object.sha
        });

        // Create a new tree with the modified content
        const { data: treeData } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: commitData.tree.sha,
            tree: [{
                path: 'README.md',
                mode: '100644',
                type: 'blob',
                content: 'Updated README with new deployment info'
            }]
        });

        // Create a new commit using the new tree
        const { data: newCommitData } = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: 'Trigger Vercel deployment',
            tree: treeData.sha,
            parents: [commitData.sha]
        });

        // Update the main branch to point to the new commit
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref: 'heads/main',
            sha: newCommitData.sha
        });
    } catch (error) {
        if (error instanceof RequestError) {
            console.error('GitHub API error:', error.message);
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
};


async function createVercelProject(repoFullName: string, envVars: EnvVariable[], token: string) {

    const lowerCaseName = repoFullName.toLowerCase();

    const body = {
        name: lowerCaseName.split('/')[1] as string,
        gitRepository: {
            type: 'github',
            repo: lowerCaseName
        },
        framework: 'nextjs',
        environmentVariables: envVars.map(envVar => ({
            key: envVar.key,
            value: envVar.value,
            type: envVar.type,
            target: envVar.target,
        })),
    };


    const url = 'https://api.vercel.com/v10/projects?teamId=team_kUvDe05JAvbuJvxC47jR6ZDI';

    const vercelResponse = await makePostRequest(url, body, token);

    return vercelResponse;
}

async function makePostRequest(url: string, body: {}, token: string) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }
        return data;
    } catch (error) {
        console.error("Error making POST request:", error);
        throw error;
    }
}