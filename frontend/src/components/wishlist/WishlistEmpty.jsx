import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export const WishlistEmpty = () => {
  return (
    <div className="py-12 px-6 rounded-3xl bg-white border border-slate-200 shadow-card text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto mb-4">
        <FiHeart className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h2 className="text-xl font-black text-slate-900 font-display">
        Your Wishlist is Empty
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Save products you love to build your dream motorcycle build, track stock, and order whenever you're ready.
      </p>

      <div className="pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-glow transition-all duration-200 active:scale-[0.98]"
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Explore Motorcycle Spares</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default WishlistEmpty;
