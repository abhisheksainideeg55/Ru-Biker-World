import React, { useState } from 'react';
import { FiMapPin, FiPlus, FiCheck, FiPhone, FiHome, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import { useCheckout } from '../../hooks/useCheckout';
import { useAddresses } from '../../hooks/useAddresses';

export const CheckoutAddress = ({ onContinue }) => {
  const { selectedAddressId, selectAddress, error, setError } = useCheckout();
  const { addresses = [], addAddress, isLoading } = useAddresses();

  const [showAddForm, setShowAddForm] = useState(false);

  React.useEffect(() => {
    if (!isLoading && addresses.length === 0) {
      setShowAddForm(true);
    }
  }, [addresses.length, isLoading]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    addressType: 'home',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit phone number is required.';
    if (!formData.addressLine1.trim()) errs.addressLine1 = 'Street Address / House No. is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.state.trim()) errs.state = 'State is required.';
    if (!formData.postalCode.trim() || !/^\d{6}$/.test(formData.postalCode.trim())) {
      errs.postalCode = 'Valid 6-digit Indian PIN code is required.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveNewAddress = async (e, proceedImmediately = true) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await addAddress(formData);
      const saved = res?.data || res?.address || (res?.addresses && res.addresses[0]);
      const savedId = saved ? (saved._id || saved.id) : null;
      if (savedId) {
        selectAddress(savedId);
      }
      setShowAddForm(false);
      setFormData({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: 'Maharashtra',
        postalCode: '',
        country: 'India',
        addressType: 'home',
        isDefault: false,
      });

      if (proceedImmediately && onContinue) {
        onContinue();
      }
    } catch (err) {
      setError(err.message || 'Failed to save address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceed = () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address to proceed.');
      return;
    }
    setError(null);
    onContinue && onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Select Delivery Address</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Where should we deliver your motorcycle parts and accessories?
          </p>
        </div>

        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 transition-colors"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
          <FiAlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Address Form Modal / Inline */}
      {showAddForm && (
        <form onSubmit={(e) => handleSaveNewAddress(e, true)} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Delivery Address Details</h3>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Vikram Rider"
                required
              />
              {formErrors.fullName && <div className="text-[10px] text-rose-500 mt-1">{formErrors.fullName}</div>}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="10-digit mobile number"
                required
              />
              {formErrors.phone && <div className="text-[10px] text-rose-500 mt-1">{formErrors.phone}</div>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Address Line 1 (Flat, House No., Building, Area) *</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="Street name, landmark, area"
                required
              />
              {formErrors.addressLine1 && <div className="text-[10px] text-rose-500 mt-1">{formErrors.addressLine1}</div>}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="City"
                required
              />
              {formErrors.city && <div className="text-[10px] text-rose-500 mt-1">{formErrors.city}</div>}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="State"
                required
              />
              {formErrors.state && <div className="text-[10px] text-rose-500 mt-1">{formErrors.state}</div>}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="6-digit PIN code"
                required
              />
              {formErrors.postalCode && <div className="text-[10px] text-rose-500 mt-1">{formErrors.postalCode}</div>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-slate-200">
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors text-center"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save & Continue to Shipping Method →</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Address Cards Grid */}
      {addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-3">
          <FiMapPin className="w-8 h-8 text-amber-500 mx-auto" />
          <p className="text-xs text-slate-600 font-medium">No saved delivery address found.</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-sm"
          >
            + Add Delivery Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const aId = addr._id || addr.id;
            const isSelected = String(selectedAddressId) === String(aId);

            return (
              <div
                key={aId}
                onClick={() => selectAddress(aId)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Radio selection & Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={isSelected}
                      onChange={() => selectAddress(aId)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <span className="text-xs font-extrabold text-slate-900">{addr.fullName}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                      {addr.addressType || 'Home'}
                    </span>
                  </div>
                </div>

                {/* Address text */}
                <div className="text-xs text-slate-600 pl-6 space-y-0.5">
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p className="font-semibold text-slate-800">
                    {addr.city}, {addr.state} — {addr.postalCode}
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                    <FiPhone className="w-3 h-3 text-slate-400" />
                    <span>{addr.phone}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Continue Action */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!selectedAddressId}
          className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
        >
          Continue to Shipping Method →
        </button>
      </div>
    </div>
  );
};

export default CheckoutAddress;
