import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiTrash2,
  FiShoppingBag,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import ProductImage from '../product/ProductImage';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useNotifications } from '../../hooks/useNotifications';

export const WishlistItem = ({ product }) => {
  const { addToCart } = useCart() || {};
  const { setWishlistItems } = useWishlist() || {};
  const { addToast } = useNotifications() || {};

  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const isOutOfStock = !product.stock || product.stockCount === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    if (addToCart) {
      const res = await addToCart(product.id || product._id, 1);
      if (res && res.success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    }
    setIsAdding(false);
  };

  const handleMoveToCart = async () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    if (addToCart) {
      const res = await addToCart(product.id || product._id, 1);
      if (res && res.success) {
        if (setWishlistItems) {
          setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
        }
      }
    }
    setIsAdding(false);
  };

  const handleRemove = () => {
    if (setWishlistItems) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      if (addToast) {
        addToast({
          type: 'info',
          message: `Removed "${product.name}" from wishlist.`,
        });
      }
    }
  };

  const formattedPrice = Number(product.price || 0).toLocaleString('en-IN');
  const formattedOriginal = product.originalPrice
    ? Number(product.originalPrice).toLocaleString('en-IN')
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between overflow-hidden">
      {/* Product Image & Remove Shortcut */}
      <div className="relative aspect-square w-full bg-slate-50 border-b border-slate-100 overflow-hidden">
        <Link to={`/product/${product.slug || product.id}`} className="block h-full w-full">
          <ProductImage
            src={product.image}
            alt={product.name}
            iconType={product.imageType || 'brake'}
            aspectRatio="aspect-square"
          />
        </Link>

        {/* Floating Remove Button */}
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute top-2.5 right-2.5 z-20 p-2 rounded-xl bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white shadow-sm transition-colors focus:outline-none"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span className="inline-block text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-800 text-white shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
            <span className="text-brand-600 truncate">{product.brand || 'MotoZone'}</span>
            <span className="truncate">{product.category || 'Spares'}</span>
          </div>

          <Link
            to={`/product/${product.slug || product.id}`}
            className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400 text-xs">
              <FaStar className="shrink-0" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating || 4.8}</span>
            <span className="text-[10px] text-slate-400">({product.reviewCount || 0})</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-display">
                ₹{formattedPrice}
              </span>
              {formattedOriginal && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{formattedOriginal}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-1.5">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleMoveToCart}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : isAdded
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow'
              }`}
            >
              {isOutOfStock ? (
                <span>Currently Unavailable</span>
              ) : isAdded ? (
                <>
                  <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Moved to Cart</span>
                </>
              ) : (
                <>
                  <FiShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </>
              )}
            </button>

            <Link
              to={`/product/${product.slug || product.id}`}
              className="w-full py-1.5 px-3 rounded-xl text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Product Details</span>
              <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
