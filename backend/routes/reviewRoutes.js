import express from 'express';
import {
  getProductReviews,
  checkReviewEligibility,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Product-scoped routes
router.get('/', getProductReviews);
router.get('/eligibility', protect, checkReviewEligibility);
router.post('/', protect, createReview);

export default router;
