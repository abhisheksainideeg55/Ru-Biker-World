import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiImage,
  FiVideo,
  FiPlay,
  FiBox,
  FiCheckCircle,
  FiExternalLink,
  FiUploadCloud,
  FiTruck,
  FiFileText,
  FiLayers
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import api from '../../services/api';
import { useNotifications } from '../../hooks/useNotifications';

const CATEGORY_MAP = {
  'Helmets & Gear': [
    'Full Face Helmets',
    'Flip Up Helmets',
    'Motocross Helmets',
    'Half Face Helmets',
    'Retro Helmets'
  ],
  'Spare Parts': [
    'Brake Pads & Rotors',
    'Drive Chains & Sprockets',
    'Clutch & Throttle Cables',
    'Spark Plugs & Ignition',
    'Engine & Oil Filters',
    'Suspension & Fork Seals'
  ],
  'Accessories & Touring': [
    'LED Auxiliary Fog Lights',
    'Mobile Mounts & USB Fast Chargers',
    'Crash Guards & Sliders',
    'Top Boxes, Panniers & Saddle Bags',
    'Windshields & Touring Visors',
    'Handlebar Grips & Levers'
  ],
  'Oils & Fluids': [
    'Fully Synthetic 4T Engine Oils',
    'Semi-Synthetic Oils',
    'Brake Fluids & Coolants',
    'Chain Cleaners & Lubes',
    'Fork & Shock Oils'
  ],
  'Performance & Exhaust': [
    'Slip-On & Full System Exhausts',
    'High-Flow Performance Air Filters',
    'ECU Remap & Quickshifters',
    'Iridium Performance Plugs'
  ],
  'Protection & Guards': [
    'Heavy-Duty Engine Bash Plates',
    'Radiator Aluminum Grilles',
    'Headlight Protectors',
    'Knuckle Guards & Barkbusters'
  ],
  'Lighting & Electrical': [
    'LED Headlight Bulbs',
    'Sequential Indicator Lights',
    'Horn & Wiring Harness Kits',
    'Hazard Flashers'
  ],
  'Luggage': [
    'Tail Bags',
    'Tank Bags',
    'Saddle Bags',
    'Backpacks & Riding Bags',
    'Leg Bags',
    'Tool Bags',
    'Waterproof Luggage & Dry Bags',
    'Luggage Covers',
    'Tank Bag Mounts',
    'Top Box Mounting Plates'
  ]
};

const PRESET_IMAGES = [
  { name: 'ECE 22.06 Full Face Helmet', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80' },
  { name: 'Ceramic Sintered Brake Pads', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80' },
  { name: 'X-Ring High-Tensile Chain Kit', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80' },
  { name: 'Heavy-Duty Engine Bash Plate', url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80' },
  { name: 'Synthetic 4T 10W-50 Engine Oil', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Performance Air Filter', url: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&auto=format&fit=crop&q=80' },
  { name: 'LED 60W Fog Light Pods', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80' },
];

const PRESET_VIDEOS = [
  { name: 'Exhaust Sound Dyno & Flyby Clip', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { name: 'Brake Pad Replacement & Installation Guide', url: 'https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-fast-on-a-highway-41130-large.mp4' },
];

const POPULAR_BRANDS = [
  'Simtac',
  'Philomax',
  'N gage',
  'Rolon',
  'Simi racing',
  'Hjg',
  'Silver stallion',
  'Vesrah',
  'Hitech',
  'Moto torque',
  'Motul',
  '66bhp',
  'Motocare',
  'Studds',
  'Vega',
  'Steelbird',
  'Axor',
  'Smk',
  'Grand pitstop',
  'Moto genius',
  'Auto bird'
];

const POPULAR_BIKE_BRANDS = [
  'KTM',
  'Royal Enfield',
  'Yamaha',
  'Kawasaki',
  'Bajaj',
  'TVS',
  'Honda',
  'BMW',
  'Piaggio',
  'Triumph',
  'Hero',
  'Universal'
];

export const AdminProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialBrand = searchParams.get('brand') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get('subcategory') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedBikeFilter, setSelectedBikeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'queue'

  useEffect(() => {
    const brandFromUrl = searchParams.get('brand');
    if (brandFromUrl) {
      setSelectedBrand(brandFromUrl);
    }
  }, [searchParams]);

  // Modal State (Add / Edit Product)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('images'); // 'images' | 'video'
  const [customBikeInput, setCustomBikeInput] = useState('');

  // Demo Video Preview Player Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // Gallery URL input
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Hidden file inputs for local computer / file explorer uploads
  const imageFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);

  const initialCat = Object.keys(CATEGORY_MAP)[0];
  const [formData, setFormData] = useState({
    name: '',
    category: initialCat,
    subcategory: CATEGORY_MAP[initialCat][0],
    price: '',
    originalPrice: '',
    cost: '',
    brand: 'RU BIKER world Genuine Parts',
    sku: '',
    image: '',
    images: [],
    video: '',
    videoTitle: '',
    available: true,
    trackStockDirectly: true,
    stockCount: 15,
    description: '',
    technicalSpecs: '',
    // Size and Weight-Wise Shipping Configuration
    shippingCharge: '99',
    weight: '1.2',
    dimensions: '30 x 20 x 15 cm',
    shippingTier: 'standard', // 'standard' | 'heavy' | 'free'
    isFreeShipping: false
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications() || {};

  const handleLocalImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target.result;
        setFormData((prev) => {
          const isPresetDefault = prev.images.length === 1 && PRESET_IMAGES.some((p) => p.url === prev.images[0]);
          const existingImages = isPresetDefault ? [] : prev.images;
          const updatedList = [...existingImages, resultUrl];
          return {
            ...prev,
            image: updatedList[0],
            images: updatedList,
          };
        });
        if (addToast) addToast({ type: 'success', message: `Added "${file.name}" from your computer!` });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleLocalVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultUrl = uploadEvent.target.result;
      setFormData((prev) => ({
        ...prev,
        video: resultUrl,
        videoTitle: file.name,
      }));
      if (addToast) addToast({ type: 'success', message: `Added video "${file.name}"!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducts({
        search,
        category: selectedCategory === 'all' ? '' : selectedCategory,
        limit: 50,
      });
      setProducts(data.products || []);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, selectedCategory]);

  const handleCategoryChangeInForm = (newCat) => {
    if (newCat === 'other') {
      setFormData({
        ...formData,
        category: '',
        subcategory: '',
      });
    } else {
      const defaultSub = CATEGORY_MAP[newCat]?.[0] || 'General';
      setFormData({
        ...formData,
        category: newCat,
        subcategory: defaultSub,
      });
    }
  };

  const handleToggleBikeBrand = (brandName) => {
    const current = Array.isArray(formData.bikeBrands) ? [...formData.bikeBrands] : [];
    if (current.includes(brandName)) {
      setFormData({
        ...formData,
        bikeBrands: current.filter((b) => b !== brandName),
      });
    } else {
      setFormData({
        ...formData,
        bikeBrands: [...current, brandName],
      });
    }
  };

  const handleAddCustomBike = () => {
    if (!customBikeInput.trim()) return;
    const trimmed = customBikeInput.trim();
    const current = Array.isArray(formData.bikeBrands) ? [...formData.bikeBrands] : [];
    if (!current.includes(trimmed)) {
      setFormData({
        ...formData,
        bikeBrands: [...current, trimmed],
      });
    }
    setCustomBikeInput('');
  };

  const handleRemoveBikeBrand = (brandName) => {
    const current = Array.isArray(formData.bikeBrands) ? [...formData.bikeBrands] : [];
    setFormData({
      ...formData,
      bikeBrands: current.filter((b) => b !== brandName),
    });
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setActiveMediaTab('images');
    setCustomBikeInput('');
    const firstCat = Object.keys(CATEGORY_MAP)[0];
    setFormData({
      name: '',
      category: firstCat,
      subcategory: CATEGORY_MAP[firstCat][0],
      price: '',
      originalPrice: '',
      cost: '',
      brand: 'RU BIKER world Genuine Parts',
      sku: `SP-${Date.now().toString().slice(-6)}`,
      image: '',
      images: [],
      video: '',
      videoTitle: '',
      available: true,
      trackStockDirectly: true,
      stockCount: 15,
      description: '',
      technicalSpecs: '',
      bikeBrands: ['Universal'],
      bikeModels: [],
      shippingCharge: '99',
      weight: '1.2',
      dimensions: '30 x 20 x 15 cm',
      shippingTier: 'standard',
      isFreeShipping: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setSelectedProduct(item);
    setActiveMediaTab('images');
    setCustomBikeInput('');
    const itemCat = item.category && CATEGORY_MAP[item.category] ? item.category : Object.keys(CATEGORY_MAP)[0];
    const itemSub = item.subcategory || CATEGORY_MAP[itemCat]?.[0] || 'General';

    setFormData({
      name: item.name || '',
      category: itemCat,
      subcategory: itemSub,
      price: item.price ?? '',
      originalPrice: item.originalPrice ?? '',
      cost: item.cost ?? (item.price ? Math.round(item.price * 0.45) : ''),
      brand: item.brand || 'RU BIKER world Genuine Parts',
      sku: item.sku || `SP-${item.id || item._id}`,
      image: item.image || item.images?.[0] || PRESET_IMAGES[0].url,
      images: item.images && item.images.length > 0 ? item.images : [item.image || PRESET_IMAGES[0].url],
      video: item.video || '',
      videoTitle: item.videoTitle || 'Product Demo Video',
      available: item.isActive !== false && item.stock !== false,
      trackStockDirectly: !!item.stockCount,
      stockCount: item.stockCount ?? 15,
      description: item.shortDescription || item.description || '',
      technicalSpecs: item.technicalSpecs || '',
      bikeBrands: Array.isArray(item.bikeBrands) && item.bikeBrands.length > 0 ? item.bikeBrands : ['Universal'],
      bikeModels: Array.isArray(item.bikeModels) ? item.bikeModels : [],
      shippingCharge: item.shippingCharge?.toString() || '99',
      weight: item.weight || '1.2',
      dimensions: item.dimensions || '30 x 20 x 15 cm',
      shippingTier: item.shippingTier || 'standard',
      isFreeShipping: item.isFreeShipping || false
    });
    setIsModalOpen(true);
  };

  const handleAddGalleryImage = (url) => {
    if (!url) return;
    if (!formData.images.includes(url)) {
      setFormData({
        ...formData,
        images: [...formData.images, url],
      });
      if (addToast) addToast({ type: 'info', message: 'Added image to gallery!' });
    }
    setCustomImageUrl('');
  };

  const handleRemoveGalleryImage = (urlToRemove) => {
    if (formData.images.length <= 1) {
      if (addToast) addToast({ type: 'warning', message: 'Product must have at least 1 image.' });
      return;
    }
    const updated = formData.images.filter((img) => img !== urlToRemove);
    setFormData({
      ...formData,
      images: updated,
      image: formData.image === urlToRemove ? updated[0] : formData.image,
    });
  };

  const handleToggleAvailability = async (product) => {
    const newStatus = !(product.isActive !== false && product.stock !== false);
    try {
      await adminService.updateProduct(product.id || product._id, {
        isActive: newStatus,
        stock: newStatus,
      });
      if (addToast) {
        addToast({
          type: 'success',
          message: `${product.name} marked as ${newStatus ? 'Available' : 'Unavailable'}.`,
        });
      }
      loadProducts();
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to toggle availability.' });
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await adminService.deleteProduct(product.id || product._id);
        if (addToast) addToast({ type: 'success', message: `${product.name} deleted successfully.` });
        loadProducts();
      } catch (e) {
        if (addToast) addToast({ type: 'error', message: 'Failed to delete product.' });
      }
    }
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      if (addToast) addToast({ type: 'error', message: 'Please enter product name and price.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        cost: formData.cost ? Number(formData.cost) : Number(formData.price) * 0.45,
        brand: formData.brand || 'RU BIKER world Genuine Parts',
        sku: formData.sku || `MZ-${(formData.category || 'PRT').substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        image: formData.image || formData.images[0] || '',
        images: formData.images,
        video: formData.video || undefined,
        videoTitle: formData.videoTitle || undefined,
        isActive: formData.available,
        stock: formData.available,
        stockCount: formData.trackStockDirectly ? Number(formData.stockCount || 10) : 50,
        description: formData.description,
        shortDescription: formData.description,
        technicalSpecs: formData.technicalSpecs,
        bikeBrands: formData.bikeBrands && formData.bikeBrands.length > 0 ? formData.bikeBrands : ['Universal'],
        bikeModels: formData.bikeModels || [],
        // Shipping Info
        shippingCharge: formData.isFreeShipping ? 0 : Number(formData.shippingCharge || 0),
        weight: formData.weight,
        dimensions: formData.dimensions,
        shippingTier: formData.shippingTier,
        isFreeShipping: formData.isFreeShipping
      };

      if (modalMode === 'create') {
        const created = await adminService.createProduct(payload);
        if (addToast) addToast({ type: 'success', message: `Added "${created.name || formData.name}" to MongoDB database!` });
      } else {
        const updated = await adminService.updateProduct(selectedProduct.id || selectedProduct._id, payload);
        if (addToast) addToast({ type: 'success', message: `Updated "${updated.name || formData.name}" successfully!` });
      }

      setIsModalOpen(false);
      await loadProducts();
    } catch (e) {
      console.error('Failed to save product:', e);
      if (addToast) addToast({ type: 'error', message: e.message || 'Failed to save product in database.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Products by Subcategory, Brand & Bike Fitment
  const filteredProducts = products.filter((p) => {
    if (selectedSubCategory !== 'all') {
      if (p.subcategory?.toLowerCase() !== selectedSubCategory.toLowerCase()) return false;
    }
    if (selectedBrand !== 'all') {
      const targetBrand = selectedBrand.toLowerCase().replace(/[-_+]+/g, ' ').trim();
      const productBrand = (p.brand || '').toLowerCase().replace(/[-_+]+/g, ' ').trim();
      if (productBrand !== targetBrand && !productBrand.includes(targetBrand) && !targetBrand.includes(productBrand)) return false;
    }
    if (selectedBikeFilter !== 'all') {
      const pBikes = Array.isArray(p.bikeBrands) && p.bikeBrands.length > 0 
        ? p.bikeBrands.map(b => b.toLowerCase()) 
        : ['universal'];
      const target = selectedBikeFilter.toLowerCase();
      if (!pBikes.includes(target) && !pBikes.includes('universal')) return false;
    }
    return true;
  });

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    if (brandName === 'all') {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('brand');
        return next;
      });
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('brand', brandName);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-6 max-w-7xl mx-auto">
      {/* ===================== PAGE HEADER ===================== */}
      <div>
        <div className="flex items-center gap-2">
          <FiBox className="w-5 h-5 text-slate-700" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Products & Accessories Catalog
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
          Manage bike parts, helmets, touring accessories, descriptions, image uploads & demo videos
        </p>
      </div>

      {/* ===================== TABS & ADD PRODUCT BUTTON ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Catalog & Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'queue'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Dispatch & Packaging Queue
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 cursor-pointer"
          >
            <FiPlus className="w-4 h-4 text-amber-400" />
            <span>Add Product / Part</span>
          </button>
        </div>
      </div>

      {/* ===================== CATALOG EDITOR TAB ===================== */}
      {activeTab === 'editor' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/40">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by part name, SKU, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Bike Compatibility Filter */}
              <select
                value={selectedBikeFilter}
                onChange={(e) => setSelectedBikeFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-800"
              >
                <option value="all">🏍️ All Bike Fits</option>
                {POPULAR_BIKE_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    Fit: {b}
                  </option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandSelect(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-800"
              >
                <option value="all">All Brands</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory('all');
                }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-800"
              >
                <option value="all">All Categories</option>
                {Object.keys(CATEGORY_MAP).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Subcategory Filter */}
              {selectedCategory !== 'all' && CATEGORY_MAP[selectedCategory] && (
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-800"
                >
                  <option value="all">All Subcategories</option>
                  {CATEGORY_MAP[selectedCategory].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Active Brand Filter Banner */}
          {selectedBrand !== 'all' && (
            <div className="px-6 py-2.5 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-950">
                  🏷️ Filtered by Brand: <span className="underline decoration-amber-500 font-extrabold">{selectedBrand}</span>
                </span>
                <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  {filteredProducts.length} Products Found
                </span>
              </div>
              <button
                onClick={() => handleBrandSelect('all')}
                className="font-bold text-amber-900 hover:text-amber-950 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Clear Brand Filter (Show All)</span>
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Product Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Image & Media</th>
                  <th className="py-3.5 px-6">Product / Part</th>
                  <th className="py-3.5 px-6">Category & Subcategory</th>
                  <th className="py-3.5 px-6">Price (₹)</th>
                  <th className="py-3.5 px-6">Shipping & Weight</th>
                  <th className="py-3.5 px-6">Available</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => {
                    const isAvailable = item.isActive !== false && item.stock !== false;
                    const itemCost = item.cost || (item.price ? Math.round(item.price * 0.45) : 800);
                    const hasVideo = !!item.video;
                    const galleryCount = item.images?.length || 1;

                    return (
                      <tr key={item.id || item._id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Image & Video Badge */}
                        <td className="py-3.5 px-6">
                          <div className="relative inline-block">
                            <img
                              src={item.image || item.images?.[0] || PRESET_IMAGES[0].url}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                            />
                            {galleryCount > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-md shadow-xs">
                                +{galleryCount - 1}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Item Name & Demo Video Pill */}
                        <td className="py-3.5 px-6">
                          <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleBrandSelect(item.brand || 'RU BIKER world')}
                              className="text-[10px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200/60 cursor-pointer transition-colors"
                              title={`Click to filter catalog by ${item.brand || 'brand'}`}
                            >
                              🏷️ Brand: {item.brand || 'RU BIKER world'}
                            </button>
                            <span className="text-slate-400 text-xs font-mono">
                              {item.sku || 'SKU-00' + (item.id || '101')}
                            </span>
                            {hasVideo && (
                              <button
                                onClick={() => setPreviewVideoUrl(item.video)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full hover:bg-amber-100 transition-colors"
                              >
                                <FiPlay className="w-2.5 h-2.5 fill-current" />
                                <span>Demo Video</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Category & Subcategory */}
                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-slate-800 text-xs">
                            {item.category || 'Spare Parts'}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.subcategory || 'General Components'}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-6 font-bold text-slate-900 text-sm">
                          ₹{item.price}
                          {item.originalPrice && (
                            <span className="ml-2 text-xs text-slate-400 line-through font-normal">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </td>

                        {/* Shipping Charge & Weight */}
                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <FiTruck className="w-3.5 h-3.5 text-blue-500" />
                            <span>{item.isFreeShipping || item.shippingCharge === 0 ? 'Free Delivery' : `+₹${item.shippingCharge || 99} Fee`}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.weight || '1.2 kg'} • {item.dimensions || 'Standard'}
                          </div>
                        </td>

                        {/* Available Toggle Switch */}
                        <td className="py-3.5 px-6">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(item)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                              isAvailable ? 'bg-slate-900' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                isAvailable ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit product"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete product"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                      No motorcycle products found matching "{search}". Click "+ Add Product / Part" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== DISPATCH QUEUE TAB ===================== */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.slice(0, 6).map((item, idx) => (
            <div
              key={item.id || item._id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono font-bold text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    DISPATCH #{1040 + idx}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Delhivery Express</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={item.image || item.images?.[0] || PRESET_IMAGES[0].url}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">
                      Category: <span className="font-medium text-slate-700">{item.category}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Shipping: <span className="font-semibold text-slate-700">{item.isFreeShipping ? 'Free' : `₹${item.shippingCharge || 99}`} ({item.weight || '1.2kg'})</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  QC Checked
                </span>
                <button
                  onClick={() => addToast && addToast({ type: 'success', message: `${item.name} manifested for courier pickup!` })}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Generate Shipping Label
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== ADD / EDIT PRODUCT MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {modalMode === 'create' ? 'Add Part / Helmet / Accessory' : 'Edit Product'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in product details, description, local photo/video uploads, and size/weight-based shipping rates.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitModal} className="mt-5 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Product / Part Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. MT Thunder 4 SV Helmet / Ceramic Sintered Brake Pads"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <FiFileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Product Description & Features</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the material, aerodynamics, bike fitment, warranty, and key rider benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              {/* Technical Specifications / Fitment */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <FiLayers className="w-3.5 h-3.5 text-blue-500" />
                  <span>Technical Specifications (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% Rust-Proof Aircraft Aluminium Alloy, IP67 Waterproof, Anti-Theft Lock"
                  value={formData.technicalSpecs}
                  onChange={(e) => setFormData({ ...formData, technicalSpecs: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Brand, Category & Subcategory Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Brand Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Brand / Make</span>
                    <span className="text-[10px] text-amber-600 font-bold">Preset or Custom</span>
                  </label>
                  <div className="space-y-1.5">
                    <select
                      value={POPULAR_BRANDS.includes(formData.brand) ? formData.brand : 'other'}
                      onChange={(e) => {
                        if (e.target.value === 'other') {
                          setFormData({ ...formData, brand: '' });
                        } else {
                          setFormData({ ...formData, brand: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                    >
                      <option value="RU BIKER world Genuine Parts">RU BIKER world Genuine Parts</option>
                      {POPULAR_BRANDS.filter(b => b !== 'RU BIKER world Genuine Parts').map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                      <option value="other">+ Type Custom Brand...</option>
                    </select>

                    {(!POPULAR_BRANDS.includes(formData.brand) || formData.brand === '') && (
                      <input
                        type="text"
                        placeholder="Enter Brand Name..."
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-3 py-1.5 bg-amber-50/60 border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                        required
                      />
                    )}
                  </div>
                </div>

                {/* Category Selection / Custom Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Category</span>
                    <span className="text-[10px] text-amber-600 font-bold">Preset or Custom</span>
                  </label>
                  <div className="space-y-1.5">
                    <select
                      value={Object.keys(CATEGORY_MAP).includes(formData.category) ? formData.category : 'other'}
                      onChange={(e) => handleCategoryChangeInForm(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                    >
                      {Object.keys(CATEGORY_MAP).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="other">+ Type Custom Category...</option>
                    </select>

                    {(!Object.keys(CATEGORY_MAP).includes(formData.category) || formData.category === '') && (
                      <input
                        type="text"
                        placeholder="Enter Category Name..."
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-1.5 bg-amber-50/60 border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                        required
                      />
                    )}
                  </div>
                </div>

                {/* Subcategory Selection / Custom Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Sub-Category</span>
                    <span className="text-[10px] text-amber-600 font-bold">Preset or Custom</span>
                  </label>
                  <div className="space-y-1.5">
                    <select
                      value={(CATEGORY_MAP[formData.category] || []).includes(formData.subcategory) ? formData.subcategory : 'other'}
                      onChange={(e) => {
                        if (e.target.value === 'other') {
                          setFormData({ ...formData, subcategory: '' });
                        } else {
                          setFormData({ ...formData, subcategory: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                    >
                      {(CATEGORY_MAP[formData.category] || []).map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      <option value="other">+ Type Custom Subcategory...</option>
                    </select>

                    {(!(CATEGORY_MAP[formData.category] || []).includes(formData.subcategory) || formData.subcategory === '') && (
                      <input
                        type="text"
                        placeholder="Enter Sub-Category Name..."
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-3 py-1.5 bg-amber-50/60 border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                        required
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Price, Original Price, Cost Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 4200"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="Compare Price"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 2400"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* ===================== SIZE & WEIGHT-WISE SHIPPING SECTION ===================== */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <div className="flex items-center gap-2">
                    <FiTruck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Custom Shipping Rates (Size & Weight Wise)</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFreeShipping}
                      onChange={(e) => setFormData({ ...formData, isFreeShipping: e.target.checked })}
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-blue-950">Free Shipping on this Item</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Shipping Fee (₹)
                    </label>
                    <input
                      type="number"
                      disabled={formData.isFreeShipping}
                      placeholder={formData.isFreeShipping ? 'Free (₹0)' : 'e.g. 99'}
                      value={formData.isFreeShipping ? 0 : formData.shippingCharge}
                      onChange={(e) => setFormData({ ...formData, shippingCharge: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Item Weight (kg)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1.8 kg"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Dimensions (L x W x H cm)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 35 x 25 x 20 cm"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Parcel Package Size Tier
                  </label>
                  <select
                    value={formData.shippingTier}
                    onChange={(e) => setFormData({ ...formData, shippingTier: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="standard">Standard Parcel (Under 2kg — Cables, Brake Pads, Grips, Plugs)</option>
                    <option value="medium">Medium Gear (2kg to 5kg — Helmets, Riding Jackets, Fog Lights)</option>
                    <option value="heavy">Heavy & Bulky Freight (5kg+ — Crash Guards, Exhaust Systems, Top Boxes)</option>
                  </select>
                </div>
              </div>

              {/* ===================== MEDIA TABS: IMAGE GALLERY & DEMO VIDEO ===================== */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('images')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeMediaTab === 'images'
                          ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <FiImage className="w-3.5 h-3.5" />
                      <span>Image Gallery ({formData.images.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeMediaTab === 'video'
                          ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <FiVideo className="w-3.5 h-3.5" />
                      <span>Product Demo Video</span>
                      {formData.video && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Native Accessible File Inputs */}
                {/* File Inputs for PC / Windows File Explorer */}
                <input
                  id="admin-product-file-input"
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleLocalImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <input
                  id="admin-product-video-input"
                  type="file"
                  ref={videoFileInputRef}
                  onChange={handleLocalVideoUpload}
                  accept="video/*"
                  className="hidden"
                />

                {/* 1. IMAGE GALLERY TAB */}
                {activeMediaTab === 'images' && (
                  <div
                    className="space-y-3"
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleLocalImageUpload({ target: { files: e.dataTransfer.files, value: '' } });
                      }
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Click an image to set as Primary Cover.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => imageFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <FiUploadCloud className="w-4 h-4" />
                          <span>Upload from Computer</span>
                        </button>
                      </div>
                    </div>

                    {/* Gallery Preview Thumbnails */}
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {formData.images.map((imgUrl, index) => (
                        <div
                          key={index}
                          className={`relative group rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                            formData.image === imgUrl ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${index}`}
                            className="w-16 h-16 object-cover cursor-pointer"
                            onClick={() => setFormData({ ...formData, image: imgUrl })}
                          />
                          {formData.image === imgUrl && (
                            <span className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-black px-1 rounded">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(imgUrl)}
                            className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove image"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Direct Upload Card from PC */}
                      <button
                        type="button"
                        onClick={() => imageFileInputRef.current?.click()}
                        className="w-16 h-16 rounded-xl border-2 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/70 hover:bg-blue-100 flex flex-col items-center justify-center text-blue-600 transition-all flex-shrink-0 cursor-pointer"
                        title="Choose photo from your computer (File Explorer)"
                      >
                        <FiUploadCloud className="w-5 h-5" />
                        <span className="text-[9px] font-bold mt-0.5">From PC</span>
                      </button>
                    </div>

                    {/* Add from Preset or URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Quick Preset Bike Images
                        </label>
                        <select
                          onChange={(e) => {
                            if (e.target.value) handleAddGalleryImage(e.target.value);
                          }}
                          value=""
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700"
                        >
                          <option value="">+ Add Preset Bike Asset...</option>
                          {PRESET_IMAGES.map((p) => (
                            <option key={p.name} value={p.url}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Or Add Direct Image URL
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="url"
                            placeholder="https://images.unsplash..."
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddGalleryImage(customImageUrl.trim())}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DEMO VIDEO TAB */}
                {activeMediaTab === 'video' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-slate-800">
                        Product Demo Video (.mp4, local file or URL)
                      </label>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="admin-product-video-input"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer select-none"
                        >
                          <FiUploadCloud className="w-3.5 h-3.5" />
                          <span>Upload Video from PC</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="e.g. https://assets.mixkit.co/videos/...mp4 or uploaded video"
                        value={formData.video.startsWith('data:') ? `[Local Video File: ${formData.videoTitle || 'Uploaded clip'}]` : formData.video}
                        onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    {/* Preset Demo Videos */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Or Choose from Tested Demo Video Presets
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PRESET_VIDEOS.map((vid) => (
                          <button
                            key={vid.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, video: vid.url, videoTitle: vid.name })}
                            className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                              formData.video === vid.url
                                ? 'bg-amber-50 border-amber-400 text-amber-900'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <FiPlay className="w-3.5 h-3.5 text-amber-600" />
                              <span className="truncate">{vid.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Video Preview Box */}
                    {formData.video ? (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                            <FiPlay className="w-3 h-3 text-emerald-600" />
                            <span>Live Video Preview ({formData.videoTitle || 'Product Video'})</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, video: '', videoTitle: '' })}
                            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          >
                            Remove Video ✕
                          </button>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video max-h-48 flex items-center justify-center">
                          <video
                            src={formData.video}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
                        <span className="text-xs text-slate-400 font-medium">No video attached (Optional)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Toggles: Available & Stock Tracking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800">Available for Sale</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, available: !formData.available })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      formData.available ? 'bg-slate-900' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        formData.available ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800">
                    Stock: {formData.stockCount} units
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-20 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 text-center"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
                    submitting || uploadingImage
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 active:scale-95'
                  }`}
                >
                  {submitting
                    ? 'Saving to Database...'
                    : modalMode === 'create'
                    ? 'Save Product to Catalog'
                    : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== DEMO VIDEO PLAYBACK MODAL ===================== */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FiPlay className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">Product Demo Video</h3>
              </div>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <FiX className="w-5 h-5" />
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

export default AdminProducts;
