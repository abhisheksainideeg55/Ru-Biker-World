import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.join(__dirname, '.env') });

import Product from './models/Product.js';

const tagBikesToExistingProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas!');

    // Tag all existing universal accessories with top bike brands
    const allProducts = await Product.find({});
    console.log(`Found ${allProducts.length} products to tag with bike compatibility...`);

    for (const p of allProducts) {
      p.bikeBrands = [
        'KTM',
        'Royal Enfield',
        'Yamaha',
        'Kawasaki',
        'Bajaj',
        'TVS',
        'Honda',
        'BMW',
        'Piaggio',
        'Triumph',
        'Hero',
        'Universal',
      ];
      p.bikeModels = [
        'Duke 390',
        'RC 390',
        'Adventure 390',
        'Duke 250',
        'Duke 200',
        'Hunter 350',
        'Classic 350',
        'Himalayan 450',
        'Continental GT 650',
        'Interceptor 650',
        'R15 V4',
        'MT-15 V2',
        'Dominar 400',
        'Apache RR 310',
      ];
      await p.save();
    }

    console.log(`Successfully tagged ${allProducts.length} products with KTM & top bike compatibility!`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating bike compatibility:', err);
    process.exit(1);
  }
};

tagBikesToExistingProducts();
