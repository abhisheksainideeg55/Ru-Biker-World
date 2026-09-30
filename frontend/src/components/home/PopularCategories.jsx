import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';

export const initialLookingForCategories = [
  {
    id: 'performance',
    title: 'Performance & Exhaust',
    image: '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png',
    link: '/shop?category=Performance & Exhaust',
    status: 'active',
    order: 1
  },
  {
    id: 'brake',
    title: 'Spare Parts',
    image: '/5cb292a1b3224122055f89357a2ea599_breaksystem.png',
    link: '/shop?category=Spare Parts',
    status: 'active',
    order: 2
  },
  {
    id: 'helmets',
    title: 'Helmets',
    image: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    link: '/shop?category=riding-gear&subcategory=helmets',
    status: 'active',
    order: 3
  },
  {
    id: 'luggage',
    title: 'Luggage',
    image: '/554a968be41a8f6aaad2b41607c4d3be_luggage.png',
    link: '/shop?category=Luggage',
    status: 'active',
    order: 4
  },
  {
    id: 'lights',
    title: 'Lights & electronics',
    image: '/f5a4303af87ab6336039e0b0c753d893_lightselectronics.png',
    link: '/shop?category=Lighting & Electrical',
    status: 'active',
    order: 5
  },
  {
    id: 'protection',
    title: 'Rider Protection',
    image: '/0855fcf33a4f7aa9ca24ebca8b68bd97_riderprotection.png',
    link: '/shop?category=Protection & Guards',
    status: 'active',
    order: 6
  },
];

import { adminService } from '../../services/adminService';

export const PopularCategories = () => {
  const [lookingForList, setLookingForList] = useState(initialLookingForCategories);

  useEffect(() => {
    let isMounted = true;
    const fetchCards = async () => {
      try {
        const dbData = await adminService.getLookingFor();
        if (isMounted && Array.isArray(dbData) && dbData.length > 0) {
          const formatted = dbData
            .filter((c) => c.status !== 'inactive')
            .map((c) => {
              if (c.id === 'performance' && (!c.link || c.link === '/shop?category=performance' || c.link.includes('performance-parts') || c.title !== 'Performance & Exhaust')) {
                return { ...c, title: 'Performance & Exhaust', link: '/shop?category=Performance & Exhaust' };
              }
              if (c.id === 'brake' && (!c.link || c.link.includes('subcategory=brake-system') || c.title === 'Brake System')) {
                return { ...c, title: 'Spare Parts', link: '/shop?category=Spare Parts' };
              }
              if (c.id === 'protection' && (!c.link || c.link === '/shop?category=riding-gear')) {
                return { ...c, link: '/shop?category=Protection & Guards' };
              }
              if (c.id === 'lights' && (!c.link || c.link.includes('subcategory=lighting'))) {
                return { ...c, link: '/shop?category=Lighting & Electrical' };
              }
              if (c.id === 'luggage' && (!c.link || c.link.includes('subcategory=luggage') || c.link.includes('category=accessories') || c.link === '/shop?category=touring')) {
                return { ...c, link: '/shop?category=Luggage' };
              }
              return c;
            })
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

          if (formatted.length > 0) {
            setLookingForList(formatted);
          }
        }
      } catch (e) {}
    };

    fetchCards();

    const handleUpdate = () => {
      fetchCards();
    };

    window.addEventListener('sparify_looking_for_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('sparify_looking_for_updated', handleUpdate);
    };
  }, []);

  return (
    <section className="relative py-10 sm:py-14 bg-white overflow-hidden select-none">
      {/* Decorative Red Corner Slanted Bar Left */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-16 bg-[#c81e2b] -skew-x-12 -translate-x-8 z-0 pointer-events-none opacity-90" />
      
      {/* Decorative Cyan-Blue Corner Slanted Bar Right */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-16 bg-[#00a2e8] -skew-x-12 translate-x-8 z-0 pointer-events-none opacity-90" />

      <Container size="wide" className="relative z-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 text-center tracking-tight mb-6 sm:mb-8 font-sans">
          What Are You Looking For Today?
        </h2>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {lookingForList.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link || `/shop?category=${encodeURIComponent(cat.title)}`}
              className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block bg-black border border-slate-200/40"
              title={cat.title}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png';
                }}
              />
              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              {/* Label */}
              <div className="absolute bottom-3.5 inset-x-2 text-center">
                <span className="text-xs sm:text-sm font-semibold text-white tracking-wide group-hover:text-[#00a2e8] transition-colors drop-shadow-md">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PopularCategories;
