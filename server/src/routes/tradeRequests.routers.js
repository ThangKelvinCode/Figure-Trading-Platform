import express from 'express'
import { Router } from 'express'
import { wrapAsync } from '../utils/handler.js'
import { tradeRequestsController } from '../controllers/tradeRequests.controllers.js'
import { createTradeRequestsValidate } from '../middlewares/tradeRequest.middlewares.js'
//tạo Router
const tradeRequestsRouter = Router()

/*
    description: get all trade requests
    path: /trades
    method: GET
*/
tradeRequestsRouter.get('/list', wrapAsync(tradeRequestsController.getAllRequests))

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
  //createTradeRequestsValidate,
  wrapAsync(tradeRequestsController.createRequest)
)

export default tradeRequestsRouter
