import React, { useState } from 'react';
import {
  FiSettings,
  FiSave,
  FiDatabase,
  FiBell,
  FiTruck,
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { adminService } from '../../services/adminService';

export const AdminSettings = () => {
  const { addToast } = useNotifications() || {};
  const [storeName, setStoreName] = useState('RU Biker World');
  const [supportEmail, setSupportEmail] = useState('support@rubikerworld.com');
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [currency, setCurrency] = useState('INR (₹)');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from database on mount
  React.useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const data = await adminService.getStoreSettings();
        if (isMounted && data) {
          if (data.storeName) setStoreName(data.storeName);
          if (data.supportEmail) setSupportEmail(data.supportEmail);
          if (data.lowStockThreshold) setLowStockThreshold(data.lowStockThreshold);
          if (data.currency) setCurrency(data.currency);
          if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
        }
      } catch (err) {
        console.warn('[AdminSettings] Load error:', err.message);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.saveStoreSettings({
        storeName,
        supportEmail,
        lowStockThreshold,
        currency,
        maintenanceMode,
      });
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Admin store & warehouse settings saved to database successfully!',
        });
      }
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: 'Failed to save settings to database.',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset catalog, inventory parts and orders to default factory state in database?')) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl font-sans">
      {/* ===================== PAGE HEADER ===================== */}
      <div>
        <div className="flex items-center gap-2">
          <FiSettings className="w-5 h-5 text-slate-700" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Store & Warehouse Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Global storefront configurations, inventory alert rules and fulfillment parameters
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Config */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiSettings className="w-4 h-4" /> General Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Outlet / Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Inventory Rules */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiTruck className="w-4 h-4" /> Inventory & Stock Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Low-Stock Warning Threshold (Units)
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
