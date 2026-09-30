import React, { useState } from 'react';
import {
  FiImage,
  FiVideo,
  FiPlay,
  FiPlus,
  FiSearch,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiFilter,
  FiExternalLink
} from 'react-icons/fi';
import { MEDIA_GALLERY_ASSETS } from './AdminMediaModal';
import { useNotifications } from '../../hooks/useNotifications';

export const AdminMediaGallery = () => {
  const { addToast } = useNotifications() || {};
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'image' | 'video'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [assets, setAssets] = useState(MEDIA_GALLERY_ASSETS);
  const [copiedId, setCopiedId] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // New Media Asset Form Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    title: '',
    category: 'Helmets & Gear',
    type: 'image',
    url: '',
    thumbnail: '',
    duration: '',
  });

  const categories = ['Helmets & Gear', 'Spare Parts', 'Accessories & Touring', 'Oils & Fluids', 'Performance', 'Protection'];

  const filteredAssets = assets.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopyUrl = (item) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    if (addToast) addToast({ type: 'success', message: 'Asset URL copied to clipboard!' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAsset.title.trim() || !newAsset.url.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Title and URL are required.' });
      return;
    }

    const created = {
      id: `med-${Date.now()}`,
      title: newAsset.title.trim(),
      category: newAsset.category,
      type: newAsset.type,
      url: newAsset.url.trim(),
      thumbnail: newAsset.type === 'video' ? (newAsset.thumbnail.trim() || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800') : undefined,
      duration: newAsset.duration ? newAsset.duration.trim() : undefined,
      size: 'Cloud CDN',
    };

    setAssets([created, ...assets]);
    setIsAddModalOpen(false);
    setNewAsset({
      title: '',
      category: 'Helmets & Gear',
      type: 'image',
      url: '',
      thumbnail: '',
      duration: '',
    });
    if (addToast) addToast({ type: 'success', message: `Added "${created.title}" to Media Library!` });
  };

  const handleDeleteAsset = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
    if (addToast) addToast({ type: 'info', message: 'Asset removed from library.' });
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ===================== PAGE HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FiImage className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Media & Video Assets Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Central repository for bike part images, helmet renders, exhausts & demo video reels
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
        >
          <FiPlus className="w-4 h-4" />
          <span>Upload / Add Media Asset</span>
        </button>
      </div>

      {/* ===================== FILTER CONTROLS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Media ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'image'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FiImage className="w-3.5 h-3.5" />
            <span>Photos ({assets.filter((a) => a.type === 'image').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FiVideo className="w-3.5 h-3.5" />
            <span>Demo Videos ({assets.filter((a) => a.type === 'video').length})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-1 max-w-md items-center gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets by title, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===================== ASSET CARDS GRID ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredAssets.map((item) => {
          const isVideo = item.type === 'video';
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
                <img
                  src={isVideo ? item.thumbnail : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {isVideo && (
                  <button
                    onClick={() => setPreviewVideoUrl(item.url)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <FiPlay className="w-5 h-5 fill-current ml-0.5 text-amber-500" />
                    </div>
                  </button>
                )}

                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {item.category}
                </span>

                <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                  {isVideo ? <FiVideo className="w-3 h-3 text-amber-500" /> : <FiImage className="w-3 h-3 text-blue-500" />}
                  {item.type}
                </span>

                {item.duration && (
                  <span className="absolute bottom-2.5 right-2.5 bg-black/85 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.duration}
                  </span>
                )}
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">
                    {item.url}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      title="Open in new tab"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteAsset(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete asset"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================== ADD ASSET MODAL ===================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 animate-fadeIn">
            <h3 className="font-bold text-lg text-slate-900">Add New Media Asset</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a high-resolution motorcycle photo or demo video clip to the store library.
            </p>

            <form onSubmit={handleAddAsset} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. MT Thunder 4 SV Airflow Demo / Akrapovic Exhaust Flyby"
                  value={newAsset.title}
                  onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Asset Type
                  </label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="image">Image / Photo</option>
                    <option value="video">Product Demo Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Category
                  </label>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Direct Media URL (CDN, Unsplash, Mixkit, mp4)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://...video.mp4"
                  value={newAsset.url}
                  onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  required
                />
              </div>

              {newAsset.type === 'video' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Video Poster / Thumbnail URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newAsset.thumbnail}
                      onChange={(e) => setNewAsset({ ...newAsset, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Duration (e.g. 0:45 min)
                    </label>
                    <input
                      type="text"
                      placeholder="0:45 min"
                      value={newAsset.duration}
                      onChange={(e) => setNewAsset({ ...newAsset, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VIDEO PREVIEW MODAL ===================== */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FiPlay className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">Product Demo Video Player</h3>
              </div>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediaGallery;
