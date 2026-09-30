import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiSliders, FiTrash2, FiSearch } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { bikeBrands } from '../../data/bikes';
import { categories } from '../../data/categories';

const productBrandsList = [
  'MotoZone',
  'Brembo',
  'DID',
  'NGK',
  'K&N',
  'Motul',
  'RK',
  'Philips',
  'Hella',
];

const discountOptions = [
  { label: '10% or more', value: '10' },
  { label: '20% or more', value: '20' },
  { label: '30% or more', value: '30' },
  { label: '40% or more', value: '40' },
];

const ratingOptions = [
  { label: '4★ & above', value: '4' },
  { label: '3★ & above', value: '3' },
  { label: '2★ & above', value: '2' },
];

export const FilterSidebar = ({
  filters = {},
  onToggleFilter,
  onSetSingleFilter,
  onSetPriceRange,
  onClearAll,
  className = '',
}) => {
  // Local price inputs state for user typing before clicking Apply
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice || '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice || '');

  // Search filter inside bike brands list
  const [bikeSearch, setBikeSearch] = useState('');

  // Synchronize local price input states when URL changes
  useEffect(() => {
    setMinPriceInput(filters.minPrice || '');
    setMaxPriceInput(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceApply = (e) => {
    e.preventDefault();
    onSetPriceRange(minPriceInput, maxPriceInput);
  };

  // Derive dynamic bike models based on currently selected bike brands
  const selectedBikeBrands = filters.bikeBrands || [];
  const dynamicModels = bikeBrands
    .filter((b) =>
      selectedBikeBrands.length === 0
        ? true
        : selectedBikeBrands.some(
            (sel) =>
              b.name.toLowerCase() === sel.toLowerCase() ||
              b.id.toLowerCase() === sel.toLowerCase()
          )
    )
    .flatMap((b) => b.popularModels);

  // Filtered bike brands list based on search
  const filteredBikeBrands = bikeBrands.filter((b) =>
    b.name.toLowerCase().includes(bikeSearch.toLowerCase())
  );

  return (
    <aside className={`w-full bg-white card-premium p-5 space-y-6 text-slate-800 ${className}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <FiSliders className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-bold text-slate-400 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <FiTrash2 className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* 1. Availability Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          Availability
        </h4>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-brand-600">
            <input
              type="checkbox"
              checked={filters.availability === 'in-stock'}
              onChange={() =>
                onSetSingleFilter(
                  'availability',
                  filters.availability === 'in-stock' ? 'all' : 'in-stock'
                )
              }
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-brand-600">
            <input
              type="checkbox"
              checked={filters.availability === 'out-of-stock'}
              onChange={() =>
                onSetSingleFilter(
                  'availability',
                  filters.availability === 'out-of-stock' ? 'all' : 'out-of-stock'
                )
              }
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
            />
            <span>Out of Stock</span>
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5 space-y-3">
        {/* 2. Price Range Filter */}
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Price Range
          </h4>
          {(filters.minPrice || filters.maxPrice) && (
            <button
              type="button"
              onClick={() => onSetPriceRange('', '')}
              className="text-[10px] text-brand-600 font-bold hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <form onSubmit={handlePriceApply} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label htmlFor="min-price-input" className="text-[10px] text-slate-400 block mb-1">
                Min (₹)
              </label>
              <input
                id="min-price-input"
                type="number"
                min="0"
                placeholder="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="max-price-input" className="text-[10px] text-slate-400 block mb-1">
                Max (₹)
              </label>
              <input
                id="max-price-input"
                type="number"
                min="0"
                placeholder="50,000"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full btn-outline text-xs py-1.5 font-bold hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* 3. Category Filter */}
      <div className="border-t border-slate-100 pt-5 space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          Categories
        </h4>
        <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isChecked = (filters.categories || []).some(
              (sel) =>
                sel.toLowerCase() === cat.name.toLowerCase() ||
                sel.toLowerCase() === cat.id.toLowerCase()
            );

            return (
              <label
                key={cat.id}
                className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-brand-600"
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleFilter('categories', cat.name)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                  />
                  <span>{cat.name}</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {cat.subcategories.length}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Bike Brand Filter */}
      <div className="border-t border-slate-100 pt-5 space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          Motorcycle Make / Brand
        </h4>
        {/* Quick search input */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search make..."
            value={bikeSearch}
            onChange={(e) => setBikeSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
          <FiSearch className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
        </div>

        <div className="space-y-2 text-xs max-h-44 overflow-y-auto pr-1">
          {filteredBikeBrands.map((brand) => {
            const isChecked = (filters.bikeBrands || []).some(
              (b) =>
                b.toLowerCase() === brand.name.toLowerCase() ||
                b.toLowerCase() === brand.id.toLowerCase()
            );

            return (
              <label
                key={brand.id}
                className="flex items-center justify-between cursor-pointer text-slate-700 hover:text-brand-600"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleFilter('bikeBrands', brand.name)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="truncate">{brand.name}</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {brand.popularModels.length}+
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Bike Model Filter (Dynamic) */}
      {dynamicModels.length > 0 && (
        <div className="border-t border-slate-100 pt-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Bike Model
            </h4>
            <span className="text-[10px] text-brand-600 font-bold">
              {selectedBikeBrands.length > 0 ? selectedBikeBrands.join(', ') : 'All Makes'}
            </span>
          </div>
          <div className="space-y-2 text-xs max-h-40 overflow-y-auto pr-1">
            {dynamicModels.slice(0, 15).map((model, idx) => {
              const isChecked = (filters.bikeModels || []).includes(model);

              return (
                <label
                  key={idx}
                  className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-brand-600 truncate"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleFilter('bikeModels', model)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="truncate">{model}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Product Brand Filter */}
      <div className="border-t border-slate-100 pt-5 space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          Component Manufacturer
        </h4>
        <div className="space-y-2 text-xs max-h-40 overflow-y-auto pr-1">
          {productBrandsList.map((brand, idx) => {
            const isChecked = (filters.productBrands || []).includes(brand);

            return (
              <label
                key={idx}
                className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-brand-600"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleFilter('productBrands', brand)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Rating Filter */}
      <div className="border-t border-slate-100 pt-5 space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          Customer Rating
        </h4>
        <div className="space-y-2 text-xs">
          {ratingOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-brand-600"
            >
              <input
                type="radio"
                name="rating-radio"
                checked={filters.minRating === opt.value}
                onChange={() =>
                  onSetSingleFilter(
                    'minRating',
                    filters.minRating === opt.value ? '' : opt.value
                  )
                }
                className="text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <span>{opt.label}</span>
                <FaStar className="w-3 h-3 text-amber-400" />
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 8. Discount Filter */}
      <div className="border-t border-slate-100 pt-5 space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          Discount
        </h4>
        <div className="space-y-2 text-xs">
          {discountOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-brand-600"
            >
              <input
                type="checkbox"
                checked={filters.minDiscount === opt.value}
                onChange={() =>
                  onSetSingleFilter(
                    'minDiscount',
                    filters.minDiscount === opt.value ? '' : opt.value
                  )
                }
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
