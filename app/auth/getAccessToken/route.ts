import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

export async function GET() {
  const accessToken = cookies().get('accessToken')
//   console.log('accessToken', accessToken)
  return NextResponse.json({ accessToken });
}
