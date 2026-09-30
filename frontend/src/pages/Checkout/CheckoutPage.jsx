import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutProvider } from '../../context/CheckoutContext';
import { useCheckout } from '../../hooks/useCheckout';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import {
  CheckoutLayout,
  CheckoutAddress,
  CheckoutShipping,
  OrderReview,
  PayNowButton,
  CheckoutLoader,
  CheckoutError,
} from '../../components/checkout';

const CheckoutContent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth() || {};
  const { items = [], isLoading: isCartLoading } = useCart();
  const { currentStep, goToStep, error, resetCheckout } = useCheckout();

  if (isCartLoading || isAuthLoading) {
    return <CheckoutLoader />;
  }

  // Authentication Required Gate
  if (!isAuthenticated) {
    return (
      <div className="py-16 min-h-[65vh] flex items-center justify-center">
        <div className="text-center p-8 sm:p-10 bg-white border border-slate-200/90 rounded-3xl max-w-md w-full shadow-card space-y-5">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold border border-amber-200/60 shadow-inner">
            🔒
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 font-display">
              Login to Continue Checkout
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Please sign in with your phone or email to save delivery addresses, track packages, and securely place your order.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login?redirect=/checkout')}
            className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md transition-all cursor-pointer"
          >
            Login / Sign Up Now →
          </button>
        </div>
      </div>
    );
  }

  // Blocked Account Security Gate
  const isUserBlocked = Boolean(user && (user.isActive === false || user.status === 'blocked' || user.status === 'temporarily_blocked'));

  if (isUserBlocked) {
    return (
      <div className="py-16 min-h-[65vh] flex items-center justify-center px-4">
        <div className="text-center p-8 sm:p-10 bg-white border border-rose-200 rounded-3xl max-w-md w-full shadow-xl space-y-5 animate-fadeIn">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold border border-rose-200 shadow-inner">
            🚫
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Account Suspended
            </h2>
            <p className="text-xs text-rose-700 mt-2 leading-relaxed font-semibold">
              Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => navigate('/account-blocked')}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer"
            >
              View Suspension Details & Support →
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-slate-200/80 rounded-2xl max-w-md w-full shadow-xs space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            🛒
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-sm transition-all"
          >
            Explore Spare Parts & Accessories →
          </button>
        </div>
      </div>
    );
  }

  return (
    <CheckoutLayout currentStep={currentStep} onStepClick={goToStep}>
      {/* Step 1: Delivery Address */}
      {currentStep === 1 && (
        <CheckoutAddress onContinue={() => goToStep(2)} />
      )}

      {/* Step 2: Shipping Method */}
      {currentStep === 2 && (
        <CheckoutShipping
          onBack={() => goToStep(1)}
          onContinue={() => goToStep(3)}
        />
      )}

      {/* Step 3: Order Review & Payment */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <OrderReview
            onEditAddress={() => goToStep(1)}
            onEditShipping={() => goToStep(2)}
          />
          <PayNowButton />
        </div>
      )}
    </CheckoutLayout>
  );
};

export const CheckoutPage = () => {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
};

export default CheckoutPage;
