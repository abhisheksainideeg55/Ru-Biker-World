import api from './api';

export const blogService = {
  /**
   * Get paginated blog articles
   */
  getBlogPosts: async (params = {}) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },

  /**
   * Get single blog post by slug
   */
  getBlogPostBySlug: async (slug) => {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
  },

  /**
   * Get blog categories with count
   */
  getBlogCategories: async () => {
    const response = await api.get('/blog/categories');
    return response.data;
  },

  /**
   * Get related posts
   */
  getRelatedPosts: async (slug) => {
    const response = await api.get(`/blog/${slug}/related`);
    return response.data;
  },

  /**
   * Live debounced search
   */
  searchBlog: async (query) => {
    const response = await api.get('/blog/search', { params: { q: query } });
    return response.data;
  },
};

export default blogService;
