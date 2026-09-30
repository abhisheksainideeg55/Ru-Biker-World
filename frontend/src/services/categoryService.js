import api from './api';

export const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res.data?.success && Array.isArray(res.data?.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('Failed to fetch categories from backend:', e.message);
    }
    return [];
  },
};

export default categoryService;
