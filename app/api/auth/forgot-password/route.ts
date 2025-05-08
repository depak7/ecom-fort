import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/database/index'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        const user=await prisma.user.findUnique({
            where:{email}
        })

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ error: 'No user found with this email address.' }, { status: 404 });
        }

        // ✅ Generate secure token (placeholder here, use JWT or UUID in prod)
        const resetToken = Math.random().toString(36).substring(2, 15);
        const resetLink = `https://ecom-fort.vercel.app/reset-password?token=${resetToken}`;
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now



        const token = await prisma.passwordReset.create({
            data: {
                email,
                expiresAt,
                token: resetToken,
                createdAt: new Date()
            }
        })

        // ✅ Email transport config
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address
                pass: process.env.EMAIL_PASS, // your Gmail app password (NOT Gmail login password)
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your password',
            html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .navbar {
      background-color: #000000;
      padding: 15px 20px;
      text-align: center;
    }
    .logo-placeholder img {
      width: 150px;
    }
    .content {
      padding: 20px;
    }
    .header {
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .highlight {
      background-color: #f8f8f8;
      padding: 15px;
      border-left: 4px solid #000;
      margin: 15px 0;
    }
  
    .footer {
      background-color: #f5f5f5;
      padding: 15px 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="navbar">
      <div class="logo-placeholder">
        <img src="https://i.ibb.co/Vccqnv69/ecom-fort.png" alt="Ecom Fort Logo" />
      </div>
    </div>

    <div class="content">
      <div class="header">
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password for your Ecom Fort account.</p>
      </div>

      <p>If you did not make this request, you can safely ignore this email.</p>

      <div class="highlight">
        <p>Click the button below to reset your password:</p>
       <a 
  href="${resetLink}" 
  target="_blank"
  style="
    display: inline-block;
    background-color: #000;
    color: #ffffff !important;
    text-decoration: none !important;
    padding: 10px 20px;
    border-radius: 4px;
    margin-top: 15px;
    font-weight: bold;"
>
  Reset Password
</a>

      </div>

      <p>This link will expire in 1 hour. For your security, do not share this email or the link with anyone else.</p>

      <p>If you have any issues, please contact our support team.</p>

      <p>Thank you,<br/>The Ecom Fort Team</p>
    </div>

    <div class="footer">
      <p>© 2024 Ecom Fort. All rights reserved.</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>

      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Reset email sent' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        return NextResponse.json({ message: 'Failed to send reset email' }, { status: 500 });
    }
}
