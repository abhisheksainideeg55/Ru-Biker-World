import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from './models/Product.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const cleanTest = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteOne({ slug: 'test-mobile-vibration-damper-2026' });
  console.log('Remaining products in MongoDB:', await Product.countDocuments());
  await mongoose.disconnect();
  process.exit(0);
};

cleanTest();
