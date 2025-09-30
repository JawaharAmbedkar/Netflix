// packages/db/client.ts
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  // Prevent multiple instances of Prisma Client in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  prisma = global.prisma ?? new PrismaClient()
  global.prisma = prisma
}

export default prisma
