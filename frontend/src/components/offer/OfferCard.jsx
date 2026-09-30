import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCopy, FiCheck, FiClock, FiArrowRight, FiTag } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';

export const OfferCard = ({ offer }) => {
  const { addToast } = useNotifications() || {};
  const [isCopied, setIsCopied] = useState(false);

  if (!offer) return null;

  const handleCopy = () => {
    if (offer.couponCode) {
      navigator.clipboard.writeText(offer.couponCode);
      setIsCopied(true);
      if (addToast) {
        addToast({ type: 'success', message: `Coupon ${offer.couponCode} copied to clipboard!` });
      }
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const expiryDate = new Date(offer.expiryDate);
  const now = new Date();
  const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:border-slate-300 transition-all duration-300 flex flex-col group h-full w-full">
      {/* Banner Media */}
      <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
        <img
          src={offer.bannerImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Floating Discount Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg inline-flex items-center gap-1.5">
            <FiTag className="w-4 h-4 fill-slate-950" />
            <span>{offer.discountText}</span>
          </span>
        </div>

        {/* Expiry Pill */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg border border-white/10 inline-flex items-center gap-1">
            <FiClock className="w-3.5 h-3.5 text-amber-400" />
            <span>{diffDays > 0 ? `${diffDays} days left` : 'Ends soon'}</span>
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display line-clamp-2">
            {offer.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {offer.description}
          </p>

          {/* Applicable Tags */}
          {offer.applicableCategories && offer.applicableCategories.length > 0 && (
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-slate-400">Valid On:</span>
              {offer.applicableCategories.map((cat, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Coupon Code Strip & CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {offer.couponCode ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl font-mono text-xs font-black text-amber-900 select-all">
                {offer.couponCode}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                title="Copy Coupon Code"
              >
                {isCopied ? (
                  <FiCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <FiCopy className="w-4 h-4" />
                )}
              </button>
            </div>
          ) : (
            <div />
          )}

          <Link
            to="/shop"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Shop Now</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
