import React from 'react';

export const NotificationSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200 animate-pulse flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-1/3 h-3.5 bg-slate-200 rounded-md" />
        <div className="w-full h-3 bg-slate-100 rounded-md" />
        <div className="w-1/5 h-2.5 bg-slate-100 rounded-md" />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
