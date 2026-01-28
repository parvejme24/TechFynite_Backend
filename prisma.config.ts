import { PrismaClient } from '@prisma/client'

// Prisma configuration and utilities

// Database connection configuration
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

export const prismaConfig = {
  // Generator configuration (can be moved from schema.prisma if preferred)
  generator: {
    client: {
      provider: 'prisma-client-js',
      previewFeatures: [], // Add preview features here if needed
    },
  },
}

// Try to use adapter approach if available, fallback to direct connection
let prismaClientConfig: any = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
}

let pool: any = null

try {
  // Dynamic import for adapter packages (they may not be installed yet)
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  prismaClientConfig = {
    ...prismaClientConfig,
    adapter,
  }

  console.log('✅ Using Prisma PostgreSQL adapter')
} catch (error) {
  // Fallback to direct connection (for environments where adapter isn't available)
  prismaClientConfig = {
    ...prismaClientConfig,
    datasources: {
      db: {
        url: connectionString,
      },
    },
  }

  console.log('⚠️  Using direct database connection (Prisma adapter not available)')
}

// Prisma client instance
export const prisma = new PrismaClient(prismaClientConfig)

// Helper functions for database operations
export class PrismaHelpers {
  private client: PrismaClient
  private dbPool: any

  constructor(client: PrismaClient = prisma, dbPool: any = pool) {
    this.client = client
    this.dbPool = dbPool
  }

  // Health check for database connection
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }

  // Get database connection info
  async getConnectionInfo() {
    try {
      const result = await this.client.$queryRaw<{ version: string }[]>`
        SELECT version() as version
      `
      return {
        connected: true,
        version: result[0]?.version,
        database: connectionString?.split('/').pop()?.split('?')[0],
        adapter: 'postgresql',
      }
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        adapter: 'postgresql',
      }
    }
  }

  // Transaction helper
  async transaction<T>(callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>): Promise<T> {
    return this.client.$transaction(callback)
  }

  // Clean up connections
  async disconnect(): Promise<void> {
    await this.client.$disconnect()
    if (this.dbPool) {
      await this.dbPool.end()
    }
  }

  // Reconnect to database
  async reconnect(): Promise<void> {
    await this.client.$connect()
  }

  // Get pool statistics
  getPoolStats() {
    if (!this.dbPool) {
      return {
        message: 'Pool not available (using direct connection)',
        totalCount: 0,
        idleCount: 0,
        waitingCount: 0,
      }
    }

    return {
      totalCount: this.dbPool.totalCount,
      idleCount: this.dbPool.idleCount,
      waitingCount: this.dbPool.waitingCount,
    }
  }
}

// Export singleton instance
export const dbHelpers = new PrismaHelpers()

// Export prisma client instance
export default prisma

// Type helpers for better TypeScript support
export type { PrismaClient } from '@prisma/client'

// Utility types
export type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>

// Environment-specific configurations
export const getPrismaConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const isDevelopment = process.env.NODE_ENV === 'development'

  return {
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: isDevelopment ? 'pretty' : 'minimal',
    ...prismaClientConfig,
  }
}

// Graceful shutdown helper
export const gracefulShutdown = async () => {
  console.log('Shutting down Prisma client...')
  await prisma.$disconnect()
  if (pool) {
    await pool.end()
    console.log('Database pool also disconnected')
  }
  console.log('Prisma client disconnected')
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
  process.on('beforeExit', gracefulShutdown)
}