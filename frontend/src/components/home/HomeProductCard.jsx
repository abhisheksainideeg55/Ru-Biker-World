import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiShoppingBag, 
  FiCheck 
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import ProductImage from '../product/ProductImage';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';

export const HomeProductCard = ({ product }) => {
  const { addToCart } = useCart() || {};
  const { wishlistItems = [], setWishlistItems } = useWishlist() || {};
  const { addToast } = useNotifications() || {};

  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;
    setIsAdding(true);

    if (addToCart) {
      await addToCart(product, 1, null, true);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
    setIsAdding(false);
  };

  const { isAuthenticated } = useAuth() || {};
  const navigate = useNavigate();

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      if (addToast) {
        addToast({
          type: 'warning',
          message: 'Please login to save products to your wishlist.',
        });
      }
      navigate(`/login?redirect=${encodeURIComponent(`/product/${product.slug || product.id}`)}`);
      return;
    }

    if (setWishlistItems) {
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
    }
  };

  const formattedPrice = Number(product.price).toLocaleString('en-IN');
  const formattedOriginal = product.originalPrice
    ? Number(product.originalPrice).toLocaleString('en-IN')
    : null;

  return (
    <div className="group relative card-premium flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-brand-500/50 hover:shadow-elevated bg-white h-full w-full">
      {/* Top Media Product Image Box */}
      <div className="relative w-full shrink-0">
        <Link to={`/product/${product.slug || product.id}`} className="block">
          <ProductImage
            src={product.image}
            alt={product.name}
            iconType={product.iconType || 'brake'}
            aspectRatio="aspect-square"
          />
        </Link>

        {/* Badge Indicator */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span className={`inline-block text-[9px] sm:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm ${product.badgeColor || 'bg-brand-600 text-white'}`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`
            absolute top-2.5 right-2.5 z-20 p-2 rounded-xl transition-all duration-200 shadow-sm focus:outline-none
            ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white'
            }
          `}
        >
          <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Compatibility Pill Tag */}
        {product.compatibility && (
          <div className="absolute bottom-2 left-2 right-2 z-10 text-center">
            <span className="inline-block max-w-full truncate text-[9px] text-slate-600 bg-white/95 backdrop-blur-sm border border-slate-200/60 px-2 py-0.5 rounded-full font-medium shadow-2xs">
              {product.compatibility}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col flex-1">
          {/* Brand & Category Header */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 min-h-[1rem]">
            <span className="text-brand-600 font-bold truncate max-w-[60%]">{product.brand}</span>
            <span className="truncate max-w-[38%] text-slate-400">{product.category}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug || product.id}`}
            className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mt-2 min-h-[1.125rem]">
            <div className="flex items-center text-amber-400 text-xs">
              <FaStar className="shrink-0" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviews})</span>
          </div>
        </div>

        {/* Pricing & Stock Row */}
        <div className="border-t border-slate-100 pt-2.5 mt-auto">
          <div className="flex items-baseline justify-between mb-2 min-h-[1.5rem]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 font-display">
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

          {/* Add to Cart CTA Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`
              w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-500/20
              ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-surface-900 text-white hover:bg-brand-600 hover:shadow-glow'
              }
            `}
          >
            {isAdded ? (
              <>
                <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <FiShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeProductCard;
