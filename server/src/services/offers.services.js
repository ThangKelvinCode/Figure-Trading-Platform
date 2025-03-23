import { ObjectId } from 'mongodb'
import Offer from '../models/schemas/Offers.schema.js'
import databaseServices from './database.services.js'
import offerRepo from '../repositories/offers.repo.js'

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
  try {
    console.log('Received payload:', payload)

    // Ensure that requesterId and requestId are valid ObjectId
    if (!ObjectId.isValid(payload.requesterId) || !ObjectId.isValid(payload.requestId)) {
      throw new Error('Invalid ObjectId format for requesterId or requestId')
    }

    const newOffer = {
      _id: new ObjectId(),
      offerItem: payload.offerItem,
      offerDescription: payload.offerDescription,
      offerImage: payload.offerImage,
      requesterId: new ObjectId(payload.requesterId), // Expecting valid ObjectId from request
      requestId: new ObjectId(payload.requestId), // Expecting valid ObjectId from request
      offerStatus: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Prepared Offer Object:', newOffer)

    // const result = await databaseServices.offers.insertOne(newOffer);
    const result = await offerRepo.insert(newOffer)
    return result
  } catch (error) {
    console.error('Error creating offer:', error)
    throw error
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

const updateOfferByOfferId = async (offerId, updates) => {
  try {
    const result = await offerRepo.updateByOfferId(offerId, updates)
    return result.value // Extract the updated document from the result
  } catch (error) {
    console.error('Error updating offer by offer ID:', error)
    throw error
  }
}

export const offersServices = {
  createOffer,
  getAllOffersByRequestId,
  getAllOffers,
  getOfferByOfferId,
  updateOfferByOfferId
}
