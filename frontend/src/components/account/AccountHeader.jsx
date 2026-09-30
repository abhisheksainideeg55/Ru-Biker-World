import React from 'react';
import UserAvatar from './UserAvatar';

export const AccountHeader = ({ user, title, subtitle }) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-surface-950 via-surface-900 to-slate-900 text-white shadow-elevated mb-8 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-600/20 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="xl" className="border-2 border-white/20 shadow-lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-500/20 border border-brand-500/30 px-2.5 py-0.5 rounded-full">
                Verified Rider
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
              {title || `Hello, ${user?.name || 'Rider'}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {subtitle || user?.email || 'Manage your motorcycle orders, saved vehicles, and profile settings.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
