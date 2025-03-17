import { ObjectId } from 'mongodb'
import { TradeRequestStatus } from '../../constants/enums.js'

export default class TradeRequest {
  constructor(tradeRequest) {
    this._id = tradeRequest._id || new ObjectId() // tạo mới thì tự tạo id
    this.offer_id = tradeRequest.request_id || [] //đăng request lên thì chưa có
    this.user_id = tradeRequest.user_id
    this.request_item = tradeRequest.request_item
    this.description = tradeRequest.description || ''
    this.image = tradeRequest.image || ''
    this.status = tradeRequest.status || TradeRequestStatus.Pending //đăng request thì để pending
    this.createdAt = tradeRequest.createdAt || new Date()
    this.updatedAt = tradeRequest.updatedAt || new Date()
  }
}
