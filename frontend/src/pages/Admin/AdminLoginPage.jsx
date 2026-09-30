import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  FiLock, 
  FiMail, 
  FiEye, 
  FiEyeOff, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiKey,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const AdminLoginPage = () => {
  const { login, logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Target destination after successful admin login
  const fromLocation = location.state?.from?.pathname || '/admin/dashboard';

  // If already authenticated with admin privileges, redirect immediately
  useEffect(() => {
    const hasAdminRole = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff';
    if (isAuthenticated && hasAdminRole) {
      navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, user, navigate, fromLocation]);

  // Handle strictly validated Admin Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your administrator email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      const loggedInRole = res?.user?.role;
      if (loggedInRole === 'admin' || loggedInRole === 'manager' || loggedInRole === 'staff') {
        setSuccessMessage('Admin verified successfully. Entering Control Center...');
        setTimeout(() => {
          navigate(fromLocation, { replace: true });
        }, 600);
      } else {
        // Logged in user is regular customer - strictly deny admin access
        await logout();
        setErrorMessage('Access Denied: This account does not possess administrator privileges.');
      }
    } catch (err) {
      console.error('Admin authentication error:', err);
      setErrorMessage(
        err.response?.data?.message || 
        err.message || 
        'Invalid admin credentials. Access denied.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for admin testing
  const handleFillAdminCredentials = () => {
    setEmail('admin@rubikerworld.com');
    setPassword('Admin@123456');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#c81e2b] selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,30,43,0.18),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#c81e2b]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-[#070b14]/80 backdrop-blur-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
        >
          <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#c81e2b]" />
          <span>Back to Storefront</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Secure Admin Gateway</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[440px] bg-slate-900/90 border border-slate-800/90 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl shadow-black/90 space-y-6">
          
          {/* Official RU BIKER WORLD Brand Logo Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner mx-auto backdrop-blur-sm">
              <img 
                src="/ru_biker_world-removebg-preview.png" 
                alt="RU BIKER WORLD Logo" 
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
                onError={(e) => {
                  // Fallback to stylized brand badge if image path changes
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center gap-2 px-4 py-2 bg-[#c81e2b] rounded-xl text-white font-black text-lg tracking-wider">
                RU BIKER WORLD
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Admin Control Center
              </h1>
              <p className="text-[11px] font-bold text-amber-400 tracking-widest uppercase mt-0.5">
                Authorized Personnel Only
              </p>
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Enter your verified administrator credentials to access inventory, orders & store settings.
            </p>
          </div>

          {/* Error / Success Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-fadeIn">
              <FiAlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Secure Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Administrator Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rubikerworld.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm font-medium focus:outline-none focus:border-[#c81e2b] focus:ring-2 focus:ring-[#c81e2b]/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white placeholder:text-slate-600 text-sm font-medium focus:outline-none focus:border-[#c81e2b] focus:ring-2 focus:ring-[#c81e2b]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-[#c81e2b] focus:ring-[#c81e2b]/30 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  Remember administrator session
                </span>
              </label>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c81e2b] to-[#a31520] hover:from-[#d92230] hover:to-[#b81824] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#c81e2b]/25 hover:shadow-[#c81e2b]/40 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Admin Credentials...</span>
                </>
              ) : (
                <>
                  <FiLock className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Admin Credential Fill for authorized manager convenience */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleFillAdminCredentials}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <FiKey className="w-3.5 h-3.5 text-amber-400" />
              <span>Fill Admin Email & Password</span>
            </button>

            <span className="text-[10px] font-mono text-slate-500">
              Role: admin
            </span>
          </div>
        </div>
      </main>

      {/* Footer Security Badge */}
      <footer className="relative z-10 w-full py-4 text-center border-t border-slate-900 bg-[#070b14]/90 text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <FiShield className="w-3.5 h-3.5 text-[#c81e2b]" />
        <span>RU BIKER WORLD Enterprise Security • 256-Bit SSL Encrypted Admin Protocol</span>
      </footer>
    </div>
  );
};

export default AdminLoginPage;
