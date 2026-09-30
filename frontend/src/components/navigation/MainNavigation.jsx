import React, { useState, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import Container from '../common/Container';
import MegaMenu from './MegaMenu';
import { navigationLinks } from '../../data/navigation';

export const MainNavigation = () => {
  const [activeMega, setActiveMega] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Close mega menu on route change
  React.useEffect(() => {
    setActiveMega(null);
  }, [location.pathname, location.search]);

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMega(null);
      }
    };

    if (activeMega) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMega]);

  const handleMouseEnter = (megaKey) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMega(megaKey);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 250);
  };

  const handleMenuContainerEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleClose = () => {
    setActiveMega(null);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Main Navigation"
      className="relative bg-white border-b border-slate-200 select-none shadow-xs  py-2"
      onMouseLeave={handleMouseLeave}
    >
      <Container size="wide" className="px-6 lg:px-12">
        <div className="flex items-center justify-start">
          {/* Main Navigation Links */}
          <div className="flex items-center flex-wrap gap-x-6 lg:gap-x-7 gap-y-2">
            {navigationLinks.map((item, idx) => {
              if (item.isMega) {
                const isOpen = activeMega === item.isMega;
                return (
                  <div
                    key={idx}
                    className="relative shrink-0"
                    onMouseEnter={() => handleMouseEnter(item.isMega)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveMega(isOpen ? null : item.isMega)}
                      aria-expanded={isOpen}
                      aria-controls={`${item.isMega}-mega-menu`}
                      className={`
                        inline-flex items-center gap-1 text-[14px] text-slate-800 transition-all focus:outline-none cursor-pointer py-1 px-1 border-b-2
                        ${isOpen ? 'border-[#c81e2b] font-bold text-[#c81e2b]' : 'border-transparent hover:border-[#c81e2b] hover:text-[#c81e2b] font-medium'}
                      `}
                    >
                      <span>{item.label}</span>
                      <FiChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-600 ${isOpen ? 'rotate-180 text-[#c81e2b]' : ''
                          }`}
                      />
                    </button>
                  </div>
                );
              }

              // Standard Link
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    inline-flex items-center text-[14px] text-slate-800 transition-all shrink-0 py-1 px-1 border-b-2
                    ${isActive ? 'border-[#c81e2b] font-bold text-[#c81e2b]' : 'border-transparent hover:border-[#c81e2b] hover:text-[#c81e2b] font-medium'}
                  `}
                >
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Mega Menu Dropdown Container - Full Width */}
      <MegaMenu
        activeMenu={activeMega}
        onClose={handleClose}
        onMouseEnter={handleMenuContainerEnter}
        onMouseLeave={handleMouseLeave}
      />
    </nav>
  );
};

export default MainNavigation;
