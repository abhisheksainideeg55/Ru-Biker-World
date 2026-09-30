import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useNotifications() || {};

  // Destination after login (e.g. from ?redirect= or state)
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (addToast) {
        addToast({
          type: 'success',
          message: `Welcome back, ${res.user?.name || 'Rider'}!`,
        });
      }

      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.');
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Invalid email or password.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-fadeIn">
          <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{formError}</span>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiMail className="w-4 h-4" />
          </div>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            placeholder="rider@example.com"
            className={`w-full bg-slate-50 border ${
              errors.email
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>
        {errors.email && (
          <p id="login-email-error" className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Password <span className="text-rose-500">*</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiLock className="w-4 h-4" />
          </div>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            placeholder="••••••••"
            className={`w-full bg-slate-50 border ${
              errors.password
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })
            }
            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <span>Keep me signed in on this device</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-glow flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <span>Sign In to MotoZone</span>
            <FiArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to Register */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        <span>Don't have an account yet? </span>
        <Link
          to={`/register${location.search}`}
          className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Create Rider Account
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
