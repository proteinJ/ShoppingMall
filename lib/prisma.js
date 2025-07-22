import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// globalThis.prisma가 이미 있으면 그걸 쓰고, 없으면 새로 생성
const prismaClient = globalForPrisma.prisma || new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

export default prismaClient;