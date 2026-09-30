import api from './api';

export const orderService = {
  /**
   * Place a new order (Cash on Delivery or direct payment)
   */
  async createOrder({ shippingAddressId, shippingAddress, items, coupon, shippingMethod = 'standard', paymentMethod = 'cod' }) {
    const response = await api.post('/orders/place', {
      shippingAddressId,
      shippingAddress,
      items,
      coupon,
      shippingMethod,
      paymentMethod,
    });
    return response.data;
  },

  /**
   * Fetch paginated and filtered orders for authenticated customer
   */
  async getOrders({ page = 1, limit = 10, status = 'All', search = '' } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);

    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  /**
   * Fetch single order by ID or Order Number
   */
  async getOrderById(orderId) {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Cancel an order with structured reason
   */
  async cancelOrder(orderId, { reason, description = '' }) {
    const response = await api.post(`/orders/${orderId}/cancel`, {
      reason,
      description,
    });
    return response.data;
  },

  /**
   * Reorder items from a historical order into current cart
   */
  async reorder(orderId) {
    const response = await api.post(`/orders/${orderId}/reorder`);
    return response.data;
  },

  /**
   * Track order by Order Number and Phone/Email verification
   */
  async trackOrder({ orderNumber, contact }) {
    const response = await api.post('/orders/track', {
      orderNumber,
      contact,
    });
    return response.data;
  },
};

export default orderService;
