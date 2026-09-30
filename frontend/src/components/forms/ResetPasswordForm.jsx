import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { authService } from '../../services/authService';
import { useNotifications } from '../../hooks/useNotifications';

export const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications() || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(token, {
        password,
        confirmPassword,
      });

      setIsSuccess(true);
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Password reset successfully! You can now sign in.',
        });
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired password reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <FiCheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Password Updated!</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Your account security credentials have been successfully updated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center gap-2 shadow-glow transition-all"
          >
            <span>Sign In with New Password</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
          <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* New Password */}
      <div>
        <label
          htmlFor="reset-new-password"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiLock className="w-4 h-4" />
          </div>
          <input
            id="reset-new-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div>
        <label
          htmlFor="reset-confirm-password"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Confirm New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiLock className="w-4 h-4" />
          </div>
          <input
            id="reset-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-500">
        Password must be at least 8 characters long.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-glow flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Resetting Password...</span>
          </>
        ) : (
          <>
            <span>Set New Password</span>
            <FiArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
