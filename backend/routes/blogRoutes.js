import express from 'express';
import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogCategories,
  getRelatedPosts,
  searchBlogPosts,
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/categories', getBlogCategories);
router.get('/search', searchBlogPosts);
router.get('/:slug', getBlogPostBySlug);
router.get('/:slug/related', getRelatedPosts);

export default router;
