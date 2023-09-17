import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'

// callback handler for Podio OAuth
export async function GET(req) {
    // get the code from the query string
    const public_base_url = process.env.NEXT_PUBLIC_BASE_URL

    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    // console.log("code: " + code);

    if (!code) {
        return NextResponse.redirect( public_base_url + '/login');
    }

    // Construct the absolute URL for the callback
    const callbackUrl = `${process.env.API_BASE_URL}/auth/callback?code=${code}`;

    try {
        const response = await fetch(callbackUrl);

        console.log(response.status, response.statusText)
        if (!response.ok) {
            throw new Error("Something went wrong on api server!", response.status, response.statusText);
        }

        const data = await response.json();

        // console.log(data)
        const { token } = data;

        const decodedToken = jwt.decode(token);
        // console.log("Decoded Token: ", decodedToken);
        
        // set the token in a cookie
        cookies().set({
            name: 'accessToken',
            value: token,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            secure: process.env.NODE_ENV === 'production', // set to true in production
        })

        // console.log("accessToken cookie ", cookies().get('accessToken'))

        if (!decodedToken.settings.timezone) {
            return NextResponse.redirect( public_base_url + '/user-profile')
        }

        return NextResponse.redirect( public_base_url + '/kpi-dashboard');
    } catch (error) {
        console.log(error, error.message);
        return NextResponse.redirect(public_base_url + '/login');
    }
}
