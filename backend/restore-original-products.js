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

const BRANDS_TO_REMOVE = [
  'Simtac',
  'Philomax',
  'Philomex',
  'N gage',
  'N-Gage',
  'Rolon',
  'Simi racing',
  'Simi Racing',
  'Hjg',
  'HJG',
  'Silver stallion',
  'Silver Stallion',
  'Vesrah',
  'Hitech',
  'Moto torque',
  'Moto Torque',
  'Motul',
  '66bhp',
  'Motocare',
  'Studds',
  'Vega',
  'Steelbird',
  'Axor',
  'Smk',
  'SMK',
  'Grand pitstop',
  'Grand Pitstop',
  'Moto genius',
  'Moto Genius',
  'Auto bird',
  'Auto Bird',
];

const removeBrandProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas!');

    // Build case-insensitive brand regexes
    const brandRegexes = BRANDS_TO_REMOVE.map(
      (b) => new RegExp(`^${b.replace(/[-_]/g, '[-_ ]?')}$`, 'i')
    );

    const deleteResult = await Product.deleteMany({
      brand: { $in: brandRegexes },
    });

    console.log(`Deleted ${deleteResult.deletedCount} products belonging to the requested brands.`);

    const remainingProducts = await Product.find({}).lean();
    console.log(`Remaining products in database (${remainingProducts.length}):`);
    remainingProducts.forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.brand || 'No Brand'}] ${p.name} (SKU: ${p.sku || 'N/A'})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error removing brand products:', err);
    process.exit(1);
  }
};

removeBrandProducts();
