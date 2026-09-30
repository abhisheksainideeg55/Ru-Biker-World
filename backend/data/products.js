import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Clean initial empty catalog array (Admin creates all products)
export const rawProducts = [];

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * Resolves a product by ID, Slug, or SKU from MongoDB.
 * @param {string} identifier - product id, string id, or slug
 * @returns {Promise<Object|null>} product document or plain object
 */
export const getProductByIdOrSlug = async (identifier) => {
  if (!identifier) return null;
  const strId = String(identifier);

  if (isDbConnected()) {
    try {
      let query = [];
      if (mongoose.Types.ObjectId.isValid(strId)) {
        query.push({ _id: strId });
      }
      query.push({ id: strId });
      query.push({ slug: strId });
      query.push({ sku: strId });

      const product = await Product.findOne({ $or: query, isActive: true });
      if (product) return product;
    } catch {
      // Return null if not found
    }
  }

  return null;
};

export default {
  rawProducts,
  getProductByIdOrSlug,
};
