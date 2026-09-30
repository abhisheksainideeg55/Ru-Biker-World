import React from 'react';
import { FiStar } from 'react-icons/fi';

export const ReviewEmptyState = ({ onWriteReview, isEligible, isAuthenticated }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/50 flex items-center justify-center mx-auto">
        <FiStar className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900">No reviews yet for this product</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        Be the first verified customer to share performance, fitment, and ride experience for your fellow motorcyclists.
      </p>

      {isAuthenticated && isEligible && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onWriteReview}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5"
          >
            <FiStar className="w-3.5 h-3.5 fill-slate-950" />
            <span>Write the First Review</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewEmptyState;
