import api from './api';

export const returnService = {
  /**
   * Submit a return request for delivered order items
   */
  async createReturn({ orderId, items, reason, description, images = [], bankDetails = {}, refundMethod = 'bank_transfer' }) {
    const response = await api.post('/returns', {
      orderId,
      items,
      reason,
      description,
      images,
      bankDetails,
      refundMethod,
    });
    return response.data;
  },

  /**
   * Fetch customer's return requests
   */
  async getReturns() {
    const response = await api.get('/returns');
    return response.data;
  },

  /**
   * Fetch single return request details
   */
  async getReturnById(returnId) {
    const response = await api.get(`/returns/${returnId}`);
    return response.data;
  },

  /**
   * Cancel a return request
   */
  async cancelReturn(returnId) {
    const response = await api.post(`/returns/${returnId}/cancel`);
    return response.data;
  },
};

export default returnService;
