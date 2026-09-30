import { useState, useEffect, useCallback } from 'react';
import { productAlertService } from '../services/productAlertService';
import { useNotifications } from './useNotifications';

export const useProductAlerts = (productId) => {
  const { addToast } = useNotifications() || {};

  const [alerts, setAlerts] = useState([]);
  const [isSubscribedStock, setIsSubscribedStock] = useState(false);
  const [isSubscribedPrice, setIsSubscribedPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await productAlertService.getMyAlerts();
      if (res && res.data) {
        setAlerts(res.data);
        if (productId) {
          const hasStock = res.data.some(
            (a) => (a.productId === productId || a.product?._id === productId || a.product?.slug === productId) && a.type === 'BACK_IN_STOCK'
          );
          const hasPrice = res.data.some(
            (a) => (a.productId === productId || a.product?._id === productId || a.product?.slug === productId) && a.type === 'PRICE_DROP'
          );
          setIsSubscribedStock(hasStock);
          setIsSubscribedPrice(hasPrice);
        }
      }
    } catch {
      // Ignored for unauthenticated users
    }
  }, [productId]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const toggleStockAlert = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      if (isSubscribedStock) {
        await productAlertService.unsubscribeAlert(productId, 'BACK_IN_STOCK');
        setIsSubscribedStock(false);
        if (addToast) addToast({ type: 'info', message: 'Back in stock notification disabled.' });
      } else {
        await productAlertService.subscribeAlert(productId, { type: 'BACK_IN_STOCK' });
        setIsSubscribedStock(true);
        if (addToast) addToast({ type: 'success', message: 'We will notify you when this item is back in stock!' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Please log in to enable alerts.';
      if (addToast) addToast({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePriceAlert = async (targetPrice = null) => {
    if (!productId) return;
    setIsLoading(true);
    try {
      if (isSubscribedPrice) {
        await productAlertService.unsubscribeAlert(productId, 'PRICE_DROP');
        setIsSubscribedPrice(false);
        if (addToast) addToast({ type: 'info', message: 'Price drop notification disabled.' });
      } else {
        await productAlertService.subscribeAlert(productId, { type: 'PRICE_DROP', targetPrice });
        setIsSubscribedPrice(true);
        if (addToast) addToast({ type: 'success', message: 'We will notify you when the price drops!' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Please log in to enable alerts.';
      if (addToast) addToast({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    alerts,
    isSubscribedStock,
    isSubscribedPrice,
    isLoading,
    toggleStockAlert,
    togglePriceAlert,
    refetch: fetchAlerts,
  };
};

export default useProductAlerts;
