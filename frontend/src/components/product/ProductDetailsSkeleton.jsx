import React from 'react';

export const ProductDetailsSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8 py-6">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 bg-slate-200 rounded-md" />

      {/* Main Product Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery Column */}
        <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 w-20">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-18 h-18 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="flex-1 aspect-square bg-slate-200 rounded-2xl" />
        </div>

        {/* Info Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-5 w-44 bg-slate-200 rounded" />
          <div className="h-10 w-48 bg-slate-200 rounded-lg" />
          <div className="h-16 w-full bg-slate-200 rounded-xl" />
          <div className="h-32 w-full bg-slate-200 rounded-2xl" />
          <div className="h-12 w-full bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-48 w-full bg-slate-200 rounded-2xl" />
    </div>
  );
};

export default ProductDetailsSkeleton;
