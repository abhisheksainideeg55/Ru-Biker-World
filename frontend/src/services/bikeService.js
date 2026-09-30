import api from './api';

export const bikeService = {
  getBikes: async () => {
    try {
      const res = await api.get('/bikes');
      if (res.data?.success && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('Failed to fetch bikes from backend:', e.message);
    }
    return [];
  },
};

export default bikeService;
