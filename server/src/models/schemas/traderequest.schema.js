import { ObjectId } from 'mongodb';
import { TradeRequestStatus } from '../../constants/enums.js';


export default class TradeRequest {
  constructor(request) {
    this._id = request._id || new ObjectId();
    this.requestItem = request.requestItem;
    this.requestDescription = request.requestDescription;
    this.requestImage = request.requestImage;
    this.userId = request.userId;
    this.requestStatus = request.requestStatus || TradeRequestStatus.Pending;
    this.confirmationStatus = request.confirmationStatus || {
      requesterConfirmed: false,
      selectedTraderConfirmed: false,
    };
    this.createdAt = request.createdAt || new Date();
    this.updatedAt = request.updatedAt || new Date();
  }
}