import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config() // Load environment variables

const uri = process.env.MONGO_URI
// const client = new MongoClient(uri)
// const db = client.db(`${process.env.DB_NAME}`)

class Database {
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(`${process.env.DB_NAME}`)
  }

  async connect() {
    try {
      // await this.client.connect() // Connect to MongoDB
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('Database connection error:', error)
      throw error
    }
  }

  // getInstance() {
  //   if (!this.db) {
  //     throw new Error('Database not connected. Call connect() first.')
  //   }
  //   return this.db
  // }
}

// Export an instance of the Database class
const database = new Database()
export default database
// export { db, connect }
