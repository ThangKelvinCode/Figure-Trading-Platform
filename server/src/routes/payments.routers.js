import { Router } from 'express'
import QueryString from 'qs'
import crypto from 'crypto'
import dateFormat from 'dateformat'

const paymentRouter = Router()

paymentRouter.post('/create_payment', async (req, res, next) => {
  var ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  // var tmnCode = process.env.VNP_TMNCODE
  // var secretKey = process.env.VNP_HASHSECRET
  // var vnpUrl = process.env.VNP_URL
  // var returnUrl = process.env.VNP_RETURNURL
  // var date = new Date()
  // var createDate = dateFormat(date, 'yyyymmddHHmmss')
  // var orderId = req.orderId
  // var amount = req.body.amount
  // var bankCode = req.body.bankCode
  // var orderInfo = req.body.orderDescription
  // var orderType = req.body.orderType
  // var locale = req.body.language
  // if (locale === null || locale === '') {
  //   locale = 'vn'
  // }
  // var currCode = 'VND'
  // var vnp_Params = {}
  // vnp_Params['vnp_Version'] = '2.1.0'
  // vnp_Params['vnp_Command'] = 'pay'
  // vnp_Params['vnp_TmnCode'] = tmnCode.toString()
  // // vnp_Params['vnp_Merchant'] = ''
  // vnp_Params['vnp_Locale'] = locale
  // vnp_Params['vnp_CurrCode'] = currCode
  // vnp_Params['vnp_TxnRef'] = orderId
  // vnp_Params['vnp_OrderInfo'] = orderInfo
  // vnp_Params['vnp_OrderType'] = orderType
  // vnp_Params['vnp_Amount'] = amount * 100
  // vnp_Params['vnp_ReturnUrl'] = returnUrl.toString()
  // vnp_Params['vnp_IpAddr'] = ipAddr
  // vnp_Params['vnp_CreateDate'] = createDate
  // if (bankCode !== null && bankCode !== '') {
  //   vnp_Params['vnp_BankCode'] = bankCode
  // }
  // vnp_Params = sortObject(vnp_Params)
  // //   var querystring = require('qs')
  // var signData = QueryString.stringify(vnp_Params, { encode: false })
  // //   var crypto = require('crypto')
  // var hmac = crypto.createHmac('sha512', secretKey.toString())
  // var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  // vnp_Params['vnp_SecureHash'] = signed
  // vnpUrl = vnpUrl.toString() + '?' + QueryString.stringify(vnp_Params, { encode: false })
  // res.redirect(vnpUrl)

  const { amount, orderId } = req.body
  const locale = req.body.language && req.body.language.trim() !== '' ? req.body.language : 'vn'
  var date = Date.now()
  const createDate = dateFormat(date, 'yyyymmddHHmmss')
  const expireDate = (Number(createDate) + 15000).toString()
  const orderInfo = 'Thanh toan mua hang'.split(' ').join('+')
  // if (locale === null || locale === '') {
  //   locale = 'vn'
  // }

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: process.env.VNP_TMNCODE.trim(),
    vnp_Amount: amount * 100,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo + orderId,
    vnp_OrderType: 'other',
    vnp_Locale: locale,
    vnp_ReturnUrl: process.env.VNP_RETURNURL,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
    // vnp_ExpireDate: expireDate
  }
  // Sort parameters
  vnp_Params = sortObject(vnp_Params)
  // Create secure hash
  const signData = QueryString.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('SHA256', process.env.VNP_HASHSECRET)
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  vnp_Params['vnp_SecureHash'] = signed
  // Generate URL properly
  const vnpUrl = `${process.env.VNP_URL.trim()}?${QueryString.stringify(vnp_Params, { encode: false })}`
  res.json({ paymentUrl: vnpUrl })
})
// Vui lòng tham khảo thêm tại code demo

paymentRouter.get('/vnpay_ipn', function (req, res, next) {
  var vnp_Params = req.query
  var secureHash = vnp_Params['vnp_SecureHash']

  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  vnp_Params = sortObject(vnp_Params)
  var secretKey = process.env.VNP_HASHSECRET
  // var querystring = require('qs');
  var signData = QueryString.stringify(vnp_Params, { encode: false })
  // var crypto = require("crypto");
  var hmac = crypto.createHmac('sha512', secretKey)
  var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

  if (secureHash === signed) {
    var orderId = vnp_Params['vnp_TxnRef']
    var rspCode = vnp_Params['vnp_ResponseCode']
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.status(200).json({ RspCode: '00', Message: 'success' })
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
  }
})

paymentRouter.get('/vnpay_return', async (req, res, next) => {
  var vnp_Params = req.query

  var secureHash = vnp_Params['vnp_SecureHash']

  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  vnp_Params = sortObject(vnp_Params)

  var tmnCode = process.env.VNP_TMNCODE
  var secretKey = process.env.VNP_HASHSECRET

  // var querystring = require('qs');
  var signData = QueryString.stringify(vnp_Params, { encode: false })
  // var crypto = require("crypto");
  var hmac = crypto.createHmac('sha512', secretKey)
  var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

  // if (secureHash === signed) {
  //   //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

  //   res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
  // } else {
  //   res.render('success', { code: '97' })
  // }

  // const vnp_Params = req.query
  // const secureHash = vnp_Params['vnp_SecureHash']
  // delete vnp_Params['vnp_SecureHash']
  // delete vnp_Params['vnp_SecureHashType']

  // vnp_Params = sortObject(vnp_Params)
  // const signData = QueryString.stringify(vnp_Params, { encode: false })
  // const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET)
  // const signed = hmac.update(signData).digest('hex')

  if (secureHash === signed) {
    const paymentStatus = vnp_Params['vnp_ResponseCode'] === '00' ? 'Success' : 'Failed'
    res.redirect('http://localhost:5173/' + '/payment-status?status=' + paymentStatus)
  } else {
    res.status(400).json({ message: 'Invalid signature' })
  }
})

function sortObject(obj) {
  let sorted = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key]
    })
  return sorted
}

export default paymentRouter
