import { useState, useEffect, useCallback } from 'react';
import { returnService } from '../services/returnService';
import { useNotifications } from './useNotifications';

export const useReturns = () => {
  const { addToast } = useNotifications() || {};
  const [returns, setReturns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReturns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await returnService.getReturns();
      if (res && res.data) {
        setReturns(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch returns.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const submitReturn = async ({ orderId, items, reason, description, images, bankDetails, refundMethod }) => {
    setIsLoading(true);
    try {
      const res = await returnService.createReturn({ orderId, items, reason, description, images, bankDetails, refundMethod });
      if (res && res.data) {
        setReturns((prev) => [res.data, ...prev]);
        if (addToast) addToast({ type: 'success', message: 'Return request submitted successfully.' });
        return { success: true, returnRequest: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit return request.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelReturnRequest = async (returnId) => {
    setIsLoading(true);
    try {
      const res = await returnService.cancelReturn(returnId);
      if (res && res.data) {
        setReturns((prev) => prev.map((r) => (r._id === returnId ? res.data : r)));
        if (addToast) addToast({ type: 'info', message: 'Return request cancelled.' });
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel return request.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    returns,
    isLoading,
    error,
    refetch: fetchReturns,
    submitReturn,
    cancelReturnRequest,
  };
};

export default useReturns;
