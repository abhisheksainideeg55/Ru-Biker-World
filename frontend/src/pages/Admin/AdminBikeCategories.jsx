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
  Compass
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { adminService } from '../../services/adminService';

const INITIAL_BIKE_CATEGORIES = [
  {
    id: 'ktm',
    name: 'KTM',
    image: '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png',
    link: '/shop?bike=KTM',
    tagline: 'Ready To Race - Duke, RC & Adventure Series',
    models: ['Duke 390', 'RC 390', 'Adventure 390', 'Duke 250', 'RC 200', 'Duke 125'],
    status: 'active',
    order: 1
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki',
    image: '/41_3303eb26-c8b4-4f28-80af-753dfca85a66.png',
    link: '/shop?bike=Kawasaki',
    tagline: 'Let the good times roll - Ninja & Z Series',
    models: ['Ninja 300', 'Ninja 400', 'Ninja ZX-10R', 'Z900', 'Z650', 'Versys 650'],
    status: 'active',
    order: 2
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    image: '/40_9eb1ac3b-42b4-4636-85f3-47fe41b864cb.png',
    link: '/shop?bike=Royal+Enfield',
    tagline: 'Made Like a Gun - Classic, Hunter & Himalayan',
    models: ['Classic 350', 'Hunter 350', 'Himalayan 450', 'Continental GT 650', 'Interceptor 650', 'Meteor 350'],
    status: 'active',
    order: 3
  },
  {
    id: 'piaggio',
    name: 'Piaggio / Aprilia',
    image: '/46_a855f9a1-863b-4af5-8d25-4769f3964693.png',
    link: '/shop?bike=Piaggio',
    tagline: 'Italian Racing Heritage & Superbikes',
    models: ['Aprilia RS 457', 'RSV4', 'Tuono 660', 'SR 160', 'SXR 160'],
    status: 'active',
    order: 4
  },
  {
    id: 'tvs',
    name: 'TVS',
    image: '/42_548fc399-90eb-4dbf-97c5-dbd96170ef9a.png',
    link: '/shop?bike=TVS',
    tagline: 'Racing DNA Unleashed - Apache RTR & RR Series',
    models: ['Apache RR 310', 'RTR 310', 'RTR 200 4V', 'RTR 160 4V', 'Ronin 225'],
    status: 'active',
    order: 5
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    image: '/44_c89a90aa-dba3-4180-9912-44b6249eaab2.png',
    link: '/shop?bike=Bajaj',
    tagline: 'Definitely Daring - Pulsar & Dominar Series',
    models: ['Dominar 400', 'Dominar 250', 'Pulsar NS400Z', 'Pulsar RS200', 'Pulsar NS200', 'Pulsar N250'],
    status: 'active',
    order: 6
  },
  {
    id: 'bmw',
    name: 'BMW Motorrad',
    image: '/45_2494c0d0-08c9-481f-8925-29c0f5622870.png',
    link: '/shop?bike=BMW',
    tagline: 'Make Life A Ride - GS & RR Series',
    models: ['G 310 R', 'G 310 GS', 'S 1000 RR', 'R 1250 GS', 'F 900 XR'],
    status: 'active',
    order: 7
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    image: '/43.png',
    link: '/shop?bike=Yamaha',
    tagline: 'Revs Your Heart - R15, MT & Aerox Series',
    models: ['YZF-R15 V4', 'MT-15 V2', 'YZF-R3', 'Aerox 155', 'FZS-FI V4'],
    status: 'active',
    order: 8
  },
  {
    id: 'benelli',
    name: 'Benelli',
    image: '/46_37a22301-0a85-4702-85ca-406e7d710551.png',
    link: '/shop?bike=Benelli',
    tagline: 'Pure Passion Since 1911 - TRK & Leoncino',
    models: ['TRK 502X', 'TRK 251', 'Leoncino 500', 'Imperiale 400', '502C Cruiser'],
    status: 'active',
    order: 9
  },
  {
    id: 'hero',
    name: 'Hero MotoCorp',
    image: '/45_da6d2be1-c572-4d1d-9c8f-dd3249235017.png',
    link: '/shop?bike=Hero',
    tagline: 'Engineered For Adventure - XPulse & Karizma',
    models: ['XPulse 200 4V', 'XPulse 200T', 'Karizma XMR 210', 'Mavrick 440', 'Xtreme 160R 4V'],
    status: 'active',
    order: 10
  },
  {
    id: 'honda',
    name: 'Honda BigWing',
    image: '/44_3f3c44f7-fbf3-4bdb-845b-d6ae87fcfda1.png',
    link: '/shop?bike=Honda',
    tagline: 'The Power of Dreams - H’ness, CB300 & Transalp',
    models: ['H’ness CB350', 'CB350RS', 'CB300R', 'CB300F', 'NX500', 'XL750 Transalp'],
    status: 'active',
    order: 11
  },
  {
    id: 'triumph',
    name: 'Triumph',
    image: '/43_ca013c29-0048-4326-81f9-1b6667238d4f.png',
    link: '/shop?bike=Triumph',
    tagline: 'For The Ride - Speed 400, Scrambler & Tiger',
    models: ['Speed 400', 'Scrambler 400 X', 'Trident 660', 'Tiger 900', 'Street Triple 765'],
    status: 'active',
    order: 12
  }
];

export const AdminBikeCategories = () => {
  const { addToast } = useNotifications() || {};
  const [bikeCategories, setBikeCategories] = useState(INITIAL_BIKE_CATEGORIES);

  // Load bike categories directly from database on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBikes = async () => {
      try {
        const dbBikes = await adminService.getBikes();
        if (isMounted && Array.isArray(dbBikes) && dbBikes.length > 0) {
          setBikeCategories(dbBikes);
        }
      } catch (err) {
        console.warn('[AdminBikeCategories] Fetch error:', err.message);
      }
    };
    fetchBikes();
    return () => { isMounted = false; };
  }, []);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedBike, setSelectedBike] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    tagline: '',
    modelsInput: '',
    link: '',
    status: 'active',
    order: 1
  });

  const saveBikes = async (updated) => {
    setBikeCategories(updated);
    try {
      await adminService.saveBikes(updated);
      window.dispatchEvent(new Event('sparify_bike_categories_updated'));
    } catch (e) {
      console.warn('Failed to save bike categories to database:', e.message);
    }
  };

  const filteredBikes = bikeCategories.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.tagline && b.tagline.toLowerCase().includes(search.toLowerCase())) ||
    (b.models && b.models.some((m) => m.toLowerCase().includes(search.toLowerCase())))
  );

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedBike(null);
    setFormData({
      name: '',
      image: '',
      tagline: '',
      modelsInput: '',
      link: '',
      status: 'active',
      order: bikeCategories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bike) => {
    setModalMode('edit');
    setSelectedBike(bike);
    setFormData({
      name: bike.name,
      image: bike.image || '',
      tagline: bike.tagline || '',
      modelsInput: (bike.models || []).join(', '),
      link: bike.link || `/shop?bike=${encodeURIComponent(bike.name)}`,
      status: bike.status || 'active',
      order: bike.order || 1
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
      if (addToast) addToast({ type: 'success', message: `Image "${file.name}" loaded!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Bike Brand / Name is required.' });
      return;
    }

    const models = formData.modelsInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const generatedLink = formData.link.trim() || `/shop?bike=${encodeURIComponent(formData.name.trim())}`;
    const idSlug = formData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (modalMode === 'create') {
      const newBike = {
        id: idSlug || `bike-${Date.now()}`,
        name: formData.name.trim(),
        image: formData.image.trim() || '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png',
        link: generatedLink,
        tagline: formData.tagline.trim(),
        models: models.length ? models : [formData.name.trim()],
        status: formData.status,
        order: Number(formData.order) || bikeCategories.length + 1
      };

      const updated = [...bikeCategories, newBike];
      saveBikes(updated);
      if (addToast) addToast({ type: 'success', message: `Bike Category "${newBike.name}" added successfully!` });
    } else {
      const updated = bikeCategories.map((b) =>
        b.id === selectedBike.id
          ? {
              ...b,
              name: formData.name.trim(),
              image: formData.image.trim() || b.image,
              link: generatedLink,
              tagline: formData.tagline.trim(),
              models: models.length ? models : b.models,
              status: formData.status,
              order: Number(formData.order)
            }
          : b
      );
      saveBikes(updated);
      if (addToast) addToast({ type: 'success', message: `Bike Category "${formData.name}" updated!` });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (bike) => {
    if (window.confirm(`Are you sure you want to delete Bike Category "${bike.name}"?`)) {
      const updated = bikeCategories.filter((b) => b.id !== bike.id);
      saveBikes(updated);
      if (addToast) addToast({ type: 'info', message: `Bike Category "${bike.name}" removed.` });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-6 max-w-7xl mx-auto">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏍️</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Bike Categories (Shop By Bike)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage motorcycle brands, series, uploaded bike photos, and storefront fitment filters
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>+ Add Bike Category</span>
        </button>
      </div>

      {/* ===================== SEARCH & STATS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bike brands (KTM, Yamaha, Royal Enfield, models...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-3">
          <span>
            Total Brands: <strong className="text-slate-900">{bikeCategories.length}</strong> (
            {bikeCategories.filter((b) => b.status === 'active').length} Active on Storefront)
          </span>
        </div>
      </div>

      {/* ===================== BIKE CATEGORIES GRID ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredBikes.map((bike) => (
          <div
            key={bike.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Bike Image Box with Light Theme Background */}
              <div className="relative h-44 bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png';
                  }}
                />
                <span
                  className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    bike.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {bike.status}
                </span>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{bike.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400">Order #{bike.order || 1}</span>
                </div>

                {bike.tagline && (
                  <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">{bike.tagline}</p>
                )}

                {/* Models list */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>Models ({bike.models?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(bike.models || []).slice(0, 4).map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                      >
                        {m}
                      </span>
                    ))}
                    {(bike.models || []).length > 4 && (
                      <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                        +{(bike.models || []).length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions & Storefront Link */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <a
                href={bike.link || `/shop?bike=${encodeURIComponent(bike.name)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                <span>Filter Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(bike)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Edit Bike Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(bike)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Bike Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== ADD / EDIT BIKE CATEGORY MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏍️</span>
                <h3 className="font-bold text-lg text-slate-900">
                  {modalMode === 'create' ? 'Add Bike Category' : 'Edit Bike Category'}
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
              {/* Bike Brand Name & Order */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Bike Brand / Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KTM, Kawasaki, Royal Enfield, BMW"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        name: val,
                        link: formData.link ? formData.link : `/shop?bike=${encodeURIComponent(val)}`
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

              {/* Bike Image Upload & URL input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bike Image (Upload or URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">PNG / JPG with clean background</span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Live Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Bike Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png';
                        }}
                      />
                    ) : (
                      <span className="text-xl">🏍️</span>
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
                      <span>Upload Bike Photo from Computer</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /40_9eb1ac3b.png or https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Tagline / Series Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ready To Race - Duke, RC & Adventure Series"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Sub-models / Series Models */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Sub-Models / Compatible Bikes (Comma-separated)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Duke 390, RC 390, Adventure 390, Duke 250, RC 200"
                  value={formData.modelsInput}
                  onChange={(e) => setFormData({ ...formData, modelsInput: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Target Storefront Filter Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Storefront Filter Link (Auto-mapped to /shop?bike=...)
                </label>
                <input
                  type="text"
                  placeholder="/shop?bike=KTM"
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
                  <option value="active">Active (Visible on Homepage & Filters)</option>
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
                  {modalMode === 'create' ? 'Save & Add Bike Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBikeCategories;
