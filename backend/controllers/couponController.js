import Coupon from '../models/Coupon.js';
import { validateCouponRules, fallbackCoupons } from '../services/cartCalculationService.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * @desc    Validate a coupon code against cart
 * @route   POST /api/coupons/validate
 * @access  Public / Authenticated
 */
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartItems = [], subtotal: clientSubtotal } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid coupon code.',
        code: 'INVALID_COUPON_CODE',
      });
    }

    // Calculate subtotal from validated cart items if provided
    let subtotal = Number(clientSubtotal) || 0;
    if (cartItems && cartItems.length > 0) {
      subtotal = cartItems.reduce((sum, it) => {
        const p = Number(it.price || it.priceAtAdd || it.product?.price || 0);
        const q = Number(it.quantity || 1);
        return sum + p * q;
      }, 0);
    }

    const userId = req.user?._id || req.user?.id || null;
    const validation = await validateCouponRules(code, subtotal, cartItems, userId);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.reason || 'Coupon is invalid or cannot be applied.',
        code: 'COUPON_INELIGIBLE',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Coupon "${validation.coupon.code}" applied successfully!`,
      data: {
        coupon: validation.coupon,
        discountAmount: validation.discountAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active available promotional coupons for customer exploration
 * @route   GET /api/coupons/active
 * @access  Public
 */
export const getActiveCoupons = async (req, res, next) => {
  try {
    let coupons = [];
    if (isDbConnected()) {
      coupons = await Coupon.find({ isActive: true })
        .select('code description type value minimumOrderAmount maximumDiscount expiryDate')
        .sort({ value: -1 })
        .lean();
    }

    if (!coupons || coupons.length === 0) {
      coupons = fallbackCoupons.filter((c) => c.isActive);
    }

    return res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  validateCoupon,
  getActiveCoupons,
};
