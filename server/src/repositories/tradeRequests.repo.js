import { ObjectId } from 'mongodb';
import database from '../configs/database.js';

class TradeRequestRepo {
  constructor() {
    this.db = database.db.collection('trade_requests');
  }

  async insert(tradeRequestData) {
    const result = await this.db.insertOne(tradeRequestData);
    return result;
  }

  async getAll() {
    return await this.db.find().toArray();
  }

  async getByUserId(userId) {
    return await this.db.find({ userId: new ObjectId(userId) }).toArray();
  }

  async getByRequestId(requestId) {
    return await this.db.findOne({ _id: new ObjectId(requestId) });
  }

  async updateByRequestId(requestId, updates) {
    return await this.db.findOneAndUpdate(
      { _id: new ObjectId(requestId) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
  }

  async updateConfirmationStatus(requestId, confirmationStatus) {
    return await this.db.findOneAndUpdate(
      { _id: new ObjectId(requestId) },
      { $set: { confirmationStatus, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
  }

  async deleteByRequestId(requestId) {
    return await this.db.deleteOne({ _id: new ObjectId(requestId) });
  }
}

const tradeRequestRepo = new TradeRequestRepo();
export default tradeRequestRepo;