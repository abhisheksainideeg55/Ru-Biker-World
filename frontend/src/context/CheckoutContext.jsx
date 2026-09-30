import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useAddresses';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { checkoutService } from '../services/checkoutService';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { user } = useAuth() || {};
  const { addresses = [], defaultAddress, refreshAddresses } = useAddresses() || {};
  const { items, subtotal, discount, coupon, shipping, tax, grandTotal, clearCart } = useCart() || {};
  const { addToast } = useNotifications() || {};

  // Step state: 1: Delivery Address, 2: Shipping Method, 3: Review & Payment
  const [currentStep, setCurrentStep] = useState(1);

  // Address selection state (defaults to user's defaultAddress or first address)
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Shipping selection state
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Payment method: 'cod' (active default) | 'razorpay' (online)
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Processing & Payment statuses
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'creating_order' | 'awaiting_payment' | 'verifying' | 'success' | 'failed' | 'cancelled'
  const [error, setError] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Automatically select default address if available
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      if (def) setSelectedAddressId(def._id || def.id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find(
    (a) => String(a._id) === String(selectedAddressId) || String(a.id) === String(selectedAddressId)
  ) || defaultAddress || null;

  const selectAddress = useCallback((addressId) => {
    setSelectedAddressId(addressId);
    setError(null);
  }, []);

  const selectShipping = useCallback((method) => {
    setShippingMethod(method);
  }, []);

  const selectPaymentMethod = useCallback((method) => {
    setPaymentMethod(method);
  }, []);

  const goToStep = useCallback((step) => {
    setError(null);
    setCurrentStep(step);
  }, []);

  const resetCheckout = useCallback(() => {
    setIsProcessing(false);
    setPaymentStatus('idle');
    setError(null);
    setCreatedOrder(null);
  }, []);

  const value = {
    currentStep,
    goToStep,
    addresses,
    selectedAddressId,
    selectedAddress,
    selectAddress,
    shippingMethod,
    selectShipping,
    paymentMethod,
    selectPaymentMethod,
    isProcessing,
    setIsProcessing,
    paymentStatus,
    setPaymentStatus,
    error,
    setError,
    createdOrder,
    setCreatedOrder,
    resetCheckout,
    summary: {
      items,
      subtotal,
      discount,
      coupon,
      shipping,
      tax,
      grandTotal,
    },
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};

export default CheckoutContext;
