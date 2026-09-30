import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { useOrders } from './useOrders';

export const useOrder = (orderId) => {
  const { cancelOrder: contextCancel, reorder: contextReorder } = useOrders();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(!!orderId);
  const [error, setError] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await orderService.getOrderById(orderId);
      if (res && (res.data || res.order)) {
        setOrder(res.data || res.order);
      } else {
        setError('Order details could not be found.');
      }
    } catch (err) {
      setError(err.message || 'Order not found.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const cancel = async ({ reason, description }) => {
    const res = await contextCancel(orderId, { reason, description });
    if (res && res.success && res.order) {
      setOrder(res.order);
    }
    return res;
  };

  const reorderItems = async () => {
    return await contextReorder(orderId);
  };

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrderDetails,
    cancelOrder: cancel,
    reorder: reorderItems,
  };
};

export default useOrder;
