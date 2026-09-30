import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import UserAvatar from './UserAvatar';

export const UserProfileSummary = ({ user }) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} size="lg" className="border-2 border-brand-100 shadow-sm" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 font-display">
              {user?.name || 'MotoZone Rider'}
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <FiShield className="w-3 h-3 text-emerald-600" />
              <span>Customer</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1.5">
              <FiMail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email || 'rider@motozone.in'}</span>
            </span>
            {user?.phone && (
              <span className="flex items-center gap-1.5">
                <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.phone}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <Link
        to="/account/profile"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 transition-all shadow-2xs"
      >
        <FiEdit2 className="w-3.5 h-3.5" />
        <span>Edit Profile</span>
      </Link>
    </div>
  );
};

export default UserProfileSummary;
