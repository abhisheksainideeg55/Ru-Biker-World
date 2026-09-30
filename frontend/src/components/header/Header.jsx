import React, { useState, useRef, useEffect } from 'react';
import AnnouncementBar from './AnnouncementBar';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import MobileMenuDrawer from '../navigation/MobileMenuDrawer';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(140);

  // Measure dynamic mobile header height
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <header ref={headerRef} className="w-full sticky top-0 z-50 select-none bg-white shadow-xs">
      {/* Top Black Announcement Ticker */}
      <AnnouncementBar />

      {/* Desktop 2-Level Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader
        isOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Mobile Drawer (Sidebar opening right below the header) */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        topOffset={headerHeight}
      />
    </header>
  );
};

export default Header;
