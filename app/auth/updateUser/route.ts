import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const body = await req.json()
    const { profile, auth, selectedTimezone } = body as any;
    console.log("profile", profile)
    console.log("auth", auth)
    console.log("selectedTimezone", selectedTimezone)

    const accessToken = auth.accessToken;


    if (!accessToken) {
        return NextResponse.json("No token");
    }

    console.log("accessToken", accessToken);

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/users/${profile.id}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": profile.id,
                    "email": profile.email,
                    "name": profile.name,
                    "displayName": profile.displayName,
                    "spaceID": profile.spaceID,
                    "settings": {
                        "timezone": selectedTimezone
                    },
                    "isAdmin": profile.isAdmin,
                })
            });

        if (response.status === 200) {
            console.log('Profile updated successfully')
            return NextResponse.json({ message: "Profile updated successfully." });

        } else {
            console.error('Failed to update timzeone: ', response)
            return NextResponse.json({ message: "Failed to update timzeone." });
        }

    } catch (error) {
        // Handle error
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: "Error updating profile" });
    }
}