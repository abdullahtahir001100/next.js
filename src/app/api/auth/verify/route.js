import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, otp } = await req.json();
  const data = global.otpStore?.[email];

  if (!data || Date.now() > data.expires) {
    return NextResponse.json({ message: "OTP Expired!" }, { status: 400 });
  }
  if (data.otp === otp) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ message: "Invalid OTP!" }, { status: 400 });
}