import HTTP_STATUS from '../constants/httpStatus.js'
import { PAYMENT_MESSAGES } from '../constants/messages.js'
import { paymentServices } from '../services/payments.services.js'

const create = async (req, res) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  const { amount, orderId } = req.body

  const result = await paymentServices.create({ amount, orderId })

  res.status(HTTP_STATUS.OK).json(result.data)
}

const checkStatus = async (req, res, next) => {
  const { orderId } = req.body

  const result = await paymentServices.checkStatus(orderId)

  res.status(HTTP_STATUS.OK).json(result.data)
}

export const paymentController = {
  create,
  checkStatus
}
