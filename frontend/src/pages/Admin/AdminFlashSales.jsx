import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Clock,
  Flame,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertTriangle,
  Percent,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const AdminFlashSales = () => {
  const [flashSales, setFlashSales] = useState([
    {
      id: 'FS-01',
      name: 'Midnight Superbike Exhaust Blitz',
      discountPercent: 35,
      productsCount: 6,
      stockLimitPerCustomer: 1,
      totalSold: 28,
      stockAllocated: 50,
      startTime: '2026-09-28T20:00',
      endTime: '2026-09-29T02:00',
      status: 'Active',
      featuredProduct: 'Akrapovič Slip-On Exhaust Ninja 400',
      flashPrice: 38999,
      originalPrice: 59999
    },
    {
      id: 'FS-02',
      name: 'Carbon Helmet 4-Hour Lightning Deal',
      discountPercent: 40,
      productsCount: 4,
      stockLimitPerCustomer: 2,
      totalSold: 45,
      stockAllocated: 45,
      startTime: '2026-09-27T14:00',
      endTime: '2026-09-27T18:00',
      status: 'Sold Out',
      featuredProduct: 'AGV Pista GP Carbon Helmet Matte',
      flashPrice: 42000,
      originalPrice: 69999
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSale, setNewSale] = useState({
    name: '',
    discountPercent: 30,
    featuredProduct: 'Pro Racing Fog Lights 60W LED Kit',
    flashPrice: 2499,
    originalPrice: 4499,
    stockAllocated: 40,
    stockLimitPerCustomer: 1,
    startTime: '2026-09-29T12:00',
    endTime: '2026-09-29T18:00'
  });

  const handleAddFlashSale = (e) => {
    e.preventDefault();
    if (!newSale.name) return;
    const item = {
      id: `FS-0${flashSales.length + 1}`,
      ...newSale,
      productsCount: 1,
      totalSold: 0,
      status: 'Scheduled'
    };
    setFlashSales([item, ...flashSales]);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider border border-amber-200/60">
              Marketing Suite
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Limited-Time Flash Deals</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-400" />
            Flash Sales & Countdown Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure live countdown timers, flash prices, and customer purchase limits to trigger urgency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Create Flash Sale
          </button>
        </div>
      </div>

      {/* Flash Sales List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashSales.map((fs) => (
          <div
            key={fs.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs hover:border-amber-400/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${
                  fs.status === 'Active' ? 'bg-amber-500 text-slate-950 animate-pulse' : fs.status === 'Sold Out' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Flame className="w-3 h-3" /> {fs.status}
                </span>
                <span className="text-xs font-mono text-slate-400">{fs.id}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-black text-xs">
                {fs.discountPercent}% OFF
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">{fs.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Featured: {fs.featuredProduct}</p>
            </div>

            {/* Price compare */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Flash Sale Price</span>
                <span className="text-lg font-black text-slate-900">₹{fs.flashPrice.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Original MRP</span>
                <span className="text-xs line-through text-slate-400 font-bold">₹{fs.originalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Inventory claim bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Claimed by Riders:</span>
                <span className="font-bold text-slate-900">{fs.totalSold} / {fs.stockAllocated} Units</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (fs.totalSold / fs.stockAllocated) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Ends: {new Date(fs.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <button
                onClick={() => setFlashSales(flashSales.filter(x => x.id !== fs.id))}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                End Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Flash Sale Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Create Flash Deal Campaign</h3>

            <form onSubmit={handleAddFlashSale} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Flash Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2-Hour LED Fog Light Rush"
                  value={newSale.name}
                  onChange={(e) => setNewSale({ ...newSale, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Product</label>
                <input
                  type="text"
                  value={newSale.featuredProduct}
                  onChange={(e) => setNewSale({ ...newSale, featuredProduct: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newSale.originalPrice}
                    onChange={(e) => setNewSale({ ...newSale, originalPrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flash Deal Price (₹)</label>
                  <input
                    type="number"
                    value={newSale.flashPrice}
                    onChange={(e) => {
                      const fp = Number(e.target.value);
                      const discount = Math.round(((newSale.originalPrice - fp) / newSale.originalPrice) * 100);
                      setNewSale({ ...newSale, flashPrice: fp, discountPercent: Math.max(0, discount) });
                    }}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Units Reserved</label>
                  <input
                    type="number"
                    value={newSale.stockAllocated}
                    onChange={(e) => setNewSale({ ...newSale, stockAllocated: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Limit Per Customer</label>
                  <input
                    type="number"
                    value={newSale.stockLimitPerCustomer}
                    onChange={(e) => setNewSale({ ...newSale, stockLimitPerCustomer: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow"
                >
                  Start Flash Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFlashSales;
