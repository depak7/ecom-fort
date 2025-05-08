import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {prisma} from '@/database/index'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // ✅ Generate secure token (placeholder here, use JWT or UUID in prod)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetLink = `https://ecom-fort.vercel.app/reset-password?token=${resetToken}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now



    const token=await prisma.passwordReset.create({
        data:{
            email,
            expiresAt,
            token:resetToken,
            createdAt:new Date()
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
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    return NextResponse.json({ message: 'Failed to send reset email' }, { status: 500 });
  }
}
