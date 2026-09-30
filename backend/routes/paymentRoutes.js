import express from 'express';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
} from '../controllers/paymentController.js';

const router = express.Router();

// Razorpay Order Creation & Verification (Strictly Authenticated)
router.post('/razorpay/create-order', protect, createPaymentOrder);
router.post('/razorpay/verify', protect, verifyPayment);

// Webhook endpoint (Public with signature verification)
router.post('/razorpay/webhook', handleWebhook);

export default router;
