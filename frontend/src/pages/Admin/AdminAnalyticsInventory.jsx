import React, { useState } from 'react';
import {
  Archive,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  RefreshCw,
  Download,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const AdminAnalyticsInventory = () => {
  const stockByCategoryData = [
    { category: 'Helmets & Visors', units: 185, value: 1240000 },
    { category: 'Performance Exhausts', units: 62, value: 2450000 },
    { category: 'Riding Jackets', units: 94, value: 890000 },
    { category: 'Luggage & Touring', units: 140, value: 720000 },
    { category: 'LED Fog Lights', units: 210, value: 580000 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-xs uppercase tracking-wider border border-amber-200/60">
              Analytics & Intelligence
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Warehouse Stock & Valuation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Archive className="w-6 h-6 text-amber-500" />
            Inventory Analytics & Stock Valuation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate warehouse inventory asset valuation, stock turnover ratios, out-of-stock risk, and category density.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Warehouse Asset Value</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹58,80,000</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">At wholesale cost price</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Units in Stock</span>
            <Archive className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">691 Units</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Across 86 distinct SKUs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">4 SKUs</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Threshold: &lt;5 units left</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Turnover Velocity</span>
            <RefreshCw className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">4.6x / Year</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Optimal turnover rate</div>
        </div>
      </div>

      {/* Chart: Inventory by Category */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-black text-slate-900">Inventory Asset Valuation by Category (₹)</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockByCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Valuation']} />
              <Bar dataKey="value" name="Valuation (₹)" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsInventory;
