import { NextResponse } from 'next/server';

// Persistent memory logic (Jab tak server chal raha hai)
global.adminUser = global.adminUser || {
  email: "smzenterprisespk@gmail.com",
  password: "viking123" 
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Email validation
    if (email !== global.adminUser.email) {
      return NextResponse.json({ message: "Email not found!" }, { status: 404 });
    }

    // 2. Password validation
    if (password === global.adminUser.password) {
      // Success Response create karein
      const response = NextResponse.json({ 
        success: true, 
        message: "Welcome back! Redirecting..." 
      });

      // 3. SECURE COOKIE SET KARNA (Middleware isey check karega)
      response.cookies.set({
        name: 'admin_token', // Aapke middleware mein isi naam ka token check ho raha hai
        value: 'secure_viking_session_token_786', // Asal mein yahan unique ID hoti hai
        httpOnly: true, // Security: JavaScript isey read nahi kar sakegi
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 Din tak login rahega
        path: '/',
      });

      return response;

    } else {
      return NextResponse.json({ message: "Incorrect Password!" }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}