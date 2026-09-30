import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createReturn,
  getMyReturns,
  getReturnById,
  cancelReturn,
} from '../controllers/returnController.js';

const router = express.Router();

// All customer return routes are protected
router.use(protect);

router.route('/')
  .get(getMyReturns)
  .post(createReturn);

router.route('/:id')
  .get(getReturnById);

router.post('/:id/cancel', cancelReturn);

export default router;
