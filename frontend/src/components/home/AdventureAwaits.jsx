import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import Container from '../common/Container';
import { productService } from '../../services/productService';
import { useCart } from '../../hooks/useCart';

export const AdventureAwaits = () => {
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
    const loadProtectionAndGuards = async () => {
      try {
        const res = await productService.getProducts({
          category: 'Protection & Guards',
          limit: 50,
        });

        const rawList = res?.products || [];

        // Strict filter: only items whose category is 'Protection & Guards'
        const dbProtectionGuards = rawList.filter((p) => {
          const cat = (p.category || '').toLowerCase().trim();
          return cat === 'protection & guards' || cat === 'protection';
        });

        if (isMounted) {
          setProducts(dbProtectionGuards);
        }
      } catch (e) {
        console.warn('Failed to load Protection & Guards products from MongoDB:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProtectionAndGuards();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const prodId = product.id || product._id || product.slug;
      setAddedItems((prev) => ({ ...prev, [prodId]: true }));
      if (addToCart) {
        await addToCart(product, 1, null, true);
      }
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [prodId]: false }));
      }, 1500);
    } catch (err) {
      console.error('Failed to add guard to cart:', err);
      const prodId = product.id || product._id || product.slug;
      setAddedItems((prev) => ({ ...prev, [prodId]: false }));
    }
  };

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-white select-none border-b border-slate-100">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#111111] tracking-tight font-sans">
            Adventure Awaits
          </h2>
          <Link
            to="/shop?category=protection"
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
              aria-label="Previous adventure items"
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
              const isAdded = !!addedItems[prodId];
              const primaryImage = product.image || (Array.isArray(product.images) && product.images[0]) || '';
              
              let hoverImage = null;
              if (Array.isArray(product.images) && product.images.length > 0) {
                hoverImage = product.images.find(
                  (img) => (typeof img === 'string' ? img : img?.url) !== primaryImage
                );
                if (!hoverImage && product.images[0] !== primaryImage) {
                  hoverImage = product.images[0];
                }
                if (hoverImage && typeof hoverImage === 'object') {
                  hoverImage = hoverImage.url || hoverImage.image;
                }
              }

              return (
                <div
                  key={prodId}
                  className="flex-none w-[240px] sm:w-[265px] md:w-[280px] lg:w-[290px] border-r border-slate-200 last:border-r-0 flex flex-col justify-between bg-white group/card hover:bg-slate-50/40 transition-colors duration-200"
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
                            alt={`${product.name} alternate view`}
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
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs font-medium text-slate-400 line-through">
                            ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex text-amber-500 text-xs sm:text-[13px] gap-0.5">
                          {[...Array(Math.floor(product.rating || 5))].map((_, i) => (
                            <FaStar key={i} className="shrink-0" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {Number(product.rating || 5).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Add To Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      aria-label={`Add ${product.name} to cart`}
                      className={`w-full mt-1 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-md text-center transition-all duration-200 shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#111111] hover:bg-black text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <FiCheck className="w-4 h-4 stroke-[3]" />
                          Added to Cart
                        </>
                      ) : (
                        'Add To Cart'
                      )}
                    </button>
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
              aria-label="Next adventure items"
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

export default AdventureAwaits;
