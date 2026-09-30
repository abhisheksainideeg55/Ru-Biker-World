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
  Sparkles
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { adminService } from '../../services/adminService';

const INITIAL_LOOKING_FOR_CARDS = [
  {
    id: 'performance',
    title: 'Performance & Exhaust',
    image: '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png',
    link: '/shop?category=Performance & Exhaust',
    status: 'active',
    order: 1
  },
  {
    id: 'brake',
    title: 'Spare Parts',
    image: '/5cb292a1b3224122055f89357a2ea599_breaksystem.png',
    link: '/shop?category=Spare Parts',
    status: 'active',
    order: 2
  },
  {
    id: 'helmets',
    title: 'Helmets',
    image: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    link: '/shop?category=riding-gear&subcategory=helmets',
    status: 'active',
    order: 3
  },
  {
    id: 'luggage',
    title: 'Luggage',
    image: '/554a968be41a8f6aaad2b41607c4d3be_luggage.png',
    link: '/shop?category=Luggage',
    status: 'active',
    order: 4
  },
  {
    id: 'lights',
    title: 'Lights & electronics',
    image: '/f5a4303af87ab6336039e0b0c753d893_lightselectronics.png',
    link: '/shop?category=Lighting & Electrical',
    status: 'active',
    order: 5
  },
  {
    id: 'protection',
    title: 'Rider Protection',
    image: '/0855fcf33a4f7aa9ca24ebca8b68bd97_riderprotection.png',
    link: '/shop?category=Protection & Guards',
    status: 'active',
    order: 6
  },
];

export const AdminLookingFor = () => {
  const { addToast } = useNotifications() || {};
  const [cards, setCards] = useState(INITIAL_LOOKING_FOR_CARDS);

  // Load from database on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCards = async () => {
      try {
        const dbData = await adminService.getLookingFor();
        if (isMounted && Array.isArray(dbData) && dbData.length > 0) {
          setCards(dbData);
        }
      } catch (err) {
        console.warn('[AdminLookingFor] DB fetch error:', err.message);
      }
    };
    fetchCards();
    return () => { isMounted = false; };
  }, []);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedCard, setSelectedCard] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    status: 'active',
    order: 1
  });

  const saveCards = async (updated) => {
    setCards(updated);
    try {
      await adminService.saveLookingFor(updated);
      window.dispatchEvent(new Event('sparify_looking_for_updated'));
    } catch (e) {
      console.warn('Failed to save looking for today cards to database:', e.message);
    }
  };

  const filteredCards = cards.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.link && c.link.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCard(null);
    setFormData({
      title: '',
      image: '',
      link: '/shop?category=',
      status: 'active',
      order: cards.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setModalMode('edit');
    setSelectedCard(card);
    setFormData({
      title: card.title,
      image: card.image || '',
      link: card.link || `/shop?category=${encodeURIComponent(card.title)}`,
      status: card.status || 'active',
      order: card.order || 1
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
      if (addToast) addToast({ type: 'success', message: `Photo "${file.name}" loaded!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Card Title is required.' });
      return;
    }

    const generatedLink = formData.link.trim() || `/shop?category=${encodeURIComponent(formData.title.trim())}`;
    const idSlug = formData.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (modalMode === 'create') {
      const newCard = {
        id: idSlug || `look-${Date.now()}`,
        title: formData.title.trim(),
        image: formData.image.trim() || '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png',
        link: generatedLink,
        status: formData.status,
        order: Number(formData.order) || cards.length + 1
      };

      const updated = [...cards, newCard];
      saveCards(updated);
      if (addToast) addToast({ type: 'success', message: `Card "${newCard.title}" created!` });
    } else {
      const updated = cards.map((c) =>
        c.id === selectedCard.id
          ? {
              ...c,
              title: formData.title.trim(),
              image: formData.image.trim() || c.image,
              link: generatedLink,
              status: formData.status,
              order: Number(formData.order)
            }
          : c
      );
      saveCards(updated);
      if (addToast) addToast({ type: 'success', message: `Card "${formData.title}" updated!` });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (card) => {
    if (window.confirm(`Are you sure you want to delete "${card.title}" card?`)) {
      const updated = cards.filter((c) => c.id !== card.id);
      saveCards(updated);
      if (addToast) addToast({ type: 'info', message: `Card "${card.title}" removed.` });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-6 max-w-7xl mx-auto">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              What Are You Looking For Today? (Section Cards)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage top visual category tiles on Homepage, photo cards, custom titles, and click destinations
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>+ Add Looking For Card</span>
        </button>
      </div>

      {/* ===================== SEARCH & STATS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cards (Performance parts, Brake System, Helmets...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-3">
          <span>
            Total Cards: <strong className="text-slate-900">{cards.length}</strong> (
            {cards.filter((c) => c.status === 'active').length} Active on Homepage)
          </span>
        </div>
      </div>

      {/* ===================== CARDS GRID ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-slate-900 rounded-2xl border border-slate-200 hover:border-slate-400 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Card Image Box (Same layout as Homepage) */}
              <div className="relative h-44 bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <span
                  className={`absolute top-2.5 right-2.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    card.status === 'active'
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {card.status}
                </span>

                <div className="absolute bottom-2.5 inset-x-2 text-center">
                  <span className="text-xs font-bold text-white tracking-wide drop-shadow-md">
                    {card.title}
                  </span>
                </div>
              </div>

              {/* Sub-info */}
              <div className="p-3 bg-slate-950 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Order #{card.order || 1}</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 line-clamp-1">{card.link}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-2.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
              <a
                href={card.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(card)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Card"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(card)}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== ADD / EDIT CARD MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-900">
                  {modalMode === 'create' ? 'Add "What Are You Looking For" Card' : 'Edit Card'}
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
              {/* Card Title & Order */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Card Title / Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Performance parts, Brake System, Helmets"
                    value={formData.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        title: val,
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
                    <span>Card Photo (Upload from PC or URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Dark / Product Image</span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Live Thumbnail Preview */}
                  <div className="w-16 h-20 rounded-xl bg-black border border-slate-300 flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-2xs">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png';
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
                      <span>Upload Card Photo from Computer</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /4da6feee...png or https://...)"
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
                  placeholder="/shop?category=performance"
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
                  <option value="active">Active (Visible on Homepage)</option>
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
                  {modalMode === 'create' ? 'Save & Add Card' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLookingFor;
