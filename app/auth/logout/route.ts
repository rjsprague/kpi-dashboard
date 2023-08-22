import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.error()
  }

  // Clear the cookie
  cookies().delete("accessToken");

  return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL+"/login");
}
