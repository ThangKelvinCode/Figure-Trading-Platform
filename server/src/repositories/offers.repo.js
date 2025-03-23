import { ObjectId } from 'mongodb'
import database from '../configs/database.js'
import dotenv from 'dotenv'
dotenv.config()

class OfferRepo {
  constructor() {
    this.db = database.db.collection('offers')
  }

  //   async init() {
  //     await database.connect()
  //     this.db = database.getInstance()
  //   }

  //   get collection() {
  //     return this.db.collection('offers')
  //   }

  async getAll() {
    return await this.db.find().toArray()
  }

  async getAllByRequestId(requestId) {
    return await this.db.find({ requestId: new ObjectId(requestId) }).toArray()
  }

  async getByOfferId(offerId) {
    return await this.db.findOne({ _id: new ObjectId(offerId) })
  }

  async updateByOfferId(offerId, updates) {
    return await this.db.findOneAndUpdate(
      { _id: new ObjectId(offerId) },
      {
        $set: { ...updates, updatedAt: new Date() } // Update updatedAt, keep createdAt unchanged
      },
      { returnDocument: 'after' } // Return the updated document
    )
  }

  async insert(offerData) {
    return (result = await this.db.insertOne(offerData))
  }
}

const offerRepo = new OfferRepo()
// await offerRepo.init()
export default offerRepo
