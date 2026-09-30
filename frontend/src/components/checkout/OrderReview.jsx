import React from 'react';
import { FiMapPin, FiTruck, FiEdit2, FiCheckCircle } from 'react-icons/fi';
import PaymentMethodCard from './PaymentMethodCard';
import { useCheckout } from '../../hooks/useCheckout';
import { useCart } from '../../hooks/useCart';

export const OrderReview = ({ onEditAddress, onEditShipping }) => {
  const { selectedAddress, shippingMethod } = useCheckout();
  const { items = [], subtotal } = useCart();

  const isFreeStandard = subtotal >= 999;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Review Order & Complete Payment</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Please verify your delivery address, items, and proceed to secure checkout.
        </p>
      </div>

      {/* Delivery & Shipping Info Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Address Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <FiMapPin className="w-4 h-4 text-amber-500" />
              <span>Delivery Address</span>
            </div>
            <button
              type="button"
              onClick={onEditAddress}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              <FiEdit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          {selectedAddress ? (
            <div className="text-xs text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-800">{selectedAddress.fullName}</div>
              <div>{selectedAddress.addressLine1}</div>
              <div>
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
              </div>
              <div className="text-slate-500 pt-1">Phone: {selectedAddress.phone}</div>
            </div>
          ) : (
            <div className="text-xs text-rose-500 font-medium">No address selected.</div>
          )}
        </div>

        {/* Shipping Method Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <FiTruck className="w-4 h-4 text-amber-500" />
              <span>Shipping Method</span>
            </div>
            <button
              type="button"
              onClick={onEditShipping}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              <FiEdit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">
              {shippingMethod === 'express' ? 'Express Priority Courier' : 'Standard Surface Delivery'}
            </div>
            <div className="text-slate-500">
              {shippingMethod === 'express' ? '1–3 business days (₹199)' : isFreeStandard ? '3–7 business days (FREE)' : '3–7 business days (₹99)'}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items Summary */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Order Items ({items.length})
        </h3>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white max-h-60 overflow-y-auto">
          {items.map((item, idx) => {
            const prod = item.product || {};
            const unitPrice = item.priceAtAdd || prod.price || 0;
            const total = unitPrice * (item.quantity || 1);
            const sizeLabel =
              item.selectedVariant?.size ||
              item.selectedVariant?.name ||
              item.selectedVariant?.value ||
              (typeof item.selectedVariant === 'string' ? item.selectedVariant : null) ||
              item.size ||
              null;

            return (
              <div key={item._id || item.productId || idx} className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80'}
                    alt={prod.name || 'Product'}
                    className="w-11 h-11 object-cover rounded-lg bg-slate-50 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                      <span>
                        Qty: <span className="font-bold text-slate-700">{item.quantity}</span> × ₹{unitPrice.toLocaleString('en-IN')}
                      </span>
                      {sizeLabel && (
                        <span className="font-bold text-slate-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded text-[10px]">
                          Size: {sizeLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-extrabold text-slate-900 shrink-0">
                  ₹{total.toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method Selector Component */}
      <PaymentMethodCard />
    </div>
  );
};

export default OrderReview;
