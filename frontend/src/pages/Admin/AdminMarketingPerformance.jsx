import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Tag,
  Eye,
  MousePointerClick,
  Mail,
  Download,
  Calendar,
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
  AreaChart,
  Area,
  Legend
} from 'recharts';

export const AdminMarketingPerformance = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Attribution Data for Charts
  const attributionData = [
    { month: 'May', organic: 140000, campaigns: 85000, coupons: 42000 },
    { month: 'Jun', organic: 165000, campaigns: 110000, coupons: 60000 },
    { month: 'Jul', organic: 190000, campaigns: 145000, coupons: 78000 },
    { month: 'Aug', organic: 220000, campaigns: 190000, coupons: 95000 },
    { month: 'Sep', organic: 260000, campaigns: 240000, coupons: 132000 },
  ];

  const campaignComparison = [
    { name: 'Diwali Rider Fest', spend: 50000, revenue: 348000, roas: '6.96x' },
    { name: 'Monsoon Touring Fest', spend: 25000, revenue: 189500, roas: '7.58x' },
    { name: 'RE Hunter Launch', spend: 15000, revenue: 94200, roas: '6.28x' },
    { name: 'Helmet Flash Deal', spend: 8000, revenue: 64000, roas: '8.00x' },
  ];

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
            <span className="text-xs text-slate-500 font-medium">Attribution & ROAS Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            Marketing Performance & Campaign ROI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track revenue attribution from campaigns, coupon redemptions, banner engagement, and ROAS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Campaign Attributed Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹6,95,700</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">42.4% of total store revenue</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Coupon Redemptions</span>
            <Tag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">1,420 Orders</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+18.5% voucher lift</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Campaign ROAS</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">7.12x Return</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">High conversion efficiency</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Marketing Conversion</span>
            <MousePointerClick className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">4.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Benchmark: 3.2% in auto</div>
        </div>
      </div>

      {/* Chart: Revenue Attribution */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">Revenue Attribution Breakdown (Monthly)</h2>
            <p className="text-xs text-slate-500">Organic vs Paid Campaigns vs Promo Coupons</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attributionData}>
              <defs>
                <linearGradient id="colorCampaigns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
              <Legend />
              <Area type="monotone" dataKey="organic" name="Organic Storefront Sales" stroke="#0f172a" fillOpacity={1} fill="url(#colorOrganic)" />
              <Area type="monotone" dataKey="campaigns" name="Marketing Campaigns" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCampaigns)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table: Campaign ROAS Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">Individual Campaign Performance & ROAS</h2>
          <span className="text-xs text-slate-400 font-medium">Authoritative backend attribution</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Marketing Spend</th>
                <th className="py-3 px-4">Attributed Sales Revenue</th>
                <th className="py-3 px-4">ROAS Multiplier</th>
                <th className="py-3 px-4">Performance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {campaignComparison.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">₹{item.spend.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{item.revenue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-600">{item.roas}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      Exceptional Return
                    </span>
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

export default AdminMarketingPerformance;
