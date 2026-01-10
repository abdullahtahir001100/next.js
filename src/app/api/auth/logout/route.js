import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  // Cookie delete karne ke liye uski expiration 0 set karein
  response.cookies.set('admin_token', '', { expires: new Date(0), path: '/' });
  
  return response;
}