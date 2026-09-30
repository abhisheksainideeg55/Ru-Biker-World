import { useMemo, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

export const SLUG_CONFIG_MAP = {
  // Helmets
  'full-face-helmet': { category: 'helmets', query: 'full face', title: 'Full Face Helmets' },
  'half-face-helmet': { category: 'helmets', query: 'half face', title: 'Half Face Helmets' },
  'flip-up-helmet': { category: 'helmets', query: 'flip up', title: 'Flip Up & Modular Helmets' },
  'modular-helmet': { category: 'helmets', query: 'modular', title: 'Modular Helmets' },
  'motocross-helmet': { category: 'helmets', query: 'motocross', title: 'Motocross & Off-Road Helmets' },
  'retro-helmet': { category: 'helmets', query: 'retro', title: 'Retro & Classic Helmets' },
  'helmet': { category: 'helmets', query: 'helmet', title: 'Helmets' },
  'helmets': { category: 'helmets', query: 'helmet', title: 'Helmets' },

  // Helmet Accessories
  'helmet-accessories': { category: 'riding-gear', query: 'helmet', title: 'Helmet Accessories' },
  'goggles': { category: 'riding-gear', query: 'goggle', title: 'Riding Goggles' },
  'intercom': { category: 'accessories', query: 'intercom', title: 'Bluetooth Intercoms' },
  'intercom-bluetooth': { category: 'accessories', query: 'intercom', title: 'Bluetooth Intercoms' },

  // Bike Protection
  'bike-protection': { category: 'Protection & Guards', query: '', title: 'Bike Protection' },
  'protection': { category: 'Protection & Guards', query: '', title: 'Bike Protection' },
  'radiator-grills': { category: 'Protection & Guards', query: 'radiator', title: 'Radiator Grills' },
  'radiator-guards': { category: 'Protection & Guards', query: 'radiator', title: 'Radiator Guards' },
  'crash-guard': { category: 'Protection & Guards', query: 'crash guard', title: 'Crash Guards' },
  'crash-guards': { category: 'Protection & Guards', query: 'crash guard', title: 'Crash Guards' },
  'frame-sliders': { category: 'Protection & Guards', query: 'slider', title: 'Frame Sliders' },
  'side-stand-extenders': { category: 'Protection & Guards', query: 'stand', title: 'Side Stand Extenders' },
  'headlight-grill': { category: 'Protection & Guards', query: 'headlight', title: 'Headlight Grills' },
  'bash-plate-sump-guard': { category: 'Protection & Guards', query: 'sump', title: 'Bash Plates & Sump Guards' },
  'sump-guards': { category: 'Protection & Guards', query: 'sump', title: 'Sump Guards' },
  'fluid-tank-cap': { category: 'Accessories & Touring', query: 'tank cap', title: 'Fluid Tank Caps' },
  'tyre-hugger': { category: 'Accessories & Touring', query: 'hugger', title: 'Tyre Huggers' },
  'screen-guard': { category: 'Accessories & Touring', query: 'screen', title: 'Screen Protectors & Visors' },
  'top-rack': { category: 'Luggage', query: 'top rack', title: 'Top Racks' },
  'saddle-stay': { category: 'Luggage', query: 'saddle stay', title: 'Saddle Stays' },

  // Performance Parts
  'performance': { category: 'Performance & Exhaust', query: '', title: 'Performance & Exhaust' },
  'performance-parts': { category: 'Performance & Exhaust', query: '', title: 'Performance & Exhaust' },
  'performance-air-filter': { category: 'Performance & Exhaust', query: 'air filter', title: 'Performance Air Filters' },
  'performance-exhaust': { category: 'Performance & Exhaust', query: '', title: 'Performance & Exhaust' },
  'exhausts': { category: 'Performance & Exhaust', query: 'exhaust', title: 'Exhausts & Silencers' },
  'exhausts-silencers': { category: 'Performance & Exhaust', query: 'exhaust', title: 'Exhausts & Silencers' },
  'iridium-spark-plug': { category: 'Performance & Exhaust', query: 'spark plug', title: 'Iridium Spark Plugs' },
  'fuelx': { category: 'Performance & Exhaust', query: 'fuelx', title: 'FuelX Autotune' },
  'fuel-x': { category: 'Performance & Exhaust', query: 'fuelx', title: 'FuelX Autotune' },
  'powertronics': { category: 'Performance & Exhaust', query: 'powertronics', title: 'PowerTRONICS ECU' },

  // Braking & Spares
  'spares': { category: 'Spare Parts', query: '', title: 'Motorcycle Spare Parts' },
  'spare-parts': { category: 'Spare Parts', query: '', title: 'Motorcycle Spare Parts' },
  'service-parts': { category: 'Spare Parts', query: '', title: 'Service Parts' },
  'air-filter': { category: 'Spare Parts', query: 'air filter', title: 'Air Filters' },
  'oil-filter': { category: 'Spare Parts', query: 'oil filter', title: 'Oil Filters' },
  'spark-plug': { category: 'Spare Parts', query: 'spark plug', title: 'Spark Plugs' },
  'damper-rubber': { category: 'Spare Parts', query: 'damper', title: 'Wheel Damper Rubbers' },
  'chain-lube': { category: 'Spare Parts', query: 'chain lube', title: 'Chain Lubes & Cleaners' },

  // Brake System
  'brake-system': { category: 'Spare Parts', query: 'brake', title: 'Brake System' },
  'braking': { category: 'Spare Parts', query: 'brake', title: 'Braking Systems' },
  'brake-pad': { category: 'Spare Parts', query: 'brake pad', title: 'Brake Pads' },
  'brake-pads': { category: 'Spare Parts', query: 'brake pad', title: 'Brake Pads' },
  'brake-shoe': { category: 'Spare Parts', query: 'brake shoe', title: 'Brake Shoes' },
  'brake-pedal': { category: 'Spare Parts', query: 'brake pedal', title: 'Brake Pedals & Levers' },
  'disc-plate': { category: 'Spare Parts', query: 'disc plate', title: 'Brake Disc Rotors' },
  'master-cylinder': { category: 'Spare Parts', query: 'master cylinder', title: 'Brake Master Cylinders' },
  'brake-housing': { category: 'Spare Parts', query: 'brake', title: 'Brake Calipers & Housings' },
  'brake-cable': { category: 'Spare Parts', query: 'brake cable', title: 'Brake Cables' },
  'ceramic-brake-pads': { category: 'Spare Parts', query: 'ceramic', title: 'Ceramic Brake Pads' },
  'sintered-brake-pads': { category: 'Spare Parts', query: 'sintered', title: 'Sintered Brake Pads' },

  // Chain & Sprocket
  'chain-sprocket': { category: 'Spare Parts', query: 'chain', title: 'Chain & Sprocket Kits' },
  'chain-sprockets': { category: 'Spare Parts', query: 'chain', title: 'Chain & Sprocket Kits' },
  'brass-chain-sprocket': { category: 'Spare Parts', query: 'brass chain', title: 'Brass Chain & Sprocket Kits' },
  'regular-chain-sprocket': { category: 'Spare Parts', query: 'sprocket', title: 'Drive Chain & Sprocket Kits' },
  'chain-maintenance': { category: 'Spare Parts', query: 'chain', title: 'Chain Maintenance Kits' },

  // Electrical Parts
  'electrical-parts': { category: 'Spare Parts', query: 'electrical', title: 'Electrical Parts' },
  'stator-coil': { category: 'Spare Parts', query: 'stator', title: 'Stator Magneto Coils' },
  'regulator-rectifier': { category: 'Spare Parts', query: 'rectifier', title: 'Voltage Regulator Rectifiers' },
  'speedometer': { category: 'Spare Parts', query: 'speedometer', title: 'Speedometers & Consoles' },

  // Fuel System
  'fuel-system': { category: 'Spare Parts', query: 'fuel', title: 'Fuel System Parts' },
  'fuel-pump-motor': { category: 'Spare Parts', query: 'fuel pump', title: 'Fuel Pump Motors' },
  'fuel-pump-assembly': { category: 'Spare Parts', query: 'fuel pump', title: 'Fuel Pump Assemblies' },
  'fuel-cock': { category: 'Spare Parts', query: 'fuel cock', title: 'Fuel Cocks & Valves' },

  // Clutch Parts
  'clutch-parts': { category: 'Spare Parts', query: 'clutch', title: 'Clutch Parts' },
  'clutch-cable': { category: 'Spare Parts', query: 'clutch cable', title: 'Clutch Cables' },
  'clutch-plate': { category: 'Spare Parts', query: 'clutch plate', title: 'Clutch Plates & Friction Discs' },
  'clutch-assembly': { category: 'Spare Parts', query: 'clutch assembly', title: 'Clutch Assemblies & Hubs' },
  'clutch-shoe': { category: 'Spare Parts', query: 'clutch shoe', title: 'Clutch Shoes' },
  'cvt-belt': { category: 'Spare Parts', query: 'belt', title: 'CVT Drive Belts' },

  // Body Parts & Windshield
  'body-parts': { category: 'Spare Parts', query: 'body', title: 'Body Parts' },
  'visor': { category: 'Spare Parts', query: 'visor', title: 'Front Visors & Windshields' },
  'front-shield': { category: 'Spare Parts', query: 'shield', title: 'Front Shields & Visors' },

  // Gear & Foot Controls
  'gear-system': { category: 'Spare Parts', query: 'gear', title: 'Gear Shift Systems' },
  'gear-pedal': { category: 'Spare Parts', query: 'gear pedal', title: 'Gear Shift Pedals & Levers' },
  'foot-control': { category: 'Spare Parts', query: 'footrest', title: 'Foot Controls & Footrests' },
  'footrest': { category: 'Spare Parts', query: 'footrest', title: 'Footrest Pegs' },
  'footrest-bracket': { category: 'Spare Parts', query: 'footrest', title: 'Footrest Brackets' },

  // Fork & Swingarm Parts
  'fork-parts': { category: 'Spare Parts', query: 'fork', title: 'Front Fork & Suspension Parts' },
  'fork-oil-seal': { category: 'Spare Parts', query: 'fork oil seal', title: 'Front Fork Oil Seals' },
  'shock-absorber': { category: 'Spare Parts', query: 'shock absorber', title: 'Rear Shock Absorbers' },
  'swingarm-parts': { category: 'Spare Parts', query: 'swingarm', title: 'Swingarm Parts' },
  'swingarm-bush-kit': { category: 'Spare Parts', query: 'swingarm bush', title: 'Swingarm Bush Kits' },

  // Other Spares & Controls
  'headlamp': { category: 'Lighting & Electrical', query: 'headlight', title: 'Headlamps & Assemblies' },
  'indicators': { category: 'Lighting & Electrical', query: 'indicator', title: 'LED Turn Indicators' },
  'control-switch': { category: 'Spare Parts', query: 'switch', title: 'Handlebar Control Switches' },
  'lock-sets': { category: 'Spare Parts', query: 'lock set', title: 'Ignition Lock Sets' },
  'mirror': { category: 'Accessories & Touring', query: 'mirror', title: 'Rear View & Bar End Mirrors' },
  'silencer': { category: 'Performance & Exhaust', query: 'exhaust', title: 'Exhaust Silencers & Mufflers' },
  'sticker-kits': { category: 'Accessories & Touring', query: 'sticker', title: 'Sticker Kits & Tank Decals' },

  // Steering & Handle Parts
  'handle-parts': { category: 'Accessories & Touring', query: 'handlebar', title: 'Handlebar Parts' },
  'handlebars-controls': { category: 'Accessories & Touring', query: 'handlebar', title: 'Handlebars & Controls' },
  'handlebar': { category: 'Accessories & Touring', query: 'handlebar', title: 'Handlebars' },
  'handlebar-holder': { category: 'Accessories & Touring', query: 'holder', title: 'Handlebar Holders' },
  'handle-risers': { category: 'Accessories & Touring', query: 'riser', title: 'Handle Risers' },
  'lever-guard': { category: 'Accessories & Touring', query: 'lever guard', title: 'Lever Guards' },
  'grip-set': { category: 'Accessories & Touring', query: 'grip', title: 'Handlebar Grip Sets' },
  'hand-guard': { category: 'Accessories & Touring', query: 'hand guard', title: 'Knuckle & Hand Guards' },

  // Bike Essentials & Accessories
  'accessories': { category: 'Accessories & Touring', query: '', title: 'Motorcycle Accessories' },
  'accessories-touring': { category: 'Accessories & Touring', query: '', title: 'Touring & Accessories' },
  'bike-essentials': { category: 'Accessories & Touring', query: '', title: 'Bike Essentials' },
  'windshield': { category: 'Accessories & Touring', query: 'windshield', title: 'Windshields & Visors' },
  'windshields': { category: 'Accessories & Touring', query: 'windshield', title: 'Windshields & Visors' },
  'windshields-visors': { category: 'Accessories & Touring', query: 'windshield', title: 'Windshields & Visors' },
  'windshield-extenders': { category: 'Accessories & Touring', query: 'extender', title: 'Windshield Extenders' },
  'traction-pads': { category: 'Accessories & Touring', query: 'traction', title: 'Tank Traction Pads' },
  'mobile-holder': { category: 'Accessories & Touring', query: 'mobile', title: 'Phone Mounts & Holders' },
  'mobile-holders': { category: 'Accessories & Touring', query: 'mobile', title: 'Phone Mounts & Holders' },
  'gps-tracker': { category: 'Lighting & Electrical', query: 'gps', title: 'GPS Trackers & Mounts' },
  'gps-mount': { category: 'Lighting & Electrical', query: 'gps', title: 'GPS Mounts' },
  'anti-vibration-damper': { category: 'Accessories & Touring', query: 'vibration', title: 'Vibration Dampers' },
  'vibration-damper': { category: 'Accessories & Touring', query: 'vibration', title: 'Vibration Dampers' },
  'tyre-inflator': { category: 'Accessories & Touring', query: 'inflator', title: 'Tyre Inflators & Pumps' },
  'toy': { category: 'Accessories & Touring', query: 'toy', title: 'Scale Models & Toys' },
  'miniature-helmet': { category: 'Accessories & Touring', query: 'miniature', title: 'Miniature Helmets' },
  'scale-model-motorcycle': { category: 'Accessories & Touring', query: 'scale model', title: 'Scale Model Motorcycles' },
  'apparels': { category: 'Helmets & Gear', query: '', title: 'Riding Apparels' },
  'jersey-set': { category: 'Helmets & Gear', query: 'jersey', title: 'Riding Jersey Sets' },
  'socks': { category: 'Helmets & Gear', query: 'socks', title: 'Riding Socks' },

  // Rider Protection
  'rider-protection': { category: 'Helmets & Gear', query: '', title: 'Rider Protection' },
  'gloves': { category: 'Helmets & Gear', query: 'glove', title: 'Riding Gloves' },
  'riding-gloves': { category: 'Helmets & Gear', query: 'glove', title: 'Riding Gloves' },
  'riding-jacket': { category: 'Helmets & Gear', query: 'jacket', title: 'Riding Jackets' },
  'riding-jackets': { category: 'Helmets & Gear', query: 'jacket', title: 'Riding Jackets' },
  'boots': { category: 'Helmets & Gear', query: 'boot', title: 'Riding Boots' },
  'riding-boots': { category: 'Helmets & Gear', query: 'boot', title: 'Riding Boots' },
  'cap': { category: 'Helmets & Gear', query: 'cap', title: 'Biker Caps' },
  'face-mask': { category: 'Helmets & Gear', query: 'balaclava', title: 'Face Masks & Balaclavas' },

  // Luggage & Touring
  'luggage': { category: 'Luggage', query: '', title: 'Luggage' },
  'luggage-touring': { category: 'Luggage', query: '', title: 'Luggage & Touring' },
  'touring': { category: 'Luggage', query: '', title: 'Luggage & Touring' },
  'tail-bags': { category: 'Luggage', query: 'tail bag', title: 'Tail Bags' },
  'tank-bags': { category: 'Luggage', query: 'tank bag', title: 'Tank Bags' },
  'saddle-bags': { category: 'Luggage', query: 'saddle bag', title: 'Saddle Bags' },
  'backpacks-riding-bags': { category: 'Luggage', query: 'backpack', title: 'Backpacks & Riding Bags' },
  'leg-bags': { category: 'Luggage', query: 'leg bag', title: 'Leg Bags' },
  'tool-bags': { category: 'Luggage', query: 'tool bag', title: 'Tool Bags' },
  'waterproof-luggage-dry-bags': { category: 'Luggage', query: 'dry bag', title: 'Waterproof Luggage & Dry Bags' },
  'luggage-covers': { category: 'Luggage', query: 'cover', title: 'Luggage Covers' },
  'tank-bag-mounts': { category: 'Luggage', query: 'mount', title: 'Tank Bag Mounts' },
  'top-box-mounting-plates': { category: 'Luggage', query: 'mounting plate', title: 'Top Box Mounting Plates' },
  'hard-luggage': { category: 'Luggage', query: 'box', title: 'Hard Panniers & Top Boxes' },
  'soft-luggage': { category: 'Luggage', query: 'bag', title: 'Soft Saddle Bags & Tank Bags' },

  // Lighting & Electronics
  'lighting': { category: 'Lighting & Electrical', query: '', title: 'Lighting & Electrical' },
  'lighting-electrical': { category: 'Lighting & Electrical', query: '', title: 'Lighting & Electrical' },
  'lights-and-electronics': { category: 'Lighting & Electrical', query: '', title: 'Lights & Electronics' },
  'led-auxiliary-lights': { category: 'Lighting & Electrical', query: 'fog light', title: 'LED Auxiliary Fog Lights' },
  'fogg-lamps': { category: 'Lighting & Electrical', query: 'fog', title: 'Fog Lamps' },
  'fog-lamps': { category: 'Lighting & Electrical', query: 'fog', title: 'Fog Lamps' },
  'hazard-flasher': { category: 'Lighting & Electrical', query: 'hazard', title: 'Hazard Flashers' },
  'carplay': { category: 'Lighting & Electrical', query: 'carplay', title: 'Motorcycle CarPlay & GPS' },
};

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();

  // Parse filters from URL search params and route params (:slug)
  const filters = useMemo(() => {
    let categoriesParam = searchParams.get('category');
    let subcategoryParam = searchParams.get('subcategory');
    let bikeParam = searchParams.get('bike');
    let modelParam = searchParams.get('model');
    let brandParam = searchParams.get('brand');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const ratingParam = searchParams.get('rating');
    const discountParam = searchParams.get('discount');
    const availabilityParam = searchParams.get('availability') || 'all';
    let queryParam = searchParams.get('q') || searchParams.get('search') || '';
    let customTitle = '';

    // If on /collections/:slug and specific query params aren't provided, parse the slug intelligently
    if (slug && !categoriesParam && !bikeParam && !modelParam) {
      const normalizedSlug = slug.toLowerCase().trim();
      const slugConfig = SLUG_CONFIG_MAP[normalizedSlug];

      const BIKE_BRAND_SLUGS = {
        'royal-enfield': 'Royal Enfield',
        'tvs': 'TVS',
        'bmw': 'BMW',
        'bmw-motorrad': 'BMW',
        'ktm': 'KTM',
        'yamaha': 'Yamaha',
        'husqvarna': 'Husqvarna',
        'bajaj': 'Bajaj',
        'kawasaki': 'Kawasaki',
        'benelli': 'Benelli',
        'piaggio': 'Piaggio',
        'piaggio-aprilia': 'Piaggio / Aprilia',
        'aprilia': 'Aprilia',
        'hero': 'Hero',
        'hero-motocorp': 'Hero',
        'ducati': 'Ducati',
        'honda': 'Honda',
        'honda-bigwing': 'Honda',
        'ola': 'Ola',
        'harley-davidson': 'Harley Davidson',
        'harley': 'Harley Davidson',
        'suzuki': 'Suzuki',
        'triumph': 'Triumph',
        'ather': 'Ather',
        'jawa': 'Jawa',
        'yezdi': 'Yezdi',
      };

      if (slugConfig) {
        categoriesParam = slugConfig.category;
        customTitle = slugConfig.title;
        if (slugConfig.query && !queryParam) {
          queryParam = slugConfig.query;
        }
      } else if (BIKE_BRAND_SLUGS[normalizedSlug]) {
        bikeParam = BIKE_BRAND_SLUGS[normalizedSlug];
        customTitle = `${BIKE_BRAND_SLUGS[normalizedSlug]} Compatible Parts & Accessories`;
      } else {
        const readableTerm = normalizedSlug.replace(/-/g, ' ');
        queryParam = readableTerm;
      }
    }

    return {
      categories: categoriesParam ? categoriesParam.split(',').filter(Boolean) : [],
      subcategory: subcategoryParam || '',
      bikeBrands: bikeParam ? bikeParam.split(',').filter(Boolean) : [],
      bikeModels: modelParam ? modelParam.split(',').filter(Boolean) : [],
      productBrands: brandParam ? brandParam.split(',').filter(Boolean) : [],
      minPrice: minPriceParam !== null ? minPriceParam : '',
      maxPrice: maxPriceParam !== null ? maxPriceParam : '',
      minRating: ratingParam || '',
      minDiscount: discountParam || '',
      availability: availabilityParam,
      q: queryParam,
      customTitle,
    };
  }, [searchParams, slug]);

  // Update URL search parameters
  const updateUrlParams = useCallback(
    (newFilters, resetPage = true) => {
      setSearchParams((prevParams) => {
        const next = new URLSearchParams(prevParams);

        if (resetPage) {
          next.delete('page');
        }

        // Categories
        if (newFilters.categories && newFilters.categories.length > 0) {
          next.set('category', newFilters.categories.join(','));
        } else {
          next.delete('category');
        }

        // Bike Brands
        if (newFilters.bikeBrands && newFilters.bikeBrands.length > 0) {
          next.set('bike', newFilters.bikeBrands.join(','));
        } else {
          next.delete('bike');
        }

        // Bike Models
        if (newFilters.bikeModels && newFilters.bikeModels.length > 0) {
          next.set('model', newFilters.bikeModels.join(','));
        } else {
          next.delete('model');
        }

        // Product Brands
        if (newFilters.productBrands && newFilters.productBrands.length > 0) {
          next.set('brand', newFilters.productBrands.join(','));
        } else {
          next.delete('brand');
        }

        // Search
        if (newFilters.q) {
          next.set('q', newFilters.q);
        } else {
          next.delete('q');
        }

        // Prices
        if (newFilters.minPrice !== '' && newFilters.minPrice !== null && newFilters.minPrice !== undefined) {
          next.set('minPrice', String(newFilters.minPrice));
        } else {
          next.delete('minPrice');
        }

        if (newFilters.maxPrice !== '' && newFilters.maxPrice !== null && newFilters.maxPrice !== undefined) {
          next.set('maxPrice', String(newFilters.maxPrice));
        } else {
          next.delete('maxPrice');
        }

        // Rating
        if (newFilters.minRating) {
          next.set('rating', String(newFilters.minRating));
        } else {
          next.delete('rating');
        }

        // Discount
        if (newFilters.minDiscount) {
          next.set('discount', String(newFilters.minDiscount));
        } else {
          next.delete('discount');
        }

        // Availability
        if (newFilters.availability && newFilters.availability !== 'all') {
          next.set('availability', newFilters.availability);
        } else {
          next.delete('availability');
        }

        return next;
      });
    },
    [setSearchParams]
  );

  // Filter modifiers
  const toggleFilter = useCallback(
    (type, value) => {
      const currentValues = filters[type] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      updateUrlParams({
        ...filters,
        [type]: updatedValues,
      });
    },
    [filters, updateUrlParams]
  );

  const setSingleFilter = useCallback(
    (type, value) => {
      updateUrlParams({
        ...filters,
        [type]: value ? [value] : [],
      });
    },
    [filters, updateUrlParams]
  );

  const setPriceRange = useCallback(
    (min, max) => {
      updateUrlParams({
        ...filters,
        minPrice: min,
        maxPrice: max,
      });
    },
    [filters, updateUrlParams]
  );

  const removeFilter = useCallback(
    (type, value) => {
      if (Array.isArray(filters[type])) {
        updateUrlParams({
          ...filters,
          [type]: filters[type].filter((v) => v !== value),
        });
      } else {
        updateUrlParams({
          ...filters,
          [type]: '',
        });
      }
    },
    [filters, updateUrlParams]
  );

  const clearFilters = useCallback(() => {
    updateUrlParams({
      categories: [],
      bikeBrands: [],
      bikeModels: [],
      productBrands: [],
      minPrice: '',
      maxPrice: '',
      minRating: '',
      minDiscount: '',
      availability: 'all',
      q: '',
    });
  }, [updateUrlParams]);

  // Active filter count and representations for chips
  const activeFilters = useMemo(() => {
    const list = [];

    filters.categories.forEach((cat) => {
      list.push({ type: 'categories', label: `Category: ${cat}`, value: cat });
    });

    filters.bikeBrands.forEach((bike) => {
      list.push({ type: 'bikeBrands', label: `Bike: ${bike}`, value: bike });
    });

    filters.bikeModels.forEach((model) => {
      list.push({ type: 'bikeModels', label: `Model: ${model}`, value: model });
    });

    filters.productBrands.forEach((brand) => {
      list.push({ type: 'productBrands', label: `Brand: ${brand}`, value: brand });
    });

    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? `₹${filters.minPrice}` : '₹0';
      const max = filters.maxPrice ? `₹${filters.maxPrice}` : 'Above';
      list.push({ type: 'price', label: `Price: ${min} - ${max}`, value: 'price' });
    }

    if (filters.minRating) {
      list.push({
        type: 'minRating',
        label: `Rating: ${filters.minRating}★ & above`,
        value: filters.minRating,
      });
    }

    if (filters.minDiscount) {
      list.push({
        type: 'minDiscount',
        label: `Discount: ${filters.minDiscount}% & above`,
        value: filters.minDiscount,
      });
    }

    if (filters.availability === 'in-stock') {
      list.push({ type: 'availability', label: 'In Stock Only', value: 'in-stock' });
    }

    if (filters.q && !filters.customTitle) {
      list.push({ type: 'q', label: `Keyword: "${filters.q}"`, value: filters.q });
    }

    return list;
  }, [filters]);

  const hasActiveFilters = activeFilters.length > 0;

  return {
    filters,
    activeFilters,
    hasActiveFilters,
    toggleFilter,
    setSingleFilter,
    setPriceRange,
    removeFilter,
    clearFilters,
  };
};

export default useProductFilters;
