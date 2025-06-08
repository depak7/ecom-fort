import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Run the email logic in the background
    setImmediate(async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to,
          subject,
          html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${to}`);
      } catch (err) {
        console.error('Error sending email in background:', err);
      }
    });

    // Return immediately
    return NextResponse.json({ message: 'Email request received' }, { status: 202 });

  } catch (error) {
    console.error('Error processing email request:', error);
    return NextResponse.json({ message: 'Invalid request' }, { status: 500 });
  }
}
