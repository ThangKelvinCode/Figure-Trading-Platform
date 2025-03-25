import { offersServices } from '../services/offers.services.js';
import { OFFER_MESSAGES } from '../constants/messages.js';
import HTTP_STATUS from '../constants/httpStatus.js';

const createOffer = async (req, res) => {
  try {
    const result = await offersServices.createOffer(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: OFFER_MESSAGES.CREATE_OFFER_SUCCESS,
      result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllOffersByRequestId = async (req, res) => {
    try {
      const requestId = req.params.requestId; // Get requestId from the URL parameters
      const offers = await offersServices.getAllOffersByRequestId(requestId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getAllOffers = async (req, res) => {
    try {
      const offers = await offersServices.getAllOffers();
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getOfferByOfferId = async (req, res) => {
    try {
      const offerId = req.params.offerId; // Get offerId from the URL parameters
      const offer = await offersServices.getOfferByOfferId(offerId);
      res.status(200).json(offer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateOfferByOfferId = async (req, res) => {
    try {
      const offerId = req.params.id; // Get offerId from the URL parameters
      console.log('offerId from params:', offerId); // Log the offerId
      const updates = req.body; // Get the updates from the request body
      const updatedOffer = await offersServices.updateOfferByOfferId(offerId, updates);
      res.status(200).json(updatedOffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // const updateOfferStatus = async (req, res) => {
  //   try {
  //     const offerId = req.params.offerId;
  //     const newStatus = req.body.offerStatus; // Get the new status from the request body
  //     const updatedOffer = await offersServices.updateOfferStatus(offerId, newStatus);
  //     if (updatedOffer) {
  //       res.status(200).json(updatedOffer.value);
  //     } else {
  //       res.status(404).json({ message: 'Offer not found' });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };

  const updateOfferStatus = async (req, res) => {
    try {
      const offerId = req.params.offerId;
      const newStatus = req.params.offerStatus; // Get the new status from the URL parameters
      const updatedOffer = await offersServices.updateOfferStatus(offerId, newStatus);
      if (updatedOffer) {
        res.status(200).json(updatedOffer.value);
      } else {
        res.status(404).json({ message: 'Offer not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
export const offersController = {
  createOffer,
  getAllOffersByRequestId,
  getAllOffers,
  getOfferByOfferId,
  updateOfferByOfferId,
  updateOfferStatus
};