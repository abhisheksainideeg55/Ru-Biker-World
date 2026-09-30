import api from './api';

export const cartService = {
  /**
   * Fetch authenticated user's cart from backend
   */
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  /**
   * Add a product to the cart
   */
  async addItem({ productId, quantity = 1, selectedVariant = null }) {
    const response = await api.post('/cart/items', {
      productId,
      quantity,
      selectedVariant,
    });
    return response.data;
  },

  /**
   * Update item quantity in the cart
   */
  async updateItem(itemId, quantity) {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  async removeItem(itemId) {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear the entire cart
   */
  async clearCart() {
    const response = await api.delete('/cart');
    return response.data;
  },

  /**
   * Merge guest cart items into authenticated user cart
   */
  async mergeCart(items = []) {
    const response = await api.post('/cart/merge', { items });
    return response.data;
  },

  /**
   * Apply promotional coupon code to cart
   */
  async applyCoupon(code) {
    const response = await api.post('/cart/coupon', { code });
    return response.data;
  },

  /**
   * Remove coupon from cart
   */
  async removeCoupon() {
    const response = await api.delete('/cart/coupon');
    return response.data;
  },

  /**
   * Calculate shipping quote for address and delivery method
   */
  async getShippingQuote({ addressId = null, shippingMethod = 'standard' }) {
    const response = await api.post('/cart/shipping-quote', {
      addressId,
      shippingMethod,
    });
    return response.data;
  },

  /**
   * Move item to Save for Later list
   */
  async saveForLater(itemId) {
    const response = await api.post('/cart/save-for-later', { itemId });
    return response.data;
  },

  /**
   * Remove item from Save for Later list
   */
  async removeSavedItem(itemId) {
    const response = await api.delete(`/cart/save-for-later/${itemId}`);
    return response.data;
  },

  /**
   * Move item back from saved list to active cart
   */
  async moveToCart(itemId) {
    const response = await api.post('/cart/move-to-cart', { itemId });
    return response.data;
  },
};

export default cartService;
