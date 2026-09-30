import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

export const CheckoutError = ({ error, onRetry }) => {
  return (
    <div className="p-6 sm:p-8 bg-white border border-rose-200 rounded-2xl text-center max-w-lg mx-auto space-y-4 shadow-sm">
      <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
        <FiAlertTriangle className="w-7 h-7" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900">Checkout Issue Encountered</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {error || 'An unexpected error occurred while processing your checkout session.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/cart"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutError;
