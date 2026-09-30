import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Container from '../common/Container';
import HomeSectionHeader from './HomeSectionHeader';
import { homeBrands } from '../../data/homeBrands';

export const PopularBrands = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <Container size="wide">
        <HomeSectionHeader
          badge="Manufacturer Lineup"
          title="Popular Motorcycle Brands"
          subtitle="Explore parts, tuning accessories, and protection kits tailored for top domestic and international motorcycle makes."
          actionLabel="View All Brands"
          actionHref="/shop?tab=bikes"
        />

        {/* Brands Grid: 5 on desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {homeBrands.map((brand) => (
            <Link
              key={brand.id}
              to={brand.link}
              className="group card-premium p-5 flex flex-col justify-between text-center hover:border-brand-500 hover:shadow-elevated transition-all duration-200 bg-white"
            >
              <div className="flex flex-col items-center">
                {/* Brand Initial Badge */}
                <div className="w-14 h-14 rounded-2xl bg-surface-900 text-white group-hover:bg-brand-600 flex items-center justify-center font-black text-base transition-colors duration-200 shadow-sm mb-3">
                  {brand.code}
                </div>

                {/* Brand Name */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {brand.name}
                </h3>

                {/* Tagline / Series */}
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {brand.tagline}
                </p>
              </div>

              {/* Action link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-xs font-extrabold text-brand-600 group-hover:text-brand-700">
                <span>Shop Parts</span>
                <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PopularBrands;
