import { validate } from '../utils/validation.js'
import { checkSchema } from 'express-validator'

const AccessoriesValidator = validate(
  checkSchema(
    {
      type: {
        notEmpty: {
          errorMessage: 'Type is required'
        }
      },
      name: {
        notEmpty: {
          errorMessage: 'Name is required'
        }
      },
      description: {
        notEmpty: {
          errorMessage: 'Description is required'
        }
      },
      price: {
        notEmpty: {
          errorMessage: 'Price is required'
        },
        isNumeric: {
          errorMessage: 'Price must be a number'
        }
      },
      photo: {
        notEmpty: {
          errorMessage: 'Photo is required'
        }
      },
      owner: {
        notEmpty: {
          errorMessage: 'Owner is required'
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
          errorMessage: 'Type is required'
        }
      },
      description: {
        notEmpty: {
          errorMessage: 'Description is required'
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