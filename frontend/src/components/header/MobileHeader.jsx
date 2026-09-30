import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Container from '../common/Container';
import Logo from './Logo';
import SearchBar from './SearchBar';
import CartButton from './CartButton';

export const MobileHeader = ({ isOpen, onToggleMenu }) => {
  return (
    <div className="lg:hidden bg-[#cdcdcd38] border-b border-[#bcbcbc] select-none py-2.5 px-3">
      {/* Row 1: Square Hamburger/Close Box | RU BIKER world Logo | Cart */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        {/* Left: Square Toggle Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="w-10 h-10  bg-transparent flex items-center justify-center text-slate-900 focus:outline-none cursor-pointer"
          >
            {isOpen ? (
              <FiX className="w-6 h-6 text-slate-900" />
            ) : (
              <FiMenu className="w-6 h-6 text-slate-900" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/ru_biker_world-removebg-preview.png"
              alt="RU BIKER world"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none' }}>
              <Logo size="sm" showTagline={false} />
            </div>
          </div>
        </div>

        {/* Right: Cart Button */}
        <div className="flex items-center shrink-0">
          <CartButton />
        </div>
      </div>

      {/* Row 2: Search Bar Pill with dynamic typing */}
      <div>
        <SearchBar id="mobile-search-input" />
      </div>
    </div>
  );
};

export default MobileHeader;
