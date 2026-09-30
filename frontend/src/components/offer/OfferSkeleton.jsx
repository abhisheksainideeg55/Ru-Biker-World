import React from 'react';

export const OfferSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-16/9 bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="w-2/3 h-5 bg-slate-200 rounded-md" />
        <div className="w-full h-3 bg-slate-100 rounded-md" />
        <div className="w-4/5 h-3 bg-slate-100 rounded-md" />
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="w-28 h-8 bg-slate-200 rounded-xl" />
          <div className="w-24 h-8 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default OfferSkeleton;
