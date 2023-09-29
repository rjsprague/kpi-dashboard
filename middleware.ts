// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const loginUrl = `${baseUrl}/login`;
    const protectedRoutes = ['/kpi-dashboard', '/user-profile', '/call-scripts', '/user-management'];
    const currentPath = request.nextUrl.pathname;
    
    // Only apply middleware to protected routes
    if (!protectedRoutes.includes(currentPath)) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('accessToken');

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
