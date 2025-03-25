import { ObjectId } from 'mongodb';
import database from '../configs/database.js';

class MessageRepo {
  constructor() {
    this.db = database.db.collection('messages');
  }

  async insert(messageData) {
    const result = await this.db.insertOne(messageData);
    return result;
  }

  async getByTradeId(tradeId) {
    return await this.db.find({ tradeId: new ObjectId(tradeId) }).sort({ createdAt: 1 }).toArray();
  }
}

const messageRepo = new MessageRepo();
export default messageRepo;