import express from 'express';
import {
  createProductAlert,
  deleteProductAlert,
  getMyProductAlerts,
} from '../controllers/productAlertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/alerts', protect, getMyProductAlerts);
router.post('/:productId/alerts', protect, createProductAlert);
router.delete('/:productId/alerts/:type', protect, deleteProductAlert);

export default router;
