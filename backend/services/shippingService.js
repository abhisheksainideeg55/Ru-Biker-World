import shippingConfig from '../config/shippingConfig.js';

/**
 * Calculates shipping cost and details based on subtotal, method, and destination.
 *
 * @param {Object} params
 * @param {number} params.subtotal - Cart subtotal after items price calculation
 * @param {string} [params.shippingMethod='standard'] - 'standard' | 'express'
 * @param {Object} [params.address] - Optional delivery address with postalCode
 * @param {number} [params.totalQuantity=1] - Total items in cart
 * @returns {Object} shipping details { method, amount, originalFee, isFree, estimatedDays }
 */
export const calculateShipping = ({
  subtotal = 0,
  shippingMethod = 'standard',
  address = null,
  totalQuantity = 0,
}) => {
  const method = shippingConfig.SUPPORTED_METHODS.includes(shippingMethod)
    ? shippingMethod
    : 'standard';

  if (totalQuantity <= 0 || subtotal <= 0) {
    return {
      method,
      amount: 0,
      originalFee: 0,
      isFree: false,
      estimatedDays: method === 'express' ? shippingConfig.EXPRESS_ESTIMATED_DAYS : shippingConfig.STANDARD_ESTIMATED_DAYS,
    };
  }

  const isFreeEligible = subtotal >= shippingConfig.FREE_SHIPPING_THRESHOLD;

  if (method === 'standard') {
    const fee = shippingConfig.STANDARD_SHIPPING_FEE;
    const finalAmount = isFreeEligible ? 0 : fee;
    return {
      method: 'standard',
      amount: finalAmount,
      originalFee: fee,
      isFree: isFreeEligible,
      estimatedDays: shippingConfig.STANDARD_ESTIMATED_DAYS,
      threshold: shippingConfig.FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping: isFreeEligible ? 0 : Math.max(0, shippingConfig.FREE_SHIPPING_THRESHOLD - subtotal),
    };
  }

  if (method === 'express') {
    const fee = shippingConfig.EXPRESS_SHIPPING_FEE;
    return {
      method: 'express',
      amount: fee,
      originalFee: fee,
      isFree: false,
      estimatedDays: shippingConfig.EXPRESS_ESTIMATED_DAYS,
      threshold: shippingConfig.FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping: 0,
    };
  }

  return {
    method: 'standard',
    amount: shippingConfig.STANDARD_SHIPPING_FEE,
    originalFee: shippingConfig.STANDARD_SHIPPING_FEE,
    isFree: false,
    estimatedDays: shippingConfig.STANDARD_ESTIMATED_DAYS,
  };
};

export default {
  calculateShipping,
};
