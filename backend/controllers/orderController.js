import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { isOrderCancellable } from '../services/orderStatusService.js';
import { createRefundRecord } from '../services/refundService.js';
import { getProductByIdOrSlug } from '../data/products.js';
import { validateCheckout, generateOrderNumber, deductStock } from '../services/checkoutService.js';
import { sendOrderConfirmation, sendPaymentReceipt } from '../services/emailService.js';
import { checkIsUserBlocked } from '../services/blockService.js';
import { localOrderStore } from './paymentController.js';
import { localCartStore } from './cartController.js';
import { localUserStore } from './authController.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * @desc    Create / Place Order (Cash on Delivery or Direct Order)
 * @route   POST /api/orders or POST /api/orders/place
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user._id || req.user.userId || req.user.id) : null;
    const { shippingAddressId, shippingAddress, shippingMethod = 'standard', paymentMethod = 'cod', items, coupon } = req.body;

    const orderPhone = (shippingAddress?.phone || req.user?.phone || '').replace(/\D/g, '').slice(-10);
    const orderEmail = (req.user?.email || '').toLowerCase().trim();

    // Check if user, verified phone or email is blocked
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

    // 2. Generate unique order number
    const orderNumber = await generateOrderNumber();

    const isCod = paymentMethod === 'cod';

    // 3. Create Order document
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
      paymentMethod: isCod ? 'cod' : paymentMethod,
      paymentStatus: isCod ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      statusHistory: [
        {
          status: 'Confirmed',
          message: isCod ? 'Order placed successfully (Cash on Delivery)' : 'Order placed and payment received.',
          timestamp: new Date(),
        },
      ],
      tracking: {
        carrier: 'Delhivery Express',
        trackingNumber: `MZ-${orderNumber.replace('ORD-', '')}`,
        shippedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
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

    // 4. Deduct product inventory stock
    await deductStock(snapshotItems);

    // 5. Clear user cart
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

    // 6. Send email notification
    const recipientUser = req.user || {
      email: userAddress.email || `${userAddress.phone}@guest.sparify.com`,
      fullName: userAddress.fullName,
      phone: userAddress.phone,
    };
    sendOrderConfirmation(createdOrder, recipientUser);
    if (!isCod) {
      sendPaymentReceipt(createdOrder, recipientUser);
    }

    return res.status(201).json({
      success: true,
      message: isCod ? 'Order placed successfully with Cash on Delivery!' : 'Order placed successfully!',
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
        stockAdjustments: error.stockAdjustments,
      });
    }
    next(error);
  }
};

/**
 * @desc    Get paginated, filtered, and searchable orders for authenticated customer
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user._id || req.user.userId || req.user.id) : null;
    const userIdStr = userId ? String(userId) : null;
    const userPhone = req.user?.phone;
    const userEmail = req.user?.email;

    const queryObj = req.query || {};
    const page = Math.max(1, parseInt(queryObj.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(queryObj.limit, 10) || 10));
    const status = queryObj.status;
    const search = queryObj.search?.trim();

    let allOrders = [];

    if (isDbConnected()) {
      const orConditions = [];
      if (userId) orConditions.push({ user: userId });
      if (userPhone) orConditions.push({ 'shippingAddress.phone': userPhone });
      if (userEmail) orConditions.push({ 'shippingAddress.email': userEmail });

      const query = orConditions.length > 0 ? { $or: orConditions } : {};

      if (status && status !== 'All') {
        query.orderStatus = status;
      }

      if (search) {
        const searchCondition = {
          $or: [
            { orderNumber: { $regex: search, $options: 'i' } },
            { 'items.productName': { $regex: search, $options: 'i' } },
            { 'items.SKU': { $regex: search, $options: 'i' } },
          ],
        };
        if (query.$or) {
          query.$and = [{ $or: query.$or }, searchCondition];
          delete query.$or;
        } else {
          query.$or = searchCondition.$or;
        }
      }

      const total = await Order.countDocuments(query);
      const totalPages = Math.ceil(total / limit) || 1;

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return res.status(200).json({
        success: true,
        data: {
          orders,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      });
    }

    // In-memory fallback
    for (const [, o] of localOrderStore.entries()) {
      const matchUser = (userIdStr && String(o.user) === userIdStr);
      const matchPhone = (userPhone && o.shippingAddress?.phone === userPhone);
      const matchEmail = (userEmail && o.shippingAddress?.email === userEmail);
      if ((matchUser || matchPhone || matchEmail || !userIdStr) && !allOrders.find((x) => x._id === o._id || x.orderNumber === o.orderNumber)) {
        allOrders.push(o);
      }
    }

    if (status && status !== 'All') {
      allOrders = allOrders.filter((o) => o.orderStatus === status);
    }

    if (search) {
      const lower = search.toLowerCase();
      allOrders = allOrders.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(lower) ||
          o.items?.some((it) => it.productName?.toLowerCase().includes(lower) || it.SKU?.toLowerCase().includes(lower))
      );
    }

    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = allOrders.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedOrders = allOrders.slice((page - 1) * limit, page * limit);

    return res.status(200).json({
      success: true,
      data: {
        orders: paginatedOrders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order details by ID or Order Number
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user._id || req.user.userId || req.user.id) : null;
    const userIdStr = userId ? String(userId) : null;
    const { id } = req.params;

    let order = null;

    if (isDbConnected()) {
      let query = [{ orderNumber: id }];
      if (mongoose.Types.ObjectId.isValid(id)) {
        query.push({ _id: id });
      }

      const findQuery = { $or: query };
      if (userId) {
        // If user is authenticated, allow querying their orders
      }

      order = await Order.findOne(findQuery).lean();
    } else {
      order = localOrderStore.get(id);
      if (!order) {
        for (const [, o] of localOrderStore.entries()) {
          if (String(o._id) === id || o.orderNumber === id) {
            order = o;
            break;
          }
        }
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
        code: 'ORDER_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order with status checks, stock restoration, and refund calculation
 * @route   POST /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { id } = req.params;
    const body = req.body || {};
    const reason = body.reason || 'Changed my mind';
    const description = body.description || '';

    let order = null;

    if (isDbConnected()) {
      let query = [{ orderNumber: id }];
      if (mongoose.Types.ObjectId.isValid(id)) query.push({ _id: id });
      order = await Order.findOne({ user: userId, $or: query });
    } else {
      order = localOrderStore.get(id);
      if (!order) {
        for (const [, o] of localOrderStore.entries()) {
          if ((String(o._id) === id || o.orderNumber === id) && String(o.user) === userIdStr) {
            order = o;
            break;
          }
        }
      }
    }

    if (!order || String(order.user) !== userIdStr) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
        code: 'ORDER_NOT_FOUND',
      });
    }

    if (!isOrderCancellable(order)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}.`,
        code: 'ORDER_NOT_CANCELLABLE',
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancellation = {
      reason,
      description,
      cancelledAt: new Date(),
    };

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: 'Cancelled',
      message: `Order cancelled by customer. Reason: ${reason}`,
      timestamp: new Date(),
    });

    // Handle refund record for paid orders
    if (order.paymentStatus === 'Paid') {
      const refundRecord = await createRefundRecord({ order, reason });
      order.refund = refundRecord;
    }

    // Safely restore stock if not already restored
    if (!order.isStockRestored) {
      for (const item of order.items || []) {
        const prodId = item.productId || item.product;
        if (prodId && isDbConnected()) {
          try {
            await Product.findOneAndUpdate(
              { $or: [{ _id: prodId }, { id: prodId }, { sku: item.SKU }] },
              { $inc: { stockCount: item.quantity, salesCount: -item.quantity } }
            );
          } catch {
            // Continue
          }
        }
      }
      order.isStockRestored = true;
    }

    if (typeof order.save === 'function') {
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Order has been cancelled successfully.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reorder eligible items from historical order
 * @route   POST /api/orders/:id/reorder
 * @access  Private
 */
export const reorder = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { id } = req.params;

    let order = null;

    if (isDbConnected()) {
      let query = [{ orderNumber: id }];
      if (mongoose.Types.ObjectId.isValid(id)) query.push({ _id: id });
      order = await Order.findOne({ user: userId, $or: query });
    } else {
      order = localOrderStore.get(id);
    }

    if (!order || String(order.user) !== userIdStr) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
        code: 'ORDER_NOT_FOUND',
      });
    }

    // Fetch user cart
    let cart = null;
    if (isDbConnected()) {
      cart = await Cart.findOne({ user: userId });
      if (!cart) cart = await Cart.create({ user: userId, items: [] });
    } else {
      cart = localCartStore.get(userIdStr) || { items: [] };
    }

    const addedItems = [];
    const unavailableItems = [];

    for (const item of order.items || []) {
      const product = await getProductByIdOrSlug(item.productId);

      if (!product || product.isActive === false || product.stock === false || (product.stockCount ?? 0) < 1) {
        unavailableItems.push({
          productName: item.productName,
          SKU: item.SKU,
          reason: 'Currently out of stock or unavailable',
        });
        continue;
      }

      const availableStock = product.stockCount ?? 10;
      const maxPurchase = product.maxPurchaseQuantity ?? 5;
      const maxAllowed = Math.min(availableStock, maxPurchase);
      const reqQty = Math.min(item.quantity || 1, maxAllowed);

      // Check if item already exists in cart
      const existingIdx = cart.items.findIndex(
        (ci) => String(ci.productId) === String(product.id || product._id)
      );

      if (existingIdx > -1) {
        cart.items[existingIdx].quantity = Math.min(maxAllowed, cart.items[existingIdx].quantity + reqQty);
        cart.items[existingIdx].priceAtAdd = Number(product.price); // Current price
      } else {
        cart.items.push({
          _id: new mongoose.Types.ObjectId(),
          product: product.id || product._id,
          productId: String(product.id || product._id),
          quantity: reqQty,
          priceAtAdd: Number(product.price), // Current catalog price
          addedAt: new Date(),
        });
      }

      addedItems.push({
        productName: product.name,
        quantity: reqQty,
        currentPrice: Number(product.price),
      });
    }

    if (typeof cart.save === 'function') {
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: `${addedItems.length} item(s) added to cart.`,
      data: {
        addedItems,
        unavailableItems,
        cartItemsCount: cart.items.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track Order (Public for verified guest or Authenticated)
 * @route   POST /api/orders/track
 * @access  Public
 */
export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, contact } = req.body;

    if (!orderNumber || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both the Order Number and associated Phone/Email.',
        code: 'MISSING_TRACKING_PARAMS',
      });
    }

    const cleanOrderNum = orderNumber.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    let order = null;

    if (isDbConnected()) {
      order = await Order.findOne({ orderNumber: cleanOrderNum }).lean();
    } else {
      order = localOrderStore.get(cleanOrderNum);
      if (!order) {
        for (const [, o] of localOrderStore.entries()) {
          if (o.orderNumber === cleanOrderNum) {
            order = o;
            break;
          }
        }
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No matching order found with the provided details.',
        code: 'ORDER_NOT_FOUND',
      });
    }

    // Verify contact matches phone or user email
    const orderPhone = order.shippingAddress?.phone?.replace(/[\s\-+]/g, '');
    const searchPhone = cleanContact.replace(/[\s\-+]/g, '');
    const isPhoneMatch = orderPhone && searchPhone && (orderPhone.includes(searchPhone) || searchPhone.includes(orderPhone));

    let isEmailMatch = false;
    if (order.shippingAddress?.email?.toLowerCase() === cleanContact) {
      isEmailMatch = true;
    }

    if (!isPhoneMatch && !isEmailMatch) {
      // Check user record
      if (isDbConnected() && order.user) {
        const user = await (await import('../models/User.js')).default.findById(order.user);
        if (user && (user.email?.toLowerCase() === cleanContact || user.phone?.includes(cleanContact))) {
          isEmailMatch = true;
        }
      }
    }

    if (!isPhoneMatch && !isEmailMatch) {
      return res.status(401).json({
        success: false,
        message: 'Verification failed. The contact details do not match this order number.',
        code: 'VERIFICATION_FAILED',
      });
    }

    // Return safe tracking summary
    return res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        statusHistory: order.statusHistory || [
          { status: order.orderStatus, message: 'Order status updated', timestamp: order.createdAt },
        ],
        tracking: order.tracking || {
          carrier: 'Delhivery Express',
          trackingNumber: `MZ-${cleanOrderNum.replace('ORD-', '')}`,
          shippedAt: order.createdAt,
          estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        },
        shippingMethod: order.shippingMethod,
        itemsSummary: order.items?.map((it) => ({
          productName: it.productName,
          quantity: it.quantity,
          image: it.image,
        })),
        destination: {
          city: order.shippingAddress?.city,
          state: order.shippingAddress?.state,
          postalCode: order.shippingAddress?.postalCode,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  reorder,
  trackOrder,
};
