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

// Image pools for realistic helmet angles
const HELMET_IMAGES = {
  fullFace: [
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
  flipUp: [
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
  motocross: [
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
  halfFace: [
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
  retro: [
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

const COLORWAYS = [
  'Matt Black', 'Glossy Black', 'Pearl White', 'Gun Metal Grey',
  'Matt Titanium', 'Racing Red', 'Electric Blue', 'Fluo Yellow Neon',
  'Fluo Orange', 'Military Olive Green', 'Desert Storm Sand',
  'Carbon Fiber Texture', 'Cyberpunk Neon Pink', 'Stealth Camo Edition',
  'Vintage Crimson Maroon', 'Sunset Gold Metallic', 'Shadow Edition'
];

const SIZES = ['Medium (580mm)', 'Large (600mm)', 'XL (620mm)'];

// Catalog series definition for Studds
const CATALOG_CONFIG = [
  // 1. FULL FACE HELMETS (~150 items)
  {
    subcategory: 'Full Face Helmets',
    imageKey: 'fullFace',
    models: [
      { series: 'Thunder', basePrice: 2150, decors: 14, prefix: 'THUN' },
      { series: 'Drifter', basePrice: 2299, decors: 14, prefix: 'DRIF' },
      { series: 'Shifter', basePrice: 2399, decors: 12, prefix: 'SHIF' },
      { series: 'Downtown', basePrice: 1999, decors: 12, prefix: 'DOWN' },
      { series: 'Professional', basePrice: 1699, decors: 10, prefix: 'PROF' },
      { series: 'Track', basePrice: 1850, decors: 12, prefix: 'TRCK' },
      { series: 'Bravo', basePrice: 1750, decors: 12, prefix: 'BRAV' },
      { series: 'Scorpius', basePrice: 2450, decors: 12, prefix: 'SCOR' },
      { series: 'Chrome Solid', basePrice: 2050, decors: 10, prefix: 'CHRM' },
      { series: 'Storm', basePrice: 2199, decors: 12, prefix: 'STRM' },
      { series: 'V-Series Aerodynamic', basePrice: 2250, decors: 12, prefix: 'VSR' },
      { series: 'Aero Solid', basePrice: 1899, decors: 10, prefix: 'AERO' },
      { series: 'Apex Warrior', basePrice: 2599, decors: 10, prefix: 'APEX' },
    ]
  },

  // 2. FLIP UP HELMETS (~100 items)
  {
    subcategory: 'Flip Up Helmets',
    imageKey: 'flipUp',
    models: [
      { series: 'Ninja Elite Super', basePrice: 2450, decors: 14, prefix: 'NINJ-E' },
      { series: 'Ninja 3G Dual Visor', basePrice: 2650, decors: 14, prefix: 'NINJ-3G' },
      { series: 'Ninja Pastel Series', basePrice: 2350, decors: 12, prefix: 'NINJ-P' },
      { series: 'Ninja Pro Touring', basePrice: 2799, decors: 12, prefix: 'NINJ-PRO' },
      { series: 'Transformer Modular', basePrice: 2899, decors: 12, prefix: 'TRNS' },
      { series: 'Switch Dual Homologated', basePrice: 2999, decors: 12, prefix: 'SWTC' },
      { series: 'Voyager Flip-Up', basePrice: 2550, decors: 12, prefix: 'VOYG' },
      { series: 'Cruiser Modular Pro', basePrice: 2699, decors: 12, prefix: 'CRUZ-M' },
    ]
  },

  // 3. MOTOCROSS HELMETS (~80 items)
  {
    subcategory: 'Motocross Helmets',
    imageKey: 'motocross',
    models: [
      { series: 'Motocross MX-1 Peak', basePrice: 2499, decors: 12, prefix: 'MX-1' },
      { series: 'Motocross Track Off-Road', basePrice: 2650, decors: 12, prefix: 'MX-TRK' },
      { series: 'Dirt Pro Rally', basePrice: 2799, decors: 12, prefix: 'MX-DIRT' },
      { series: 'Enduro MX Dual Visor', basePrice: 2950, decors: 12, prefix: 'MX-END' },
      { series: 'Rally X Extreme Mud', basePrice: 2850, decors: 12, prefix: 'MX-RAL' },
      { series: 'Trail Blaster MX', basePrice: 2550, decors: 10, prefix: 'MX-TRL' },
      { series: 'Dune Rider Off-Road', basePrice: 2699, decors: 10, prefix: 'MX-DUNE' },
    ]
  },

  // 4. HALF FACE HELMETS (~100 items)
  {
    subcategory: 'Half Face Helmets',
    imageKey: 'halfFace',
    models: [
      { series: 'Marshall Open Face', basePrice: 1299, decors: 14, prefix: 'MARS' },
      { series: 'Urban City Jet', basePrice: 1199, decors: 14, prefix: 'URBN' },
      { series: 'Copter Pilot Visor', basePrice: 1399, decors: 12, prefix: 'COPT' },
      { series: 'Ray Sleek Half Face', basePrice: 1099, decors: 12, prefix: 'RAY' },
      { series: 'Cub Classic Scooter', basePrice: 999, decors: 12, prefix: 'CUB' },
      { series: 'Jade Sport Open Face', basePrice: 1250, decors: 12, prefix: 'JADE' },
      { series: 'Jetstream Airflow', basePrice: 1350, decors: 12, prefix: 'JET' },
      { series: 'Stallion Open Face', basePrice: 1450, decors: 12, prefix: 'STAL' },
    ]
  },

  // 5. RETRO HELMETS (~70 items)
  {
    subcategory: 'Retro Helmets',
    imageKey: 'retro',
    models: [
      { series: 'Retro Classic Cafe Racer', basePrice: 1699, decors: 12, prefix: 'RET-C' },
      { series: 'Bullet Vintage Chrome Bezel', basePrice: 1799, decors: 12, prefix: 'RET-B' },
      { series: 'Cruiser Heritage Goggle Visor', basePrice: 1899, decors: 12, prefix: 'RET-CR' },
      { series: 'Legend Old School Jet', basePrice: 1650, decors: 12, prefix: 'RET-LEG' },
      { series: 'Scrambler Vintage Matte', basePrice: 1750, decors: 12, prefix: 'RET-SC' },
      { series: 'Custom Roadster Leatherette', basePrice: 1950, decors: 10, prefix: 'RET-RDS' },
    ]
  }
];

const generate500StuddsHelmets = () => {
  const helmets = [];
  let counter = 1000;

  for (const group of CATALOG_CONFIG) {
    const imagesPool = HELMET_IMAGES[group.imageKey] || HELMET_IMAGES.fullFace;

    for (const model of group.models) {
      for (let i = 1; i <= model.decors; i++) {
        counter++;
        const color = COLORWAYS[(counter + i) % COLORWAYS.length];
        const decorCode = i === 1 ? 'Solid Edition' : `D${i} Decor Graphic Edition`;
        const name = `Studds ${model.series} ${decorCode} (${color})`;
        const sku = `ST-${model.prefix}-${String(counter).padStart(4, '0')}`;
        const price = model.basePrice + ((i % 4) * 50);
        const originalPrice = Math.round(price * 1.25);
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

        const imgPair = imagesPool[counter % imagesPool.length];
        const primaryImg = imgPair.primary;
        const secondaryImg = imgPair.secondary;

        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + `-${counter}`;

        helmets.push({
          name,
          slug,
          sku,
          brand: 'Studds',
          category: 'Helmets',
          subcategory: group.subcategory,
          price,
          originalPrice,
          cost: Math.round(price * 0.65),
          discount,
          stock: true,
          stockCount: Math.floor(Math.random() * 35) + 10,
          maxPurchaseQuantity: 5,
          isActive: true,
          image: primaryImg,
          images: [primaryImg, secondaryImg],
          imageType: 'helmet',
          bikeBrands: ['Universal'],
          bikeModels: ['All Motorcycles & Scooters'],
          sizes: SIZES,
          description: `The Studds ${model.series} ${decorCode} is engineered with an aerodynamic high-impact thermoplastic shell and regulated multi-density EPS liner. Features include an optically true anti-scratch polycarbonate visor, dynamic multi-vent air channels, hypoallergenic sanitized washable comfort liner, and a quick-release micrometric buckle. ISI Certified (IS:4151) for maximum road safety.`,
          shortDescription: `ISI Certified ${group.subcategory} with aerodynamic thermoplastic shell, anti-scratch visor & quick-release buckle.`,
          technicalSpecs: `Shell Material: High Impact ABS/Thermoplastic\nCertification: ISI Certified (IS:4151)\nVisor: Scratch Resistant Polycarbonate Shield\nFastening: Micrometric Quick Release Buckle\nWeight: 1350 ± 50 grams\nPadding: Removable, Washable Hypoallergenic Inner Liner`,
          shippingCharge: 0,
          isFreeShipping: true,
          weight: '1.4 kg',
          dimensions: '35 x 26 x 27 cm',
          shippingTier: 'standard',
          rating: Number((4.6 + (Math.random() * 0.4)).toFixed(1)),
          reviewCount: Math.floor(Math.random() * 80) + 12,
          salesCount: Math.floor(Math.random() * 120) + 20,
          featured: i <= 2 && Math.random() > 0.6,
          isNew: true,
        });
      }
    }
  }

  return helmets;
};

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in backend/.env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully!');

    const studdsHelmets = generate500StuddsHelmets();
    console.log(`Generated ${studdsHelmets.length} authentic Studds Helmets across all 5 subcategories.`);

    console.log('Checking existing helmets to prevent duplicates...');
    const existingSlugs = new Set(
      (await Product.find({}, { slug: 1 }).lean()).map((p) => p.slug)
    );

    const toInsert = studdsHelmets.filter((h) => !existingSlugs.has(h.slug));
    console.log(`Ready to insert ${toInsert.length} new Studds helmets (Skipping ${studdsHelmets.length - toInsert.length} existing)...`);

    // Bulk insert in chunks of 100 for safety and speed
    const CHUNK_SIZE = 100;
    let totalInserted = 0;

    for (let i = 0; i < toInsert.length; i += CHUNK_SIZE) {
      const chunk = toInsert.slice(i, i + CHUNK_SIZE);
      await Product.insertMany(chunk, { ordered: false });
      totalInserted += chunk.length;
      console.log(`[PROGRESS] Inserted ${totalInserted} / ${toInsert.length} Studds helmets into MongoDB Atlas...`);
    }

    const totalInDb = await Product.countDocuments();
    const totalHelmets = await Product.countDocuments({ brand: 'Studds', category: 'Helmets' });

    console.log(`\n======================================================`);
    console.log(`SUCCESSFULLY ADDED ${totalInserted} STUDDS HELMETS!`);
    console.log(`Total Studds Helmets in DB: ${totalHelmets}`);
    console.log(`Total Products in DB: ${totalInDb}`);
    console.log(`======================================================\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding Studds helmets:', error);
    process.exit(1);
  }
};

runSeed();
