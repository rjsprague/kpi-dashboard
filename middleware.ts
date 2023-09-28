// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Replace with your base URL
    const loginUrl = `${baseUrl}/login`;

    // List of routes that should be protected
    const protectedRoutes = ['/kpi-dashboard', '/user-profile', '/call-scripts', '/user-management']; // Add other protected routes here
    const currentPath = request.nextUrl.pathname;

    // Only apply middleware to protected routes
    if (!protectedRoutes.includes(currentPath)) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('accessToken');
    // console.log('accessToken in middleware', accessToken)

    if (!accessToken) {
        // No access token found, redirect to login
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Decode the JWT token
        const decodedToken: any = jwt.decode(accessToken.value);

        // Check if the token has expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp < currentTime) {
            // Token has expired, redirect to login
            return NextResponse.redirect(loginUrl);
        }

        // Token is valid, proceed to the next middleware or route handler
        return NextResponse.next();
    } catch (error) {
        // An error occurred while decoding the token, redirect to login
        console.error('Error decoding token:', error);
        return NextResponse.redirect(loginUrl);
    }
}
