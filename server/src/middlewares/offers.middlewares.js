import { checkSchema } from 'express-validator';
import { validate } from '../utils/validation.js';
import { OFFER_MESSAGES } from '../constants/messages.js';

const offerItemSchema = {
  notEmpty: {
    errorMessage: OFFER_MESSAGES.OFFER_ITEM_REQUIRED,
  },
  isString: {
    errorMessage: OFFER_MESSAGES.OFFER_ITEM_MUST_BE_STRING,
  },
};

const offerDescriptionSchema = {
  notEmpty: {
    errorMessage: OFFER_MESSAGES.OFFER_DESCRIPTION_REQUIRED,
  },
  isString: {
    errorMessage: OFFER_MESSAGES.OFFER_DESCRIPTION_MUST_BE_STRING,
  },
};

const offerImageSchema = {
  notEmpty: {
    errorMessage: OFFER_MESSAGES.OFFER_IMAGE_REQUIRED,
  },
  isURL: {
    errorMessage: OFFER_MESSAGES.OFFER_IMAGE_INVALID_URL,
  },
};

// const requesterIdSchema = {
//   notEmpty: {
//     errorMessage: OFFER_MESSAGES.REQUESTER_ID_REQUIRED,
//   },
//   isMongoId: {
//     errorMessage: OFFER_MESSAGES.REQUESTER_ID_INVALID,
//   },
// };

// const requestIdSchema = {
//   notEmpty: {
//     errorMessage: OFFER_MESSAGES.REQUEST_ID_REQUIRED,
//   },
//   isMongoId: {
//     errorMessage: OFFER_MESSAGES.REQUEST_ID_INVALID,
//   },
// };

// const offerStatusSchema = {
//   notEmpty: {
//     errorMessage: OFFER_MESSAGES.OFFER_STATUS_REQUIRED,
//   },
//   isIn: {
//     options: [['Pending', 'Accepted', 'Rejected', 'Completed']],
//     errorMessage: OFFER_MESSAGES.OFFER_STATUS_INVALID,
//   },
// };

export const createOfferValidator = validate(
  checkSchema(
    {
      offerItem: offerItemSchema,
      offerDescription: offerDescriptionSchema,
      offerImage: offerImageSchema,
    //   requesterId: requesterIdSchema,
    //   requestId: requestIdSchema,
    //   offerStatus: offerStatusSchema,
    },
    ['body']
  )
);

export const updateOfferValidator = validate(
  checkSchema(
    {
      offerItem: offerItemSchema,
      offerDescription: offerDescriptionSchema,
      offerImage: offerImageSchema,
      // You might want to add validation for other updatable fields here
    },
    ['body']
  )
);