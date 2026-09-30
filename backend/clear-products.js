import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Cart from './models/Cart.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore
}

dotenv.config();

const clearProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('[Error] MONGO_URI not found in environment');
      process.exit(1);
    }

    console.log('[Connecting] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[Connected] MongoDB connected successfully');

    const productCountBefore = await Product.countDocuments();
    console.log(`[Info] Current product count: ${productCountBefore}`);

    const result = await Product.deleteMany({});
    console.log(`[Success] Deleted ${result.deletedCount} products from database.`);

    // Also clean up any reviews or old cart product references
    await Review.deleteMany({});
    console.log('[Success] Cleaned up associated reviews.');

    // Clear cart items since products are deleted
    await Cart.updateMany({}, { $set: { items: [], totalAmount: 0 } });
    console.log('[Success] Reset active user carts.');

    const productCountAfter = await Product.countDocuments();
    console.log(`[Verified] Remaining products in database: ${productCountAfter}`);

    await mongoose.disconnect();
    console.log('[Done] Disconnected from MongoDB. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('[Error] Failed to clear products:', error.message);
    process.exit(1);
  }
};

clearProducts();
