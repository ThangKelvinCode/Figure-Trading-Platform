import { tradeRequestsServices } from '../services/tradeRequests.services.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import { TRADE_REQUESTS_MESSAGES } from '../constants/messages.js';

const createTradeRequest = async (req, res) => {
  try {
    const result = await tradeRequestsServices.createTradeRequest(req.body);
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
    const userId = req.params.userId;
    const tradeRequests = await tradeRequestsServices.getTradeRequestsByUserId(userId);
    res.status(HTTP_STATUS.OK).json(tradeRequests);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getTradeRequestById = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const tradeRequest = await tradeRequestsServices.getTradeRequestById(requestId);
    if (!tradeRequest) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Trade request not found' });
    }
    res.status(HTTP_STATUS.OK).json(tradeRequest);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const updateTradeRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const updates = req.body;
    const updatedTradeRequest = await tradeRequestsServices.updateTradeRequest(requestId, updates);
    if (!updatedTradeRequest) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Trade request not found' });
    }
    res.status(HTTP_STATUS.OK).json(updatedTradeRequest);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const deleteTradeRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const result = await tradeRequestsServices.deleteTradeRequest(requestId);
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
    const userId = req.body.userId; // Giả sử userId được gửi từ client (sau này cần xác thực)
    const result = await tradeRequestsServices.selectOffer(requestId, offerId, userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const confirmFinishTrade = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { userId } = req.body; // Giả sử userId được gửi từ client (sau này cần xác thực)
    const result = await tradeRequestsServices.confirmFinishTrade(requestId, userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const cancelTrade = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { userId } = req.body; // Giả sử userId được gửi từ client
    const result = await tradeRequestsServices.cancelTrade(requestId, userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const declineOffer = async (req, res) => {
  try {
    const { requestId, offerId } = req.params;
    const { userId } = req.body; // Giả sử userId được gửi từ client
    const result = await tradeRequestsServices.declineOffer(requestId, offerId, userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

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