import React from 'react';
import { FiShield, FiLock, FiHeadphones, FiCheckCircle } from 'react-icons/fi';

export const CheckoutFooter = () => {
  return (
    <div className="mt-12 pt-6 border-t border-slate-200">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs text-slate-500">
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <FiShield className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-slate-800">100% Genuine</span>
          <span className="text-[11px] text-slate-400">Direct OEM parts</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <FiLock className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-slate-800">Secure Payment</span>
          <span className="text-[11px] text-slate-400">256-bit encryption</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <FiCheckCircle className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-slate-800">Assured Fitment</span>
          <span className="text-[11px] text-slate-400">Bike compatibility guarantee</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <FiHeadphones className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-slate-800">Rider Support</span>
          <span className="text-[11px] text-slate-400">Expert mechanic assistance</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFooter;
