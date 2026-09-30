import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { userService } from '../services/userService';
import { useNotifications } from './useNotifications';

export const useProfile = () => {
  const { user, refreshUser, updateProfile } = useAuth();
  const { addToast } = useNotifications() || {};

  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const saveProfile = async (data) => {
    setIsUpdating(true);
    try {
      const res = await updateProfile(data);
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Profile information updated successfully.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to update profile.',
        });
      }
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatar = async (file) => {
    setIsUploadingAvatar(true);
    try {
      const res = await userService.uploadAvatar(file);
      await refreshUser();
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Profile avatar updated successfully.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to upload avatar.',
        });
      }
      throw err;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const res = await userService.removeAvatar();
      await refreshUser();
      if (addToast) {
        addToast({
          type: 'info',
          message: 'Profile avatar removed.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to remove avatar.',
        });
      }
      throw err;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const changePassword = async (passwordData) => {
    setIsChangingPassword(true);
    try {
      const res = await userService.changePassword(passwordData);
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Password changed successfully.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to change password.',
        });
      }
      throw err;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    user,
    isUpdating,
    isChangingPassword,
    isUploadingAvatar,
    saveProfile,
    uploadAvatar,
    removeAvatar,
    changePassword,
    refreshUser,
  };
};

export default useProfile;
