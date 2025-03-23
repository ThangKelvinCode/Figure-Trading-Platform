import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
// import User from '~/models/schemas/User.schema'
// import RefreshToken from '~/models/schemas/RefreshToken.schema'
dotenv.config() //kích hoạt liên kết với .env
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shoppingcardprojectclus.xativ.mongodb.net/?retryWrites=true&w=majority&appName=shoppingCardProjectCluster`
  
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
class DatabaseServices {
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(`${process.env.DB_NAME}`)
  }
  //method
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  //ham lấy instance của collection USERS
  //accessor proberty
  get users() {
    return this.db.collection(process.env.DB_USERS_COLLECTION)
  }

  get tradeRequests() {
    return this.db.collection(process.env.DB_REQUESTS_COLLECTION)
  }

  // get blind_boxes() {
  //   return this.db.collection(process.env.DB_BLINDBOX_COLLECTION)
  // }

  get blind_boxes() {
    return this.db.collection('blind_boxes') // Or use process.env.DB_BLIND_BOXES_COLLECTION if you have it in your .env
  }

  get offers() {
    return this.db.collection('offers')
  }

  //   get refresh_tokens() {
  //     return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION)
  //   }
  get accessories() {
    return this.db.collection(process.env.DB_ACCESSORIES_COLLECTION)
  }

  get accessories_categories() {
    return this.db.collection(process.env.DB_CATEGORIES_COLLECTION)
  }
}

let databaseServices = new DatabaseServices()
export default databaseServices
