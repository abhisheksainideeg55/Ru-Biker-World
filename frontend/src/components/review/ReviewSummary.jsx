import React from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';
import ReviewRating from './ReviewRating';

export const ReviewSummary = ({ summary = {}, onWriteReview, isEligible, isAuthenticated }) => {
  const { average = 0, total = 0, distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } } = summary;

  const starOrder = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      {/* Left rating score */}
      <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r md:border-slate-100 md:pr-6">
        <div className="flex items-baseline justify-center md:justify-start gap-2">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 font-display">
            {average > 0 ? average.toFixed(1) : '5.0'}
          </span>
          <span className="text-slate-400 font-bold text-sm">/ 5.0</span>
        </div>

        <ReviewRating value={average > 0 ? average : 5} size="md" />

        <p className="text-xs text-slate-500">
          Based on <strong className="text-slate-900">{total}</strong> verified rider review{total === 1 ? '' : 's'}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onWriteReview}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2"
          >
            <FiStar className="w-3.5 h-3.5 fill-slate-950" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Right star distribution bars */}
      <div className="md:col-span-8 space-y-2">
        {starOrder.map((star) => {
          const count = distribution[star] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-bold text-slate-700 shrink-0 flex items-center gap-1">
                <span>{star}</span>
                <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>

              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-12 text-right text-slate-400 font-mono text-[11px] shrink-0">
                {count} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSummary;
