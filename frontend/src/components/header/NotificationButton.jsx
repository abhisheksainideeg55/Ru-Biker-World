import React, { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from '../notification/NotificationDropdown';
import { useAuth } from '../../hooks/useAuth';

export const NotificationButton = () => {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label="Customer notifications"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute 0 top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default NotificationButton;
