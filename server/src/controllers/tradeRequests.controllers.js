import { tradeRequestsServices } from '../services/tradeRequests.services.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import { TRADE_REQUESTS_MESSAGES } from '../constants/messages.js';

const createTradeRequest = async (req, res) => {
  try {
    const result = await tradeRequestsServices.createTradeRequest(req.body, req.user.user_id);
    res.status(HTTP_STATUS.CREATED).json({
      message: TRADE_REQUESTS_MESSAGES.CREATE_REQUEST_SUCCESSFULLY,
      result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllTradeRequests = async (req, res) => {
  try {
    const tradeRequests = await tradeRequestsServices.getAllTradeRequests();
    res.status(HTTP_STATUS.OK).json(tradeRequests);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getTradeRequestsByUserId = async (req, res) => {
  try {
    const tradeRequests = await tradeRequestsServices.getTradeRequestsByUserId(req.user.user_id);
    res.status(HTTP_STATUS.OK).json(tradeRequests);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getTradeRequestById = async (req, res) => {
  try {
    const tradeRequest = await tradeRequestsServices.getTradeRequestById(req.params.requestId);
    res.status(HTTP_STATUS.OK).json(tradeRequest);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};


const updateTradeRequest = async (req, res) => {
  try {
    const result = await tradeRequestsServices.updateTradeRequest(req.params.requestId, req.body);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Trade request not found' });
    }
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const deleteTradeRequest = async (req, res) => {
  try {
    const result = await tradeRequestsServices.deleteTradeRequest(req.params.requestId);
    if (result.deletedCount === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Trade request not found' });
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Trade request deleted successfully' });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const selectOffer = async (req, res) => {
  try {
    const { requestId, offerId } = req.params;
    const userId = req.user.user_id;
    const result = await tradeRequestsServices.selectOffer(requestId, offerId, userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const confirmFinishTrade = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.user_id;
    const result = await tradeRequestsServices.confirmFinishTrade(requestId, userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const cancelTrade = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.user_id;
    const result = await tradeRequestsServices.cancelTrade(requestId, userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const declineOffer = async (req, res) => {
  try {
    const { requestId, offerId } = req.params;
    const userId = req.user.user_id;
    const result = await tradeRequestsServices.declineOffer(requestId, offerId, userId); // Loại bỏ req.io
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    console.error('Error declining offer:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const updateRequest = async (req, res) => {
  // get reqId from URL
  const reqId = req.params.reqId
  // get request body
  const data = req.body
  //
  const updateRequest = await tradeRequestServices.updateRequest(reqId, data)
  res.status(HTTP_STATUS.OK).json({
    message: TRADE_REQUESTS_MESSAGES.UPDATE_REQUEST_SUCCESSFULLY,
    result: updateRequest
  })
}

const updateStatus = async (req, res) => {
  // get reqId from URL
  const reqId = req.params.reqId
  // get request body
  const data = req.body
  //
  const updateRequest = await tradeRequestServices.updateStatus(reqId, data)
  res.status(HTTP_STATUS.OK).json({
    message: TRADE_REQUESTS_MESSAGES.UPDATE_REQUEST_SUCCESSFULLY,
    result: updateRequest
  })
}

export const tradeRequestsController = {
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
