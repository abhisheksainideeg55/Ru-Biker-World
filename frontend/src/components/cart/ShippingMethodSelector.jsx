import React, { useState } from 'react';
import { FiTruck, FiZap, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAddresses } from '../../hooks/useAddresses';

export const ShippingMethodSelector = () => {
  const { subtotal, shippingMethod, shippingInfo, calculateShipping } = useCart();
  const { addresses, defaultAddress } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState(() => defaultAddress?._id || defaultAddress?.id || null);

  const isFreeStandard = subtotal >= 999;
  const currentAddress = addresses?.find((a) => String(a._id) === String(selectedAddressId) || String(a.id) === String(selectedAddressId)) || defaultAddress;

  const handleMethodChange = (method) => {
    calculateShipping(selectedAddressId, method);
  };

  return (
    <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-4">
      {/* Address Delivery Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <FiMapPin className="w-4 h-4 text-amber-500 shrink-0" />
          {currentAddress ? (
            <div className="truncate">
              <span className="font-bold text-slate-800">Deliver to: </span>
              <span>{currentAddress.fullName || currentAddress.city} ({currentAddress.postalCode})</span>
            </div>
          ) : (
            <span className="text-slate-500">Standard Pincode Delivery</span>
          )}
        </div>

        {addresses && addresses.length > 0 ? (
          <Link
            to="/account/addresses"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 shrink-0"
          >
            <span>Change</span>
            <FiChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <Link
            to="/account/addresses"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 shrink-0"
          >
            <span>+ Add Address</span>
          </Link>
        )}
      </div>

      {/* Shipping Method Options */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
          Delivery Options
        </label>

        <div className="space-y-2">
          {/* Standard Delivery */}
          <label
            onClick={() => handleMethodChange('standard')}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              shippingMethod === 'standard'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={shippingMethod === 'standard'}
                onChange={() => handleMethodChange('standard')}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <FiTruck className="w-4 h-4 text-slate-600" />
                  Standard Delivery
                </div>
                <div className="text-[11px] text-slate-500">3–7 business days</div>
              </div>
            </div>

            <div className="text-right">
              {isFreeStandard ? (
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  FREE
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-800">₹99</span>
              )}
            </div>
          </label>

          {/* Express Delivery */}
          <label
            onClick={() => handleMethodChange('express')}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              shippingMethod === 'express'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={shippingMethod === 'express'}
                onChange={() => handleMethodChange('express')}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <FiZap className="w-4 h-4 text-amber-500" />
                  Express Priority
                </div>
                <div className="text-[11px] text-slate-500">1–3 business days</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-800">₹199</span>
            </div>
          </label>
        </div>

        {/* Free Shipping Progress helper */}
        {!isFreeStandard && shippingMethod === 'standard' && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            Add <span className="font-bold">₹{(999 - subtotal).toLocaleString('en-IN')}</span> more to qualify for <span className="font-bold">FREE Standard Delivery</span>!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingMethodSelector;
