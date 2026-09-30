import express from 'express';
import { getActiveOffers, getOfferBySlug } from '../controllers/offerController.js';

const router = express.Router();

router.get('/', getActiveOffers);
router.get('/:slug', getOfferBySlug);

export default router;
