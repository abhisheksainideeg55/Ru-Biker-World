import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import { useProductFilters } from './useProductFilters';
import { useProductSort } from './useProductSort';

export const useProducts = ({ defaultLimit = 10 } = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, activeFilters, hasActiveFilters, toggleFilter, setSingleFilter, setPriceRange, removeFilter, clearFilters } = useProductFilters();
  const { currentSort, setSort, sortOptions } = useProductSort();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    products: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    startIndex: 0,
    endIndex: 0,
  });

  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page'), 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const setPage = useCallback(
    (pageNumber) => {
      setSearchParams((prevParams) => {
        const next = new URLSearchParams(prevParams);
        if (pageNumber > 1) {
          next.set('page', String(pageNumber));
        } else {
          next.delete('page');
        }
        return next;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setSearchParams]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts({
        filters,
        sort: currentSort,
        page: currentPage,
        limit: defaultLimit,
        search: filters.q,
      });
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch motorcycle products');
    } finally {
      setLoading(false);
    }
  }, [filters, currentSort, currentPage, defaultLimit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: data.products,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    startIndex: data.startIndex,
    endIndex: data.endIndex,
    loading,
    error,
    refetch: fetchProducts,
    setPage,
    // Filters & Sorting state
    filters,
    activeFilters,
    hasActiveFilters,
    toggleFilter,
    setSingleFilter,
    setPriceRange,
    removeFilter,
    clearFilters,
    currentSort,
    setSort,
    sortOptions,
  };
};

export default useProducts;
