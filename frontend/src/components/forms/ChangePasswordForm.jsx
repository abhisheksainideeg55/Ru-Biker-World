import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useProfile } from '../../hooks/useProfile';

export const ChangePasswordForm = () => {
  const { changePassword, isChangingPassword } = useProfile();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Please enter your current password.';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long.';
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your new password.';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSuccess(false);

    if (!validate()) return;

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });

      setIsSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err) {
      setFormError(err.message || 'Failed to change password. Please check your current password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg" noValidate>
      {formError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-fadeIn">
          <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{formError}</span>
        </div>
      )}

      {isSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700 animate-fadeIn">
          <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="leading-snug">Password has been changed successfully.</span>
        </div>
      )}

      {/* Current Password */}
      <div>
        <label
          htmlFor="current-password"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Current Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiLock className="w-4 h-4" />
          </div>
          <input
            id="current-password"
            type={showCurrent ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.currentPassword}
            onChange={(e) => {
              setFormData({ ...formData, currentPassword: e.target.value });
              if (errors.currentPassword) setErrors({ ...errors, currentPassword: null });
            }}
            placeholder="••••••••"
            className={`w-full bg-slate-50 border ${
              errors.currentPassword
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            aria-label={showCurrent ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showCurrent ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.currentPassword}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiLock className="w-4 h-4" />
          </div>
          <input
            id="new-password"
            type={showNew ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={(e) => {
              setFormData({ ...formData, newPassword: e.target.value });
              if (errors.newPassword) setErrors({ ...errors, newPassword: null });
            }}
            placeholder="••••••••"
            className={`w-full bg-slate-50 border ${
              errors.newPassword
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            aria-label={showNew ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showNew ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label
          htmlFor="confirm-new-password"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Confirm New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiLock className="w-4 h-4" />
          </div>
          <input
            id="confirm-new-password"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.confirmNewPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmNewPassword: e.target.value });
              if (errors.confirmNewPassword) setErrors({ ...errors, confirmNewPassword: null });
            }}
            placeholder="••••••••"
            className={`w-full bg-slate-50 border ${
              errors.confirmNewPassword
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmNewPassword && (
          <p className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.confirmNewPassword}
          </p>
        )}
      </div>

      <p className="text-[11px] text-slate-500">
        Password must be at least 8 characters long with uppercase, lowercase, and numbers.
      </p>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isChangingPassword}
          className="py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-surface-900 hover:bg-brand-600 text-white shadow-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 focus:outline-none"
        >
          {isChangingPassword ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
