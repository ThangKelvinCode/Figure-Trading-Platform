import express from 'express';
import { Router } from 'express';
import { tradeRequestsController } from '../controllers/tradeRequests.controllers.js';
import { wrapAsync } from '../utils/handler.js';
import { createTradeRequestValidator, updateTradeRequestValidator } from '../middlewares/tradeRequests.middlewares.js';

const tradeRequestsRouter = Router();

tradeRequestsRouter.post('/', createTradeRequestValidator, wrapAsync(tradeRequestsController.createTradeRequest));
tradeRequestsRouter.get('/', wrapAsync(tradeRequestsController.getAllTradeRequests));
tradeRequestsRouter.get('/user/:userId', wrapAsync(tradeRequestsController.getTradeRequestsByUserId));
tradeRequestsRouter.get('/:requestId', wrapAsync(tradeRequestsController.getTradeRequestById));
tradeRequestsRouter.put('/:requestId', updateTradeRequestValidator, wrapAsync(tradeRequestsController.updateTradeRequest));
tradeRequestsRouter.delete('/:requestId', wrapAsync(tradeRequestsController.deleteTradeRequest));
tradeRequestsRouter.post(
    '/:requestId/select-offer/:offerId',
    wrapAsync(tradeRequestsController.selectOffer)
  );
  tradeRequestsRouter.post('/:requestId/finish-trade', wrapAsync(tradeRequestsController.confirmFinishTrade));
  tradeRequestsRouter.post('/:requestId/cancel-trade', wrapAsync(tradeRequestsController.cancelTrade));
  tradeRequestsRouter.post('/:requestId/decline-offer/:offerId', wrapAsync(tradeRequestsController.declineOffer));
  
  export default tradeRequestsRouter;