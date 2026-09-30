import api from './api';

export const offerService = {
  /**
   * Get all active promotion offers
   */
  getActiveOffers: async () => {
    const response = await api.get('/offers');
    return response.data;
  },

  /**
   * Get single offer details
   */
  getOfferBySlug: async (slug) => {
    const response = await api.get(`/offers/${slug}`);
    return response.data;
  },
};

export default offerService;
