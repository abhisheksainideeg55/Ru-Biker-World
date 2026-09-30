import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShield, FiTruck, FiArrowRight, FiLock } from 'react-icons/fi';
import Price from '../common/Price';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export const CartSummary = ({ isDrawer = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth() || {};
  const { subtotal, discount, shipping, tax, grandTotal, items = [] } = useCart();

  const isCartEmpty = !items || items.length === 0;
  const isUserBlocked = Boolean(isAuthenticated && user && user.isActive === false);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (isCartEmpty || isUserBlocked) return;
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
        Order Summary
      </h3>

      {/* Blocked User Warning Alert */}
      {isUserBlocked && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
          <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            !
          </div>
          <div>
            <p className="font-bold text-rose-900">Account Blocked by Administrator</p>
            <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
              Your account is currently suspended. You can browse products and add items to your cart, but <strong>Checkout is disabled</strong>. Please contact store support to unblock.
            </p>
          </div>
        </div>
      )}

      {/* Financial rows */}
      <div className="space-y-3 text-xs sm:text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Coupon Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount</span>
            <span>-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-slate-600">
          <span>Estimated Shipping</span>
          <span className="font-bold">
            {shipping === 0 ? (
              <span className="text-emerald-600 uppercase text-xs font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                FREE
              </span>
            ) : (
              <span className="text-slate-900">₹{shipping.toLocaleString('en-IN')}</span>
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-slate-600">
          <span>Estimated GST (18%)</span>
          <span className="font-bold text-slate-900">
            ₹{tax.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Total separator */}
        <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
          <div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900">Total</div>
            <div className="text-[11px] text-slate-400">Inclusive of all taxes</div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-950">
            ₹{grandTotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Checkout Action Button */}
      <div>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isCartEmpty || isUserBlocked}
          className={`w-full py-3.5 px-5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-sm sm:text-base transition-all select-none ${
            isUserBlocked
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none'
              : isCartEmpty
              ? 'bg-amber-500 opacity-50 cursor-not-allowed text-slate-950'
              : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-md hover:shadow-lg cursor-pointer'
          }`}
        >
          {isUserBlocked ? (
            <span>Checkout Disabled (Account Blocked)</span>
          ) : (
            <>
              <span>Proceed to Checkout</span>
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {isDrawer && !isUserBlocked && (
          <Link
            to="/cart"
            className="w-full mt-2.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center text-xs transition-colors"
          >
            View Full Cart
          </Link>
        )}
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <FiShield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>100% Genuine OEM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiLock className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Encrypted Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
