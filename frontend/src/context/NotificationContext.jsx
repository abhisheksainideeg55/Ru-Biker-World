import React, { createContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Customer Account notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications();
      if (res && res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(typeof res.unreadCount === 'number' ? res.unreadCount : 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res && res.success && res.data) {
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Ignore background unread check failure
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res && res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
        );
        if (typeof res.unreadCount === 'number') {
          setUnreadCount(res.unreadCount);
        } else {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
      }
    } catch {
      // Fallback local update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res && res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        addToast({ type: 'success', message: 'All notifications marked as read.' });
      }
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  }, [addToast]);

  const deleteNotification = useCallback(async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
      addToast({ type: 'info', message: 'Notification removed.' });
    } catch {
      setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    }
  }, [addToast]);

  const clearNotifications = useCallback(async () => {
    try {
      await notificationService.clearNotifications();
      setNotifications([]);
      setUnreadCount(0);
      addToast({ type: 'info', message: 'All notifications cleared.' });
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [addToast]);

  // Window focus auto-refresh (lightweight, non-aggressive)
  useEffect(() => {
    const handleFocus = () => {
      fetchUnreadCount();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUnreadCount]);

  const value = {
    toasts,
    addToast,
    removeToast,
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
