import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCheckCircle, FiChevronRight, FiSliders } from 'react-icons/fi';
import { bikeBrands } from '../../data/bikes';
import Button from '../common/Button';
import Badge from '../common/Badge';

const finderCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'spare-parts', name: 'Spare Parts' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'protection', name: 'Protection' },
  { id: 'performance', name: 'Performance' },
  { id: 'riding-gear', name: 'Riding Gear' },
  { id: 'touring', name: 'Luggage & Touring' },
];

export const BikeFinder = ({ className = '' }) => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Find active brand object to retrieve its models dynamically
  const activeBrandObj = bikeBrands.find((b) => b.name === selectedBrand || b.id === selectedBrand);
  const availableModels = activeBrandObj ? activeBrandObj.popularModels : [];

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel(''); // Reset model when brand changes
  };

  const handleFindParts = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (selectedBrand) params.append('bike', selectedBrand);
    if (selectedModel && selectedModel !== 'all') params.append('model', selectedModel);
    if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);

    const queryString = params.toString();
    navigate(queryString ? `/shop?${queryString}` : '/shop');
  };

  return (
    <div className={`bg-surface-900/95 border border-surface-800 rounded-2xl p-6 sm:p-7 backdrop-blur-md shadow-2xl space-y-5 text-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2">
            <FiSliders className="w-5 h-5 text-brand-500" />
            <span>Find Parts For Your Bike</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select make & model for verified compatibility
          </p>
        </div>
        <Badge variant="primary" size="sm" dot>Direct Fit</Badge>
      </div>

      {/* Interactive Form */}
      <form onSubmit={handleFindParts} className="space-y-4">
        {/* 1. SELECT BRAND */}
        <div>
          <label htmlFor="bike-brand-select" className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5">
            1. Select Brand
          </label>
          <select
            id="bike-brand-select"
            value={selectedBrand}
            onChange={handleBrandChange}
            required
            className="w-full bg-surface-950 border border-slate-700 hover:border-slate-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors cursor-pointer"
          >
            <option value="">Select Motorcycle Make</option>
            {bikeBrands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. SELECT MODEL */}
        <div>
          <label htmlFor="bike-model-select" className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5">
            2. Select Model
          </label>
          <select
            id="bike-model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
            className="w-full bg-surface-950 border border-slate-700 hover:border-slate-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <option value="">
              {!selectedBrand ? 'Select Brand First' : 'All Models / Select Variant'}
            </option>
            {availableModels.map((model, idx) => (
              <option key={idx} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* 3. CATEGORY */}
        <div>
          <label htmlFor="bike-category-select" className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5">
            3. Category
          </label>
          <select
            id="bike-category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-surface-950 border border-slate-700 hover:border-slate-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors cursor-pointer"
          >
            {finderCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            icon={FiSearch}
            className="shadow-glow py-3 font-extrabold"
          >
            Find Compatible Parts →
          </Button>
        </div>
      </form>

      {/* Trust micro-banner */}
      <div className="pt-3 border-t border-surface-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <FiCheckCircle className="text-brand-400 w-3.5 h-3.5" />
          <span>Accurate model mapping</span>
        </span>
        <span className="text-slate-500">•</span>
        <span>10,000+ Verified SKUs</span>
      </div>
    </div>
  );
};

export default BikeFinder;
