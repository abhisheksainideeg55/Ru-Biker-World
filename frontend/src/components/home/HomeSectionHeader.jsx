import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export const HomeSectionHeader = ({
  badge,
  title,
  subtitle,
  actionLabel,
  actionHref,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 ${className}`}>
      <div className={align === 'center' ? 'text-center mx-auto' : 'text-left'}>
        {badge ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            {badge}
          </span>
        ) : null}
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-brand-600 hover:text-brand-700 group transition-colors self-start md:self-end shrink-0"
        >
          <span>{actionLabel}</span>
          <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};

export default HomeSectionHeader;
