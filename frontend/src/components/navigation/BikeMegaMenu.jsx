import React from 'react';
import { Link } from 'react-router-dom';

export const bikeCatalog = [
  // Row 1
  {
    brand: 'ROYAL ENFIELD',
    models: [
      'Classic 350',
      'Classic 500',
      'Meteor 350',
      'Himalayan 450',
      'Guerrilla 450',
      'Super Meteor 650',
      'Himalayan 411',
      'SCRAM 440',
      'Scram 411',
      'Interceptor 650',
      'Continental GT 650',
      'Hunter 350',
      'Thunderbird 350',
      'Thunderbird 500',
      'Classic reborn 350',
    ],
  },
  {
    brand: 'TVS',
    models: [
      'Apache RTX 300',
      'Apache RR 310',
      'Apache RTR 310',
      'Apache RTR 200',
      'Apache 160',
    ],
  },
  {
    brand: 'BMW',
    models: [
      'F 450 GS',
      'GS 310',
      '310 R',
      'S 1000 RR',
    ],
  },
  {
    brand: 'KTM',
    models: [
      'Duke 125',
      'Duke 200',
      'Duke 250',
      'Duke 390',
      'RC 125',
      'RC 200',
      'RC 390',
      'Adventure 250',
      'Adventure 390',
      'Adventure 390 (2025)',
      'DUKE 250 (GEN 3)',
    ],
  },
  {
    brand: 'YAMAHA',
    models: [
      'XSR 155',
      'Aerox',
      'R15 V1',
      'R15 V2',
      'R15 V3',
      'R15 V4',
      'MT 15',
      'MT 09',
      'FZ 16',
      'FZ-X',
      'FZ 250',
      'FZ V2',
      'YZF-R1M',
      'YZF-R1',
      'YZF-R3',
    ],
  },
  {
    brand: 'HUSQVARNA',
    models: [
      'Svartpilen 401',
      'Vitpilen 401',
    ],
  },

  // Row 2
  {
    brand: 'BAJAJ',
    models: [
      'Pulsar NS 200',
      'Pulsar RS 200',
      'Pulsar NS 160',
      'Dominar 400',
      'Dominar 250',
      'Pulsar 220F',
      'Pulsar NS 400',
      'Pulsar N160',
    ],
  },
  {
    brand: 'KAWASAKI',
    models: [
      'Ninja 650',
      'Ninja 400',
      'KLX 230',
      'Ninja ZX-14R',
      'Ninja ZX-10R',
      'Ninja ZX-6R',
      'Ninja H2R',
      'Vulcan S',
      'Vulcan 900 Classic',
      'Versys 650',
      'Versys 1000',
      'Z400',
      'Z650',
      'Z800',
      'Z900',
      'Z1000',
    ],
  },
  {
    brand: 'BENELLI',
    models: [
      'TNT 300',
      'TNT 600i',
      'TNT 899',
      'TRK 502',
      'TRK 502X',
      'Imperiale 400',
    ],
  },
  {
    brand: 'PIAGGIO',
    models: [
      'Aprilia SR 125',
      'Aprilia SR 150',
      'Aprilia SR 160',
      'Aprilia SXR',
      'Aprilia storm 125',
      'Aprilia Storm 150',
      'Aprilia Storm 160',
      'Vespa SXL 125',
      'Vespa VXL 125',
      'Aprilia RS 457',
    ],
  },
  {
    brand: 'HERO',
    models: [
      'Xpulse 200',
      'Xpulse 210',
    ],
  },
  {
    brand: 'DUCATI',
    models: [
      'Panigale',
      'Scrambler 800',
      'Monster',
      'Multistrada',
      'Diavel 1260',
    ],
  },

  // Row 3
  {
    brand: 'HONDA',
    models: [
      "H'ness 350",
      'CBR 150',
      'CBR 250',
      'CBR 650',
      'CB 350RS',
      'CB 300',
      'CBR 1000 RR',
    ],
  },
  {
    brand: 'OLA',
    models: [
      'S1 Pro',
      'S1 Air',
      'S1 X',
    ],
  },
  {
    brand: 'Harley davidson',
    models: [
      'X440',
      'Iron 883',
      'Fat Boy',
      'Street 750',
    ],
  },
  {
    brand: 'Suzuki',
    models: [
      'V strom SX 250',
      'Gixxer SF 250',
      'Burgman',
    ],
  },
  {
    brand: 'Triumph',
    models: [
      'Speed 400',
      'Scrambler 400X',
      'T4',
    ],
  },
  {
    brand: 'Ather',
    models: [
      '450X',
      '450S',
      'Rizta',
    ],
  },

  // Row 4
  {
    brand: 'Jawa',
    models: [
      'JAWA 42',
      'Jawa bobber',
    ],
  },
  {
    brand: 'YEZDI',
    models: [
      'yezdi adventure',
      'yezdi roadster',
      'Yezdi Scrambler',
    ],
  },
];

export const BikeMegaMenu = ({ onClose }) => {
  return (
    <div
      id="bike-mega-menu"
      role="region"
      aria-label="Shop By Bike Mega Menu"
      className="w-full bg-white border-t border-b border-slate-200 shadow-2xl pt-7 pb-16 px-6 lg:px-12 z-50 animate-fadeIn max-h-[calc(100vh-180px)] overflow-y-auto overscroll-contain"
      style={{
        scrollbarGutter: 'stable',
        scrollbarWidth: 'thin',
        scrollbarColor: '#94a3b8 #f1f5f9',
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-7 pb-8">
        {bikeCatalog.map((group, idx) => {
          const brandSlug = group.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <div key={idx} className="space-y-1.5">
              <h4 className="font-bold text-[13px] text-slate-900 tracking-wide uppercase mb-2">
                <Link
                  to={`/collections/${brandSlug}`}
                  onClick={onClose}
                  className="hover:underline"
                >
                  {group.brand}
                </Link>
              </h4>
              <ul className="space-y-1">
                {group.models.map((model, mIdx) => {
                  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <li key={mIdx}>
                      <Link
                        to={`/collections/${modelSlug}`}
                        onClick={onClose}
                        className="text-[13px] text-slate-700 hover:text-black hover:underline block leading-snug transition-colors"
                      >
                        {model}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BikeMegaMenu;
