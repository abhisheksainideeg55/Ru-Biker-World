import express from 'express';
import reviewRoutes from './reviewRoutes.js';
import productAlertRoutes from './productAlertRoutes.js';
import {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  getBestSellingProducts,
  getRelatedProducts,
} from '../controllers/productController.js';

const router = express.Router();

// Product reviews nested sub-router
router.use('/:productId/reviews', reviewRoutes);

// Product alert subscriptions
router.use('/', productAlertRoutes);

// Featured products
router.get('/featured', getFeaturedProducts);

// Best selling products
router.get('/bestselling', getBestSellingProducts);

// Related products
router.get('/related/:id', getRelatedProducts);

// List products with full filters & search
router.get('/', getProducts);

// Single product details
router.get('/:id', getProductByIdOrSlug);

export default router;

