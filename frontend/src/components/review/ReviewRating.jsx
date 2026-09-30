import React from 'react';
import { FiStar } from 'react-icons/fi';

export const ReviewRating = ({
  value = 5,
  onChange,
  size = 'md',
  showText = false,
  readOnly = true,
}) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} out of 5 stars`}>
        {stars.map((star) => {
          const isFilled = star <= Math.round(value);
          if (readOnly) {
            return (
              <FiStar
                key={star}
                className={`${sizeClasses[size]} ${
                  isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                }`}
              />
            );
          }

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange && onChange(star)}
              aria-label={`${star} Star${star > 1 ? 's' : ''}`}
              className="p-1 -m-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
            >
              <FiStar
                className={`${sizeClasses[size]} ${
                  isFilled ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300 hover:fill-amber-200'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showText && (
        <span className="text-xs font-bold text-slate-700 ml-1 font-mono">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default ReviewRating;
