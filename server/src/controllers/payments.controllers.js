import HTTP_STATUS from '../constants/httpStatus.js'
import { PAYMENT_MESSAGES } from '../constants/messages.js'
import orders from '../models/schemas/Orders.schema.js'
import { orderServices } from '../services/orders.services.js'
import { paymentServices } from '../services/payments.services.js'

const createMomo = async (req, res) => {
  try {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    const { orderId } = req.params

    const orderdata = await orderServices.getOrder(orderId)

    const result = await paymentServices.createMomo({
      orderId: orderId, amount: orderdata.total_price
    })

    res.status(HTTP_STATUS.CREATED).json(result.data)
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }

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
