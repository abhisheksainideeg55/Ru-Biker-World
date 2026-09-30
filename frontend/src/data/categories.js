export const sparesCategories = [
  { name: 'Engine Parts', path: '/shop?category=engine-parts', icon: 'FiCpu' },
  { name: 'Brake System', path: '/shop?category=brake-system', icon: 'FiDisc' },
  { name: 'Clutch & Cables', path: '/shop?category=clutch-cables', icon: 'FiLink' },
  { name: 'Chain & Sprockets', path: '/shop?category=chain-sprockets', icon: 'FiRotateCw' },
  { name: 'Filters', path: '/shop?category=filters', icon: 'FiFilter' },
  { name: 'Electrical', path: '/shop?category=electrical', icon: 'FiZap' },
  { name: 'Fuel System', path: '/shop?category=fuel-system', icon: 'FiDroplet' },
  { name: 'Cooling System', path: '/shop?category=cooling-system', icon: 'FiWind' },
  { name: 'Suspension', path: '/shop?category=suspension', icon: 'FiSliders' },
  { name: 'Steering & Controls', path: '/shop?category=steering-controls', icon: 'FiCompass' },
  { name: 'Body Parts', path: '/shop?category=body-parts', icon: 'FiShield' },
  { name: 'Lighting', path: '/shop?category=lighting', icon: 'FiSun' },
  { name: 'Mirrors', path: '/shop?category=mirrors', icon: 'FiEye' },
  { name: 'Foot Controls', path: '/shop?category=foot-controls', icon: 'FiAnchor' },
  { name: 'Locks', path: '/shop?category=locks', icon: 'FiLock' },
  { name: 'Silencers', path: '/shop?category=silencers', icon: 'FiVolume2' },
  { name: 'Sticker Kits', path: '/shop?category=sticker-kits', icon: 'FiTag' },
];

export const popularSpareParts = [
  { name: 'Sintered Brake Pads', path: '/shop?category=brake-system&type=sintered' },
  { name: 'Brass Chain & Sprocket Kits', path: '/shop?category=chain-sprockets&type=brass' },
  { name: 'Iridium Spark Plugs', path: '/shop?category=electrical&type=spark-plug' },
  { name: 'High-Flow Air Filters', path: '/shop?category=filters&type=air-filter' },
  { name: 'Clutch Friction Plates', path: '/shop?category=clutch-cables&type=friction-plates' },
  { name: 'Synthetic Fork Oil & Seals', path: '/shop?category=suspension&type=fork-oil' },
];

export const accessoriesCategories = [
  {
    title: 'Protection',
    items: [
      { name: 'Crash Guards', path: '/shop?category=crash-guards' },
      { name: 'Engine Guards', path: '/shop?category=engine-guards' },
      { name: 'Frame Sliders', path: '/shop?category=frame-sliders' },
      { name: 'Sump Guards', path: '/shop?category=sump-guards' },
      { name: 'Radiator Guards', path: '/shop?category=radiator-guards' },
      { name: 'Handguards & Barkbusters', path: '/shop?category=handguards' },
    ],
  },
  {
    title: 'Performance',
    items: [
      { name: 'Exhausts', path: '/shop?category=exhausts' },
      { name: 'Air Filters', path: '/shop?category=air-filters' },
      { name: 'ECU Tuners', path: '/shop?category=ecu-tuners' },
      { name: 'Quick Shifters', path: '/shop?category=quick-shifters' },
      { name: 'Braided Brake Lines', path: '/shop?category=brake-lines' },
    ],
  },
  {
    title: 'Touring',
    items: [
      { name: 'Saddlebags', path: '/shop?category=saddlebags' },
      { name: 'Top Boxes', path: '/shop?category=top-boxes' },
      { name: 'Tank Bags', path: '/shop?category=tank-bags' },
      { name: 'Tail Bags', path: '/shop?category=tail-bags' },
      { name: 'Luggage Racks', path: '/shop?category=luggage-racks' },
      { name: 'Windshields & Visors', path: '/shop?category=windshields' },
    ],
  },
  {
    title: 'Bike Essentials',
    items: [
      { name: 'Mobile Holders', path: '/shop?category=mobile-holders' },
      { name: 'USB Chargers', path: '/shop?category=usb-chargers' },
      { name: 'Bike Covers', path: '/shop?category=bike-covers' },
      { name: 'Cleaning Kits', path: '/shop?category=cleaning-kits' },
      { name: 'Paddock Stands', path: '/shop?category=paddock-stands' },
    ],
  },
  {
    title: 'Rider Gear',
    items: [
      { name: 'Helmets', path: '/shop?category=helmets' },
      { name: 'Riding Jackets', path: '/shop?category=riding-jackets' },
      { name: 'Riding Gloves', path: '/shop?category=riding-gloves' },
      { name: 'Riding Boots', path: '/shop?category=riding-boots' },
      { name: 'Knee & Elbow Guards', path: '/shop?category=armour-guards' },
    ],
  },
];

export const categories = [
  {
    id: 'spares',
    name: 'Spare Parts',
    description: 'OEM & Performance Replacement Parts',
    subcategories: sparesCategories,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Style, Utility & Touring Upgrades',
    subcategories: accessoriesCategories.flatMap((g) => g.items),
  },
  {
    id: 'protection',
    name: 'Protection',
    description: 'Crash Guards, Skid Plates & Sliders',
    subcategories: accessoriesCategories[0].items,
  },
  {
    id: 'performance',
    name: 'Performance & Exhaust',
    description: 'Slip-On Exhausts, High-Flow Filters, Quickshifters & Performance Drive Chains',
    subcategories: [
      { name: 'Slip-On & Full System Exhausts', path: '/shop?category=Performance%20%26%20Exhaust&subcategory=Slip-On+%26+Full+System+Exhausts' },
      { name: 'High-Flow Performance Air Filters', path: '/shop?category=Performance%20%26%20Exhaust&subcategory=High-Flow+Performance+Air+Filters' },
      { name: 'ECU Remap & Quickshifters', path: '/shop?category=Performance%20%26%20Exhaust&subcategory=ECU+Remap+%26+Quickshifters' },
      { name: 'Iridium Performance Plugs', path: '/shop?category=Performance%20%26%20Exhaust&subcategory=Iridium+Performance+Plugs' },
      { name: 'Performance Drive Chains', path: '/shop?category=Performance%20%26%20Exhaust&subcategory=Performance+Drive+Chains' },
    ],
  },
  {
    id: 'touring',
    name: 'Touring & Luggage',
    description: 'Saddlebags, Top Boxes & Tank Bags',
    subcategories: accessoriesCategories[2].items,
  },
  {
    id: 'riding-gear',
    name: 'Riding Gear',
    description: 'Helmets, Jackets, Gloves & Boots',
    subcategories: accessoriesCategories[4].items,
  },
  {
    id: 'luggage',
    name: 'Luggage',
    description: 'Tail Bags, Tank Bags, Saddle Bags, Waterproof Dry Bags & Mounting Plates',
    subcategories: [
      { name: 'Tail Bags', path: '/shop?category=luggage&subcategory=Tail+Bags' },
      { name: 'Tank Bags', path: '/shop?category=luggage&subcategory=Tank+Bags' },
      { name: 'Saddle Bags', path: '/shop?category=luggage&subcategory=Saddle+Bags' },
      { name: 'Backpacks & Riding Bags', path: '/shop?category=luggage&subcategory=Backpacks+%26+Riding+Bags' },
      { name: 'Leg Bags', path: '/shop?category=luggage&subcategory=Leg+Bags' },
      { name: 'Tool Bags', path: '/shop?category=luggage&subcategory=Tool+Bags' },
      { name: 'Waterproof Luggage & Dry Bags', path: '/shop?category=luggage&subcategory=Waterproof+Luggage+%26+Dry+Bags' },
      { name: 'Luggage Covers', path: '/shop?category=luggage&subcategory=Luggage+Covers' },
      { name: 'Tank Bag Mounts', path: '/shop?category=luggage&subcategory=Tank+Bag+Mounts' },
      { name: 'Top Box Mounting Plates', path: '/shop?category=luggage&subcategory=Top+Box+Mounting+Plates' }
    ],
  },
  {
    id: 'lighting-electrical',
    name: 'Lighting & Electrical',
    description: 'LED Fog Lights, Auxiliary Driving Lights, Projector Headlights & Electrical Accessories',
    subcategories: [
      { name: 'LED Fog Lights', path: '/shop?category=lighting&subcategory=LED+Fog+Lights' },
      { name: 'Auxiliary Driving Lights', path: '/shop?category=lighting&subcategory=Auxiliary+Driving+Lights' },
      { name: 'LED Headlight Bulbs', path: '/shop?category=lighting&subcategory=LED+Headlight+Bulbs' },
      { name: 'Projector Headlights', path: '/shop?category=lighting&subcategory=Projector+Headlights' },
      { name: 'LED Headlight Assemblies', path: '/shop?category=lighting&subcategory=LED+Headlight+Assemblies' },
      { name: 'LED Tail Lights', path: '/shop?category=lighting&subcategory=LED+Tail+Lights' },
      { name: 'Sequential LED Indicators', path: '/shop?category=lighting&subcategory=Sequential+LED+Indicators' },
      { name: 'DRL (Daytime Running Lights)', path: '/shop?category=lighting&subcategory=DRL' },
      { name: 'Dual Tone & Loud Horns', path: '/shop?category=lighting&subcategory=Dual+Tone+%26+Loud+Horns' },
      { name: 'USB Type-C Fast Chargers', path: '/shop?category=lighting&subcategory=USB+Type-C+Fast+Chargers' },
      { name: 'Wireless Phone Charging Mounts', path: '/shop?category=lighting&subcategory=Wireless+Phone+Charging+Mounts' },
      { name: 'Wiring Harnesses', path: '/shop?category=lighting&subcategory=Wiring+Harnesses' },
      { name: 'Auxiliary Light Mounting Brackets', path: '/shop?category=lighting&subcategory=Auxiliary+Light+Mounting+Brackets' }
    ],
  },
];
