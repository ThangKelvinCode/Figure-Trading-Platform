import express from 'express';
import { Router } from 'express';
import { wrapAsync } from '../utils/handler.js';
// import { sendMessageValidator } from '../middlewares/messages.middlewares.js';
import { messagesController } from '../controllers/messages.controller.js';

const messagesRouter = Router();

// // API để lưu tin nhắn
// messagesRouter.post('/', wrapAsync(messagesController.sendMessage));

// // API để lấy lịch sử chat của một trade
// messagesRouter.get('/:tradeId', wrapAsync(messagesController.getMessagesByTradeId));


messagesRouter.post(
    '/',
    /*  #swagger.tags = ['Messages']
        #swagger.description = 'Send a new message'
        #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["tradeId", "senderId", "receiverId", "message"],
                properties: {
                  tradeId: { type: "string", example: "67d11022275b3dc778a0417b" },
                  senderId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                  receiverId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                  message: { type: "string", example: "Hello, I like your offer!" }
                }
              }
            }
          }
        }
        #swagger.responses[201] = {
          description: "Message sent successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "67d11022275b3dc778a0417d" },
                  tradeId: { type: "string", example: "67d11022275b3dc778a0417b" },
                  senderId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                  receiverId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                  message: { type: "string", example: "Hello, I like your offer!" },
                  createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                }
              }
            }
          }
        }
        #swagger.responses[500] = {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Internal server error" }
                }
              }
            }
          }
        }
    */
    wrapAsync(messagesController.sendMessage)
  );
  
  messagesRouter.get(
    '/:tradeId',
    /*  #swagger.tags = ['Messages']
        #swagger.description = 'Get messages by trade ID'
        #swagger.parameters['tradeId'] = {
          in: 'path',
          description: 'Trade ID',
          required: true,
          type: 'string',
          example: '67d11022275b3dc778a0417b'
        }
        #swagger.responses[200] = {
          description: "List of messages retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "67d11022275b3dc778a0417d" },
                    tradeId: { type: "string", example: "67d11022275b3dc778a0417b" },
                    senderId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                    receiverId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                    message: { type: "string", example: "Hello, I like your offer!" },
                    createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                  }
                }
              }
            }
          }
        }
        #swagger.responses[500] = {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Internal server error" }
                }
              }
            }
          }
        }
    */
    wrapAsync(messagesController.getMessagesByTradeId)
  );

export default messagesRouter;