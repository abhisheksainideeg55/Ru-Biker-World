import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPackage, FiAward, FiGrid, FiTrendingUp } from 'react-icons/fi';
import { searchSuggestionsData } from '../../data/searchSuggestions';

export const SearchSuggestions = ({
  query = '',
  selectedIndex = -1,
  onSelectSuggestion,
  onViewAll,
  onClose,
}) => {
  const cleanQuery = query.trim().toLowerCase();

  // Filter products, brands, and categories based on query
  const filteredProducts = cleanQuery
    ? searchSuggestionsData.products.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery)
      )
    : searchSuggestionsData.products.slice(0, 3);

  const filteredBrands = cleanQuery
    ? searchSuggestionsData.brands.filter((b) =>
        b.name.toLowerCase().includes(cleanQuery)
      )
    : searchSuggestionsData.brands.slice(0, 4);

  const filteredCategories = cleanQuery
    ? searchSuggestionsData.categories.filter((c) =>
        c.name.toLowerCase().includes(cleanQuery)
      )
    : searchSuggestionsData.categories.slice(0, 4);

  const hasMatches =
    filteredProducts.length > 0 ||
    filteredBrands.length > 0 ||
    filteredCategories.length > 0;

  return (
    <div
      id="search-suggestions-menu"
      role="listbox"
      aria-label="Search suggestions"
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-slate-200 py-3 z-50 overflow-hidden animate-fadeIn text-slate-800"
    >
      {/* Header bar / Trending pills if no query */}
      {!cleanQuery && (
        <div className="px-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            <FiTrendingUp className="w-3.5 h-3.5 text-brand-500" />
            <span>Popular Searches</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {searchSuggestionsData.trendingKeywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectSuggestion(kw)}
                className="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 font-medium px-3 py-1 rounded-full transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasMatches ? (
        <div className="divide-y divide-slate-100 text-xs max-h-[65vh] overflow-y-auto">
          {/* Products Group */}
          {filteredProducts.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-2 mb-1.5">
                <FiPackage className="w-3.5 h-3.5 text-brand-500" />
                <span>Products</span>
              </span>
              <div className="space-y-1">
                {filteredProducts.map((prod, idx) => (
                  <Link
                    key={idx}
                    to={prod.path}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group font-medium"
                  >
                    <span className="text-slate-800 group-hover:text-brand-600 font-semibold">
                      {prod.title}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {prod.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Brands Group */}
          {filteredBrands.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-2 mb-1.5">
                <FiAward className="w-3.5 h-3.5 text-brand-500" />
                <span>Motorcycle Brands</span>
              </span>
              <div className="grid grid-cols-2 gap-1">
                {filteredBrands.map((brand, idx) => (
                  <Link
                    key={idx}
                    to={brand.path}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-slate-800 group-hover:text-brand-600 font-semibold">
                      {brand.name}
                    </span>
                    {brand.count && (
                      <span className="text-[10px] text-slate-400">
                        {brand.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories Group */}
          {filteredCategories.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-2 mb-1.5">
                <FiGrid className="w-3.5 h-3.5 text-brand-500" />
                <span>Categories</span>
              </span>
              <div className="grid grid-cols-2 gap-1">
                {filteredCategories.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={cat.path}
                    onClick={onClose}
                    className="px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 group-hover:text-brand-600 font-semibold block transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-500">
          <p>No exact keyword matches found for "{query}".</p>
          <p className="mt-1 text-slate-400">Press enter to search full catalog.</p>
        </div>
      )}

      {/* Footer view all results CTA */}
      <div className="px-4 pt-3 pb-1 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70">
        <span className="text-slate-500 font-medium">
          {cleanQuery ? `Results for "${cleanQuery}"` : 'Explore entire catalog'}
        </span>
        <button
          type="button"
          onClick={() => onViewAll(cleanQuery || 'all')}
          className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 py-1"
        >
          <span>View all results</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SearchSuggestions;
