import 'dotenv/config'
import { getDB } from '../server/db/index'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function setupDatabase() {
  try {
    console.log('Setting up database...')
    
    // Read the schema file
    const schemaPath = join(__dirname, '../server/db/schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')

    const {sql} = getDB()
    
    // Execute the schema
    await sql.unsafe(schema)
    
    console.log('Database setup completed successfully!')
    
    // Close the connection
    await sql.end()
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

// Run the setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
}

export { setupDatabase }
