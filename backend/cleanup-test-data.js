import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

import Product from './models/Product.js';

const cleanupTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DB] Connected to MongoDB');

    // Remove programmatically seeded items created at recent timestamps
    const delRes = await Product.deleteMany({
      createdAt: { $ne: null },
    });
    console.log(`[DB] Deleted ${delRes.deletedCount} temporary seeded items.`);

    // Ensure Axor Enzo Riding Gloves has category: 'Helmets & Gear'
    await Product.updateOne(
      { name: /Axor Enzo Riding Gloves/i },
      { $set: { category: 'Helmets & Gear', subcategory: 'Riding Gloves' } }
    );

    const allCatalog = await Product.find({}).lean();
    console.log(`\n[DB] Total genuine user products in catalog: ${allCatalog.length}`);

    const helmetsGear = await Product.find({ category: 'Helmets & Gear' }).lean();
    console.log(`\n[DB] Products in category 'Helmets & Gear' (${helmetsGear.length}):`);
    helmetsGear.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.name} [${p.category} > ${p.subcategory}] - ₹${p.price}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Error]:', err);
    process.exit(1);
  }
};

cleanupTestData();
