import React, { useState } from 'react';
import { FiCheck, FiInfo, FiX } from 'react-icons/fi';

const DEFAULT_HELMET_SIZES = [
  { label: 'S', name: 'Small', cm: '55-56 cm' },
  { label: 'M', name: 'Medium', cm: '57-58 cm' },
  { label: 'L', name: 'Large', cm: '59-60 cm' },
  { label: 'XL', name: 'Extra Large', cm: '61-62 cm' },
  { label: 'XXL', name: '2X Large', cm: '63-64 cm' },
];

export const ProductSizeSelector = ({
  sizes,
  selectedSize,
  onSelectSize,
  isHelmet = true,
}) => {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Normalize sizes into rich objects
  const sizeList = React.useMemo(() => {
    if (Array.isArray(sizes) && sizes.length > 0) {
      return sizes.map((s) => {
        if (typeof s === 'object' && s !== null) return s;
        const str = String(s).trim();
        const matched = DEFAULT_HELMET_SIZES.find(
          (d) => d.label.toLowerCase() === str.toLowerCase() || d.name.toLowerCase() === str.toLowerCase() || str.toLowerCase().includes(d.label.toLowerCase())
        );
        if (matched) return matched;
        return { label: str, name: str, cm: '' };
      });
    }
    return DEFAULT_HELMET_SIZES;
  }, [sizes]);

  const currentSelectedStr = typeof selectedSize === 'object' && selectedSize !== null
    ? selectedSize.label || selectedSize.name
    : String(selectedSize || sizeList[1]?.name || 'Medium');

  return (
    <div className="space-y-3 pt-2">
      {/* Header & Size Guide Trigger */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 tracking-tight">
            {isHelmet ? 'Select Helmet Size' : 'Select Size'}
          </span>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {currentSelectedStr}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowSizeGuide(true)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
        >
          <FiInfo className="w-3.5 h-3.5 text-amber-500" />
          <span className="underline decoration-dotted">Size Guide (cm)</span>
        </button>
      </div>

      {/* Size Option Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {sizeList.map((item) => {
          const isSelected =
            currentSelectedStr.toLowerCase() === item.label.toLowerCase() ||
            currentSelectedStr.toLowerCase() === item.name.toLowerCase() ||
            currentSelectedStr.toLowerCase().includes(item.label.toLowerCase());

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelectSize(item.name || item.label)}
              className={`
                relative py-2.5 px-3 rounded-xl text-center transition-all duration-200 border cursor-pointer select-none active:scale-[0.98]
                ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/50'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }
              `}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-black shadow-xs">
                  <FiCheck className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              <div className="text-xs sm:text-sm font-extrabold uppercase">{item.label}</div>
              {item.cm && (
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-300 font-medium' : 'text-slate-500'}`}>
                  {item.cm}
                </div>
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
