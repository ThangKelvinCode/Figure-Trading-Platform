import dotenv from 'dotenv'
import crypto from 'crypto'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import moment from 'moment'
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

const createMomo = async ({ amount, orderId }) => {
  const accessKey = process.env.MOMO_ACCESS_KEY
  const secretKey = process.env.MOMO_SECRET_KEY
  const orderInfo = 'pay with MoMo'
  const partnerCode = process.env.MOMO_PARTNER_CODE
  const redirectUrl = process.env.REDIRECT_URL
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

const checkStatusMomo = async (orderId) => {
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

const createZaloPay = async ({ amount, orderId }) => {
  // APP INFO
  const config = {
    app_id: process.env.ZLPAY_APP_ID,
    key1: process.env.ZLPAY_KEY_1,
    key2: process.env.ZLPAY_KEY_2,
    endpoint: `${process.env.ZLPAY_PAYMENT_API}/create`
  }

  const embed_data = {
    redirectUrl: process.env.REDIRECT_URL
  }

  const items = [{}]
  const transID = orderId //Math.floor(Math.random() * 1000000)
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: 'user123',
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `Payment for the order #${transID}`,
    bank_code: ''
    // callbackUrl: 'localhost:3000/payment/zaloPay_callback'
  }

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    '|' +
    order.app_trans_id +
    '|' +
    order.app_user +
    '|' +
    order.amount +
    '|' +
    order.app_time +
    '|' +
    order.embed_data +
    '|' +
    order.item

  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

  const result = await axios.post(config.endpoint, null, { params: order }) // còn cần code sử lí lỗi, có vẻ nên xài handleAxios

  return result
}

const zaloPayCallback = (req) => {
  const config = {
    key2: process.env.ZLPAY_KEY_2
  }

  let result = {}

  try {
    let dataStr = req.body.data
    let reqMac = req.body.mac

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString()
    console.log('mac =', mac)

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1
      result.return_message = 'mac not equal'
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2)
      console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id'])

      result.return_code = 1
      result.return_message = 'success'
    }
  } catch (ex) {
    result.return_code = 0 // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message
  }

  return result

  // thông báo kết quả cho ZaloPay server
  // res.json(result);
}

const checkStatusZaloPay = async (appTransId) => {
  const config = {
    app_id: process.env.ZLPAY_APP_ID,
    key1: process.env.ZLPAY_KEY_1,
    key2: process.env.ZLPAY_KEY_2,
    endpoint: `${process.env.ZLPAY_PAYMENT_API}/query`
  }

  let postData = {
    app_id: config.app_id,
    app_trans_id: appTransId // Input your app_trans_id
  }

  let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1 // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

  let postConfig = {
    method: 'post',
    url: config.endpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
  }

  const result = await handleAxios(postConfig)

  return result
}

export const paymentServices = {
  createMomo,
  checkStatusMomo,
  createZaloPay,
  zaloPayCallback,
  checkStatusZaloPay
}
