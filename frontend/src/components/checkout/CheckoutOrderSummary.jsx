import React from 'react';
import { FiShield, FiLock, FiTruck } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useCheckout';

export const CheckoutOrderSummary = () => {
  const { subtotal, discount, coupon, shipping, tax, grandTotal, items } = useCart();
  const { shippingMethod } = useCheckout();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900">Order Summary</h3>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {/* Financial Rows */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-semibold">
            <span>Coupon ({coupon?.code || 'PROMO'})</span>
            <span>-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-600">
          <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
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

        <div className="flex items-center justify-between text-slate-600">
          <span>Estimated GST (18%)</span>
          <span className="font-bold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
          <div>
            <div className="text-base font-extrabold text-slate-900">Grand Total</div>
            <div className="text-[11px] text-slate-400">Inclusive of all duties & taxes</div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-950">
            ₹{grandTotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Security badges */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <FiShield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>100% Genuine MotoZone Parts Warranty</span>
        </div>
        <div className="flex items-center gap-2">
          <FiTruck className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Tracked Dispatch via Leading Couriers</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
