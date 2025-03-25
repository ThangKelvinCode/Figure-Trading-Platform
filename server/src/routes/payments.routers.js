import { Router } from 'express'
import { paymentController } from '../controllers/payments.controllers.js'
import { wrapAsync } from '../utils/handler.js'
import { verifyToken } from '../middlewares/auth.middlewares.js';

const paymentRouter = Router()
paymentRouter.use(verifyToken);

paymentRouter.post(
    '/create_momo/:orderId',
    /*  #swagger.tags = ['Payment']
        #swagger.description = 'Create a Momo payment request for an order'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['orderId'] = {
          in: 'path',
          description: 'Order ID',
          required: true,
          type: 'string',
          example: '67e2a3737ebda3d4a7ecf599'
        }
        #swagger.responses[200] = {
          description: "Momo payment created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  partnerCode: { type: "string", example: "MOMO" },
                  orderId: { type: "string", example: "67e2a3737ebda3d4a7ecf599" },
                  requestId: { type: "string", example: "67e2a3737ebda3d4a7ecf599" },
                  amount: { type: "integer", example: 100000 },
                  responseTime: { type: "integer", example: 1742912168957 },
                  message: { type: "string", example: "Thành công." },
                  resultCode: { type: "integer", example: 0 },
                  payUrl: { type: "string", example: "https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3w2N2UyYTM3MzdlYmRhM2Q0YTdlY2Y1OTk&s=aa2635f297048e83d2200e3c63b56c43ef835608bf3e03165b895a3bd3022c81" },
                  shortLink: { type: "string", example: "https://test-payment.momo.vn/shortlink/WXdzvTB7G2" }
                }
              }
            }
          }
        }
        #swagger.responses[400] = {
          description: "Bad Request - Invalid order ID or missing parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Invalid order ID" }
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
        #swagger.responses[500] = {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Internal server error" }
                }
              }
            }
          }
        }
    */
    wrapAsync(paymentController.createMomo)
  )

paymentRouter.post(
  '/check_momo_status',
  /*  
    #swagger.tags = ['Payment']
    #swagger.summary = 'Check status'
    #swagger.description = 'Check MoMo payment status'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["orderId"],
                    properties: {
                        orderId: { type: "string", example: "67af6d45efd963779dfa5f84" }
                    }
                }
            }
        }
    }
    */
  wrapAsync(paymentController.checkStatusMomo)
)

paymentRouter.post('/create_zaloPay', wrapAsync(paymentController.createZaloPay))

paymentRouter.post('zaloPay_callback', paymentController.zaloPayCallback)

paymentRouter.post('/check_zaloPay_status', wrapAsync(paymentController.checkStatusZaloPay))

export default paymentRouter
