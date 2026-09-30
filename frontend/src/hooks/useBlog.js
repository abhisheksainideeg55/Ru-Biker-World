import { useState, useEffect, useCallback } from 'react';
import { blogService } from '../services/blogService';

export const useBlog = ({ initialCategory = 'All', initialSearch = '', initialPage = 1 } = {}) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: 9,
    total: 0,
    totalPages: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await blogService.getBlogCategories();
      if (res && res.data) {
        setCategories(res.data);
      }
    } catch {
      // Non-blocking
    }
  }, []);

  const fetchPosts = useCallback(
    async ({ page = 1, category = selectedCategory, search = searchQuery } = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await blogService.getBlogPosts({
          page,
          limit: 9,
          category: category !== 'All' ? category : undefined,
          search: search || undefined,
        });
        if (res && res.data) {
          setPosts(res.data.posts || []);
          if (res.data.pagination) setPagination(res.data.pagination);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load blog articles.');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, searchQuery]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPosts({ page: initialPage, category: selectedCategory, search: searchQuery });
  }, [fetchPosts, selectedCategory, searchQuery, initialPage]);

  return {
    posts,
    categories,
    pagination,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    fetchPosts,
    refetch: () => fetchPosts({ page: pagination.page, category: selectedCategory, search: searchQuery }),
  };
};

export default useBlog;
