import React from 'react';
import { Link } from 'react-router-dom';

export const accessoriesCatalog = [
  // Row 1
  {
    category: 'Bike protection',
    items: [
      { name: 'Radiator grills', slug: 'radiator-grills' },
      { name: 'Crash guard', slug: 'crash-guard' },
      { name: 'Frame sliders', slug: 'frame-sliders' },
      { name: 'side stand extenders', slug: 'side-stand-extenders' },
      { name: 'Headlight grill', slug: 'headlight-grill' },
      { name: 'Bash plate / Sump guard', slug: 'bash-plate-sump-guard' },
      { name: 'Fluid tank cap', slug: 'fluid-tank-cap' },
      { name: 'Tyre hugger', slug: 'tyre-hugger' },
      { name: 'Screen gaurd', slug: 'screen-guard' },
      { name: 'Top rack', slug: 'top-rack' },
      { name: 'Saddle stay', slug: 'saddle-stay' },
    ],
  },
  {
    category: 'Performance parts',
    items: [
      { name: 'Performance air filter', slug: 'performance-air-filter' },
      { name: 'Performance Exhaust', slug: 'performance-exhaust' },
      { name: 'Iridium Spark Plug', slug: 'iridium-spark-plug' },
      { name: 'FuelX', slug: 'fuelx' },
      { name: 'PowerTRONICS', slug: 'powertronics' },
    ],
  },
  {
    category: 'Luggage',
    items: [
      { name: 'Tail Bags', slug: 'tail-bags' },
      { name: 'Tank Bags', slug: 'tank-bags' },
      { name: 'Saddle Bags', slug: 'saddle-bags' },
      { name: 'Backpacks & Riding Bags', slug: 'backpacks-riding-bags' },
      { name: 'Leg Bags', slug: 'leg-bags' },
      { name: 'Tool Bags', slug: 'tool-bags' },
      { name: 'Waterproof Luggage & Dry Bags', slug: 'waterproof-luggage-dry-bags' },
      { name: 'Luggage Covers', slug: 'luggage-covers' },
      { name: 'Tank Bag Mounts', slug: 'tank-bag-mounts' },
      { name: 'Top Box Mounting Plates', slug: 'top-box-mounting-plates' },
    ],
  },
  {
    category: 'Braking',
    items: [
      { name: 'Ceramic brake pads', slug: 'ceramic-brake-pads' },
      { name: 'Sintered brake pads', slug: 'sintered-brake-pads' },
    ],
  },
  {
    category: 'Helmet',
    items: [
      { name: 'Motocross helmet', slug: 'motocross-helmet' },
      { name: 'Flip up helmet', slug: 'flip-up-helmet' },
      { name: 'Full face helmet', slug: 'full-face-helmet' },
      { name: 'Half face helmet', slug: 'half-face-helmet' },
      { name: 'Retro Helmet', slug: 'retro-helmet' },
    ],
  },
  {
    category: 'Handle parts',
    items: [
      { name: 'Handlebar', slug: 'handlebar' },
      { name: 'Handlebar holder', slug: 'handlebar-holder' },
      { name: 'Handle risers', slug: 'handle-risers' },
      { name: 'lever guard', slug: 'lever-guard' },
      { name: 'Grip set', slug: 'grip-set' },
      { name: 'Hand guard', slug: 'hand-guard' },
    ],
  },

  // Row 2
  {
    category: 'Bike essentials',
    items: [
      { name: 'Windshield', slug: 'windshield' },
      { name: 'windshield extenders', slug: 'windshield-extenders' },
      { name: 'Traction pads', slug: 'traction-pads' },
      { name: 'Mobile holder', slug: 'mobile-holder' },
    ],
  },
  {
    category: 'Rider protection',
    items: [
      { name: 'Gloves', slug: 'gloves' },
      { name: 'Riding jacket', slug: 'riding-jacket' },
      { name: 'Cap', slug: 'cap' },
      { name: 'Face Mask', slug: 'face-mask' },
      { name: 'Boots', slug: 'boots' },
    ],
  },
  {
    category: 'Helmet accessories',
    items: [
      { name: 'Goggles', slug: 'goggles' },
      { name: 'Intercom', slug: 'intercom' },
    ],
  },
  {
    category: 'Lights and electronics',
    items: [
      { name: 'LED auxiliary lights', slug: 'led-auxiliary-lights' },
      { name: 'Carplay', slug: 'carplay' },
      { name: 'Hazard flasher', slug: 'hazard-flasher' },
      { name: 'Fuel X', slug: 'fuel-x' },
      { name: 'GPS tracker', slug: 'gps-tracker' },
      { name: 'Tyre inflator', slug: 'tyre-inflator' },
    ],
  },
  {
    category: 'Toy',
    items: [
      { name: 'Miniature helmet', slug: 'miniature-helmet' },
      { name: 'Scale model motorcycle', slug: 'scale-model-motorcycle' },
    ],
  },
  {
    category: 'Apparels',
    items: [
      { name: 'Jersey Set', slug: 'jersey-set' },
      { name: 'Cap', slug: 'cap' },
      { name: 'Socks', slug: 'socks' },
    ],
  },
];

export const AccessoriesMegaMenu = ({ onClose }) => {
  return (
    <div
      id="accessories-mega-menu"
      role="region"
      aria-label="Shop By Accessories Mega Menu"
      className="w-full bg-white border-t border-b border-slate-200 shadow-2xl pt-7 pb-16 px-6 lg:px-12 z-50 animate-fadeIn max-h-[calc(100vh-180px)] overflow-y-auto overscroll-contain"
      style={{
        scrollbarGutter: 'stable',
        scrollbarWidth: 'thin',
        scrollbarColor: '#94a3b8 #f1f5f9',
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-7 pb-8">
        {accessoriesCatalog.map((group, idx) => {
          const categorySlug = group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <div key={idx} className="space-y-1.5">
              <h4 className="font-bold text-[13px] text-slate-900 tracking-wide uppercase mb-2">
                <Link
                  to={`/collections/${categorySlug}`}
                  onClick={onClose}
                  className="hover:underline hover:text-black"
                >
                  {group.category}
                </Link>
              </h4>
              <ul className="space-y-1">
                {group.items.map((item, iIdx) => (
                  <li key={iIdx}>
                    <Link
                      to={`/collections/${item.slug}`}
                      onClick={onClose}
                      className="text-[13px] text-slate-700 hover:text-black hover:underline block leading-snug transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccessoriesMegaMenu;
