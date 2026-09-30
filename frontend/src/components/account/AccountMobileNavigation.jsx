import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  FiChevronDown,
  FiRotateCcw,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export const AccountMobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addToast } = useNotifications() || {};

  const navItems = [
    { label: 'Overview', path: '/account', icon: FiGrid },
    { label: 'Profile', path: '/account/profile', icon: FiUser },
    { label: 'Addresses', path: '/account/addresses', icon: FiMapPin },
    { label: 'Wishlist', path: '/account/wishlist', icon: FiHeart },
    { label: 'Orders', path: '/account/orders', icon: FiPackage },
    { label: 'Returns', path: '/account/returns', icon: FiRotateCcw },
    { label: 'Reviews', path: '/account/reviews', icon: FiStar },
    { label: 'Notifications', path: '/account/notifications', icon: FiBell },
    { label: 'Settings', path: '/account/settings', icon: FiSettings },
  ];

  const currentItem = navItems.find((item) =>
    item.path === '/account'
      ? location.pathname === '/account'
      : location.pathname.startsWith(item.path)
  ) || navItems[0];

  const handleSelectChange = async (e) => {
    const val = e.target.value;
    if (val === 'logout') {
      await logout();
      if (addToast) {
        addToast({
          type: 'info',
          message: 'Logged out successfully.',
        });
      }
      navigate('/');
    } else {
      navigate(val);
    }
  };

  return (
    <div className="lg:hidden mb-6">
      {/* Mobile Selector Dropdown */}
      <div className="relative">
        <label htmlFor="mobile-account-nav" className="sr-only">
          Select Account Section
        </label>
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              {React.createElement(currentItem.icon, { className: 'w-4 h-4' })}
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                Account Section
              </span>
              <span className="text-xs font-black text-slate-900">{currentItem.label}</span>
            </div>
          </div>
          <FiChevronDown className="w-4 h-4 text-slate-400" />

          <select
            id="mobile-account-nav"
            value={currentItem.path}
            onChange={handleSelectChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {navItems.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
            <option value="logout">Sign Out</option>
          </select>
        </div>
      </div>

      {/* Horizontal Pill Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/account'
              ? location.pathname === '/account'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default AccountMobileNavigation;
