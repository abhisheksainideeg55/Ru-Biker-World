import React, { createContext, useState, useCallback, useContext } from 'react';
import { orderService } from '../services/orderService';
import { returnService } from '../services/returnService';
import { useCart } from '../hooks/useCart';
import { useNotifications } from '../hooks/useNotifications';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { fetchCart } = useCart() || {};
  const { addToast } = useNotifications() || {};

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returns, setReturns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clean up legacy localStorage
  try {
    localStorage.removeItem('motozone_recent_orders');
    localStorage.removeItem('motozone_orders');
  } catch {}

  /**
   * Fetch customer orders with pagination, status, and search from Database
   */
  const fetchOrders = useCallback(async ({ page = 1, limit = 10, status = selectedStatus, search = searchQuery } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      let combined = [];

      try {
        const res = await orderService.getOrders({ page, limit, status, search });
        if (res && res.data && Array.isArray(res.data.orders)) {
          combined = res.data.orders;
          if (res.data.pagination) {
            setPagination(res.data.pagination);
          }
        }
      } catch (apiErr) {
        console.warn('API getOrders error:', apiErr.message);
      }

      // Filter by status if requested
      if (status && status !== 'All') {
        combined = combined.filter((o) => o.orderStatus === status);
      }

      // Filter by search if requested
      if (search) {
        const s = search.toLowerCase();
        combined = combined.filter((o) =>
          o.orderNumber?.toLowerCase().includes(s) ||
          o.items?.some((it) => it.productName?.toLowerCase().includes(s) || it.SKU?.toLowerCase().includes(s))
        );
      }

      setOrders(combined);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  /**
   * Fetch single order by ID or Order Number
   */
  const fetchOrder = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getOrderById(orderId);
      if (res && res.data) {
        setSelectedOrder(res.data);
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Order not found.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cancel an order
   */
  const cancelOrder = useCallback(async (orderId, { reason, description = '' }) => {
    setIsLoading(true);
    try {
      const res = await orderService.cancelOrder(orderId, { reason, description });
      if (res && res.data) {
        // Update list and selected order
        setOrders((prev) => prev.map((o) => (o._id === res.data._id ? res.data : o)));
        if (selectedOrder && selectedOrder._id === res.data._id) {
          setSelectedOrder(res.data);
        }
        if (addToast) addToast({ type: 'success', message: 'Order cancelled successfully.' });
        return { success: true, order: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel order.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  }, [selectedOrder, addToast]);

  /**
   * Reorder items into active shopping cart
   */
  const reorder = useCallback(async (orderId) => {
    setIsLoading(true);
    try {
      const res = await orderService.reorder(orderId);
      if (res && res.data) {
        if (fetchCart) await fetchCart();
        if (addToast) {
          addToast({
            type: 'success',
            message: `${res.data.addedItems?.length || 'Items'} added to your cart!`,
          });
        }
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reorder items.';
      if (addToast) addToast({ type: 'error', message: msg });
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, addToast]);

  /**
   * Fetch customer return requests
   */
  const fetchReturns = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await returnService.getReturns();
      if (res && res.data) {
        setReturns(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch returns:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    orders,
    pagination,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    selectedOrder,
    returns,
    isLoading,
    error,
    fetchOrders,
    fetchOrder,
    cancelOrder,
    reorder,
    fetchReturns,
    refreshOrders: () => fetchOrders({ page: pagination.page, status: selectedStatus, search: searchQuery }),
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderContext;
