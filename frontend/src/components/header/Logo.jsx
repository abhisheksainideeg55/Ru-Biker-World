import React from 'react';
import { Link } from 'react-router-dom';
import { FaMotorcycle } from 'react-icons/fa6';

export const Logo = ({
  size = 'md',
  showTagline = true,
  className = '',
  light = false,
}) => {
  return (
    <Link to="/" className={`inline-flex items-center select-none group ${className}`}>
      {/* RU BIKER world Brand Container */}
      <div className="relative flex items-center">
        {/* Crimson Racing Brand Box */}
        <div className="bg-[#c81e2b] text-white px-3.5 py-2 rounded-lg flex flex-col justify-center shadow-xs border border-[#9f1220] min-w-[125px]">
          <span className="font-black text-xl tracking-tight leading-none uppercase text-white font-sans">
            RU BIKER WORLD
          </span>
          <span className="text-[6.5px] tracking-widest text-sky-200 uppercase font-bold mt-0.5 leading-none">
            Spares • Gear • Accessories
          </span>
        </div>

        {/* Motorcycle Rider Icon Overlap */}
        <div className="w-10 h-10 rounded-full bg-white border-[2.5px] border-[#00a2e8] shadow-md flex items-center justify-center -ml-3 z-10 text-slate-900 group-hover:scale-105 group-hover:rotate-[-6deg] transition-all duration-200">
          <FaMotorcycle className="text-xl text-[#c81e2b]" />
        </div>
      </div>
    </Link>
  );
};

export default Logo;
