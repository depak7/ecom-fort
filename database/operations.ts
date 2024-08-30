import { prisma } from './index';
import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client'; // Add this import
import generateUniqueId from './uniqueID';


//for creating a new user
export const createUser = async (email: string, name: string, password: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const uniqueId = await generateUniqueId()
  const newUser = await prisma.user.create({
    data: {
      id: uniqueId,
      email,
      name,
      password: hashedPassword,
      role: role as UserRole
    }
  });
  return { 
    statusCode: 200, 
    message: "User created successfully", 
    user: newUser 
  };
}