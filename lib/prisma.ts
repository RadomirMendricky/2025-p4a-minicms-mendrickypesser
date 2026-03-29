import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || (() => {
  const url = process.env.DATABASE_URL || "file:./dev.db"
  if (url.startsWith("file:") || url.startsWith("libsql:")) {
    const adapter = new PrismaLibSql({ url })
    return new PrismaClient({ adapter })
  }
  
  const pool = new Pool({ connectionString: url, ssl: true })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
})()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
