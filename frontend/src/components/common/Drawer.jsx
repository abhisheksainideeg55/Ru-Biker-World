import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'left',
  width = 'max-w-md',
  showClose = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    bottom: 'bottom-0 left-0 right-0 max-h-[85vh]',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed ${positionClasses[position] || positionClasses.left} w-full ${width} bg-white shadow-2xl z-10 flex flex-col transition-transform duration-300`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-base font-bold text-slate-900">{title || 'Menu'}</h3>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close drawer"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
