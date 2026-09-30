import React from 'react';
import { Link } from 'react-router-dom';

export const sparesCatalog = [
  // Row 1
  {
    category: 'Service parts',
    items: [
      { name: 'Air filter', slug: 'air-filter' },
      { name: 'Oil filter', slug: 'oil-filter' },
      { name: 'Spark plug', slug: 'spark-plug' },
      { name: 'Damper rubber', slug: 'damper-rubber' },
      { name: 'Chain lube', slug: 'chain-lube' },
    ],
  },
  {
    category: 'Brake system',
    items: [
      { name: 'Brake pad', slug: 'brake-pad' },
      { name: 'Brake shoe', slug: 'brake-shoe' },
      { name: 'Brake pedal', slug: 'brake-pedal' },
      { name: 'Disc plate', slug: 'disc-plate' },
      { name: 'Master cylinder', slug: 'master-cylinder' },
      { name: 'Brake housing', slug: 'brake-housing' },
      { name: 'Brake cable', slug: 'brake-cable' },
    ],
  },
  {
    category: 'Chain Sprocket',
    items: [
      { name: 'Brass chain sprocket', slug: 'brass-chain-sprocket' },
      { name: 'Regular chain sprocket', slug: 'regular-chain-sprocket' },
      { name: 'Chain maintenance', slug: 'chain-maintenance' },
    ],
  },
  {
    category: 'Electrical parts',
    items: [
      { name: 'Stator coil', slug: 'stator-coil' },
      { name: 'Regulator rectifier', slug: 'regulator-rectifier' },
      { name: 'Speedometer', slug: 'speedometer' },
    ],
  },
  {
    category: 'Fuel system',
    items: [
      { name: 'Fuel pump motor', slug: 'fuel-pump-motor' },
      { name: 'Fuel pump assembly', slug: 'fuel-pump-assembly' },
      { name: 'Fuel cock', slug: 'fuel-cock' },
    ],
  },
  {
    category: 'Clutch parts',
    items: [
      { name: 'Clutch cable', slug: 'clutch-cable' },
      { name: 'Clutch plate', slug: 'clutch-plate' },
      { name: 'Clutch assembly', slug: 'clutch-assembly' },
      { name: 'Clutch shoe', slug: 'clutch-shoe' },
      { name: 'CVT belt', slug: 'cvt-belt' },
    ],
  },

  // Row 2
  {
    category: 'Body parts',
    items: [
      { name: 'Visor', slug: 'visor' },
      { name: 'Front shield', slug: 'front-shield' },
    ],
  },
  {
    category: 'Gear system',
    items: [
      { name: 'Gear pedal', slug: 'gear-pedal' },
    ],
  },
  {
    category: 'Fork parts',
    items: [
      { name: 'Fork oil seal', slug: 'fork-oil-seal' },
      { name: 'Shock absorber', slug: 'shock-absorber' },
    ],
  },
  {
    category: 'Lighting',
    items: [
      { name: 'Headlamp', slug: 'headlamp' },
      { name: 'Indicators', slug: 'indicators' },
    ],
  },
  {
    category: 'Control switch',
    items: [],
  },
  {
    category: 'Lock Sets',
    items: [],
  },

  // Row 3
  {
    category: 'Mirror',
    items: [],
  },
  {
    category: 'Foot control',
    items: [
      { name: 'Footrest', slug: 'footrest' },
      { name: 'Footrest bracket', slug: 'footrest-bracket' },
    ],
  },
  {
    category: 'Swingarm parts',
    items: [
      { name: 'Swingarm bush kit', slug: 'swingarm-bush-kit' },
    ],
  },
  {
    category: 'Silencer',
    items: [],
  },
  {
    category: 'Sticker kits',
    items: [],
  },
];

export const SparesMegaMenu = ({ onClose }) => {
  return (
    <div
      id="spares-mega-menu"
      role="region"
      aria-label="Shop By Spares Mega Menu"
      className="w-full bg-white border-t border-b border-slate-200 shadow-2xl pt-7 pb-16 px-6 lg:px-12 z-50 animate-fadeIn max-h-[calc(100vh-180px)] overflow-y-auto overscroll-contain"
      style={{
        scrollbarGutter: 'stable',
        scrollbarWidth: 'thin',
        scrollbarColor: '#94a3b8 #f1f5f9',
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-7 pb-8">
        {sparesCatalog.map((group, idx) => {
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
              {group.items.length > 0 && (
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SparesMegaMenu;
