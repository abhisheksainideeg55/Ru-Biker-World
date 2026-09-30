import React from 'react';
import WishlistItem from './WishlistItem';
import WishlistEmpty from './WishlistEmpty';

export const WishlistGrid = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return <WishlistEmpty />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => (
        <WishlistItem key={item.id || item.slug} product={item} />
      ))}
    </div>
  );
};

export default WishlistGrid;
