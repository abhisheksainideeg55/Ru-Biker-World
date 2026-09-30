import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from './models/Product.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const inspectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log(`[DB Info] Database Name: ${dbName}`);
    console.log(`[DB Info] Collections:`, collections.map(c => c.name));

    const products = await Product.find({}).lean();
    console.log(`[Products Count]: ${products.length}`);
    if (products.length > 0) {
      console.log('[Products List]:');
      products.forEach((p, idx) => {
        console.log(`\n--- Product #${idx + 1} ---`);
        console.log(`ID: ${p._id}`);
        console.log(`Name: ${p.name}`);
        console.log(`Price: ₹${p.price}`);
        console.log(`Category: ${p.category}`);
        console.log(`Brand: ${p.brand}`);
        console.log(`Image: ${p.image}`);
        console.log(`Images: ${JSON.stringify(p.images)}`);
        console.log(`Created At: ${p.createdAt}`);
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Error]:', err.message);
    process.exit(1);
  }
};

inspectDB();
