import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { addToast } = useNotifications() || {};

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format.';
    }

    if (formData.phone && formData.phone.trim()) {
      const clean = formData.phone.replace(/[\s\-]/g, '');
      if (!phoneRegex.test(clean) && clean.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy to create an account.';
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
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (addToast) {
        addToast({
          type: 'success',
          message: 'Account created successfully! Welcome to MotoZone.',
        });
      }

      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Registration failed.',
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

      {/* Full Name */}
      <div>
        <label
          htmlFor="reg-name"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Full Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiUser className="w-4 h-4" />
          </div>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'reg-name-error' : undefined}
            placeholder="e.g. Rahul Sharma"
            className={`w-full bg-slate-50 border ${
              errors.name
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>
        {errors.name && (
          <p id="reg-name-error" className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="reg-email"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiMail className="w-4 h-4" />
          </div>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'reg-email-error' : undefined}
            placeholder="rider@example.com"
            className={`w-full bg-slate-50 border ${
              errors.email
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>
        {errors.email && (
          <p id="reg-email-error" className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="reg-phone"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Mobile Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiPhone className="w-4 h-4" />
          </div>
          <input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: null });
            }}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
            placeholder="+91 98765 43210"
            className={`w-full bg-slate-50 border ${
              errors.phone
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
            } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>
        {errors.phone && (
          <p id="reg-phone-error" className="text-[11px] text-rose-600 font-medium mt-1">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Password Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Password */}
        <div>
          <label
            htmlFor="reg-password"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiLock className="w-4 h-4" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'reg-password-error' : undefined}
              placeholder="••••••••"
              className={`w-full bg-slate-50 border ${
                errors.password
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
              } rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
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
          {errors.password && (
            <p id="reg-password-error" className="text-[11px] text-rose-600 font-medium mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="reg-confirm-password"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiLock className="w-4 h-4" />
            </div>
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'reg-confirm-password-error' : undefined}
              placeholder="••••••••"
              className={`w-full bg-slate-50 border ${
                errors.confirmPassword
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
              } rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors`}
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
          {errors.confirmPassword && (
            <p id="reg-confirm-password-error" className="text-[11px] text-rose-600 font-medium mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* Password Requirements Hint */}
      <p className="text-[11px] text-slate-500">
        Must be at least 8 characters with letters and numbers (e.g. MotoZone@123).
      </p>

      {/* Terms & Privacy Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => {
              setFormData({ ...formData, agreeTerms: e.target.checked });
              if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
            }}
            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 cursor-pointer"
          />
          <span className="leading-snug">
            I agree to MotoZone's{' '}
            <Link to="/terms" target="_blank" className="font-semibold text-brand-600 hover:underline">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy" target="_blank" className="font-semibold text-brand-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-[11px] text-rose-600 font-medium mt-1 pl-6.5">
            {errors.agreeTerms}
          </p>
        )}
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
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Rider Account</span>
            <FiArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to Login */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        <span>Already have an account? </span>
        <Link
          to={`/login${location.search}`}
          className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
