import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  UserPlus,
  Repeat,
  DollarSign,
  Calendar,
  Download,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const AdminAnalyticsCustomers = () => {
  const customerGrowthData = [
    { month: 'Apr', newRiders: 180, returning: 60 },
    { month: 'May', newRiders: 240, returning: 95 },
    { month: 'Jun', newRiders: 310, returning: 140 },
    { month: 'Jul', newRiders: 420, returning: 210 },
    { month: 'Aug', newRiders: 560, returning: 320 },
    { month: 'Sep', newRiders: 720, returning: 480 },
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
            <span className="text-xs text-slate-500 font-medium">Customer Retention & LTV</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-500" />
            Customer & Rider Cohort Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze customer acquisition trends, repeat purchase rate, customer lifetime value (LTV), and churn.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Registered Riders</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">4,890</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+28.4% month over month</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Repeat Purchase Rate</span>
            <Repeat className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">38.2%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">High rider brand loyalty</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Customer LTV</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹14,850</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Based on 12-month cohort</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">VIP Club Members</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">412 Riders</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">₹25,000+ spend threshold</div>
        </div>
      </div>

      {/* Chart: New vs Returning Customers */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-black text-slate-900">New Riders vs Repeat Purchasing Riders</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={customerGrowthData}>
              <defs>
                <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="repeatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="newRiders" name="New Customer Registrations" stroke="#0f172a" fillOpacity={1} fill="url(#newGrad)" />
              <Area type="monotone" dataKey="returning" name="Repeat Purchasing Customers" stroke="#f59e0b" fillOpacity={1} fill="url(#repeatGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsCustomers;
