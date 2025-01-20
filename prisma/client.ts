import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};
