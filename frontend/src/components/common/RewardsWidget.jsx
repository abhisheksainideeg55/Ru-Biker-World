import React, { useState, useRef, useEffect } from 'react';
import {
  FiX,
  FiAward,
  FiGift,
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiChevronRight,
  FiShare2,
  FiStar,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export const RewardsWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'earn' | 'redeem'
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  // Rewards state for logged-in users (in-memory runtime state)
  const [coins, setCoins] = useState(250);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const { loginWithOtp, isAuthenticated, user } = useAuth() || {};
  const { addToast } = useNotifications() || {};
  const otpInputsRef = useRef([]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (isOpen && step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, step, resendTimer]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const saveCoins = (newCoins) => {
    setCoins(newCoins);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setErrorMsg('');
    if (!isAuthenticated) {
      setStep('input');
    } else {
      setActiveTab('overview');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrorMsg('');
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    const cleaned = mobileNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.sendOtp(cleaned);
      setStep('otp');
      setResendTimer(30);
      setOtp(['', '', '', '']);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
      if (addToast) {
        addToast({
          type: 'info',
          message: `OTP sent to +91 ${cleaned}. (Enter any 4 digits to verify)`,
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      if (loginWithOtp) {
        await loginWithOtp({
          phone: mobileNumber.replace(/\D/g, ''),
          otp: enteredOtp,
        });
      }

      saveCoins(coins + 250);

      if (addToast) {
        addToast({
          type: 'success',
          message: 'Welcome to RU BIKER Rewards! 250 Bonus Coins credited 🎉',
        });
      }

      setStep('input');
      setActiveTab('overview');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) {
      if (addToast) {
        addToast({ type: 'info', message: 'You have already collected today’s check-in bonus!' });
      }
      return;
    }

    const next = coins + 20;
    saveCoins(next);
    setHasCheckedInToday(true);

    if (addToast) {
      addToast({
        type: 'success',
        message: 'Daily Check-In Complete! +20 RU BIKER Coins added 🪙',
      });
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (addToast) {
      addToast({ type: 'success', message: `Coupon code "${code}" copied to clipboard!` });
    }
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const coupons = [
    {
      code: 'RUBIKER100',
      title: '₹100 Flat Discount',
      desc: 'Valid on orders above ₹999 across all bike parts',
      cost: 200,
      badge: 'POPULAR',
    },
    {
      code: 'FREESHIP',
      title: 'Free Express Delivery',
      desc: 'Zero shipping charge on any order value',
      cost: 150,
      badge: 'HOT',
    },
    {
      code: 'RIDER10',
      title: '10% Extra Off',
      desc: 'Max discount up to ₹500 on helmets & riding gear',
      cost: 300,
      badge: 'VIP',
    },
  ];

  return (
    <>
      {/* 1. Floating Side Rewards Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-black text-white w-8 sm:w-9 py-3.5 px-1 shadow-2xl flex flex-col items-center justify-between hover:bg-neutral-900 transition-all duration-200 cursor-pointer select-none group border-l border-t border-b border-neutral-800 rounded-l-lg hover:border-amber-500/50"
          aria-label="Open RU BIKER Rewards"
        >
          {/* Vertical Text reading inward towards the screen */}
          <span
            className="text-white text-[12px] font-bold tracking-widest uppercase transition-colors select-none py-1 group-hover:text-sky-400"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            Rewards
          </span>

          {/* Orange Bullseye Badge Icon */}
          <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center shadow-md shrink-0 mt-2.5">
            <div className="w-3 h-3 rounded-full bg-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            </div>
          </div>
        </button>
      )}

      {/* 2. Rewards Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm select-none transition-all duration-300">
          {/* Backdrop Click to Close */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-[460px] bg-neutral-950 text-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-800 animate-fadeIn">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 px-6 pt-5 pb-4 border-b border-neutral-800">
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-neutral-800"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c81e2b] to-[#00a2e8] flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0">
                  <FiGift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    RU BIKER Rewards Club
                  </h2>
                  <p className="text-xs text-neutral-400 font-medium">
                    {isAuthenticated
                      ? `Welcome back, ${user?.name || 'Rider'}!`
                      : 'Earn Coins on Every Ride & Order'}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs if Authenticated */}
              {isAuthenticated && (
                <div className="flex items-center gap-1.5 mt-4 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'overview'
                        ? 'bg-[#c81e2b] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    My Coins
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('earn')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'earn'
                        ? 'bg-[#c81e2b] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Earn More
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('redeem')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'redeem'
                        ? 'bg-[#c81e2b] text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Coupons
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
              {!isAuthenticated ? (
                /* GUEST LOGIN / SIGNUP FLOW */
                <div>
                  {step === 'input' ? (
                    <div>
                      {/* Promo Banner */}
                      <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-red-600/15 via-sky-500/10 to-transparent border border-red-500/30 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                          <FiZap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-sky-400">
                            Instant +250 Welcome Coins
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            Sign in with your mobile number to unlock exclusive discounts.
                          </p>
                        </div>
                      </div>

                      {errorMsg && (
                        <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 text-center font-medium">
                          {errorMsg}
                        </div>
                      )}

                      <form onSubmit={handleSendOtp} className="space-y-3.5">
                        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus-within:border-red-500 transition-all">
                          <div className="flex items-center gap-1.5 pr-3 border-r border-neutral-700 mr-3 text-sm font-semibold text-neutral-300 select-none">
                            <span className="text-base leading-none">🇮🇳</span>
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
                            placeholder="Enter 10-digit Mobile Number"
                            className="w-full bg-transparent text-sm text-white font-medium placeholder:text-neutral-500 focus:outline-none"
                          />
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 focus-within:border-red-500 transition-all">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address (Optional)"
                            className="w-full bg-transparent text-sm text-white font-medium placeholder:text-neutral-500 focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || mobileNumber.replace(/\D/g, '').length !== 10}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c81e2b] to-[#00a2e8] hover:from-red-600 hover:to-sky-500 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] mt-2"
                        >
                          {isSubmitting ? 'SENDING OTP...' : 'GET OTP & CLAIM 250 COINS'}
                        </button>
                      </form>

                      {/* Benefits Checklist */}
                      <div className="mt-5 pt-4 border-t border-neutral-800/80 space-y-2">
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                          RU BIKER Club Privileges:
                        </p>
                        <div className="grid grid-cols-1 gap-1.5 text-xs text-neutral-300">
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>Earn 1 Coin per ₹10 spent on parts & gear</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>Redeem Coins for Flat ₹100 / Free Delivery coupons</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>Early access to seasonal bike parts flash sales</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* OTP VERIFICATION STEP */
                    <div>
                      <div className="text-center mb-5">
                        <h3 className="text-base font-bold text-white">Enter 4-Digit Code</h3>
                        <p className="text-xs text-neutral-400 mt-1">
                          Verification code sent to +91 {mobileNumber}
                        </p>
                      </div>

                      {errorMsg && (
                        <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 text-center font-medium">
                          {errorMsg}
                        </div>
                      )}

                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="flex items-center justify-center gap-2.5">
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
                              className="w-12 h-14 text-center text-xl font-black text-sky-400 border border-neutral-700 rounded-xl focus:border-amber-400 focus:outline-none bg-neutral-900 shadow-inner"
                            />
                          ))}
                        </div>

                        <div className="text-center">
                          {resendTimer > 0 ? (
                            <span className="text-xs font-semibold text-neutral-500">
                              Resend code in {resendTimer}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-xs font-bold text-sky-400 hover:text-amber-300 underline cursor-pointer"
                            >
                              Resend Code
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || otp.join('').length !== 4}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c81e2b] to-[#00a2e8] hover:from-red-600 hover:to-sky-500 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                        >
                          {isSubmitting ? 'VERIFYING...' : 'VERIFY & UNLOCK REWARDS'}
                        </button>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => setStep('input')}
                            className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                          >
                            Change Mobile Number
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                /* AUTHENTICATED USER REWARDS DASHBOARD */
                <div>
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Coins Balance Card */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/40 p-4 border border-red-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest">
                              Available Balance
                            </span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-3xl font-black text-white">{coins}</span>
                              <span className="text-xs font-bold text-sky-400">RU BIKER Coins</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              Worth ₹{(coins * 0.1).toFixed(0)} discount on your next checkout
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-[#c81e2b]/10 border border-red-500/30 flex items-center justify-center text-2xl">
                            🪙
                          </div>
                        </div>

                        {/* Tier Status */}
                        <div className="mt-4 pt-3 border-t border-neutral-800">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-neutral-400">Current Tier:</span>
                            <span className="font-bold text-sky-400">Silver Rider</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#c81e2b] to-[#00a2e8] rounded-full"
                              style={{ width: `${Math.min(100, (coins / 500) * 100)}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-1 text-right">
                            {Math.max(0, 500 - coins)} coins until Gold Tier
                          </p>
                        </div>
                      </div>

                      {/* Daily Check-In Bonus */}
                      <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                            <FiTrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Daily Check-In Bonus</p>
                            <p className="text-[11px] text-neutral-400">Claim +20 free coins every day</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleDailyCheckIn}
                          disabled={hasCheckedInToday}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            hasCheckedInToday
                              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              : 'bg-[#c81e2b] hover:bg-amber-400 text-black cursor-pointer shadow-md'
                          }`}
                        >
                          {hasCheckedInToday ? 'CLAIMED' : '+20 COINS'}
                        </button>
                      </div>

                      {/* Quick Redeem Banner */}
                      <button
                        type="button"
                        onClick={() => setActiveTab('redeem')}
                        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700/60 hover:border-amber-500/40 flex items-center justify-between text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                            <FiGift className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                              Redeem Exclusive Discount Codes
                            </p>
                            <p className="text-[11px] text-neutral-400">
                              Use your coins for instant order coupons
                            </p>
                          </div>
                        </div>
                        <FiChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                      </button>
                    </div>
                  )}

                  {activeTab === 'earn' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <FiStar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Write a Verified Review</p>
                            <p className="text-[10px] text-neutral-400">Earn +50 Coins per product reviewed</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-sky-400">+50</span>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                            <FiShare2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Refer a Rider Friend</p>
                            <p className="text-[10px] text-neutral-400">They get ₹100, you get 200 Coins</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-sky-400">+200</span>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                            <FiAward className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Shop Bike Parts</p>
                            <p className="text-[10px] text-neutral-400">Earn 10% value back in coins</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-sky-400">10%</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'redeem' && (
                    <div className="space-y-3">
                      {coupons.map((coupon) => (
                        <div
                          key={coupon.code}
                          className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-2 relative overflow-hidden"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">
                                  {coupon.title}
                                </span>
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                                  {coupon.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-400 mt-0.5">{coupon.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 mt-1">
                            <span className="font-mono text-xs font-bold text-sky-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800">
                              {coupon.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(coupon.code)}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#c81e2b] hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer"
                            >
                              {copiedCode === coupon.code ? (
                                <>
                                  <FiCheck className="w-3.5 h-3.5" />
                                  <span>COPIED</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy className="w-3.5 h-3.5" />
                                  <span>COPY CODE</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RewardsWidget;
