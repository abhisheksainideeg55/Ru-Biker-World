import React, { useState } from 'react';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';

export const AddToCartButton = ({
  product,
  productId,
  quantity = 1,
  selectedVariant = null,
  openDrawer = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'icon' | 'compact'
  size = 'md', // 'sm' | 'md' | 'lg'
  showIcon = true,
  label = 'Add to Cart',
  addedLabel = 'Added to Cart',
  className = '',
  disabled = false,
}) => {
  const { addToCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const targetId = productId || product?.id || product?._id;
  const isAvailable = product?.stock !== false && (product?.stockCount ?? 1) > 0;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting || disabled || !isAvailable || !targetId) return;

    setIsSubmitting(true);
    const result = await addToCart(targetId, quantity, selectedVariant, openDrawer);
    setIsSubmitting(false);

    if (result && result.success) {
      setIsJustAdded(true);
      setTimeout(() => setIsJustAdded(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-md gap-1.5',
    md: 'px-4 py-2.5 text-sm font-bold rounded-lg gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-xl gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold shadow-sm hover:shadow transition-all',
    secondary:
      'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold transition-all',
    outline:
      'border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-800 hover:text-amber-600 font-semibold transition-all',
    compact:
      'px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-md',
    icon: 'p-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 rounded-lg shadow-sm',
  };

  if (!isAvailable) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 ${sizeClasses[size]} ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting || disabled}
        aria-label="Add to cart"
        className={`inline-flex items-center justify-center transition-all ${variantClasses.icon} ${className}`}
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
        ) : isJustAdded ? (
          <FiCheck className="w-4 h-4 text-slate-950" />
        ) : (
          <FiShoppingCart className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting || disabled}
      className={`inline-flex items-center justify-center select-none ${sizeClasses[size]} ${variantClasses[variant]} ${
        isSubmitting ? 'opacity-80 cursor-wait' : ''
      } ${className}`}
    >
      {isSubmitting ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Adding...</span>
        </>
      ) : isJustAdded ? (
        <>
          <FiCheck className="w-4 h-4 text-emerald-800" />
          <span className="text-emerald-950">{addedLabel}</span>
        </>
      ) : (
        <>
          {showIcon && <FiShoppingCart className="w-4 h-4" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
