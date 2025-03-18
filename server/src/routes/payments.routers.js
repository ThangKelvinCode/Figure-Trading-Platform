import { Router } from 'express'
import { paymentController } from '../controllers/payments.controllers.js'
import { wrapAsync } from '../utils/handler.js'

const paymentRouter = Router()

paymentRouter.post('/create', wrapAsync(paymentController.create))

paymentRouter.post('/check_status', wrapAsync(paymentController.checkStatus))

export default paymentRouter
