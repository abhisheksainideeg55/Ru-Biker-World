import React, { useEffect } from 'react';
import Container from '../../components/common/Container';
import { setPageMeta } from '../../utils/seo';

export const WholesalePage = () => {
  useEffect(() => {
    setPageMeta({
      title: 'RU BIKER WORLD WHOLESALE – Wholesale Price | Bulk Motorcycle Spares & Accessories',
      description:
        'Welcome to RU Biker World Wholesale Network. Get a wide range of spare parts and accessories now at discounted price on bulk purchase.',
      canonical: window.location.origin + '/pages/wholesale-price',
    });
    window.scrollTo(0, 0);
  }, []);

  const handleScrollDown = () => {
    window.open('https://surveyheart.com/form/642332259aba4b07ab0985af', '_blank');
  };

  return (
    <div className="min-h-[75vh] bg-white text-slate-900 pb-20 font-sans">
      <Container size="wide" className="px-4 sm:px-8 lg:px-12">
        {/* Top Header */}
        <div className="pt-8 pb-8 sm:pt-12 sm:pb-12 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight uppercase text-black font-sans">
            RU BIKER WORLD WHOLESALE
          </h1>
        </div>

        {/* Main 2-Column Wholesale Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: Official RU Biker World Wholesale Banner Card with handshake.png */}
          <div className="lg:col-span-7 bg-[#fbfbfc] border border-slate-200/90 rounded-none sm:rounded-sm p-6 sm:p-8 shadow-xs relative overflow-hidden">
            {/* Background Circuit lines / nodes decal */}
            <div className="absolute right-0 top-0 w-2/3 h-full opacity-[0.07] pointer-events-none bg-[radial-gradient(#0f243c_1.5px,transparent_1.5px)] [background-size:18px_18px]" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              {/* Left Handshake Image */}
              <div className="shrink-0 w-36 sm:w-44 flex items-center justify-center pt-1">
                <img
                  src="/handshake.png"
                  alt="RU Biker World Wholesale Partnership"
                  className="w-full h-auto max-w-[170px] drop-shadow-sm select-none"
                />
              </div>

              {/* Right Banner Content */}
              <div className="flex-1 text-center sm:text-left">
                {/* Brand Header */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="text-xl sm:text-2xl lg:text-[28px] font-black text-[#f97316] tracking-tight">
                    RU BIKER WORLD
                  </span>
                  <span className="text-xl sm:text-2xl lg:text-[28px] font-black text-[#0f243c] tracking-tight">
                    WHOLESALE
                  </span>
                </div>

                {/* Subtitle / Bullets */}
                <p className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-tight leading-relaxed mb-2">
                  GET A WIDE RANGE OF SPARE PARTS AND ACCESSORIES NOW AT DISCOUNTED PRICE ON BULK PURCHASE .
                </p>

                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-tight mb-4">
                  FILL THE FORM BELOW ONE OF OUR AGENT WILL GET IN TOUCH WITH YOU SHORTLY .
                </p>

                {/* Scroll Down Button */}
                <button
                  type="button"
                  onClick={handleScrollDown}
                  className="inline-block bg-[#0f243c] hover:bg-[#183659] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-6 py-2 rounded-full shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  SCROLL DOWN
                </button>

                {/* Tagline */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <span className="text-xs sm:text-sm font-black text-[#0f243c] tracking-wider uppercase block">
                    BUSINESS BANAYE ASAAN
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Contact Footer line */}
            <div className="mt-6 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight">
              <a href="mailto:support@rubikerworld.com" className="hover:text-brand-600 transition-colors">
                SUPPORT@RUBIKERWORLD.COM
              </a>
              <a href="https://rubikerworld.com" className="hover:text-brand-600 transition-colors">
                WWW.RUBIKERWORLD.COM
              </a>
              <a href="tel:+918105003848" className="hover:text-brand-600 transition-colors">
                +91 8105 00 3848
              </a>
            </div>
          </div>

          {/* Right Column: Welcome Text & Contact Us Button */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 px-2">
            <h2 className="text-base sm:text-lg font-normal text-slate-800 leading-snug">
              Welcome to RU Biker World Wholesale Network .
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
              Kindly fill the form attached below , one of our agents will contact you shortly .
            </p>
            <div className="pt-2">
              <a
                href="https://surveyheart.com/form/642332259aba4b07ab0985af"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#121212] hover:bg-black text-white text-sm font-medium px-8 py-2.5 rounded-md shadow-xs hover:shadow transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default WholesalePage;
