import { NextResponse } from "next/server";

export async function GET(req) {
    const accessToken = req.cookies.get("accessToken");
    let token = '';
    if (accessToken) {
        token = accessToken.value;
    }
    // console.log("accessToken", accessToken);

        const response = await fetch(`${process.env.API_BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // console.log(response.status)

        if (response.status !== 200) {
            console.error('Error fetching user:', response);
            req.cookies.delete('accessToken')
            // console.log("redirecting to login")
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
        }

        const data = await response.json();
        // console.log(data)

        return NextResponse.json(data);
}
