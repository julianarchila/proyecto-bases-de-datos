import { env } from '@/env'
import postgres from 'postgres'

// Create a single postgres instance with connection pooling
// This will reuse connections instead of creating new ones for each query
const sql = postgres(env.DB_CONNECTION_STRING, {
  // Connection pool configuration
  max: 10,          // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  max_lifetime: 60 * 30, // Close connections after 30 minutes
})

export const getDB = () => {
  return {
    sql
  }
}

// Export the sql instance directly for convenience
export { sql }
