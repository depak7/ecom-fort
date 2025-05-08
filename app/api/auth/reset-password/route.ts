import { NextResponse } from "next/server";
import { prisma } from "@/database/index";
import bcrypt from "bcryptjs";
import { error } from "console";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    const reset = await prisma.passwordReset.findUnique({ where: { token } });

    if (!reset || reset.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Update password in user table
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user=await prisma.user.findUnique({
      where:{email:reset.email}
    })

    if(user){
      await prisma.user.update({
        where: { email: reset.email },
        data: { password: hashedPassword },
      });
  
    }
    else{
      return NextResponse.json({ error: "User not found" });
    }


    // Clean up token
    await prisma.passwordReset.delete({ where: { token } });

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
