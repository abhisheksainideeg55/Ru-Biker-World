import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

export const ProductQuantity = ({
  quantity = 1,
  maxStock = 99,
  disabled = false,
  onChange,
}) => {
  const handleDecrease = () => {
    if (quantity > 1 && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxStock && !disabled) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
        Quantity:
      </span>
      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-2xs">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || quantity <= 1}
          aria-label="Decrease quantity"
          className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:text-brand-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <FiMinus className="w-3.5 h-3.5" />
        </button>

        <span className="w-10 text-center font-bold text-sm text-slate-900 select-none">
          {disabled ? 0 : quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || quantity >= maxStock}
          aria-label="Increase quantity"
          className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:text-brand-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <FiPlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {maxStock <= 5 && maxStock > 0 && (
        <span className="text-xs font-semibold text-amber-600">
          Max {maxStock} available
        </span>
      )}
    </div>
  );
};

export default ProductQuantity;
