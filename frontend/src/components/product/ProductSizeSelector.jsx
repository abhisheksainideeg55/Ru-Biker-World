import React, { useState } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';

const DEFAULT_SIZES = [
  { label: 'Small', name: 'Small', cm: '55-56 cm' },
  { label: 'Medium', name: 'Medium', cm: '57-58 cm' },
  { label: 'Large', name: 'Large', cm: '59-60 cm' },
  { label: 'Extra Large', name: 'Extra Large', cm: '61-62 cm' },
  { label: 'Double Extra Large', name: 'Double Extra Large', cm: '63-64 cm' },
];

export const ProductSizeSelector = ({
  sizes,
  selectedSize,
  onSelectSize,
  isHelmet = true,
}) => {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Normalize sizes into standard format
  const sizeList = React.useMemo(() => {
    if (Array.isArray(sizes) && sizes.length > 0) {
      return sizes.map((s) => {
        if (typeof s === 'object' && s !== null) return s;
        const str = String(s).trim();
        const matched = DEFAULT_SIZES.find(
          (d) =>
            d.label.toLowerCase() === str.toLowerCase() ||
            d.name.toLowerCase() === str.toLowerCase() ||
            (str.length <= 3 && d.name.toLowerCase().startsWith(str.toLowerCase()))
        );
        if (matched) return matched;
        return { label: str, name: str, cm: '' };
      });
    }
    return DEFAULT_SIZES.slice(0, 4); // Small, Medium, Large, Extra Large
  }, [sizes]);

  const currentSelectedStr = typeof selectedSize === 'object' && selectedSize !== null
    ? selectedSize.name || selectedSize.label
    : String(selectedSize || 'Medium');

  return (
    <div className="space-y-3 pt-2">
      {/* Title */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-bold text-slate-800 text-sm tracking-tight">
          Accessory Size
        </span>

        <button
          type="button"
          onClick={() => setShowSizeGuide(true)}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-black transition-colors cursor-pointer"
        >
          <FiInfo className="w-3.5 h-3.5 text-slate-400" />
          <span className="underline decoration-dotted text-[11px]">Size Guide</span>
        </button>
      </div>

      {/* Size Option Pills */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {sizeList.map((item) => {
          const isSelected =
            currentSelectedStr.toLowerCase() === item.name.toLowerCase() ||
            currentSelectedStr.toLowerCase() === item.label.toLowerCase() ||
            currentSelectedStr.toLowerCase().startsWith(item.label.toLowerCase());

          const isExtraLarge = item.label.toLowerCase().includes('extra');

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelectSize(item.name || item.label)}
              className={`
                min-h-[44px] px-5 py-2 rounded-lg text-center transition-all duration-150 border cursor-pointer select-none active:scale-[0.98] focus:outline-none
                ${
                  isSelected
                    ? 'bg-black text-white border-black font-bold shadow-xs'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-black font-medium'
                }
                ${isExtraLarge ? 'text-xs' : 'text-xs sm:text-sm'}
              `}
            >
              {item.label === 'Extra Large' ? (
                <div className="leading-tight text-center">
                  <div>Extra</div>
                  <div>Large</div>
                </div>
              ) : item.label === 'Double Extra Large' ? (
                <div className="leading-tight text-center text-[10px]">
                  <div>Double</div>
                  <div>Extra Large</div>
                </div>
              ) : (
                item.label
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 italic">
        💡 Tip: Measure your head circumference just above the eyebrows for the perfect fit.
      </p>

      {/* Modal / Size Guide Popup */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <span>📏</span>
              <span>Motorcycle Helmet Sizing Chart</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Wrap a flexible measuring tape around your head approximately 1 inch (2.5 cm) above your eyebrows and ears.
            </p>

            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Head Circumference (cm)</th>
                    <th className="py-2.5 px-3">Inches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-900">Small (S)</td>
                    <td className="py-2 px-3 text-slate-600">55 – 56 cm</td>
                    <td className="py-2 px-3 text-slate-500">21.6" – 22.0"</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-900">Medium (M)</td>
                    <td className="py-2 px-3 text-slate-600">57 – 58 cm</td>
                    <td className="py-2 px-3 text-slate-500">22.4" – 22.8"</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-900">Large (L)</td>
                    <td className="py-2 px-3 text-slate-600">59 – 60 cm</td>
                    <td className="py-2 px-3 text-slate-500">23.2" – 23.6"</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-900">Extra Large (XL)</td>
                    <td className="py-2 px-3 text-slate-600">61 – 62 cm</td>
                    <td className="py-2 px-3 text-slate-500">24.0" – 24.4"</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-900">2X Large (XXL)</td>
                    <td className="py-2 px-3 text-slate-600">63 – 64 cm</td>
                    <td className="py-2 px-3 text-slate-500">24.8" – 25.2"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSizeSelector;
