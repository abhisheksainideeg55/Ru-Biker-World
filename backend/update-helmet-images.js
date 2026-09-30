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

// Real authentic motorcycle helmet product image pools
const REAL_HELMET_IMAGES = {
  'Full Face Helmets': [
    {
      primary: '/typhoon_black_front_1790441788309.jpg',
      secondary: '/typhoon_black_back_1790441883479.jpg',
    },
    {
      primary: '/SMK-Stellar-Sports-Gloss-Black-GL200-1.webp',
      secondary: '/SMK-Stellar-Sports-Stage-Gloss-Black-Grey-Black-GL262-Helmet.webp',
    },
    {
      primary: '/StellarSportsSolidGloss-4.webp',
      secondary: '/SMK-GL200-01-Photoroom.png',
    },
    {
      primary: '/Blackgreygloss3d_jpg.webp',
      secondary: '/AZONIX-GL-263.webp',
    },
    {
      primary: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
      secondary: '/korda_helmets_sparify.png',
    },
  ],
  'Flip Up Helmets': [
    {
      primary: '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
      secondary: '/AZONIX-GL-263.webp',
    },
    {
      primary: '/AZONIX-GL-263.webp',
      secondary: '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
    },
    {
      primary: '/UNICOLOR-5-2-1.webp',
      secondary: '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
    },
  ],
  'Motocross Helmets': [
    {
      primary: '/allterra_matt_black_front_1790441917170.jpg',
      secondary: '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
    },
    {
      primary: '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
      secondary: '/smk-allterra-unicolor-_6.jpg',
    },
    {
      primary: '/smk-allterra-unicolor-_6.jpg',
      secondary: '/allterra_matt_black_front_1790441917170.jpg',
    },
  ],
  'Half Face Helmets': [
    {
      primary: '/korda_helmets_sparify.png',
      secondary: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    },
    {
      primary: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
      secondary: '/korda_helmets_sparify.png',
    },
    {
      primary: '/3VYlW4mX.webp',
      secondary: '/LRrXnGh9.webp',
    },
  ],
  'Retro Helmets': [
    {
      primary: '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
      secondary: '/RETRO-SEVEN-4-1.webp',
    },
    {
      primary: '/retro-ranko-graphics-gl-213-1-rtro-ranko-gl-213-s-55-full-face-original-imagn5gqfm3xyvth_1.webp',
      secondary: '/retro-ranko-gls213-design-aesthetic-coupled-full-face-size-m-1-original-imagdttgwnc3zm5f.webp',
    },
    {
      primary: '/RETRO-SEVEN-4-1.webp',
      secondary: '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
    },
  ],
};

const updateHelmetImages = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully!');

    // Find all helmets in the database
    const helmets = await Product.find({
      $or: [
        { category: /helmet/i },
        { subcategory: /helmet/i },
        { name: /helmet/i },
      ],
    });

    console.log(`Found ${helmets.length} total helmets to update with genuine helmet images...`);

    let updatedCount = 0;
    for (let i = 0; i < helmets.length; i++) {
      const helmet = helmets[i];
      const subcategory = helmet.subcategory || 'Full Face Helmets';
      const pool = REAL_HELMET_IMAGES[subcategory] || REAL_HELMET_IMAGES['Full Face Helmets'];
      const pair = pool[i % pool.length];

      helmet.image = pair.primary;
      helmet.images = [pair.primary, pair.secondary];
      await helmet.save();
      updatedCount++;

      if (updatedCount % 50 === 0 || updatedCount === helmets.length) {
        console.log(`Updated ${updatedCount} / ${helmets.length} helmets with genuine helmet photos.`);
      }
    }

    console.log('\n======================================================');
    console.log(`ALL ${updatedCount} HELMETS SUCCESSFULLY UPDATED WITH REAL HELMET PHOTOS!`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error updating helmet images:', error);
    process.exit(1);
  }
};

updateHelmetImages();
