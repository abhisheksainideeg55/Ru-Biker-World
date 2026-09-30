import express from 'express';
import { getProductCategories } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProductCategories);

export default router;
