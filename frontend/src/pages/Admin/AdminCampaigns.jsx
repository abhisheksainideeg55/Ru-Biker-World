import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Tag,
  TrendingUp,
  Percent,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  DollarSign,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 'CMP-01',
      name: 'Diwali Rider Mega Festival 2026',
      type: 'Festival Sale',
      couponCode: 'DIWALI20',
      budget: 50000,
      revenueGenerated: 348000,
      startDate: '2026-10-15',
      endDate: '2026-11-05',
      status: 'Scheduled',
      targetCategory: 'All Store Categories'
    },
    {
      id: 'CMP-02',
      name: 'Monsoon Touring & Waterproof Gear Fest',
      type: 'Seasonal Sale',
      couponCode: 'RAINRIDER',
      budget: 25000,
      revenueGenerated: 189500,
      startDate: '2026-08-01',
      endDate: '2026-09-30',
      status: 'Active',
      targetCategory: 'Riding Gear & Luggage'
    },
    {
      id: 'CMP-03',
      name: 'Royal Enfield Hunter & Classic Launch Wave',
      type: 'Product Launch',
      couponCode: 'REHUNTER',
      budget: 15000,
      revenueGenerated: 94200,
      startDate: '2026-09-10',
      endDate: '2026-10-10',
      status: 'Active',
      targetCategory: 'Performance Parts'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'Seasonal Sale',
    couponCode: 'RUBIKER10',
    budget: 20000,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    targetCategory: 'Helmets & Visors'
  });

  const handleAddCampaign = (e) => {
    e.preventDefault();
    if (!newCampaign.name) return;
    const item = {
      id: `CMP-0${campaigns.length + 1}`,
      ...newCampaign,
      revenueGenerated: 0,
      status: 'Scheduled'
    };
    setCampaigns([item, ...campaigns]);
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
            <span className="text-xs text-slate-500 font-medium">Seasonal & Event Campaigns</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-amber-500" />
            Marketing Campaigns & Seasonal Promotions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Orchestrate festival sales, product launches, coupon attachments, and track ROI per campaign.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">Configured Campaigns</h2>
          <span className="text-xs text-slate-400 font-medium">{campaigns.length} Total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Attached Coupon</th>
                <th className="py-3 px-4">Target Category</th>
                <th className="py-3 px-4">Budget / Revenue</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{c.name}</div>
                    <span className="font-mono text-[10px] text-slate-400">ID: {c.id}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{c.type}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[11px]">
                      {c.couponCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{c.targetCategory}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-900">₹{c.revenueGenerated.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">Budget: ₹{c.budget.toLocaleString()}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {c.startDate} to {c.endDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setCampaigns(campaigns.filter(x => x.id !== c.id))}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Create Marketing Campaign</h3>

            <form onSubmit={handleAddCampaign} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Rider Warm-Up Sale"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option>Festival Sale</option>
                    <option>Seasonal Sale</option>
                    <option>Product Launch</option>
                    <option>Clearance Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attached Coupon</label>
                  <input
                    type="text"
                    value={newCampaign.couponCode}
                    onChange={(e) => setNewCampaign({ ...newCampaign, couponCode: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marketing Budget (₹)</label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Category</label>
                  <select
                    value={newCampaign.targetCategory}
                    onChange={(e) => setNewCampaign({ ...newCampaign, targetCategory: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>All Store Categories</option>
                    <option>Helmets & Visors</option>
                    <option>Riding Gear & Luggage</option>
                    <option>Performance Parts</option>
                    <option>LED Lighting & Electronics</option>
                  </select>
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
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaigns;
