import api from './api';

export const paymentService = {
  /**
   * Create Razorpay order on the backend with server-authoritative amount
   */
  async createRazorpayOrder({ shippingAddressId, shippingAddress, items, coupon, shippingMethod = 'standard' }) {
    const response = await api.post('/payments/razorpay/create-order', {
      shippingAddressId,
      shippingAddress,
      items,
      coupon,
      shippingMethod,
    });
    return response.data;
  },

  /**
   * Submit Razorpay payment details to backend for cryptographic signature verification
   */
  async verifyRazorpayPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddressId,
    shippingAddress,
    items,
    coupon,
    shippingMethod = 'standard',
  }) {
    const response = await api.post('/payments/razorpay/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddressId,
      shippingAddress,
      items,
      coupon,
      shippingMethod,
    });
    return response.data;
  },
};

export default paymentService;
