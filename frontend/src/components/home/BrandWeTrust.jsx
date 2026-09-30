import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Container from '../common/Container';

export const brandWeTrustList = [
  {
    id: 'bajaj',
    name: 'BAJAJ',
    image: '/brands/bajaj.svg',
    fallbackImage: '/44_c89a90aa-dba3-4180-9912-44b6249eaab2.png',
    link: '/shop?bike=Bajaj',
  },
  {
    id: 'ktm',
    name: 'KTM',
    image: '/brands/ktm.svg',
    fallbackImage: '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png',
    link: '/shop?bike=KTM',
  },
  {
    id: 'royal-enfield',
    name: 'ROYAL ENFIELD',
    image: '/brands/royal-enfield.svg',
    fallbackImage: '/40_9eb1ac3b-42b4-4636-85f3-47fe41b864cb.png',
    link: '/shop?bike=Royal+Enfield',
  },
  {
    id: 'benelli',
    name: 'BENELLI',
    image: '/brands/benelli.svg',
    fallbackImage: '/46_37a22301-0a85-4702-85ca-406e7d710551.png',
    link: '/shop?bike=Benelli',
  },
  {
    id: 'bmw',
    name: 'BMW',
    image: '/brands/bmw.svg',
    fallbackImage: '/45_2494c0d0-08c9-481f-8925-29c0f5622870.png',
    link: '/shop?bike=BMW',
  },
  {
    id: 'tvs',
    name: 'TVS',
    image: '/brands/tvs.svg',
    fallbackImage: '/42_548fc399-90eb-4dbf-97c5-dbd96170ef9a.png',
    link: '/shop?bike=TVS',
  },
  {
    id: 'yamaha',
    name: 'YAMAHA',
    image: '/brands/yamaha.svg',
    fallbackImage: '/43.png',
    link: '/shop?bike=Yamaha',
  },
  {
    id: 'honda',
    name: 'HONDA',
    image: '/brands/honda.svg',
    fallbackImage: '/44_3f3c44f7-fbf3-4bdb-845b-d6ae87fcfda1.png',
    link: '/shop?bike=Honda',
  },
  {
    id: 'hero',
    name: 'HERO',
    image: '/brands/hero.svg',
    fallbackImage: '/45_da6d2be1-c572-4d1d-9c8f-dd3249235017.png',
    link: '/shop?bike=Hero',
  },
  {
    id: 'kawasaki',
    name: 'KAWASAKI',
    image: '/brands/kawasaki.svg',
    fallbackImage: '/41_3303eb26-c8b4-4f28-80af-753dfca85a66.png',
    link: '/shop?bike=Kawasaki',
  },
  {
    id: 'triumph',
    name: 'TRIUMPH',
    image: '/brands/triumph.svg',
    fallbackImage: '/43_ca013c29-0048-4326-81f9-1b6667238d4f.png',
    link: '/shop?bike=Triumph',
  },
  {
    id: 'piaggio',
    name: 'PIAGGIO',
    image: '/brands/piaggio.svg',
    fallbackImage: '/46_a855f9a1-863b-4af5-8d25-4769f3964693.png',
    link: '/shop?bike=Piaggio',
  },
];

import { adminService } from '../../services/adminService';

export const BrandWeTrust = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [brands, setBrands] = useState(() => {
    return brandWeTrustList.map((b, idx) => ({
      ...b,
      status: 'active',
      order: idx + 1,
      link: `/shop?bike=${encodeURIComponent(b.name)}`
    }));
  });

  useEffect(() => {
    let isMounted = true;
    const fetchBrands = async () => {
      try {
        const dbBrands = await adminService.getTrustedBrands();
        if (isMounted && Array.isArray(dbBrands) && dbBrands.length > 0) {
          setBrands(
            dbBrands
              .filter((b) => b.status !== 'inactive')
              .map((b) => ({
                ...b,
                link: b.link && b.link.includes('?bike=') ? b.link : `/shop?bike=${encodeURIComponent(b.name)}`
              }))
              .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
          );
        }
      } catch (e) {}
    };

    fetchBrands();

    const handleUpdate = () => {
      fetchBrands();
    };

    window.addEventListener('sparify_trusted_brands_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('sparify_trusted_brands_updated', handleUpdate);
    };
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const handleScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-8 sm:py-12 bg-white select-none relative">
      <Container size="wide">
        {/* Section Heading */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight font-sans">
            Brand We Trust
          </h2>
        </div>

        {/* Carousel Container with Side Floating Arrows */}
        <div className="relative group">
          {/* Floating Left Navigation Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous brands"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <FiChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Floating Right Navigation Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next brands"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <FiChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Bike Brand Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1 scroll-smooth"
          >
            {brands.map((bike) => {
              const targetLink = bike.link && bike.link.includes('?bike=')
                ? bike.link
                : `/shop?bike=${encodeURIComponent(bike.name)}`;
              return (
                <Link
                  key={bike.id}
                  to={targetLink}
                  className="snap-start shrink-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[calc((100%-5*1.5rem)/6)] block group transition-transform duration-300 hover:-translate-y-1"
                  title={`Explore ${bike.name} Parts & Accessories`}
                >
                {/* White Image Card Box */}
                <div className="w-full aspect-square bg-white border border-slate-200/90 rounded-sm shadow-xs p-4 sm:p-6 flex items-center justify-center transition-all duration-300 group-hover:border-slate-400 group-hover:shadow-md">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    loading="lazy"
                    onError={(e) => {
                      if (bike.fallbackImage && e.target.src !== bike.fallbackImage) {
                        e.target.src = bike.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-contain block group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Brand Name Text Beneath */}
                <p className="mt-3 text-center text-xs sm:text-sm font-black text-[#111111] tracking-wider uppercase group-hover:text-brand-600 transition-colors">
                  {bike.name}
                </p>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BrandWeTrust;
