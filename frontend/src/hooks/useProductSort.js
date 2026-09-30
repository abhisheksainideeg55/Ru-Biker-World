import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'discount', label: 'Highest Discount' },
];

export const useProductSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSort = useMemo(() => {
    return searchParams.get('sort') || 'featured';
  }, [searchParams]);

  const setSort = useCallback(
    (sortValue) => {
      setSearchParams((prevParams) => {
        const next = new URLSearchParams(prevParams);
        if (sortValue && sortValue !== 'featured') {
          next.set('sort', sortValue);
        } else {
          next.delete('sort');
        }
        next.delete('page'); // Reset to page 1 on sort change
        return next;
      });
    },
    [setSearchParams]
  );

  return {
    currentSort,
    setSort,
    sortOptions,
  };
};

export default useProductSort;
