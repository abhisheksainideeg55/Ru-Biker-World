import React, { useState } from 'react';
import { 
  FiDisc, 
  FiSliders, 
  FiSun, 
  FiShield, 
  FiCpu, 
  FiZap, 
  FiPackage, 
  FiDroplet 
} from 'react-icons/fi';
import { GiFullMotorcycleHelmet, GiGloves } from 'react-icons/gi';

const categoryFallbackImages = {
  brake: '/VESRAHBRAKEPADSINDIA_4b61ce84-22dd-413b-9142-02aa248c92e3.png',
  chain: '/pixelcut-export-1706879783088_0c261b8f-a72c-4744-9feb-c902c005da92.png',
  light: '/lgpauxlights_0c17dc83-d563-4775-af90-0e62a61221d2.png',
  guard: '/Screenshot2025-03-05at3.53.25PM-Photoroom.png',
  filter: '/03.BMCFM01070_03.webp',
  charger: '/MAD-Ac-20-2.webp',
  bag: '/motowolfbag.png',
  oil: '/WhatsAppImage2024-09-07at15.25.08-Photoroom.png',
  plug: '/ngk_iridium_spark_plug_set_for_re_interceptor_650_continental_gt650_8610e3bb-2746-4759-93f2-2fbfefe3e00f.jpg',
  cover: '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png',
  exhaust: '/REDROOSTERPERFORMANCE-1_9f96c4f3-b735-484c-9c9c-5db50657635a.jpg',
  helmet: '/UNICOLOR-5-2-1.webp',
  lever: '/BMW-310-GS-Offroad-Footpegs.webp',
  goggles: '/BLUE-GOOGLES-1.png',
  default: '/VESRAHBRAKEPADSINDIA_4b61ce84-22dd-413b-9142-02aa248c92e3.png',
};

const iconTypeMap = {
  brake: FiDisc,
  chain: FiSliders,
  light: FiSun,
  guard: FiShield,
  filter: FiCpu,
  charger: FiZap,
  bag: FiPackage,
  oil: FiDroplet,
  plug: FiZap,
  cover: FiShield,
  exhaust: FiSliders,
  helmet: GiFullMotorcycleHelmet,
  lever: FiSliders,
};

export const ProductImage = ({
  src,
  alt,
  iconType = 'brake',
  className = '',
  imgClassName = '',
  imgStyle = {},
  aspectRatio = 'aspect-square',
}) => {
  const [hasError, setHasError] = useState(false);
  const [hasFallbackError, setHasFallbackError] = useState(false);
  const Icon = iconTypeMap[iconType] || FiDisc;

  const fallbackSrc = categoryFallbackImages[iconType] || categoryFallbackImages.default;
  const activeImage = src && !hasError ? src : (!hasFallbackError ? fallbackSrc : null);

  return (
    <div
      className={`relative w-full ${aspectRatio} bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden p-4 select-none ${className}`}
    >
      {/* Subtle technical background grid */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]" />

      {activeImage ? (
        <img
          src={activeImage}
          alt={alt || 'Motorcycle part'}
          loading="lazy"
          onError={() => {
            if (!hasError && src) {
              setHasError(true);
            } else {
              setHasFallbackError(true);
            }
          }}
          style={imgStyle}
          className={`relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${imgClassName}`}
        />
      ) : (
        /* Neutral technical product icon centerpiece fallback */
        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-card border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:scale-105 group-hover:text-brand-600 group-hover:border-brand-300 transition-all duration-300">
          <Icon className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300" />
        </div>
      )}
    </div>
  );
};

export default ProductImage;
