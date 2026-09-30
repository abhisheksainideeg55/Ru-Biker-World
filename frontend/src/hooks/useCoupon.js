import { useState, useCallback } from 'react';
import { useCart } from './useCart';
import { couponService } from '../services/couponService';

export const useCoupon = () => {
  const { coupon, discount, applyCoupon: contextApplyCoupon, removeCoupon: contextRemoveCoupon } = useCart();
  const [isApplying, setIsApplying] = useState(false);
  const [activePromos, setActivePromos] = useState([]);
  const [isLoadingPromos, setIsLoadingPromos] = useState(false);

  const applyCoupon = useCallback(
    async (code) => {
      setIsApplying(true);
      try {
        const res = await contextApplyCoupon(code);
        return res;
      } finally {
        setIsApplying(false);
      }
    },
    [contextApplyCoupon]
  );

  const removeCoupon = useCallback(async () => {
    setIsApplying(true);
    try {
      await contextRemoveCoupon();
    } finally {
      setIsApplying(false);
    }
  }, [contextRemoveCoupon]);

  const fetchActivePromos = useCallback(async () => {
    setIsLoadingPromos(true);
    try {
      const res = await couponService.getActiveCoupons();
      if (res && res.data) {
        setActivePromos(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingPromos(false);
    }
  }, []);

  return {
    coupon,
    discount,
    isApplying,
    activePromos,
    isLoadingPromos,
    applyCoupon,
    removeCoupon,
    fetchActivePromos,
  };
};

export default useCoupon;
