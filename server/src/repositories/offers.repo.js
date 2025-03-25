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
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' } // Ensure the updated document is returned
    );
  }
  async updateOfferStatus(offerId, newStatus) {
    return await this.db.findOneAndUpdate(
      { _id: new ObjectId(offerId) },
      { $set: { offerStatus: newStatus, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
  }

  async insert(offerData) {
    const result = await this.db.insertOne(offerData); // Assign the result to the variable
    return result; // Return the result object
  }
}

const offerRepo = new OfferRepo()
// await offerRepo.init()
export default offerRepo
