import React from 'react';
import ProductCard from './ProductCard';

export const ProductGrid = ({
  products = [],
  viewMode = 'grid',
  className = '',
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  const gridClasses =
    viewMode === 'compact'
      ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch'
      : 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 items-stretch';

  return (
    <div className={`${gridClasses} ${className}`} role="feed" aria-label="Product list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          compact={viewMode === 'compact'}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
