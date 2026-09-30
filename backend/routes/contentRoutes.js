import express from 'express';
import {
  getContentByKey,
  updateContentByKey,
  getAllStoreContent,
} from '../controllers/contentController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllStoreContent);
router.get('/:key', getContentByKey);

// Admin protected update routes
router.put('/:key', requireAdmin, updateContentByKey);
router.post('/:key', requireAdmin, updateContentByKey);

export default router;
