import crypto from 'crypto';

/**
 * Refund Architecture Service.
 * Manages refund calculations and Razorpay payment refund records.
 */

export const createRefundRecord = async ({ order, amount, reason }) => {
  const refundAmount = amount !== undefined ? Number(amount) : Number(order.grandTotal);

  if (isNaN(refundAmount) || refundAmount <= 0) {
    throw new Error('Invalid refund amount specified.');
  }

  const refundId = `rfnd_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

  console.log(`[RefundService] 🔄 Processing refund of ₹${refundAmount} for Order ${order.orderNumber}`);
  console.log(`[RefundService] Refund ID: ${refundId} | Payment ID: ${order.payment?.razorpayPaymentId || 'N/A'}`);

  return {
    refundId,
    amount: refundAmount,
    status: 'Pending', // Marked as Pending until confirmed by gateway/bank
    requestedAt: new Date(),
    reason: reason || 'Customer Order Cancellation / Return',
  };
};

export default {
  createRefundRecord,
};
