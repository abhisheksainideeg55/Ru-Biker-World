import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import Container from '../common/Container';
import { productService } from '../../services/productService';
import { useCart } from '../../hooks/useCart';

export const TrendingHelmetPicks = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [addedItems, setAddedItems] = useState({});

  const scrollRef = useRef(null);
  const { addToCart, setIsDrawerOpen } = useCart() || {};

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

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
  }, [checkScroll, products]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadHelmetsAndGear = async () => {
      try {
        // Fetch products strictly belonging to 'Helmets & Gear' already added in MongoDB
        const res = await productService.getProducts({
          category: 'Helmets & Gear',
          limit: 50,
        });
        const rawList = res?.products || [];

        const HELMET_SUBCATS = [
          'full face helmets',
          'half face helmets',
          'half face helmtes',
          'retro helmets',
          'motocross helmets',
          'flip up helmets',
        ];

        // Strict filter: only items with category 'Helmets & Gear' and helmet subcategories
        const dbHelmets = rawList.filter((p) => {
          const cat = (p.category || '').toLowerCase().trim();
          const sub = (p.subcategory || '').toLowerCase().trim();
          const name = (p.name || '').toLowerCase();

          const isHelmetCategory = cat === 'helmets & gear' || cat === 'helmets';
          const isHelmetSubcategory =
            HELMET_SUBCATS.includes(sub) ||
            sub.includes('helmet') ||
            name.includes('helmet') ||
            name.includes('studds') ||
            name.includes('motocross');

          const isNonHelmet =
            /glove|boot|shoe|jacket|pant|guard|light|holder|damper|mount/i.test(sub) ||
            /glove|boot|shoe|jacket|guard|light|holder/i.test(name);

          return isHelmetCategory && isHelmetSubcategory && !isNonHelmet;
        });

        if (isMounted && dbHelmets.length > 0) {
          setProducts(dbHelmets);
        }
      } catch (e) {
        console.warn('Failed to load Helmets & Gear products from MongoDB:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHelmetsAndGear();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-white select-none border-b border-slate-100">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#111111] tracking-tight font-sans">
            Trending Helmet Picks
          </h2>
          <Link
            to="/shop?category=helmets"
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous helmets"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
            >
              <FiChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Product Track */}
          <div
            ref={scrollRef}
            className="flex items-stretch overflow-x-auto scroll-smooth scrollbar-none border border-slate-200 rounded-sm bg-white"
          >
            {products.map((product) => {
              const prodId = product.id || product._id || product.slug;
              const primaryImage = product.image || (Array.isArray(product.images) && product.images[0]) || '';

              // Resolve distinct second image for hover effect
              let hoverImage = null;
              if (Array.isArray(product.images) && product.images.length > 1) {
                hoverImage = product.images.find(
                  (img) => (typeof img === 'string' ? img : img?.url) !== primaryImage
                );
                if (hoverImage && typeof hoverImage === 'object') {
                  hoverImage = hoverImage.url || hoverImage.image;
                }
              }

              const ratingVal = Number(product.rating || 5.0).toFixed(1);
              const formattedPrice = Number(product.price || 0).toLocaleString('en-IN');
              const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 1;

              return (
                <div
                  key={prodId}
                  className="flex-none w-[240px] sm:w-[265px] md:w-[280px] lg:w-[290px] border-r border-slate-200 last:border-r-0 flex flex-col justify-between bg-white group/card hover:bg-slate-50/30 transition-colors duration-200"
                >
                  {/* Top: Product Image Box */}
                  <div className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden p-4 border-b border-slate-100">
                    {/* Badge */}
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 z-20 bg-[#1e293b] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-xs shadow-xs tracking-wide pointer-events-none">
                        {product.discount}% OFF
                      </span>
                    )}

                    <Link
                      to={`/product/${product.slug || prodId}`}
                      className="relative w-full h-full flex items-center justify-center overflow-hidden"
                    >
                      {hoverImage ? (
                        <>
                          <img
                            src={primaryImage}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-contain p-2 transition-all duration-500 ease-out group-hover/card:opacity-0 group-hover/card:scale-95 group-hover/card:-translate-y-1"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = primaryImage || '/placeholder.png';
                            }}
                          />
                          <img
                            src={hoverImage}
                            alt={`${product.name} alternate angle`}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 group-hover/card:opacity-100 scale-95 group-hover/card:scale-105 group-hover/card:-translate-y-1.5 transition-all duration-500 ease-out drop-shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={primaryImage}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-contain p-2 transition-all duration-500 ease-out group-hover/card:opacity-0 group-hover/card:scale-95"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = primaryImage || '/placeholder.png';
                            }}
                          />
                          <img
                            src={primaryImage}
                            alt={`${product.name} alternate view`}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 group-hover/card:opacity-100 transition-all duration-500 ease-out transform scale-95 -scale-x-95 group-hover/card:scale-105 group-hover/card:-scale-x-105 group-hover/card:-rotate-3 group-hover/card:-translate-y-1.5 drop-shadow-md"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Bottom: Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      {/* Title */}
                      <Link
                        to={`/product/${product.slug || prodId}`}
                        className="block text-xs sm:text-sm font-bold text-slate-900 group-hover/card:text-amber-600 transition-colors line-clamp-2 leading-snug min-h-[38px]"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Price Section */}
                      <div className="mt-2 flex items-baseline gap-2 min-h-[20px]">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {hasSizes ? `From INR.${formattedPrice}` : `INR.${formattedPrice}`}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs font-medium text-slate-400 line-through">
                            INR.{Number(product.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Star Ratings */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex text-[#ea580c] text-xs sm:text-[13px] gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`shrink-0 ${
                                i < Math.floor(product.rating || 5) ? 'text-[#ea580c]' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {ratingVal}
                        </span>
                      </div>
                    </div>

                    {/* Choose Options Button */}
                    <Link
                      to={`/product/${product.slug || prodId}`}
                      className="w-full mt-1 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-md text-center transition-all duration-200 shadow-xs active:scale-[0.98] flex items-center justify-center bg-black hover:bg-neutral-800 text-white tracking-wide"
                    >
                      Choose Options
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next helmets"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
            >
              <FiChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </Container>
    </section>
  );
};

export default TrendingHelmetPicks;
