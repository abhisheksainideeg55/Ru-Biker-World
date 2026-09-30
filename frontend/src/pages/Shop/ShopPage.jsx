import React, { useState, useEffect, useMemo } from 'react';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import Pagination from '../../components/common/Pagination';
import ShopHeader from '../../components/shop/ShopHeader';
import ShopToolbar from '../../components/shop/ShopToolbar';
import FilterSidebar from '../../components/shop/FilterSidebar';
import FilterDrawer from '../../components/shop/FilterDrawer';
import ActiveFilters from '../../components/shop/ActiveFilters';
import EmptyProducts from '../../components/shop/EmptyProducts';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductGridSkeleton } from '../../components/product/ProductGridSkeleton';
import { ProductErrorState } from '../../components/product/ProductErrorState';
import { useProducts } from '../../hooks/useProducts';
import { setPageMeta } from '../../utils/seo';

export const ShopPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    products,
    totalCount,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    loading,
    error,
    refetch,
    setPage,
    filters,
    activeFilters,
    toggleFilter,
    setSingleFilter,
    setPriceRange,
    removeFilter,
    clearFilters,
    currentSort,
    setSort,
  } = useProducts({ defaultLimit: 10 });

  // Dynamic SEO meta updates
  useEffect(() => {
    let pageTitle = 'Motorcycle Spare Parts & Accessories';
    let metaDesc = 'Explore 10,000+ genuine OEM replacement parts, performance upgrades, and rider accessories at MotoZone.';

    if (filters.customTitle) {
      pageTitle = `${filters.customTitle} | MotoZone`;
      metaDesc = `Shop ${filters.customTitle} with guaranteed quality, fitment, and fast shipping.`;
    } else if (filters.q) {
      pageTitle = `Search: ${filters.q}`;
      metaDesc = `Search results for ${filters.q} at MotoZone.`;
    } else if (filters.bikeBrands && filters.bikeBrands.length === 1) {
      pageTitle = `${filters.bikeBrands[0]} Spare Parts & Accessories`;
      metaDesc = `Genuine and performance parts for ${filters.bikeBrands[0]} motorcycles.`;
    } else if (filters.categories && filters.categories.length === 1) {
      pageTitle = `${filters.categories[0]} Parts & Upgrades`;
      metaDesc = `Shop genuine ${filters.categories[0]} with verified fitment and fast pan-India delivery.`;
    }

    setPageMeta({
      title: pageTitle,
      description: metaDesc,
      canonical: window.location.origin + '/shop',
    });
  }, [filters]);

  // Dynamic Breadcrumb computation
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Shop', path: '/shop' }];

    if (filters.customTitle) {
      if (filters.categories && filters.categories.length === 1) {
        const catName = filters.categories[0].charAt(0).toUpperCase() + filters.categories[0].slice(1);
        items.push({
          label: catName,
          path: `/shop?category=${encodeURIComponent(filters.categories[0])}`,
        });
      }
      items.push({ label: filters.customTitle });
    } else if (filters.bikeBrands && filters.bikeBrands.length === 1) {
      items.push({
        label: filters.bikeBrands[0],
        path: `/shop?bike=${encodeURIComponent(filters.bikeBrands[0])}`,
      });
      if (filters.bikeModels && filters.bikeModels.length === 1) {
        items.push({ label: filters.bikeModels[0] });
      }
    } else if (filters.categories && filters.categories.length === 1) {
      items.push({ label: filters.categories[0] });
    } else if (filters.q) {
      items.push({ label: `Search "${filters.q}"` });
    }

    return items;
  }, [filters]);

  return (
    <div className="py-6 sm:py-8 bg-surface-50 min-h-screen">
      <Container size="wide">
        {/* Dynamic Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} className="mb-2" />

        {/* Dynamic Shop Heading */}
        <ShopHeader filters={filters} />

        {/* Horizontal Filter & Sort Toolbar (Matches Screenshot) */}
        <ShopToolbar
          totalCount={totalCount}
          startIndex={startIndex}
          endIndex={endIndex}
          currentSort={currentSort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={filters}
          onToggleFilter={toggleFilter}
          onSetSingleFilter={setSingleFilter}
          onSetPriceRange={setPriceRange}
          onClearAll={clearFilters}
          onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeFilters.length}
        />

        {/* Main Full-Width Product Grid Layout (No Left Sidebar) */}
        <main className="w-full flex flex-col justify-between min-h-[600px]">
          <div>
            {/* Active Filter Chips */}
            <ActiveFilters
              activeFilters={activeFilters}
              onRemoveFilter={removeFilter}
              onClearAll={clearFilters}
            />

            {/* State Handling: Loading / Error / Empty / Grid */}
            {loading ? (
              <ProductGridSkeleton count={10} viewMode={viewMode} />
            ) : error ? (
              <ProductErrorState message={error} onRetry={refetch} />
            ) : products.length === 0 ? (
              <EmptyProducts onClearAll={clearFilters} />
            ) : (
              <ProductGrid
                products={products}
                viewMode={viewMode}
              />
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-slate-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </main>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filters}
          onToggleFilter={toggleFilter}
          onSetSingleFilter={setSingleFilter}
          onSetPriceRange={setPriceRange}
          onClearAll={clearFilters}
          totalCount={totalCount}
        />
      </Container>
    </div>
  );
};

export default ShopPage;
