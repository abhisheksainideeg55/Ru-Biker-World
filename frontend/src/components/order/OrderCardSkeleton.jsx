import React from 'react';

export const OrderCardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded" />
      </div>

      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-1/4 bg-slate-200 rounded" />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-slate-200 rounded-lg" />
          <div className="h-7 w-20 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-7 w-24 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
