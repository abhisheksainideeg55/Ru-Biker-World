import mongoose from 'mongoose';
import Order from '../models/Order.js';
import ReturnRequest from '../models/ReturnRequest.js';
import { isOrderReturnEligible } from './orderStatusService.js';
import returnConfig from '../config/returnConfig.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const localReturnStore = new Map();

/**
 * Validates and calculates a return request for specified items.
 */
export const processReturnRequest = async ({
  userId,
  orderId,
  items,
  reason,
  description,
  images = [],
  bankDetails = {},
  refundMethod = 'bank_transfer',
}) => {
  if (!orderId || !items || items.length === 0) {
    throw { status: 400, message: 'Order reference and return items are required.', code: 'INVALID_RETURN_PARAMS' };
  }

  const userIdStr = String(userId);

  // 1. Fetch Order
  let order = null;
  if (isDbConnected()) {
    let query = [{ orderNumber: orderId }];
    if (mongoose.Types.ObjectId.isValid(orderId)) query.push({ _id: orderId });
    order = await Order.findOne({ $or: query });
  } else {
    for (const [, o] of (await import('../controllers/paymentController.js')).localOrderStore.entries()) {
      if (String(o._id) === orderId || o.orderNumber === orderId) {
        order = o;
        break;
      }
    }
  }

  if (!order) {
    throw { status: 404, message: 'Order not found.', code: 'ORDER_NOT_FOUND' };
  }

  // 2. Validate return eligibility
  const eligibility = isOrderReturnEligible(order);
  if (!eligibility.isEligible) {
    throw { status: 400, message: eligibility.reason, code: 'RETURN_INELIGIBLE' };
  }

  // 3. Validate requested return items against order items
  let refundAmount = 0;
  const validatedReturnItems = [];

  for (const rItem of items) {
    let orderItem = order.items.find(
      (it) =>
        (it._id && rItem.orderItemId && String(it._id) === String(rItem.orderItemId)) ||
        (it.productId && rItem.productId && String(it.productId) === String(rItem.productId)) ||
        (it.product && rItem.productId && String(it.product) === String(rItem.productId)) ||
        (it.SKU && rItem.SKU && String(it.SKU) === String(rItem.SKU))
    );

    if (!orderItem && order.items && order.items.length > 0) {
      orderItem = order.items[0];
    }

    if (!orderItem) {
      throw { status: 400, message: `Item not found in order ${order.orderNumber}.`, code: 'ITEM_NOT_FOUND' };
    }

    const itemQty = orderItem.quantity || orderItem.qty || 1;
    const returnQty = Math.min(itemQty, Math.max(1, parseInt(rItem.quantity, 10) || 1));
    const unitPrice = Number(orderItem.unitPrice || orderItem.price || 0);
    const itemTotal = unitPrice * returnQty;
    refundAmount += itemTotal;

    validatedReturnItems.push({
      orderItemId: orderItem._id || `item_${Date.now()}`,
      product: orderItem.product || orderItem.productId,
      productId: orderItem.productId || String(orderItem.product),
      productName: orderItem.productName || orderItem.name || 'Product Item',
      SKU: orderItem.SKU || orderItem.sku || 'N/A',
      image: orderItem.image || '',
      quantity: returnQty,
      unitPrice: unitPrice,
      reason: rItem.reason || reason,
    });
  }

  // 4. Create Return Request Record
  const returnData = {
    order: order._id,
    orderNumber: order.orderNumber,
    user: userId,
    items: validatedReturnItems,
    reason,
    description: description.trim(),
    images: images.slice(0, returnConfig.MAX_RETURN_IMAGES),
    status: 'Requested',
    refundMethod: refundMethod || (bankDetails?.upiId ? 'upi' : 'bank_transfer'),
    bankDetails: {
      accountHolderName: bankDetails?.accountHolderName || '',
      accountNumber: bankDetails?.accountNumber || '',
      ifscCode: bankDetails?.ifscCode || '',
      bankName: bankDetails?.bankName || '',
      upiId: bankDetails?.upiId || '',
      refundPreference: bankDetails?.refundPreference || (bankDetails?.upiId ? 'upi' : 'bank_account'),
    },
    refundAmount,
    requestedAt: new Date(),
  };

  let createdReturn = null;
  if (isDbConnected()) {
    createdReturn = await ReturnRequest.create(returnData);
    order.orderStatus = 'Return Requested';
    order.statusHistory.push({
      status: 'Return Requested',
      message: `Return request submitted for ${validatedReturnItems.length} item(s). Reason: ${reason}`,
      timestamp: new Date(),
    });
    await order.save();
  } else {
    returnData._id = `ret_${Date.now()}`;
    returnData.createdAt = new Date();
    returnData.updatedAt = new Date();
    localReturnStore.set(returnData._id, returnData);
    createdReturn = returnData;

    order.orderStatus = 'Return Requested';
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: 'Return Requested',
      message: `Return request submitted. Reason: ${reason}`,
      timestamp: new Date(),
    });
  }

  return {
    returnRequest: createdReturn,
    order,
  };
};

export default {
  processReturnRequest,
  localReturnStore,
};
