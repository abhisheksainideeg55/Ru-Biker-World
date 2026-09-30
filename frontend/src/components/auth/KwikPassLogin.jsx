import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiX, FiCheck, FiEdit2, FiClock, FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { authService } from '../../services/authService';

export const KwikPassLogin = ({ onClose, isModal = false, onSuccess }) => {
  const { loginWithOtp } = useAuth();
  const { addToast } = useNotifications() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || location.state?.from?.pathname || '/account';

  // Step state: 'mobile' | 'otp'
  const [step, setStep] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [notifyUpdates, setNotifyUpdates] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  const otpInputsRef = useRef([]);

  // Timer countdown for OTP resend (30s expiry)
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Handle Mobile Submit
  const handleMobileSubmit = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    const cleaned = mobileNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.sendOtp(cleaned);
      if (res?.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setStep('otp');
      setResendTimer(30);
      setOtp(['', '', '', '']);
      if (addToast) {
        addToast({
          type: 'success',
          message: res?.devOtp
            ? `OTP sent to +91 ${cleaned}! Valid for 30s.`
            : `OTP sent successfully to +91 ${cleaned}! Valid for 30s.`,
        });
      }
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP box changes
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto advance to next box
    if (digit && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle OTP key navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasteData) {
      const newOtp = ['', '', '', ''];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasteData.length, 3);
      otpInputsRef.current[focusIndex]?.focus();
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setErrorMsg('Please enter the complete 4-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithOtp({
        phone: mobileNumber.replace(/\D/g, ''),
        otp: enteredOtp,
      });

      if (addToast) {
        addToast({
          type: 'success',
          message: `Welcome to RU BIKER WORLD, ${res.user?.name || 'Rider'}!`,
        });
      }

      if (onSuccess) {
        onSuccess(res);
      }

      if (onClose) {
        onClose();
      }

      if (!isModal) {
        navigate(redirectUrl, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await authService.sendOtp(mobileNumber.replace(/\D/g, ''));
      if (res?.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setResendTimer(30);
      if (addToast) {
        addToast({
          type: 'info',
          message: res?.devOtp
            ? `New OTP sent! Valid for 30s.`
            : 'A new OTP has been sent. Valid for 30 seconds.',
        });
      }
    } catch (err) {
      setErrorMsg('Failed to resend OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-200 shadow-2xl overflow-hidden border border-white/60 relative">
      {/* Close button if rendered as modal */}
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left Section: Branding & Perks (58% / 7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header: RU BIKER WORLD Logo + Powered by KwikPass */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-slate-700/20">
                <div className="bg-[#c81e2b] text-white font-black text-xl sm:text-2xl px-2.5 py-1 font-sans tracking-wider">
                  RU
                </div>
                <div className="bg-[#1e293b] text-white font-black text-xl sm:text-2xl px-3 py-1 font-sans tracking-wide">
                  BIKER WORLD
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 ml-1">
                <span>Powered by</span>
                <span className="text-gray-900 font-extrabold flex items-center">
                  Kwik<span className="text-amber-500">⚡</span>Pass
                </span>
              </div>
            </div>

            {/* Welcome Tagline */}
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-8">
              Welcome! Register to avail the best deals!
            </h2>

            {/* 3 Perks Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Perk 1 */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-3.5 border border-white/60 flex flex-col items-center text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-inner mb-2 border border-amber-200">
                  <span className="text-white text-base">⭐</span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-[13px] text-gray-900 leading-snug mb-1">
                  Zero Subscription Fees
                </h3>
                <p className="text-[10px] text-gray-600 leading-tight">
                  Access KwikPass without any subscription charges
                </p>
              </div>

              {/* Perk 2 */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-3.5 border border-white/60 flex flex-col items-center text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-inner mb-2 border border-amber-200">
                  <span className="text-white text-base">⭐</span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-[13px] text-gray-900 leading-snug mb-1">
                  Lowest price guaranteed
                </h3>
                <p className="text-[10px] text-gray-600 leading-tight">
                  Explore unbeatable prices and unmatchable value
                </p>
              </div>

              {/* Perk 3 */}
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-3.5 border border-white/60 flex flex-col items-center text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-inner mb-2 border border-amber-200">
                  <span className="text-white text-base">⭐</span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-[13px] text-gray-900 leading-snug mb-1">
                  100% secure & spam free
                </h3>
                <p className="text-[10px] text-gray-600 leading-tight">
                  Guaranteed data protection & spam-free inbox
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form Container (42% / 5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-gray-100 flex flex-col justify-between min-h-[400px]">
            {/* STEP 1: Enter Mobile Number */}
            {step === 'mobile' ? (
              <form onSubmit={handleMobileSubmit} className="flex flex-col justify-between h-full">
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                      Unlock Superior Discounts
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Enter Mobile Number
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 text-center font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Phone Input with +91 Flag */}
                  <div className="mb-4">
                    <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-800/10 transition-all bg-white">
                      <div className="flex items-center gap-1.5 pr-2.5 border-r border-gray-200 mr-2.5 text-xs font-bold text-gray-700 select-none">
                        <span className="text-base">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength="10"
                        autoFocus
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="Enter Mobile Number"
                        className="w-full bg-transparent text-sm text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-normal focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Updates Checkbox */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-600 font-medium">
                      <input
                        type="checkbox"
                        checked={notifyUpdates}
                        onChange={(e) => setNotifyUpdates(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <span>Notify me for any updates & offers</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || mobileNumber.replace(/\D/g, '').length !== 10}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gray-200 text-gray-800 hover:bg-slate-900 hover:text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Submit'}
                  </button>
                </div>

                {/* Footer Legal */}
                <div className="text-center pt-6 mt-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 leading-tight">
                    I accept that I have read & understood Gokwik's{' '}
                    <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span> and{' '}
                    <span className="underline cursor-pointer hover:text-gray-600">T&Cs</span>.
                  </p>
                </div>
              </form>
            ) : (
              /* STEP 2: OTP Verification */
              <form onSubmit={handleVerifyOtp} className="flex flex-col justify-between h-full">
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                      OTP Verification
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      We have sent verification code to
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm font-bold text-gray-900">
                        +91 {mobileNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setStep('mobile');
                          setErrorMsg('');
                        }}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-900 border border-gray-300 rounded-md px-1.5 py-0.5 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 text-center font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Prominent Generated OTP Banner with 1-Click Auto Fill */}
                  {devOtpHint && (
                    <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        <div>
                          <p className="text-[11px] font-bold text-amber-900 leading-tight">
                            Generated OTP:
                          </p>
                          <span className="font-mono font-black text-base tracking-widest text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300 inline-block mt-0.5">
                            {devOtpHint}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const digits = devOtpHint.split('').slice(0, 4);
                          setOtp(digits);
                          setErrorMsg('');
                          if (otpInputsRef.current[3]) {
                            otpInputsRef.current[3].focus();
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow transition-all active:scale-95 cursor-pointer"
                      >
                        Auto Fill ⚡
                      </button>
                    </div>
                  )}

                  {/* 4 Digit OTP Boxes */}
                  <div className="flex items-center justify-center gap-3 mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black text-gray-900 border-2 border-gray-200 rounded-2xl focus:border-slate-900 focus:outline-none transition-all bg-gray-50 focus:bg-white shadow-inner"
                      />
                    ))}
                  </div>

                  {/* Resend OTP Timer */}
                  <div className="text-center mb-6">
                    {resendTimer > 0 ? (
                      <span className="text-xs font-semibold text-gray-500 flex items-center justify-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        Resend OTP in {resendTimer} Sec
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || otp.join('').length !== 4}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gray-200 text-gray-800 hover:bg-slate-900 hover:text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KwikPassLogin;
