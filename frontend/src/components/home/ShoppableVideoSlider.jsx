import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiCheck,
  FiX,
  FiShoppingCart,
  FiVolume2,
  FiVolumeX,
} from 'react-icons/fi';
import { FaPlay, FaPause } from 'react-icons/fa';
import Container from '../common/Container';
import { shoppableVideos } from '../../data/shoppableVideos';
import { useCart } from '../../hooks/useCart';

export const ShoppableVideoSlider = () => {
  const scrollRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addedItems, setAddedItems] = useState({});

  const { addToCart, setIsDrawerOpen } = useCart();

  const activeReel =
    activeReelIndex !== null ? shoppableVideos[activeReelIndex] : null;

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

  // Handle video modal controls
  useEffect(() => {
    if (activeReel) {
      setIsPlaying(true);
      setProgress(0);
      if (videoPlayerRef.current) {
        videoPlayerRef.current.currentTime = 0;
        videoPlayerRef.current
          .play()
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeReelIndex]);

  const handleScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
      },
      1
    );

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    if (setIsDrawerOpen) setIsDrawerOpen(true);

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (!videoPlayerRef.current) return;
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    } else {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoPlayerRef.current) return;
    videoPlayerRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoPlayerRef.current) {
      const current = videoPlayerRef.current.currentTime;
      const duration = videoPlayerRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const nextReel = (e) => {
    e.stopPropagation();
    if (activeReelIndex !== null) {
      setActiveReelIndex((activeReelIndex + 1) % shoppableVideos.length);
    }
  };

  const prevReel = (e) => {
    e.stopPropagation();
    if (activeReelIndex !== null) {
      setActiveReelIndex(
        (activeReelIndex - 1 + shoppableVideos.length) % shoppableVideos.length
      );
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white select-none relative border-b border-slate-100">
      <Container size="wide">
        {/* Section Heading */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] tracking-tight font-sans">
              Watch &amp; Shop Reels
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore real rider tests, unboxings and performance reviews.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            View All Products &rarr;
          </Link>
        </div>

        {/* Carousel with Floating Navigation Arrows */}
        <div className="relative group">
          {/* Floating Left Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous reels"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <FiChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Floating Right Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next reels"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer"
            >
              <FiChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Reel Track */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1 scroll-smooth"
          >
            {shoppableVideos.map((item, index) => {
              const isAdded = !!addedItems[item.product.id];

              return (
                <div
                  key={item.id}
                  className="snap-start shrink-0 w-[240px] sm:w-[265px] md:w-[280px] flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 group"
                >
                  {/* Top Reel Thumbnail / Video Player Trigger */}
                  <div
                    onClick={() => setActiveReelIndex(index)}
                    className="relative aspect-3/4 w-full bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.videoPoster}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        if (item.videoFallback && e.target.src !== item.videoFallback) {
                          e.target.src = item.videoFallback;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Right: Views Badge */}
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/20">
                      <FiEye className="w-3.5 h-3.5" />
                      <span>{item.views}</span>
                    </div>

                    {/* Center: Play Circle Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-xs border border-white/60 flex items-center justify-center text-white shadow-lg group-hover:scale-115 group-hover:bg-white/40 transition-all duration-300">
                        <FaPlay className="w-4 h-4 ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Video Subtitle / Caption */}
                    {item.subtitle && (
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium drop-shadow-md line-clamp-1">
                        {item.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Bottom Linked Product Mini Box */}
                  <div className="p-3.5 bg-white flex flex-col justify-between gap-3 grow">
                    <div className="flex items-start gap-3">
                      {/* Square Mini Product Thumbnail */}
                      <div className="w-14 h-14 shrink-0 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 p-1 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Name & Price Details */}
                      <div className="grow min-w-0">
                        <h4
                          className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors"
                          title={item.product.name}
                        >
                          {item.product.name}
                        </h4>
                        <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-slate-900">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{item.product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          {item.product.discount && (
                            <span className="text-[10px] font-bold text-emerald-600">
                              {item.product.discount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item.product)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#111111] hover:bg-black text-white active:scale-98'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <FiCheck className="w-4 h-4 stroke-[3]" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Interactive Reel Full Video Player Modal */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none"
          onClick={() => setActiveReelIndex(null)}
        >
          {/* Modal Left Arrow for Previous Reel */}
          <button
            type="button"
            onClick={prevReel}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center backdrop-blur-sm transition"
            title="Previous video"
          >
            <FiChevronLeft className="w-7 h-7 stroke-[2.5]" />
          </button>

          {/* Modal Right Arrow for Next Reel */}
          <button
            type="button"
            onClick={nextReel}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center backdrop-blur-sm transition"
            title="Next video"
          >
            <FiChevronRight className="w-7 h-7 stroke-[2.5]" />
          </button>

          {/* Main Reel Card Container */}
          <div
            className="relative w-full max-w-[360px] sm:max-w-[400px] h-[85vh] max-h-[720px] bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-40 h-1 bg-white/20">
              <div
                className="h-full bg-brand-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Top Action Bar */}
            <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between text-white drop-shadow-md">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[11px] font-bold border border-white/20">
                  {activeReel.views} views
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <FiVolumeX className="w-4 h-4" />
                  ) : (
                    <FiVolume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveReelIndex(null)}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                  title="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* HTML5 Video Element */}
            <div
              className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer"
              onClick={togglePlayPause}
            >
              <video
                ref={videoPlayerRef}
                src={activeReel.videoUrl}
                poster={activeReel.videoPoster}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover"
              />

              {/* Centered Pause Icon Indicator when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-xl">
                    <FaPlay className="w-6 h-6 ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Shoppable Card inside video player */}
            <div className="absolute bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-md rounded-xl p-3 text-slate-900 shadow-xl border border-white/50">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeReel.product.image}
                  alt={activeReel.product.name}
                  className="w-12 h-12 rounded-lg object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                />
                <div className="grow min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {activeReel.product.name}
                  </h5>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-black text-slate-900">
                      ₹{activeReel.product.price.toLocaleString('en-IN')}
                    </span>
                    {activeReel.product.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{activeReel.product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-emerald-600">
                      {activeReel.product.discount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, activeReel.product)}
                  className="grow py-2 px-3 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FiShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  to={`/product/${activeReel.product.slug}`}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShoppableVideoSlider;
