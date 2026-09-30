import React, { createContext, useState, useEffect, useContext } from 'react';
import { wishlistService } from '../services/wishlistService';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

// Clean up legacy localStorage
try {
  localStorage.removeItem('motozone_wishlist');
} catch {}

let memoryGuestWishlist = [];

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext) || {};
  const isAuthenticated = !!user;

  const [wishlistItems, setWishlistItems] = useState(memoryGuestWishlist);

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      wishlistService
        .getWishlist()
        .then((res) => {
          if (isMounted && res && res.data) {
            const list = Array.isArray(res.data) ? res.data : (res.data.items || []);
            setWishlistItems(list);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const addToWishlist = async (productOrId) => {
    const prodId = typeof productOrId === 'object' ? (productOrId._id || productOrId.id) : productOrId;
    if (!wishlistItems.some((it) => (it._id || it.id) === prodId || it.productId === prodId)) {
      const updated = [...wishlistItems, typeof productOrId === 'object' ? productOrId : { _id: prodId, id: prodId }];
      setWishlistItems(updated);
      memoryGuestWishlist = updated;
      if (isAuthenticated) {
        try {
          await wishlistService.addToWishlist(prodId);
        } catch (e) {}
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    const updated = wishlistItems.filter((it) => (it._id || it.id) !== productId && it.productId !== productId);
    setWishlistItems(updated);
    memoryGuestWishlist = updated;
    if (isAuthenticated) {
      try {
        await wishlistService.removeFromWishlist(productId);
      } catch (e) {}
    }
  };

  const totalWishlist = wishlistItems.length;

  const value = {
    wishlistItems,
    setWishlistItems,
    addToWishlist,
    removeFromWishlist,
    totalWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;
