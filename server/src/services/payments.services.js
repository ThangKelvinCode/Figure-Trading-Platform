import dotenv from 'dotenv'
import crypto from 'crypto'
import axios from 'axios'
import { ErrorWithStatus } from '../models/Errors.js'
import HTTP_STATUS from '../constants/httpStatus.js'
import { PAYMENT_MESSAGES } from '../constants/messages.js'

dotenv.config()

const handleAxios = async (options) => {
  const result = await axios(options)
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: PAYMENT_MESSAGES.PAYMENT_ERROR
    })
  }
  return result
}

const create = async ({ amount, orderId }) => {
  const accessKey = process.env.MOMO_ACCESS_KEY
  const secretKey = process.env.MOMO_SECRET_KEY
  const orderInfo = 'pay with MoMo'
  const partnerCode = process.env.MOMO_PARTNER_CODE
  const redirectUrl = process.env.MOMO_REDIRECT_URL
  const ipnUrl = process.env.MOMO_RETURN_URL
  const requestType = 'payWithMethod'
  //   const amount = amount
  // var orderId = partnerCode + new Date().getTime()
  const requestId = orderId
  const extraData = ''
  //   var paymentCode =
  //     "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
  const orderGroupId = ''
  const autoCapture = true
  const lang = 'vi'

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  const rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType
  //puts raw signature
  // console.log("--------------------RAW SIGNATURE----------------");
  // console.log(rawSignature);
  //signature
  //   const crypto = require("crypto");
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
  // console.log("--------------------SIGNATURE----------------");
  // console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  })
  //options for axios
  const options = {
    method: 'POST',
    url: `${process.env.MOMO_PAYMENT_API}/create`,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  }
  // console.log(options);

  const result = await handleAxios(options)

  return result
}

const checkStatus = async (orderId) => {
  //parameters
  const accessKey = process.env.MOMO_ACCESS_KEY
  const secretKey = process.env.MOMO_SECRET_KEY
  const partnerCode = process.env.MOMO_PARTNER_CODE
  const requestId = orderId
  const lang = 'vi'

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode&requestId=$requestId
  const rawSignature =
    'accessKey=' + accessKey + '&orderId=' + orderId + '&partnerCode=' + partnerCode + '&requestId=' + requestId

  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    requestId: requestId,
    orderId: orderId,
    lang: lang,
    signature: signature
  })

  //options for axios
  const options = {
    method: 'POST',
    url: `${process.env.MOMO_PAYMENT_API}/query`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: requestBody
  }
  // console.log(options);

  const result = await handleAxios(options)

  return result
}

export const paymentServices = {
  create,
  checkStatus
}
