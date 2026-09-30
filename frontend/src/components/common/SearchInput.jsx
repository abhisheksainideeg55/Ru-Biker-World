import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export const SearchInput = ({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search motorcycle parts, brands, accessories...',
  className = '',
  size = 'md',
  autoFocus = false,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  const sizeClasses = {
    sm: 'py-2 pl-9 pr-8 text-xs',
    md: 'py-2.5 pl-11 pr-10 text-sm',
    lg: 'py-3.5 pl-12 pr-11 text-base',
  };

  return (
    <div className={`relative w-full flex items-center ${className}`}>
      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
        <FiSearch className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`
          w-full rounded-full border border-slate-300 bg-white text-slate-900 placeholder-slate-400
          shadow-subtle transition-all duration-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100
          ${sizeClasses[size] || sizeClasses.md}
        `}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label="Clear search"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
