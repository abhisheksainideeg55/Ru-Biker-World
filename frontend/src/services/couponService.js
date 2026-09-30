import api from './api';

export const couponService = {
  /**
   * Validate a coupon code against current cart items or subtotal
   */
  async validateCoupon({ code, cartItems = [], subtotal = 0 }) {
    const response = await api.post('/coupons/validate', {
      code,
      cartItems,
      subtotal,
    });
    return response.data;
  },

  /**
   * Fetch active promotional coupons
   */
  async getActiveCoupons() {
    const response = await api.get('/coupons/active');
    return response.data;
  },
};

export default couponService;
