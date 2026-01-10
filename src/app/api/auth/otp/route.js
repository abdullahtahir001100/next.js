import { NextResponse } from 'next/server';

global.otpStore = global.otpStore || {};

export async function POST(req) {
  try {
    const { email } = await req.json();
    const targetEmail = email.toLowerCase();

    if (targetEmail !== process.env.AUTHORIZED_EMAIL) {
      return NextResponse.json({ message: "Email not authorized!" }, { status: 403 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    global.otpStore[targetEmail] = { 
      otp, 
      expires: Date.now() + 300000 
    };

    // Terminal log for quick testing
    console.log(`\n[OTP DEBUG] ${targetEmail} -> ${otp}\n`);

    // --- PROFESSIONAL EMAIL TEMPLATE ---
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #edf2f7; }
          .logo { width: 50px; height: 50px; margin-bottom: 10px; }
          .content { padding: 30px 20px; text-align: center; }
          .otp-box { background-color: #f0f9ff; border: 2px dashed #0084ff; padding: 20px; margin: 20px 0; border-radius: 10px; font-size: 32px; font-weight: bold; color: #0084ff; letter-spacing: 10px; }
          .security-notice { background-color: #fff5f5; border-left: 4px solid #f56565; padding: 15px; text-align: left; margin-top: 30px; border-radius: 4px; }
          .footer { text-align: center; font-size: 12px; color: #718096; margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7; }
          .highlight { color: #0084ff; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://next-js-alpha-woad.vercel.app/favicon.png" alt="SMZ Logo" class="logo">
            <h2 style="margin: 0; color: #1a202c;">SMZ Enterprises</h2>
            <span style="font-size: 12px; color: #a0aec0; text-transform: uppercase; letter-spacing: 1px;">Security Department</span>
          </div>

          <div class="content">
            <h3 style="margin-top: 0;">Verification Required</h3>
            <p>We received a request to access your administrator account. Use the following security code to complete your verification:</p>
            
            <div class="otp-box">${otp}</div>
            
            <p style="font-size: 14px; color: #4a5568;">This code is valid for <span class="highlight">5 minutes</span>. After that, you will need to request a new one.</p>
          </div>

          <div class="security-notice">
            <strong style="color: #c53030; display: block; margin-bottom: 5px;">⚠️ Critical Security Warning:</strong>
            <p style="margin: 0; font-size: 13px; color: #2d3748;">
              Never share this code with anyone. Our staff or support team will <strong>NEVER</strong> ask for this code over the phone or email. 
              If you did not request this code, please ignore this email and change your password immediately as your account security might be at risk.
            </p>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SMZ Enterprises Store. All rights reserved.</p>
            <p>Sent from Sargodha, Pakistan | Viking Armory Security Service</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SMZ Security <onboarding@resend.dev>',
        to: [targetEmail],
        subject: `${otp} is your SMZ verification code`,
        html: emailHtml,
      }),
    });

    if (resendResponse.ok) {
      return NextResponse.json({ success: true, message: "Secure OTP sent!" });
    } else {
      const errorData = await resendResponse.json();
      console.error("Resend Error:", errorData);
      return NextResponse.json({ success: true, message: "Check Terminal (API Error)" });
    }

  } catch (err) {
    console.error("Internal API Error:", err.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}