import { ObjectId } from 'mongodb'
import database from '../configs/database.js'
import dotenv from 'dotenv'
dotenv.config()

class UserRepo {
  constructor() {
    this.db = database.db.collection(process.env.DB_USERS_COLLECTION)
  }

  // async init() {
  //   await database.connect()
  //   this.db = database.getInstance()
  // }

  // get collection() {
  //   return this.db.collection(process.env.DB_USERS_COLLECTION)
  // }

  async getAllUsers() {
    return await this.db.find().toArray()
  }

  async findByEmail(email) {
    return await this.db.findOne({ email })
  }

  async findByEmailAndPassword({ email, password }) {
    return await this.db.findOne({ email, password })
  }

  async findById(userId) {
    return await this.db.findOne({ _id: new ObjectId(userId) })
  }

  async createUser(userData) {
    const result = await this.db.insertOne(userData)
    return result
  }

  async updateShipInfo(userID, phoneNumber, address) {
    return await this.db.updateOne(
      { _id: new ObjectId(userID) },
      {
        $set: {
          phone: phoneNumber,
          location: address,
          updated_at: new Date()
        }
      }
    )
    
  }
}

const userRepo = new UserRepo()
// await userRepo.init()
export default userRepo
