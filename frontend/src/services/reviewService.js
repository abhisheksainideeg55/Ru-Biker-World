import api from './api';

export const reviewService = {
  /**
   * Get public reviews and rating summary for a product
   */
  getProductReviews: async (productId, params = {}) => {
    const response = await api.get(`/products/${productId}/reviews`, { params });
    return response.data;
  },

  /**
   * Check if current user is eligible to review product (purchased + delivered)
   */
  checkReviewEligibility: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews/eligibility`);
    return response.data;
  },

  /**
   * Submit a new verified review
   */
  createReview: async (productId, data) => {
    const response = await api.post(`/products/${productId}/reviews`, data);
    return response.data;
  },

  /**
   * Update customer's review
   */
  updateReview: async (reviewId, data) => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  /**
   * Delete customer's review
   */
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * Toggle helpful vote
   */
  markHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  /**
   * Report inappropriate review
   */
  reportReview: async (reviewId, data) => {
    const response = await api.post(`/reviews/${reviewId}/report`, data);
    return response.data;
  },
};

export default reviewService;
