import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { validateCheckout, generateOrderNumber, deductStock } from '../services/checkoutService.js';
import { createRazorpayOrder, verifyRazorpayPayment, verifyWebhookSignature } from '../services/paymentService.js';
import { sendOrderConfirmation, sendPaymentReceipt } from '../services/emailService.js';
import { checkIsUserBlocked } from '../services/blockService.js';
import { localCartStore } from './cartController.js';
import { localUserStore } from './authController.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory order store for offline/local testing fallback
export const localOrderStore = new Map();

/**
 * @desc    Create Razorpay Order from server-validated checkout
 * @route   POST /api/payments/razorpay/create-order
 * @access  Private
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user._id || req.user.userId || req.user.id) : null;
    const { shippingAddressId, shippingAddress, shippingMethod = 'standard', items, coupon } = req.body;

    const orderPhone = (shippingAddress?.phone || req.user?.phone || '').replace(/\D/g, '').slice(-10);
    const orderEmail = (req.user?.email || '').toLowerCase().trim();

    // Check if user or verified phone/email is blocked across all stores
    const blockCheck = await checkIsUserBlocked({
      userId,
      email: orderEmail || req.user?.email,
      phone: orderPhone || req.user?.phone,
    });

    if (blockCheck.isBlocked || (req.user && req.user.isActive === false)) {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_BLOCKED',
        message: 'Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.',
        blockDetails: blockCheck.blockDetails || {
          reason: 'Your account has been restricted from placing orders by store administration.',
          blockType: 'permanent',
        },
      });
    }

    // 1. Server-side validation of cart, stock, pricing, and address ownership
    const { cart, userAddress, snapshotItems, totals } = await validateCheckout({
      userId,
      addressId: shippingAddressId,
      shippingAddress,
      shippingMethod,
      items,
      coupon,
    });

    if (totals.grandTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Order total must be greater than zero.',
        code: 'INVALID_ORDER_TOTAL',
      });
    }

    // 2. Generate temporary receipt reference
    const receipt = `rcpt_${Date.now()}`;

    // 3. Create Razorpay order via service
    const rzpOrder = await createRazorpayOrder({
      amount: totals.grandTotal,
      currency: 'INR',
      receipt,
      notes: {
        userId: String(userId || 'guest'),
        addressId: String(userAddress._id || userAddress.id || ''),
        shippingMethod,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully.',
      data: {
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount, // in paise
        amountInRupees: totals.grandTotal,
        currency: rzpOrder.currency,
        keyId: rzpOrder.keyId,
        shippingAddress: userAddress,
        totals,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        code: error.code || 'CHECKOUT_ERROR',
        stockAdjustments: error.stockAdjustments,
      });
    }
    next(error);
  }
};

/**
 * @desc    Verify Razorpay payment signature, finalize order, deduct stock, and clear cart
 * @route   POST /api/payments/razorpay/verify
 * @access  Private
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user._id || req.user.userId || req.user.id) : null;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddressId,
      shippingAddress,
      shippingMethod = 'standard',
      items,
      coupon,
    } = req.body;

    const orderPhone = (shippingAddress?.phone || req.user?.phone || '').replace(/\D/g, '').slice(-10);
    const orderEmail = (req.user?.email || '').toLowerCase().trim();

    // Check if user or phone/email is blocked across all stores
    const blockCheck = await checkIsUserBlocked({
      userId,
      email: orderEmail || req.user?.email,
      phone: orderPhone || req.user?.phone,
    });

    if (blockCheck.isBlocked || (req.user && req.user.isActive === false)) {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_BLOCKED',
        message: 'Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.',
        blockDetails: blockCheck.blockDetails || {
          reason: 'Your account has been restricted from placing orders by store administration.',
          blockType: 'permanent',
        },
      });
    }

    // 1. Verify cryptographic signature
    const verification = verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!verification.isValid) {
      return res.status(400).json({
        success: false,
        message: verification.message || 'Payment signature verification failed. Order not placed.',
        code: 'PAYMENT_VERIFICATION_FAILED',
      });
    }

    // 2. Validate checkout and prepare final snapshot
    const { cart, userAddress, snapshotItems, totals } = await validateCheckout({
      userId,
      addressId: shippingAddressId,
      shippingAddress,
      shippingMethod,
      items,
      coupon,
    });

    // 3. Generate unique order number
    const orderNumber = await generateOrderNumber();

    // 4. Create Order document
    let orderData = {
      orderNumber,
      user: userId || new mongoose.Types.ObjectId(),
      items: snapshotItems,
      shippingAddress: {
        fullName: userAddress.fullName,
        phone: userAddress.phone,
        addressLine1: userAddress.addressLine1,
        addressLine2: userAddress.addressLine2 || '',
        landmark: userAddress.landmark || '',
        city: userAddress.city,
        state: userAddress.state,
        postalCode: userAddress.postalCode,
        country: userAddress.country || 'India',
      },
      shippingMethod: {
        type: shippingMethod,
        amount: totals.shipping,
        estimatedDays: totals.shippingInfo?.estimatedDays || '3–7 business days',
      },
      coupon: cart?.coupon || coupon || { code: null, discountAmount: 0 },
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      tax: totals.tax,
      grandTotal: totals.grandTotal,
      paymentMethod: 'razorpay',
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      payment: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    };

    let createdOrder = null;
    if (isDbConnected()) {
      createdOrder = await Order.create(orderData);
    } else {
      orderData._id = `ord_${Date.now()}`;
      orderData.createdAt = new Date();
      orderData.updatedAt = new Date();
      localOrderStore.set(orderData._id, orderData);
      localOrderStore.set(orderData.orderNumber, orderData);
      createdOrder = orderData;
    }

    // 5. Deduct product inventory stock
    await deductStock(snapshotItems);

    // 6. Clear user cart
    if (isDbConnected()) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { items: [], coupon: { code: null, discountAmount: 0 }, subtotal: 0, discount: 0, shipping: 0, tax: 0, grandTotal: 0 }
      );
    } else {
      const uCart = localCartStore.get(String(userId));
      if (uCart) {
        uCart.items = [];
        uCart.coupon = { code: null, discountAmount: 0 };
        uCart.subtotal = 0;
        uCart.discount = 0;
        uCart.shipping = 0;
        uCart.tax = 0;
        uCart.grandTotal = 0;
      }
    }

    // 7. Queue email notifications architecture
    sendOrderConfirmation(createdOrder, req.user);
    sendPaymentReceipt(createdOrder, req.user);

    return res.status(201).json({
      success: true,
      message: 'Payment verified and order placed successfully!',
      data: {
        order: createdOrder,
        orderId: createdOrder._id,
        orderNumber: createdOrder.orderNumber,
        grandTotal: createdOrder.grandTotal,
        paymentStatus: createdOrder.paymentStatus,
        orderStatus: createdOrder.orderStatus,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        code: error.code || 'CHECKOUT_ERROR',
      });
    }
    next(error);
  }
};

/**
 * @desc    Handle Razorpay Webhooks for asynchronous reconciliation
 * @route   POST /api/payments/razorpay/webhook
 * @access  Public (Webhook Signature Verified)
 */
export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const isValid = verifyWebhookSignature(req.body, signature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    }

    const event = req.body.event;
    console.log(`[Razorpay Webhook] Received event: ${event}`);

    // Reconcile status based on webhook payload
    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      if (rzpOrderId && isDbConnected()) {
        await Order.findOneAndUpdate(
          { 'payment.razorpayOrderId': rzpOrderId },
          { paymentStatus: 'Paid', orderStatus: 'Confirmed' }
        );
      }
    }

    return res.status(200).json({ success: true, message: 'Webhook processed.' });
  } catch (error) {
    next(error);
  }
};

export default {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
};
