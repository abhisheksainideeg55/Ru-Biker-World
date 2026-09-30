import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from './models/Product.js';
import User from './models/User.js';
import Coupon from './models/Coupon.js';
import Offer from './models/Offer.js';
import { rawProducts } from '../frontend/src/data/products.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore
}

dotenv.config();

const sampleCoupons = [
  {
    code: 'WELCOME10',
    description: '10% instant discount on your first order',
    type: 'percentage',
    value: 10,
    minimumOrderAmount: 499,
    maximumDiscount: 300,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    usageLimit: 1000,
    isActive: true,
  },
  {
    code: 'RIDER500',
    description: 'Flat Rs 500 off on premium riding gear & parts',
    type: 'fixed',
    value: 500,
    minimumOrderAmount: 2999,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    isActive: true,
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping discount code',
    type: 'fixed',
    value: 100,
    minimumOrderAmount: 999,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    usageLimit: 2000,
    isActive: true,
  }
];

const sampleOffers = [
  {
    title: 'Super Biker Monsoon Sale',
    slug: 'super-biker-monsoon-sale',
    description: 'Get up to 30% off on all waterproof riding gears & auxiliary lights!',
    discountText: 'Up to 30% OFF',
    type: 'seasonal',
    couponCode: 'WELCOME10',
    bannerImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    title: 'Special Discount on Bike Accessories',
    slug: 'special-discount-bike-accessories',
    description: 'Flat Rs 500 off on orders above Rs 2999',
    discountText: 'Flat ₹500 OFF',
    type: 'flash_sale',
    couponCode: 'RIDER500',
    bannerImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200',
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    isActive: true,
  }
];

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[Seeder] Error: MONGO_URI is not set in backend/.env');
    process.exit(1);
  }

  try {
    console.log(`[Seeder] Connecting to MongoDB: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}...`);
    await mongoose.connect(mongoUri);
    console.log(`[Seeder] Connected to database: ${mongoose.connection.name}`);

    // 1. Clear existing collections if desired
    console.log('[Seeder] Clearing old collections...');
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Offer.deleteMany({});

    // 2. Seed Products
    if (rawProducts && rawProducts.length > 0) {
      console.log(`[Seeder] Seeding ${rawProducts.length} products...`);
      const sanitizedProducts = rawProducts.map((p) => {
        const { id, _id, ...rest } = p;
        return {
          ...rest,
          slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          sku: p.sku || `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          price: Number(p.price) || 0,
          originalPrice: Number(p.originalPrice || p.price) || 0,
          stock: p.stock !== undefined ? p.stock : true,
          stockCount: Number(p.stockCount) || 15,
          isActive: true,
        };
      });

      await Product.insertMany(sanitizedProducts, { ordered: false });
      console.log(`[Seeder] Successfully inserted ${sanitizedProducts.length} products into 'products' collection.`);
    }

    // 3. Seed Default Admin User if not exists
    const adminEmail = 'admin@rubikerworld.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log('[Seeder] Creating default Admin user...');
      await User.create({
        name: 'RU Biker Admin',
        email: adminEmail,
        password: 'Admin@123456',
        role: 'admin',
        phone: '9876543210',
        isEmailVerified: true,
      });
      console.log(`[Seeder] Admin user created: ${adminEmail} / Admin@123456`);
    } else {
      console.log(`[Seeder] Admin user already exists: ${adminEmail}`);
    }

    // 4. Seed Coupons
    console.log('[Seeder] Seeding promotional coupons...');
    await Coupon.insertMany(sampleCoupons);
    console.log('[Seeder] Coupons seeded successfully.');

    // 5. Seed Offers
    console.log('[Seeder] Seeding offers...');
    await Offer.insertMany(sampleOffers);
    console.log('[Seeder] Offers seeded successfully.');

    console.log('\n[Seeder] Database initialization for ru_biker_world complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
