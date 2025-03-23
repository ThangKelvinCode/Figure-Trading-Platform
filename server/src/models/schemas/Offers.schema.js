import { ObjectId } from 'mongodb';

export default class Offer {
  constructor(offer) {
    this._id = offer._id || new ObjectId();
    this.offerItem = offer.offerItem; // Name of the offered item
    this.offerDescription = offer.offerDescription; // Description of the offered item
    this.offerImage = offer.offerImage; // URL of the offered item's image
    this.requesterId = offer.requesterId; // ObjectId of the requester
    this.requestId = offer.requestId; // ObjectId of the request
    this.offerStatus = offer.offerStatus || 'Pending'; // Default status is 'Pending'
    this.createdAt = offer.createdAt || new Date();
    this.updatedAt = offer.updatedAt || new Date();
  }
}