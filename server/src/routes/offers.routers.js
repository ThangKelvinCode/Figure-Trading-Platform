import express from 'express';
import { Router } from 'express';
import { offersController } from '../controllers/offers.controllers.js';
import { wrapAsync } from '../utils/handler.js';
import { createOfferValidator } from '../middlewares/offers.middlewares.js';
import { verifyToken } from '../middlewares/auth.middlewares.js';

const offersRouter = Router();
offersRouter.use(verifyToken);

// offersRouter.post('/', createOfferValidator, wrapAsync(offersController.createOffer));
// offersRouter.get('/request/:requestId', wrapAsync(offersController.getAllOffersByRequestId)); // Changed route
// offersRouter.get('/', wrapAsync(offersController.getAllOffers)); // Route to get all offers
// offersRouter.get('/:offerId', wrapAsync(offersController.getOfferByOfferId)); // Route to get offer by ID
// offersRouter.put('/:id', wrapAsync(offersController.updateOfferByOfferId));
// offersRouter.put('/:offerId/status', wrapAsync(offersController.updateOfferStatus));
// // offersRouter.patch('/:offerId/status', wrapAsync(offersController.updateOfferStatus));
// offersRouter.patch('/:offerId/status/:offerStatus', wrapAsync(offersController.updateOfferStatus));

offersRouter.post(
    '/',
    /*  #swagger.tags = ['Offers']
        #swagger.description = 'Create a new offer for a trade request'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["offerItem", "offerDescription", "offerImage", "requestId"],
                properties: {
                  offerItem: { type: "string", example: "Lalabu Blindbox" },
                  offerDescription: { type: "string", example: "A cool lalabu blindbox" },
                  offerImage: { type: "string", example: "https://example.com/lalabu.jpg" },
                  requestId: { type: "string", example: "67d11022275b3dc778a0417b" }
                }
              }
            }
          }
        }
        #swagger.responses[201] = {
          description: "Offer created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "67d11022275b3dc778a0417c" },
                  offerItem: { type: "string", example: "Lalabu Blindbox" },
                  offerDescription: { type: "string", example: "A cool lalabu blindbox" },
                  offerImage: { type: "string", example: "https://example.com/lalabu.jpg" },
                  userId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                  requestId: { type: "string", example: "67d11022275b3dc778a0417b" },
                  offerStatus: { type: "string", example: "Pending" },
                  createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" },
                  updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                }
              }
            }
          }
        }
        #swagger.responses[401] = {
          description: "Unauthorized - Access token is required or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Access token is required" }
                }
              }
            }
          }
        }
    */
    createOfferValidator,
    wrapAsync(offersController.createOffer)
  );
  
  offersRouter.get(
    '/request/:requestId',
    /*  #swagger.tags = ['Offers']
        #swagger.description = 'Get all offers by request ID'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['requestId'] = {
          in: 'path',
          description: 'Request ID',
          required: true,
          type: 'string',
          example: '67d11022275b3dc778a0417b'
        }
        #swagger.responses[200] = {
          description: "List of offers retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "67d11022275b3dc778a0417c" },
                    offerItem: { type: "string", example: "Lalabu Blindbox" },
                    offerDescription: { type: "string", example: "A cool lalabu blindbox" },
                    offerImage: { type: "string", example: "https://example.com/lalabu.jpg" },
                    userId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                    requestId: { type: "string", example: "67d11022275b3dc778a0417b" },
                    offerStatus: { type: "string", example: "Pending" },
                    createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" },
                    updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                  }
                }
              }
            }
          }
        }
        #swagger.responses[401] = {
          description: "Unauthorized - Access token is required or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Access token is required" }
                }
              }
            }
          }
        }
    */
    wrapAsync(offersController.getAllOffersByRequestId)
  );
  
  offersRouter.get(
    '/',
    /*  #swagger.tags = ['Offers']
        #swagger.description = 'Get all offers'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.responses[200] = {
          description: "List of all offers retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "67d11022275b3dc778a0417c" },
                    offerItem: { type: "string", example: "Lalabu Blindbox" },
                    offerDescription: { type: "string", example: "A cool lalabu blindbox" },
                    offerImage: { type: "string", example: "https://example.com/lalabu.jpg" },
                    userId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                    requestId: { type: "string", example: "67d11022275b3dc778a0417b" },
                    offerStatus: { type: "string", example: "Pending" },
                    createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" },
                    updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                  }
                }
              }
            }
          }
        }
        #swagger.responses[401] = {
          description: "Unauthorized - Access token is required or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Access token is required" }
                }
              }
            }
          }
        }
    */
    wrapAsync(offersController.getAllOffers)
  );
  
  offersRouter.get(
    '/:offerId',
    /*  #swagger.tags = ['Offers']
        #swagger.description = 'Get offer by ID'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['offerId'] = {
          in: 'path',
          description: 'Offer ID',
          required: true,
          type: 'string',
          example: '67d11022275b3dc778a0417c'
        }
        #swagger.responses[200] = {
          description: "Offer retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "67d11022275b3dc778a0417c" },
                  offerItem: { type: "string", example: "Lalabu Blindbox" },
                  offerDescription: { type: "string", example: "A cool lalabu blindbox" },
                  offerImage: { type: "string", example: "https://example.com/lalabu.jpg" },
                  userId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                  requestId: { type: "string", example: "67d11022275b3dc778a0417b" },
                  offerStatus: { type: "string", example: "Pending" },
                  createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" },
                  updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                }
              }
            }
          }
        }
        #swagger.responses[401] = {
          description: "Unauthorized - Access token is required or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Access token is required" }
                }
              }
            }
          }
        }
    */
    wrapAsync(offersController.getOfferByOfferId)
  );
  
  offersRouter.put(
    '/:id',
    /*  #swagger.tags = ['Offers']
        #swagger.description = 'Update offer by ID'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['id'] = {
          in: 'path',
          description: 'Offer ID',
          required: true,
          type: 'string',
          example: '67d11022275b3dc778a0417c'
        }
        #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  offerItem: { type: "string", example: "Updated Lalabu Blindbox" },
                  offerDescription: { type: "string", example: "An updated cool lalabu blindbox" },
                  offerImage: { type: "string", example: "https://example.com/updated-lalabu.jpg" }
                }
              }
            }
          }
        }
        #swagger.responses[200] = {
          description: "Offer updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "67d11022275b3dc778a0417c" },
                  offerItem: { type: "string", example: "Updated Lalabu Blindbox" },
                  offerDescription: { type: "string", example: "An updated cool lalabu blindbox" },
                  offerImage: { type: "string", example: "https://example.com/updated-lalabu.jpg" },
                  userId: { type: "string", example: "67d52a5a26375738eb1f4325" },
                  requestId: { type: "string", example: "67d11022275b3dc778a0417b" },
                  offerStatus: { type: "string", example: "Pending" },
                  createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" },
                  updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                }
              }
            }
          }
        }
        #swagger.responses[401] = {
          description: "Unauthorized - Access token is required or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Access token is required" }
                }
              }
            }
          }
        }
    */
    wrapAsync(offersController.updateOfferByOfferId)
  );
  
  offersRouter.put(
    '/:offerId/status',
    /*  #swagger.tags = ['Offers']
        #swagger.description = 'Update offer status by ID'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['offerId'] = {
          in: 'path',
          description: 'Offer ID',
          required: true,
          type: 'string',
          example: '67d11022275b3dc778a0417c'
        }
        #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["offerStatus"],
                properties: {
                  offerStatus: { type: "string", example: "Accepted" }
                }
              }
            }
          }
        }
        #swagger.responses[200] = {
          description: "Offer status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Offer status updated successfully" }
                }
              }
            }
          }
        }
        #swagger.responses[401] = {
          description: "Unauthorized - Access token is required or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Access token is required" }
                }
              }
            }
          }
        }
    */
    wrapAsync(offersController.updateOfferStatus)
  );
  
  offersRouter.patch(
    '/:offerId/status/:offerStatus',
    /*  #swagger.tags = ['Offers']
        #swagger.description = 'Update offer status by ID and status value'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['offerId'] = {
          in: 'path',
          description: 'Offer ID',
          required: true,
          type: 'string',
          example: '67d11022275b3dc778a0417c'
        }
        #swagger.parameters['offerStatus'] = {
          in: 'path',
          description: 'New status for the offer',
          required: true,
          type: 'string',
          example: 'Accepted'
        }
        #swagger.responses[200] = {
          description: "Offer status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Offer status updated successfully" }
                }
              }
            }
          }
        }
        #swagger.responses[401] = {
          description: "Unauthorized - Access token is required or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Access token is required" }
                }
              }
            }
          }
        }
    */
    wrapAsync(offersController.updateOfferStatus)
  );

  offersRouter.get('/user/:userId', verifyToken, offersController.getOffersByUser);
  


export default offersRouter;