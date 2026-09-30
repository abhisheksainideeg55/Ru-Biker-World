import React from 'react';
import Container from '../common/Container';

export const SnapmintBanner = () => {
  return (
    <section className="bg-gradient-to-r from-[#000000] via-[#E0937A] to-[#070b09] from-25% via-50% to-75% text-white py-2.5 sm:py-3.5 border-t border-b border-[#1a2920] select-none overflow-x-auto scrollbar-none">
      <Container size="wide">
        <div className="flex items-center justify-between min-w-max lg:min-w-0 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-[#1f3328]">

          {/* 1. Pay in 3 Title */}
          <div className="flex flex-col justify-center lg:pr-6 py-1 shrink-0">
            <h3 className="text-sm sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-tight font-sans whitespace-nowrap">
              Pay in 3 - No Extra Cost
            </h3>
            <p className="text-[11px] sm:text-sm lg:text-base font-extrabold text-[#00e676] mt-0.5 tracking-wide whitespace-nowrap">
              A smarter way to shop
            </p>
          </div>

          {/* 2. 0% EMI */}
          <div className="flex items-center gap-2 sm:gap-3 lg:px-6 py-1 shrink-0">
            <div className="flex items-baseline font-black text-xl sm:text-3xl lg:text-4xl text-white tracking-tighter">
              <span>0</span>
              <span className="text-xs sm:text-base lg:text-lg font-bold text-[#00e676] ml-0.5">%</span>
            </div>
            <div className="flex flex-col text-[10px] sm:text-xs lg:text-sm font-bold leading-snug">
              <span className="text-white text-xs sm:text-sm lg:text-base font-bold whitespace-nowrap">0% EMI</span>
              <span className="text-slate-300 font-normal whitespace-nowrap">No extra cost</span>
            </div>
          </div>

          {/* 3. Instant Approval */}
          <div className="flex items-center gap-2 sm:gap-3 lg:px-6 py-1 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex flex-col text-[10px] sm:text-xs lg:text-sm font-bold leading-snug">
              <span className="text-white text-xs sm:text-sm lg:text-base font-bold whitespace-nowrap">Instant</span>
              <span className="text-slate-300 font-normal whitespace-nowrap">Approval</span>
            </div>
          </div>

          {/* 4. Safe & Secure */}
          <div className="flex items-center gap-2 sm:gap-3 lg:px-6 py-1 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex flex-col text-[10px] sm:text-xs lg:text-sm font-bold leading-snug">
              <span className="text-white text-xs sm:text-sm lg:text-base font-bold whitespace-nowrap">Safe &</span>
              <span className="text-slate-300 font-normal whitespace-nowrap">Secure</span>
            </div>
          </div>

          {/* 5. Select Snapmint instructions */}
          <div className="flex flex-col justify-center lg:pl-6 py-1 max-w-[170px] sm:max-w-[210px] lg:max-w-xs text-[10px] sm:text-xs lg:text-sm text-slate-300 leading-snug shrink-0">
            <div>
              Select <strong className="text-white font-bold">Snapmint</strong> on the payment page to avail offer
            </div>
            <span className="text-[9px] sm:text-[10px] lg:text-[11px] text-slate-400 mt-0.5 font-medium">
              Powered by <strong className="text-slate-200">snapmint</strong>
            </span>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default SnapmintBanner;





