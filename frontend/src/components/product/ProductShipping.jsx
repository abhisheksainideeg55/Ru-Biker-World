import React from 'react';
import { FiTruck, FiShield, FiMapPin, FiRefreshCw } from 'react-icons/fi';

export const ProductShipping = ({ shipping = {}, returns = {} }) => {
  const {
    estimatedDays = '3–5 Business Days',
    freeShipping = true,
    description = 'Pan-India expedited shipping with real-time tracking via SMS and email.',
  } = shipping;

  const {
    eligible = true,
    days = 7,
    description: returnDesc = 'Hassle-free replacement if damaged or incorrect.',
  } = returns;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Shipping Card */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 text-brand-600 mb-2">
            <FiTruck className="w-5 h-5" />
            <h4 className="text-sm font-bold text-slate-900">
              Shipping & Delivery
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-brand-600" />
            <span>Estimated Delivery: <strong>{estimatedDays}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700">
            <FiShield className="w-4 h-4 text-emerald-600" />
            <span>{freeShipping ? 'Free Pan-India Delivery on orders above ₹999' : 'Standard Shipping Rates Apply'}</span>
          </div>
        </div>
      </div>

      {/* Returns Card */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 text-brand-600 mb-2">
            <FiRefreshCw className="w-5 h-5" />
            <h4 className="text-sm font-bold text-slate-900">
              Return & Replacement Policy
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {returnDesc}
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2 text-emerald-700">
            <FiShield className="w-4 h-4 text-emerald-600" />
            <span>{eligible ? `${days}-Day Hassle-Free Replacement Guarantee` : 'Non-Returnable Item'}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal">
            Must be uninstalled and in original packaging with seals intact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductShipping;
