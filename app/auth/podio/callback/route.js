import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

// callback handler for Podio OAuth
export async function GET(req, res) {
    const public_base_url = process.env.NEXT_PUBLIC_BASE_URL

    const url = new URL(req.url);
    // console.log(url)
    const code = url.searchParams.get('code');
    // console.log(code)
    const preLoginRoute = url.searchParams.get('preLoginRoute')
    // console.log(preLoginRoute)

    if (!code) {
        return NextResponse.redirect(public_base_url + '/login');
    }

    // Construct the absolute URL for the callback
    const callbackUrl = `${process.env.API_BASE_URL}/auth/callback?code=${code}`;
    // console.log(callbackUrl)
    try {
        const response = await fetch(callbackUrl, { cache: 'no-store' });
        // console.log(response)

        const data = await response.json();

        // console.log(data)

        const { token } = data;
        // console.log(token)

        const decodedToken = jwt.decode(token);
        // console.log(decodedToken)

        cookies().set({
            name: 'token',
            value: token,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        cookies().set({
            name: 'tokenExpiry',
            value: decodedToken.exp,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        if (preLoginRoute) {
            return NextResponse.redirect(public_base_url + '/auth-success');
        } else {
            return NextResponse.redirect(public_base_url + '/kpi-dashboard');
        }
    } catch (error) {
        // console.log(error, error.message);
        return NextResponse.redirect(public_base_url + '/login');
    }
}
