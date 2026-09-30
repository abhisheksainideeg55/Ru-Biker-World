import React from 'react';

export const Price = ({
  amount = 0,
  originalAmount,
  currency = '₹',
  size = 'md',
  showDiscount = true,
  className = '',
}) => {
  const formattedAmount = Number(amount).toLocaleString('en-IN');
  const formattedOriginal = originalAmount ? Number(originalAmount).toLocaleString('en-IN') : null;
  
  const discountPercent = originalAmount && originalAmount > amount
    ? Math.round(((originalAmount - amount) / originalAmount) * 100)
    : 0;

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl font-extrabold',
  };

  return (
    <div className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`text-slate-900 ${sizeClasses[size] || sizeClasses.md}`}>
        {currency}{formattedAmount}
      </span>
      {formattedOriginal && originalAmount > amount && (
        <span className="text-xs text-slate-400 line-through">
          {currency}{formattedOriginal}
        </span>
      )}
      {showDiscount && discountPercent > 0 && (
        <span className="text-xs font-bold text-emerald-600">
          {discountPercent}% OFF
        </span>
      )}
    </div>
  );
};

export default Price;
