import HTTP_STATUS from '../constants/httpStatus.js'
import { PAYMENT_MESSAGES } from '../constants/messages.js'
import { paymentServices } from '../services/payments.services.js'

const createMomo = async (req, res) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  const { amount, orderId } = req.body

  const result = await paymentServices.createMomo({ amount, orderId })

  res.status(HTTP_STATUS.CREATED).json(result.data)
}

const createZaloPay = async (req, res) => {
  const { amount, orderId } = req.body

  const result = await paymentServices.createZaloPay({ amount, orderId })

  res.status(HTTP_STATUS.CREATED).json(result.data)
}

const checkStatusMomo = async (req, res) => {
  const { orderId } = req.body

  const result = await paymentServices.checkStatusMomo(orderId)

  res.status(HTTP_STATUS.OK).json(result.data)
}

const checkStatusZaloPay = async (req, res) => {
  const { appTransId } = req.body

  const result = await paymentServices.checkStatusZaloPay(appTransId)

  res.status(HTTP_STATUS.OK).json(result.data)
}

const zaloPayCallback = (req, res) => {
  const result = paymentServices.zaloPayCallback(req)
}

export const paymentController = {
  createMomo,
  checkStatusMomo,
  createZaloPay,
  zaloPayCallback,
  checkStatusZaloPay
}
