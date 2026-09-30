import React, { useState, useEffect } from 'react';
import {
  FiBarChart2,
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiActivity,
  FiAward,
  FiUsers,
  FiLayers,
  FiCompass,
  FiShield
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

export const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (e) {}
      finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const topCategories = [
    { name: 'Helmets & Riding Gear', share: 38, sales: '₹84,200', count: 92 },
    { name: 'Spare Parts & Brake Kits', share: 26, sales: '₹58,400', count: 64 },
    { name: 'Accessories & Touring Mounts', share: 18, sales: '₹39,100', count: 48 },
    { name: 'Oils, Lubes & Cleaners', share: 11, sales: '₹24,800', count: 32 },
    { name: 'Performance Air Filters & Exhausts', share: 7, sales: '₹16,200', count: 18 },
  ];

  const topBikeBrands = [
    { name: 'Royal Enfield (Classic 350 / Hunter / Himalayan 450)', share: 36, sales: '₹79,800' },
    { name: 'KTM (Duke 390 / RC 390 / Adventure 390)', share: 24, sales: '₹53,200' },
    { name: 'Yamaha (R15 V4 / MT-15 V2 / Aerox 155)', share: 19, sales: '₹42,100' },
    { name: 'Bajaj (Dominar 400 / Pulsar NS200)', share: 12, sales: '₹26,600' },
    { name: 'BMW Motorrad (G 310 GS / 310 R)', share: 9, sales: '₹19,950' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ===================== PAGE HEADER ===================== */}
      <div>
        <div className="flex items-center gap-2">
          <FiBarChart2 className="w-5 h-5 text-slate-700" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sales & Motorcycle Demand Analytics
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Revenue trajectories, bike category market share, and vehicle fitment trends
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Store Conversion Rate
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-600">
            3.85%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">+0.8% increase over last month</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Average Order Value (AOV)
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            ₹2,640
          </div>
          <p className="text-[11px] text-slate-500 mt-1">High motorcycle parts & helmet cart size</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Dispatch Fulfillment Speed
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-blue-600">
            4.2 hrs
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Same-day courier dispatch rate: 94%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Share */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FiAward className="w-4 h-4 text-amber-500" />
            Product Category Revenue Share
          </h3>

          <div className="space-y-4 pt-2">
            {topCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{cat.name}</span>
                  <span className="text-slate-900 font-bold">{cat.sales} ({cat.share}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className="h-full bg-slate-900 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motorcycle Fitment Share */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FiCompass className="w-4 h-4 text-brand-600 text-amber-500" />
            Top Motorcycle Model Compatibility
          </h3>

          <div className="space-y-4 pt-2">
            {topBikeBrands.map((bike, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 truncate max-w-[240px]">{bike.name}</span>
                  <span className="text-slate-900 font-bold">{bike.sales} ({bike.share}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${bike.share}%` }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
