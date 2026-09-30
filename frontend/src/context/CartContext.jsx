import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { cartService } from '../services/cartService';
import { couponService } from '../services/couponService';
import { AuthContext } from './AuthContext';
import { NotificationContext } from './NotificationContext';
import { rawProducts } from '../data/products';
import { featuredProducts, bestSellingProducts } from '../data/homeProducts';

export const CartContext = createContext();

const GUEST_CART_KEY = 'motozone_guest_cart';

// Aggregate catalog of all static products
const allStaticCatalog = [
  ...(Array.isArray(rawProducts) ? rawProducts : []),
  ...(Array.isArray(featuredProducts) ? featuredProducts : []),
  ...(Array.isArray(bestSellingProducts) ? bestSellingProducts : []),
];

// Clean up legacy localStorage keys
try {
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem('motozone_cart');
  localStorage.removeItem('sparify_cart');
} catch {}

// Helper to look up product info in static catalog for offline/guest display
export const getLocalProduct = (productOrId) => {
  if (!productOrId) return null;

  if (typeof productOrId === 'object' && productOrId !== null) {
    if (productOrId.name && (productOrId.price !== undefined || productOrId.id || productOrId._id)) {
      return productOrId;
    }
  }

  const targetId = String(productOrId);

  // Check all static products
  const foundStatic = allStaticCatalog.find(
    (p) => String(p.id) === targetId || String(p._id) === targetId || p.slug === targetId
  );
  if (foundStatic) return foundStatic;

  return null;
};

// Robust ID matching helper across all possible ID and item formats
export const matchesItem = (it, target) => {
  if (!it || !target) return false;

  const itId = it._id ? String(it._id) : '';
  const itProdId = it.productId ? String(it.productId) : '';
  const itPId = it.product?.id ? String(it.product.id) : (it.product?._id ? String(it.product._id) : '');
  const itSlug = it.product?.slug ? String(it.product.slug) : '';

  let tgtId = '';
  let tgtProdId = '';
  let tgtPId = '';
  let tgtSlug = '';

  if (typeof target === 'object' && target !== null) {
    tgtId = target._id ? String(target._id) : '';
    tgtProdId = target.productId ? String(target.productId) : '';
    tgtPId = target.product?.id ? String(target.product.id) : (target.product?._id ? String(target.product._id) : '');
    tgtSlug = target.product?.slug ? String(target.product.slug) : '';
  } else {
    tgtId = String(target);
    tgtProdId = String(target);
    tgtPId = String(target);
    tgtSlug = String(target);
  }

  // Exact ID / Slug matching
  if (itId && (itId === tgtId || itId === tgtProdId || itId === tgtPId)) return true;
  if (itProdId && (itProdId === tgtId || itProdId === tgtProdId || itProdId === tgtPId || itProdId === tgtSlug)) return true;
  if (itPId && (itPId === tgtId || itPId === tgtProdId || itPId === tgtPId || itPId === tgtSlug)) return true;
  if (itSlug && (itSlug === tgtSlug || itSlug === tgtProdId || itSlug === tgtId)) return true;

  // Guest prefix check
  if (itId && itId.startsWith('guest_') && tgtProdId && itId.includes(tgtProdId) && tgtProdId.length > 2) return true;
  if (tgtId && tgtId.startsWith('guest_') && itProdId && tgtId.includes(itProdId) && itProdId.length > 2) return true;

  return false;
};

// Calculate all cart totals and shipping synchronously
export const computeCartTotals = (itemsList = [], couponObj = { code: null, discountAmount: 0 }, shipMethod = 'standard') => {
  let sub = 0;
  for (const it of itemsList) {
    const p = it.product || {};
    const price = Number(it.priceAtAdd ?? p.price ?? 0);
    const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
    sub += price * qty;
  }

  let disc = 0;
  if (couponObj && couponObj.code) {
    if (couponObj.type === 'percentage') {
      disc = Math.round((sub * (couponObj.value || 0)) / 100);
    } else {
      disc = Math.min(sub, Number(couponObj.discountAmount || couponObj.value || 0));
    }
  }

  const netAfterDiscount = Math.max(0, sub - disc);
  const isFree = sub >= 999;
  const shipFee = shipMethod === 'express' ? 199 : (sub > 0 ? (isFree ? 0 : 99) : 0);
  const computedTax = netAfterDiscount > 0 ? Math.round(netAfterDiscount * 0.18) : 0;
  const grand = Math.max(0, netAfterDiscount + shipFee + computedTax);

  return {
    subtotal: sub,
    discount: disc,
    shipping: shipFee,
    tax: computedTax,
    grandTotal: grand,
    shippingInfo: {
      method: shipMethod,
      amount: shipFee,
      isFree: shipMethod === 'standard' && isFree,
      estimatedDays: shipMethod === 'express' ? '1–3 business days' : '3–7 business days',
      threshold: 999,
      amountToFreeShipping: isFree ? 0 : Math.max(0, 999 - sub),
    },
  };
};

// Transient memory store for guest session cart
let memoryGuestCart = [];

export const getInitialGuestCart = () => {
  return { items: memoryGuestCart, totals: computeCartTotals(memoryGuestCart) };
};

export const CartProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  const isAuthenticated = !!(auth?.user);

  const notifications = useContext(NotificationContext);
  const showToast = useCallback(
    (message, type = 'info') => {
      if (notifications?.addToast) {
        notifications.addToast({ message, type });
      }
    },
    [notifications]
  );

  const initialGuestData = getInitialGuestCart();

  // Cart Core State
  const [items, setItems] = useState(() => initialGuestData.items);
  const [saveForLaterList, setSaveForLaterList] = useState([]);
  const [coupon, setCoupon] = useState({ code: null, discountAmount: 0 });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [subtotal, setSubtotal] = useState(() => initialGuestData.totals.subtotal);
  const [discount, setDiscount] = useState(() => initialGuestData.totals.discount);
  const [shipping, setShipping] = useState(() => initialGuestData.totals.shipping);
  const [tax, setTax] = useState(() => initialGuestData.totals.tax);
  const [grandTotal, setGrandTotal] = useState(() => initialGuestData.totals.grandTotal);
  const [shippingInfo, setShippingInfo] = useState(() => initialGuestData.totals.shippingInfo);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // In-memory guest items helper
  const getGuestCartItems = () => memoryGuestCart;
  const saveGuestCartItems = (guestItems) => {
    memoryGuestCart = guestItems;
  };

  /**
   * Recalculate guest cart locally using product catalog data
   */
  const hydrateGuestCart = useCallback((guestItems) => {
    const hydrated = [];

    for (const gi of guestItems) {
      const product = gi.product || getLocalProduct(gi.productId) || {};
      if (!product && !gi.productId) continue;

      const qty = Math.max(1, parseInt(gi.quantity, 10) || 1);
      const price = Number(gi.priceAtAdd || product.price || 0);
      const prodId = String(product.id || product._id || gi.productId || `prod_${Date.now()}`);

      hydrated.push({
        _id: gi._id || `guest_${prodId}`,
        productId: prodId,
        product: {
          id: prodId,
          _id: prodId,
          name: product.name || gi.product?.name || 'Motorcycle Spare Part',
          slug: product.slug || gi.product?.slug || prodId,
          sku: product.sku || gi.product?.sku || '',
          brand: product.brand || gi.product?.brand || 'RU BIKER WORLD',
          category: product.category || gi.product?.category || 'Accessories',
          price: price,
          originalPrice: Number(product.originalPrice || gi.product?.originalPrice) || price,
          discount: product.discount || gi.product?.discount || 0,
          stock: product.stock !== false && (product.stockCount ?? 1) > 0,
          stockCount: product.stockCount ?? 10,
          maxPurchaseQuantity: product.maxPurchaseQuantity ?? 10,
          image: product.image || gi.product?.image || '/VESRAHBRAKEPADSINDIA_4b61ce84-22dd-413b-9142-02aa248c92e3.png',
          imageType: product.imageType || 'helmet',
        },
        quantity: qty,
        priceAtAdd: price,
        selectedVariant: gi.selectedVariant || null,
        addedAt: gi.addedAt || new Date(),
      });
    }

    const calculated = computeCartTotals(hydrated, coupon, shippingMethod);
    setItems(hydrated);
    setSubtotal(calculated.subtotal);
    setDiscount(calculated.discount);
    setShipping(calculated.shipping);
    setTax(calculated.tax);
    setGrandTotal(calculated.grandTotal);
    setShippingInfo(calculated.shippingInfo);
  }, [coupon, shippingMethod]);

  /**
   * Sync and fetch authenticated server cart
   */
  const fetchServerCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await cartService.getCart();
      if (res && res.data) {
        const d = res.data;
        setItems(d.items || []);
        setSaveForLaterList(d.saveForLater || []);
        setCoupon(d.coupon || { code: null, discountAmount: 0 });
        setShippingMethod(d.shippingMethod || 'standard');
        setSubtotal(d.subtotal || 0);
        setDiscount(d.discount || 0);
        setShipping(d.shipping || 0);
        setTax(d.tax || 0);
        setGrandTotal(d.grandTotal || 0);
        if (d.shippingInfo) setShippingInfo(d.shippingInfo);

        if (d.warnings && d.warnings.length > 0) {
          d.warnings.forEach((w) => showToast(w, 'info'));
        }
      }
    } catch (err) {
      console.warn('Server cart fetch warning:', err.message);
      setError(err.message);
      const guestItems = getGuestCartItems();
      hydrateGuestCart(guestItems);
    } finally {
      setIsLoading(false);
    }
  }, [showToast, hydrateGuestCart]);

  /**
   * Handle Login & Guest Cart Merge
   */
  useEffect(() => {
    if (isAuthenticated) {
      const guestItems = getGuestCartItems();
      if (guestItems.length > 0) {
        cartService
          .mergeCart(guestItems)
          .then((res) => {
            memoryGuestCart = [];
            if (res && res.data) {
              const d = res.data;
              setItems(d.items || []);
              setCoupon(d.coupon || { code: null, discountAmount: 0 });
              setSubtotal(d.subtotal || 0);
              setDiscount(d.discount || 0);
              setShipping(d.shipping || 0);
              setTax(d.tax || 0);
              setGrandTotal(d.grandTotal || 0);
              if (d.shippingInfo) setShippingInfo(d.shippingInfo);
              showToast('Your cart was synced with your account.', 'success');
            }
          })
          .catch(() => {
            fetchServerCart();
          });
      } else {
        fetchServerCart();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /**
   * Add to Cart
   */
  const addToCart = async (productOrId, quantity = 1, selectedVariant = null, openDrawerAfter = true) => {
    setIsLoading(true);
    setError(null);

    const product = typeof productOrId === 'object' && productOrId !== null
      ? productOrId
      : getLocalProduct(productOrId);

    const prodId = String(product?.id || product?._id || product?.slug || productOrId);
    const addQty = Math.max(1, parseInt(quantity, 10) || 1);

    const productSnapshot = product
      ? {
          id: prodId,
          _id: prodId,
          name: product.name || 'Product',
          slug: product.slug || prodId,
          sku: product.sku || '',
          brand: product.brand || 'RU BIKER WORLD',
          category: product.category || 'Accessories',
          price: Number(product.price) || 0,
          originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
          discount: product.discount || 0,
          stockCount: product.stockCount ?? 10,
          maxPurchaseQuantity: product.maxPurchaseQuantity ?? 10,
          image: product.image || '/VESRAHBRAKEPADSINDIA_4b61ce84-22dd-413b-9142-02aa248c92e3.png',
        }
      : null;

    // 1. Instantly update local state and storage
    const guestItems = getGuestCartItems();
    const existingIdx = guestItems.findIndex((it) => matchesItem(it, prodId));

    let newQty = addQty;
    if (existingIdx > -1) {
      newQty = (guestItems[existingIdx].quantity || 1) + addQty;
      guestItems[existingIdx].quantity = newQty;
      if (selectedVariant) guestItems[existingIdx].selectedVariant = selectedVariant;
      if (productSnapshot) guestItems[existingIdx].product = productSnapshot;
    } else {
      guestItems.push({
        _id: `guest_${prodId}_${Date.now()}`,
        productId: prodId,
        product: productSnapshot,
        quantity: newQty,
        priceAtAdd: Number(product?.price) || 0,
        selectedVariant: selectedVariant || null,
        addedAt: new Date(),
      });
    }

    saveGuestCartItems(guestItems);
    hydrateGuestCart(guestItems);

    showToast(`Added "${product?.name || 'Product'}" to cart.`, 'success');
    if (openDrawerAfter) setIsDrawerOpen(true);
    setIsLoading(false);

    // 2. If authenticated, synchronize with backend in background
    if (isAuthenticated) {
      try {
        const res = await cartService.addItem({ productId: prodId, quantity: addQty, selectedVariant });
        if (res && res.data) {
          const d = res.data;
          setItems(d.items || []);
          setCoupon(d.coupon || { code: null, discountAmount: 0 });
          setSubtotal(d.subtotal || 0);
          setDiscount(d.discount || 0);
          setShipping(d.shipping || 0);
          setTax(d.tax || 0);
          setGrandTotal(d.grandTotal || 0);
          if (d.shippingInfo) setShippingInfo(d.shippingInfo);
        }
      } catch (err) {
        console.warn('Backend addItem fallback to local cart:', err.message);
      }
    }

    return { success: true };
  };

  /**
   * Update Quantity (Instant local state & storage sync, auto-removes on <= 0)
   */
  const updateQuantity = async (itemOrId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty)) return;

    if (qty <= 0) {
      return removeFromCart(itemOrId);
    }

    // 1. Immediately update in-memory guest items
    const guestItems = getGuestCartItems();
    const existingIdx = guestItems.findIndex((it) => matchesItem(it, itemOrId));
    if (existingIdx > -1) {
      guestItems[existingIdx].quantity = qty;
      saveGuestCartItems(guestItems);
    }

    // 2. Immediately update local state items and recalculate totals
    setItems((prevItems) => {
      const updated = prevItems.map((it) => (matchesItem(it, itemOrId) ? { ...it, quantity: qty } : it));
      const calculated = computeCartTotals(updated, coupon, shippingMethod);
      setSubtotal(calculated.subtotal);
      setDiscount(calculated.discount);
      setShipping(calculated.shipping);
      setTax(calculated.tax);
      setGrandTotal(calculated.grandTotal);
      setShippingInfo(calculated.shippingInfo);
      return updated;
    });

    // 3. If authenticated, synchronize with backend in background
    if (isAuthenticated) {
      try {
        const idToSend = typeof itemOrId === 'object' ? (itemOrId._id || itemOrId.productId || itemOrId.id) : itemOrId;
        await cartService.updateItem(idToSend, qty);
      } catch (err) {
        console.warn('Server updateItem fallback:', err.message);
      }
    }
  };

  /**
   * Remove item from cart (Instant delete & recalculation)
   */
  const removeFromCart = async (itemOrId) => {
    // 1. Remove from in-memory guest items immediately
    const guestItems = getGuestCartItems().filter((it) => !matchesItem(it, itemOrId));
    saveGuestCartItems(guestItems);

    // 2. Remove from state immediately and recalculate totals
    setItems((prevItems) => {
      const updated = prevItems.filter((it) => !matchesItem(it, itemOrId));
      const calculated = computeCartTotals(updated, coupon, shippingMethod);
      setSubtotal(calculated.subtotal);
      setDiscount(calculated.discount);
      setShipping(calculated.shipping);
      setTax(calculated.tax);
      setGrandTotal(calculated.grandTotal);
      setShippingInfo(calculated.shippingInfo);
      return updated;
    });

    showToast('Product removed from cart.', 'info');

    // 3. If authenticated, synchronize with backend in background
    if (isAuthenticated) {
      try {
        const idToSend = typeof itemOrId === 'object' ? (itemOrId._id || itemOrId.productId || itemOrId.id) : itemOrId;
        await cartService.removeItem(idToSend);
      } catch (err) {
        console.warn('Server removeItem fallback:', err.message);
      }
    }
  };

  /**
   * Clear Cart
   */
  const clearCart = async () => {
    setIsLoading(true);
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setItems([]);
        setCoupon({ code: null, discountAmount: 0 });
        setSubtotal(0);
        setDiscount(0);
        setShipping(0);
        setTax(0);
        setGrandTotal(0);
        showToast('Cart cleared.', 'info');
      } catch (err) {
        showToast('Failed to clear cart', 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      memoryGuestCart = [];
      setItems([]);
      setCoupon({ code: null, discountAmount: 0 });
      setSubtotal(0);
      setDiscount(0);
      setShipping(0);
      setTax(0);
      setGrandTotal(0);
      showToast('Cart cleared.', 'info');
      setIsLoading(false);
    }
  };

  /**
   * Apply Promotional Coupon
   */
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      showToast('Please enter a coupon code.', 'error');
      return { success: false };
    }

    setIsLoading(true);

    if (isAuthenticated) {
      try {
        const res = await cartService.applyCoupon(code.toUpperCase().trim());
        if (res && res.data) {
          const d = res.data;
          setCoupon(d.coupon);
          setSubtotal(d.subtotal);
          setDiscount(d.discount);
          setShipping(d.shipping);
          setTax(d.tax);
          setGrandTotal(d.grandTotal);
          showToast(res.message || 'Coupon applied successfully!', 'success');
          return { success: true };
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Invalid or expired coupon code.';
        showToast(msg, 'error');
        return { success: false, message: msg };
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await couponService.validateCoupon({
          code: code.toUpperCase().trim(),
          subtotal,
          cartItems: items,
        });
        if (res && res.data) {
          const discountAmt = res.data.discountAmount || 0;
          setCoupon({
            code: res.data.coupon.code,
            discountAmount: discountAmt,
            type: res.data.coupon.type,
            value: res.data.coupon.value,
          });
          setDiscount(discountAmt);
          const net = Math.max(0, subtotal - discountAmt);
          const fee = net >= 999 ? 0 : (net > 0 ? 99 : 0);
          const computedTax = Math.round(net * 0.18);
          setShipping(fee);
          setTax(computedTax);
          setGrandTotal(net + fee + computedTax);
          showToast(res.message || 'Coupon applied successfully!', 'success');
          return { success: true };
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Invalid or expired coupon.';
        showToast(msg, 'error');
        return { success: false, message: msg };
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Remove Coupon
   */
  const removeCoupon = async () => {
    setIsLoading(true);
    if (isAuthenticated) {
      try {
        const res = await cartService.removeCoupon();
        if (res && res.data) {
          const d = res.data;
          setCoupon({ code: null, discountAmount: 0 });
          setDiscount(0);
          setSubtotal(d.subtotal);
          setShipping(d.shipping);
          setTax(d.tax);
          setGrandTotal(d.grandTotal);
          showToast('Coupon removed.', 'info');
        }
      } catch (err) {
        showToast('Failed to remove coupon', 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      setCoupon({ code: null, discountAmount: 0 });
      setDiscount(0);
      const isFree = subtotal >= 999;
      const fee = subtotal > 0 ? (isFree ? 0 : 99) : 0;
      const computedTax = Math.round(subtotal * 0.18);
      setShipping(fee);
      setTax(computedTax);
      setGrandTotal(subtotal + fee + computedTax);
      showToast('Coupon removed.', 'info');
      setIsLoading(false);
    }
  };

  /**
   * Calculate Shipping for Method and/or Address
   */
  const calculateShippingQuote = async (addressId = null, method = 'standard') => {
    setShippingMethod(method);
    if (isAuthenticated) {
      try {
        const res = await cartService.getShippingQuote({ addressId, shippingMethod: method });
        if (res && res.data) {
          setShipping(res.data.shippingFee);
          setGrandTotal(res.data.grandTotal);
          if (res.data.shipping) setShippingInfo(res.data.shipping);
        }
      } catch (e) {
        console.warn('Shipping quote calculation warning:', e.message);
      }
    } else {
      const fee = method === 'express' ? 199 : (subtotal >= 999 ? 0 : 99);
      setShipping(fee);
      setGrandTotal(subtotal - discount + fee + tax);
      setShippingInfo({
        method,
        amount: fee,
        isFree: method === 'standard' && subtotal >= 999,
        estimatedDays: method === 'express' ? '1–3 business days' : '3–7 business days',
        threshold: 999,
      });
    }
  };

  /**
   * Save For Later actions
   */
  const saveForLater = async (itemId) => {
    if (!isAuthenticated) {
      showToast('Please log in to save items for later.', 'info');
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartService.saveForLater(itemId);
      if (res && res.data) {
        setItems(res.data.items || []);
        setSaveForLaterList(res.data.saveForLater || []);
        setSubtotal(res.data.subtotal || 0);
        setGrandTotal(res.data.grandTotal || 0);
        showToast('Item moved to Save for Later.', 'success');
      }
    } catch (e) {
      showToast(e.message || 'Failed to save item', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeSavedItem = async (itemId) => {
    try {
      const res = await cartService.removeSavedItem(itemId);
      if (res && res.data) {
        setSaveForLaterList(res.data.saveForLater || []);
        showToast('Item removed from Saved list.', 'info');
      }
    } catch (e) {
      showToast('Failed to remove saved item', 'error');
    }
  };

  const moveToCart = async (itemId) => {
    setIsLoading(true);
    try {
      const res = await cartService.moveToCart(itemId);
      if (res && res.data) {
        setItems(res.data.items || []);
        setSaveForLaterList(res.data.saveForLater || []);
        setSubtotal(res.data.subtotal || 0);
        setGrandTotal(res.data.grandTotal || 0);
        showToast('Item moved to cart.', 'success');
      }
    } catch (e) {
      showToast(e.message || 'Failed to move to cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const cartCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  const value = {
    cart: { items, coupon, subtotal, discount, shipping, tax, grandTotal },
    items,
    cartItems: items,
    setCartItems: setItems,
    cartCount,
    totalQuantity: cartCount,
    subtotal,
    discount,
    coupon,
    shipping,
    shippingMethod,
    shippingInfo,
    tax,
    grandTotal,
    saveForLaterList,
    saveForLater: saveForLaterList,
    isLoading,
    error,
    isDrawerOpen,
    isOpen: isDrawerOpen,
    setIsOpen: setIsDrawerOpen,
    setIsDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
    toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
    fetchCart: isAuthenticated ? fetchServerCart : () => hydrateGuestCart(getGuestCartItems()),
    refreshCart: isAuthenticated ? fetchServerCart : () => hydrateGuestCart(getGuestCartItems()),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    calculateShipping: calculateShippingQuote,
    saveItemForLater: saveForLater,
    removeSavedItem,
    moveToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
