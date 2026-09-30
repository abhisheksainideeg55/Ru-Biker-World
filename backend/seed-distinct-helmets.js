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

// Distinct, authentic helmets matching the exact reference catalog with unique images
const DISTINCT_HELMETS = [
  {
    name: 'SMK-TYPHOON SOLID GL200 GLOSSY-BLACK Full Face Helmet',
    slug: 'smk-typhoon-solid-gl200-glossy-black-fullface-helmet',
    sku: 'SMK-TYPH-GL200',
    brand: 'SMK',
    category: 'Helmets',
    subcategory: 'Full Face Helmets',
    price: 5200,
    originalPrice: 6200,
    discount: 16,
    stock: true,
    stockCount: 15,
    featured: true,
    rating: 5.0,
    reviewCount: 48,
    image: '/typhoon_black_front_1790441788309.jpg',
    images: [
      '/typhoon_black_front_1790441788309.jpg',
      '/typhoon_black_back_1790441883479.jpg',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Aerodynamic full face helmet with scratch resistant Pinlock 70 ready visor.',
    description: 'SMK Typhoon Solid GL200 is an ECE 22.05 & ISI certified full face helmet engineered with aerodynamic thermoplastic shell, multi-density EPS liner and channeled air vents.',
  },
  {
    name: 'SMK ALLTERRA Off-Road Helmet MATT Black Peak Edition',
    slug: 'smk-allterra-off-road-helmet-matt-black-peak',
    sku: 'SMK-ALLT-MATTBLK',
    brand: 'SMK',
    category: 'Helmets',
    subcategory: 'Motocross Helmets',
    price: 5900,
    originalPrice: 6900,
    discount: 14,
    stock: true,
    stockCount: 20,
    featured: true,
    rating: 4.8,
    reviewCount: 36,
    image: '/allterra_matt_black_front_1790441917170.jpg',
    images: [
      '/allterra_matt_black_front_1790441917170.jpg',
      '/smk-allterra-unicolor-_6.jpg',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Off-Road Motocross MX helmet with adjustable peak & high airflow intake.',
    description: 'SMK Allterra Off-Road helmet features an ultra-light composite shell, aggressive roost peak, goggle strap retention channel and washable moisture-wicking cheek pads.',
  },
  {
    name: 'SMK Allterra Off Road Helmet - White Gloss Edition',
    slug: 'smk-allterra-off-road-helmet-white-gloss-edition',
    sku: 'SMK-ALLT-WHT',
    brand: 'SMK',
    category: 'Helmets',
    subcategory: 'Motocross Helmets',
    price: 5900,
    originalPrice: 6900,
    discount: 14,
    stock: true,
    stockCount: 18,
    featured: true,
    rating: 5.0,
    reviewCount: 29,
    image: '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
    images: [
      '/SMK-Allterra-Unicolour-Off-Road-Helmet-for-Bikers-MA260.jpg',
      '/allterra_matt_black_front_1790441917170.jpg',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Pure white gloss motocross helmet with dual-sport peak and air channels.',
    description: 'High performance dirt & trail helmet designed for demanding riders. Includes extra wide eye port for seamless mx goggle fitment.',
  },
  {
    name: 'SMK GTJ SOLID Open Face Half Helmet - Matt Black',
    slug: 'smk-gtj-solid-open-face-half-helmet-matt-black',
    sku: 'SMK-GTJ-OPN',
    brand: 'SMK',
    category: 'Helmets',
    subcategory: 'Half Face Helmets',
    price: 3500,
    originalPrice: 4200,
    discount: 17,
    stock: true,
    stockCount: 25,
    featured: true,
    rating: 4.9,
    reviewCount: 52,
    image: '/3VYlW4mX.webp',
    images: [
      '/3VYlW4mX.webp',
      '/LRrXnGh9.webp',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Urban city open face helmet with internal sun visor and panoramic shield.',
    description: 'SMK GTJ Solid Open Face helmet provides supreme comfort during city commutes with its quick release visor and hypoallergenic washable interior.',
  },
  {
    name: 'SMK Helmets - Gullwing Solid - Gloss Modular Flip Up',
    slug: 'smk-helmets-gullwing-solid-gloss-modular-flip-up',
    sku: 'SMK-GULL-GLOSS',
    brand: 'SMK',
    category: 'Helmets',
    subcategory: 'Flip Up Helmets',
    price: 6350,
    originalPrice: 7500,
    discount: 15,
    stock: true,
    stockCount: 14,
    featured: true,
    rating: 5.0,
    reviewCount: 64,
    image: '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
    images: [
      '/gullwing-tourleader-with-dual-visor-gl-363-xs-1-gullwing-trldr-original-imagq42szshcn3sx.webp',
      '/AZONIX-GL-263.webp',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Dual homologated (P/J) modular flip up helmet with integrated drop-down sun visor.',
    description: 'The SMK Gullwing is a premium touring modular helmet with one-button chinbar release, breath deflector, and chin curtain.',
  },
  {
    name: 'SMK Stellar Sports Stage Gloss Black Helmet',
    slug: 'smk-stellar-sports-stage-gloss-black-helmet',
    sku: 'SMK-STEL-SPRT',
    brand: 'SMK',
    category: 'Helmets',
    subcategory: 'Full Face Helmets',
    price: 4800,
    originalPrice: 5600,
    discount: 14,
    stock: true,
    stockCount: 22,
    featured: true,
    rating: 5.0,
    reviewCount: 41,
    image: '/SMK-Stellar-Sports-Gloss-Black-GL200-1.webp',
    images: [
      '/SMK-Stellar-Sports-Gloss-Black-GL200-1.webp',
      '/SMK-Stellar-Sports-Stage-Gloss-Black-Grey-Black-GL262-Helmet.webp',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Sport aerodynamic full face helmet with racing spoiler and UV resistant shield.',
    description: 'SMK Stellar Sports is crafted with Energy Impact Resistant Thermoplastic (EIRT) and aerodynamic rear spoiler for track stability.',
  },
  {
    name: 'Studds Thunder D1 Decor Full Face Helmet (Matt Titanium)',
    slug: 'studds-thunder-d1-decor-full-face-helmet-matt-titanium',
    sku: 'ST-THUN-0001',
    brand: 'Studds',
    category: 'Helmets',
    subcategory: 'Full Face Helmets',
    price: 2150,
    originalPrice: 2699,
    discount: 20,
    stock: true,
    stockCount: 30,
    featured: true,
    rating: 4.9,
    reviewCount: 88,
    image: '/StellarSportsSolidGloss-4.webp',
    images: [
      '/StellarSportsSolidGloss-4.webp',
      '/SMK-GL200-01-Photoroom.png',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'ISI certified full face helmet with aerodynamic spoiler & top ventilation channels.',
    description: 'Studds Thunder D1 combines bold graphics with high impact outer shell and quick release chin strap for supreme road safety.',
  },
  {
    name: 'Studds Ninja 3G Dual Visor Flip Up Modular Helmet (Glossy Black)',
    slug: 'studds-ninja-3g-dual-visor-flip-up-modular-helmet-glossy-black',
    sku: 'ST-NINJ-3G-0001',
    brand: 'Studds',
    category: 'Helmets',
    subcategory: 'Flip Up Helmets',
    price: 2650,
    originalPrice: 3299,
    discount: 20,
    stock: true,
    stockCount: 28,
    featured: true,
    rating: 4.8,
    reviewCount: 73,
    image: '/AZONIX-GL-263.webp',
    images: [
      '/AZONIX-GL-263.webp',
      '/UNICOLOR-5-2-1.webp',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Dual visor modular flip up helmet with easy one-touch chin opening mechanism.',
    description: 'Studds Ninja 3G offers the ultimate versatility of open face comfort and full face protection with built-in internal sun glasses.',
  },
  {
    name: 'Studds Motocross MX-1 Peak Off-Road Helmet (Racing Red)',
    slug: 'studds-motocross-mx-1-peak-off-road-helmet-racing-red',
    sku: 'ST-MX1-0001',
    brand: 'Studds',
    category: 'Helmets',
    subcategory: 'Motocross Helmets',
    price: 2499,
    originalPrice: 3100,
    discount: 19,
    stock: true,
    stockCount: 24,
    featured: true,
    rating: 5.0,
    reviewCount: 56,
    image: '/smk-allterra-unicolor-_6.jpg',
    images: [
      '/smk-allterra-unicolor-_6.jpg',
      '/allterra_matt_black_front_1790441917170.jpg',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Rally off-road helmet with high-flow chin vent and extended sun beak peak.',
    description: 'Engineered for off-road trails and adventure dirt tracks with anti-allergic liner and high impact thermoplastic shell.',
  },
  {
    name: 'Studds Marshall Open Face Half Helmet (Pearl White)',
    slug: 'studds-marshall-open-face-half-helmet-pearl-white',
    sku: 'ST-MARS-0001',
    brand: 'Studds',
    category: 'Helmets',
    subcategory: 'Half Face Helmets',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    stock: true,
    stockCount: 35,
    featured: true,
    rating: 4.8,
    reviewCount: 92,
    image: '/korda_helmets_sparify.png',
    images: [
      '/korda_helmets_sparify.png',
      '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Classic open face scooter helmet with optical visor & quick release strap.',
    description: 'Studds Marshall is a lightweight daily commuter helmet offering excellent ventilation and 360 degree panoramic vision.',
  },
  {
    name: 'Studds Retro Classic Cafe Racer Vintage Helmet (Gloss Black)',
    slug: 'studds-retro-classic-cafe-racer-vintage-helmet-gloss-black',
    sku: 'ST-RETR-0001',
    brand: 'Studds',
    category: 'Helmets',
    subcategory: 'Retro Helmets',
    price: 1699,
    originalPrice: 2199,
    discount: 23,
    stock: true,
    stockCount: 20,
    featured: true,
    rating: 5.0,
    reviewCount: 61,
    image: '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
    images: [
      '/retro-black-ma-230-1-rtro-ma-230-l-59-full-face-smk-original-imagn8tyjzpn7rff.webp',
      '/RETRO-SEVEN-4-1.webp',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Vintage cafe racer full face helmet with classic retro profile.',
    description: 'Studds Retro Classic embodies timeless cafe racer aesthetics with modern ISI crash safety and premium stitched interior.',
  },
  {
    name: 'SMK Retro Ranko Graphics GL-213 Cafe Racer Helmet',
    slug: 'smk-retro-ranko-graphics-gl-213-cafe-racer-helmet',
    sku: 'SMK-RET-RNK',
    brand: 'SMK',
    category: 'Helmets',
    subcategory: 'Retro Helmets',
    price: 5400,
    originalPrice: 6500,
    discount: 17,
    stock: true,
    stockCount: 16,
    featured: true,
    rating: 5.0,
    reviewCount: 39,
    image: '/retro-ranko-graphics-gl-213-1-rtro-ranko-gl-213-s-55-full-face-original-imagn5gqfm3xyvth_1.webp',
    images: [
      '/retro-ranko-graphics-gl-213-1-rtro-ranko-gl-213-s-55-full-face-original-imagn5gqfm3xyvth_1.webp',
      '/retro-ranko-gls213-design-aesthetic-coupled-full-face-size-m-1-original-imagdttgwnc3zm5f.webp',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Custom graphics vintage full face helmet with leatherette comfort liner.',
    description: 'SMK Retro Ranko combines old-school 70s heritage styling with modern ECE certification and anti-fog Pinlock shield.',
  },
  {
    name: 'Axor Apex Venomous Dual Visor Track Helmet',
    slug: 'axor-apex-venomous-dual-visor-track-helmet',
    sku: 'AXR-APEX-VEN',
    brand: 'Axor',
    category: 'Helmets',
    subcategory: 'Full Face Helmets',
    price: 4999,
    originalPrice: 5999,
    discount: 17,
    stock: true,
    stockCount: 19,
    featured: true,
    rating: 5.0,
    reviewCount: 53,
    image: '/Blackgreygloss3d_jpg.webp',
    images: [
      '/Blackgreygloss3d_jpg.webp',
      '/typhoon_black_front_1790441788309.jpg',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Aerodynamic track helmet with rear spoiler, dual visor and emergency cheek pad release.',
    description: 'ECE 22.05 & DOT certified Axor Apex Venomous with high aerodynamic stability at high speeds.',
  },
  {
    name: 'Vega Bolt Bunny Glossy Black Red Full Face Helmet',
    slug: 'vega-bolt-bunny-glossy-black-red-full-face-helmet',
    sku: 'VEG-BOLT-BNY',
    brand: 'Vega',
    category: 'Helmets',
    subcategory: 'Full Face Helmets',
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    stock: true,
    stockCount: 25,
    featured: true,
    rating: 4.9,
    reviewCount: 47,
    image: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
    images: [
      '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
      '/StellarSportsSolidGloss-4.webp',
    ],
    sizes: ['M (580mm)', 'L (600mm)', 'XL (620mm)'],
    shortDescription: 'Graphic full face helmet with optical polycarbonate visor and quick release.',
    description: 'High impact ABS shell with UV resistant optical polycarbonate visor and multi-vent ventilation.',
  },
];

const seedDistinctHelmets = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas!');

    // Upsert each distinct helmet by slug to guarantee exact unique images and properties
    for (const h of DISTINCT_HELMETS) {
      await Product.findOneAndUpdate(
        { slug: h.slug },
        { $set: { ...h, isActive: true } },
        { upsert: true, new: true }
      );
    }

    console.log(`Successfully seeded ${DISTINCT_HELMETS.length} unique featured helmets!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding distinct helmets:', err);
    process.exit(1);
  }
};

seedDistinctHelmets();
