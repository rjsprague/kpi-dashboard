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
                    "settings": {
                        "timezone": selectedTimezone,
                        podio: {
                            userID: profile.settings.podio.userID,
                            spacesID: profile.settings.podio.spacesID,
                        },
                        google: {
                            rootFolderID: profile.settings.google.rootFolderID,
                            propertyFolderID: profile.settings.google.propertyFolderID,
                        }
                    },
                    "isAdmin": profile.isAdmin,
                    "isActive": profile.isActive,
                    "isScaling": profile.isScaling,
                    "isProfessional": profile.isProfessional,
                    "isStarter": profile.isStarter
                })
            });

        return NextResponse.json({ status: response.status, message: response.statusText, body: await response.json() })

    } catch (error) {
        // Handle error
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: "Error updating profile" });
    }
}