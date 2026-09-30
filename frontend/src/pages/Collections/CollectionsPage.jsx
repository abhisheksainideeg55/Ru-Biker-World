import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import { collectionsData } from '../../data/collectionsData';
import { setPageMeta } from '../../utils/seo';

// 1. Custom Fog Lamps Banner matching Screenshot 1 & 2 (Rider with dual yellow glowing fog lights at night)
const FogLampsBanner = () => (
  <div className="w-full h-full relative overflow-hidden bg-[#0d130e] flex items-center justify-center">
    {/* Forest Road Night Background */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `radial-gradient(ellipse at 30% 60%, rgba(253, 224, 71, 0.45) 0%, rgba(234, 179, 8, 0.2) 30%, transparent 65%), url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85')`,
        backgroundPosition: 'center 40%',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

    {/* Dual Glowing Yellow Fog Beams */}
    <div className="relative z-10 flex flex-col items-center">
      {/* Bike with Rider & Intense Yellow Projector Beams */}
      <div className="relative flex items-center justify-center">
        {/* Left Fog Lamp Glow */}
        <div className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-amber-400 blur-md opacity-95 animate-pulse" />
        <div className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white blur-xs" />

        {/* Right Fog Lamp Glow */}
        <div className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-amber-400 blur-md opacity-95 animate-pulse" />
        <div className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white blur-xs" />

        {/* Silhouette / Center Headlight */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-200/90 blur-xs border border-white/60 shadow-[0_0_35px_rgba(250,204,21,1)]" />
      </div>

      {/* Road Light Cast */}
      <div className="w-48 sm:w-64 h-8 bg-amber-400/40 blur-xl rounded-full mt-4" />
    </div>

    {/* Top Right Tag */}
    <div className="absolute top-3 right-3 z-10 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-md">
      Dual Yellow LED
    </div>
  </div>
);

// 2. Custom brand collage for Performance Parts card matching exact RU BIKER world layout (Screenshot 1 & 2)
const PerformancePartsBanner = () => (
  <div className="w-full h-full bg-white p-4 sm:p-6 flex flex-col justify-between items-center select-none border border-slate-100">
    <div className="w-full grid grid-cols-2 items-center gap-4 pt-1">
      {/* Red Rooster Performance */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black italic text-red-600 tracking-tighter">R</span>
          <div className="text-left">
            <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 uppercase tracking-tighter leading-none">
              Red Rooster Performance
            </div>
            <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              Power at Play
            </div>
          </div>
        </div>
      </div>

      {/* RCB */}
      <div className="flex items-center justify-center">
        <div className="bg-red-600 px-3.5 py-1 rounded-sm text-white font-black italic tracking-widest text-base sm:text-lg shadow-xs">
          RCB
        </div>
      </div>
    </div>

    {/* Middle row: FuelX & BMC */}
    <div className="w-full grid grid-cols-2 items-center gap-4 py-2">
      {/* FuelX */}
      <div className="flex flex-col items-center justify-center">
        <div className="border-2 border-slate-900 px-3 py-0.5 rounded font-black text-xs sm:text-sm tracking-tight text-slate-900 bg-white shadow-xs">
          FUEL<span className="text-amber-500">X</span>
        </div>
        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
          AUTOTUNE
        </span>
      </div>

      {/* BMC Air Filter */}
      <div className="flex items-center justify-center">
        <div className="border border-red-600 rounded-full px-3 py-1 text-center bg-white shadow-xs">
          <span className="text-xs sm:text-sm font-black text-red-600 tracking-tight">BMC</span>
          <span className="block text-[7px] font-extrabold text-slate-800 uppercase tracking-tight">
            Air Filter
          </span>
        </div>
      </div>
    </div>

    {/* Bottom row: NGK, Dr.Pulley, Way2speed */}
    <div className="w-full grid grid-cols-3 items-center gap-2 pb-1 border-t border-slate-100 pt-2">
      {/* NGK */}
      <div className="text-center">
        <span className="text-xs sm:text-sm font-black text-red-600 tracking-tight block">NGK</span>
        <span className="text-[7px] font-extrabold text-slate-800 tracking-tighter block uppercase">
          Spark Plugs
        </span>
      </div>

      {/* Dr.Pulley */}
      <div className="text-center">
        <span className="text-xs sm:text-sm font-black text-red-600 italic tracking-tight">
          Dr.Pulley
        </span>
      </div>

      {/* way2speed */}
      <div className="text-center">
        <span className="text-[11px] sm:text-xs font-black italic text-blue-900 tracking-tight">
          way2speed
        </span>
      </div>
    </div>
  </div>
);

// 3. Custom banner for Chain & Sprocket matching exact Rolon banner in Screenshot 1 & 2
const ChainSprocketBanner = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
    {/* Dark background with bike & golden chain texture */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-500"
      style={{
        backgroundImage: `radial-gradient(circle at right, rgba(234, 179, 8, 0.25) 0%, transparent 60%), url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85')`,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

    {/* Top left Rolon branding */}
    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5">
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-red-500 flex items-center justify-center bg-black/50 shadow-sm">
        <span className="text-red-500 font-black text-[10px]">R</span>
      </div>
      <div>
        <span className="text-red-500 font-black text-xs sm:text-sm tracking-widest block uppercase">
          ROLON
        </span>
        <span className="text-[7px] text-white font-bold tracking-widest block uppercase">
          Chain & Sprocket Kit
        </span>
      </div>
    </div>

    {/* Center Red Banner */}
    <div className="relative z-10 bg-red-600/95 text-white px-4 sm:px-6 py-1.5 sm:py-2 text-center shadow-lg font-black uppercase text-xs sm:text-sm tracking-wider">
      Motorbike Chain & Sprocket Kit
    </div>

    {/* Bottom Right OEM Badge */}
    <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight shadow-md">
      <span>#1 OEM Chain</span>
    </div>
  </div>
);

// 4. Custom Brake Pad Banner matching Screenshot 5
const BrakePadBanner = () => (
  <div className="w-full h-full relative overflow-hidden bg-neutral-100 flex items-center justify-center p-4">
    <img
      src="/vesrah_1_4357e343-0110-4935-81bb-1f9ae0167c94_jpg.webp"
      alt="Brake pad"
      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
      onError={(e) => {
        e.target.src = '/VESRAHBRAKEPADSINDIA_4b61ce84-22dd-413b-9142-02aa248c92e3.png';
      }}
    />
    <div className="absolute bottom-2.5 left-3 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[9px] font-bold">
      Sintered High Bite
    </div>
  </div>
);

// 5. Custom Hazard Flasher Banner matching Screenshot 10
const HazardFlasherBanner = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-950 flex flex-col justify-between p-4 text-white">
    <div className="flex items-center justify-between z-10">
      <div className="bg-red-600 px-2 py-0.5 text-[10px] font-black italic tracking-widest">
        FLASH X
      </div>
      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
        60 Patterns
      </span>
    </div>

    <div className="relative z-10 my-auto text-center">
      <div className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
        Hazard Flash Module
      </div>
      <div className="text-[9px] text-slate-300 font-semibold mt-0.5">
        Plug & Play • No Wire Cutting
      </div>
    </div>

    <div className="flex items-center justify-between text-[8px] text-slate-400 z-10 border-t border-white/10 pt-1.5">
      <span>• Waterproof</span>
      <span>• Auto Cancel</span>
      <span>• 1 Year Warranty</span>
    </div>
  </div>
);

export const CollectionsPage = () => {
  useEffect(() => {
    setPageMeta({
      title: 'Collections – RU BIKER world | Bike Accessories & Genuine Spare Parts',
      description:
        'Explore all motorcycle collections from RU BIKER world. Browse Fog lamps, Performance parts, Chain sprocket, Goggles, Helmets, Riding Boots, Gloves, Jackets, Intercoms, and more.',
      canonical: window.location.origin + '/collections',
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <Container size="wide" className="px-4 sm:px-8 lg:px-12">
        {/* Page Heading */}
        <div className="pt-6 pb-6 sm:pt-10 sm:pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-black tracking-tight font-sans">
            Collections
          </h1>
        </div>

        {/* 3-Column Collections Grid matching RU BIKER world exact screenshots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-12">
          {collectionsData.map((collection) => {
            const isFog = collection.isFogLamps || collection.id === 'fogg-lamps';
            const isPerformance = collection.id === 'performance-parts' || collection.isBrandGrid;
            const isChain = collection.id === 'chain-sprocket' || collection.isChainSprocket;
            const isBrakePad = collection.isBrakePad || collection.id === 'brake-pad';
            const isHazard = collection.isHazardFlasher || collection.id === 'hazard-flasher';

            return (
              <Link
                key={collection.id}
                to={collection.link || `/collections/${collection.slug}`}
                className="group block"
              >
                {/* Image / Banner Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shadow-xs border border-slate-100/80">
                  {isFog ? (
                    <FogLampsBanner />
                  ) : isPerformance ? (
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                      <PerformancePartsBanner />
                    </div>
                  ) : isChain ? (
                    <ChainSprocketBanner />
                  ) : isBrakePad ? (
                    <BrakePadBanner />
                  ) : isHazard ? (
                    <HazardFlasherBanner />
                  ) : (
                    <img
                      src={collection.image}
                      alt={collection.title}
                      loading="lazy"
                      onError={(e) => {
                        if (collection.fallbackImage) {
                          e.target.src = collection.fallbackImage;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Collection Title Below Image */}
                <div className="mt-3 sm:mt-4 text-center">
                  <h2 className="text-[15px] sm:text-[17px] font-medium text-black group-hover:underline transition-all tracking-tight font-sans">
                    {collection.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default CollectionsPage;
