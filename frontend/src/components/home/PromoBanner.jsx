import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiSliders, FiShield, FiTrendingUp } from 'react-icons/fi';
import Container from '../common/Container';
import Button from '../common/Button';

export const PromoBanner = () => {
  return (
    <section className="py-12 sm:py-16 bg-surface-950 text-white border-y border-surface-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/40 px-3.5 py-1 rounded-full text-brand-400 text-xs font-black uppercase tracking-wider">
              <FiZap className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>Performance Series 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
              UPGRADE YOUR RIDE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-400 to-orange-400">
                UNLEASH PEAK MOTORCYCLE PERFORMANCE
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Performance exhausts, race air filters, quickshifters, and ECU tuners engineered for better throttle response, agility, and pure riding confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/shop?category=performance" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  icon={FiArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto shadow-glow py-3 px-6 text-sm font-black"
                >
                  Shop Performance Parts
                </Button>
              </Link>
              <Link to="/offers" className="w-full sm:w-auto">
                <Button
                  variant="darkOutline"
                  size="lg"
                  className="w-full sm:w-auto py-3 px-6 text-sm font-black"
                >
                  View Special Bundles
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: High-tech Graphic Display Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-tr from-surface-900 to-surface-800 border border-surface-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-surface-700 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">Dyno-Tested Specs</span>
                </div>
                <span className="text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full">
                  Up to +12% BHP
                </span>
              </div>

              {/* Spec Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-surface-950/80 p-3.5 rounded-xl border border-surface-800">
                  <FiSliders className="w-5 h-5 text-brand-400 mb-1.5" />
                  <p className="text-xs text-slate-400">Exhaust Flow</p>
                  <p className="text-sm font-black text-white">+28% CFM</p>
                </div>
                <div className="bg-surface-950/80 p-3.5 rounded-xl border border-surface-800">
                  <FiTrendingUp className="w-5 h-5 text-emerald-400 mb-1.5" />
                  <p className="text-xs text-slate-400">Throttle Latency</p>
                  <p className="text-sm font-black text-white">-45ms Delay</p>
                </div>
                <div className="bg-surface-950/80 p-3.5 rounded-xl border border-surface-800">
                  <FiShield className="w-5 h-5 text-amber-400 mb-1.5" />
                  <p className="text-xs text-slate-400">Build Material</p>
                  <p className="text-sm font-black text-white">Titanium / CNC</p>
                </div>
                <div className="bg-surface-950/80 p-3.5 rounded-xl border border-surface-800">
                  <FiZap className="w-5 h-5 text-blue-400 mb-1.5" />
                  <p className="text-xs text-slate-400">ECU Mapping</p>
                  <p className="text-sm font-black text-white">Plug & Play</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Direct bolt-on fitment. No permanent wire-splicing or engine modifications required.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PromoBanner;
