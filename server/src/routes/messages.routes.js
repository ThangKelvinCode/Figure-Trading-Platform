import express from 'express';
import { Router } from 'express';
import { wrapAsync } from '../utils/handler.js';
// import { sendMessageValidator } from '../middlewares/messages.middlewares.js';
import { messagesController } from '../controllers/messages.controller.js';

const messagesRouter = Router();

// API để lưu tin nhắn
messagesRouter.post('/', wrapAsync(messagesController.sendMessage));

// API để lấy lịch sử chat của một trade
messagesRouter.get('/:tradeId', wrapAsync(messagesController.getMessagesByTradeId));

export default messagesRouter;