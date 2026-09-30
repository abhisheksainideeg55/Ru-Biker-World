import React, { useState } from 'react';
import {
  FiX,
  FiSearch,
  FiImage,
  FiVideo,
  FiPlay,
  FiCheck,
  FiUploadCloud,
  FiPlus,
  FiFilter
} from 'react-icons/fi';

export const MEDIA_GALLERY_ASSETS = [
  // Helmets & Gear
  {
    id: 'med-1',
    type: 'image',
    category: 'Helmets & Gear',
    title: 'MT Thunder 4 SV Full Face Helmet - Matte Black',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '142 KB'
  },
  {
    id: 'med-2',
    type: 'image',
    category: 'Helmets & Gear',
    title: 'Axor Apex Venom Dual Visor Helmet - Neon Orange',
    url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '188 KB'
  },
  {
    id: 'med-3',
    type: 'image',
    category: 'Helmets & Gear',
    title: 'Rynox Air GT 4 All-Season Riding Jacket',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '165 KB'
  },
  {
    id: 'med-4',
    type: 'image',
    category: 'Helmets & Gear',
    title: 'Carbon Knuckle All-Weather Riding Gloves',
    url: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '124 KB'
  },

  // Spare Parts & Brakes
  {
    id: 'med-5',
    type: 'image',
    category: 'Spare Parts',
    title: 'Brembo Sintered Ceramic Brake Pads Front/Rear',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '210 KB'
  },
  {
    id: 'med-6',
    type: 'image',
    category: 'Spare Parts',
    title: 'DID Japan X-Ring High-Tensile 520 Gold Chain',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '195 KB'
  },
  {
    id: 'med-7',
    type: 'image',
    category: 'Spare Parts',
    title: 'BMC Performance High-Flow Air Filter',
    url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '172 KB'
  },

  // Accessories & Touring
  {
    id: 'med-8',
    type: 'image',
    category: 'Accessories & Touring',
    title: 'Hella 60W Cree LED Auxiliary Fog Light Pods',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '180 KB'
  },
  {
    id: 'med-9',
    type: 'image',
    category: 'Accessories & Touring',
    title: 'Bobo Claw-Grip Mobile Mount with 15W Fast Wireless Charger',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '135 KB'
  },

  // Protection & Bash Plates
  {
    id: 'med-10',
    type: 'image',
    category: 'Protection',
    title: 'Zana Heavy-Duty Aluminum Engine Bash Plate Guard',
    url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '225 KB'
  },

  // Oils & Fluids
  {
    id: 'med-11',
    type: 'image',
    category: 'Oils & Fluids',
    title: 'Motul 7100 10W-50 4T 100% Fully Synthetic Engine Oil',
    url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
    dimensions: '800x800',
    size: '155 KB'
  },

  // Videos
  {
    id: 'med-vid-1',
    type: 'video',
    category: 'Performance',
    title: 'Akrapovic Slip-On Exhaust Sound & Flyby Dyno Test',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
    duration: '0:45 min',
    size: '4.2 MB'
  },
  {
    id: 'med-vid-2',
    type: 'video',
    category: 'Spare Parts',
    title: 'Ceramic Brake Pad Installation & Bleeding Tutorial',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-fast-on-a-highway-41130-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    duration: '1:20 min',
    size: '8.6 MB'
  },
  {
    id: 'med-vid-3',
    type: 'video',
    category: 'Helmets & Gear',
    title: 'MT Thunder 4 SV Pinlock Visor & Airflow Demonstration',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    duration: '0:58 min',
    size: '5.1 MB'
  }
];

export const AdminMediaModal = ({ isOpen, onClose, onSelect, initialTab = 'image' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'image' | 'video'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = React.useRef(null);

  if (!isOpen) return null;

  const categories = ['Helmets & Gear', 'Spare Parts', 'Accessories & Touring', 'Oils & Fluids', 'Performance', 'Protection'];

  const filteredAssets = MEDIA_GALLERY_ASSETS.filter((item) => {
    if (item.type !== activeTab) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultUrl = uploadEvent.target.result;
      onSelect({
        url: resultUrl,
        title: file.name,
        type: activeTab,
      });
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onSelect({
      url: customUrl.trim(),
      title: 'Custom Media Asset',
      type: activeTab,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 font-sans animate-fadeIn">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Hidden File Picker Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept={activeTab === 'image' ? 'image/*' : 'video/*'}
          className="hidden"
        />

        {/* ===================== MODAL HEADER ===================== */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              {activeTab === 'image' ? <FiImage className="w-5 h-5 text-amber-400" /> : <FiVideo className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">RU BIKER Media & Asset Gallery</h2>
              <p className="text-xs text-slate-500">
                Browse, preview or upload photos / demo video clips directly from your computer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <FiUploadCloud className="w-4 h-4" />
              <span>Upload from PC</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================== TABS & SEARCH CONTROLS ===================== */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'image'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FiImage className="w-3.5 h-3.5" />
              <span>Image Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FiVideo className="w-3.5 h-3.5" />
              <span>Demo Videos</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'image' ? 'bike parts, helmets...' : 'video clips...'}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===================== GALLERY CONTENT GRID ===================== */}
        <div className="flex-1 p-5 overflow-y-auto max-h-[58vh]">
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative bg-white rounded-2xl border border-slate-200 hover:border-amber-500 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={asset.type === 'video' ? asset.thumbnail : asset.url}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {asset.type === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                          <FiPlay className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                      {asset.category}
                    </span>

                    {asset.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                        {asset.duration}
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-white">
                    <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {asset.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{asset.dimensions || asset.size}</span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(asset);
                          onClose();
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-transform active:scale-95"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              No media found matching "{search}". You can add a custom URL below.
            </div>
          )}
        </div>

        {/* ===================== DIRECT URL FOOTER ===================== */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <form onSubmit={handleApplyCustomUrl} className="flex-1 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Insert Custom {activeTab === 'image' ? 'Image' : 'Video'} URL:
            </span>
            <input
              type="url"
              placeholder={activeTab === 'image' ? 'https://example.com/part-photo.jpg' : 'https://example.com/demo.mp4'}
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              Insert URL
            </button>
          </form>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMediaModal;
