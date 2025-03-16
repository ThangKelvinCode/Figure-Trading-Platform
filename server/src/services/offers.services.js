import { ObjectId } from 'mongodb'
import Offer from '../models/schemas/Offers.schema.js'
import databaseServices from './database.services.js'
import offerRepo from '../repositories/offers.repo.js'
import { OfferStatus } from '../constants/enums.js'

// const createOffer = async (payload) => {
//   let offerId = new ObjectId()
//   let userId = new ObjectId()
//   let requestId = new ObjectId()
//   try {
//     const newOffer = new Offer({
//       _id: offerId,
//       ...payload,
//     //   requesterId: new ObjectId(payload.requesterId),
//     //   requestId: new ObjectId(payload.requestId),
//       requesterId: new ObjectId(), // Generate random ObjectId
//       requestId: new ObjectId(), // Generate random ObjectId
//       offerStatus: 'Pending',
//     });

//     const result = await databaseServices.offers.insertOne(newOffer);
//     return result;
//   } catch (error) {
//     console.error('Error creating offer:', error);
//     throw error;
//   }
// };

const createOffer = async (payload) => {
  const existingOffers = await offerRepo.getAllByRequestId(payload.requestId);
  const offersByUser = existingOffers.filter(offer => offer.userId.toString() === payload.userId);
  if (offersByUser.length > 0) {
    throw new Error('Only one offer per request is allowed per user');
  } {
  try {
    console.log('Received payload:', payload)

    // Ensure that requesterId and requestId are valid ObjectId
    if (!ObjectId.isValid(payload.userId) || !ObjectId.isValid(payload.requestId)) {
      throw new Error('Invalid User ID or Request ID format');
    }

    const newOffer = {
      _id: new ObjectId(),
      offerItem: payload.offerItem,
      offerDescription: payload.offerDescription,
      offerImage: payload.offerImage,
      userId: new ObjectId(payload.userId),
      requestId: new ObjectId(payload.requestId),
      offerStatus: OfferStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Prepared Offer Object:', newOffer)

    // const result = await databaseServices.offers.insertOne(newOffer);
    const result = await offerRepo.insert(newOffer);
    return newOffer;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
}
}

const getAllOffersByRequestId = async (requestId) => {
  try {
    // const offers = await databaseServices.offers.find({ requestId: new ObjectId(requestId) }).toArray()
    const offers = await offerRepo.getAllByRequestId(requestId)
    return offers
  } catch (error) {
    console.error('Error getting offers by request ID:', error)
    throw error
  }
}

const getAllOffers = async () => {
  try {
    // const offers = await databaseServices.offers.find({}).toArray() // Find all offers
    const offers = await offerRepo.getAll() // Find all offers
    return offers
  } catch (error) {
    console.error('Error getting all offers:', error)
    throw error
  }
}

//   const getUserProfile = async (userId) => {
//     try {
//         return databaseServices.users.findOne({ _id: new ObjectId(userId) })
//     } catch (error) { throw new Error(error) }
// }

// Add a new function getOfferByOfferId to retrieve an offer by its ID
const getOfferByOfferId = async (offerId) => {
  try {
    // const offer = await databaseServices.offers.findOne({ _id: new ObjectId(offerId) })
    const offer = await offerRepo.getByOfferId(offerId)
    return offer
  } catch (error) {
    console.error('Error getting offer by offer ID:', error)
    throw error
  }
}

// const getRequestByOfferId = async (offerId) => {
//   try {
//     const offer = await offerRepo.getByOfferId(offerId); // Get the offer
//     if (!offer) {
//       return null; // Offer not found
//     }
//     const request = await requestRepo.getByRequestId(offer.requestId); // Get the request
//     return request;
//   } catch (error) {
//     console.error('Error getting request by offer ID:', error);
//     throw error;
//   }
// };

const updateOfferByOfferId = async (offerId, updates) => {
  try {
    const result = await offerRepo.updateByOfferId(offerId, updates)
    return result.value // Extract the updated document from the result
  } catch (error) {
    console.error('Error updating offer by offer ID:', error)
    throw error
  }
}

const updateOfferStatus = async (offerId, newStatus) => {
  try {
    const result = await offerRepo.updateOfferStatus(offerId, newStatus);
    return result;
  } catch (error) {
    console.error('Error updating offer status:', error);
    throw error;
  }
};

export const offersServices = {
  createOffer,
  getAllOffersByRequestId,
  getAllOffers,
  getOfferByOfferId,
  updateOfferByOfferId,
  updateOfferStatus
}
