import { checkSchema } from 'express-validator';
import { validate } from '../utils/validation.js';
import { TRADE_REQUESTS_MESSAGES } from '../constants/messages.js';

const requestItemSchema = {
  notEmpty: {
    errorMessage: TRADE_REQUESTS_MESSAGES.ITEM_MUST_HAVE_NAME,
  },
  isString: {
    errorMessage: 'Request item must be a string',
  },
};

const requestDescriptionSchema = {
  notEmpty: {
    errorMessage: 'Request description is required',
  },
  isString: {
    errorMessage: 'Request description must be a string',
  },
};

const requestImageSchema = {
  notEmpty: {
    errorMessage: 'Request image is required',
  },
  isURL: {
    errorMessage: 'Request image must be a valid URL',
  },
};

const userIdSchema = {
  notEmpty: {
    errorMessage: 'User ID is required',
  },
  isMongoId: {
    errorMessage: 'User ID is invalid',
  },
};

export const createTradeRequestValidator = validate(
  checkSchema(
    {
      requestItem: requestItemSchema,
      requestDescription: requestDescriptionSchema,
      requestImage: requestImageSchema,
      userId: userIdSchema,
    },
    ['body']
  )
);

export const updateTradeRequestValidator = validate(
  checkSchema(
    {
      requestItem: requestItemSchema,
      requestDescription: requestDescriptionSchema,
      requestImage: requestImageSchema,
    },
    ['body']
  )
);