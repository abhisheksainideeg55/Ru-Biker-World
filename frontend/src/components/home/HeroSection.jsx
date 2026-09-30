import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import Container from '../common/Container';

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: 'RU BIKER WORLD · 2026 COLLECTION',
      headingLine1: 'CONQUER',
      headingLine2: 'EVERY TERRAIN',
      description: 'Engineered crash protection, auxiliary fog lights, performance filters & genuine spare parts built for extreme motorcycle adventures.',
      image: '/Sparify_Banner-selection.png',
      primaryBtnText: 'Shop 2026 Collection',
      primaryBtnLink: '/collections',
      secondaryBtnText: 'Explore Spares',
      secondaryBtnLink: '/shop?category=spares'
    },
    {
      id: 2,
      tag: 'PREMIUM FOG LIGHTS & LIGHTING',
      headingLine1: 'ILLUMINATE',
      headingLine2: 'YOUR NIGHT RIDE',
      description: 'Dual projector HJG fog lamps, 4-LED Mini Cree driving lights and plug-and-play wiring harnesses for all motorcycle models.',
      image: '/korda_helmets_sparify.png',
      primaryBtnText: 'Shop Fog Lamps',
      primaryBtnLink: '/shop?category=lighting',
      secondaryBtnText: 'View Collections',
      secondaryBtnLink: '/collections'
    },
    {
      id: 3,
      tag: 'GENUINE OEM & PERFORMANCE UPGRADES',
      headingLine1: 'PRECISION',
      headingLine2: 'ENGINEERED SPARES',
      description: 'Rolon brass chain kits, Brembo brake pads, BMC performance air filters and FuelX autotune modules.',
      image: '/taanc_top_box_and_panniers_india_review.png',
      primaryBtnText: 'Shop By Bike',
      primaryBtnLink: '/shop?tab=bikes',
      secondaryBtnText: 'All Collections',
      secondaryBtnLink: '/collections'
    },
    {
      id: 4,
      tag: 'GENUINE OEM & PERFORMANCE UPGRADES',
      headingLine1: 'PRECISION',
      headingLine2: 'ENGINEERED SPARES',
      description: 'Rolon brass chain kits, Brembo brake pads, BMC performance air filters and FuelX autotune modules.',
      image: '/ChatGPT_Image_Jun_13_2026_05_57_38_PM.png',
      primaryBtnText: 'Shop By Bike',
      primaryBtnLink: '/shop?tab=bikes',
      secondaryBtnText: 'All Collections',
      secondaryBtnLink: '/collections'
    },
    {
      id: 5,
      tag: 'GENUINE OEM & PERFORMANCE UPGRADES',
      headingLine1: 'PRECISION',
      headingLine2: 'ENGINEERED SPARES',
      description: 'Rolon brass chain kits, Brembo brake pads, BMC performance air filters and FuelX autotune modules.',
      image: '/e6df7fad-55d2-4660-94af-ff199260cd42.png',
      primaryBtnText: 'Shop By Bike',
      primaryBtnLink: '/shop?tab=bikes',
      secondaryBtnText: 'All Collections',
      secondaryBtnLink: '/collections'
    }
  ];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <section className="relative bg-black text-white overflow-hidden select-none">
      {/* Background Image Container */}
      <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px]">
        <img
          src={active.image}
          alt="RU BIKER world Motorcycle Adventure"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out brightness-90"
        />




        {/* Left Arrow Navigation Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-[#c81e2b] hover:text-white transition-all duration-200 z-20 cursor-pointer"
          aria-label="Previous Slide"
        >
          <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Navigation Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-[#c81e2b] hover:text-white transition-all duration-200 z-20 cursor-pointer"
          aria-label="Next Slide"
        >
          <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-8 bg-[#c81e2b]' : 'w-2 bg-white/60 hover:bg-white'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
