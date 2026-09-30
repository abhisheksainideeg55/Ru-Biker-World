import express from 'express';
import {
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markReviewHelpful);
router.post('/:id/report', protect, reportReview);

export default router;
