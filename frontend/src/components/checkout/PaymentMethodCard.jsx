import React from 'react';
import { FiCreditCard, FiLock, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';

export const PaymentMethodCard = () => {
  const { paymentMethod, selectPaymentMethod } = useCheckout();

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
        Select Payment Method
      </label>

      {/* Cash on Delivery Option */}
      <label
        onClick={() => selectPaymentMethod('cod')}
        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
          paymentMethod === 'cod'
            ? 'border-amber-500 bg-amber-50/30 shadow-xs'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <input
            type="radio"
            name="paymentMethodSelect"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => selectPaymentMethod('cod')}
            className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
          />
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <FiTruck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                Zero Advance Needed
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Pay via Cash or UPI at your doorstep when your parcel arrives
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
          <FiCheckCircle className="w-3.5 h-3.5" />
          <span>Pay on Delivery</span>
        </div>
      </label>

      {/* Razorpay Online Option */}
      <label
        onClick={() => selectPaymentMethod('razorpay')}
        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
          paymentMethod === 'razorpay'
            ? 'border-amber-500 bg-amber-50/30 shadow-xs'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <input
            type="radio"
            name="paymentMethodSelect"
            value="razorpay"
            checked={paymentMethod === 'razorpay'}
            onChange={() => selectPaymentMethod('razorpay')}
            className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
          />
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <FiCreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Online Payment / UPI / Cards</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                Instant Confirm
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              UPI (GPay / PhonePe / Paytm), Debit/Credit Cards, NetBanking, Wallets
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <FiLock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL</span>
        </div>
      </label>
    </div>
  );
};

export default PaymentMethodCard;
