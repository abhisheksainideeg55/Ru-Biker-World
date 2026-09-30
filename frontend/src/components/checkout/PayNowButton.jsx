import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiTruck, FiLock } from 'react-icons/fi';
import RazorpayPayment from './RazorpayPayment';
import { useCheckout } from '../../hooks/useCheckout';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { checkoutService } from '../../services/checkoutService';

export const PayNowButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const { paymentMethod, selectedAddressId, selectedAddress, shippingMethod, isProcessing, setIsProcessing, error, setError, setCreatedOrder } = useCheckout();
  const { items = [], coupon, grandTotal, clearCart } = useCart();
  const { addToast } = useNotifications() || {};

  const isUserBlocked = Boolean(
    user && (user.isActive === false || user.status === 'blocked' || user.status === 'temporarily_blocked')
  );

  const handlePlaceCodOrder = async () => {
    if (isProcessing || isUserBlocked) {
      if (isUserBlocked) {
        navigate('/account-blocked');
      }
      return;
    }

    if (!selectedAddressId && !selectedAddress) {
      setError('Please select a valid delivery address.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const res = await checkoutService.placeOrder({
        shippingAddressId: selectedAddressId,
        shippingAddress: selectedAddress,
        items,
        coupon,
        shippingMethod,
        paymentMethod: 'cod',
      });

      if (res && res.success && res.data) {
        const orderData = res.data.order;
        setCreatedOrder(orderData);

        if (clearCart) await clearCart();
        if (addToast) {
          addToast({
            type: 'success',
            message: `Order #${orderData.orderNumber} confirmed! Pay upon delivery.`,
          });
        }
        navigate(`/order-confirmation/${orderData.orderNumber || orderData._id}`, {
          state: { order: orderData },
        });
      } else {
        throw new Error(res?.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('COD Order Error:', err);
      const isBlockedError =
        err.status === 403 ||
        err.code === 'ACCOUNT_BLOCKED' ||
        err.code === 'USER_ACCOUNT_BLOCKED' ||
        (err.message && err.message.toLowerCase().includes('restricted'));

      const errMsg = isBlockedError
        ? 'Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.'
        : (err.response?.data?.message || err.message || 'Failed to place order. Please try again.');

      setError(errMsg);
      if (addToast) addToast({ type: 'error', message: errMsg });

      if (isBlockedError) {
        window.dispatchEvent(new CustomEvent('motozone:account_blocked', { detail: err.response?.data }));
        navigate('/account-blocked');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentMethod === 'razorpay') {
    return <RazorpayPayment className={className} />;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {isUserBlocked && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
          <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-900">Account Access Suspended</p>
            <p className="text-[11px] text-rose-700 mt-0.5 font-medium">
              Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.
            </p>
          </div>
        </div>
      )}

      {error && !isUserBlocked && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700 font-medium">
          <FiAlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handlePlaceCodOrder}
        disabled={isProcessing || isUserBlocked}
        className={`w-full py-4 px-5 font-black rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all select-none ${
          isUserBlocked
            ? 'bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed shadow-none'
            : isProcessing
            ? 'bg-amber-500 opacity-80 cursor-wait text-slate-950'
            : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-md hover:shadow-lg cursor-pointer'
        }`}
      >
        {isUserBlocked ? (
          <span>Ordering Disabled (Account Blocked)</span>
        ) : isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <span>Confirming Your Order...</span>
          </>
        ) : (
          <>
            <FiTruck className="w-5 h-5" />
            <span>Place Order (Pay ₹{grandTotal.toLocaleString('en-IN')} on Delivery)</span>
          </>
        )}
      </button>

      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        <span>No advance payment needed • Pay with Cash or UPI on delivery</span>
      </div>
    </div>
  );
};

export default PayNowButton;
