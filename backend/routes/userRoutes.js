import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  removeAvatar,
  getPreferences,
  updatePreferences,
} from '../controllers/userController.js';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are private and protected
router.use(protect);

// Customer Profile & Security
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.put('/me/password', changePassword);
router.delete('/me/avatar', removeAvatar);
router.get('/me/preferences', getPreferences);
router.put('/me/preferences', updatePreferences);

// Delivery Address CRUD
router.get('/me/addresses', getAddresses);
router.post('/me/addresses', addAddress);
router.put('/me/addresses/:addressId', updateAddress);
router.delete('/me/addresses/:addressId', deleteAddress);
router.patch('/me/addresses/:addressId/default', setDefaultAddress);

// Wishlist
router.get('/me/wishlist', getWishlist);
router.post('/me/wishlist', addToWishlist);
router.delete('/me/wishlist/:productId', removeFromWishlist);

export default router;
