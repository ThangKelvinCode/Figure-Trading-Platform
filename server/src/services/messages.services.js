import { ObjectId } from 'mongodb';
import Message from '../models/schemas/Message.schema.js';
import messageRepo from '../repositories/messages.repo.js';


const sendMessage = async (payload) => {
  try {
    console.log('Received payload:', payload);

    // Kiểm tra tradeId, senderId, receiverId
    if (!ObjectId.isValid(payload.tradeId) || !ObjectId.isValid(payload.senderId) || !ObjectId.isValid(payload.receiverId)) {
      throw new Error('Invalid ObjectId format for tradeId, senderId, or receiverId');
    }

    const newMessage = {
      _id: new ObjectId(),
      tradeId: new ObjectId(payload.tradeId),
      senderId: new ObjectId(payload.senderId),
      receiverId: new ObjectId(payload.receiverId),
      message: payload.message,
      createdAt: new Date(),
    };

    console.log('Prepared Message Object:', newMessage);

    const result = await messageRepo.insert(newMessage);
    return newMessage; // Trả về đối tượng tin nhắn vừa tạo
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const getMessagesByTradeId = async (tradeId) => {
  try {
    const messages = await messageRepo.getByTradeId(tradeId);
    return messages;
  } catch (error) {
    console.error('Error getting messages by trade ID:', error);
    throw error;
  }
};

export const messagesServices = {
  sendMessage,
  getMessagesByTradeId,
};