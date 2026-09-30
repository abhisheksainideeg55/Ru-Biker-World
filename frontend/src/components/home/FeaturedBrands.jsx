import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';

export const featuredBrandList = [
  {
    id: 'simtac',
    name: 'Simtac',
    image: '/brands/simtac.svg',
    link: '/shop?brand=Simtac',
  },
  {
    id: 'philomax',
    name: 'Philomax',
    image: '/brands/philomax.svg',
    link: '/shop?brand=Philomax',
  },
  {
    id: 'n-gage',
    name: 'N gage',
    image: '/brands/ngage.svg',
    link: '/shop?brand=N+gage',
  },
  {
    id: 'rolon',
    name: 'Rolon',
    image: '/brands/rolon.svg',
    link: '/shop?brand=Rolon',
  },
  {
    id: 'simi-racing',
    name: 'Simi racing',
    image: '/brands/simi-racing.svg',
    link: '/shop?brand=Simi+racing',
  },
  {
    id: 'hjg',
    name: 'Hjg',
    image: '/brands/hjg.svg',
    link: '/shop?brand=HJG',
  },
  {
    id: 'silver-stallion',
    name: 'Silver stallion',
    image: '/silverstallionexhaustauthorised_c945a2bf-557b-44fe-8e24-ea8aa8f9f678.png',
    link: '/shop?brand=Silver+Stallion',
  },
  {
    id: 'vesrah',
    name: 'Vesrah',
    image: '/sparify_brand_logo-6.png',
    link: '/shop?brand=Vesrah',
  },
  {
    id: 'hitech',
    name: 'Hitech',
    image: '/brands/hitech.svg',
    link: '/shop?brand=Hitech',
  },
  {
    id: 'moto-torque',
    name: 'Moto torque',
    image: '/brands/moto-torque.svg',
    link: '/shop?brand=Moto+Torque',
  },
  {
    id: 'motul',
    name: 'Motul',
    image: '/brands/motul.svg',
    link: '/shop?brand=Motul',
  },
  {
    id: '66bhp',
    name: '66bhp',
    image: '/brands/66bhp.svg',
    link: '/shop?brand=66bhp',
  },
  {
    id: 'motocare',
    name: 'Motocare',
    image: '/brands/motocare.svg',
    link: '/shop?brand=Motocare',
  },
  {
    id: 'studds',
    name: 'Studds',
    image: '/brands/studds.svg',
    link: '/shop?brand=Studds',
  },
  {
    id: 'vega',
    name: 'Vega',
    image: '/brands/vega.svg',
    link: '/shop?brand=Vega',
  },
  {
    id: 'steelbird',
    name: 'Steelbird',
    image: '/brands/steelbird.svg',
    link: '/shop?brand=Steelbird',
  },
  {
    id: 'axor',
    name: 'Axor',
    image: '/sparify_brand_logo-8.png',
    link: '/shop?brand=Axor',
  },
  {
    id: 'smk',
    name: 'Smk',
    image: '/sparify_brand_logo-5.png',
    link: '/shop?brand=SMK',
  },
  {
    id: 'grand-pitstop',
    name: 'Grand pitstop',
    image: '/brands/grand-pitstop.svg',
    link: '/shop?brand=Grand+Pitstop',
  },
  {
    id: 'moto-genius',
    name: 'Moto genius',
    image: '/brands/moto-genius.svg',
    link: '/shop?brand=Moto+Genius',
  },
  {
    id: 'auto-bird',
    name: 'Auto bird',
    image: '/brands/auto-bird.svg',
    link: '/shop?brand=Auto+Bird',
  },
];

const legacyOldBrandIds = new Set([
  'rcb', 'bobo', 'red-rooster', 'taanc', 'ngk', 'korda', 'motowolf', 'givi',
  'ejeas', 'carbonado', 'acerbis', 'legundary-customs', 'gopro', 'powerrage',
  'barrel-exhaust', 'ht-exhaust', 'bmc', 'lgp', 'way2speed', 'raida-gears',
  'ebc-brakes', 'jb-racing', 'parani'
]);

import { adminService } from '../../services/adminService';

export const FeaturedBrands = () => {
  const [brandList, setBrandList] = useState(featuredBrandList);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const dbBrands = await adminService.getFeaturedBrands();
        if (isMounted && Array.isArray(dbBrands) && dbBrands.length > 0) {
          const filtered = dbBrands.filter(
            (b) => b.status !== 'inactive' && !legacyOldBrandIds.has(b.id)
          );
          if (filtered.length > 0) {
            setBrandList(filtered);
          }
        }
      } catch (e) {}
    };

    fetchFeatured();

    const handleUpdate = () => {
      fetchFeatured();
    };

    window.addEventListener('sparify_featured_brands_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('sparify_featured_brands_updated', handleUpdate);
    };
  }, []);

  const displayList = brandList.length > 0 ? brandList : featuredBrandList;
  // Duplicate array for 100% seamless infinite linear continuous glide
  const repeatedBrandList = [...displayList, ...displayList];

  return (
    <section className="py-6 sm:py-10 bg-white select-none overflow-hidden">
      <Container size="wide">
        {/* Section Heading */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-sans">
            Featured Brands
          </h2>
        </div>
      </Container>

      {/* Infinite Linear Gliding Track */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle left/right gradient mask */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-linear flex gap-3 sm:gap-4 lg:gap-5 py-2 px-2 hover:[animation-play-state:paused]">
          {repeatedBrandList.map((brand, idx) => (
            <Link
              key={`${brand.id || idx}-${idx}`}
              to={brand.link || `/shop?brand=${encodeURIComponent(brand.name)}`}
              className="shrink-0 w-36 sm:w-44 lg:w-48 aspect-square rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 shadow-xs hover:shadow-card p-4 sm:p-6 flex items-center justify-center transition-all duration-300 hover:scale-105 group"
              title={brand.name}
            >
              <img
                src={brand.image}
                alt={brand.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Untitled_design_3.jpg';
                }}
                className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
