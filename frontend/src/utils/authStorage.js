const TOKEN_KEY = 'motozone_token';
const USER_KEY = 'motozone_user';

// Ensure legacy localStorage data is cleaned up
try {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('motozone_admin_demo_access');
} catch {}

export const authStorage = {
  getToken: () => {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token) => {
    try {
      if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.error('Failed to save token to session storage:', e);
    }
  },

  removeToken: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove token from session storage:', e);
    }
  },

  getUser: () => {
    try {
      const stored = sessionStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save user to session storage:', e);
    }
  },

  removeUser: () => {
    try {
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to remove user from session storage:', e);
    }
  },

  clearAuth: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear auth storage:', e);
    }
  },
};

export default authStorage;
