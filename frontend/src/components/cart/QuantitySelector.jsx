import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

export const QuantitySelector = ({
  quantity = 1,
  min = 1,
  max = 10,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  allowZero = true,
}) => {
  const currentQty = parseInt(quantity, 10) || min;

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (currentQty <= min) {
      if (allowZero) {
        onChange && onChange(0);
      }
      return;
    }
    onChange && onChange(currentQty - 1);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || currentQty >= max) return;
    onChange && onChange(currentQty + 1);
  };

  const handleInputChange = (e) => {
    e.stopPropagation();
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    if (val <= 0 && allowZero) {
      onChange && onChange(0);
      return;
    }
    const clamped = Math.max(min, Math.min(val, max));
    onChange && onChange(clamped);
  };

  const sizeStyles = {
    sm: {
      btn: 'w-7 h-7 text-xs',
      input: 'w-8 h-7 text-xs font-semibold',
      container: 'h-7',
    },
    md: {
      btn: 'w-8 h-8 text-sm',
      input: 'w-10 h-8 text-sm font-bold',
      container: 'h-8',
    },
    lg: {
      btn: 'w-10 h-10 text-base',
      input: 'w-12 h-10 text-base font-bold',
      container: 'h-10',
    },
  };

  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden shadow-xs select-none ${s.container} ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || (!allowZero && currentQty <= min)}
        aria-label="Decrease quantity"
        className={`${s.btn} flex items-center justify-center text-slate-600 hover:text-amber-500 hover:bg-slate-200/60 active:bg-slate-300 disabled:opacity-35 disabled:cursor-not-allowed transition-colors`}
      >
        <FiMinus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={currentQty}
        onChange={handleInputChange}
        disabled={disabled}
        className={`${s.input} text-center bg-white text-slate-800 border-x border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || currentQty >= max}
        aria-label="Increase quantity"
        className={`${s.btn} flex items-center justify-center text-slate-600 hover:text-amber-500 hover:bg-slate-200/60 active:bg-slate-300 disabled:opacity-35 disabled:cursor-not-allowed transition-colors`}
      >
        <FiPlus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
