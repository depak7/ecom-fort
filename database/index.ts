import { PrismaClient } from '@prisma/client';

// Function to create a new PrismaClient instance
const prismaClientSingleton = (url: string) => {
  return new PrismaClient({
    datasources: { db: { url } },
  });
};

// Declare globals for development mode to avoid re-instantiating
declare global {
  var prisma: PrismaClient | undefined;
  var readOnlyPrisma: PrismaClient | undefined;
}

// Create PrismaClient instances
export const prisma =
  process.env.NODE_ENV === 'production'
    ? prismaClientSingleton(process.env.DATABASE_URL!) // Create new instance for production
    : globalThis.prisma ?? prismaClientSingleton(process.env.DATABASE_URL!); // Use singleton in dev

const readOnlyPrisma =
  process.env.NODE_ENV === 'production'
    ? prismaClientSingleton(process.env.REPLICA_DATABASE_URL!) // New instance for production
    : globalThis.readOnlyPrisma ?? prismaClientSingleton(process.env.REPLICA_DATABASE_URL!); // Singleton in dev

// Assign to global in development to avoid re-creating instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
  globalThis.readOnlyPrisma = readOnlyPrisma;
}

export default prisma;
export { readOnlyPrisma };
