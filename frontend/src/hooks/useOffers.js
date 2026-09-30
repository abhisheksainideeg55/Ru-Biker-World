import { useState, useEffect, useCallback } from 'react';
import { offerService } from '../services/offerService';

export const useOffers = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await offerService.getActiveOffers();
      if (res && res.data) {
        setOffers(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch active offers.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    isLoading,
    error,
    refetch: fetchOffers,
  };
};

export default useOffers;
