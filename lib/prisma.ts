// Prisma client - requires DATABASE_URL at runtime
let prisma: any

try {
  const { PrismaClient } = require('@prisma/client')
  const globalForPrisma = globalThis as any
  prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch {
  // Will fail at build time without DB - works at runtime
  prisma = null
}

export { prisma }
