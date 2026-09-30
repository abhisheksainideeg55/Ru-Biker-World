import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiX, FiCheck, FiFilter } from 'react-icons/fi';
import { sortOptions } from '../../hooks/useProductSort';

export const ShopToolbar = ({
  totalCount = 0,
  currentSort = 'featured',
  onSortChange,
  filters = {},
  onToggleFilter,
  onSetSingleFilter,
  onSetPriceRange,
  onClearAll,
  onOpenMobileFilter,
  activeFilterCount = 0,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null); // 'bike' | 'availability' | 'price' | 'category' | 'sort' | null
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || '');
  const toolbarRef = useRef(null);

  useEffect(() => {
    setLocalMinPrice(filters.minPrice || '');
    setLocalMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const BIKE_OPTIONS = [
    'Royal Enfield',
    'KTM',
    'Yamaha',
    'BMW',
    'TVS',
    'Bajaj',
    'Kawasaki',
    'Honda',
    'Suzuki',
    'Triumph',
    'Hero',
    'Ducati',
  ];

  const CATEGORY_OPTIONS = [
    { label: 'Accessories & Touring', value: 'accessories' },
    { label: 'Mobile Holders & Mounts', value: 'mobile-holder' },
    { label: 'Bike Protection', value: 'bike-protection' },
    { label: 'Air filter', value: 'air-filter' },
    { label: 'Oil filter', value: 'oil-filter' },
    { label: 'Brake pad', value: 'brake-pad' },
    { label: 'Brake shoe', value: 'brake-shoe' },
    { label: 'Chain Sprocket', value: 'chain-sprockets' },
    { label: 'Crash guard', value: 'crash-guards' },
    { label: 'Performance Exhaust', value: 'exhausts' },
    { label: 'Lighting & Horns', value: 'lighting' },
    { label: 'Helmets', value: 'helmets' },
    { label: 'Riding Gear', value: 'riding-gear' },
  ];

  const currentSortLabel = sortOptions.find((s) => s.value === currentSort)?.label || 'Featured';

  return (
    <div
      ref={toolbarRef}
      className="relative z-20 bg-white border-b border-gray-200 py-3 mb-6 select-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
        {/* Left Side: Filter Options */}
        <div className="flex items-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-[13px] sm:text-[14px]">
          <span className="font-bold text-black shrink-0">Filter:</span>

          {/* 1. Select Your Bike Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('bike')}
              className={`inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors ${
                filters.bikeBrands?.length > 0 || openDropdown === 'bike'
                  ? 'text-black font-semibold'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>
                {filters.bikeBrands?.length > 0
                  ? filters.bikeBrands[0]
                  : 'Select your bike'}
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform text-gray-500 ${
                  openDropdown === 'bike' ? 'rotate-180 text-black' : ''
                }`}
              />
            </button>

            {openDropdown === 'bike' && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 animate-fadeIn max-h-64 overflow-y-auto">
                <div className="p-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Popular Bikes
                </div>
                {BIKE_OPTIONS.map((bike) => {
                  const isSelected = filters.bikeBrands?.includes(bike);
                  return (
                    <button
                      key={bike}
                      type="button"
                      onClick={() => {
                        onToggleFilter?.('bikeBrands', bike);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{bike}</span>
                      {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Availability Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('availability')}
              className={`inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors ${
                filters.availability && filters.availability !== 'all' || openDropdown === 'availability'
                  ? 'text-black font-semibold'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>
                {filters.availability === 'in-stock'
                  ? 'In Stock'
                  : filters.availability === 'out-of-stock'
                  ? 'Out of Stock'
                  : 'Availability'}
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform text-gray-500 ${
                  openDropdown === 'availability' ? 'rotate-180 text-black' : ''
                }`}
              />
            </button>

            {openDropdown === 'availability' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 animate-fadeIn">
                {[
                  { label: 'All Items', value: 'all' },
                  { label: 'In Stock Only', value: 'in-stock' },
                  { label: 'Out of Stock', value: 'out-of-stock' },
                ].map((opt) => {
                  const isSelected = (filters.availability || 'all') === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSetSingleFilter?.('availability', opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Price Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('price')}
              className={`inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors ${
                filters.minPrice || filters.maxPrice || openDropdown === 'price'
                  ? 'text-black font-semibold'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>
                {filters.minPrice || filters.maxPrice
                  ? `₹${filters.minPrice || 0} - ₹${filters.maxPrice || 'Any'}`
                  : 'Price'}
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform text-gray-500 ${
                  openDropdown === 'price' ? 'rotate-180 text-black' : ''
                }`}
              />
            </button>

            {openDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 animate-fadeIn">
                <div className="text-xs font-bold text-gray-900 mb-2">Price Range (₹)</div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLocalMinPrice('');
                      setLocalMaxPrice('');
                      onSetPriceRange?.('', '');
                      setOpenDropdown(null);
                    }}
                    className="text-xs text-gray-500 hover:text-black underline cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSetPriceRange?.(localMinPrice, localMaxPrice);
                      setOpenDropdown(null);
                    }}
                    className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('category')}
              className={`inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors ${
                filters.categories?.length > 0 || openDropdown === 'category'
                  ? 'text-black font-semibold'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>
                {filters.categories?.length > 0
                  ? filters.categories[0]
                  : 'Category'}
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform text-gray-500 ${
                  openDropdown === 'category' ? 'rotate-180 text-black' : ''
                }`}
              />
            </button>

            {openDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 animate-fadeIn max-h-64 overflow-y-auto">
                <div className="p-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Category
                </div>
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = filters.categories?.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        onToggleFilter?.('categories', cat.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sort By Dropdown & Product Count */}
        <div className="flex items-center gap-4 sm:gap-6 text-[13px] sm:text-[14px]">
          {/* Sort By Dropdown */}
          <div className="relative flex items-center gap-1.5">
            <span className="font-medium text-gray-700">Sort by:</span>
            <button
              type="button"
              onClick={() => toggleDropdown('sort')}
              className="inline-flex items-center gap-1 font-semibold text-black hover:text-neutral-700 cursor-pointer"
            >
              <span>{currentSortLabel}</span>
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform text-gray-500 ${
                  openDropdown === 'sort' ? 'rotate-180 text-black' : ''
                }`}
              />
            </button>

            {openDropdown === 'sort' && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 animate-fadeIn">
                {sortOptions.map((opt) => {
                  const isSelected = currentSort === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange?.(opt.value);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total Products Count */}
          <div className="text-gray-500 font-normal text-xs sm:text-[13px] whitespace-nowrap">
            {totalCount} products
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopToolbar;
