import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';

export const RelatedProducts = ({ products = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [products]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            You May Also Like
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Similar components, helmets, and upgrades matched for your ride.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        {products.length > 3 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 shadow-xs flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
            >
              <FiChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next products"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 shadow-xs flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
            >
              <FiChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel Track */}
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth scrollbar-none pb-4 pt-1 px-0.5"
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="flex-none w-[240px] sm:w-[265px] md:w-[280px] lg:w-[290px] flex flex-col items-stretch self-stretch"
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;

