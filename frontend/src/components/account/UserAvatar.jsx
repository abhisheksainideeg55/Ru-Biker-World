import React from 'react';

export const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const name = user?.name || 'Rider';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover border border-slate-200 shadow-2xs ${className}`}
      />
    );
  }

  return (
    <div
      className={`${
        sizeClasses[size] || sizeClasses.md
      } rounded-full bg-brand-500 text-white font-black flex items-center justify-center shadow-sm select-none shrink-0 ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
};

export default UserAvatar;
