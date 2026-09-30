import React, { useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import FilterSidebar from './FilterSidebar';
import Button from '../common/Button';

export const FilterDrawer = ({
  isOpen = false,
  onClose,
  filters = {},
  onToggleFilter,
  onSetSingleFilter,
  onSetPriceRange,
  onClearAll,
  totalCount = 0,
}) => {
  // Body scroll lock & ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter products drawer"
      className="fixed inset-0 z-50 overflow-hidden lg:hidden"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-in Right Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full w-full sm:w-96 bg-white shadow-2xl z-10 flex flex-col animate-slideLeft">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-display">
              Filter Products
            </h3>
            <p className="text-[11px] text-slate-500">
              {totalCount} products match current criteria
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
            aria-label="Close filter drawer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar
            filters={filters}
            onToggleFilter={onToggleFilter}
            onSetSingleFilter={onSetSingleFilter}
            onSetPriceRange={onSetPriceRange}
            onClearAll={onClearAll}
            className="border-none shadow-none p-0"
          />
        </div>

        {/* Bottom Sticky Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={onClearAll}
            className="flex-1 btn-outline text-xs py-2.5 font-bold"
          >
            Clear All
          </button>
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={FiCheck}
            onClick={onClose}
            className="flex-1 text-xs py-2.5 font-bold shadow-sm"
          >
            Show ({totalCount})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
