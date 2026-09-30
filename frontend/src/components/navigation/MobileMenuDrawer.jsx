import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiTruck,
  FiHelpCircle,
  FiMail,
  FiEdit3,
  FiHeart,
  FiRefreshCw,
  FiGrid,
  FiChevronDown,
  FiZap,
  FiUser,
  FiShield
} from 'react-icons/fi';
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import KwikPassModal from '../auth/KwikPassModal';

export const MobileMenuDrawer = ({ isOpen, onClose, topOffset = 140 }) => {
  const { isAuthenticated, user, logout } = useAuth() || {};
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Body scroll lock & ESC key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const visualCards = [
    {
      title: 'All Collections',
      path: '/collections',
      image: '/sidebar_all_collections.jpg',
    },
    {
      title: 'Shop By Bike',
      path: '/shop?tab=bikes',
      image: '/sidebar_shop_by_bike.jpg',
    },
    {
      title: 'Shop By Spares',
      path: '/shop?category=spares',
      image: '/sidebar_shop_by_spares.jpg',
    },
    {
      title: 'Shop By Accessories',
      path: '/shop?category=accessories',
      image: '/sidebar_shop_by_accessories.jpg',
    },
  ];

  const menuItems = [
    { label: 'Admin Operations Panel', path: '/admin', icon: FiShield, isHighlight: true },
    { label: 'Wholesale Price', path: '/pages/wholesale-price', icon: FiPackage },
    { label: 'Track Order', path: '/track-order', icon: FiTruck },
    { label: 'Faq', path: '/faq', icon: FiHelpCircle },
    { label: 'Contact Us', path: '/contact', icon: FiMail },
    { label: 'Blog', path: '/blog', icon: FiEdit3 },
    { label: 'Wishlist', path: '/wishlist', icon: FiHeart },
    { label: 'Return and Replacement', path: '/returns', icon: FiRefreshCw },
    { label: 'Brand Directory', path: '/shop?tab=brands', icon: FiGrid },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Sidebar Drawer"
      className="fixed inset-x-0 bottom-0 z-40 overflow-hidden lg:hidden select-none"
      style={{ top: `${topOffset}px` }}
    >
      {/* Backdrop overlay below header */}
      <div
        className="fixed inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        style={{ top: `${topOffset}px` }}
        onClick={onClose}
      />

      {/* Slide-in Left Drawer Container positioned right underneath the header */}
      <div
        className="relative z-10 w-full max-w-[85vw] sm:max-w-md bg-white border-r border-slate-200 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideRight"
        style={{ height: `calc(100vh - ${topOffset}px)` }}
      >
        <div>
          {/* 1. 2x2 Grid Visual Category Cards */}
          <div className="p-4 grid grid-cols-2 gap-3 bg-white border-b border-slate-100">
            {visualCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.path}
                onClick={onClose}
                className="group relative aspect-square  overflow-hidden shadow-xs border border-slate-200 block bg-slate-100"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ))}
          </div>

          {/* 2. Menu Navigation Links List with Line Icons */}
          <div className="divide-y divide-slate-100">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium text-slate-900 hover:text-[#c81e2b] hover:bg-slate-50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-slate-700 shrink-0 stroke-[1.5]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. Bottom Drawer Section: Log in Button + Currency + Socials */}
        <div className="p-5 border-t border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            {/* Log in Button */}
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-900 text-slate-900 text-sm font-bold transition-colors shadow-xs cursor-pointer"
              >
                <div className="relative">
                  <FiUser className="w-4 h-4 text-slate-900" />
                  <span className="absolute -bottom-1 -right-1 text-amber-500">
                    <FiZap className="w-2 h-2 text-amber-500 fill-amber-500" />
                  </span>
                </div>
                <span>Log in</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-900 text-xs font-bold"
                >
                  <FiUser className="w-3.5 h-3.5 text-slate-900" />
                  <span>{user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Account'}</span>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Currency Selector */}
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <span>India | INR ₹</span>
              <FiChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center space-x-4 pt-1 text-slate-800">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-800 hover:text-[#c81e2b] transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-800 hover:text-[#c81e2b] transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-800 hover:text-[#c81e2b] transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* KwikPass Login Modal */}
      <KwikPassModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          onClose();
        }}
      />
    </div>
  );
};

export default MobileMenuDrawer;
