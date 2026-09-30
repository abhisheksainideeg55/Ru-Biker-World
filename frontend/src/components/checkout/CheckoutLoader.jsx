import React from 'react';

export const CheckoutLoader = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-8 space-y-6">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-100 rounded-xl" />
            <div className="h-32 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="space-y-2.5">
            <div className="h-4 bg-slate-100 rounded" />
            <div className="h-4 bg-slate-100 rounded" />
            <div className="h-4 bg-slate-100 rounded" />
          </div>
          <div className="h-12 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutLoader;
