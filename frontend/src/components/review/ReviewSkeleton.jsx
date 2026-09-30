import React from 'react';

export const ReviewSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200" />
        <div className="space-y-1.5 flex-1">
          <div className="w-28 h-3.5 bg-slate-200 rounded-md" />
          <div className="w-20 h-2.5 bg-slate-100 rounded-md" />
        </div>
      </div>
      <div className="w-1/3 h-4 bg-slate-200 rounded-md" />
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded-md" />
        <div className="w-4/5 h-3 bg-slate-100 rounded-md" />
      </div>
      <div className="w-24 h-6 bg-slate-100 rounded-xl" />
    </div>
  );
};

export default ReviewSkeleton;
