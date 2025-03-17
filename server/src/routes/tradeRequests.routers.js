import express from 'express';
import { Router } from 'express';
import { tradeRequestsController } from '../controllers/tradeRequests.controllers.js';
import { wrapAsync } from '../utils/handler.js';
import { createTradeRequestValidator, updateTradeRequestValidator } from '../middlewares/tradeRequests.middlewares.js';
import { USER_ROLE } from '../constants/enums.js';
import { restrictTo, verifyToken } from '../middlewares/auth.middlewares.js';

const tradeRequestsRouter = Router();
tradeRequestsRouter.use(verifyToken, restrictTo(USER_ROLE.User));

// tradeRequestsRouter.post('/', createTradeRequestValidator, wrapAsync(tradeRequestsController.createTradeRequest));
// tradeRequestsRouter.get('/', wrapAsync(tradeRequestsController.getAllTradeRequests));
// tradeRequestsRouter.get('/user/:userId', wrapAsync(tradeRequestsController.getTradeRequestsByUserId));
// tradeRequestsRouter.get('/:requestId', wrapAsync(tradeRequestsController.getTradeRequestById));
// tradeRequestsRouter.put('/:requestId', updateTradeRequestValidator, wrapAsync(tradeRequestsController.updateTradeRequest));
// tradeRequestsRouter.delete('/:requestId', wrapAsync(tradeRequestsController.deleteTradeRequest));
// tradeRequestsRouter.post(
//     '/:requestId/select-offer/:offerId',
//     wrapAsync(tradeRequestsController.selectOffer)
//   );
//   tradeRequestsRouter.post('/:requestId/finish-trade', wrapAsync(tradeRequestsController.confirmFinishTrade));
//   tradeRequestsRouter.post('/:requestId/cancel-trade', wrapAsync(tradeRequestsController.cancelTrade));
//   tradeRequestsRouter.post('/:requestId/decline-offer/:offerId', wrapAsync(tradeRequestsController.declineOffer));

tradeRequestsRouter.post(
  '/',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Create a new trade request'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["requestItem", "requestDescription", "requestImage"],
              properties: {
                requestItem: { type: "string", example: "Baby Three Blindbox" },
                requestDescription: { type: "string", example: "A cute blindbox with baby three theme" },
                requestImage: { type: "string", example: "https://example.com/babythree.jpg" }
              }
            }
          }
        }
      }
      #swagger.responses[201] = {
        description: "Trade request created successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Create request successfully" },
                result: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "67d11022275b3dc778a0417b" },
                    requestItem: { type: "string", example: "Baby Three Blindbox" },
                    requestDescription: { type: "string", example: "A cute blindbox with baby three theme" },
                    requestImage: { type: "string", example: "https://example.com/babythree.jpg" },
                    userId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                    requestStatus: { type: "string", example: "Pending" },
                    createdAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" },
                    updatedAt: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z" }
                  }
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
  createTradeRequestValidator,
  wrapAsync(tradeRequestsController.createTradeRequest)
);

tradeRequestsRouter.get(
  '/',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Get all trade requests'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.responses[200] = {
        description: "List of all trade requests retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "67d11022275b3dc778a0417b" },
                  requestItem: { type: "string", example: "Baby Three Blindbox" },
                  requestDescription: { type: "string", example: "A cute blindbox with baby three theme" },
                  requestImage: { type: "string", example: "https://example.com/babythree.jpg" },
                  userId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                  requestStatus: { type: "string", example: "Pending" },
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
  wrapAsync(tradeRequestsController.getAllTradeRequests)
);

tradeRequestsRouter.get(
  '/user/:userId',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Get trade requests by user ID'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['userId'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string',
        example: '67d52b3c60c67cabfd83d7fd'
      }
      #swagger.responses[200] = {
        description: "List of trade requests by user retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "67d11022275b3dc778a0417b" },
                  requestItem: { type: "string", example: "Baby Three Blindbox" },
                  requestDescription: { type: "string", example: "A cute blindbox with baby three theme" },
                  requestImage: { type: "string", example: "https://example.com/babythree.jpg" },
                  userId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                  requestStatus: { type: "string", example: "Pending" },
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
  wrapAsync(tradeRequestsController.getTradeRequestsByUserId)
);

tradeRequestsRouter.get(
  '/:requestId',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Get trade request by ID'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['requestId'] = {
        in: 'path',
        description: 'Request ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417b'
      }
      #swagger.responses[200] = {
        description: "Trade request retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                _id: { type: "string", example: "67d11022275b3dc778a0417b" },
                requestItem: { type: "string", example: "Baby Three Blindbox" },
                requestDescription: { type: "string", example: "A cute blindbox with baby three theme" },
                requestImage: { type: "string", example: "https://example.com/babythree.jpg" },
                userId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                requestStatus: { type: "string", example: "Pending" },
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
  wrapAsync(tradeRequestsController.getTradeRequestById)
);

tradeRequestsRouter.put(
  '/:requestId',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Update trade request by ID'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['requestId'] = {
        in: 'path',
        description: 'Request ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417b'
      }
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                requestItem: { type: "string", example: "Updated Baby Three Blindbox" },
                requestDescription: { type: "string", example: "An updated cute blindbox with baby three theme" },
                requestImage: { type: "string", example: "https://example.com/updated-babythree.jpg" }
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        description: "Trade request updated successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                _id: { type: "string", example: "67d11022275b3dc778a0417b" },
                requestItem: { type: "string", example: "Updated Baby Three Blindbox" },
                requestDescription: { type: "string", example: "An updated cute blindbox with baby three theme" },
                requestImage: { type: "string", example: "https://example.com/updated-babythree.jpg" },
                userId: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                requestStatus: { type: "string", example: "Pending" },
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
  updateTradeRequestValidator,
  wrapAsync(tradeRequestsController.updateTradeRequest)
);

tradeRequestsRouter.delete(
  '/:requestId',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Delete trade request by ID'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['requestId'] = {
        in: 'path',
        description: 'Request ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417b'
      }
      #swagger.responses[200] = {
        description: "Trade request deleted successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Trade request deleted successfully" }
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
  wrapAsync(tradeRequestsController.deleteTradeRequest)
);

tradeRequestsRouter.post(
  '/:requestId/select-offer/:offerId',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Select an offer for a trade request'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['requestId'] = {
        in: 'path',
        description: 'Request ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417b'
      }
      #swagger.parameters['offerId'] = {
        in: 'path',
        description: 'Offer ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417c'
      }
      #swagger.responses[200] = {
        description: "Offer selected and trade process started",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Offer selected and trade process started" }
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
  wrapAsync(tradeRequestsController.selectOffer)
);

tradeRequestsRouter.post(
  '/:requestId/finish-trade',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Confirm finish trade'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['requestId'] = {
        in: 'path',
        description: 'Request ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417b'
      }
      #swagger.responses[200] = {
        description: "Trade completed or waiting for confirmation",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Trade completed successfully" }
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
  wrapAsync(tradeRequestsController.confirmFinishTrade)
);

tradeRequestsRouter.post(
  '/:requestId/cancel-trade',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Cancel a trade'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['requestId'] = {
        in: 'path',
        description: 'Request ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417b'
      }
      #swagger.responses[200] = {
        description: "Trade canceled successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Trade canceled successfully, request is now open for new offers" }
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
  wrapAsync(tradeRequestsController.cancelTrade)
);

tradeRequestsRouter.post(
  '/:requestId/decline-offer/:offerId',
  /*  #swagger.tags = ['Trade Requests']
      #swagger.description = 'Decline an offer for a trade request'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['requestId'] = {
        in: 'path',
        description: 'Request ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417b'
      }
      #swagger.parameters['offerId'] = {
        in: 'path',
        description: 'Offer ID',
        required: true,
        type: 'string',
        example: '67d11022275b3dc778a0417c'
      }
      #swagger.responses[200] = {
        description: "Offer declined successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Offer declined successfully" }
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
  wrapAsync(tradeRequestsController.declineOffer)
);

  export default tradeRequestsRouter;

