import { ObjectId } from 'mongodb';

export default class Offer {
  constructor(offer) {
    this._id = offer._id || new ObjectId();
    this.offerItem = offer.offerItem;
    this.offerDescription = offer.offerDescription;
    this.offerImage = Array.isArray(offer.offerImage) ? offer.offerImage : []
    this.userId = offer.userId; // Use userId instead of requesterId
    this.requestId = offer.requestId;
    this.offerStatus = offer.offerStatus || 'Pending'; 
    this.createdAt = offer.createdAt || new Date();
    this.updatedAt = offer.updatedAt || new Date();
  }
}