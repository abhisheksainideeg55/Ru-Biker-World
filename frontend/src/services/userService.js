import api from './api';

export const userService = {
  /**
   * Fetch full user profile
   */
  getMyProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile details (name, phone, avatar)
   */
  updateMyProfile: async (data) => {
    try {
      const response = await api.put('/users/me', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change customer password
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/me/password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove profile avatar
   */
  removeAvatar: async () => {
    try {
      const response = await api.delete('/users/me/avatar');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload / Set avatar image (handles file conversion to Base64 data URL)
   */
  uploadAvatar: async (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error('Please select an image file'));
      }

      // Check max size: 2MB
      if (file.size > 2 * 1024 * 1024) {
        return reject(new Error('Image size must be less than 2MB.'));
      }

      // Check mime type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return reject(new Error('Please upload a valid JPG, PNG, or WebP image.'));
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await api.put('/users/me', { avatar: base64Data });
          resolve(res.data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to process image file.'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Fetch user account preferences
   */
  getPreferences: async () => {
    try {
      const response = await api.get('/users/me/preferences');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user account preferences
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/users/me/preferences', preferences);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
