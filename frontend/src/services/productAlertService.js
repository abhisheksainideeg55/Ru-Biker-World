import api from './api';

export const productAlertService = {
  /**
   * Subscribe to Price Drop or Back in Stock notification
   */
  subscribeAlert: async (productId, { type = 'BACK_IN_STOCK', targetPrice = null }) => {
    const response = await api.post(`/products/${productId}/alerts`, { type, targetPrice });
    return response.data;
  },

  /**
   * Unsubscribe from product notification
   */
  unsubscribeAlert: async (productId, type = 'BACK_IN_STOCK') => {
    const response = await api.delete(`/products/${productId}/alerts/${type}`);
    return response.data;
  },

  /**
   * Get all active subscriptions for customer
   */
  getMyAlerts: async () => {
    const response = await api.get('/products/alerts');
    return response.data;
  },
};

export default productAlertService;
