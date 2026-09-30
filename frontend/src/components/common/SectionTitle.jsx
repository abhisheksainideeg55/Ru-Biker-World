import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export const SectionTitle = ({
  badge,
  title,
  subtitle,
  align = 'left',
  viewAllLink,
  viewAllText = 'View All',
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 ${className}`}>
      <div className={align === 'center' ? 'text-center mx-auto' : 'text-left'}>
        {badge && (
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group transition-colors self-start md:self-end"
        >
          <span>{viewAllText}</span>
          <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
