import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const body = await req.json()
    const { profile, auth, selectedTimezone } = body as any;

    const accessToken = auth.accessToken;

    if (!accessToken) {
        return NextResponse.json("No token");
    }

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
                    // "spaceID": profile.spaceID,
                    "settings": {
                        "timezone": selectedTimezone,
                        podio: {
                            userID: profile.settings.podio.userID,
                            spacesID: profile.settings.podio.spaceID,
                        },
                        google: {
                            rootFolderID: "11Pv9p9w24685nxx08R_Sk2V2_cjcVpCB",
                            propertyFolderID: "1d2cOtlQT07hl5Bg8zViHIijmL9ANDabn",
                        }
                    },
                    "isAdmin": profile.isAdmin,
                    "isActive": profile.isActive,
                })
            });

        return NextResponse.json({ status: response.status, message: response.statusText })

    } catch (error) {
        // Handle error
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: "Error updating profile" });
    }
}