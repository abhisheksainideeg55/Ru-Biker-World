import mongoose from 'mongoose';
import StoreContent from '../models/StoreContent.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory fallback map for offline/test environments
export const localContentStore = new Map();

// Default initial datasets for store content
export const DEFAULT_CONTENT = {
  product_categories: [
    {
      id: 'cat-1',
      name: 'Helmets & Gear',
      slug: 'helmets-gear',
      icon: '🛡️',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
      description: 'ECE 22.06 and DOT certified full-face, flip up, motocross, half face & retro helmets',
      subcategories: [
        'Full Face Helmets',
        'Flip Up Helmets',
        'Motocross Helmets',
        'Half Face Helmets',
        'Retro Helmets'
      ],
      productCount: 42,
      order: 1,
      status: 'active'
    },
    {
      id: 'cat-2',
      name: 'Spare Parts',
      slug: 'spare-parts',
      icon: '⚙️',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      description: 'Brembo sintered brake pads, DID drive chains, spark plugs, clutch cables & fork seals',
      subcategories: [
        'Brake Pads & Rotors',
        'Drive Chains & Sprockets',
        'Clutch & Throttle Cables',
        'Spark Plugs & Ignition',
        'Engine & Oil Filters',
        'Suspension & Fork Seals'
      ],
      productCount: 78,
      order: 2,
      status: 'active'
    },
    {
      id: 'cat-3',
      name: 'Accessories & Touring',
      slug: 'accessories-touring',
      icon: '🎒',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
      description: 'Touring panniers, mobile mounts with 15W wireless chargers, auxiliary fog lights',
      subcategories: [
        'LED Auxiliary Fog Lights',
        'Mobile Mounts & USB Fast Chargers',
        'Crash Guards & Sliders',
        'Top Boxes, Panniers & Saddle Bags',
        'Windshields & Touring Visors',
        'Handlebar Grips & Levers'
      ],
      productCount: 54,
      order: 3,
      status: 'active'
    },
    {
      id: 'cat-4',
      name: 'Oils & Fluids',
      slug: 'oils-fluids',
      icon: '🛢️',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
      description: 'Motul 100% synthetic 4T engine oils, high boiling brake fluids, chain cleaner & lubes',
      subcategories: [
        'Fully Synthetic 4T Engine Oils',
        'Semi-Synthetic Oils',
        'Brake Fluids & Coolants',
        'Chain Cleaners & Lubes',
        'Fork & Shock Oils'
      ],
      productCount: 29,
      order: 4,
      status: 'active'
    },
    {
      id: 'cat-5',
      name: 'Performance & Exhaust',
      slug: 'performance-exhaust',
      icon: '🚀',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
      description: 'Akrapovic & LeoVince slip-on exhausts, BMC high-flow performance air filters',
      subcategories: [
        'Slip-On & Full System Exhausts',
        'High-Flow Performance Air Filters',
        'ECU Remap & Quickshifters',
        'Iridium Performance Plugs'
      ],
      productCount: 19,
      order: 5,
      status: 'active'
    },
    {
      id: 'cat-6',
      name: 'Protection & Guards',
      slug: 'protection-guards',
      icon: '🛡️',
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80',
      description: 'Aluminum engine bash plates, radiator grilles, knuckle guards and frame sliders',
      subcategories: [
        'Crash Guards',
        'Engine Guards',
        'Engine Bash Plates',
        'Heavy-Duty Engine Bash Plates',
        'Sump Guards',
        'Engine Protection Covers',
        'Frame Sliders',
        'Axle Sliders',
        'Fork Protectors',
        'Swingarm Protectors',
        'Radiator Guards',
        'Radiator Aluminum Grilles',
        'Headlight Protectors',
        'Tail Light Protectors',
        'Indicator Protectors',
        'Hand Guards & Barkbusters',
        'Knuckle Guards & Barkbusters',
        'Lever Guards',
        'Brake Disc Guards',
        'Caliper Guards',
        'Chain Guards',
        'Sprocket Guards',
        'Exhaust Guards',
        'Heat Shields',
        'Tank Protectors',
        'Tank Grip Pads',
        'Fuel Tank Side Protectors',
        'Engine Side Covers',
        'Clutch Cover Guards',
        'Alternator Cover Guards',
        'Oil Cooler Guards',
        'Oil Filter Guards',
        'Mudguards & Fender Protectors',
        'Front Fender Extenders',
        'Rear Hugger & Tire Huggers',
        'Wheel Rim Protectors',
        'Tire Puncture Protection',
        'Radiator Side Protectors',
        'Windscreen Protectors',
        'Number Plate Guards',
        'Side Stand Pads',
        'Footrest Guards',
        'Motorcycle Security Locks'
      ],
      productCount: 31,
      order: 6,
      status: 'active'
    },
    {
      id: 'cat-7',
      name: 'Lighting & Electrical',
      slug: 'lighting-electrical',
      icon: '💡',
      image: '/f5a4303af87ab6336039e0b0c753d893_lightselectronics.png',
      description: 'High-intensity LED auxiliary fog lights, projector headlights, indicators, horns & electrical accessories',
      subcategories: [
        'LED Fog Lights',
        'Auxiliary Driving Lights',
        'LED Headlight Bulbs',
        'Projector Headlights',
        'LED Headlight Assemblies',
        'LED Tail Lights',
        'LED Turn Signal Indicators',
        'Sequential LED Indicators',
        'LED Indicator Bulbs',
        'DRL (Daytime Running Lights)',
        'LED Light Bars',
        'Spotlights & Floodlights',
        'Brake Lights',
        'Hazard Warning Lights',
        'Number Plate Lights',
        'Handlebar Switches',
        'Headlight Switches',
        'Indicator Switches',
        'Starter Switches',
        'Ignition Switches',
        'Motorcycle Horns',
        'Dual Tone & Loud Horns',
        'USB Mobile Chargers',
        'USB Type-C Fast Chargers',
        'Wireless Phone Charging Mounts',
        'Mobile Phone Holders with Charging',
        'Battery Chargers',
        'Battery Voltage Monitors',
        'Motorcycle Batteries',
        'Battery Terminals & Connectors',
        'Wiring Harnesses',
        'Relay Modules',
        'Fuse Boxes & Fuses',
        'LED Flasher Relays',
        'Voltage Regulators & Rectifiers',
        'Ignition Coils',
        'Spark Plugs',
        'CDI Units & ECU Modules',
        'Digital Speedometers & Gauges',
        'Auxiliary Light Mounting Brackets'
      ],
      productCount: 40,
      order: 7,
      status: 'active'
    },
    {
      id: 'cat-8',
      name: 'Luggage',
      slug: 'luggage',
      icon: '🧳',
      image: '/554a968be41a8f6aaad2b41607c4d3be_luggage.png',
      description: 'Tail bags, tank bags, waterproof dry bags, saddle bags, backpacks & mounting plates',
      subcategories: [
        'Tail Bags',
        'Tank Bags',
        'Saddle Bags',
        'Backpacks & Riding Bags',
        'Leg Bags',
        'Tool Bags',
        'Waterproof Luggage & Dry Bags',
        'Luggage Covers',
        'Tank Bag Mounts',
        'Top Box Mounting Plates'
      ],
      productCount: 28,
      order: 8,
      status: 'active'
    }
  ],

  bike_categories: [
    {
      id: 'ktm',
      name: 'KTM',
      image: '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png',
      link: '/shop?bike=KTM',
      tagline: 'Ready To Race - Duke, RC & Adventure Series',
      models: ['Duke 390', 'RC 390', 'Adventure 390', 'Duke 250', 'RC 200', 'Duke 125'],
      status: 'active',
      order: 1
    },
    {
      id: 'kawasaki',
      name: 'Kawasaki',
      image: '/41_3303eb26-c8b4-4f28-80af-753dfca85a66.png',
      link: '/shop?bike=Kawasaki',
      tagline: 'Let the good times roll - Ninja & Z Series',
      models: ['Ninja 300', 'Ninja 400', 'Ninja ZX-10R', 'Z900', 'Z650', 'Versys 650'],
      status: 'active',
      order: 2
    },
    {
      id: 'royal-enfield',
      name: 'Royal Enfield',
      image: '/40_9eb1ac3b-42b4-4636-85f3-47fe41b864cb.png',
      link: '/shop?bike=Royal+Enfield',
      tagline: 'Made Like a Gun - Classic, Hunter & Himalayan',
      models: ['Classic 350', 'Hunter 350', 'Himalayan 450', 'Continental GT 650', 'Interceptor 650', 'Meteor 350'],
      status: 'active',
      order: 3
    },
    {
      id: 'piaggio',
      name: 'Piaggio / Aprilia',
      image: '/46_a855f9a1-863b-4af5-8d25-4769f3964693.png',
      link: '/shop?bike=Piaggio',
      tagline: 'Italian Racing Heritage & Superbikes',
      models: ['Aprilia RS 457', 'RSV4', 'Tuono 660', 'SR 160', 'SXR 160'],
      status: 'active',
      order: 4
    },
    {
      id: 'tvs',
      name: 'TVS',
      image: '/42_548fc399-90eb-4dbf-97c5-dbd96170ef9a.png',
      link: '/shop?bike=TVS',
      tagline: 'Racing DNA Unleashed - Apache RTR & RR Series',
      models: ['Apache RR 310', 'RTR 310', 'RTR 200 4V', 'RTR 160 4V', 'Ronin 225'],
      status: 'active',
      order: 5
    },
    {
      id: 'bajaj',
      name: 'Bajaj',
      image: '/44_c89a90aa-dba3-4180-9912-44b6249eaab2.png',
      link: '/shop?bike=Bajaj',
      tagline: 'Definitely Daring - Pulsar & Dominar Series',
      models: ['Dominar 400', 'Dominar 250', 'Pulsar NS400Z', 'Pulsar RS200', 'Pulsar NS200', 'Pulsar N250'],
      status: 'active',
      order: 6
    },
    {
      id: 'bmw',
      name: 'BMW Motorrad',
      image: '/45_2494c0d0-08c9-481f-8925-29c0f5622870.png',
      link: '/shop?bike=BMW',
      tagline: 'Make Life A Ride - GS & RR Series',
      models: ['G 310 R', 'G 310 GS', 'S 1000 RR', 'R 1250 GS', 'F 900 XR'],
      status: 'active',
      order: 7
    },
    {
      id: 'yamaha',
      name: 'Yamaha',
      image: '/43.png',
      link: '/shop?bike=Yamaha',
      tagline: 'Revs Your Heart - R15, MT & Aerox Series',
      models: ['YZF-R15 V4', 'MT-15 V2', 'YZF-R3', 'Aerox 155', 'FZS-FI V4'],
      status: 'active',
      order: 8
    },
    {
      id: 'benelli',
      name: 'Benelli',
      image: '/46_37a22301-0a85-4702-85ca-406e7d710551.png',
      link: '/shop?bike=Benelli',
      tagline: 'Pure Passion Since 1911 - TRK & Leoncino',
      models: ['TRK 502X', 'TRK 251', 'Leoncino 500', 'Imperiale 400', '502C Cruiser'],
      status: 'active',
      order: 9
    },
    {
      id: 'hero',
      name: 'Hero MotoCorp',
      image: '/45_da6d2be1-c572-4d1d-9c8f-dd3249235017.png',
      link: '/shop?bike=Hero',
      tagline: 'Engineered For Adventure - XPulse & Karizma',
      models: ['XPulse 200 4V', 'XPulse 200T', 'Karizma XMR 210', 'Mavrick 440', 'Xtreme 160R 4V'],
      status: 'active',
      order: 10
    },
    {
      id: 'honda',
      name: 'Honda BigWing',
      image: '/44_3f3c44f7-fbf3-4bdb-845b-d6ae87fcfda1.png',
      link: '/shop?bike=Honda',
      tagline: 'The Power of Dreams - H’ness, CB300 & Transalp',
      models: ['H’ness CB350', 'CB350RS', 'CB300R', 'CB300F', 'NX500', 'XL750 Transalp'],
      status: 'active',
      order: 11
    },
    {
      id: 'triumph',
      name: 'Triumph',
      image: '/43_ca013c29-0048-4326-81f9-1b6667238d4f.png',
      link: '/shop?bike=Triumph',
      tagline: 'For The Ride - Speed 400, Scrambler & Tiger',
      models: ['Speed 400', 'Scrambler 400 X', 'Trident 660', 'Tiger 900', 'Street Triple 765'],
      status: 'active',
      order: 12
    }
  ],

  trusted_brands: [
    {
      id: 'bajaj',
      name: 'BAJAJ',
      image: '/brands/bajaj.svg',
      fallbackImage: '/44_c89a90aa-dba3-4180-9912-44b6249eaab2.png',
      link: '/shop?bike=Bajaj',
      status: 'active',
      order: 1
    },
    {
      id: 'ktm',
      name: 'KTM',
      image: '/brands/ktm.svg',
      fallbackImage: '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png',
      link: '/shop?bike=KTM',
      status: 'active',
      order: 2
    },
    {
      id: 'royal-enfield',
      name: 'ROYAL ENFIELD',
      image: '/brands/royal-enfield.svg',
      fallbackImage: '/40_9eb1ac3b-42b4-4636-85f3-47fe41b864cb.png',
      link: '/shop?bike=Royal+Enfield',
      status: 'active',
      order: 3
    },
    {
      id: 'benelli',
      name: 'BENELLI',
      image: '/brands/benelli.svg',
      fallbackImage: '/46_37a22301-0a85-4702-85ca-406e7d710551.png',
      link: '/shop?bike=Benelli',
      status: 'active',
      order: 4
    },
    {
      id: 'bmw',
      name: 'BMW',
      image: '/brands/bmw.svg',
      fallbackImage: '/45_2494c0d0-08c9-481f-8925-29c0f5622870.png',
      link: '/shop?bike=BMW',
      status: 'active',
      order: 5
    },
    {
      id: 'tvs',
      name: 'TVS',
      image: '/brands/tvs.svg',
      fallbackImage: '/42_548fc399-90eb-4dbf-97c5-dbd96170ef9a.png',
      link: '/shop?bike=TVS',
      status: 'active',
      order: 6
    },
    {
      id: 'yamaha',
      name: 'YAMAHA',
      image: '/brands/yamaha.svg',
      fallbackImage: '/43.png',
      link: '/shop?bike=Yamaha',
      status: 'active',
      order: 7
    },
    {
      id: 'honda',
      name: 'HONDA',
      image: '/brands/honda.svg',
      fallbackImage: '/44_3f3c44f7-fbf3-4bdb-845b-d6ae87fcfda1.png',
      link: '/shop?bike=Honda',
      status: 'active',
      order: 8
    }
  ],

  shop_by_category: [
    {
      id: 'bike-protection',
      name: 'Bike Protection',
      image: '/ChatGPT_Image_Apr_25_2026_02_14_12_PM.png',
      link: '/shop?category=Protection%20%26%20Guards',
      status: 'active',
      order: 1
    },
    {
      id: 'rider-protection',
      name: 'Rider Protection',
      image: '/ChatGPT_Image_Apr_25_2026_02_06_34_PM.png',
      link: '/shop?category=Helmets%20%26%20Gear',
      status: 'active',
      order: 2
    },
    {
      id: 'luggage',
      name: 'Luggage Inn',
      image: '/ChatGPT_Image_Apr_25_2026_03_17_07_PM.png',
      link: '/shop?category=Luggage',
      status: 'active',
      order: 3
    },
    {
      id: 'performance-parts',
      name: 'Performance Parts',
      image: '/ChatGPT_Image_Apr_25_2026_03_11_20_PM.png',
      link: '/shop?category=Performance%20%26%20Exhaust',
      status: 'active',
      order: 4
    },
    {
      id: 'chain-sprocket',
      name: 'Chain Sprockets',
      image: '/ChatGPT_Image_Apr_25_2026_02_08_58_PM.png',
      link: '/shop?category=Spare%20Parts',
      status: 'active',
      order: 5
    },
    {
      id: 'lights-and-electronics',
      name: 'Lights & Electronics',
      image: '/ChatGPT_Image_Apr_25_2026_02_10_38_PM.png',
      link: '/shop?category=Lighting%20%26%20Electrical',
      status: 'active',
      order: 6
    },
    {
      id: 'mirrors',
      name: 'Mirrors',
      image: '/ChatGPT_Image_Apr_25_2026_02_12_35_PM.png',
      link: '/shop?category=Accessories%20%26%20Touring',
      status: 'active',
      order: 7
    },
    {
      id: 'exhaust-system',
      name: 'Exhaust System',
      image: '/ChatGPT_Image_Apr_25_2026_03_07_06_PM.png',
      link: '/shop?category=Performance%20%26%20Exhaust',
      status: 'active',
      order: 8
    }
  ],

  looking_for_today: [
    {
      id: 'performance',
      title: 'Performance & Exhaust',
      image: '/4da6feeef3f5a58e3eecb7ce5bc7d582_performanceparts.png',
      link: '/shop?category=Performance & Exhaust',
      status: 'active',
      order: 1
    },
    {
      id: 'brake',
      title: 'Spare Parts',
      image: '/5cb292a1b3224122055f89357a2ea599_breaksystem.png',
      link: '/shop?category=Spare Parts',
      status: 'active',
      order: 2
    },
    {
      id: 'helmets',
      title: 'Helmets',
      image: '/3cf2ced61db772b5c2c40ef9876209e0_helmets.png',
      link: '/shop?category=riding-gear&subcategory=helmets',
      status: 'active',
      order: 3
    },
    {
      id: 'luggage',
      title: 'Luggage',
      image: '/554a968be41a8f6aaad2b41607c4d3be_luggage.png',
      link: '/shop?category=Luggage',
      status: 'active',
      order: 4
    },
    {
      id: 'lights',
      title: 'Lights & electronics',
      image: '/f5a4303af87ab6336039e0b0c753d893_lightselectronics.png',
      link: '/shop?category=Lighting & Electrical',
      status: 'active',
      order: 5
    },
    {
      id: 'protection',
      title: 'Rider Protection',
      image: '/0855fcf33a4f7aa9ca24ebca8b68bd97_riderprotection.png',
      link: '/shop?category=Protection & Guards',
      status: 'active',
      order: 6
    }
  ],

  store_settings: {
    storeName: 'RU Biker World',
    tagline: 'Genuine Motorcycle Spare Parts & Premium Accessories',
    supportEmail: 'support@rubikerworld.com',
    supportPhone: '+91 98765 43210',
    whatsappNumber: '919876543210',
    address: 'RU Biker World Hub, Jaipur-Agra Highway, Bharatpur, Rajasthan - 321201',
    freeShippingThreshold: 999,
    standardShippingFee: 199,
    expressShippingFee: 349,
    taxRatePercentage: 18,
    currency: 'INR',
    currencySymbol: '₹',
  }
};

// Pre-fill local in-memory fallback store
for (const [k, v] of Object.entries(DEFAULT_CONTENT)) {
  localContentStore.set(k, v);
}

/**
 * @desc    Get store content by key (Categories, Bikes, Brands, Config)
 * @route   GET /api/content/:key
 * @access  Public
 */
export const getContentByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const fallbackData = DEFAULT_CONTENT[key] || [];

    if (isDbConnected()) {
      let doc = await StoreContent.findOne({ key });
      if (!doc && DEFAULT_CONTENT[key]) {
        // Automatically seed default content in MongoDB
        doc = await StoreContent.create({
          key,
          data: DEFAULT_CONTENT[key],
        });
      } else if (doc && key === 'looking_for_today') {
        const isOldThreeCards = Array.isArray(doc.data) && (
          doc.data.length === 3 && doc.data.some(c => c.id === 'lft-1' || c.title === 'Crash Guards & Sliders')
        );
        if (isOldThreeCards) {
          doc.data = DEFAULT_CONTENT.looking_for_today;
          await StoreContent.findOneAndUpdate({ key: 'looking_for_today' }, { data: DEFAULT_CONTENT.looking_for_today });
        }
      } else if (doc && key === 'shop_by_category') {
        const isOldSbc = Array.isArray(doc.data) && doc.data.length <= 4 && doc.data.some(c => c.id === 'sbc-1' || c.title === 'Helmets & Visors');
        if (isOldSbc) {
          doc.data = DEFAULT_CONTENT.shop_by_category;
          await StoreContent.findOneAndUpdate({ key: 'shop_by_category' }, { data: DEFAULT_CONTENT.shop_by_category });
        }
      } else if (doc && key === 'product_categories') {
        const isOldCats = Array.isArray(doc.data) && (doc.data.length <= 6 && doc.data.some(c => c.name === 'Motorcycle Accessories'));
        if (isOldCats) {
          doc.data = DEFAULT_CONTENT.product_categories;
          await StoreContent.findOneAndUpdate({ key: 'product_categories' }, { data: DEFAULT_CONTENT.product_categories });
        }
      } else if (doc && key === 'bike_categories') {
        const isOldBikes = Array.isArray(doc.data) && (doc.data.length <= 8 && doc.data.some(c => c.id === 'bike-1'));
        if (isOldBikes) {
          doc.data = DEFAULT_CONTENT.bike_categories;
          await StoreContent.findOneAndUpdate({ key: 'bike_categories' }, { data: DEFAULT_CONTENT.bike_categories });
        }
      } else if (doc && key === 'trusted_brands') {
        const isOldBrands = Array.isArray(doc.data) && doc.data.some(b => b.id === 'brand-1' && b.name === 'Brembo' && !b.fallbackImage);
        if (isOldBrands) {
          doc.data = DEFAULT_CONTENT.trusted_brands;
          await StoreContent.findOneAndUpdate({ key: 'trusted_brands' }, { data: DEFAULT_CONTENT.trusted_brands });
        }
      }

      return res.status(200).json({
        success: true,
        key,
        data: doc ? doc.data : fallbackData,
      });
    }

    // In-memory fallback
    const localData = localContentStore.get(key) || fallbackData;
    return res.status(200).json({
      success: true,
      key,
      data: localData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save/Update store content by key directly in database
 * @route   PUT /api/content/:key or POST /api/content/:key
 * @access  Admin / Private
 */
export const updateContentByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (data === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Content data payload is required.',
      });
    }

    if (isDbConnected()) {
      const doc = await StoreContent.findOneAndUpdate(
        { key },
        {
          key,
          data,
          updatedBy: req.user?._id || null,
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: `Store content for '${key}' saved to database successfully.`,
        data: doc.data,
      });
    }

    // In-memory store fallback
    localContentStore.set(key, data);
    return res.status(200).json({
      success: true,
      message: `Store content for '${key}' saved locally.`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all store content batches
 * @route   GET /api/content
 * @access  Public
 */
export const getAllStoreContent = async (req, res, next) => {
  try {
    const result = { ...DEFAULT_CONTENT };

    if (isDbConnected()) {
      const docs = await StoreContent.find({});
      for (const doc of docs) {
        result[doc.key] = doc.data;
      }
    } else {
      for (const [key, val] of localContentStore.entries()) {
        result[key] = val;
      }
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getContentByKey,
  updateContentByKey,
  getAllStoreContent,
  DEFAULT_CONTENT,
};
