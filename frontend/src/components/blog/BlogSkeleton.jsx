import React from 'react';

export const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-16/10 bg-slate-200" />
      <div className="p-6 space-y-3">
        <div className="w-24 h-3 bg-slate-200 rounded-md" />
        <div className="w-full h-5 bg-slate-200 rounded-md" />
        <div className="w-4/5 h-3 bg-slate-100 rounded-md" />
        <div className="w-3/5 h-3 bg-slate-100 rounded-md" />
        <div className="pt-3 border-t border-slate-100 flex justify-between">
          <div className="w-20 h-3 bg-slate-100 rounded-md" />
          <div className="w-16 h-3 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
