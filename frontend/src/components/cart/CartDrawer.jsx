import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Drawer from '../common/Drawer';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer, items, subtotal, cartCount } = useCart();
  const { user, isAuthenticated } = useAuth() || {};
  const navigate = useNavigate();

  const isUserBlocked = Boolean(isAuthenticated && user && user.isActive === false);

  const handleNavigateToCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  const handleNavigateToCheckout = () => {
    if (isUserBlocked) return;
    closeDrawer();
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={`Shopping Cart (${cartCount})`}
      position="right"
      width="max-w-md"
    >
      {items.length === 0 ? (
        <EmptyCart isDrawer={true} onCloseDrawer={closeDrawer} />
      ) : (
        <div className="flex flex-col h-full justify-between">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
            {items.map((item, idx) => (
              <CartItem
                key={item._id || item.productId || idx}
                item={item}
                isCompact={true}
              />
            ))}
          </div>

          {/* Drawer Footer / Summary */}
          <div className="pt-4 mt-4 border-t border-slate-200 space-y-3 bg-white">
            {/* Blocked User Warning in Drawer */}
            {isUserBlocked && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-0.5">
                <p className="font-bold text-rose-900 flex items-center gap-1">
                  <span>⚠️</span> Account Blocked
                </p>
                <p className="text-[11px] text-rose-700">
                  Your account is suspended. Checkout is disabled.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-semibold">Subtotal</span>
              <span className="text-base font-extrabold text-slate-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Taxes and shipping calculated at checkout
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleNavigateToCart}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors text-center cursor-pointer"
              >
                View Full Cart
              </button>

              <button
                type="button"
                onClick={handleNavigateToCheckout}
                disabled={isUserBlocked}
                className={`w-full py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                  isUserBlocked
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer'
                }`}
              >
                <span>{isUserBlocked ? 'Blocked' : 'Checkout'}</span>
                {!isUserBlocked && <FiArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
