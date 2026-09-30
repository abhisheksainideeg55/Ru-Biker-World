import React from 'react';
import { Link } from 'react-router-dom';
import { AccountLayout } from '../../components/account';
import { FiStar, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export const ReviewsPage = () => {
  return (
    <AccountLayout breadcrumbs={[{ label: 'My Reviews', path: null }]}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
            <FiStar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 font-display">
              My Product Reviews
            </h1>
            <p className="text-xs text-slate-500">
              Your verified motorcycle spare part ratings, fitment feedback, and photos.
            </p>
          </div>
        </div>

        <div className="py-14 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FiStar className="w-7 h-7" />
          </div>
          <h2 className="text-base font-black text-slate-900 font-display mb-1">
            No Reviews Yet
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            You haven't reviewed any products yet. After receiving your orders, share your ride review to help other riders.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-glow transition-all duration-200 active:scale-[0.98]"
          >
            <span>Explore Parts & Accessories</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AccountLayout>
  );
};

export default ReviewsPage;
