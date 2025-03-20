import { ObjectId } from 'mongodb';

export default class Message {
  constructor(message) {
    this._id = message._id || new ObjectId();
    this.tradeId = message.tradeId; // ID của phiên giao dịch (trade)
    this.senderId = message.senderId;
    this.receiverId = message.receiverId;
    this.message = message.message;
    this.timestamp = message.timestamp || new Date();
  }
}