import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiUser,
  FiMapPin,
  FiHeart,
  FiPackage,
  FiStar,
  FiBell,
  FiSettings,
  FiLogOut,
  FiRotateCcw,
} from 'react-icons/fi';
import UserAvatar from './UserAvatar';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export const AccountSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useNotifications() || {};

  const handleLogout = async () => {
    await logout();
    if (addToast) {
      addToast({
        type: 'info',
        message: 'Logged out successfully.',
      });
    }
    navigate('/');
  };

  const navItems = [
    { label: 'Account Overview', path: '/account', icon: FiGrid, end: true },
    { label: 'Profile Information', path: '/account/profile', icon: FiUser },
    { label: 'Delivery Addresses', path: '/account/addresses', icon: FiMapPin },
    { label: 'Saved Wishlist', path: '/account/wishlist', icon: FiHeart },
    { label: 'My Orders', path: '/account/orders', icon: FiPackage },
    { label: 'Returns & Refunds', path: '/account/returns', icon: FiRotateCcw },
    { label: 'My Reviews', path: '/account/reviews', icon: FiStar },
    { label: 'Notifications', path: '/account/notifications', icon: FiBell },
    { label: 'Account Settings', path: '/account/settings', icon: FiSettings },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Profile Mini Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center gap-3.5">
        <UserAvatar user={user} size="lg" className="border-2 border-brand-100 shadow-sm" />
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Rider Profile
          </span>
          <h3 className="text-sm font-black text-slate-900 truncate">
            {user?.name || 'MotoZone Rider'}
          </h3>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {user?.email || 'customer@motozone.in'}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-card">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 shadow-2xs font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-brand-600'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-slate-100 my-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <FiLogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
