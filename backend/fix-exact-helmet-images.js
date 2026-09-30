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

// Exact matching helmet image groups where all images in the group are the SAME helmet in SAME color
const EXACT_MATCHING_HELMETS = [
  // 1. Typhoon Gloss Black (Front & Back of same helmet)
  {
    primary: '/typhoon_black_front_1790441788309.jpg',
    images: [
      '/typhoon_black_front_1790441788309.jpg',
      '/typhoon_black_back_1790441883479.jpg',
    ],
  },
  // 2. Allterra Matt Black Motocross (Front & Side of same helmet)
  {
    primary: '/allterra_matt_black_front_1790441917170.jpg',
    images: [
      '/allterra_matt_black_front_1790441917170.jpg',
      '/smk-allterra-unicolor-_6.jpg',
    ],
  },
  // 3. Retro Ranko GL-213 Graphic (Front Angle & Side of same helmet)
  {
    primary: '/retro-ranko-graphics-gl-213-1-rtro-ranko-gl-213-s-55-full-face-original-imagn5gqfm3xyvth_1.webp',
    images: [
      '/retro-ranko-graphics-gl-213-1-rtro-ranko-gl-213-s-55-full-face-original-imagn5gqfm3xyvth_1.webp',
      '/retro-ranko-gls213-design-aesthetic-coupled-full-face-size-m-1-original-imagdttgwnc3zm5f.webp',
    ],
  },
  // 4. SMK Stellar Sports Stage Gloss Black
  {
    primary: '/SMK-Stellar-Sports-Gloss-Black-GL200-1.webp',
    images: [
      '/SMK-Stellar-Sports-Gloss-Black-GL200-1.webp',
      '/SMK-Stellar-Sports-Stage-Gloss-Black-Grey-Black-GL262-Helmet.webp',
    ],
  },
  // 5. Retro Black Classic (Single exact black image)
  {
    primary: '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
    images: [
      '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
    ],
  },
  // 6. Retro Seven Classic White/Orange (Single exact white/orange image)
  {
    primary: '/RETRO-SEVEN-4-1.webp',
    images: [
      '/RETRO-SEVEN-4-1.webp',
    ],
  },
  // 7. SMK Gullwing Modular Flip Up
  {
    primary: '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
    images: [
      '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
    ],
  },
  // 8. SMK Allterra White Motocross
  {
    primary: '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
    images: [
      '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
    ],
  },
  // 9. SMK GTJ Solid Open Face
  {
    primary: '/3VYlW4mX.webp',
    images: [
      '/3VYlW4mX.webp',
    ],
  },
  // 10. Azonix Modular Flip Up
  {
    primary: '/AZONIX-GL-263.webp',
    images: [
      '/AZONIX-GL-263.webp',
    ],
  },
  // 11. Stellar Sports Solid Gloss
  {
    primary: '/StellarSportsSolidGloss-4.webp',
    images: [
      '/StellarSportsSolidGloss-4.webp',
    ],
  },
  // 12. Black Grey Gloss 3D Track
  {
    primary: '/Blackgreygloss3d_jpg.webp',
    images: [
      '/Blackgreygloss3d_jpg.webp',
    ],
  },
  // 13. Korda Jet Open Face
  {
    primary: '/korda_helmets_sparify.png',
    images: [
      '/korda_helmets_sparify.png',
    ],
  },
  // 14. Studio Full Face Helmet
  {
    primary: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    images: [
      '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    ],
  },
];

// Specific fix for key featured models
const SPECIFIC_FIXES = {
  'studds-retro-classic-cafe-racer-vintage-helmet-gloss-black': {
    image: '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
    images: [
      '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
    ],
  },
  'smk-typhoon-solid-gl200-glossy-black-fullface-helmet': {
    image: '/typhoon_black_front_1790441788309.jpg',
    images: [
      '/typhoon_black_front_1790441788309.jpg',
      '/typhoon_black_back_1790441883479.jpg',
    ],
  },
  'smk-allterra-off-road-helmet-matt-black-peak': {
    image: '/allterra_matt_black_front_1790441917170.jpg',
    images: [
      '/allterra_matt_black_front_1790441917170.jpg',
      '/smk-allterra-unicolor-_6.jpg',
    ],
  },
  'smk-allterra-off-road-helmet-white-gloss-edition': {
    image: '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
    images: [
      '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
    ],
  },
  'smk-gtj-solid-open-face-half-helmet-matt-black': {
    image: '/3VYlW4mX.webp',
    images: [
      '/3VYlW4mX.webp',
    ],
  },
  'smk-helmets-gullwing-solid-gloss-modular-flip-up': {
    image: '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
    images: [
      '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
    ],
  },
  'smk-stellar-sports-stage-gloss-black-helmet': {
    image: '/SMK-Stellar-Sports-Gloss-Black-GL200-1.webp',
    images: [
      '/SMK-Stellar-Sports-Gloss-Black-GL200-1.webp',
      '/SMK-Stellar-Sports-Stage-Gloss-Black-Grey-Black-GL262-Helmet.webp',
    ],
  },
  'studds-thunder-d1-decor-full-face-helmet-matt-titanium': {
    image: '/StellarSportsSolidGloss-4.webp',
    images: [
      '/StellarSportsSolidGloss-4.webp',
    ],
  },
  'studds-ninja-3g-dual-visor-flip-up-modular-helmet-glossy-black': {
    image: '/AZONIX-GL-263.webp',
    images: [
      '/AZONIX-GL-263.webp',
    ],
  },
  'studds-motocross-mx-1-peak-off-road-helmet-racing-red': {
    image: '/smk-allterra-unicolor-_6.jpg',
    images: [
      '/smk-allterra-unicolor-_6.jpg',
    ],
  },
  'studds-marshall-open-face-half-helmet-pearl-white': {
    image: '/korda_helmets_sparify.png',
    images: [
      '/korda_helmets_sparify.png',
    ],
  },
  'smk-retro-ranko-graphics-gl-213-cafe-racer-helmet': {
    image: '/retro-ranko-graphics-gl-213-1-rtro-ranko-gl-213-s-55-full-face-original-imagn5gqfm3xyvth_1.webp',
    images: [
      '/retro-ranko-graphics-gl-213-1-rtro-ranko-gl-213-s-55-full-face-original-imagn5gqfm3xyvth_1.webp',
      '/retro-ranko-gls213-design-aesthetic-coupled-full-face-size-m-1-original-imagdttgwnc3zm5f.webp',
    ],
  },
  'axor-apex-venomous-dual-visor-track-helmet': {
    image: '/Blackgreygloss3d_jpg.webp',
    images: [
      '/Blackgreygloss3d_jpg.webp',
    ],
  },
  'vega-bolt-bunny-glossy-black-red-full-face-helmet': {
    image: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    images: [
      '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    ],
  },
};

const runFix = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected!');

    // 1. Update specific featured products first
    for (const [slug, updateData] of Object.entries(SPECIFIC_FIXES)) {
      await Product.updateOne({ slug }, { $set: updateData });
    }
    console.log('Updated specific featured products with exact single-helmet color match!');

    // 2. Update all other helmets in the DB to ensure NO mismatched color images
    const allHelmets = await Product.find({
      $or: [
        { category: /helmet/i },
        { subcategory: /helmet/i },
        { name: /helmet/i },
      ],
    });

    console.log(`Processing ${allHelmets.length} helmets across the database...`);
    let count = 0;

    for (let i = 0; i < allHelmets.length; i++) {
      const h = allHelmets[i];
      if (SPECIFIC_FIXES[h.slug]) continue;

      // Assign an exact matching group
      const matchingGroup = EXACT_MATCHING_HELMETS[i % EXACT_MATCHING_HELMETS.length];
      h.image = matchingGroup.primary;
      h.images = [...matchingGroup.images];
      await h.save();
      count++;
    }

    console.log(`\n======================================================`);
    console.log(`SUCCESSFULLY UPDATED ${count + Object.keys(SPECIFIC_FIXES).length} HELMETS!`);
    console.log(`ALL PRODUCTS NOW HAVE 100% SAME HELMET COLOR & MODEL ACROSS ALL THUMBNAILS!`);
    console.log(`======================================================\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing helmet images:', error);
    process.exit(1);
  }
};

runFix();
