import React, { useState } from 'react';
import {
  FiTag,
  FiPlus,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiCheck,
  FiX,
  FiTrash2,
  FiCopy,
  FiAlertCircle
} from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';

const INITIAL_COUPONS = [
  {
    id: 'coup-1',
    code: 'RIDER10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1500,
    usageLimit: 500,
    usedCount: 238,
    validUntil: '2026-12-31',
    isActive: true,
    description: '10% OFF on all Helmets & Riding Gear orders above ₹1,500',
  },
  {
    id: 'coup-2',
    code: 'MOTO500',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 4000,
    usageLimit: 200,
    usedCount: 142,
    validUntil: '2026-11-30',
    isActive: true,
    description: 'Flat ₹500 OFF on Performance Exhausts and Brembo Brakes',
  },
  {
    id: 'coup-3',
    code: 'FREESHIP',
    discountType: 'flat',
    discountValue: 150,
    minOrderValue: 999,
    usageLimit: 1000,
    usedCount: 884,
    validUntil: '2026-10-31',
    isActive: true,
    description: 'Free Express Courier Shipping on all domestic bike parts',
  },
  {
    id: 'coup-4',
    code: 'SEASON25',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 6000,
    usageLimit: 100,
    usedCount: 100,
    validUntil: '2026-08-31',
    isActive: false,
    description: 'Monsoon Touring Gear Super Sale (Expired)',
  }
];

export const AdminCoupons = () => {
  const { addToast } = useNotifications() || {};
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    usageLimit: 100,
    validUntil: '',
    description: '',
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (addToast) addToast({ type: 'success', message: `Coupon code "${code}" copied!` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (id) => {
    setCoupons(
      coupons.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
    if (addToast) addToast({ type: 'info', message: 'Coupon status updated.' });
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    if (addToast) addToast({ type: 'info', message: 'Coupon deleted.' });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      if (addToast) addToast({ type: 'error', message: 'Code and Discount value are required.' });
      return;
    }

    const created = {
      id: `coup-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue || 0),
      usageLimit: Number(formData.usageLimit || 100),
      usedCount: 0,
      validUntil: formData.validUntil || '2026-12-31',
      isActive: true,
      description: formData.description.trim() || `Discount voucher for ${formData.code.toUpperCase()}`,
    };

    setCoupons([created, ...coupons]);
    setIsModalOpen(false);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      usageLimit: 100,
      validUntil: '',
      description: '',
    });
    if (addToast) addToast({ type: 'success', message: `Coupon "${created.code}" created successfully!` });
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FiTag className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Coupons & Discount Promotions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage promo codes, percentage discounts, flat cart vouchers & usage quotas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* ===================== METRIC SUMMARY CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Coupons</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {coupons.filter((c) => c.isActive).length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FiCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Redemptions</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {coupons.reduce((acc, c) => acc + c.usedCount, 0)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FiTag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Avg Discount Rate</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">16.5%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FiPercent className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ===================== COUPONS LIST GRID ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon) => {
          const usagePercent = Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100));

          return (
            <div
              key={coupon.id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xs ${
                coupon.isActive ? 'border-slate-200/90' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Header with Code Pill & Active Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 font-mono font-black text-sm rounded-lg tracking-wider shadow-2xs">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? (
                        <FiCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <FiCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(coupon.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      coupon.isActive ? 'bg-slate-900' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        coupon.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-3">
                  {coupon.description}
                </p>

                {/* Details Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-slate-100 font-bold text-slate-800 rounded-lg">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} FLAT OFF`}
                  </span>
                  {coupon.minOrderValue > 0 && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                      Min Order: ₹{coupon.minOrderValue}
                    </span>
                  )}
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg flex items-center gap-1">
                    <FiCalendar className="w-3 h-3 text-slate-400" />
                    Expires: {coupon.validUntil}
                  </span>
                </div>
              </div>

              {/* Usage Progress Meter */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Usage: {coupon.usedCount} / {coupon.usageLimit}</span>
                    <span>{usagePercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usagePercent >= 90 ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete coupon"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================== CREATE COUPON MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Create New Coupon Voucher</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Coupon Code (e.g. MOTO20, RE500)
                </label>
                <input
                  type="text"
                  placeholder="e.g. RIDER15"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="flat">Flat Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    placeholder={formData.discountType === 'percentage' ? 'e.g. 15' : 'e.g. 300'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 999"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Usage Limit (Max users)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Valid Until Date
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Offer Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 15% discount on all motorcycle helmets & touring accessories"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
