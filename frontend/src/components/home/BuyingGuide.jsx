import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiClock } from 'react-icons/fi';
import Container from '../common/Container';
import HomeSectionHeader from './HomeSectionHeader';
import { buyingGuides } from '../../data/buyingGuides';

export const BuyingGuide = () => {
  return (
    <section className="py-12 sm:py-16 bg-surface-50 border-b border-slate-100">
      <Container size="wide">
        <HomeSectionHeader
          badge="Rider Knowledge"
          title="Motorcycle Parts Buying Guide"
          subtitle="Expert guides, technical maintenance advice, and part selection manuals written by experienced riders."
          actionLabel="View All Articles & Guides"
          actionHref="/blog"
        />

        {/* Guides Grid: 4 on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buyingGuides.map((guide) => (
            <div
              key={guide.id}
              className="group card-premium p-6 flex flex-col justify-between hover:border-brand-500 hover:shadow-elevated transition-all duration-300 bg-white"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-3">
                  <span className="text-brand-600 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px] font-black">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {guide.readTime}
                  </span>
                </div>

                {/* Guide Title */}
                <h3 className="text-sm font-black text-slate-900 group-hover:text-brand-600 transition-colors font-display line-clamp-2 leading-snug mb-2">
                  {guide.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-normal">
                  {guide.description}
                </p>
              </div>

              {/* Bottom Read Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/blog"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1.5 group/btn"
                >
                  <FiBookOpen className="w-3.5 h-3.5 text-brand-500" />
                  <span>Read Guide</span>
                  <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BuyingGuide;
