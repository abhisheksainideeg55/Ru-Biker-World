import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  ShoppingBag,
  Percent
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

export const AdminAnalyticsSales = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const salesTrendData = [
    { date: '01 Sep', sales: 42000, orders: 18, refunds: 0 },
    { date: '05 Sep', sales: 68000, orders: 28, refunds: 1200 },
    { date: '10 Sep', sales: 55000, orders: 22, refunds: 0 },
    { date: '15 Sep', sales: 98000, orders: 42, refunds: 2400 },
    { date: '20 Sep', sales: 125000, orders: 54, refunds: 0 },
    { date: '25 Sep', sales: 110000, orders: 48, refunds: 1800 },
    { date: '28 Sep', sales: 145000, orders: 62, refunds: 0 },
  ];

  const categoryBreakdown = [
    { category: 'Helmets & Visors', revenue: 420000, percentage: '38%' },
    { category: 'Performance Exhausts & Parts', revenue: 380000, percentage: '34%' },
    { category: 'Riding Jackets & Gloves', revenue: 185000, percentage: '17%' },
    { category: 'Luggage & Touring Mounts', revenue: 125000, percentage: '11%' },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Gross Sales,Orders Count,Refunds\n"
      + salesTrendData.map(e => `${e.date},${e.sales},${e.orders},${e.refunds}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RU_BIKER_WORLD_Sales_Analytics_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <span className="text-xs text-slate-500 font-medium">Revenue & Sales Performance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            Sales & Revenue Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze gross sales, net revenue, discounts, returns, taxes, and daily volume metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Year to Date</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹11,10,000</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs previous period
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order Value (AOV)</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹4,051</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +8.4% rider ticket size
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">274 Orders</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">98.2% completed rate</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Discounts & Coupons</span>
            <Percent className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">₹64,200</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">5.7% discount margin</div>
        </div>
      </div>

      {/* Chart: Sales & Orders Trend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">Sales Volume vs Number of Orders</h2>
            <p className="text-xs text-slate-500">Daily revenue curve across {dateRange}</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrendData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" name="Gross Revenue (₹)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Contribution Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">Sales by Category Contribution</h2>
          <span className="text-xs text-slate-400 font-medium">Authoritative category sales</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Bike Category</th>
                <th className="py-3 px-4">Revenue Generated</th>
                <th className="py-3 px-4">Share of Total Sales</th>
                <th className="py-3 px-4">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {categoryBreakdown.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{cat.category}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{cat.revenue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{cat.percentage}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      High Velocity
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

export default AdminAnalyticsSales;
