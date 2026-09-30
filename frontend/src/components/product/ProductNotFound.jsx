import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export const ProductNotFound = () => {
  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-card my-8">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
        <FiSearch className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2 font-display">
        Product Not Found
      </h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The motorcycle part or accessory you're looking for doesn't exist or may have been updated.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductNotFound;
