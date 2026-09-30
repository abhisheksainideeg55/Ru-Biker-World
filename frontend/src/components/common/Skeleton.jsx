import React from 'react';

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'card':
        return 'rounded-xl h-48 w-full';
      case 'button':
        return 'rounded-lg h-10 w-28';
      case 'text':
      default:
        return 'rounded-md h-4 w-full';
    }
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      style={{ width, height }}
      className={`animate-pulse bg-slate-200/80 ${getVariantStyles()} ${className}`}
    />
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-2">{skeletons}</div>;
};

export default Skeleton;
