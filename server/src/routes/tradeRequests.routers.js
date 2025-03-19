import express from 'express'
import { Router } from 'express'
import { wrapAsync } from '../utils/handler.js'
import { tradeRequestsController } from '../controllers/tradeRequests.controllers.js'
import { createTradeRequestsValidate, updateTradeRequestsValidate } from '../middlewares/tradeRequest.middlewares.js'
//tạo Router
const tradeRequestsRouter = Router()

/*
    description: get all trade requests
    path: /trades
    method: GET
*/
tradeRequestsRouter.get(
  '/list',
  /*  #swagger.tags = ['Requests']
        #swagger.summary = 'Get all requests'
        #swagger.description = 'Retrieves a list of all available request'
        #swagger.responses[200] = { description: "List of requests retrieved successfully" }
    */
  wrapAsync(tradeRequestsController.getAllRequests)
)

/*
    description: create a trade request
    path: /create
    method: POST
    body: {
        user_id
        request_item
        description
        image
    }
*/
tradeRequestsRouter.post(
  '/create',
  /*  #swagger.tags = ['Requests']
        #swagger.summary = 'Create a new Request'
        #swagger.description = 'Creates a new Request
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["type", "description"],
                        properties: {
                            user_id: { type: "string", example: "67af6d45efd963779dfa5f84" }
                            request_item: { type: "string", example: "abcd" }
                            description: { type: "string", example: "This item is ..." }
                            image: { type: "string", example: "" }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = { description: "Request created successfully" }
        #swagger.responses[400] = { description: "Invalid request" }
    */
  //createTradeRequestsValidate,
  wrapAsync(tradeRequestsController.createRequest)
)

/*
    description: update a trade request
    path: /update/{reqId}
    method: PUT
    body: {
        offer_id
        user_id
        request_item
        description
        image
        status
    }
*/
tradeRequestsRouter.put('/update/:reqId', updateTradeRequestsValidate, wrapAsync(tradeRequestsController.updateRequest))

/*
    description: update a trade request status
    path: /update/{reqId}
    method: Patch
    body: {
        status
    }
*/
tradeRequestsRouter.patch('/update/:reqId/status', wrapAsync(tradeRequestsController.updateStatus))
export default tradeRequestsRouter
