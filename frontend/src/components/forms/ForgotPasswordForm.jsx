import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { authService } from '../../services/authService';
import { useNotifications } from '../../hooks/useNotifications';

export const ForgotPasswordForm = () => {
  const { addToast } = useNotifications() || {};

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.forgotPassword(email.trim());
      setIsSent(true);
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Password reset instructions have been sent.',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="space-y-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <FiCheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Check Your Inbox</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            If an account exists for <strong className="text-slate-900">{email}</strong>, a password reset link has been dispatched with instructions.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-surface-900 hover:bg-surface-800 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Sign In</span>
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

      <div>
        <label
          htmlFor="forgot-email"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Registered Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiMail className="w-4 h-4" />
          </div>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="rider@example.com"
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-glow flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Sending Link...</span>
          </>
        ) : (
          <>
            <span>Send Password Reset Link</span>
            <FiArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="pt-3 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
