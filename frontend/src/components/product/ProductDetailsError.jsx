import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiRotateCw, FiShoppingBag } from 'react-icons/fi';

export const ProductDetailsError = ({ onRetry }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-card my-8">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
        <FiAlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-black text-slate-900 mb-2 font-display">
        Unable to Load Product
      </h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        We encountered an error while loading the product details. Please try again or return to the shop catalog.
      </p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <FiRotateCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailsError;
