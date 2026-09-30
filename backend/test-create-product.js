import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import Product from './models/Product.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const testCreateProduct = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Test] MongoDB connected successfully');

    const sample = new Product({
      name: 'MT Thunder 4 SV Solid Gloss Helmet',
      slug: `mt-thunder-4-sv-${Date.now()}`,
      sku: `MZ-HLM-${Date.now().toString().slice(-6)}`,
      brand: 'MT Helmets',
      category: 'Helmets & Gear',
      subcategory: 'Full Face Helmets',
      price: 6499,
      originalPrice: 7999,
      discount: 18,
      stock: true,
      stockCount: 12,
      isActive: true,
      image: 'https://res.cloudinary.com/yxbjd9dw/image/upload/v1790668952/ru_biker_world/tests/o1r50t1cimhf1cgcnbqr.gif',
      images: ['https://res.cloudinary.com/yxbjd9dw/image/upload/v1790668952/ru_biker_world/tests/o1r50t1cimhf1cgcnbqr.gif'],
      description: 'ECE 22.06 & DOT certified aerodynamic sport touring full-face helmet with sun visor.',
      rating: 5.0,
    });

    const saved = await sample.save();
    console.log('[Test] Successfully created test product in MongoDB:', saved._id.toString(), saved.name);

    const count = await Product.countDocuments();
    console.log('[Test] Total products in database:', count);

    // Clean up test product
    await Product.findByIdAndDelete(saved._id);
    console.log('[Test] Cleaned up test product. Final count:', await Product.countDocuments());

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Test] Product creation test error:', error);
    process.exit(1);
  }
};

testCreateProduct();
