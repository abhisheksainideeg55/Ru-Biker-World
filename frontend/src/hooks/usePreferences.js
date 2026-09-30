import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { useNotifications } from './useNotifications';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderNotifications: true,
    promotionalNotifications: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useNotifications() || {};

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userService.getPreferences();
      if (res && res.preferences) {
        setPreferences(res.preferences);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = async (newPrefs) => {
    setIsSaving(true);
    try {
      const res = await userService.updatePreferences(newPrefs);
      if (res && res.preferences) {
        setPreferences(res.preferences);
      }
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Account preferences updated.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to update preferences.',
        });
      }
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    preferences,
    isLoading,
    isSaving,
    updatePreferences,
    refreshPreferences: fetchPreferences,
  };
};

export default usePreferences;
