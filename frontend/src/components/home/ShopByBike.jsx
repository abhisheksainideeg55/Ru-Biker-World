import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Container from '../common/Container';

export const shopByBikeBrands = [
  {
    id: 'ktm',
    name: 'KTM',
    image: '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png',
    link: '/shop?bike=KTM',
    status: 'active',
    order: 1
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki',
    image: '/41_3303eb26-c8b4-4f28-80af-753dfca85a66.png',
    link: '/shop?bike=Kawasaki',
    status: 'active',
    order: 2
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    image: '/40_9eb1ac3b-42b4-4636-85f3-47fe41b864cb.png',
    link: '/shop?bike=Royal+Enfield',
    status: 'active',
    order: 3
  },
  {
    id: 'piaggio',
    name: 'Piaggio / Aprilia',
    image: '/46_a855f9a1-863b-4af5-8d25-4769f3964693.png',
    link: '/shop?bike=Piaggio',
    status: 'active',
    order: 4
  },
  {
    id: 'tvs',
    name: 'TVS',
    image: '/42_548fc399-90eb-4dbf-97c5-dbd96170ef9a.png',
    link: '/shop?bike=TVS',
    status: 'active',
    order: 5
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    image: '/44_c89a90aa-dba3-4180-9912-44b6249eaab2.png',
    link: '/shop?bike=Bajaj',
    status: 'active',
    order: 6
  },
  {
    id: 'bmw',
    name: 'BMW Motorrad',
    image: '/45_2494c0d0-08c9-481f-8925-29c0f5622870.png',
    link: '/shop?bike=BMW',
    status: 'active',
    order: 7
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    image: '/43.png',
    link: '/shop?bike=Yamaha',
    status: 'active',
    order: 8
  },
  {
    id: 'benelli',
    name: 'Benelli',
    image: '/46_37a22301-0a85-4702-85ca-406e7d710551.png',
    link: '/shop?bike=Benelli',
    status: 'active',
    order: 9
  },
  {
    id: 'hero',
    name: 'Hero MotoCorp',
    image: '/45_da6d2be1-c572-4d1d-9c8f-dd3249235017.png',
    link: '/shop?bike=Hero',
    status: 'active',
    order: 10
  },
  {
    id: 'honda',
    name: 'Honda BigWing',
    image: '/44_3f3c44f7-fbf3-4bdb-845b-d6ae87fcfda1.png',
    link: '/shop?bike=Honda',
    status: 'active',
    order: 11
  },
  {
    id: 'triumph',
    name: 'Triumph',
    image: '/43_ca013c29-0048-4326-81f9-1b6667238d4f.png',
    link: '/shop?bike=Triumph',
    status: 'active',
    order: 12
  },
];

import { adminService } from '../../services/adminService';

export const ShopByBike = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [bikeBrands, setBikeBrands] = useState(shopByBikeBrands);

  useEffect(() => {
    let isMounted = true;
    const fetchBikes = async () => {
      try {
        const dbBikes = await adminService.getBikes();
        if (isMounted && Array.isArray(dbBikes) && dbBikes.length > 0) {
          setBikeBrands(
            dbBikes
              .filter((b) => b.status !== 'inactive')
              .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
          );
        }
      } catch (e) {}
    };

    fetchBikes();

    const handleUpdate = () => {
      fetchBikes();
    };

    window.addEventListener('sparify_bike_categories_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('sparify_bike_categories_updated', handleUpdate);
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
  }, [checkScroll, bikeBrands]);

  const handleScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-6 sm:py-8 bg-white select-none relative">
      <Container size="wide">
        {/* Section Heading */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-sans">
              Shop By Bike
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Select your motorcycle to view 100% exact-fit compatible spares, accessories & riding gear
            </p>
          </div>
        </div>

        {/* Carousel Container with Side Floating Arrows */}
        <div className="relative group">
          {/* Floating Left Navigation Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-black text-white flex items-center justify-center shadow-xl border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Floating Right Navigation Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-black text-white flex items-center justify-center shadow-xl border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Bike Brand Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {bikeBrands.map((bike) => (
              <Link
                key={bike.id}
                to={bike.link || `/shop?bike=${encodeURIComponent(bike.name)}`}
                className="snap-start shrink-0 w-[42vw] sm:w-[28vw] md:w-[22vw] lg:w-[calc((100%-5*1.25rem)/6)] block group transition-all duration-300 hover:-translate-y-1"
                title={`Shop by ${bike.name}`}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 group-hover:border-slate-400/80 shadow-2xs group-hover:shadow-md transition-all">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    loading="lazy"
                    className="w-full aspect-[4/5] object-contain p-2 block group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png';
                    }}
                  />
                  {/* Subtle Brand Label for clarity */}
                  <div className="py-2 px-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-center">
                    <span className="text-xs font-bold text-slate-800 truncate group-hover:text-[#c81e2b] transition-colors">
                      {bike.name}
                    </span>
                    {bike.models && bike.models.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {bike.models.length} bikes
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ShopByBike;
