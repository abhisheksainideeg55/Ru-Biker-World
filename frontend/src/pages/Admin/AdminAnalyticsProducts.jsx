import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  Download,
  Search,
  Eye,
  ShoppingBag,
  RotateCcw,
  ArrowUpRight
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

export const AdminAnalyticsProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const topProductsChart = [
    { name: 'Akrapovič Slip-on', units: 82, revenue: 3197918 },
    { name: 'AGV Pista Carbon', units: 64, revenue: 2688000 },
    { name: 'Rynox Stealth Jacket', units: 110, revenue: 1045000 },
    { name: 'ViaTerra Saddlebags', units: 145, revenue: 855500 },
    { name: 'RE Hunter Crash Guard', units: 180, revenue: 810000 },
  ];

  const productPerformance = [
    {
      id: 'PROD-01',
      name: 'Akrapovič Slip-On Exhaust Ninja 400',
      category: 'Performance Parts',
      unitsSold: 82,
      revenue: 3197918,
      stockRemaining: 14,
      returnRate: '0.8%',
      views: 14200,
      conversion: '5.8%'
    },
    {
      id: 'PROD-02',
      name: 'AGV Pista GP RR Carbon Helmet',
      category: 'Helmets & Visors',
      unitsSold: 64,
      revenue: 2688000,
      stockRemaining: 8,
      returnRate: '1.2%',
      views: 18900,
      conversion: '3.4%'
    },
    {
      id: 'PROD-03',
      name: 'Rynox Stealth Pro All-Weather Jacket',
      category: 'Riding Gear',
      unitsSold: 110,
      revenue: 1045000,
      stockRemaining: 22,
      returnRate: '2.1%',
      views: 9500,
      conversion: '11.5%'
    },
    {
      id: 'PROD-04',
      name: 'ViaTerra Condor 2.0 Waterproof Saddlebags',
      category: 'Luggage & Touring',
      unitsSold: 145,
      revenue: 855500,
      stockRemaining: 34,
      returnRate: '0.5%',
      views: 8400,
      conversion: '17.2%'
    }
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
            <span className="text-xs text-slate-500 font-medium">SKU Velocity & Conversion</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-amber-500" />
            Product Analytics & SKU Performance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track units sold, revenue generated, return rates, views-to-purchase conversion, and stock velocity.
          </p>
        </div>
      </div>

      {/* Chart: Top Products */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-black text-slate-900">Top 5 Bike Products by Revenue</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProductsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" name="Total Revenue (₹)" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">SKU Conversion & Return Metrics</h2>
          <span className="text-xs text-slate-400 font-medium">{productPerformance.length} Tracked items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Product Name & Category</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Remaining Stock</th>
                <th className="py-3 px-4">Views (Conversion)</th>
                <th className="py-3 px-4">Return Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {productPerformance.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{p.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{p.category} • {p.id}</span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{p.unitsSold} pcs</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{p.revenue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{p.stockRemaining} in stock</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{p.views.toLocaleString()}</span>{' '}
                    <span className="text-[11px] font-bold text-emerald-600">({p.conversion})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[11px]">
                      {p.returnRate}
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

export default AdminAnalyticsProducts;
