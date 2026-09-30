import React from 'react';

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
  xl: 'w-14 h-14 border-4',
};

const colorMap = {
  brand: 'border-brand-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  dark: 'border-slate-800 border-t-transparent',
};

export const Spinner = ({
  size = 'md',
  color = 'brand',
  className = '',
}) => {
  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeMap[size] || sizeMap.md} ${colorMap[color] || colorMap.brand} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};

export default Spinner;
