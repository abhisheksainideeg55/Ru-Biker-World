import { useState, useEffect, useCallback } from 'react';
import { addressService } from '../services/addressService';
import { useNotifications } from './useNotifications';

// Clean up legacy localStorage
try {
  localStorage.removeItem('motozone_guest_addresses');
} catch {}

let memoryGuestAddresses = [];

export const useAddresses = () => {
  const [addresses, setAddresses] = useState(memoryGuestAddresses);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useNotifications() || {};

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await addressService.getAddresses();
      if (res && res.addresses) {
        setAddresses(res.addresses);
      } else {
        setAddresses(memoryGuestAddresses);
      }
    } catch (err) {
      setAddresses(memoryGuestAddresses);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (data) => {
    try {
      const res = await addressService.addAddress(data);
      if (res && res.addresses) {
        setAddresses(res.addresses);
        return res;
      }
    } catch (err) {
      // Memory fallback for guest
      const newAddr = {
        ...data,
        _id: `addr_guest_${Date.now()}`,
        id: `addr_guest_${Date.now()}`,
        createdAt: new Date(),
      };
      const updated = [newAddr, ...memoryGuestAddresses];
      memoryGuestAddresses = updated;
      setAddresses(updated);
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Delivery address saved.',
        });
      }
      return { success: true, data: newAddr, addresses: updated };
    }
  };

  const updateAddress = async (id, data) => {
    try {
      const res = await addressService.updateAddress(id, data);
      if (res && res.addresses) {
        setAddresses(res.addresses);
      } else {
        await fetchAddresses();
      }
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Delivery address updated successfully.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to update address.',
        });
      }
      throw err;
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await addressService.deleteAddress(id);
      if (res && res.addresses) {
        setAddresses(res.addresses);
      } else {
        await fetchAddresses();
      }
      if (addToast) {
        addToast({
          type: 'info',
          message: 'Address removed.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to delete address.',
        });
      }
      throw err;
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const res = await addressService.setDefaultAddress(id);
      if (res && res.addresses) {
        setAddresses(res.addresses);
      } else {
        await fetchAddresses();
      }
      if (addToast) {
        addToast({
          type: 'success',
          message: 'Default delivery address updated.',
        });
      }
      return res;
    } catch (err) {
      if (addToast) {
        addToast({
          type: 'error',
          message: err.message || 'Failed to set default address.',
        });
      }
      throw err;
    }
  };

  return {
    addresses,
    isLoading,
    error,
    refreshAddresses: fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};

export default useAddresses;
