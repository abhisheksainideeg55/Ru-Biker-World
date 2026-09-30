import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs font-medium text-slate-500 py-3 ${className}`}>
      <ol className="flex items-center space-x-2 flex-wrap">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
            <FiHome className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              <FiChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast || !item.path ? (
                <span className="text-slate-800 font-semibold truncate max-w-xs">{item.label}</span>
              ) : (
                <Link to={item.path} className="hover:text-brand-600 transition-colors truncate max-w-xs">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
