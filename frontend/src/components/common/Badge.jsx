import React from 'react';

const variantClasses = {
  primary: 'bg-brand-50 text-brand-700 border-brand-200',
  secondary: 'bg-slate-100 text-slate-800 border-slate-200',
  dark: 'bg-surface-900 text-white border-surface-800',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className = '',
  dot = false,
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-semibold tracking-wide border
        ${rounded === 'full' ? 'rounded-full' : 'rounded-md'}
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'danger'
              ? 'bg-rose-500'
              : variant === 'warning'
              ? 'bg-amber-500'
              : 'bg-brand-500'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
