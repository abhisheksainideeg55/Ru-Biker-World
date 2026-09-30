import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiLock, FiShoppingBag, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';

export const CheckoutPlaceholderPage = () => {
  const { cartItems, totalQuantity } = useCart() || {};
  const subtotal = (cartItems || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="bg-slate-50 min-h-screen py-6">
      <Container>
        <Breadcrumb items={[{ label: 'Checkout', path: null }]} className="mb-4" />

        <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-card text-center">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-200">
            <FiLock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 font-display mb-2">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Phase 5 demo checkout preview. Complete cart and payment integration will arrive in future phases.
          </p>

          {/* Cart Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-200">
              <span>Items in Order ({totalQuantity})</span>
              <span>Subtotal: ₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto mt-2">
              {(cartItems || []).map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="truncate max-w-[70%]">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-slate-400">Qty: {item.quantity || 1}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-900 hover:bg-surface-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>View Full Cart</span>
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <span>Continue Shopping</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPlaceholderPage;
