import { Router } from 'express'
import { paymentController } from '../controllers/payments.controllers.js'
import { wrapAsync } from '../utils/handler.js'
import { verifyToken } from '../middlewares/auth.middlewares.js';

const paymentRouter = Router()
paymentRouter.use(verifyToken);

paymentRouter.post(
  '/create_momo',
  /*  
    #swagger.tags = ['Payment']
    #swagger.summary = 'Create MOMO payment'
    #swagger.description = 'Creates a new MOMO payment'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["amount", "orderId"],
                    properties: {
                        amount: { type: "number", example: "10000" },
                        orderId: { type: "string", example: "67af6d45efd963779dfa5f84" }
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
