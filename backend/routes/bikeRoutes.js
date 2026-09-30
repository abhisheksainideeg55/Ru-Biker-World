import express from 'express';
import { getProductBikes } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProductBikes);

export default router;
