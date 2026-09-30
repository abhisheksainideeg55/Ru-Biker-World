import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';

export const useProduct = (slugParam) => {
  const params = useParams();
  const slug = slugParam || params.slug;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await productService.getProductBySlug(slug);
      if (!data) {
        setNotFound(true);
        setProduct(null);
      } else {
        setProduct(data);
        setNotFound(false);

        // Concurrently fetch related & frequently bought items
        const [related, freq] = await Promise.all([
          productService.getRelatedProducts(data, 10),
          productService.getFrequentlyBoughtTogether(data, 2),
        ]);
        setRelatedProducts(related);
        setFrequentlyBoughtTogether(freq);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    relatedProducts,
    frequentlyBoughtTogether,
    loading,
    error,
    notFound,
    refetch: fetchProduct,
  };
};

export default useProduct;
