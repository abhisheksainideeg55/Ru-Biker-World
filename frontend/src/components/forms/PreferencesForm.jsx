import React, { useState, useEffect } from 'react';
import { FiCheck, FiBell, FiMail, FiTag } from 'react-icons/fi';
import { usePreferences } from '../../hooks/usePreferences';

export const PreferencesForm = () => {
  const { preferences, updatePreferences, isSaving, isLoading } = usePreferences();
  const [formData, setFormData] = useState(preferences);

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePreferences(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-slate-100 rounded-2xl" />
        <div className="h-16 bg-slate-100 rounded-2xl" />
        <div className="h-16 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {/* Toggle 1: Order Updates */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <FiBell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Order & Shipment Notifications
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Real-time dispatch, tracking links, and delivery confirmation alerts.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={formData.orderNotifications}
          onClick={() => handleToggle('orderNotifications')}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
            formData.orderNotifications ? 'bg-brand-500' : 'bg-slate-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              formData.orderNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Toggle 2: Email Updates */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
            <FiMail className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Email Statements & Invoices
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Official GST invoices, payment receipts, and monthly spare parts summary.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={formData.emailNotifications}
          onClick={() => handleToggle('emailNotifications')}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
            formData.emailNotifications ? 'bg-brand-500' : 'bg-slate-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              formData.emailNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Toggle 3: Promotional Offers */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <FiTag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Special Deals & Seasonal Discounts
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Early access to mega sale events, clearance spares, and exclusive rider coupons.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={formData.promotionalNotifications}
          onClick={() => handleToggle('promotionalNotifications')}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
            formData.promotionalNotifications ? 'bg-brand-500' : 'bg-slate-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              formData.promotionalNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-glow flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Preferences...</span>
            </>
          ) : (
            <>
              <FiCheck className="w-4 h-4 stroke-[3]" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PreferencesForm;
