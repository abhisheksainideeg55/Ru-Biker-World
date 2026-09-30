import React from 'react';
import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

export const Rating = ({
  value = 0,
  max = 5,
  reviewCount,
  size = 'sm',
  showValue = true,
  className = '',
}) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} className="text-amber-400 shrink-0" />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-400 shrink-0" />);
    } else {
      stars.push(<FiStar key={i} className="text-slate-300 shrink-0" />);
    }
  }

  const iconSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className={`flex items-center ${iconSizes[size] || iconSizes.sm}`}>
        {stars}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-700">
          {Number(value).toFixed(1)}
        </span>
      )}
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-slate-400">({reviewCount})</span>
      )}
    </div>
  );
};

export default Rating;
