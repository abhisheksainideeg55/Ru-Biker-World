import express from 'express';
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);

// Protected Authentication Routes
router.get('/me', protect, getMe);

export default router;
