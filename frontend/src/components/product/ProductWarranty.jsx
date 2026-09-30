import React from 'react';
import { FiShield, FiCheckCircle } from 'react-icons/fi';

export const ProductWarranty = ({ warranty = {} }) => {
  const {
    available = true,
    duration = '6 Months',
    description = 'Covers manufacturer defects and material failure under normal operating conditions.',
  } = warranty;

  if (!available) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        Standard manufacturer warranty information is currently not specified for this item.
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-200/60">
          <FiShield className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Official Warranty Protection
          </span>
          <h4 className="text-base font-black text-slate-900">
            {duration} Replacement Warranty
          </h4>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
        {description}
      </p>

      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1.5 text-emerald-700">
          <FiCheckCircle className="w-4 h-4 text-emerald-600" />
          Manufacturing Defects Covered
        </span>
        <span className="flex items-center gap-1.5 text-emerald-700">
          <FiCheckCircle className="w-4 h-4 text-emerald-600" />
          Genuine MotoZone Authenticity
        </span>
      </div>
    </div>
  );
};

export default ProductWarranty;
