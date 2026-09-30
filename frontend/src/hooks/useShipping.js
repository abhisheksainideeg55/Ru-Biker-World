import { useState, useCallback } from 'react';
import { useCart } from './useCart';
import { useAddresses } from './useAddresses';

export const useShipping = () => {
  const { shipping, shippingMethod, shippingInfo, calculateShipping } = useCart();
  const { addresses, defaultAddress } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState(() => defaultAddress?._id || defaultAddress?.id || null);
  const [isCalculating, setIsCalculating] = useState(false);

  const changeShippingMethod = useCallback(
    async (method) => {
      setIsCalculating(true);
      try {
        await calculateShipping(selectedAddressId, method);
      } finally {
        setIsCalculating(false);
      }
    },
    [calculateShipping, selectedAddressId]
  );

  const selectDeliveryAddress = useCallback(
    async (addressId) => {
      setSelectedAddressId(addressId);
      setIsCalculating(true);
      try {
        await calculateShipping(addressId, shippingMethod);
      } finally {
        setIsCalculating(false);
      }
    },
    [calculateShipping, shippingMethod]
  );

  const selectedAddress = addresses?.find(
    (a) => String(a._id) === String(selectedAddressId) || String(a.id) === String(selectedAddressId)
  ) || defaultAddress;

  return {
    shipping,
    shippingMethod,
    shippingInfo,
    selectedAddress,
    selectedAddressId,
    addresses,
    isCalculating,
    changeShippingMethod,
    selectDeliveryAddress,
  };
};

export default useShipping;
