import React from 'react';

export const ShopHeader = ({ filters = {} }) => {
  // Compute dynamic title & subtitle based on query parameters
  let title = 'Shop Motorcycle Parts & Accessories';
  let subtitle =
    'Explore genuine OEM replacement spares, performance upgrades, protection kits, touring luggage, and riding gear.';

  if (filters.customTitle) {
    title = filters.customTitle;
    subtitle = `Explore premium ${filters.customTitle.toLowerCase()} with certified safety ratings, guaranteed fitment, and pan-India delivery.`;
  } else if (filters.q) {
    title = `Search Results for "${filters.q}"`;
    subtitle = `Displaying motorcycle parts and compatible accessories matching "${filters.q}".`;
  } else if (filters.bikeBrands && filters.bikeBrands.length === 1) {
    const bike = filters.bikeBrands[0];
    if (filters.bikeModels && filters.bikeModels.length === 1) {
      title = `${bike} ${filters.bikeModels[0]} Parts & Upgrades`;
      subtitle = `Guaranteed fitment spares, exhausts, crash protection, and accessories for ${bike} ${filters.bikeModels[0]}.`;
    } else {
      title = `${bike} Motorcycle Parts & Accessories`;
      subtitle = `Browse genuine replacement parts and custom aftermarket upgrades for all ${bike} models.`;
    }
  } else if (filters.categories && filters.categories.length === 1) {
    const cat = filters.categories[0];
    title = `${cat} Catalog`;
    subtitle = `High-durability ${cat.toLowerCase()} engineered for longevity, safety, and track-ready performance.`;
  }

  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default ShopHeader;
