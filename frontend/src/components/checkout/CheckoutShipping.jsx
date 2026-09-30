import React from 'react';
import { FiTruck, FiZap, FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';
import { useCart } from '../../hooks/useCart';

export const CheckoutShipping = ({ onBack, onContinue }) => {
  const { shippingMethod, selectShipping } = useCheckout();
  const { subtotal, calculateShipping } = useCart();

  const isFreeStandard = subtotal >= 999;

  const handleSelect = (method) => {
    selectShipping(method);
    calculateShipping && calculateShipping(null, method);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Choose Shipping Method</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select standard ground transport or priority express courier for your motorcycle parts.
        </p>
      </div>

      <div className="space-y-3">
        {/* Standard Delivery */}
        <label
          onClick={() => handleSelect('standard')}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
            shippingMethod === 'standard'
              ? 'border-amber-500 bg-amber-50/30 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <input
              type="radio"
              name="checkoutShipping"
              value="standard"
              checked={shippingMethod === 'standard'}
              onChange={() => handleSelect('standard')}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <FiTruck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Standard Surface Delivery</div>
              <div className="text-xs text-slate-500">Delivered within 3–7 business days</div>
            </div>
          </div>

          <div className="text-right">
            {isFreeStandard ? (
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                FREE
              </span>
            ) : (
              <span className="text-sm font-bold text-slate-900">₹99</span>
            )}
          </div>
        </label>

        {/* Express Delivery */}
        <label
          onClick={() => handleSelect('express')}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
            shippingMethod === 'express'
              ? 'border-amber-500 bg-amber-50/30 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <input
              type="radio"
              name="checkoutShipping"
              value="express"
              checked={shippingMethod === 'express'}
              onChange={() => handleSelect('express')}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <FiZap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Express Priority Air Courier</div>
              <div className="text-xs text-slate-500">Fast tracking within 1–3 business days</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold text-slate-900">₹199</span>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Address</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl shadow-sm transition-all text-xs sm:text-sm inline-flex items-center gap-1.5"
        >
          <span>Review Order & Pay</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CheckoutShipping;
