import { prisma } from '@/database/index'; // Import the Prisma Client instance
import bcrypt from 'bcrypt';

// Define User and UserRole types based on your Prisma schema
// Replace with the actual type from your Prisma schema if available
type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

// Function to find a user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Error finding user by email');
  }
}

// Function to create a new user
export async function createUser(
  email: string,
  name: string,
  password: string,
  role: UserRole = UserRole.CUSTOMER
): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}

// ... other database operations ...
