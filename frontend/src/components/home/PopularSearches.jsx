import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';

export const popularSearchesData = [
  {
    id: 'chain',
    category: 'Rolon Chain Sprocket Kit',
    queries: [
      { text: 'Duke 390 brass chain sprocket kit', query: 'Duke 390 brass chain sprocket kit' },
      { text: 'Imperiale 400 brass chain sprocket kit', query: 'Imperiale 400 brass chain sprocket kit' },
      { text: 'Yamaha R15 V3 brass chain sprocket kit', query: 'Yamaha R15 V3 brass chain sprocket kit' },
    ],
  },
  {
    id: 'handlebar',
    category: 'Handle Bar For MotorCycle',
    queries: [
      { text: 'KTM Duke handlebar black', query: 'KTM Duke handlebar' },
      { text: 'KTM RC handlebar', query: 'KTM RC handlebar' },
      { text: 'Aprilia handlebar', query: 'Aprilia handlebar' },
    ],
  },
  {
    id: 'lights',
    category: 'Auxiliary Light (Fogg Lamp)',
    queries: [
      { text: 'HJG cree 60w led lights', query: 'HJG cree 60w' },
      { text: 'Maddog scout led combo set', query: 'Maddog scout led combo' },
      { text: 'HJG mini drive', query: 'HJG mini drive' },
    ],
  },
  {
    id: 'flasher',
    category: 'Hazard Flasher',
    queries: [
      { text: 'Yamaha Aerox 155 flash X', query: 'Yamaha Aerox 155 flash X' },
      { text: 'KTM adv 390 flash X', query: 'KTM adv 390 flash X' },
      { text: 'KTM RC 390 flash X', query: 'KTM RC 390 flash X' },
      { text: 'Dominar 400 flash X', query: 'Dominar 400 flash X' },
      { text: 'Aprilia SR 150 flash X', query: 'Aprilia SR 150 flash X' },
    ],
  },
  {
    id: 'windshield',
    category: 'WindShield For Bike',
    queries: [
      { text: 'BMW GS 310 windshield', query: 'BMW GS 310 windshield' },
      { text: 'Aprilia SXR windshield', query: 'Aprilia SXR windshield' },
      { text: 'Himalayan windshield', query: 'Himalayan windshield' },
      { text: 'Hunter 350 windshield', query: 'Hunter 350 windshield' },
    ],
  },
  {
    id: 'speedometer',
    category: 'SpeedoMeter',
    queries: [
      { text: 'KTM Duke 390 tft speedometer', query: 'KTM Duke 390 tft speedometer' },
      { text: 'Yamaha R15 V3 speedometer', query: 'Yamaha R15 V3 speedometer' },
    ],
  },
  {
    id: 'headlights',
    category: 'HeadLights For Bike',
    queries: [
      { text: 'KTM Duke 390 led headlight', query: 'KTM Duke 390 led headlight' },
      { text: 'Aprilia double chamber headlight', query: 'Aprilia double chamber headlight' },
    ],
  },
];

export const PopularSearches = () => {
  return (
    <section className="py-10 bg-white border-t border-slate-200/80 select-none">
      <Container size="wide">
        {/* POPULAR SEARCHES Header */}
        <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider mb-6">
          POPULAR SEARCHES
        </h2>

        {/* Search Matrix List */}
        <div className="space-y-6">
          {popularSearchesData.map((section) => (
            <div key={section.id} className="border-b border-slate-200/70 pb-5 last:border-b-0">
              <h3 className="text-xs sm:text-sm font-semibold text-[#111111] mb-2">
                {section.category}
              </h3>
              <div className="flex flex-wrap items-center gap-y-1 text-xs text-slate-600">
                {section.queries.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Link
                      to={`/shop?search=${encodeURIComponent(item.query)}`}
                      className="hover:text-brand-600 hover:underline transition-colors"
                    >
                      {item.text}
                    </Link>
                    {idx < section.queries.length - 1 && (
                      <span className="mx-2 text-slate-400">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEO Authority & Brand Store Description */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-lg sm:text-xl font-bold text-[#111111] mb-4">
            RU BIKER WORLD : The #1 Online Store for Motorcycle Gear &amp; Performance Parts
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <span className="font-semibold text-slate-900">RU BIKER WORLD</span> is a trusted online store for motorcycle accessories, riding gear, helmets, performance parts and touring luggage in India. With thousands of products from leading{' '}
              <Link to="/brands" className="underline hover:text-brand-600">
                Indian and international brands
              </Link>
              , we help riders find the right accessories for daily commuting, long-distance touring and adventure riding.
            </p>

            <p>
              Shop genuine products with secure payments, reliable shipping and expert customer support. RU BIKER WORLD is also the home of{' '}
              <Link to="/shop?category=Luggage" className="underline font-medium hover:text-brand-600">
                TAANC
              </Link>
              , our expedition-grade motorcycle luggage brand, and{' '}
              <Link to="/shop?category=Mirrors" className="underline font-medium hover:text-brand-600">
                SPIKI
              </Link>
              , our premium motorcycle mirrors and accessories brand.
            </p>

            <p>
              From{' '}
              <Link to="/shop?category=Helmets" className="underline hover:text-brand-600">
                helmets
              </Link>
              ,{' '}
              <Link to="/shop?category=Riding+Gear" className="underline hover:text-brand-600">
                jackets
              </Link>
              ,{' '}
              <Link to="/shop?category=Gloves" className="underline hover:text-brand-600">
                gloves
              </Link>{' '}
              and{' '}
              <Link to="/shop?category=Boots" className="underline hover:text-brand-600">
                boots
              </Link>{' '}
              to{' '}
              <Link to="/shop?category=Lights" className="underline hover:text-brand-600">
                bike lights
              </Link>
              ,{' '}
              <Link to="/shop?category=Luggage" className="underline hover:text-brand-600">
                luggage
              </Link>
              ,{' '}
              <Link to="/shop?category=Mirrors" className="underline hover:text-brand-600">
                mirrors
              </Link>
              ,{' '}
              <Link to="/shop?category=Filters" className="underline hover:text-brand-600">
                air filters
              </Link>{' '}
              and performance upgrades, RU BIKER WORLD makes motorcycle shopping simple, reliable and rider-focused.
            </p>

            <div className="pt-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              #SIMPLIFYING RIDING EXPERIENCE
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PopularSearches;
