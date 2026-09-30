import React from 'react';
import Container from '../common/Container';
import Logo from './Logo';
import SearchBar from './SearchBar';
import AccountMenu from './AccountMenu';
import CartButton from './CartButton';
import MainNavigation from '../navigation/MainNavigation';

export const DesktopHeader = () => {
  return (
    <div className="hidden lg:block select-none">
      {/* Level 1: Gray Header Bar with Logo, Search Pill, Account & Cart */}
      <div className="bg-[#cdcdcd38]  py-4">
        <Container size="wide" className="px-6 lg:px-12">
          <div className="flex items-center justify-between gap-10">
            {/* Left: RU BIKER world Logo */}
            <img src='/ru_biker_world-removebg-preview.png' alt='logo' className='h-[50px]' />

            {/* Center: Large White Search Pill with Typing Effect */}
            <div className="flex-1 max-w-2xl mx-auto px-4">
              <SearchBar id="desktop-search-input" />
            </div>

            {/* Right: Admin, Account & Cart Buttons */}
            <div className="flex items-center space-x-4 shrink-0">
              <a
                href="/admin"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-sm transition-all duration-200 hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-[#c81e2b] animate-pulse" />
                <span>Admin Panel</span>
              </a>
              <AccountMenu />
              <CartButton />
            </div>
          </div>
        </Container>
      </div>

      {/* Level 2: Pure White Sub-Navigation Row with all RU BIKER world links */}
      <MainNavigation />
    </div>
  );
};

export default DesktopHeader;
