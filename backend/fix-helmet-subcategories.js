import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

import Product from './models/Product.js';

const fixSubcategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DB] Connected to MongoDB');

    // Fix spelling 'Half Face Helmtes' -> 'Half Face Helmets'
    await Product.updateMany(
      { subcategory: /Half Face Helmtes/i },
      { $set: { subcategory: 'Half Face Helmets' } }
    );

    const helmetProds = await Product.find({ category: 'Helmets & Gear' }).lean();
    console.log(`\n[DB] Products under Category: 'Helmets & Gear':`);
    helmetProds.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.name} -> Category: [${p.category}], Subcategory: [${p.subcategory}]`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Error]:', err);
    process.exit(1);
  }
};

fixSubcategories();
