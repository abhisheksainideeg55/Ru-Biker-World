import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from './models/Product.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const syncProductToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Connected] MongoDB connected successfully');

    const productData = {
      name: 'Philomex Anti Vibration Damper for Bike Mobile Holder',
      slug: 'philomex-anti-vibration-damper-for-bike-mobile-holder',
      sku: 'SP-089250',
      brand: 'RU BIKER world Genuine Parts',
      category: 'Accessories & Touring',
      subcategory: 'Mobile Mounts & USB Fast Chargers',
      price: 399,
      originalPrice: 799,
      discount: 50,
      stock: true,
      stockCount: 15,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      ],
      description: 'Heavy duty anti-vibration damper module designed for bike smartphone holders. Protects optical image stabilization (OIS) sensors on rough roads.',
      shortDescription: 'Anti-vibration dampening module for motorcycle phone mounts.',
      shippingCharge: 99,
      weight: '1.2',
      dimensions: '30 x 20 x 15 cm',
      shippingTier: 'standard',
      isFreeShipping: false,
      rating: 5.0,
      reviewCount: 0,
      salesCount: 1,
    };

    const newProd = new Product(productData);
    const saved = await newProd.save();

    console.log('[Success] Saved product to MongoDB Atlas:');
    console.log('ID:', saved._id.toString());
    console.log('Name:', saved.name);
    console.log('Price:', saved.price);

    const totalInDB = await Product.countDocuments();
    console.log('[Info] Total products now in MongoDB:', totalInDB);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Error]:', err.message);
    process.exit(1);
  }
};

syncProductToMongoDB();
