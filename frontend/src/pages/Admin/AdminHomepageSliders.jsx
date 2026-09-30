import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Image as ImageIcon,
  Layers,
  Eye,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Monitor,
  ExternalLink,
  Save,
  Play,
  Upload
} from 'lucide-react';
import AdminMediaModal from './AdminMediaModal';

export const AdminHomepageSliders = () => {
  const [activeTab, setActiveTab] = useState('slides'); // 'slides' | 'sections' | 'preview'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [isMobileMediaPicker, setIsMobileMediaPicker] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hero Slides Data
  const [slides, setSlides] = useState([
    {
      id: 'SLIDE-1',
      title: 'SUPERBIKE PERFORMANCE EXHAUSTS',
      subtitle: 'Track-Tuned Akrapovič & SC-Project Systems',
      description: 'Engineered for maximum horsepower, deep aggressive rumble, and ultra-lightweight titanium build.',
      ctaText: 'Explore Exhausts',
      ctaUrl: '/shop?category=Performance%20Parts',
      desktopImg: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
      mobileImg: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
      active: true,
      badge: 'TOP SELLER',
      order: 1
    },
    {
      id: 'SLIDE-2',
      title: 'AERODYNAMIC CARBON HELMETS',
      subtitle: 'ECE 22.06 & DOT Certified Pro Helmets',
      description: 'Pinlock-ready anti-fog visors, Bluetooth intercom cavity, and emergency cheek pad release.',
      ctaText: 'Shop Helmets',
      ctaUrl: '/shop?category=Helmets%20%26%20Visors',
      desktopImg: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=1200&auto=format&fit=crop&q=80',
      mobileImg: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=600&auto=format&fit=crop&q=80',
      active: true,
      badge: 'NEW ARRIVAL',
      order: 2
    },
    {
      id: 'SLIDE-3',
      title: 'ALL-WEATHER TOURING & ADVENTURE LUGGAGE',
      subtitle: 'Waterproof Saddlebags & Magnetic Tank Bags',
      description: 'Heavy-duty Cordura ballistic fabric with quick-release mounting straps for Ladakh expeditions.',
      ctaText: 'View Touring Gear',
      ctaUrl: '/shop?category=Touring%20%26%20Luggage',
      desktopImg: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&auto=format&fit=crop&q=80',
      mobileImg: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
      active: true,
      badge: 'TOUR READY',
      order: 3
    }
  ]);

  // Homepage Sections Control
  const [sections, setSections] = useState([
    { id: 'SEC-HERO', name: 'Hero Carousel Slider', active: true, order: 1, layout: 'Full Width Slider' },
    { id: 'SEC-CAT', name: 'Shop By Bike Category (Grid)', active: true, order: 2, layout: '6-Column Circle Grid' },
    { id: 'SEC-FLASH', name: 'Flash Deal Countdown Box', active: true, order: 3, layout: 'Split Highlight Banner' },
    { id: 'SEC-FEAT', name: 'Featured Performance Parts', active: true, order: 4, layout: '4-Column Product Cards' },
    { id: 'SEC-BANNER', name: 'Mid-Page Rider Promo Banner', active: true, order: 5, layout: 'Full Width Hero Banner' },
    { id: 'SEC-TREND', name: 'Trending Helmets & Visors', active: true, order: 6, layout: '4-Column Product Cards' },
    { id: 'SEC-REVIEWS', name: 'Verified Rider Reviews & Badges', active: true, order: 7, layout: '3-Column Review Carousel' },
    { id: 'SEC-NEWS', name: 'RU BIKER Rider Club VIP Newsletter', active: true, order: 8, layout: 'Subscription Card' },
  ]);

  const [editingSlide, setEditingSlide] = useState(null);

  const handleMoveSlide = (index, direction) => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    setSlides(newSlides);
  };

  const handleToggleSlide = (id) => {
    setSlides(slides.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDeleteSlide = (id) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  const handlePublish = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleMediaSelect = (asset) => {
    if (editingSlide) {
      if (isMobileMediaPicker) {
        setEditingSlide({ ...editingSlide, mobileImg: asset.url });
      } else {
        setEditingSlide({ ...editingSlide, desktopImg: asset.url });
      }
    } else if (activeSlideIndex !== null) {
      const updated = [...slides];
      if (isMobileMediaPicker) {
        updated[activeSlideIndex].mobileImg = asset.url;
      } else {
        updated[activeSlideIndex].desktopImg = asset.url;
      }
      setSlides(updated);
    }
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
            <span className="text-xs text-slate-500 font-medium">Storefront Visual CMS</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Homepage & Hero Sliders Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build dynamic hero banners, reorder storefront sections, and preview live customer experience.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Published to Live Storefront
            </span>
          )}
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4 text-amber-400" />
            Publish Homepage CMS
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'slides'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Hero Carousel Slides ({slides.length})
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sections'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Homepage Sections Reorder ({sections.length})
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Live Device Preview
        </button>
      </div>

      {/* TAB 1: SLIDES */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Configured Banner Slides</h2>
            <button
              onClick={() => {
                const newSlide = {
                  id: `SLIDE-${Date.now()}`,
                  title: 'NEW PROMOTIONAL SLIDE',
                  subtitle: 'Limited Time RU BIKER world Offer',
                  description: 'Add your high-converting product description here.',
                  ctaText: 'Shop Collection',
                  ctaUrl: '/shop',
                  desktopImg: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
                  mobileImg: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
                  active: true,
                  badge: 'SPECIAL',
                  order: slides.length + 1
                };
                setSlides([...slides, newSlide]);
                setEditingSlide(newSlide);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Hero Slide
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col lg:flex-row gap-5 items-center justify-between"
              >
                {/* Slide Preview & Thumbnail */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveSlide(index, 'up')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={index === slides.length - 1}
                      onClick={() => handleMoveSlide(index, 'down')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="relative w-40 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 group">
                    <img src={slide.desktopImg} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <button
                      onClick={() => {
                        setActiveSlideIndex(index);
                        setIsMobileMediaPicker(false);
                        setMediaPickerOpen(true);
                      }}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold gap-1 transition-opacity"
                    >
                      <Upload className="w-3 h-3" /> Change PC Media
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                        {slide.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">#{index + 1}</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 line-clamp-1">{slide.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{slide.subtitle}</p>
                    <div className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                      CTA: "{slide.ctaText}" → {slide.ctaUrl}
                    </div>
                  </div>
                </div>

                {/* Actions & Controls */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <button
                    onClick={() => handleToggleSlide(slide.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      slide.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {slide.active ? 'Active on Live' : 'Draft / Hidden'}
                  </button>

                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Slide Content
                  </button>

                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HOMEPAGE SECTIONS */}
      {activeTab === 'sections' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900">Storefront Section Order & Visibility</h2>
            <p className="text-xs text-slate-500">Enable, disable, or adjust vertical flow of homepage sections.</p>
          </div>

          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900">{sec.name}</span>
                    <span className="text-[10px] text-slate-400 block">{sec.layout}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sec.active}
                      onChange={() => {
                        const updated = sections.map(s => s.id === sec.id ? { ...s, active: !s.active } : s);
                        setSections(updated);
                      }}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">{sec.active ? 'Visible' : 'Hidden'}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700">Device Viewport Simulation:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  previewMode === 'desktop' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop (1440px)
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  previewMode === 'mobile' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile (390px)
              </button>
            </div>
          </div>

          {/* Simulated Screen */}
          <div className="flex justify-center bg-slate-900 p-6 rounded-3xl overflow-hidden shadow-2xl">
            <div
              className={`bg-slate-950 rounded-2xl border border-slate-800 text-white overflow-hidden transition-all duration-300 ${
                previewMode === 'desktop' ? 'w-full max-w-4xl' : 'w-[390px]'
              }`}
            >
              {/* Simulated Hero */}
              {slides.filter(s => s.active)[0] && (
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={previewMode === 'mobile' ? slides.filter(s => s.active)[0].mobileImg : slides.filter(s => s.active)[0].desktopImg}
                    alt="Preview"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                    <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded w-fit mb-2">
                      {slides.filter(s => s.active)[0].badge}
                    </span>
                    <h2 className="text-xl font-black text-white">{slides.filter(s => s.active)[0].title}</h2>
                    <p className="text-xs text-slate-300 mt-1">{slides.filter(s => s.active)[0].subtitle}</p>
                    <button className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl w-fit">
                      {slides.filter(s => s.active)[0].ctaText}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Edit Slide Content</h3>
              <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Title</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingSlide.ctaText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target URL</label>
                  <input
                    type="text"
                    value={editingSlide.ctaUrl}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaUrl: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Media Pickers */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Desktop Slide Banner (1920x600px)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingSlide.desktopImg}
                    onChange={(e) => setEditingSlide({ ...editingSlide, desktopImg: e.target.value })}
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMediaPicker(false);
                      setMediaPickerOpen(true);
                    }}
                    className="px-3 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" /> Choose File
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSlides(slides.map(s => s.id === editingSlide.id ? editingSlide : s));
                    setEditingSlide(null);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local PC Upload & Visual Media Picker */}
      <AdminMediaModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectMedia={handleMediaSelect}
        title="Select Slide Banner from PC / Gallery"
      />
    </div>
  );
};

export default AdminHomepageSliders;
