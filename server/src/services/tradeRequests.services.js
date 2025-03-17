import { ObjectId } from 'mongodb'
import TradeRequest from '../models/schemas/Request.schema.js'
import mediasServices from './medias.sevices.js'
import requestRepo from '../repositories/requests.repo.js'

//lấy toàn bộ request lên để làm list
const getAllRequests = async () => {
  // const tradeRequest = await databaseServices.tradeRequests.find().toArray()
  const request = await requestRepo.getAll()
  return request
}

// tạo request mới
const createRequest = async (payload) => {
  // const result = await databaseServices.tradeRequests.insertOne(
  const result = await requestRepo.insertRequest(
    new TradeRequest({
      ...payload
    })
  )
  return result
}

// sửa thông tin reqquest
const updateRequest = (reqId, data) => {
  const result = requestRepo.update(reqId, data)
  return result
  //nên trả lỗi khi ko update đc
}

// sửa status reqquest
const updateStatus = (reqId, data) => {
  const result = requestRepo.update(reqId, data)
  return result
  //nên trả lỗi khi ko update đc
}

export const tradeRequestServices = {
  getAllRequests,
  createRequest,
  updateRequest,
  updateStatus
}
