import React from 'react';
import { FiX } from 'react-icons/fi';

export const ActiveFilters = ({
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
}) => {
  if (!activeFilters || activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 pb-3 border-b border-slate-100 animate-fadeIn">
      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1">
        Active Filters:
      </span>

      {activeFilters.map((chip, idx) => (
        <button
          key={chip.id || `${chip.type}-${chip.value}-${idx}`}
          type="button"
          onClick={() => onRemoveFilter(chip.type, chip.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 hover:bg-brand-100 hover:border-brand-300 transition-colors group"
        >
          <span>{chip.label}</span>
          <FiX className="w-3.5 h-3.5 text-brand-500 group-hover:text-brand-800" />
        </button>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-slate-500 hover:text-brand-600 hover:underline px-2 py-1 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;
