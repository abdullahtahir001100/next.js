import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Password Update Logic
    if (global.adminUser && email === global.adminUser.email) {
      global.adminUser.password = password; // Naya password save ho gaya
      console.log("Password Updated Successfully for:", email);
    }

    // OTP delete karein memory se
    if (global.otpStore) delete global.otpStore[email];

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successful! Please login." 
    });
  } catch (err) {
    return NextResponse.json({ message: "Reset failed!" }, { status: 500 });
  }
}