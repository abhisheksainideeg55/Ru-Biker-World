import React, { useRef, useEffect } from 'react';
import BikeMegaMenu from './BikeMegaMenu';
import SparesMegaMenu from './SparesMegaMenu';
import AccessoriesMegaMenu from './AccessoriesMegaMenu';

export const MegaMenu = ({ activeMenu, onClose, onMouseEnter, onMouseLeave }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activeMenu) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-50 shadow-2xl animate-fadeIn"
    >
      {activeMenu === 'bike' && <BikeMegaMenu onClose={onClose} />}
      {activeMenu === 'spares' && <SparesMegaMenu onClose={onClose} />}
      {activeMenu === 'accessories' && <AccessoriesMegaMenu onClose={onClose} />}
    </div>
  );
};

export default MegaMenu;
