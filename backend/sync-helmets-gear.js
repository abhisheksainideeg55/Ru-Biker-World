import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

import Product from './models/Product.js';

const syncHelmetsAndGear = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DB] Connected to MongoDB');

    // Update all gear & helmets in DB to have category 'Helmets & Gear'
    await Product.updateMany(
      {
        $or: [
          { name: /helmet/i },
          { name: /motocross/i },
          { name: /studds/i },
          { name: /gloves/i },
          { name: /boots/i },
          { name: /shoes/i },
          { category: /helmet/i },
          { category: /riding gear/i },
          { subcategory: /helmet/i },
          { subcategory: /riding/i },
        ],
      },
      {
        $set: {
          category: 'Helmets & Gear',
        },
      }
    );

    const prods = await Product.find({ category: 'Helmets & Gear', isActive: true }).lean();
    console.log(`[DB] Found ${prods.length} products with category 'Helmets & Gear':`);
    prods.forEach((p, i) => {
      console.log(`${i + 1}. [${p.category}] ${p.name} (Sub: ${p.subcategory}) - ₹${p.price}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Error]:', err);
    process.exit(1);
  }
};

syncHelmetsAndGear();
