import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const accessToken = cookies().get('accessToken')
//   console.log('accessToken', accessToken)
  return NextResponse.json({ accessToken });
}
