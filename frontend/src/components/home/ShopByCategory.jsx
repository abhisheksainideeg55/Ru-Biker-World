import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Container from '../common/Container';

export const initialShopByCategories = [
  {
    id: 'bike-protection',
    name: 'Bike Protection',
    image: '/ChatGPT_Image_Apr_25_2026_02_14_12_PM.png',
    link: '/shop?category=Protection%20%26%20Guards',
    status: 'active',
    order: 1
  },
  {
    id: 'rider-protection',
    name: 'Rider Protection',
    image: '/ChatGPT_Image_Apr_25_2026_02_06_34_PM.png',
    link: '/shop?category=Helmets%20%26%20Gear',
    status: 'active',
    order: 2
  },
  {
    id: 'luggage',
    name: 'Luggage Inn',
    image: '/ChatGPT_Image_Apr_25_2026_03_17_07_PM.png',
    link: '/shop?category=Luggage',
    status: 'active',
    order: 3
  },
  {
    id: 'performance-parts',
    name: 'Performance Parts',
    image: '/ChatGPT_Image_Apr_25_2026_03_11_20_PM.png',
    link: '/shop?category=Performance%20%26%20Exhaust',
    status: 'active',
    order: 4
  },
  {
    id: 'chain-sprocket',
    name: 'Chain Sprockets',
    image: '/ChatGPT_Image_Apr_25_2026_02_08_58_PM.png',
    link: '/shop?category=Spare%20Parts',
    status: 'active',
    order: 5
  },
  {
    id: 'lights-and-electronics',
    name: 'Lights & Electronics',
    image: '/ChatGPT_Image_Apr_25_2026_02_10_38_PM.png',
    link: '/shop?category=Lighting%20%26%20Electrical',
    status: 'active',
    order: 6
  },
  {
    id: 'mirrors',
    name: 'Mirrors',
    image: '/ChatGPT_Image_Apr_25_2026_02_12_35_PM.png',
    link: '/shop?category=Accessories%20%26%20Touring',
    status: 'active',
    order: 7
  }
];

import { adminService } from '../../services/adminService';

export const ShopByCategory = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [categoryList, setCategoryList] = useState(initialShopByCategories);

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const dbData = await adminService.getShopByCategory();
        if (isMounted && Array.isArray(dbData) && dbData.length > 0) {
          const formatted = dbData
            .filter((c) => c.status !== 'inactive')
            .map((c) => {
              if (c.id === 'luggage' && (!c.link || c.link.includes('Accessories%20%26%20Touring') || c.link.includes('category=accessories'))) {
                return { ...c, link: '/shop?category=Luggage' };
              }
              return c;
            })
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

          if (formatted.length > 0) {
            setCategoryList(formatted);
          }
        }
      } catch (e) {}
    };

    fetchCats();

    const handleUpdate = () => {
      fetchCats();
    };

    window.addEventListener('sparify_shop_by_category_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('sparify_shop_by_category_updated', handleUpdate);
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
  }, [checkScroll, categoryList]);

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
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-sans">
            Shop By Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Discover precision riding gear, luggage solutions, exhausts & essential motorcycle parts
          </p>
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

          {/* Category Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {categoryList.map((category) => (
              <Link
                key={category.id}
                to={category.link || `/shop?category=${encodeURIComponent(category.name)}`}
                className="snap-start shrink-0 w-[42vw] sm:w-[28vw] md:w-[22vw] lg:w-[calc((100%-5*1.25rem)/6)] block group transition-all duration-300 hover:-translate-y-1"
                title={`Shop ${category.name}`}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 group-hover:border-slate-400/80 shadow-2xs group-hover:shadow-md transition-all">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full aspect-[4/5] object-contain p-2 block group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/ChatGPT_Image_Apr_25_2026_02_06_34_PM.png';
                    }}
                  />
                  {/* Category Name Label */}
                  <div className="py-2 px-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center text-center">
                    <span className="text-xs font-bold text-slate-800 truncate group-hover:text-[#c81e2b] transition-colors">
                      {category.name}
                    </span>
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

export default ShopByCategory;
