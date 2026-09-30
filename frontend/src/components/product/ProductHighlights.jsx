import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

export const ProductHighlights = ({ highlights = [] }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
        Product Highlights
      </h3>
      <ul className="space-y-2">
        {highlights.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductHighlights;
