import express from 'express';
import { Router } from 'express';
import { offersController } from '../controllers/offers.controllers.js';
import { wrapAsync } from '../utils/handler.js';
import { createOfferValidator } from '../middlewares/offers.middlewares.js';
import { verifyToken } from '../middlewares/auth.middlewares.js';

const offersRouter = Router();
offersRouter.use(verifyToken);

offersRouter.post('/', createOfferValidator, wrapAsync(offersController.createOffer));
offersRouter.get('/request/:requestId', wrapAsync(offersController.getAllOffersByRequestId)); // Changed route
offersRouter.get('/', wrapAsync(offersController.getAllOffers)); // Route to get all offers
offersRouter.get('/:offerId', wrapAsync(offersController.getOfferByOfferId)); // Route to get offer by ID
offersRouter.put('/:id', wrapAsync(offersController.updateOfferByOfferId));
offersRouter.put('/:offerId/status', wrapAsync(offersController.updateOfferStatus));
// offersRouter.patch('/:offerId/status', wrapAsync(offersController.updateOfferStatus));
offersRouter.patch('/:offerId/status/:offerStatus', wrapAsync(offersController.updateOfferStatus));
export default offersRouter;