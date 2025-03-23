import { ObjectId } from 'mongodb'
import database from '../configs/database.js'
import dotenv from 'dotenv'
dotenv.config()

class RequestRepo {
  constructor() {
    this.db = database.db.collection(process.env.DB_REQUESTS_COLLECTION)
  }

  //   async init() {
  //     await database.connect()
  //     this.db = database.getInstance()
  //   }

  //   get collection() {
  //     return this.db.collection(process.env.DB_REQUESTS_COLLECTION)
  //   }

  async getAll() {
    return await this.db.find().toArray()
  }

  async getById(id) {
    return await this.db.findOne({ _id: new ObjectId(id) })
  }

  async insertRequest(requestData) {
    const result = await this.db.insertOne(requestData)
    return result
  }
}

const requestRepo = new RequestRepo()
// await tradeRequestRepo.init()
export default requestRepo
