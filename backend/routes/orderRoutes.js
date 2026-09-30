import express from 'express';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  reorder,
  trackOrder,
} from '../controllers/orderController.js';

const router = express.Router();

// Public Tracking Endpoint
router.post('/track', trackOrder);

// Order Placement (Strictly Authenticated)
router.post('/', protect, createOrder);
router.post('/place', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/cancel', protect, cancelOrder);
router.post('/:id/reorder', protect, reorder);

export default router;
