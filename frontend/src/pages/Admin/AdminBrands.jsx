import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  Award,
  ShieldCheck,
  Tag,
  Compass
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { featuredBrandList } from '../../components/home/FeaturedBrands';
import { brandWeTrustList } from '../../components/home/BrandWeTrust';
import { adminService } from '../../services/adminService';

export const AdminBrands = () => {
  const { addToast } = useNotifications() || {};
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' | 'trusted'

  // ===================== FEATURED BRANDS STATE =====================
  const [brands, setBrands] = useState(() => {
    return featuredBrandList.map((b, idx) => ({
      ...b,
      status: 'active',
      order: idx + 1
    }));
  });

  // ===================== TRUSTED BRANDS STATE =====================
  const [trustedBrands, setTrustedBrands] = useState(() => {
    return brandWeTrustList.map((b, idx) => ({
      ...b,
      status: 'active',
      order: idx + 1
    }));
  });

  // Load from database on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBrands = async () => {
      try {
        const [dbFeatured, dbTrusted] = await Promise.all([
          adminService.getFeaturedBrands(),
          adminService.getTrustedBrands(),
        ]);
        if (isMounted) {
          if (Array.isArray(dbFeatured) && dbFeatured.length > 0) {
            setBrands(dbFeatured);
          }
          if (Array.isArray(dbTrusted) && dbTrusted.length > 0) {
            setTrustedBrands(dbTrusted);
          }
        }
      } catch (err) {
        console.warn('[AdminBrands] DB fetch error:', err.message);
      }
    };
    fetchBrands();
    return () => { isMounted = false; };
  }, []);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    link: '',
    status: 'active',
    order: 1
  });

  // Save Featured Brands to database
  const saveBrands = async (updated) => {
    setBrands(updated);
    try {
      await adminService.saveFeaturedBrands(updated);
      window.dispatchEvent(new Event('sparify_featured_brands_updated'));
    } catch (e) {
      console.warn('Failed to save featured brands to database:', e.message);
    }
  };

  // Save Trusted Brands to database
  const saveTrustedBrands = async (updated) => {
    setTrustedBrands(updated);
    try {
      await adminService.saveTrustedBrands(updated);
      window.dispatchEvent(new Event('sparify_trusted_brands_updated'));
    } catch (e) {
      console.warn('Failed to save trusted brands to database:', e.message);
    }
  };

  // Reset Handlers
  const handleResetDefaults = () => {
    if (activeTab === 'featured') {
      if (window.confirm('Reset all Featured Brands to the 21 default brands?')) {
        const defaults = featuredBrandList.map((b, idx) => ({
          ...b,
          status: 'active',
          order: idx + 1
        }));
        saveBrands(defaults);
        if (addToast) addToast({ type: 'success', message: 'Restored all 21 default Featured Brands!' });
      }
    } else {
      if (window.confirm('Reset all Trusted Brands (Brand We Trust) to default OEM bike manufacturers?')) {
        const defaults = brandWeTrustList.map((b, idx) => ({
          ...b,
          status: 'active',
          order: idx + 1
        }));
        saveTrustedBrands(defaults);
        if (addToast) addToast({ type: 'success', message: 'Restored all 12 default Trusted Brands!' });
      }
    }
  };

  const currentList = activeTab === 'featured' ? brands : trustedBrands;

  const filteredItems = currentList.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.link && b.link.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedBrand(null);
    setFormData({
      name: '',
      image: '',
      link: activeTab === 'featured' ? '/shop?brand=' : '/shop?bike=',
      status: 'active',
      order: currentList.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setModalMode('edit');
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      image: brand.image || '',
      link: brand.link || (activeTab === 'featured' ? `/shop?brand=${encodeURIComponent(brand.name)}` : `/shop?bike=${encodeURIComponent(brand.name)}`),
      status: brand.status || 'active',
      order: brand.order || 1
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
      if (addToast) addToast({ type: 'success', message: `Brand logo "${file.name}" loaded!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Brand Name is required.' });
      return;
    }

    const defaultPrefix = activeTab === 'featured' ? '/shop?brand=' : '/shop?bike=';
    const generatedLink = formData.link.trim() || `${defaultPrefix}${encodeURIComponent(formData.name.trim())}`;
    const idSlug = formData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (activeTab === 'featured') {
      if (modalMode === 'create') {
        const newBrand = {
          id: idSlug || `brand-${Date.now()}`,
          name: formData.name.trim(),
          image: formData.image.trim() || '/Untitled_design_3.jpg',
          link: generatedLink,
          status: formData.status,
          order: Number(formData.order) || brands.length + 1
        };
        const updated = [...brands, newBrand];
        saveBrands(updated);
        if (addToast) addToast({ type: 'success', message: `Featured Brand "${newBrand.name}" created!` });
      } else {
        const updated = brands.map((b) =>
          b.id === selectedBrand.id
            ? {
                ...b,
                name: formData.name.trim(),
                image: formData.image.trim() || b.image,
                link: generatedLink,
                status: formData.status,
                order: Number(formData.order)
              }
            : b
        );
        saveBrands(updated);
        if (addToast) addToast({ type: 'success', message: `Featured Brand "${formData.name}" updated!` });
      }
    } else {
      // Trusted Brands Tab
      if (modalMode === 'create') {
        const newBrand = {
          id: idSlug || `trusted-${Date.now()}`,
          name: formData.name.trim().toUpperCase(),
          image: formData.image.trim() || '/brands/bajaj.svg',
          link: generatedLink,
          status: formData.status,
          order: Number(formData.order) || trustedBrands.length + 1
        };
        const updated = [...trustedBrands, newBrand];
        saveTrustedBrands(updated);
        if (addToast) addToast({ type: 'success', message: `Trusted Brand "${newBrand.name}" created!` });
      } else {
        const updated = trustedBrands.map((b) =>
          b.id === selectedBrand.id
            ? {
                ...b,
                name: formData.name.trim().toUpperCase(),
                image: formData.image.trim() || b.image,
                link: generatedLink,
                status: formData.status,
                order: Number(formData.order)
              }
            : b
        );
        saveTrustedBrands(updated);
        if (addToast) addToast({ type: 'success', message: `Trusted Brand "${formData.name}" updated!` });
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = (brand) => {
    if (window.confirm(`Are you sure you want to delete Brand "${brand.name}"?`)) {
      if (activeTab === 'featured') {
        const updated = brands.filter((b) => b.id !== brand.id);
        saveBrands(updated);
        if (addToast) addToast({ type: 'info', message: `Featured Brand "${brand.name}" removed.` });
      } else {
        const updated = trustedBrands.filter((b) => b.id !== brand.id);
        saveTrustedBrands(updated);
        if (addToast) addToast({ type: 'info', message: `Trusted Brand "${brand.name}" removed.` });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-6 max-w-7xl mx-auto">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {activeTab === 'featured' ? (
              <Award className="w-6 h-6 text-amber-500" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'featured'
                ? 'Featured Brands & Logos Management'
                : 'Category Trusted Brands (Brand We Trust)'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            {activeTab === 'featured'
              ? 'Manage official aftermarket partner brands, logos, homepage featured brand slider, and brand filtering'
              : 'Manage OEM motorcycle manufacturer logos shown under the homepage "Brand We Trust" carousel and bike filter links'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border border-slate-200"
            title={activeTab === 'featured' ? 'Restore all 21 default brands' : 'Restore all 12 default trusted brands'}
          >
            <span>{activeTab === 'featured' ? 'Restore 21 Defaults' : 'Restore 12 Defaults'}</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{activeTab === 'featured' ? '+ Add Featured Brand' : '+ Add Trusted Brand'}</span>
          </button>
        </div>
      </div>

      {/* ===================== NAVIGATION TABS ===================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => {
            setActiveTab('featured');
            setSearch('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'featured'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className={`w-4 h-4 ${activeTab === 'featured' ? 'text-amber-400' : 'text-slate-500'}`} />
          <span>Featured Brands ({brands.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('trusted');
            setSearch('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'trusted'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${activeTab === 'trusted' ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>Category Trusted Brands ({trustedBrands.length})</span>
        </button>
      </div>

      {/* ===================== SEARCH & STATS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'featured'
                ? 'Search featured brands (Motul, Rolon, Simtac, Axor, Studds...)'
                : 'Search trusted OEM bike brands (Bajaj, KTM, Royal Enfield, BMW, Benelli, TVS...)'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-3">
          <span>
            Total Brands: <strong className="text-slate-900">{currentList.length}</strong> (
            {currentList.filter((b) => b.status === 'active').length} Active on Storefront)
          </span>
        </div>
      </div>

      {/* ===================== BRANDS GRID ===================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredItems.map((brand) => (
          <div
            key={brand.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Brand Logo Box with Crisp Light Container */}
              <div className="relative h-32 bg-white p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    if (brand.fallbackImage && e.target.src !== brand.fallbackImage) {
                      e.target.src = brand.fallbackImage;
                    } else {
                      e.target.src = activeTab === 'featured' ? '/Untitled_design_3.jpg' : '/brands/bajaj.svg';
                    }
                  }}
                />
                <span
                  className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${
                    brand.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {brand.status}
                </span>
              </div>

              {/* Body Content */}
              <div className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{brand.name}</h3>
                  <span className="text-[9px] font-bold text-slate-400">#{brand.order || 1}</span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 line-clamp-1">{brand.link}</p>
              </div>
            </div>

            {/* Footer Actions & Storefront Link */}
            <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <Link
                to={
                  activeTab === 'featured'
                    ? `/admin/products?brand=${encodeURIComponent(brand.name)}`
                    : `/admin/products?search=${encodeURIComponent(brand.name)}`
                }
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60"
                title={`View all products for ${brand.name}`}
              >
                <span>Products Filter</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(brand)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Edit Brand"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(brand)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Brand"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== ADD / EDIT BRAND MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {activeTab === 'featured' ? (
                  <Award className="w-5 h-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                )}
                <h3 className="font-bold text-lg text-slate-900">
                  {modalMode === 'create'
                    ? activeTab === 'featured'
                      ? 'Add Featured Brand'
                      : 'Add Trusted Brand'
                    : activeTab === 'featured'
                    ? 'Edit Featured Brand'
                    : 'Edit Trusted Brand'}
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
              {/* Brand Name & Order */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === 'featured' ? 'e.g. Motul, Simtac, Axor, Studds' : 'e.g. BAJAJ, KTM, ROYAL ENFIELD'}
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const prefix = activeTab === 'featured' ? '/shop?brand=' : '/shop?bike=';
                      setFormData({
                        ...formData,
                        name: val,
                        link: formData.link && formData.link !== prefix ? formData.link : `${prefix}${encodeURIComponent(val)}`
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

              {/* Brand Logo Upload & URL input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Brand Logo Image (Upload or URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">SVG, PNG or JPG Logo</span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Live Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = activeTab === 'featured' ? '/Untitled_design_3.jpg' : '/brands/bajaj.svg';
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
                      <span>Upload Logo from Computer</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /brands/bajaj.svg or https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Storefront Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Destination Storefront URL / Route
                </label>
                <input
                  type="text"
                  placeholder={activeTab === 'featured' ? '/shop?brand=Motul' : '/shop?bike=Bajaj'}
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
                  <option value="active">Active (Visible on Storefront & Filters)</option>
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
                  {modalMode === 'create' ? 'Save & Add Brand' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
