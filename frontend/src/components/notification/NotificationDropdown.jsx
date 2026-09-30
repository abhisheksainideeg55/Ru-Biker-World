import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const topNotifications = notifications.slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fadeIn"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <FiBell className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Notifications
          </h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-slate-950 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <FiCheckCircle className="w-3 h-3" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="p-2 max-h-80 overflow-y-auto space-y-1.5 divide-y-0">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : topNotifications.length === 0 ? (
          <div className="py-8 text-center space-y-1">
            <FiBell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">You're all caught up!</p>
            <p className="text-[11px] text-slate-400">No new notifications right now.</p>
          </div>
        ) : (
          topNotifications.map((n) => (
            <NotificationItem
              key={n._id || n.id}
              notification={n}
              onMarkRead={markAsRead}
              onCloseDropdown={onClose}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
        <Link
          to="/account/notifications"
          onClick={onClose}
          className="text-xs font-bold text-slate-800 hover:text-amber-600 inline-flex items-center gap-1 transition-colors"
        >
          <span>View All Notifications</span>
          <FiChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
