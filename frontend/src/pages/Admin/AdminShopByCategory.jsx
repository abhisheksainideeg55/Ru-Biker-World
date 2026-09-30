import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  UploadCloud,
  X,
  ExternalLink,
  Grid
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { adminService } from '../../services/adminService';

const INITIAL_SHOP_BY_CATEGORIES = [
  {
    id: 'bike-protection',
    name: 'Bike Protection',
    image: '/ChatGPT_Image_Apr_25_2026_02_14_12_PM.png',
    link: '/shop?category=Protection%20%26%20Guards',
    status: 'active',
    order: 1
  },
  {
    id: 'rider-protection',
    name: 'Rider Protection',
    image: '/ChatGPT_Image_Apr_25_2026_02_06_34_PM.png',
    link: '/shop?category=Helmets%20%26%20Gear',
    status: 'active',
    order: 2
  },
  {
    id: 'luggage',
    name: 'Luggage Inn',
    image: '/ChatGPT_Image_Apr_25_2026_03_17_07_PM.png',
    link: '/shop?category=Luggage',
    status: 'active',
    order: 3
  },
  {
    id: 'performance-parts',
    name: 'Performance Parts',
    image: '/ChatGPT_Image_Apr_25_2026_03_11_20_PM.png',
    link: '/shop?category=Performance%20%26%20Exhaust',
    status: 'active',
    order: 4
  },
  {
    id: 'chain-sprocket',
    name: 'Chain Sprockets',
    image: '/ChatGPT_Image_Apr_25_2026_02_08_58_PM.png',
    link: '/shop?category=Spare%20Parts',
    status: 'active',
    order: 5
  },
  {
    id: 'lights-and-electronics',
    name: 'Lights & Electronics',
    image: '/ChatGPT_Image_Apr_25_2026_02_10_38_PM.png',
    link: '/shop?category=Lighting%20%26%20Electrical',
    status: 'active',
    order: 6
  },
  {
    id: 'mirrors',
    name: 'Mirrors',
    image: '/ChatGPT_Image_Apr_25_2026_02_12_35_PM.png',
    link: '/shop?category=Accessories%20%26%20Touring',
    status: 'active',
    order: 7
  }
];

export const AdminShopByCategory = () => {
  const { addToast } = useNotifications() || {};
  const [categories, setCategories] = useState(INITIAL_SHOP_BY_CATEGORIES);

  // Load from database on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const dbData = await adminService.getShopByCategory();
        if (isMounted && Array.isArray(dbData) && dbData.length > 0) {
          setCategories(dbData);
        }
      } catch (err) {
        console.warn('[AdminShopByCategory] DB fetch error:', err.message);
      }
    };
    fetchCats();
    return () => { isMounted = false; };
  }, []);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedCat, setSelectedCat] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    link: '',
    status: 'active',
    order: 1
  });

  const saveCategories = async (updated) => {
    setCategories(updated);
    try {
      await adminService.saveShopByCategory(updated);
      window.dispatchEvent(new Event('sparify_shop_by_category_updated'));
    } catch (e) {
      console.warn('Failed to save shop by category to database:', e.message);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.link && c.link.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCat(null);
    setFormData({
      name: '',
      image: '',
      link: '/shop?category=',
      status: 'active',
      order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setModalMode('edit');
    setSelectedCat(cat);
    setFormData({
      name: cat.name,
      image: cat.image || '',
      link: cat.link || `/shop?category=${encodeURIComponent(cat.name)}`,
      status: cat.status || 'active',
      order: cat.order || 1
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultUrl = uploadEvent.target.result;
      setFormData((prev) => ({
        ...prev,
        image: resultUrl
      }));
      if (addToast) addToast({ type: 'success', message: `Category photo "${file.name}" loaded!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Category Title is required.' });
      return;
    }

    const generatedLink = formData.link.trim() || `/shop?category=${encodeURIComponent(formData.name.trim())}`;
    const idSlug = formData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (modalMode === 'create') {
      const newCat = {
        id: idSlug || `cat-banner-${Date.now()}`,
        name: formData.name.trim(),
        image: formData.image.trim() || '/ChatGPT_Image_Apr_25_2026_02_06_34_PM.png',
        link: generatedLink,
        status: formData.status,
        order: Number(formData.order) || categories.length + 1
      };

      const updated = [...categories, newCat];
      saveCategories(updated);
      if (addToast) addToast({ type: 'success', message: `Category Card "${newCat.name}" created!` });
    } else {
      const updated = categories.map((c) =>
        c.id === selectedCat.id
          ? {
              ...c,
              name: formData.name.trim(),
              image: formData.image.trim() || c.image,
              link: generatedLink,
              status: formData.status,
              order: Number(formData.order)
            }
          : c
      );
      saveCategories(updated);
      if (addToast) addToast({ type: 'success', message: `Category Card "${formData.name}" updated!` });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (cat) => {
    if (window.confirm(`Are you sure you want to delete Category "${cat.name}"?`)) {
      const updated = categories.filter((c) => c.id !== cat.id);
      saveCategories(updated);
      if (addToast) addToast({ type: 'info', message: `Category Card "${cat.name}" removed.` });
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all Shop By Category cards to default 9 categories?')) {
      saveCategories(INITIAL_SHOP_BY_CATEGORIES);
      if (addToast) addToast({ type: 'success', message: 'Restored all 9 default category cards!' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-6 max-w-7xl mx-auto">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Shop By Category (Home Section Cards)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage visual category cards, promotional banners, custom artwork photos, and destination shop links
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border border-slate-200"
            title="Restore all 9 default category cards"
          >
            <span>Restore Defaults</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Add Category Card</span>
          </button>
        </div>
      </div>

      {/* ===================== SEARCH & STATS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search category cards (Rider Protection, Luggage Inn, Performance Parts...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-3">
          <span>
            Total Category Cards: <strong className="text-slate-900">{categories.length}</strong> (
            {categories.filter((c) => c.status === 'active').length} Active on Homepage)
          </span>
        </div>
      </div>

      {/* ===================== CATEGORY CARDS GRID ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Category Card Image Box with Aspect Ratio */}
              <div className="relative h-48 bg-slate-50 p-2 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/ChatGPT_Image_Apr_25_2026_02_06_34_PM.png';
                  }}
                />
                <span
                  className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    cat.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {cat.status}
                </span>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{cat.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400">Order #{cat.order || 1}</span>
                </div>

                <p className="text-xs text-slate-400 font-mono line-clamp-1">{cat.link}</p>
              </div>
            </div>

            {/* Footer Actions & Storefront Link */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <a
                href={cat.link || `/shop?category=${encodeURIComponent(cat.name)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                <span>View Filter</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Edit Category Card"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Category Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== ADD / EDIT CATEGORY CARD MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-900">
                  {modalMode === 'create' ? 'Add Shop By Category Card' : 'Edit Category Card'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Category Name & Order */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Category Card Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rider Protection, Luggage Inn, Performance Parts"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        name: val,
                        link: formData.link && formData.link !== '/shop?category=' ? formData.link : `/shop?category=${encodeURIComponent(val)}`
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-center text-xs font-bold focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Image Upload & URL input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Card Banner Photo (Upload or URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">PNG / JPG Banner Artwork</span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Live Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/ChatGPT_Image_Apr_25_2026_02_06_34_PM.png';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload Banner Artwork from Computer</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /ChatGPT_Image_...png or https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Target Storefront Filter Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Destination Storefront Link
                </label>
                <input
                  type="text"
                  placeholder="/shop?category=Helmets%20%26%20Gear"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                >
                  <option value="active">Active (Visible on Homepage Carousel)</option>
                  <option value="inactive">Inactive / Draft (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {modalMode === 'create' ? 'Save & Add Category Card' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShopByCategory;
