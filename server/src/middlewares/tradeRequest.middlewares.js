import { checkSchema } from 'express-validator'
import { TRADE_REQUESTS_MESSAGES } from '../constants/messages.js'
import { validate } from '../utils/validation.js'

export const createTradeRequestsValidate = validate(
  checkSchema(
    {
      request_item: {
        notEmpty: {
          errorMessage: TRADE_REQUESTS_MESSAGES.ITEM_MUST_HAVE_NAME
        }
      }
    },
    ['body']
  )
)
