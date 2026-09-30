import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiCheck,
  FiAlertCircle,
  FiX,
} from 'react-icons/fi';

export const AddressForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    type: 'Home',
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        addressLine1: initialData.addressLine1 || initialData.street || '',
        addressLine2: initialData.addressLine2 || '',
        landmark: initialData.landmark || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postalCode || initialData.pincode || '',
        country: initialData.country || 'India',
        type: initialData.type || 'Home',
        isDefault: !!initialData.isDefault,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    const pinRegex = /^[1-9][0-9]{5}$/;

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    const cleanPhone = formData.phone.replace(/[\s\-]/g, '');
    if (!formData.phone || (cleanPhone.length < 10 && !phoneRegex.test(cleanPhone))) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'House/flat number and street address are required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required.';
    }

    if (!formData.postalCode.trim() || !pinRegex.test(formData.postalCode.trim())) {
      newErrors.postalCode = 'Please enter a valid 6-digit PIN code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="addr-fullName"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiUser className="w-4 h-4" />
            </div>
            <input
              id="addr-fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: null });
              }}
              placeholder="Recipient name"
              className={`w-full bg-slate-50 border ${
                errors.fullName
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
              } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="addr-phone"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiPhone className="w-4 h-4" />
            </div>
            <input
              id="addr-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder="10-digit mobile number"
              className={`w-full bg-slate-50 border ${
                errors.phone
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
              } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div>
        <label
          htmlFor="addr-line1"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Flat, House No., Building, Street <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiMapPin className="w-4 h-4" />
          </div>
          <input
            id="addr-line1"
            type="text"
            value={formData.addressLine1}
            onChange={(e) => {
              setFormData({ ...formData, addressLine1: e.target.value });
              if (errors.addressLine1) setErrors({ ...errors, addressLine1: null });
            }}
            placeholder="e.g. 42/B, MG Road, Near City Center"
            className={`w-full bg-slate-50 border ${
              errors.addressLine1
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>
        {errors.addressLine1 && (
          <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 & Landmark */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="addr-line2"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Area, Colony, Sector <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="addr-line2"
            type="text"
            value={formData.addressLine2}
            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            placeholder="e.g. Indiranagar"
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="addr-landmark"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Landmark <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="addr-landmark"
            type="text"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
            placeholder="e.g. Opposite Metro Station"
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors"
          />
        </div>
      </div>

      {/* City, State & PIN Code */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="addr-city"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            City / District <span className="text-rose-500">*</span>
          </label>
          <input
            id="addr-city"
            type="text"
            value={formData.city}
            onChange={(e) => {
              setFormData({ ...formData, city: e.target.value });
              if (errors.city) setErrors({ ...errors, city: null });
            }}
            placeholder="e.g. Jaipur"
            className={`w-full bg-slate-50 border ${
              errors.city
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
          {errors.city && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="addr-state"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            State <span className="text-rose-500">*</span>
          </label>
          <input
            id="addr-state"
            type="text"
            value={formData.state}
            onChange={(e) => {
              setFormData({ ...formData, state: e.target.value });
              if (errors.state) setErrors({ ...errors, state: null });
            }}
            placeholder="e.g. Rajasthan"
            className={`w-full bg-slate-50 border ${
              errors.state
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
          {errors.state && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="addr-pin"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            PIN Code <span className="text-rose-500">*</span>
          </label>
          <input
            id="addr-pin"
            type="text"
            maxLength={6}
            value={formData.postalCode}
            onChange={(e) => {
              setFormData({ ...formData, postalCode: e.target.value });
              if (errors.postalCode) setErrors({ ...errors, postalCode: null });
            }}
            placeholder="6-digit PIN"
            className={`w-full bg-slate-50 border ${
              errors.postalCode
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
          {errors.postalCode && (
            <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>

      {/* Address Type Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Address Type
        </label>
        <div className="flex items-center gap-3">
          {['Home', 'Work', 'Other'].map((typeOption) => (
            <button
              key={typeOption}
              type="button"
              onClick={() => setFormData({ ...formData, type: typeOption })}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                formData.type === typeOption
                  ? 'bg-brand-50 border-brand-400 text-brand-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {typeOption === 'Home' && <FiHome className="w-3.5 h-3.5" />}
              {typeOption === 'Work' && <FiBriefcase className="w-3.5 h-3.5" />}
              {typeOption === 'Other' && <FiMapPin className="w-3.5 h-3.5" />}
              <span>{typeOption}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Set as Default Address Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
          <input
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <span className="font-medium">Make this my default delivery address</span>
        </label>
      </div>

      {/* Form Action CTAs */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-glow flex items-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Address...</span>
            </>
          ) : (
            <>
              <FiCheck className="w-4 h-4 stroke-[3]" />
              <span>{initialData ? 'Update Address' : 'Save Address'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
