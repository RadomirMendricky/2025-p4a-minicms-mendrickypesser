import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var _prismaClient: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL || "file:./dev.db"

  if (url.startsWith("file:") || url.startsWith("libsql:")) {
    const adapter = new PrismaLibSql({ url })
    return new PrismaClient({ adapter })
  }

  const pool = new Pool({ connectionString: url, ssl: true })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// Lazy singleton – client is only created when first accessed, NOT at import time.
// This prevents Vercel build failures when DATABASE_URL is not available at compile time.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!global._prismaClient) {
      global._prismaClient = createPrismaClient()
    }
    const value = (global._prismaClient as any)[prop]
    if (typeof value === "function") {
      return value.bind(global._prismaClient)
    }
    return value
  },
})
