import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiZap, FiHeart, FiCheck, FiBell, FiTrendingDown } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { useProductAlerts } from '../../hooks/useProductAlerts';

export const ProductActions = ({ product, quantity = 1, selectedSize = null }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth() || {};
  const { addToCart } = useCart() || {};
  const { wishlistItems = [], setWishlistItems } = useWishlist() || {};
  const { addToast } = useNotifications() || {};

  const productId = product?.slug || product?.id || product?._id;
  const {
    isSubscribedStock,
    isSubscribedPrice,
    toggleStockAlert,
    togglePriceAlert,
  } = useProductAlerts(productId);

  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const isOutOfStock = !product.stock || product.stockCount === 0;
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    if (addToCart) {
      const extra = selectedSize ? { size: selectedSize } : null;
      const res = await addToCart(product, quantity, extra, true);
      if (res && res.success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    }
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    if (addToCart) {
      const extra = selectedSize ? { size: selectedSize } : null;
      await addToCart(product, quantity, extra, false);
    }
    setIsAdding(false);
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      if (addToast) {
        addToast({
          type: 'warning',
          message: 'Please sign in to save products to your wishlist.',
        });
      }
      navigate(`/login?redirect=${encodeURIComponent(`/product/${product.slug || product.id}`)}`);
      return;
    }

    if (!setWishlistItems) return;

    if (isWishlisted) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      if (addToast) {
        addToast({
          type: 'info',
          message: `Removed from wishlist`,
        });
      }
    } else {
      setWishlistItems((prev) => [...prev, product]);
      if (addToast) {
        addToast({
          type: 'success',
          message: `Saved "${product.name}" to wishlist!`,
        });
      }
    }
  };

  const handleStockAlertClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${productId}`);
      return;
    }
    toggleStockAlert();
  };

  const handlePriceAlertClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${productId}`);
      return;
    }
    togglePriceAlert();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Actions Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isOutOfStock ? (
          <>
            {/* Out of Stock Notice */}
            <div className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center">
              <span>Currently Out of Stock</span>
            </div>

            {/* Back in Stock Alert Button */}
            <button
              type="button"
              onClick={handleStockAlertClick}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                isSubscribedStock
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md active:scale-95'
              }`}
            >
              <FiBell className={`w-4 h-4 ${isSubscribedStock ? 'fill-amber-600' : ''}`} />
              <span>{isSubscribedStock ? 'Notification Enabled' : 'Notify When Back in Stock'}</span>
            </button>
          </>
        ) : (
          <>
            {/* Add to Cart */}
            <button
              type="button"
              disabled={isAdding}
              onClick={handleAddToCart}
              className={`
                w-full py-3.5 px-5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] focus:outline-none shadow-xs
                ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-black hover:bg-neutral-800 text-white'
                }
              `}
            >
              {isAdded ? (
                <>
                  <FiCheck className="w-4 h-4 stroke-[3]" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </>
              )}
            </button>

            {/* Buy It Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] focus:outline-none bg-[#e65100] hover:bg-[#d84315] text-white shadow-xs"
            >
              <FiZap className="w-4 h-4 fill-white" />
              <span>Buy It Now</span>
            </button>
          </>
        )}
      </div>

      {/* Secondary Actions: Wishlist & Price Drop Alert */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`
            w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all duration-200 focus:outline-none
            ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-rose-600 hover:border-slate-300'
            }
          `}
        >
          <FiHeart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? 'fill-rose-600 text-rose-600' : ''
            }`}
          />
          <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
        </button>

        {/* Price Drop Alert Button */}
        <button
          type="button"
          onClick={handlePriceAlertClick}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all duration-200 ${
            isSubscribedPrice
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-amber-600 hover:border-slate-300'
          }`}
        >
          <FiTrendingDown className="w-3.5 h-3.5" />
          <span>{isSubscribedPrice ? 'Price Alert Active' : 'Notify on Price Drop'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
