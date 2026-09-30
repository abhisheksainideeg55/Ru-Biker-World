import mongoose from 'mongoose';
import User from '../models/User.js';
import { localUserStore } from './authController.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const validateAddressInput = (data) => {
  const errors = {};
  const { fullName, phone, addressLine1, city, state, postalCode } = data;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
  if (!phone || typeof phone !== 'string') {
    errors.phone = 'Phone number is required.';
  } else {
    const cleanPhone = phone.replace(/[\s\-]/g, '');
    if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number.';
    }
  }

  if (!addressLine1 || typeof addressLine1 !== 'string' || !addressLine1.trim()) {
    errors.addressLine1 = 'Street address / Address line 1 is required.';
  }

  if (!city || typeof city !== 'string' || !city.trim()) {
    errors.city = 'City is required.';
  }

  if (!state || typeof state !== 'string' || !state.trim()) {
    errors.state = 'State is required.';
  }

  const pinRegex = /^[1-9][0-9]{5}$/;
  if (!postalCode || typeof postalCode !== 'string' || !pinRegex.test(postalCode.trim())) {
    errors.postalCode = 'Please enter a valid 6-digit Indian PIN code.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * @desc    Get all saved delivery addresses for authenticated customer
 * @route   GET /api/users/me/addresses
 * @access  Private
 */
export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      return res.status(200).json({
        success: true,
        addresses: user.addresses || [],
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      const addresses = user?.addresses || [];
      return res.status(200).json({
        success: true,
        addresses,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new delivery address
 * @route   POST /api/users/me/addresses
 * @access  Private
 */
export const addAddress = async (req, res, next) => {
  try {
    const { isValid, errors } = validateAddressInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0] || 'Invalid address data',
        errors,
      });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      type,
      isDefault,
    } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      // If user has no addresses yet, make this first one default automatically
      const makeDefault = isDefault || !user.addresses || user.addresses.length === 0;

      if (makeDefault && user.addresses) {
        user.addresses.forEach((addr) => {
          addr.isDefault = false;
        });
      }

      const newAddress = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2 ? addressLine2.trim() : '',
        landmark: landmark ? landmark.trim() : '',
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country ? country.trim() : 'India',
        type: ['Home', 'Work', 'Other'].includes(type) ? type : 'Home',
        isDefault: makeDefault,
      };

      user.addresses.push(newAddress);
      await user.save();

      const created = user.addresses[user.addresses.length - 1];
      return res.status(201).json({
        success: true,
        message: 'Address added successfully.',
        address: created,
        addresses: user.addresses,
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      if (!user) {
        user = {
          _id: userId,
          id: userId,
          name: req.user.name || 'Rahul Sharma',
          email: req.user.email || 'rahul@motozone.in',
          addresses: [],
        };
        localUserStore.set(user.email, user);
      }

      if (!user.addresses) user.addresses = [];

      const makeDefault = isDefault || user.addresses.length === 0;
      if (makeDefault) {
        user.addresses.forEach((a) => {
          a.isDefault = false;
        });
      }

      const newAddress = {
        _id: 'addr_' + Date.now(),
        id: 'addr_' + Date.now(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2 ? addressLine2.trim() : '',
        landmark: landmark ? landmark.trim() : '',
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country ? country.trim() : 'India',
        type: ['Home', 'Work', 'Other'].includes(type) ? type : 'Home',
        isDefault: makeDefault,
        createdAt: new Date().toISOString(),
      };

      user.addresses.push(newAddress);

      return res.status(201).json({
        success: true,
        message: 'Address added successfully.',
        address: newAddress,
        addresses: user.addresses,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a delivery address
 * @route   PUT /api/users/me/addresses/:addressId
 * @access  Private
 */
export const updateAddress = async (req, res, next) => {
  try {
    const { isValid, errors } = validateAddressInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0] || 'Invalid address data',
        errors,
      });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    const { addressId } = req.params;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found.',
        });
      }

      const {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        postalCode,
        country,
        type,
        isDefault,
      } = req.body;

      if (isDefault) {
        user.addresses.forEach((addr) => {
          addr.isDefault = false;
        });
        address.isDefault = true;
      }

      address.fullName = fullName.trim();
      address.phone = phone.trim();
      address.addressLine1 = addressLine1.trim();
      address.addressLine2 = addressLine2 !== undefined ? addressLine2.trim() : address.addressLine2;
      address.landmark = landmark !== undefined ? landmark.trim() : address.landmark;
      address.city = city.trim();
      address.state = state.trim();
      address.postalCode = postalCode.trim();
      if (country) address.country = country.trim();
      if (type) address.type = type;

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Address updated successfully.',
        address,
        addresses: user.addresses,
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      const address = user?.addresses?.find((a) => a._id === addressId || a.id === addressId);
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found.',
        });
      }

      if (req.body.isDefault) {
        user.addresses.forEach((a) => {
          a.isDefault = false;
        });
        address.isDefault = true;
      }

      address.fullName = req.body.fullName.trim();
      address.phone = req.body.phone.trim();
      address.addressLine1 = req.body.addressLine1.trim();
      address.addressLine2 = req.body.addressLine2 !== undefined ? req.body.addressLine2.trim() : address.addressLine2;
      address.landmark = req.body.landmark !== undefined ? req.body.landmark.trim() : address.landmark;
      address.city = req.body.city.trim();
      address.state = req.body.state.trim();
      address.postalCode = req.body.postalCode.trim();
      if (req.body.country) address.country = req.body.country.trim();
      if (req.body.type) address.type = req.body.type;

      return res.status(200).json({
        success: true,
        message: 'Address updated successfully.',
        address,
        addresses: user.addresses,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a delivery address
 * @route   DELETE /api/users/me/addresses/:addressId
 * @access  Private
 */
export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { addressId } = req.params;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found.',
        });
      }

      const wasDefault = address.isDefault;
      user.addresses.pull({ _id: addressId });

      // If deleted address was default and remaining addresses exist, assign first one as default
      if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Address deleted successfully.',
        addresses: user.addresses,
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      const index = user?.addresses?.findIndex((a) => a._id === addressId || a.id === addressId);
      if (index === -1 || index === undefined) {
        return res.status(404).json({
          success: false,
          message: 'Address not found.',
        });
      }

      const wasDefault = user.addresses[index].isDefault;
      user.addresses.splice(index, 1);

      if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      return res.status(200).json({
        success: true,
        message: 'Address deleted successfully.',
        addresses: user.addresses,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Set address as default
 * @route   PATCH /api/users/me/addresses/:addressId/default
 * @access  Private
 */
export const setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { addressId } = req.params;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found.',
        });
      }

      user.addresses.forEach((a) => {
        a.isDefault = a._id.toString() === addressId;
      });

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Default address updated.',
        addresses: user.addresses,
      });
    } else {
      let user = null;
      for (const u of localUserStore.values()) {
        if (u._id === userId || u.id === userId) {
          user = u;
          break;
        }
      }

      const address = user?.addresses?.find((a) => a._id === addressId || a.id === addressId);
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found.',
        });
      }

      user.addresses.forEach((a) => {
        a.isDefault = a._id === addressId || a.id === addressId;
      });

      return res.status(200).json({
        success: true,
        message: 'Default address updated.',
        addresses: user.addresses,
      });
    }
  } catch (error) {
    next(error);
  }
};
