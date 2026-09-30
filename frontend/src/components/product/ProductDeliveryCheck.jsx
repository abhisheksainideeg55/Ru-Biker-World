import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiPercent, FiCopy, FiCheck, FiShare2 } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaPinterestP, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { useNotifications } from '../../hooks/useNotifications';

export const ProductDeliveryCheck = ({ product }) => {
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const { addToast } = useNotifications() || {};

  const handleCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      if (addToast) addToast({ type: 'warning', message: 'Please enter a valid 6-digit Pincode' });
      return;
    }
    setDeliveryInfo({
      pincode: pincode.trim(),
      dispatch: 'Ships within 24 hours',
      deliveryDate: 'Delivery in 2–4 business days',
      cod: 'Cash on Delivery Available',
    });
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (addToast) addToast({ type: 'success', message: `Coupon code "${code}" copied!` });
    setTimeout(() => setCopied(false), 2500);
  };

  const shareUrl = window.location.href;
  const shareTitle = product?.name || 'Check out this product on RU BIKER world';

  return (
    <div className="space-y-4 pt-1">
      {/* RU BIKER world Assured & Social Share Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* RU BIKER world Assured Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs">
          <span className="text-[#00e676] text-sm font-black tracking-tighter">RU BIKER world</span>
          <span className="text-slate-200 font-semibold tracking-wide text-[11px]">Assured</span>
        </div>

        {/* Social Share Icons */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors text-xs"
            title="Share on WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors text-xs"
            title="Share on Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#E60023] hover:text-white flex items-center justify-center transition-colors text-xs"
            title="Share on Pinterest"
          >
            <FaPinterestP />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors text-xs"
            title="Share on Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors text-xs"
            title="Share via Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      {/* Check Estimated Delivery Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
        <label htmlFor="pincode-input" className="block text-xs font-bold text-slate-800">
          Check Estimated Delivery
        </label>
        <form onSubmit={handleCheck} className="flex gap-2">
          <input
            id="pincode-input"
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter Pincode"
            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white hover:bg-neutral-800 px-5 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Check
          </button>
        </form>

        {deliveryInfo && (
          <div className="text-xs text-emerald-700 font-semibold pt-1 flex items-center gap-1.5">
            <FiTruck className="w-4 h-4" />
            <span>{deliveryInfo.dispatch} • {deliveryInfo.deliveryDate}</span>
          </div>
        )}
      </div>

      {/* Snapmint Pay in 3 Box */}
      <div className="bg-[#fcfdfd] border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#00e676] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded tracking-wide uppercase">
            NEW
          </span>
          <div className="text-slate-700 leading-tight">
            <span>or </span>
            <strong className="text-black font-bold">
              ₹{Math.round((product?.price || 6650) / 4).toLocaleString('en-IN')}/month
            </strong>{' '}
            <span>(4 months)</span>
            <div className="text-[11px] text-slate-500 font-medium">
              0% EMI on UPI | <strong className="text-slate-800">snapmint</strong>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (addToast) addToast({ type: 'info', message: 'Snapmint 0% EMI available at checkout!' });
          }}
          className="bg-black text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-neutral-800 whitespace-nowrap"
        >
          View Plans
        </button>
      </div>

      {/* Exchange Information */}
      <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 pt-2">
        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
          <span className="text-emerald-600 font-bold">✓</span>
          <span>Exchange within 7 days</span>
        </div>
        <Link to="/terms" className="text-slate-500 hover:text-black underline text-[11px]">
          How it works
        </Link>
      </div>

      {/* Coupon Promo Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FiPercent className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900 leading-tight">
              5% off for returning customers shopping above 3000₹.
            </p>
            <p className="text-[11px] text-orange-950 font-bold mt-0.5 tracking-wider">
              THANKYOU
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopyCoupon('THANKYOU')}
          className="px-3 py-1.5 rounded-md bg-white border border-orange-300 text-orange-900 text-xs font-bold hover:bg-orange-100 flex items-center gap-1 shrink-0 transition-colors"
        >
          {copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
          <span>{copied ? 'Copied' : 'Click to copy'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDeliveryCheck;
