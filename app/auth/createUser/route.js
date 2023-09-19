import { NextResponse } from 'next/server';

// callback handler for Podio OAuth
export async function GET(req) {
    const apiBaseUrl = process.env.API_BASE_URL;

    const url = new URL(req.url);

    const email = url.searchParams.get('email');
    const name = url.searchParams.get('name');
    const displayName = url.searchParams.get('displayName');

    try {
        const createUserResponse = await fetch(`${apiBaseUrl}/temp/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "name": name,
                "displayName": displayName
            })
        });

        if (!createUserResponse.ok) {
            throw new Error("Failed to create the new user!", createUserResponse.status, createUserResponse.statusText);
        }

        const data = await createUserResponse.json();

        const { id } = data;
        console.log(id);

        const activateUserResponse = await fetch(`${apiBaseUrl}/temp/users/${id}/toggle`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!activateUserResponse.ok) {
            throw new Error("Failed to activate the new user!", activateUserResponse.status, activateUserResponse.statusText);
        }

        const activateUserData = await activateUserResponse.json();

        console.log(activateUserData);

        const { tempPassword } = activateUserData;

        const emailBody = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #092439;
                        color: #FFFFFF;
                    }
                    .container {
                        padding: 20px;
                        border: 1px solid #ccc;
                    }
                    .greeting {
                        font-size: 18px;
                    }
                    .info {
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                <img src="https://app-d.reiautomated.io/login-logo.svg"></img>
                    <p class='greeting'>Hello ${displayName},</p>
                    <p class='info'>Welcome to REI Automated! Here are your account details:</p>
                    <p class='info'>Email: ${email}</p>
                    <p class='info'>Temporary Password: ${tempPassword}</p>
                    <p class='info'>Please change your password after your first login using the <a href="https://app-d.reiautomated.io/forgotPassword">forgot password page.</a></p>
                </div>
            </body>
        </html>
    `

        const sendEmailResponse = await fetch(`https://api.reiautomated.io/google/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "From": "admin@reiautomated.io",
                "FromName": "Brandon Buller",
                "To": email,
                "ToName": name,
                "Subject": "Welcome to REI Automated",
                "Body": emailBody
            })
        });

        if (!sendEmailResponse.ok) {
            throw new Error("Failed to email the new user!", sendEmailResponse.status, sendEmailResponse.statusText);
        }

        const sendEmailData = await sendEmailResponse.json();

        console.log(sendEmailData);

        return NextResponse.json({ message: 'User created, activated and emailed successfully.', data: sendEmailData})

        } catch (error) {
            console.log(error, error.message);
            return NextResponse.json({ error: error, message: error.message, status: error.status });
        }
    }
