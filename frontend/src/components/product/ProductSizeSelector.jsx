import React from 'react';

export const ProductSizeSelector = ({
  sizes = ['Medium', 'Large', 'Extra Large', 'Double Extra Large'],
  selectedSize,
  onSelectSize,
}) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-2.5 pt-2">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-bold text-slate-800 tracking-tight">Accessory Size</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isDoubleExtraLarge = size.toLowerCase().includes('double');

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`
                min-h-[42px] px-4 sm:px-5 py-2 rounded-md font-semibold text-xs sm:text-sm transition-all duration-150 active:scale-[0.98] border focus:outline-none
                ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs font-bold'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                }
                ${isDoubleExtraLarge ? 'uppercase text-[11px] sm:text-xs tracking-wider' : ''}
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSizeSelector;
