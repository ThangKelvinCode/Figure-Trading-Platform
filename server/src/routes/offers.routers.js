import express from 'express';
import { Router } from 'express';
import { offersController } from '../controllers/offers.controllers.js';
import { wrapAsync } from '../utils/handler.js';
import { createOfferValidator } from '../middlewares/offers.middlewares.js';

const offersRouter = Router();

offersRouter.post('/', createOfferValidator, wrapAsync(offersController.createOffer));
offersRouter.get('/listRequest/:requestId', wrapAsync(offersController.getAllOffersByRequestId)); // Changed route
offersRouter.get('/', wrapAsync(offersController.getAllOffers)); // Route to get all offers
offersRouter.get('/:offerId', wrapAsync(offersController.getOfferByOfferId)); // Route to get offer by ID
offersRouter.put('/:offerId', wrapAsync(offersController.updateOfferByOfferId));
export default offersRouter;