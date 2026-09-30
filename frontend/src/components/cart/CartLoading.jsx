import React from 'react';

export const CartLoading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      {/* Left Column: Items */}
      <div className="lg:col-span-8 space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 bg-white border border-slate-200 rounded-xl flex gap-4">
            <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/4 bg-slate-200 rounded" />
              <div className="h-8 w-28 bg-slate-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: Summary */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="space-y-3 pt-2">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded" />
          </div>
          <div className="h-12 bg-slate-200 rounded-xl mt-4" />
        </div>
      </div>
    </div>
  );
};

export default CartLoading;
