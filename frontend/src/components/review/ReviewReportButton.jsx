import React, { useState } from 'react';
import { FiFlag, FiX } from 'react-icons/fi';

export const ReviewReportButton = ({ reviewId, onReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('Spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onReport(reviewId, reason, details);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
        title="Report inappropriate review"
      >
        <FiFlag className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Report</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Report Review</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for reporting</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="Spam">Spam or promotional advertising</option>
                  <option value="Offensive">Offensive or abusive language</option>
                  <option value="Fake Review">Fake review or competitor tampering</option>
                  <option value="Irrelevant">Irrelevant to the product</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Additional details (Optional)</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explain why this review violates community standards..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewReportButton;
