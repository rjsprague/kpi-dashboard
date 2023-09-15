import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

export async function GET() {
    const accessToken = cookies().get("accessToken");

    console.log("accessToken", accessToken)
    
    if (!accessToken) {
        return NextResponse.json("No token");
    }

    // console.log("accessToken", accessToken);
    const { id } = jwt.decode(accessToken.value)

    if (!id) {        
        return NextResponse.json("Invalid token")
    }

    const response = await fetch(`${process.env.API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken.value
        }
    });

    // console.log(response)

    if (!response.ok) {
        console.error('Error fetching user:', response);
        cookies().delete("accessToken");
        return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL+"/login");
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
}