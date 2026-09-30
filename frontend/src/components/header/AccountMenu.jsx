import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiPackage, 
  FiHeart, 
  FiMapPin, 
  FiBell, 
  FiHelpCircle, 
  FiLogIn, 
  FiUserPlus, 
  FiLogOut,
  FiZap,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import KwikPassModal from '../auth/KwikPassModal';

export const AccountMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useNotifications() || {};
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setIsOpen(false);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleProfileClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
        className="relative p-2 rounded-lg text-slate-900 hover:text-brand-600 transition-colors focus:outline-none cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <FiUser className="w-6 h-6 text-slate-900" />
          <span className="absolute -bottom-1 -right-1 text-amber-500 bg-black rounded-full p-0.5 text-[9px]">
            <FiZap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-2 z-50 animate-fadeIn text-slate-800"
        >
          {/* Menu Title / User Greeting */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isAuthenticated ? user?.name || 'Rider Account' : 'My Account'}
            </span>
            {isAuthenticated && (
              <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>

          {!isAuthenticated ? (
            /* Guest State (Default) */
            <div className="p-3">
              <div className="bg-slate-50 p-3 rounded-xl mb-2 text-center border border-slate-100">
                <p className="text-xs text-slate-600 font-medium mb-2.5">
                  Sign in for personalized bike fitment & orders
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FiLogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="flex-1 btn-outline text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FiUserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium transition-colors"
                >
                  <FiUser className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium transition-colors"
                >
                  <FiPackage className="w-4 h-4 text-slate-400" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium transition-colors"
                >
                  <FiHeart className="w-4 h-4 text-slate-400" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium transition-colors"
                >
                  <FiHelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Track Order</span>
                </Link>
                <div className="border-t border-slate-100 my-1" />
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FiShield className="w-4 h-4 text-brand-600" />
                    <span>Admin Panel</span>
                  </div>
                  <span className="text-[9px] bg-brand-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            /* Logged-In User State */
            <div className="p-2 space-y-0.5">
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium"
              >
                <FiUser className="w-4 h-4 text-slate-400" />
                <span>My Account</span>
              </Link>
              <Link
                to="/account/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium"
              >
                <FiUser className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/account/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium"
              >
                <FiPackage className="w-4 h-4 text-slate-400" />
                <span>My Orders</span>
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium"
              >
                <FiHeart className="w-4 h-4 text-slate-400" />
                <span>Wishlist</span>
              </Link>
              <Link
                to="/account/addresses"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium"
              >
                <FiMapPin className="w-4 h-4 text-slate-400" />
                <span>Addresses</span>
              </Link>
              <Link
                to="/account/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg font-medium"
              >
                <FiBell className="w-4 h-4 text-slate-400" />
                <span>Notifications</span>
              </Link>
              <div className="border-t border-slate-100 my-1" />
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiShield className="w-4 h-4 text-brand-600" />
                  <span>Admin Panel</span>
                </div>
                <span className="text-[9px] bg-brand-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </Link>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  if (addToast) {
                    addToast({
                      type: 'info',
                      message: 'Logged out successfully.',
                    });
                  }
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium text-left"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
      {/* KwikPass Login Modal */}
      <KwikPassModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default AccountMenu;
