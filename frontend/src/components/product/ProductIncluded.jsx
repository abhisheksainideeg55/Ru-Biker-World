import React from 'react';
import { FiPackage, FiCheck } from 'react-icons/fi';

export const ProductIncluded = ({ included = [] }) => {
  if (!included || included.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <FiPackage className="w-4 h-4 text-brand-600" />
        <span>What's In The Box</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {included.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FiCheck className="w-3 h-3 stroke-[3]" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductIncluded;
