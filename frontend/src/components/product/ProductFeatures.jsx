import React from 'react';
import { FiCheck } from 'react-icons/fi';

export const ProductFeatures = ({ features = [] }) => {
  if (!features || features.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((feature, idx) => (
        <li
          key={idx}
          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 font-medium"
        >
          <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <FiCheck className="w-3 h-3 stroke-[3]" />
          </span>
          <span className="leading-snug">{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default ProductFeatures;
