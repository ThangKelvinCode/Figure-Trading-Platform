import { checkSchema } from 'express-validator';
import { validate } from '../utils/validation.js';

const messageSchema = {
  notEmpty: {
    errorMessage: 'Message content is required',
  },
  isString: {
    errorMessage: 'Message content must be a string',
  },
};

const tradeIdSchema = {
  notEmpty: {
    errorMessage: 'Trade ID is required',
  },
  isMongoId: {
    errorMessage: 'Invalid Trade ID format',
  },
};

const senderIdSchema = {
  notEmpty: {
    errorMessage: 'Sender ID is required',
  },
  isMongoId: {
    errorMessage: 'Invalid Sender ID format',
  },
};

const receiverIdSchema = {
  notEmpty: {
    errorMessage: 'Receiver ID is required',
  },
  isMongoId: {
    errorMessage: 'Invalid Receiver ID format',
  },
};

export const sendMessageValidator = validate(
  checkSchema(
    {
      tradeId: tradeIdSchema,
      senderId: senderIdSchema,
      receiverId: receiverIdSchema,
      message: messageSchema,
    },
    ['body']
  )
);