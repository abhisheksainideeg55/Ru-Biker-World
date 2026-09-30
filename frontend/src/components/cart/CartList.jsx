import React from 'react';
import { FiTrash2, FiBookmark, FiRefreshCw } from 'react-icons/fi';
import CartItem from './CartItem';
import { useCart } from '../../hooks/useCart';

export const CartList = ({ items = [] }) => {
  const { clearCart, saveForLaterList, moveToCart, removeSavedItem } = useCart();

  return (
    <div className="space-y-6">
      {/* Items Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">
          Cart Items <span className="text-sm font-semibold text-slate-500">({items.length})</span>
        </h2>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors p-1"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <CartItem
            key={item._id || item.productId || idx}
            item={item}
          />
        ))}
      </div>

      {/* Saved for Later Section */}
      {saveForLaterList && saveForLaterList.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <FiBookmark className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Saved for Later ({saveForLaterList.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {saveForLaterList.map((saved, idx) => {
              const prod = saved.product || {};
              const sId = saved._id || saved.productId || idx;
              return (
                <div
                  key={sId}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&auto=format&fit=crop&q=80'}
                      alt={prod.name || 'Saved Item'}
                      className="w-12 h-12 object-cover rounded-lg bg-white border border-slate-200"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-800 line-clamp-1">{prod.name || 'Motorcycle Spare Part'}</div>
                      <div className="text-xs text-slate-500 font-bold">₹{(prod.price || 0).toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveToCart(sId)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSavedItem(sId)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
