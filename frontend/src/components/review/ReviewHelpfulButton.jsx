import React, { useState } from 'react';
import { FiThumbsUp } from 'react-icons/fi';

export const ReviewHelpfulButton = ({ reviewId, helpfulCount = 0, onVote }) => {
  const [isVoted, setIsVoted] = useState(false);
  const [count, setCount] = useState(helpfulCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await onVote(reviewId);
      if (res && res.success) {
        setIsVoted(res.data?.isHelpful);
        setCount(res.data?.helpfulCount);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
        isVoted
          ? 'bg-amber-50 text-amber-800 border border-amber-300'
          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
      }`}
    >
      <FiThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-amber-400 text-amber-700' : ''}`} />
      <span>Helpful</span>
      {count > 0 && <span className="font-mono text-[11px] text-slate-500">({count})</span>}
    </button>
  );
};

export default ReviewHelpfulButton;
