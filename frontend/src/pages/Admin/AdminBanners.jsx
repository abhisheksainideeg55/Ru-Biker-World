import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Eye,
  MousePointerClick,
  TrendingUp,
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Tag
} from 'lucide-react';
import AdminMediaModal from './AdminMediaModal';

export const AdminBanners = () => {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [banners, setBanners] = useState([
    {
      id: 'BNR-101',
      title: 'Monsoon Riding Gear Flat 25% Off',
      placement: 'Homepage Promo Grid',
      targetUrl: '/shop?category=Riding%20Gear',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      impressions: 48920,
      clicks: 4120,
      ctr: '8.4%',
      status: 'Active',
      startDate: '2026-09-01',
      endDate: '2026-10-31'
    },
    {
      id: 'BNR-102',
      title: 'Royal Enfield Classic & Hunter Crash Guards Launch',
      placement: 'Category Top Bar (Crash Protection)',
      targetUrl: '/shop?brand=Royal%20Enfield',
      imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
      impressions: 31200,
      clicks: 2940,
      ctr: '9.4%',
      status: 'Active',
      startDate: '2026-09-15',
      endDate: '2026-11-15'
    },
    {
      id: 'BNR-103',
      title: 'Free Helmet Cleaner Kit on orders above ₹1,999',
      placement: 'Header Announcement Bar',
      targetUrl: '/offers',
      imageUrl: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=800&auto=format&fit=crop&q=80',
      impressions: 92400,
      clicks: 8650,
      ctr: '9.3%',
      status: 'Active',
      startDate: '2026-09-01',
      endDate: '2026-12-31'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    placement: 'Homepage Promo Grid',
    targetUrl: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    startDate: '2026-09-28',
    endDate: '2026-10-28'
  });

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!newBanner.title) return;
    const item = {
      id: `BNR-${Date.now().toString().slice(-3)}`,
      ...newBanner,
      impressions: 0,
      clicks: 0,
      ctr: '0.0%',
      status: 'Active'
    };
    setBanners([item, ...banners]);
    setShowAddModal(false);
    setNewBanner({
      title: '',
      placement: 'Homepage Promo Grid',
      targetUrl: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      startDate: '2026-09-28',
      endDate: '2026-10-28'
    });
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
            <span className="text-xs text-slate-500 font-medium">Banners & Merchandising</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-amber-500" />
            Promotional Banners & Placements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deploy promotional banners across storefront slots, track views, clicks, and conversion rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Create Promotional Banner
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">172.5K</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+14.2% this month</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Click-Throughs</span>
            <MousePointerClick className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">15.7K Clicks</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Direct store traffic</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average CTR</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">9.1%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">High conversion threshold</div>
        </div>
      </div>

      {/* Banner Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">Live Campaign Banners</h2>
          <span className="text-xs text-slate-400 font-medium">{banners.length} Placements active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Banner Creative & Title</th>
                <th className="py-3 px-4">Placement Slot</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Clicks (CTR)</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {banners.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-200">
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{b.title}</div>
                        <div className="text-[10px] text-amber-600 font-mono">ID: {b.id} • {b.targetUrl}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{b.placement}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{b.impressions.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-slate-900">{b.clicks.toLocaleString()}</span>{' '}
                    <span className="text-[11px] font-bold text-emerald-600">({b.ctr})</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {b.startDate} to {b.endDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3" /> {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setBanners(banners.filter(x => x.id !== b.id))}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Banner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Create Promotional Banner</h3>

            <form onSubmit={handleAddBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festive Diwali Superbike Accessories Sale"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Storefront Placement</label>
                <select
                  value={newBanner.placement}
                  onChange={(e) => setNewBanner({ ...newBanner, placement: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option>Homepage Promo Grid</option>
                  <option>Category Top Bar (Crash Protection)</option>
                  <option>Header Announcement Bar</option>
                  <option>Product Details Bottom Strip</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Destination URL</label>
                <input
                  type="text"
                  value={newBanner.targetUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, targetUrl: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL / Local File</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBanner.imageUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Select
                  </button>
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminMediaModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectMedia={(asset) => setNewBanner({ ...newBanner, imageUrl: asset.url })}
        title="Select Banner Graphic"
      />
    </div>
  );
};

export default AdminBanners;
