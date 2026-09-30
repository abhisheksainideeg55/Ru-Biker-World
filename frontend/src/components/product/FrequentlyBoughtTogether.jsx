import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiShoppingBag, FiCheck } from 'react-icons/fi';
import ProductImage from './ProductImage';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';

export const FrequentlyBoughtTogether = ({
  mainProduct,
  bundleItems = [],
}) => {
  const { setCartItems } = useCart() || {};
  const { addToast } = useNotifications() || {};

  const allItems = [mainProduct, ...bundleItems].filter(Boolean);

  // Selected state map (all checked by default)
  const [selectedIds, setSelectedIds] = useState(() => {
    return allItems.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
  });

  const [isAdded, setIsAdded] = useState(false);

  if (!mainProduct || bundleItems.length === 0) return null;

  const toggleItem = (id) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedItems = allItems.filter((item) => selectedIds[item.id]);
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalOriginal = selectedItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price || 0),
    0
  );
  const totalSavings = totalOriginal - totalPrice;

  const handleAddBundleToCart = () => {
    if (selectedItems.length === 0) return;

    if (setCartItems) {
      setCartItems((prev) => {
        let updated = [...prev];
        selectedItems.forEach((product) => {
          const idx = updated.findIndex((item) => item.id === product.id);
          if (idx > -1) {
            updated[idx] = {
              ...updated[idx],
              quantity: (updated[idx].quantity || 1) + 1,
            };
          } else {
            updated.push({ ...product, quantity: 1 });
          }
        });
        return updated;
      });
    }

    setIsAdded(true);
    if (addToast) {
      addToast({
        type: 'success',
        message: `Added ${selectedItems.length} bundle items to cart!`,
      });
    }
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-card p-6 sm:p-8">
      <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display mb-1">
        Frequently Bought Together
      </h2>
      <p className="text-xs text-slate-500 mb-6">
        Riders who purchased this item also added these compatible essentials.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Products Visual Chain */}
        <div className="lg:col-span-8 flex flex-wrap items-center gap-3">
          {allItems.map((item, index) => {
            const isChecked = !!selectedIds[item.id];
            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <FiPlus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}

                <div
                  onClick={() => toggleItem(item.id)}
                  className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer bg-white flex flex-col items-center w-36 sm:w-44 select-none ${
                    isChecked
                      ? 'border-brand-500 shadow-md ring-2 ring-brand-500/10'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="w-24 h-24 sm:w-28 sm:h-28 mb-2">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      iconType={item.imageType || 'brake'}
                      aspectRatio="aspect-square"
                      className="w-full h-full border-none bg-transparent p-1"
                    />
                  </div>

                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-0.5">
                    {item.brand}
                  </span>
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-slate-900 text-center line-clamp-2 hover:text-brand-600 mb-1.5"
                    title={item.name}
                  >
                    {item.name}
                  </Link>
                  <span className="text-sm font-black text-slate-900 font-display">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bundle Summary & CTA Box */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Bundle Price
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              {totalSavings > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{totalOriginal.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {totalSavings > 0 && (
              <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded mt-1">
                Save ₹{totalSavings.toLocaleString('en-IN')} on this combo
              </span>
            )}
            <p className="text-xs text-slate-500 mt-2">
              Includes {selectedItems.length} selected items
            </p>
          </div>

          <button
            type="button"
            disabled={selectedItems.length === 0}
            onClick={handleAddBundleToCart}
            className={`
              w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-500/20
              ${
                selectedItems.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-surface-900 hover:bg-brand-600 text-white shadow-md'
              }
            `}
          >
            {isAdded ? (
              <>
                <FiCheck className="w-4 h-4 stroke-[3]" />
                <span>Added Combo to Cart</span>
              </>
            ) : (
              <>
                <FiShoppingBag className="w-4 h-4" />
                <span>Add Selected ({selectedItems.length}) to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FrequentlyBoughtTogether;
