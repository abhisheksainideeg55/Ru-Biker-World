import api from './api';

export const addressService = {
  /**
   * Fetch all delivery addresses for current customer
   */
  getAddresses: async () => {
    try {
      const response = await api.get('/users/me/addresses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add a new delivery address
   */
  addAddress: async (data) => {
    try {
      const response = await api.post('/users/me/addresses', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing address
   */
  updateAddress: async (id, data) => {
    try {
      const response = await api.put(`/users/me/addresses/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/users/me/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Set address as default delivery destination
   */
  setDefaultAddress: async (id) => {
    try {
      const response = await api.patch(`/users/me/addresses/${id}/default`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default addressService;
