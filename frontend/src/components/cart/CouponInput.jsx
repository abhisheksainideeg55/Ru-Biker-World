import React, { useState } from 'react';
import { FiTag, FiCheck, FiX, FiPercent } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';

export const CouponInput = () => {
  const { coupon, discount, applyCoupon, removeCoupon, isLoading } = useCart();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApplied = !!(coupon && coupon.code && discount > 0);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await applyCoupon(code.trim().toUpperCase());
    setIsSubmitting(false);

    if (result && result.success) {
      setCode('');
    }
  };

  const handleQuickApply = async (promoCode) => {
    setIsSubmitting(true);
    await applyCoupon(promoCode);
    setIsSubmitting(false);
  };

  const handleRemove = async () => {
    setIsSubmitting(true);
    await removeCoupon();
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <FiTag className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Have a Promo Code?
        </span>
      </div>

      {isApplied ? (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <FiCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                {coupon.code} Applied
              </div>
              <div className="text-xs text-emerald-700 font-semibold">
                You saved ₹{discount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isSubmitting || isLoading}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-emerald-100/60 rounded-md transition-colors"
            title="Remove Coupon"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code (e.g. MOTO10)"
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm font-semibold uppercase bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!code.trim() || isSubmitting || isLoading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs sm:text-sm font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Apply'
            )}
          </button>
        </form>
      )}

      {/* Quick promotional chips */}
      {!isApplied && (
        <div className="pt-1">
          <div className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center gap-1">
            <FiPercent className="w-3 h-3 text-amber-500" />
            Available Offers:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { code: 'MOTO10', desc: '10% OFF (Min ₹999)' },
              { code: 'RIDE500', desc: '₹500 OFF (Min ₹2,999)' },
              { code: 'BIKE20', desc: '20% OFF Spares' },
            ].map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => handleQuickApply(p.code)}
                className="text-[11px] font-bold px-2 py-1 bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 text-slate-700 border border-slate-200 rounded-md transition-colors"
              >
                {p.code} <span className="font-normal text-slate-400">· {p.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
