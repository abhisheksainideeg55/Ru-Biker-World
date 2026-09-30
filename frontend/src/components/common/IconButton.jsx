import React from 'react';

const variantClasses = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  secondary: 'bg-surface-900 text-white hover:bg-surface-800 focus:ring-slate-700',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-brand-500',
  ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500',
};

const sizeClasses = {
  sm: 'p-1.5 text-sm rounded-md',
  md: 'p-2.5 text-base rounded-lg',
  lg: 'p-3 text-lg rounded-xl',
};

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  badgeCount,
  disabled = false,
  ariaLabel,
  onClick,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        relative inline-flex items-center justify-center transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant] || variantClasses.ghost}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {Icon ? <Icon className="w-5 h-5 shrink-0" /> : children}
      {typeof badgeCount === 'number' && badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </button>
  );
};

export default IconButton;
