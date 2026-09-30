import React from 'react';

export const ProductGridSkeleton = ({ count = 8, viewMode = 'grid' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const gridClasses =
    viewMode === 'compact'
      ? 'grid grid-cols-1 lg:grid-cols-2 gap-4'
      : 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5';

  return (
    <div className={gridClasses} aria-label="Loading products" aria-busy="true">
      {skeletons.map((idx) => (
        <div
          key={idx}
          className="card-premium overflow-hidden bg-white p-3.5 sm:p-4 flex flex-col justify-between gap-3 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-square w-full bg-slate-200 rounded-xl mb-2" />

          <div className="space-y-2">
            {/* Brand / Category skeleton */}
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </div>

            {/* Title skeleton */}
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />

            {/* Rating skeleton */}
            <div className="h-3 w-24 bg-slate-200 rounded mt-1" />
          </div>

          {/* Pricing and button skeleton */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="h-5 w-20 bg-slate-200 rounded" />
            <div className="h-9 w-full bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
