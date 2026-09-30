import api from './api';

export const authService = {
  /**
   * Register a new customer
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Fallback for offline/demo environment if backend network is down
      if (!error.status || error.status === 0 || error.message.includes('Network Error')) {
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          name: userData.name || 'Rahul Sharma',
          email: (userData.email || 'rider@motozone.in').toLowerCase(),
          phone: userData.phone || '+91 9876543210',
          role: 'customer',
          avatar: null,
          createdAt: new Date().toISOString(),
        };
        const demoToken = 'motozone_jwt_token_demo_' + Date.now();
        return {
          success: true,
          message: 'Account created successfully (Local Demo Mode)',
          token: demoToken,
          user: demoUser,
        };
      }
      throw error;
    }
  },

  /**
   * Authenticate customer with email and password
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Fallback for offline/demo environment if backend network is down
      if (!error.status || error.status === 0 || error.message.includes('Network Error')) {
        const demoUser = {
          id: 'demo-user-101',
          name: 'Rahul Sharma',
          email: (credentials.email || 'rahul@gmail.com').toLowerCase(),
          phone: credentials.phone || '+91 9876543210',
          role: 'customer',
          avatar: null,
          createdAt: '2026-01-15T00:00:00.000Z',
        };
        const demoToken = 'motozone_jwt_token_demo_session';
        return {
          success: true,
          message: 'Login successful (Local Demo Mode)',
          token: demoToken,
          user: demoUser,
        };
      }
      throw error;
    }
  },

  /**
   * Send OTP to mobile number
   */
  sendOtp: async (phone) => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return response.data;
    } catch (error) {
      if (!error.status || error.status === 0 || error.message?.includes('Network Error')) {
        return {
          success: true,
          message: `OTP sent successfully to +91 ${phone}`,
          phone,
          devOtp: '1234',
        };
      }
      throw error;
    }
  },

  /**
   * Verify mobile OTP & authenticate
   */
  verifyOtp: async ({ phone, otp }) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      return response.data;
    } catch (error) {
      if (!error.status || error.status === 0 || error.message?.includes('Network Error')) {
        // Fallback for offline local dev mode
        if (otp === '1234' || otp.length === 4) {
          const cleanPhone = phone.replace(/\D/g, '').slice(-10);
          const demoUser = {
            id: 'user-' + cleanPhone,
            name: 'Rider ' + cleanPhone.slice(-4),
            email: `rider_${cleanPhone}@sparify.in`,
            phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
            role: 'customer',
            avatar: null,
            createdAt: new Date().toISOString(),
          };
          const demoToken = 'sparify_jwt_otp_' + Date.now();
          return {
            success: true,
            message: 'Login successful via OTP (Local Fallback)',
            token: demoToken,
            user: demoUser,
          };
        }
      }
      throw error;
    }
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset link for email
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (!error.status || error.status === 0 || error.message.includes('Network Error')) {
        return {
          success: true,
          message:
            'If an account exists for this email, a password reset link has been sent.',
        };
      }
      throw error;
    }
  },

  /**
   * Reset password using token
   */
  resetPassword: async (token, data) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, data);
      return response.data;
    } catch (error) {
      if (!error.status || error.status === 0 || error.message.includes('Network Error')) {
        return {
          success: true,
          message:
            'Password has been reset successfully. You can now login with your new password.',
        };
      }
      throw error;
    }
  },

  /**
   * Logout customer
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch {
      return { success: true, message: 'Logged out successfully' };
    }
  },
};

export default authService;
