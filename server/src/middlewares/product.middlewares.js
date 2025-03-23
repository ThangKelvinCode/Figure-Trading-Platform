import { validate } from '../utils/validation.js'
import { checkSchema } from 'express-validator'
import { PRODUCT_MESSAGE } from '../constants/messages.js'
const AccessoriesValidator = validate(
  checkSchema(
    {
      type: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_TYPE
        }
      },
      name: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_NAME
        }
      },
      description: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_DESCRIPTION
        }
      },
      price: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_PRICE
        },
        isNumeric: {
          errorMessage: PRODUCT_MESSAGE.INVALID_PRICE
        }
      },
      photo: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_PHOTO
        }
      },
      owner: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_OWNER
        }
      }
    },
    ['body']
  )
)

const CategoriesValidator = validate(
  checkSchema(
    {
      type: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_TYPE
        }
      },
      description: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.EMPTY_DESCRIPTION
        }
      }
    },
    ['body']
  )
)

export const productValidator = {
  CategoriesValidator,
  AccessoriesValidator
}
