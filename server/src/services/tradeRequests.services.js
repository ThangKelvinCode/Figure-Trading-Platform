import { ObjectId } from 'mongodb';
import TradeRequest from '../models/schemas/traderequest.schema.js';
import tradeRequestRepo from '../repositories/tradeRequests.repo.js';
import offerRepo from '../repositories/offers.repo.js'; // Để kiểm tra offer
import { OfferStatus, TradeRequestStatus } from '../constants/enums.js';

const createTradeRequest = async (payload) => {
  try {
    if (!ObjectId.isValid(payload.userId)) {
      throw new Error('Invalid User ID format');
    }

    const newTradeRequest = {
      _id: new ObjectId(),
      requestItem: payload.requestItem,
      requestDescription: payload.requestDescription,
      requestImage: payload.requestImage,
      userId: new ObjectId(payload.userId),
      requestStatus: TradeRequestStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await tradeRequestRepo.insert(newTradeRequest);
    return newTradeRequest;
  } catch (error) {
    console.error('Error creating trade request:', error);
    throw error;
  }
};

const getAllTradeRequests = async () => {
  try {
    const tradeRequests = await tradeRequestRepo.getAll();
    return tradeRequests;
  } catch (error) {
    console.error('Error getting all trade requests:', error);
    throw error;
  }
};

const getTradeRequestsByUserId = async (userId) => {
  try {
    const tradeRequests = await tradeRequestRepo.getByUserId(userId);
    return tradeRequests;
  } catch (error) {
    console.error('Error getting trade requests by user ID:', error);
    throw error;
  }
};

const getTradeRequestById = async (requestId) => {
  try {
    const tradeRequest = await tradeRequestRepo.getByRequestId(requestId);
    return tradeRequest;
  } catch (error) {
    console.error('Error getting trade request by ID:', error);
    throw error;
  }
};

const updateTradeRequest = async (requestId, updates) => {
  try {
    const result = await tradeRequestRepo.updateByRequestId(requestId, updates);
    return result.value;
  } catch (error) {
    console.error('Error updating trade request:', error);
    throw error;
  }
};

const deleteTradeRequest = async (requestId) => {
  try {
    const result = await tradeRequestRepo.deleteByRequestId(requestId);
    return result;
  } catch (error) {
    console.error('Error deleting trade request:', error);
    throw error;
  }
};

// Kiểm tra và chọn offer (thêm logic sau)
const selectOffer = async (requestId, offerId, userId) => {
  try {
    const tradeRequest = await tradeRequestRepo.getByRequestId(requestId);
    if (!tradeRequest || tradeRequest.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized or trade request not found');
    }

    // Kiểm tra số lượng offer hiện tại cho request
    const existingOffers = await offerRepo.getAllByRequestId(requestId);
    if (existingOffers.length === 0) {
      throw new Error('No offers available');
    }

    // Kiểm tra xem đã có offer nào được Accepted chưa
    const acceptedOffer = existingOffers.find(offer => offer.offerStatus === OfferStatus.Accepted);
    if (acceptedOffer) {
      throw new Error('An offer has already been accepted for this request');
    }

    // Cập nhật status của trade request thành In-process
    await tradeRequestRepo.updateByRequestId(requestId, {
      requestStatus: TradeRequestStatus.InProcess,
    });

    // Cập nhật offer được chọn thành Accepted
    await offerRepo.updateByOfferId(offerId, { offerStatus: OfferStatus.Accepted });

    // Hủy các offer khác
    for (const offer of existingOffers) {
      if (offer._id.toString() !== offerId) {
        await offerRepo.updateByOfferId(offer._id.toString(), { offerStatus: OfferStatus.Declined });
      }
    }

    return { message: 'Offer selected and trade process started' };
  } catch (error) {
    console.error('Error selecting offer:', error);
    throw error;
  }
};

const confirmFinishTrade = async (requestId, userId) => {
  try {
    const tradeRequest = await tradeRequestRepo.getByRequestId(requestId);
    if (!tradeRequest) {
      throw new Error('Trade request not found');
    }

    // Tìm offer có status Accepted
    const offers = await offerRepo.getAllByRequestId(requestId);
    const selectedOffer = offers.find(offer => offer.offerStatus === OfferStatus.Accepted);
    if (!selectedOffer) {
      throw new Error('No accepted offer found for this trade');
    }

    // Kiểm tra quyền xác nhận
    const requesterId = tradeRequest.userId.toString();
    const selectedTraderId = selectedOffer.userId.toString();

    if (userId !== requesterId && userId !== selectedTraderId) {
      throw new Error('Unauthorized: You are not part of this trade');
    }

    // Cập nhật trạng thái xác nhận
    let confirmationStatus = { ...tradeRequest.confirmationStatus };
    if (userId === requesterId) {
      confirmationStatus.requesterConfirmed = true;
    } else if (userId === selectedTraderId) {
      confirmationStatus.selectedTraderConfirmed = true;
    }

    // Lưu trạng thái xác nhận
    await tradeRequestRepo.updateConfirmationStatus(requestId, confirmationStatus);

    // Kiểm tra xem cả hai đã xác nhận chưa
    if (confirmationStatus.requesterConfirmed && confirmationStatus.selectedTraderConfirmed) {
      // Cập nhật status của TradeRequest và Offer
      await tradeRequestRepo.updateByRequestId(requestId, {
        requestStatus: TradeRequestStatus.Completed,
      });
      await offerRepo.updateByOfferId(selectedOffer._id.toString(), {
        offerStatus: OfferStatus.Completed,
      });
      return { message: 'Trade completed successfully' };
    }

    return { message: 'Waiting for the other trader to confirm' };
  } catch (error) {
    console.error('Error confirming finish trade:', error);
    throw error;
  }
};

const cancelTrade = async (requestId, userId) => {
  try {
    const tradeRequest = await tradeRequestRepo.getByRequestId(requestId);
    if (!tradeRequest) {
      throw new Error('Trade request not found');
    }

    // Tìm offer có status Accepted
    const offers = await offerRepo.getAllByRequestId(requestId);
    const selectedOffer = offers.find(offer => offer.offerStatus === OfferStatus.Accepted);
    if (!selectedOffer) {
      throw new Error('No accepted offer found for this trade');
    }

    // Kiểm tra quyền hủy
    const requesterId = tradeRequest.userId.toString();
    const selectedTraderId = selectedOffer.userId.toString();

    if (userId !== requesterId && userId !== selectedTraderId) {
      throw new Error('Unauthorized: You are not part of this trade');
    }

    // Cập nhật status của TradeRequest thành Pending
    await tradeRequestRepo.updateByRequestId(requestId, {
      requestStatus: TradeRequestStatus.Pending,
      confirmationStatus: { requesterConfirmed: false, selectedTraderConfirmed: false },
    });

    // Cập nhật status của Offer hiện tại thành Declined
    await offerRepo.updateByOfferId(selectedOffer._id.toString(), {
      offerStatus: OfferStatus.Declined,
    });

    // Cập nhật các Offer khác từ Declined thành Pending
    for (const offer of offers) {
      if (offer._id.toString() !== selectedOffer._id.toString() && offer.offerStatus === OfferStatus.Declined) {
        await offerRepo.updateByOfferId(offer._id, {
          offerStatus: OfferStatus.Pending,
        });
      }
    }

    return { message: 'Trade canceled successfully, request is now open for new offers' };
  } catch (error) {
    console.error('Error canceling trade:', error);
    throw error;
  }
};

const declineOffer = async (requestId, offerId, userId) => {
  try {
    const tradeRequest = await tradeRequestRepo.getByRequestId(requestId);
    if (!tradeRequest) {
      throw new Error('Trade request not found');
    }

    // Kiểm tra quyền từ chối (chỉ trader gửi yêu cầu mới có quyền)
    if (tradeRequest.userId.toString() !== userId) {
      throw new Error('Unauthorized: Only the requester can decline offers');
    }

    const offer = await offerRepo.getByOfferId(offerId);
    if (!offer || offer.requestId.toString() !== requestId) {
      throw new Error('Offer not found or does not belong to this request');
    }

    // Cập nhật status của Offer thành Declined
    await offerRepo.updateByOfferId(offerId, {
      offerStatus: OfferStatus.Declined,
    });

    return { message: 'Offer declined successfully' };
  } catch (error) {
    console.error('Error declining offer:', error);
    throw error;
  }
};

export const tradeRequestsServices = {
  createTradeRequest,
  getAllTradeRequests,
  getTradeRequestsByUserId,
  getTradeRequestById,
  updateTradeRequest,
  deleteTradeRequest,
  selectOffer,
  confirmFinishTrade, 
  cancelTrade, 
  declineOffer, 
};