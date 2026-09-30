import returnConfig from '../config/returnConfig.js';

export const ALLOWED_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Packed', 'Cancelled'],
  Packed: ['Shipped'],
  Shipped: ['Out for Delivery'],
  'Out for Delivery': ['Delivered'],
  Delivered: ['Return Requested'],
  'Return Requested': ['Returned'],
  Returned: ['Refunded'],
  Cancelled: [],
  Refunded: [],
};

/**
 * Checks if a requested status transition is permissible.
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
};

/**
 * Checks if an order can be cancelled by the customer.
 */
export const isOrderCancellable = (order) => {
  if (!order) return false;
  return returnConfig.CANCELLATION_ALLOWED_STATUSES.includes(order.orderStatus);
};

/**
 * Checks if an order is eligible for return request.
 */
export const isOrderReturnEligible = (order) => {
  if (!order || !returnConfig.RETURN_ALLOWED_STATUSES.includes(order.orderStatus)) {
    return { isEligible: false, reason: 'Only delivered orders are eligible for return.' };
  }

  // Check delivery date vs return window
  const deliveryDate = order.statusHistory?.find((s) => s.status === 'Delivered')?.timestamp || order.updatedAt;
  const diffDays = Math.floor((new Date() - new Date(deliveryDate)) / (1000 * 60 * 60 * 24));

  if (diffDays > returnConfig.RETURN_WINDOW_DAYS) {
    return {
      isEligible: false,
      reason: `Return window of ${returnConfig.RETURN_WINDOW_DAYS} days has expired.`,
    };
  }

  return { isEligible: true, remainingDays: Math.max(0, returnConfig.RETURN_WINDOW_DAYS - diffDays) };
};

export default {
  ALLOWED_TRANSITIONS,
  isValidStatusTransition,
  isOrderCancellable,
  isOrderReturnEligible,
};
