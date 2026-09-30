import React, { useState } from 'react';
import {
  TrendingUp,
  Tag,
  DollarSign,
  Eye,
  MousePointerClick,
  Layers,
  ArrowUpRight,
  Filter
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
  AreaChart,
  Area
} from 'recharts';

export const AdminAnalyticsMarketing = () => {
  const channelData = [
    { channel: 'Direct / Organic Search', visitors: 45000, orders: 420, revenue: 1680000 },
    { channel: 'Festival Sales & Banners', visitors: 28000, orders: 310, revenue: 1240000 },
    { channel: 'Coupon Codes & Promos', visitors: 19500, orders: 240, revenue: 960000 },
    { channel: 'Email & WhatsApp VIP', visitors: 12000, orders: 190, revenue: 760000 },
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
            <span className="text-xs text-slate-500 font-medium">Channel & Promo Attribution</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            Marketing & Traffic Channel Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare acquisition channels, traffic sources, coupon redemption velocities, and marketing conversion rates.
          </p>
        </div>
      </div>

      {/* Chart: Channels Revenue */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-black text-slate-900">Revenue Contribution by Acquisition Channel (₹)</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="channel" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" name="Revenue (₹)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">Traffic Source Performance Table</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Channel / Traffic Source</th>
                <th className="py-3 px-4">Visitors</th>
                <th className="py-3 px-4">Attributed Orders</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {channelData.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.channel}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{c.visitors.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.orders} orders</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{c.revenue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    {((c.orders / c.visitors) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsMarketing;
