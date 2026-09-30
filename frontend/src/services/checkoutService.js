import { paymentService } from './paymentService';
import { orderService } from './orderService';

export const checkoutService = {
  /**
   * Initiates Razorpay order creation
   */
  async createPaymentOrder({ shippingAddressId, shippingAddress, items, coupon, shippingMethod }) {
    return await paymentService.createRazorpayOrder({
      shippingAddressId,
      shippingAddress,
      items,
      coupon,
      shippingMethod,
    });
  },

  /**
   * Verifies Razorpay payment signature & finalizes order
   */
  async verifyPayment(paymentDetails) {
    return await paymentService.verifyRazorpayPayment(paymentDetails);
  },

  /**
   * Directly places an order (Cash on Delivery or direct payment)
   */
  async placeOrder({ shippingAddressId, shippingAddress, items, coupon, shippingMethod = 'standard', paymentMethod = 'cod' }) {
    return await orderService.createOrder({
      shippingAddressId,
      shippingAddress,
      items,
      coupon,
      shippingMethod,
      paymentMethod,
    });
  },

  /**
   * Fetches order confirmation details
   */
  async getOrderConfirmation(orderId) {
    return await orderService.getOrderById(orderId);
  },
};

export default checkoutService;
