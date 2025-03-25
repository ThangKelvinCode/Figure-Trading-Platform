import { messagesServices } from '../services/messages.services.js';
import HTTP_STATUS from '../constants/httpStatus.js';

const sendMessage = async (req, res) => {
  try {
    const result = await messagesServices.sendMessage(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Message sent successfully',
      result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getMessagesByTradeId = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const messages = await messagesServices.getMessagesByTradeId(tradeId);
    res.status(HTTP_STATUS.OK).json(messages);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const messagesController = {
  sendMessage,
  getMessagesByTradeId,
};