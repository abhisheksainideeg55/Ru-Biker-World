import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { authStorage } from '../utils/authStorage';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export const AuthContext = createContext();

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  // Cross-tab broadcast synchronization channel
  useEffect(() => {
    try {
      broadcastChannelRef.current = new BroadcastChannel('motozone_auth_sync');
      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data?.type === 'FORCE_LOGOUT_BLOCKED') {
          setUser(null);
          setToken(null);
          authStorage.clearAuth();
          if (event.data?.blockDetails) {
            try {
              sessionStorage.setItem('motozone_blocked_info', JSON.stringify(event.data.blockDetails));
            } catch (e) {}
          }
          if (!window.location.pathname.includes('/account-blocked')) {
            window.location.href = '/account-blocked';
          }
        } else if (event.data?.type === 'FORCE_LOGOUT') {
          setUser(null);
          setToken(null);
          authStorage.clearAuth();
        } else if (event.data?.type === 'USER_UPDATED') {
          const updated = authStorage.getUser();
          if (updated) setUser(updated);
        }
      };
    } catch (e) {
      // Fallback
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  // Initialize and verify session on application startup
  const initAuth = useCallback(async () => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res && res.user) {
        setUser(res.user);
        setToken(storedToken);
        authStorage.setUser(res.user);
      } else if (storedUser) {
        setUser(storedUser);
      }
    } catch (err) {
      console.warn('[Auth] Session validation error:', err.message);
      if (err.status === 403 && (err.code === 'ACCOUNT_BLOCKED' || (err.message && err.message.toLowerCase().includes('suspended')))) {
        authStorage.clearAuth();
        setUser(null);
        setToken(null);
        if (!window.location.pathname.includes('/account-blocked')) {
          window.location.href = '/account-blocked';
        }
      } else if (err.status === 401) {
        authStorage.clearAuth();
        setUser(null);
        setToken(null);
      } else if (storedUser) {
        setUser(storedUser);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Real-time WebSocket connection for instant session revocation
  useEffect(() => {
    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const userId = user.id || user._id;
    if (!userId) return;

    // Connect to backend Socket.io
    const socket = io(SOCKET_SERVER_URL, {
      query: { userId },
      auth: { token, userId },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_user_room', { userId });
      console.log('[Socket] Connected to real-time session channel for user:', userId);
    });

    const handleBlockedEvent = (data) => {
      console.warn('[Socket] Force Logout & Session Revocation triggered by Admin:', data);
      const blockDetails = data?.blockDetails || data;
      try {
        sessionStorage.setItem('motozone_blocked_info', JSON.stringify(blockDetails));
      } catch (e) {}

      // Clear authentication state
      setUser(null);
      setToken(null);
      authStorage.clearAuth();

      // Broadcast across all browser tabs
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'FORCE_LOGOUT_BLOCKED',
          blockDetails,
        });
      }

      socket.disconnect();

      // Redirect to Account Blocked Page
      if (!window.location.pathname.includes('/account-blocked')) {
        window.location.href = '/account-blocked';
      }
    };

    socket.on('account_blocked', handleBlockedEvent);
    socket.on(`user_blocked_${userId}`, handleBlockedEvent);

    socket.on('user_updated', (updatedData) => {
      if (updatedData.status === 'active' || updatedData.isActive) {
        const current = authStorage.getUser();
        if (current) {
          current.isActive = true;
          current.status = 'active';
          authStorage.setUser(current);
          setUser({ ...current });
        }
      }
    });

    return () => {
      socket.off('account_blocked', handleBlockedEvent);
      socket.off(`user_blocked_${userId}`, handleBlockedEvent);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id, user?._id, token]);

  useEffect(() => {
    initAuth();

    // Listen to 401 events from Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'FORCE_LOGOUT' });
      }
    };

    // Listen to 403 Account Blocked events from Axios interceptor
    const handleAccountBlocked = (event) => {
      const details = event.detail?.blockDetails || event.detail;
      setUser(null);
      setToken(null);
      authStorage.clearAuth();
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'FORCE_LOGOUT_BLOCKED',
          blockDetails: details,
        });
      }
      if (!window.location.pathname.includes('/account-blocked')) {
        window.location.href = '/account-blocked';
      }
    };

    // Listen to local user updates across tabs or admin actions
    const handleUserUpdated = () => {
      const updatedUser = authStorage.getUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    };

    window.addEventListener('motozone:unauthorized', handleUnauthorized);
    window.addEventListener('motozone:account_blocked', handleAccountBlocked);
    window.addEventListener('motozone:user_updated', handleUserUpdated);
    window.addEventListener('storage', handleUserUpdated);

    return () => {
      window.removeEventListener('motozone:unauthorized', handleUnauthorized);
      window.removeEventListener('motozone:account_blocked', handleAccountBlocked);
      window.removeEventListener('motozone:user_updated', handleUserUpdated);
      window.removeEventListener('storage', handleUserUpdated);
    };
  }, [initAuth]);

  /**
   * Customer Login
   */
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'USER_UPDATED' });
      }
    }
    return data;
  };

  /**
   * Mobile OTP Login (KwikPass)
   */
  const loginWithOtp = async ({ phone, otp }) => {
    const data = await authService.verifyOtp({ phone, otp });
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'USER_UPDATED' });
      }
    }
    return data;
  };

  /**
   * Customer Registration
   */
  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'USER_UPDATED' });
      }
    }
    return data;
  };

  /**
   * Customer Logout
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      authStorage.clearAuth();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'FORCE_LOGOUT' });
      }
    }
  };

  /**
   * Refresh current user profile
   */
  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res && res.user) {
        setUser(res.user);
        authStorage.setUser(res.user);
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  /**
   * Update Profile details
   */
  const updateProfile = async (profileData) => {
    const res = await userService.updateMyProfile(profileData);
    if (res && res.user) {
      setUser(res.user);
      authStorage.setUser(res.user);
    }
    return res;
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    loginWithOtp,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
