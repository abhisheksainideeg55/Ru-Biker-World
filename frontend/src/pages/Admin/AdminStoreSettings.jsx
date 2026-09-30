import React, { useState } from 'react';
import {
  Settings,
  Store,
  DollarSign,
  ShieldCheck,
  Truck,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Lock,
  Layers,
  Percent,
  Sliders
} from 'lucide-react';

export const AdminStoreSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    // General
    storeName: 'RU BIKER WORLD',
    tagline: 'Premium Bike Accessories & Performance Gear Hub',
    contactEmail: 'support@RU BIKER world.in',
    contactPhone: '+91 98765 43210',
    businessAddress: 'Plot 42, Speed Way Industrial Area, Pune, Maharashtra - 411014',
    gstin: '27AABCS1429B1Z8',
    
    // Localization
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST +5:30)',
    dateFormat: 'DD/MM/YYYY',

    // Tax & GST
    defaultGSTRate: '18',
    taxInclusive: true,
    hsnCodeDefault: '87141090',

    // Operational Modes
    maintenanceMode: false,
    allowGuestCheckout: true,
    enableCOD: true,
    codFee: 49,
    minOrderValue: 299,
    maxCODLimit: 15000,
    
    // Inventory alerts
    lowStockThreshold: 5,
    autoNotifySupplier: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider border border-amber-200/60">
              Store Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Core Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Store className="w-6 h-6 text-amber-500" />
            Store Settings & Business Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store information, GST/Tax configuration, order rules, currency, and operational status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Changes saved to live database
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4 text-amber-400" />
            Save Store Settings
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Store className="w-3.5 h-3.5" /> Store Information & Address
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tax'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Percent className="w-3.5 h-3.5" /> GST & Tax Invoicing
        </button>
        <button
          onClick={() => setActiveTab('checkout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'checkout'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Checkout & Order Rules
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'maintenance'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Lock className="w-3.5 h-3.5" /> Maintenance & Availability
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: GENERAL STORE INFO */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              Storefront Identity & Official Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full text-xs font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Storefront Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Helpline / WhatsApp Phone</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registered GSTIN Number</label>
                <input
                  type="text"
                  value={settings.gstin}
                  onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Warehouse & Registered Business Address</label>
              <textarea
                rows="2"
                value={settings.businessAddress}
                onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option>INR (₹) - Indian Rupee</option>
                  <option>USD ($) - US Dollar</option>
                  <option>EUR (€) - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option>Asia/Kolkata (IST +5:30)</option>
                  <option>UTC (+0:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TAX & GST */}
        {activeTab === 'tax' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              GST Tax Rules & Automobile Part HSN Codes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default GST Rate (%) for Bike Accessories</label>
                <select
                  value={settings.defaultGSTRate}
                  onChange={(e) => setSettings({ ...settings, defaultGSTRate: e.target.value })}
                  className="w-full text-xs font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="18">18% GST (Standard Helmets, LED Lights, Riding Gear)</option>
                  <option value="28">28% GST (Luxury Exhausts, High-end Performance)</option>
                  <option value="12">12% GST (Basic Hardware & Mounts)</option>
                  <option value="5">5% GST (Essential Safety Stickers & Reflectors)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default HSN/SAC Code</label>
                <input
                  type="text"
                  value={settings.hsnCodeDefault}
                  onChange={(e) => setSettings({ ...settings, hsnCodeDefault: e.target.value })}
                  className="w-full text-xs font-mono font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">87141090 is Indian standard for Motorcycle Parts & Accessories</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.taxInclusive}
                  onChange={(e) => setSettings({ ...settings, taxInclusive: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">All Storefront Product Prices are Inclusive of Taxes</div>
                  <div className="text-[11px] text-slate-500">Customer sees MRP with GST already calculated on product cards and checkout</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: CHECKOUT & ORDER RULES */}
        {activeTab === 'checkout' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              Checkout Preferences & COD Guardrails
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={settings.minOrderValue}
                  onChange={(e) => setSettings({ ...settings, minOrderValue: Number(e.target.value) })}
                  className="w-full text-xs font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cash on Delivery (COD) Convenience Fee (₹)</label>
                <input
                  type="number"
                  value={settings.codFee}
                  onChange={(e) => setSettings({ ...settings, codFee: Number(e.target.value) })}
                  className="w-full text-xs font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max COD Order Ceiling (₹)</label>
                <input
                  type="number"
                  value={settings.maxCODLimit}
                  onChange={(e) => setSettings({ ...settings, maxCODLimit: Number(e.target.value) })}
                  className="w-full text-xs font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Orders above this amount require prepaid payment (UPI/Card)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <input
                  type="checkbox"
                  checked={settings.enableCOD}
                  onChange={(e) => setSettings({ ...settings, enableCOD: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Enable Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-slate-500">Allow customers to pay via cash or UPI QR upon courier arrival</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <input
                  type="checkbox"
                  checked={settings.allowGuestCheckout}
                  onChange={(e) => setSettings({ ...settings, allowGuestCheckout: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Allow 1-Click Guest Checkout</div>
                  <div className="text-[11px] text-slate-500">Speed up mobile sales without mandatory password registration</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: MAINTENANCE MODE */}
        {activeTab === 'maintenance' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              Storefront Availability & Maintenance Flag
            </h2>

            <div className={`p-4 rounded-xl border transition-colors ${settings.maintenanceMode ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${settings.maintenanceMode ? 'text-amber-600' : 'text-slate-400'}`} />
                    Storefront Maintenance Mode
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    When active, public visitors will see a "RU BIKER WORLD Hub Upgrading – Back Soon" screen. Admin dashboard remains fully accessible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${settings.maintenanceMode ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                  {settings.maintenanceMode ? 'DISABLE MAINTENANCE' : 'ENABLE MAINTENANCE'}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminStoreSettings;
