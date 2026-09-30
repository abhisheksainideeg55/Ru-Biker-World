import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeGuestCart,
  applyCoupon,
  removeCoupon,
  getShippingQuote,
  saveForLater,
  removeSavedItem,
  moveToCart,
} from '../controllers/cartController.js';

const router = express.Router();

// All cart management routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addItem);
router.route('/items/:itemId')
  .put(updateItem)
  .delete(removeItem);

router.post('/merge', mergeGuestCart);
router.route('/coupon')
  .post(applyCoupon)
  .delete(removeCoupon);

router.post('/shipping-quote', getShippingQuote);
router.post('/save-for-later', saveForLater);
router.delete('/save-for-later/:itemId', removeSavedItem);
router.post('/move-to-cart', moveToCart);

export default router;
