import React from 'react';
import { FiPackage, FiRefreshCw } from 'react-icons/fi';
import Button from '../common/Button';

export const EmptyProducts = ({ onClearAll }) => {
  return (
    <div className="card-premium p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-subtle my-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-2xs">
        <FiPackage className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 font-display">
        No Products Found
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        We couldn't find any motorcycle parts matching your currently applied filters or search keywords.
      </p>

      {/* Helpful suggestions list */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs text-slate-600 mb-6 max-w-md w-full space-y-1.5">
        <span className="font-bold text-slate-800 block mb-1">Try the following:</span>
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span>Removing or unchecking specific model filters</span>
        </p>
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span>Broadening or resetting your price range limits</span>
        </p>
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span>Selecting a different motorcycle make or category</span>
        </p>
      </div>

      {onClearAll && (
        <Button
          onClick={onClearAll}
          variant="primary"
          size="md"
          icon={FiRefreshCw}
          className="shadow-sm font-bold text-xs sm:text-sm py-2.5 px-6"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default EmptyProducts;
