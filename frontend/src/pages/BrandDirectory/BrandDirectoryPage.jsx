import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { brandsDirectoryData } from '../../data/brandsDirectoryData';

// Custom Crisp Brand Logo Renderer that accurately reproduces the brand logos from official branding
const BrandLogo = ({ brand }) => {
  const { id, name, logoType, image, isDarkCard } = brand;

  // Custom SVG / Styled Brand Visuals
  switch (logoType) {
    case '100%':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <svg viewBox="0 0 200 120" className="w-4/5 h-auto max-h-24">
            <defs>
              <linearGradient id="g100" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <path d="M 30 10 L 190 10 L 170 60 L 10 60 Z" fill="#E11D48" />
            <path d="M 10 65 L 170 65 L 150 110 L -10 110 Z" fill="#1D4ED8" />
            <text
              x="95"
              y="72"
              textAnchor="middle"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="52"
              fontStyle="italic"
              fontWeight="900"
              fill="#FFFFFF"
              letterSpacing="-2"
            >
              100%
            </text>
          </svg>
        </div>
      );

    case 'acerbis':
      return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4">
          <svg viewBox="0 0 160 100" className="w-3/4 h-auto max-h-20">
            <path
              d="M 80 5 L 125 75 L 100 75 L 80 38 L 60 75 L 35 75 Z"
              fill="#CCFF00"
            />
            <path
              d="M 68 52 L 92 52 L 80 30 Z"
              fill="#000000"
            />
            <text
              x="80"
              y="94"
              textAnchor="middle"
              fontFamily="Arial Black, sans-serif"
              fontSize="16"
              fontWeight="900"
              fontStyle="italic"
              letterSpacing="2"
              fill="#CCFF00"
            >
              ACERBIS
            </text>
          </svg>
        </div>
      );

    case 'aoocci':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <span
            className="text-2xl sm:text-3xl font-black italic tracking-wide text-emerald-700 select-none"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            AooCCI
          </span>
        </div>
      );

    case 'barrel-exhaust':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <svg viewBox="0 0 120 50" className="w-20 h-auto mb-1">
            <path
              d="M 20 10 C 35 30 50 38 60 38 C 70 38 85 30 100 10 C 90 25 75 48 60 48 C 45 48 30 25 20 10 Z"
              fill="#111827"
            />
            <path
              d="M 50 15 L 60 5 L 70 15 L 65 30 L 55 30 Z"
              fill="#111827"
            />
          </svg>
          <span className="text-xs sm:text-sm font-black tracking-wider text-gray-900 uppercase">
            BARREL EXHAUST™
          </span>
        </div>
      );

    case 'bluarmor':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="bg-black rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-400 flex items-center justify-center">
              <span className="font-bold text-black text-sm">a</span>
            </div>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight lowercase">
              bluarmor
            </span>
          </div>
        </div>
      );

    case 'bmc':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="border-2 border-red-600 rounded-full px-4 py-1.5 flex flex-col items-center justify-center">
            <span
              className="text-2xl sm:text-3xl font-black italic text-red-600 leading-none"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              BMC
            </span>
            <span className="text-[10px] font-bold text-gray-900 tracking-wider">
              Air Filter
            </span>
          </div>
        </div>
      );

    case 'bobo-gears':
      return (
        <div className="w-full h-full flex items-center justify-center p-4 gap-2">
          <svg viewBox="0 0 40 40" className="w-8 h-8 flex-shrink-0">
            <path
              d="M 20 5 L 23 13 L 31 10 L 28 18 L 36 20 L 28 22 L 31 30 L 23 27 L 20 35 L 17 27 L 9 30 L 12 22 L 4 20 L 12 18 L 9 10 L 17 13 Z"
              fill="#111827"
            />
            <circle cx="20" cy="20" r="5" fill="#FFFFFF" />
          </svg>
          <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            bobo<sup>®</sup>
          </span>
        </div>
      );

    case 'cramster':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <span className="text-2xl sm:text-3xl font-black italic text-gray-900 tracking-tight">
            cramster<sup>®</sup>
          </span>
          <span className="text-[8px] text-gray-500 font-medium tracking-tight mt-0.5">
            India's first motorcycle travel gear brand.
          </span>
        </div>
      );

    case 'carbonado':
      return (
        <div className="w-full h-full bg-black flex items-center justify-center p-4">
          <span
            className="text-white font-bold text-sm sm:text-base tracking-[0.25em] uppercase"
            style={{ fontFamily: 'sans-serif' }}
          >
            CARBONADO
          </span>
        </div>
      );

    case 'ebc':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <span
            className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight leading-none"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            EBC<sup>®</sup>
          </span>
          <span
            className="text-xs sm:text-sm font-black text-red-600 tracking-widest mt-0.5"
            style={{ fontFamily: 'Arial Black, sans-serif' }}
          >
            BRAKES
          </span>
        </div>
      );

    case 'ejeas':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <span
            className="text-2xl sm:text-3xl font-black italic tracking-wide text-gray-900"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            EJEAS<sup>®</sup>
          </span>
        </div>
      );

    case 'fox':
      return (
        <div className="w-full h-full flex items-center justify-center p-4 gap-3">
          <span
            className="text-3xl sm:text-4xl font-black italic tracking-tighter text-gray-900"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            FOX
          </span>
          <svg viewBox="0 0 60 50" className="w-12 h-10">
            <path
              d="M 5 5 L 20 20 L 15 35 L 30 45 L 45 35 L 40 20 L 55 5 L 35 15 L 30 5 L 25 15 Z"
              fill="none"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="22" r="2.5" fill="#111827" />
            <circle cx="38" cy="22" r="2.5" fill="#111827" />
            <polygon points="30,32 26,38 34,38" fill="#111827" />
          </svg>
        </div>
      );

    case 'fuel-x':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="border border-gray-300 rounded-lg p-2.5 flex flex-col items-center bg-gray-50/50">
            <div className="flex items-baseline">
              <span className="text-2xl font-black italic tracking-tight text-gray-900 font-sans">
                FUEL
              </span>
              <span className="text-2xl font-black italic tracking-tight text-red-600 font-sans">
                X
              </span>
              <span className="text-[9px] font-bold text-gray-500 ml-0.5">™</span>
            </div>
            <div className="bg-amber-600 text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded-sm uppercase mt-0.5 w-full text-center">
              AUTOTUNE
            </div>
          </div>
        </div>
      );

    case 'gopro':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-black rounded-full flex flex-col items-center justify-center p-2 text-center shadow-sm">
            <span className="text-white font-black text-sm tracking-tight">
              GoPro
            </span>
            <span className="text-[7px] text-gray-300 font-bold uppercase tracking-wider mb-1">
              Be a HERO.
            </span>
            <div className="flex gap-0.5">
              <div className="w-2.5 h-1.5 bg-cyan-400" />
              <div className="w-2.5 h-1.5 bg-blue-500" />
              <div className="w-2.5 h-1.5 bg-cyan-300" />
            </div>
          </div>
        </div>
      );

    case 'givi':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <span
            className="text-3xl sm:text-4xl font-black italic tracking-tight text-red-600 select-none"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            GIVI<sup>®</sup>
          </span>
        </div>
      );

    case 'glosil':
      return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4">
          <svg viewBox="0 0 80 60" className="w-14 h-12 mb-1">
            <circle
              cx="40"
              cy="30"
              r="22"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="6"
              strokeDasharray="110 30"
              transform="rotate(-45 40 30)"
            />
            {/* Golden Oil drop */}
            <path
              d="M 40 20 C 40 20 47 28 47 33 C 47 37 44 40 40 40 C 36 40 33 37 33 33 C 33 28 40 20 40 20 Z"
              fill="#FBBF24"
            />
          </svg>
          <span className="text-cyan-400 font-black text-sm sm:text-base tracking-wider uppercase">
            GLOSIL<sup>®</sup>
          </span>
        </div>
      );

    case 'ht-exhaust':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-500 flex flex-col items-center justify-center p-2 shadow-inner border border-amber-500/40">
            <div className="border-2 border-red-600 px-2 py-0.5 bg-red-600/10 rounded">
              <span className="text-xl font-black text-red-600 italic">
                Ht<sup>®</sup>
              </span>
            </div>
            <span className="text-[10px] font-black text-gray-900 tracking-widest uppercase mt-1">
              EXHAUST
            </span>
          </div>
        </div>
      );

    case 'jb-racing':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl sm:text-4xl font-black italic text-orange-600 font-sans leading-none">
              J
            </span>
            <span className="text-3xl sm:text-4xl font-black italic text-gray-900 font-sans leading-none">
              b
            </span>
            <svg viewBox="0 0 30 20" className="w-6 h-4">
              <rect x="0" y="0" width="5" height="5" fill="#000" />
              <rect x="5" y="0" width="5" height="5" fill="#ccc" />
              <rect x="10" y="0" width="5" height="5" fill="#000" />
              <rect x="0" y="5" width="5" height="5" fill="#ccc" />
              <rect x="5" y="5" width="5" height="5" fill="#000" />
              <rect x="10" y="5" width="5" height="5" fill="#ccc" />
            </svg>
          </div>
          <div className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider mt-1 w-full">
            JB RACING
          </div>
          <span className="text-[7px] font-bold text-gray-700 tracking-tight mt-0.5">
            TRACK AND BEYOND
          </span>
        </div>
      );

    case 'korda':
      return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <svg viewBox="0 0 30 30" className="w-6 h-6">
              <polygon points="15,2 28,15 22,28 8,28 2,15" fill="#A3E635" />
              <polygon points="15,8 22,15 18,22 12,22 8,15" fill="#000000" />
            </svg>
            <span className="text-white font-black text-xl sm:text-2xl tracking-widest">
              KORDA
            </span>
          </div>
          <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">
            MOTORCYCLE LIFESTYLE
          </span>
        </div>
      );

    case 'kn':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-[130px]">
            <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-sm" />
            <div className="bg-gray-50 border-x border-b border-gray-200 p-2 flex flex-col items-center">
              <span
                className="text-2xl sm:text-3xl font-black italic tracking-tighter text-gray-900"
                style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
              >
                K&N<sup>®</sup>
              </span>
              <span className="text-[8px] font-black text-red-600 uppercase tracking-tight mt-0.5">
                PERFORMANCE FILTERS
              </span>
            </div>
          </div>
        </div>
      );

    case 'loboo':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
          <div className="flex items-center gap-1 text-orange-500">
            <span className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              LOBOO
            </span>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
            </svg>
          </div>
          <span className="text-[9px] font-black text-gray-900 tracking-tight mt-0.5">
            For My Motour Life
          </span>
        </div>
      );

    case 'legundary':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
          <div className="border-2 border-gray-900 px-4 py-2 rounded-sm rotate-0 relative">
            <span
              className="text-xl sm:text-2xl font-black italic text-gray-900 leading-none"
              style={{ fontFamily: 'cursive, Georgia, serif' }}
            >
              Legundary
            </span>
          </div>
          <span className="text-[8px] font-black text-gray-900 tracking-widest uppercase mt-1">
            CUSTOM BUILT
          </span>
        </div>
      );

    case 'lgp':
      return (
        <div className="w-full h-full flex items-center justify-center p-2 gap-1.5">
          <svg viewBox="0 0 40 30" className="w-10 h-8 flex-shrink-0">
            <circle cx="10" cy="22" r="6" fill="none" stroke="#111" strokeWidth="2.5" />
            <circle cx="30" cy="22" r="6" fill="none" stroke="#111" strokeWidth="2.5" />
            <path d="M10 22 L18 12 L28 12 L30 22 M18 12 L22 22 M14 8 L22 8" fill="none" stroke="#111" strokeWidth="2" />
          </svg>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-orange-600 tracking-tight leading-none">
              LGP
            </span>
            <span className="text-[6px] font-bold text-gray-700 uppercase tracking-tighter">
              LUNKAR GENUINE PARTS
            </span>
          </div>
        </div>
      );

    case 'liu-hjg':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-blue-600 tracking-tight">
              LIV
            </span>
            <span className="text-2xl font-black text-blue-800 tracking-tight">
              HJG
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[7px] font-bold text-emerald-600 uppercase">
              LIGHTING
            </span>
            <span className="text-[7px] font-bold text-emerald-600 uppercase">
              REVOLUTION
            </span>
          </div>
        </div>
      );

    case 'ngk':
      return (
        <div className="w-full h-full flex items-center justify-center p-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-600 flex flex-col items-center justify-center text-center p-2 shadow-md">
            <span
              className="text-white text-2xl font-black italic tracking-tighter"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              NGK
            </span>
            <span className="text-white text-[8px] font-black uppercase tracking-widest border-t border-white/40 pt-0.5 mt-0.5">
              SPARK PLUGS
            </span>
          </div>
        </div>
      );

    case 'ngage':
      return (
        <div className="w-full h-full flex items-center justify-center p-3">
          <div className="flex items-baseline">
            <span className="text-3xl font-black italic text-blue-600 font-sans">
              N
            </span>
            <span className="text-3xl font-black italic text-gray-800 font-sans">
              Gage
            </span>
            <span className="text-[8px] font-bold text-gray-500 ml-1 uppercase">
              POWERPARTS
            </span>
          </div>
        </div>
      );

    case 'powerage':
      return (
        <div className="w-full h-full flex items-center justify-center p-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-500 flex flex-col items-center justify-center text-center p-2 shadow-inner">
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-4 bg-red-600" />
              <div className="w-1.5 h-4 bg-red-600" />
              <span className="text-white text-xs font-black tracking-wider uppercase ml-1">
                POWERAGE
              </span>
            </div>
            <span className="text-[6px] text-gray-200 font-bold uppercase tracking-tighter mt-1">
              AUTOMOTIVE PERFORMANCE PRODUCTS
            </span>
          </div>
        </div>
      );

    case 'powertronic':
      return (
        <div className="w-full h-full flex items-center justify-center p-3">
          <div className="w-20 h-16 bg-gradient-to-br from-neutral-800 to-neutral-950 rounded-lg border border-neutral-700 shadow-md flex flex-col items-center justify-center p-2 relative">
            <div className="w-3 h-3 bg-amber-500 rounded-sm mb-1" />
            <span className="text-[8px] font-bold text-gray-300 tracking-wider">
              PowerTRONIC
            </span>
          </div>
        </div>
      );

    case 'protaper':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="bg-yellow-400 border-2 border-black rounded-lg px-3 py-1.5 flex items-center justify-center shadow-sm">
            <span
              className="text-xl sm:text-2xl font-black italic tracking-tighter text-black uppercase"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              PROTAPER
            </span>
          </div>
        </div>
      );

    case 'race-dynamics':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-8 bg-red-600 -skew-x-12" />
            <div className="w-2.5 h-8 bg-red-600 -skew-x-12" />
            <span
              className="text-3xl font-black italic text-gray-900 tracking-tighter ml-1 -skew-x-12"
              style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
            >
              RD
            </span>
          </div>
        </div>
      );

    case 'rcb':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
          <svg viewBox="0 0 40 30" className="w-12 h-9 text-red-600 fill-current">
            <path d="M10 20 C 10 10, 30 10, 30 5 C 30 2, 20 2, 15 6 L 10 2 C 18 -2, 35 -1, 35 7 C 35 15, 18 16, 18 22 L 35 22 L 35 28 L 10 28 Z" />
          </svg>
          <span className="text-xl font-black text-red-600 tracking-wider font-sans mt-0.5">
            RCB
          </span>
        </div>
      );

    case 'red-rooster':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
          <div className="flex items-center justify-center text-red-600">
            <svg viewBox="0 0 40 30" className="w-10 h-7 fill-current">
              <path d="M5 15 L20 15 L25 5 C 28 8, 35 8, 38 12 C 32 15, 30 20, 20 22 L 15 25 L 5 15 Z" />
            </svg>
            <span className="text-xl font-black italic tracking-tighter">
              R
            </span>
          </div>
          <span className="text-[8px] font-black text-gray-900 tracking-tight">
            Red Rooster Performance
          </span>
          <span className="text-[6px] font-bold text-gray-500 uppercase tracking-widest">
            POWER AT PLAY
          </span>
        </div>
      );

    case 'raida':
      return (
        <div className="w-full h-full flex items-center justify-center p-3 gap-2">
          <svg viewBox="0 0 30 30" className="w-8 h-8 text-cyan-600 fill-current">
            <circle cx="15" cy="15" r="4" />
            <path d="M15 5 C 22 5, 25 10, 25 15 C 20 15, 18 10, 15 5 Z" />
            <path d="M25 15 C 25 22, 20 25, 15 25 C 15 20, 20 18, 25 15 Z" />
            <path d="M15 25 C 8 25, 5 20, 5 15 C 10 15, 12 20, 15 25 Z" />
          </svg>
          <span className="text-2xl font-black italic text-cyan-600 tracking-tight">
            Raida
          </span>
        </div>
      );

    case 'reise':
      return (
        <div className="w-full h-full bg-amber-400 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-2xl font-black text-gray-900 tracking-tight leading-none lowercase">
            reise<span className="text-white font-bold">moto</span>
          </span>
          <span className="text-[9px] font-bold text-gray-900 tracking-tight mt-1">
            Joy of Riding
          </span>
        </div>
      );

    case 'rolon':
      return (
        <div className="w-full h-full flex items-center justify-center p-3">
          <div className="border-2 border-red-600 rounded-full px-3 py-1 flex items-center gap-1 text-red-600">
            <span
              className="text-2xl font-black tracking-wider uppercase font-sans"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              ROLON
            </span>
            <span className="text-[10px] font-bold">®</span>
          </div>
        </div>
      );

    case 'royal-enfield':
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-500 bg-amber-500 flex flex-col items-center justify-center p-1 text-center shadow-md relative overflow-hidden">
            <div className="w-full h-full rounded-full border-2 border-dashed border-red-800 bg-amber-400 flex flex-col items-center justify-center p-1">
              <span className="text-[7px] font-black text-gray-900 tracking-widest uppercase">
                ROYAL ENFIELD
              </span>
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center my-0.5 border border-amber-300 shadow-inner">
                <span className="text-amber-300 font-black text-xs italic">
                  R
                </span>
              </div>
              <span className="text-[6px] font-black text-gray-900 tracking-widest uppercase">
                SINCE 1901
              </span>
            </div>
          </div>
        </div>
      );

    case 'sena':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <span
            className="text-3xl sm:text-4xl font-black italic tracking-widest text-red-600 uppercase"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            SENA
          </span>
        </div>
      );

    case 'silver-stallion':
      return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center p-3 text-center">
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 30 20" className="w-6 h-5 fill-current text-gray-200">
              <path d="M5 18 C5 10, 15 5, 20 2 C25 2, 28 8, 25 12 C22 10, 18 12, 15 18 Z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-white font-black text-xs sm:text-sm tracking-tighter leading-none uppercase">
                SILVER
              </span>
              <span className="text-white font-black text-xs sm:text-sm tracking-tighter leading-none uppercase">
                STALLION
              </span>
            </div>
          </div>
          <span className="text-red-500 font-bold text-[7px] tracking-widest uppercase mt-0.5">
            PERFORMANCE
          </span>
          <span className="text-gray-400 text-[6px] italic mt-0.5">
            Rev Up To Conquer
          </span>
        </div>
      );

    case 'smk':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
          <span
            className="text-3xl sm:text-4xl font-black italic tracking-tight text-red-600 font-sans leading-none"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            SMK
          </span>
          <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-1">
            HELMETS
          </span>
        </div>
      );

    case 'spiki':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight lowercase">
            sp<span className="text-amber-500">i</span>ki
          </span>
        </div>
      );

    case 'taanc':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black flex items-center justify-center shadow-md">
            <svg viewBox="0 0 40 40" className="w-12 h-12 fill-current text-white">
              <path d="M 5 8 L 35 8 L 35 15 L 24 15 L 24 32 L 16 32 L 16 15 L 5 15 Z" />
            </svg>
          </div>
        </div>
      );

    case 'uma-racing':
      return (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center p-3">
          <div className="border border-purple-500/50 rounded-lg p-2 bg-gradient-to-r from-purple-950 to-indigo-950 flex items-center gap-1.5 shadow-md">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black italic text-white leading-none font-sans lowercase">
                uma
              </span>
              <span className="text-base sm:text-lg font-black italic text-red-500 leading-none font-sans uppercase">
                racing
              </span>
            </div>
            <div className="w-7 h-7 bg-blue-700 rounded-sm flex items-center justify-center text-white">
              <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
                <path d="M4 16 L10 4 L14 8 L18 16 Z" />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'vesrah':
      return (
        <div className="w-full h-full bg-amber-400 flex items-center justify-center p-4">
          <span
            className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight font-sans"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            Vesrah
          </span>
        </div>
      );

    case 'way2speed':
      return (
        <div className="w-full h-full bg-orange-600 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
          {/* Blueprint mechanical background pattern */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full opacity-25 stroke-white fill-none stroke-[0.75] pointer-events-none"
          >
            <circle cx="50" cy="50" r="35" />
            <circle cx="50" cy="50" r="22" />
            <circle cx="50" cy="50" r="8" />
            <line x1="10" y1="50" x2="90" y2="50" />
            <line x1="50" y1="10" x2="50" y2="90" />
            <rect x="25" y="25" width="50" height="50" />
            <polygon points="50,15 85,50 50,85 15,50" />
            <line x1="20" y1="20" x2="80" y2="80" />
            <line x1="80" y1="20" x2="20" y2="80" />
          </svg>
          <div className="relative z-10 flex items-center justify-center">
            <span
              className="text-xl sm:text-2xl font-black italic text-white tracking-tighter"
              style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
            >
              way2speed///
            </span>
          </div>
        </div>
      );

    default:
      if (image) {
        return (
          <div
            className={`w-full h-full flex items-center justify-center p-4 ${
              isDarkCard ? 'bg-black' : 'bg-white'
            }`}
          >
            <img
              src={image}
              alt={name}
              className="max-h-20 max-w-full object-contain filter drop-shadow-sm"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-center">
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">
                {name}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full h-full flex items-center justify-center p-4 text-center">
          <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
            {name}
          </span>
        </div>
      );
  }
};

export const BrandDirectoryPage = () => {
  const [activeLetter, setActiveLetter] = useState(null);

  // Alphabet list for jump bar
  const letters = [
    '0-9',
    'A',
    'B',
    'C',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
  ];

  const scrollToLetter = (letter) => {
    setActiveLetter(letter);
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      const yOffset = -120; // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Title */}
      <div className="pt-10 pb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Brand Directory
        </h1>
      </div>

      {/* Alphabetical Jump Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {letters.map((letter) => {
            const hasBrands = brandsDirectoryData.some((g) => g.letter === letter);
            return (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                disabled={!hasBrands}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 border ${
                  activeLetter === letter
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : hasBrands
                    ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                    : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Groups */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {brandsDirectoryData.map((group) => (
          <section
            key={group.letter}
            id={`section-${group.letter}`}
            className="scroll-mt-32"
          >
            {/* Group Header */}
            <div className="border-b border-gray-200 pb-2 mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {group.letter}
              </h2>
            </div>

            {/* Brand Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {group.brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-slate-400 hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  {/* Logo Container */}
                  <div className="h-36 sm:h-40 flex items-center justify-center overflow-hidden border-b border-gray-100">
                    <BrandLogo brand={brand} />
                  </div>

                  {/* Brand Label */}
                  <div className="py-3 px-2 text-center bg-white">
                    <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {brand.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BrandDirectoryPage;
