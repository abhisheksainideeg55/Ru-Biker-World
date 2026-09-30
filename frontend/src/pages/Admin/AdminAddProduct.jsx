import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiSave,
  FiBox,
  FiPlus,
  FiX,
  FiImage,
  FiVideo,
  FiPlay,
  FiUploadCloud,
  FiTruck,
  FiFileText,
  FiLayers
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import { useNotifications } from '../../hooks/useNotifications';

const CATEGORY_MAP = {
  'Helmets & Gear': [
    'Full Face Helmets',
    'Flip Up Helmets',
    'Motocross Helmets',
    'Half Face Helmets',
    'Retro Helmets'
  ],
  'Protection & Guards': [
    'Crash Guards',
    'Engine Guards',
    'Engine Bash Plates',
    'Heavy-Duty Engine Bash Plates',
    'Sump Guards',
    'Engine Protection Covers',
    'Frame Sliders',
    'Axle Sliders',
    'Fork Protectors',
    'Swingarm Protectors',
    'Radiator Guards',
    'Radiator Aluminum Grilles',
    'Headlight Protectors',
    'Tail Light Protectors',
    'Indicator Protectors',
    'Hand Guards & Barkbusters',
    'Knuckle Guards & Barkbusters',
    'Lever Guards',
    'Brake Disc Guards',
    'Caliper Guards',
    'Chain Guards',
    'Sprocket Guards',
    'Exhaust Guards',
    'Heat Shields',
    'Tank Protectors',
    'Tank Grip Pads',
    'Fuel Tank Side Protectors',
    'Engine Side Covers',
    'Clutch Cover Guards',
    'Alternator Cover Guards',
    'Oil Cooler Guards',
    'Oil Filter Guards',
    'Mudguards & Fender Protectors',
    'Front Fender Extenders',
    'Rear Hugger & Tire Huggers',
    'Wheel Rim Protectors',
    'Tire Puncture Protection',
    'Radiator Side Protectors',
    'Windscreen Protectors',
    'Number Plate Guards',
    'Side Stand Pads',
    'Footrest Guards',
    'Motorcycle Security Locks'
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
  'Lighting & Electrical': [
    'LED Fog Lights',
    'Auxiliary Driving Lights',
    'LED Headlight Bulbs',
    'Projector Headlights',
    'LED Headlight Assemblies',
    'LED Tail Lights',
    'LED Turn Signal Indicators',
    'Sequential LED Indicators',
    'LED Indicator Bulbs',
    'DRL (Daytime Running Lights)',
    'LED Light Bars',
    'Spotlights & Floodlights',
    'Brake Lights',
    'Hazard Warning Lights',
    'Number Plate Lights',
    'Handlebar Switches',
    'Headlight Switches',
    'Indicator Switches',
    'Starter Switches',
    'Ignition Switches',
    'Motorcycle Horns',
    'Dual Tone & Loud Horns',
    'USB Mobile Chargers',
    'USB Type-C Fast Chargers',
    'Wireless Phone Charging Mounts',
    'Mobile Phone Holders with Charging',
    'Battery Chargers',
    'Battery Voltage Monitors',
    'Motorcycle Batteries',
    'Battery Terminals & Connectors',
    'Wiring Harnesses',
    'Relay Modules',
    'Fuse Boxes & Fuses',
    'LED Flasher Relays',
    'Voltage Regulators & Rectifiers',
    'Ignition Coils',
    'Spark Plugs',
    'CDI Units & ECU Modules',
    'Digital Speedometers & Gauges',
    'Auxiliary Light Mounting Brackets'
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
];

const POPULAR_BRANDS = [
  'RU BIKER world Genuine Parts',
  'MT Helmets',
  'AGV Helmets',
  'Akrapovič Exhausts',
  'Rynox Gears',
  'Royal Enfield',
  'Yamaha Racing',
  'KTM PowerParts',
  'Kawasaki Ninja',
  'Brembo Brakes',
  'ViaTerra Luggage',
  'Liqui Moly',
  'Motul Oils',
  'K&N Filters',
  'NGK Spark Plugs',
  'Rolon Chains',
  'HJC Helmets',
  'Shark Helmets'
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

export const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { addToast } = useNotifications() || {};
  const initialCat = Object.keys(CATEGORY_MAP)[0];
  const [activeMediaTab, setActiveMediaTab] = useState('images'); // 'images' | 'video'
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customBikeInput, setCustomBikeInput] = useState('');

  const imageFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: initialCat,
    subcategory: CATEGORY_MAP[initialCat][0],
    price: '',
    originalPrice: '',
    cost: '',
    brand: 'RU BIKER world Genuine Parts',
    sku: `SP-${Date.now().toString().slice(-6)}`,
    image: PRESET_IMAGES[0].url,
    images: [PRESET_IMAGES[0].url],
    video: PRESET_VIDEOS[0].url,
    videoTitle: PRESET_VIDEOS[0].name,
    available: true,
    trackStockDirectly: true,
    stockCount: 20,
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

  const handleCategoryChange = (newCat) => {
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

  const handleLocalImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target.result;
        setFormData((prev) => {
          const updatedImages = [...prev.images, resultUrl];
          return {
            ...prev,
            image: resultUrl,
            images: updatedImages,
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
      if (addToast) addToast({ type: 'success', message: `Added video "${file.name}" from your computer!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      if (addToast) addToast({ type: 'error', message: 'Name and Price are required.' });
      return;
    }

    try {
      await adminService.createProduct({
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        cost: formData.cost ? Number(formData.cost) : Number(formData.price) * 0.45,
        brand: formData.brand || 'MotoZone',
        sku: formData.sku || `SP-${Date.now().toString().slice(-6)}`,
        image: formData.image,
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
        shippingCharge: formData.isFreeShipping ? 0 : Number(formData.shippingCharge || 0),
        weight: formData.weight,
        dimensions: formData.dimensions,
        shippingTier: formData.shippingTier,
        isFreeShipping: formData.isFreeShipping
      });

      if (addToast) addToast({ type: 'success', message: `Added "${formData.name}" to catalog!` });
      navigate('/admin/products');
    } catch (e) {
      if (addToast) addToast({ type: 'error', message: 'Failed to create product.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn font-sans p-6">
      {/* Return Back Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Products Catalog</span>
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="pb-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Add Motorcycle Part / Helmet / Accessory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Category, Sub-Category, Description, Local Photos & Videos, and Size/Weight-based Shipping.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Product / Part Name
            </label>
            <input
              type="text"
              placeholder="e.g. MT Thunder 4 SV Helmet / Ceramic Sintered Brake Pads"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-800"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <FiFileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Product Description & Features</span>
            </label>
            <textarea
              rows="3"
              placeholder="Describe material, bike compatibility, safety certifications, warranty, and rider features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800 leading-relaxed"
            />
          </div>

          {/* Technical Specs */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <FiLayers className="w-3.5 h-3.5 text-blue-500" />
              <span>Technical Specifications & Bike Models</span>
            </label>
            <input
              type="text"
              placeholder="e.g. For Yamaha R15 V4 / MT-15, Plug and Play, 100% Stainless Steel"
              value={formData.technicalSpecs}
              onChange={(e) => setFormData({ ...formData, technicalSpecs: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
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
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
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

            {/* Sub-Category Selection / Custom Input */}
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
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
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

          {/* Price, Original Price, Cost */}
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
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800"
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
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
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
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-800"
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

          {/* ===================== MEDIA TABS ===================== */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('images')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeMediaTab === 'images'
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
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeMediaTab === 'video'
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

            {/* Hidden File Inputs for PC */}
            <input
              type="file"
              ref={imageFileInputRef}
              onChange={handleLocalImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={videoFileInputRef}
              onChange={handleLocalVideoUpload}
              accept="video/*"
              className="hidden"
            />

            {/* 1. IMAGE GALLERY */}
            {activeMediaTab === 'images' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Click an image to set as Primary Cover.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <FiUploadCloud className="w-3.5 h-3.5" />
                      <span>Upload from Computer</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {formData.images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className={`relative group rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${formData.image === imgUrl ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
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
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 flex flex-col items-center justify-center text-blue-600 transition-all flex-shrink-0 cursor-pointer"
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

            {/* 2. DEMO VIDEO */}
            {activeMediaTab === 'video' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    Product Demo Video (.mp4, local file or URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <FiUploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Video from PC</span>
                    </button>
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
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${formData.video === vid.url
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
              </div>
            )}
          </div>

          {/* Availability & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-800">Available for Sale</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, available: !formData.available })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${formData.available ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${formData.available ? 'translate-x-5' : 'translate-x-0'
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

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Save Product to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
