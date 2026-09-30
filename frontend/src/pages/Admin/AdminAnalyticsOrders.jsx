import React, { useState } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  DollarSign,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminAnalyticsOrders = () => {
  const orderStatusData = [
    { name: 'Delivered', value: 680, color: '#10b981' },
    { name: 'In Transit / Shipped', value: 140, color: '#3b82f6' },
    { name: 'Processing / Packing', value: 65, color: '#f59e0b' },
    { name: 'Cancelled / Returned', value: 25, color: '#ef4444' },
  ];

  const paymentDistribution = [
    { name: 'UPI (GPay/PhonePe)', value: 55, color: '#8b5cf6' },
    { name: 'Credit/Debit Card', value: 25, color: '#0ea5e9' },
    { name: 'Net Banking', value: 10, color: '#f59e0b' },
    { name: 'Cash on Delivery (COD)', value: 10, color: '#64748b' },
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
            <span className="text-xs text-slate-500 font-medium">Fulfillment & Operations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-amber-500" />
            Order Analytics & Fulfillment Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze order fulfillment speeds, status ratios, payment gateway split, and return/cancellation rates.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">910 Orders</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">97.3% fulfillment success</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Fulfillment SLA</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">14.2 Hours</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Order placed to carrier dispatch</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cancellation Rate</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">1.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Industry low benchmark</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prepaid vs COD Ratio</span>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">90% : 10%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">90% digital prepaid payments</div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-900">Orders by Fulfillment Status</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-900">Payment Gateway Distribution (%)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {paymentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsOrders;
