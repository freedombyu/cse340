const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * Configure for both development and production
 * *************** */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "development" 
    ? { rejectUnauthorized: false } 
    : { rejectUnauthorized: true }
})

// Enhanced query method with better error handling
module.exports = {
  async query(text, params) {
    try {
      const start = Date.now()
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      console.log('executed query', { 
        text, 
        params, 
        duration: `${duration}ms`,
        rows: res.rowCount 
      })
      return res
    } catch (error) {
      console.error("Database Query Error", { 
        text, 
        params, 
        error: error.message 
      })
      throw error
    }
  },
  
  // Add a connection test method
  async testConnection() {
    try {
      const client = await pool.connect()
      console.log('Database connection successful')
      client.release()
      return true
    } catch (err) {
      console.error('Database connection failed', err)
      return false
    }
  }
}