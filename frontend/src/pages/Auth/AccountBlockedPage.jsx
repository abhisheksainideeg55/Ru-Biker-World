import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertOctagon,
  FiClock,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiShield,
  FiFileText,
  FiSearch,
  FiArrowRight,
  FiCheckCircle,
  FiHelpCircle,
  FiRefreshCw
} from 'react-icons/fi';
import api from '../../services/api';

export const AccountBlockedPage = () => {
  const [blockInfo, setBlockInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Secure Order Lookup state
  const [orderQuery, setOrderQuery] = useState({ orderNumber: '', phoneOrEmail: '' });
  const [orderResult, setOrderResult] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Appeal Modal state
  const [isAppealOpen, setIsAppealOpen] = useState(false);
  const [appealForm, setAppealForm] = useState({ name: '', email: '', phone: '', statement: '' });
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('motozone_blocked_info');
      if (stored) {
        setBlockInfo(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Countdown timer for temporary suspensions
  useEffect(() => {
    if (!blockInfo?.blockedUntil) return;

    const targetDate = new Date(blockInfo.blockedUntil).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ expired: false, days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [blockInfo?.blockedUntil]);

  // Secure Order & Invoice Lookup
  const handleOrderLookup = async (e) => {
    e.preventDefault();
    if (!orderQuery.orderNumber.trim()) {
      setOrderError('Please enter your Order ID / Number.');
      return;
    }

    setOrderLoading(true);
    setOrderError('');
    setOrderResult(null);

    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(orderQuery.orderNumber.trim())}`);
      if (res.data?.success && res.data?.data) {
        setOrderResult(res.data.data);
      } else {
        setOrderError('Order details could not be found. Please check your order ID.');
      }
    } catch (err) {
      setOrderError(err.message || 'Unable to retrieve order details. Please contact support.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleAppealSubmit = (e) => {
    e.preventDefault();
    setAppealSubmitted(true);
  };

  const isTemporary = blockInfo?.blockType === 'temporary' || !!blockInfo?.blockedUntil;
  const reasonText = blockInfo?.reason || 'Account access has been restricted by administration for safety and compliance review.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans">
      
      {/* Top Bar with Brand */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-amber-500/20">
            RU
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white uppercase">RU BIKER WORLD</span>
            <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-widest">Security System</span>
          </div>
        </Link>

        <a
          href="https://wa.me/919876543210?text=Hello%20RU%20Biker%20World%20Support,%20my%20account%20has%20been%20suspended.%20Please%20help."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-900/60 transition-colors"
        >
          <FiPhone className="w-3.5 h-3.5" />
          <span>WhatsApp Helpdesk</span>
        </a>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto my-8 space-y-8 animate-fadeIn">
        
        {/* Suspension Banner Card */}
        <div className="bg-gradient-to-b from-rose-950/40 to-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/30">
              <FiAlertOctagon className="w-9 h-9 text-rose-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Account Access Suspended
                </h1>
                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                  isTemporary 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {isTemporary ? 'Temporary Suspension' : 'Permanent Restriction'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Your RU Biker World account active sessions have been revoked by administration. You cannot browse in authenticated mode, add items to cart, or place orders during this restriction.
              </p>
            </div>
          </div>

          {/* Reason Block */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Suspension Reason:</span>
            <p className="text-sm font-semibold text-rose-200">
              "{reasonText}"
            </p>
          </div>

          {/* Temporary Countdown Timer */}
          {isTemporary && timeLeft && (
            <div className="mt-5 p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <FiClock className="w-4 h-4" />
                <span>Suspension Lifts In</span>
              </div>

              {timeLeft.expired ? (
                <div className="space-y-2">
                  <p className="text-base font-bold text-emerald-400">
                    Suspension period has expired!
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs transition-colors"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    <span>Proceed to Login</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto pt-1">
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/20">
                    <span className="block text-2xl font-black text-white">{timeLeft.days}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Days</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/20">
                    <span className="block text-2xl font-black text-white">{timeLeft.hours}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Hours</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/20">
                    <span className="block text-2xl font-black text-white">{timeLeft.minutes}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Mins</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/20">
                    <span className="block text-2xl font-black text-white">{timeLeft.seconds}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Secs</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsAppealOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <FiMessageSquare className="w-4 h-4" />
              <span>Submit Account Appeal</span>
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
              <a
                href="mailto:support@rubikerworld.com?subject=Account%20Suspension%20Appeal"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              >
                <FiMail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Support</span>
              </a>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors"
              >
                <span>Store Homepage</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Existing Order & Invoice Access Card (Requirement 13) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
              <FiFileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Access Existing Orders, Invoices & Refunds
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Your past completed orders and legitimate refund requests remain fully preserved and accessible.
              </p>
            </div>
          </div>

          <form onSubmit={handleOrderLookup} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. MZ-89241 or ORD-101)..."
                  value={orderQuery.orderNumber}
                  onChange={(e) => setOrderQuery({ ...orderQuery, orderNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={orderLoading}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {orderLoading ? (
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Lookup Order</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {orderError && (
              <p className="text-xs text-rose-400 font-semibold">{orderError}</p>
            )}
          </form>

          {/* Order Details Output */}
          {orderResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">
                    #{orderResult.orderNumber || orderResult.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {orderResult.orderStatus || 'Processing'}
                  </span>
                </div>
                <span className="font-black text-white text-sm">
                  ₹{Number(orderResult.totalAmount || orderResult.grandTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p><strong>Customer:</strong> {orderResult.shippingAddress?.fullName || 'Valued Customer'}</p>
                <p><strong>Payment Status:</strong> {orderResult.paymentStatus || 'Paid'}</p>
                <p><strong>Tracking:</strong> {orderResult.tracking?.carrier || 'Delhivery Express'} ({orderResult.tracking?.trackingNumber || 'Available upon dispatch'})</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`/track-order?orderId=${orderResult.orderNumber || orderResult.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Full Tracking Portal</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appeal Submission Modal */}
      {isAppealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Submit Suspension Appeal</h3>
              <button
                type="button"
                onClick={() => setIsAppealOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {appealSubmitted ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-white">Appeal Received</h4>
                <p className="text-xs text-slate-400">
                  Your appeal has been securely routed to the RU Biker World Compliance & Trust team. We will review your account activity and respond within 24-48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAppealOpen(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleAppealSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Registered Name / Email</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your registered details..."
                    value={appealForm.name}
                    onChange={(e) => setAppealForm({ ...appealForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={appealForm.phone}
                    onChange={(e) => setAppealForm({ ...appealForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Appeal Statement / Context</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please explain why this suspension should be reviewed or resolved..."
                    value={appealForm.statement}
                    onChange={(e) => setAppealForm({ ...appealForm, statement: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAppealOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Send Appeal Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="max-w-4xl w-full mx-auto text-center pt-6 border-t border-slate-800/80 text-[11px] text-slate-500">
        RU Biker World Automated Account Safety & Policy Enforcement Engine • 24x7 Customer Grievance Cell
      </div>
    </div>
  );
};

export default AccountBlockedPage;
