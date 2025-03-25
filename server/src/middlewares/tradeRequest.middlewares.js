import { checkSchema } from 'express-validator'
import { TRADE_REQUESTS_MESSAGES } from '../constants/messages.js'
import { validate } from '../utils/validation.js'

const requestItemSchema = {
  notEmpty: {
    errorMessage: TRADE_REQUESTS_MESSAGES.ITEM_IS_REQUIRED
  },
  isString: {
    errorMessage: TRADE_REQUESTS_MESSAGES.ITEM_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: TRADE_REQUESTS_MESSAGES.ITEM_LENGTH_MUST_BE_FROM_1_TO_100
  }
}

export const createTradeRequestsValidate = validate(
  checkSchema(
    {
      request_item: requestItemSchema
    },
    ['body']
  )
)
export const updateTradeRequestsValidate = validate(
  checkSchema(
    {
      request_item: requestItemSchema
    },
    ['body']
  )
)
