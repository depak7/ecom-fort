'use server'

import { prisma } from "@/database/index";
import { generateUniqueId } from "@/database/uniqueID";
import bcrypt from "bcryptjs";

export async function registerUser(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Hash the password
    const id=await generateUniqueId();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        id,
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
}