import api from './api';

export const wishlistService = {
  /**
   * Get customer's saved wishlist items from backend
   */
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      try {
        const fallback = await api.get('/users/me/wishlist');
        return fallback.data;
      } catch (err) {
        throw error;
      }
    }
  },

  /**
   * Add a product to customer's wishlist
   */
  addToWishlist: async (productId) => {
    try {
      const response = await api.post('/wishlist', { productId });
      return response.data;
    } catch (error) {
      try {
        const fallback = await api.post('/users/me/wishlist', { productId });
        return fallback.data;
      } catch (err) {
        throw error;
      }
    }
  },

  /**
   * Remove a product from customer's wishlist
   */
  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      try {
        const fallback = await api.delete(`/users/me/wishlist/${productId}`);
        return fallback.data;
      } catch (err) {
        throw error;
      }
    }
  },
};

export default wishlistService;
