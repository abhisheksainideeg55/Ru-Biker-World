import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Package,
  Layers,
  ArrowRight,
  UploadCloud,
  X,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { brandWeTrustList } from '../../components/home/BrandWeTrust';
import { adminService } from '../../services/adminService';

const INITIAL_CATEGORIES = [
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
];

const INITIAL_BIKE_CATEGORIES = [
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
];

export const AdminCategories = () => {
  const { addToast } = useNotifications() || {};
  const [activeTab, setActiveTab] = useState('products'); // default to 'products' or 'bikes'
  const productFileInputRef = useRef(null);

  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [bikeCategories, setBikeCategories] = useState(INITIAL_BIKE_CATEGORIES);
  const [trustedBrands, setTrustedBrands] = useState(() => {
    return brandWeTrustList.map((b, idx) => ({
      ...b,
      status: 'active',
      order: idx + 1
    }));
  });

  // Load Categories, Bikes, and Trusted Brands directly from Database on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      try {
        const [dbCats, dbBikes, dbBrands] = await Promise.all([
          adminService.getCategories(),
          adminService.getBikes(),
          adminService.getTrustedBrands(),
        ]);

        if (isMounted) {
          if (Array.isArray(dbCats) && dbCats.length > 0) {
            setCategories(dbCats);
          }
          if (Array.isArray(dbBikes) && dbBikes.length > 0) {
            setBikeCategories(dbBikes);
          }
          if (Array.isArray(dbBrands) && dbBrands.length > 0) {
            setTrustedBrands(dbBrands);
          }
        }
      } catch (err) {
        console.warn('[AdminCategories] Content load error:', err.message);
      }
    };
    fetchContent();
    return () => { isMounted = false; };
  }, []);

  const [search, setSearch] = useState('');

  // Persist Product Categories to database & notify
  const saveCategories = async (updatedCats) => {
    setCategories(updatedCats);
    try {
      await adminService.saveCategories(updatedCats);
      window.dispatchEvent(new Event('sparify_categories_updated'));
    } catch (e) {
      console.warn('Failed to save categories to database:', e.message);
    }
  };

  // Persist Trusted Brands to database & notify
  const saveTrustedBrands = async (updated) => {
    setTrustedBrands(updated);
    try {
      await adminService.saveTrustedBrands(updated);
      window.dispatchEvent(new Event('sparify_trusted_brands_updated'));
    } catch (e) {
      console.warn('Failed to save trusted brands to database:', e.message);
    }
  };

  // Product Category Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCat, setSelectedCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '📦',
    image: '',
    description: '',
    subcategoriesInput: '',
    status: 'active',
    order: 1
  });

  // Bike Category Modal State
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);
  const [bikeModalMode, setBikeModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedBike, setSelectedBike] = useState(null);
  const bikeFileInputRef = useRef(null);
  const [bikeFormData, setBikeFormData] = useState({
    name: '',
    image: '',
    tagline: '',
    modelsInput: '',
    link: '',
    status: 'active',
    order: 1
  });

  // Trusted Brand Modal State
  const [isTrustedModalOpen, setIsTrustedModalOpen] = useState(false);
  const [trustedModalMode, setTrustedModalMode] = useState('create');
  const [selectedTrusted, setSelectedTrusted] = useState(null);
  const trustedFileInputRef = useRef(null);
  const [trustedFormData, setTrustedFormData] = useState({
    name: '',
    image: '',
    link: '',
    status: 'active',
    order: 1
  });

  // Persist Bike Categories to database & notify
  const saveBikeCategories = async (updatedBikes) => {
    setBikeCategories(updatedBikes);
    try {
      await adminService.saveBikes(updatedBikes);
      window.dispatchEvent(new Event('sparify_bike_categories_updated'));
    } catch (e) {
      console.warn('Failed to save bike categories to database:', e.message);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase())) ||
    (c.subcategories && c.subcategories.some((sub) => sub.toLowerCase().includes(search.toLowerCase())))
  );

  const filteredBikes = bikeCategories.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.tagline && b.tagline.toLowerCase().includes(search.toLowerCase())) ||
    (b.models && b.models.some((m) => m.toLowerCase().includes(search.toLowerCase())))
  );

  const filteredTrusted = trustedBrands.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.link && t.link.toLowerCase().includes(search.toLowerCase()))
  );

  // ===================== TRUSTED BRANDS HANDLERS =====================
  const handleOpenCreateTrusted = () => {
    setTrustedModalMode('create');
    setSelectedTrusted(null);
    setTrustedFormData({
      name: '',
      image: '',
      link: '/shop?bike=',
      status: 'active',
      order: trustedBrands.length + 1
    });
    setIsTrustedModalOpen(true);
  };

  const handleOpenEditTrusted = (brand) => {
    setTrustedModalMode('edit');
    setSelectedTrusted(brand);
    setTrustedFormData({
      name: brand.name,
      image: brand.image || '',
      link: brand.link || `/shop?bike=${encodeURIComponent(brand.name)}`,
      status: brand.status || 'active',
      order: brand.order || 1
    });
    setIsTrustedModalOpen(true);
  };

  const handleTrustedImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultUrl = uploadEvent.target.result;
      setTrustedFormData((prev) => ({
        ...prev,
        image: resultUrl
      }));
      if (addToast) addToast({ type: 'success', message: `Trusted Brand logo "${file.name}" loaded!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmitTrusted = (e) => {
    e.preventDefault();
    if (!trustedFormData.name.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Brand Name is required.' });
      return;
    }

    const generatedLink = trustedFormData.link.trim() || `/shop?bike=${encodeURIComponent(trustedFormData.name.trim())}`;
    const idSlug = trustedFormData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (trustedModalMode === 'create') {
      const newBrand = {
        id: idSlug || `trusted-${Date.now()}`,
        name: trustedFormData.name.trim().toUpperCase(),
        image: trustedFormData.image.trim() || '/brands/bajaj.svg',
        link: generatedLink,
        status: trustedFormData.status,
        order: Number(trustedFormData.order) || trustedBrands.length + 1
      };
      const updated = [...trustedBrands, newBrand];
      saveTrustedBrands(updated);
      if (addToast) addToast({ type: 'success', message: `Trusted Brand "${newBrand.name}" added successfully!` });
    } else {
      const updated = trustedBrands.map((b) =>
        b.id === selectedTrusted.id
          ? {
              ...b,
              name: trustedFormData.name.trim().toUpperCase(),
              image: trustedFormData.image.trim() || b.image,
              link: generatedLink,
              status: trustedFormData.status,
              order: Number(trustedFormData.order)
            }
          : b
      );
      saveTrustedBrands(updated);
      if (addToast) addToast({ type: 'success', message: `Trusted Brand "${trustedFormData.name}" updated!` });
    }

    setIsTrustedModalOpen(false);
  };

  const handleDeleteTrusted = (brand) => {
    if (window.confirm(`Are you sure you want to delete Trusted Brand "${brand.name}"?`)) {
      const updated = trustedBrands.filter((b) => b.id !== brand.id);
      saveTrustedBrands(updated);
      if (addToast) addToast({ type: 'info', message: `Trusted Brand "${brand.name}" removed.` });
    }
  };

  const handleResetTrustedDefaults = () => {
    if (window.confirm('Reset all Category Trusted Brands (Brand We Trust) to default OEM bike manufacturers?')) {
      const defaults = brandWeTrustList.map((b, idx) => ({
        ...b,
        status: 'active',
        order: idx + 1
      }));
      saveTrustedBrands(defaults);
      if (addToast) addToast({ type: 'success', message: 'Restored all 12 default Trusted Brands!' });
    }
  };

  // Handlers for Product Categories
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCat(null);
    setFormData({
      name: '',
      slug: '',
      icon: '📦',
      image: '',
      description: '',
      subcategoriesInput: '',
      status: 'active',
      order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setModalMode('edit');
    setSelectedCat(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '📦',
      image: cat.image || '',
      description: cat.description || '',
      subcategoriesInput: Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : '',
      status: cat.status || 'active',
      order: cat.order || 1
    });
    setIsModalOpen(true);
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultUrl = uploadEvent.target.result;
      setFormData((prev) => ({
        ...prev,
        image: resultUrl
      }));
      if (addToast) addToast({ type: 'success', message: `Category image "${file.name}" loaded!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Category Name is required.' });
      return;
    }

    const subcats = formData.subcategoriesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (modalMode === 'create') {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: formData.name.trim(),
        slug,
        icon: formData.icon || '📦',
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600',
        description: formData.description.trim(),
        subcategories: subcats.length ? subcats : ['General'],
        productCount: 0,
        order: Number(formData.order) || categories.length + 1,
        status: formData.status
      };
      const updated = [...categories, newCat];
      saveCategories(updated);
      if (addToast) addToast({ type: 'success', message: `Category "${newCat.name}" created!` });
    } else {
      const updated = categories.map((c) =>
        c.id === selectedCat.id
          ? {
            ...c,
            name: formData.name.trim(),
            slug,
            icon: formData.icon,
            image: formData.image.trim() || c.image,
            description: formData.description.trim(),
            subcategories: subcats.length ? subcats : c.subcategories,
            status: formData.status,
            order: Number(formData.order)
          }
          : c
      );
      saveCategories(updated);
      if (addToast) addToast({ type: 'success', message: `Category "${formData.name}" updated!` });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (cat) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      const updated = categories.filter((c) => c.id !== cat.id);
      saveCategories(updated);
      if (addToast) addToast({ type: 'info', message: 'Category removed.' });
    }
  };

  // ===================== BIKE CATEGORY HANDLERS =====================
  const handleOpenCreateBike = () => {
    setBikeModalMode('create');
    setSelectedBike(null);
    setBikeFormData({
      name: '',
      image: '',
      tagline: '',
      modelsInput: '',
      link: '',
      status: 'active',
      order: bikeCategories.length + 1
    });
    setIsBikeModalOpen(true);
  };

  const handleOpenEditBike = (bike) => {
    setBikeModalMode('edit');
    setSelectedBike(bike);
    setBikeFormData({
      name: bike.name,
      image: bike.image || '',
      tagline: bike.tagline || '',
      modelsInput: (bike.models || []).join(', '),
      link: bike.link || `/shop?bike=${encodeURIComponent(bike.name)}`,
      status: bike.status || 'active',
      order: bike.order || 1
    });
    setIsBikeModalOpen(true);
  };

  const handleBikeImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultUrl = uploadEvent.target.result;
      setBikeFormData((prev) => ({
        ...prev,
        image: resultUrl
      }));
      if (addToast) addToast({ type: 'success', message: `Loaded bike image "${file.name}"!` });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmitBike = (e) => {
    e.preventDefault();
    if (!bikeFormData.name.trim()) {
      if (addToast) addToast({ type: 'error', message: 'Bike Brand / Name is required.' });
      return;
    }

    const models = bikeFormData.modelsInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const generatedLink = bikeFormData.link.trim() || `/shop?bike=${encodeURIComponent(bikeFormData.name.trim())}`;
    const idSlug = bikeFormData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (bikeModalMode === 'create') {
      const newBike = {
        id: idSlug || `bike-${Date.now()}`,
        name: bikeFormData.name.trim(),
        image: bikeFormData.image.trim() || '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png',
        link: generatedLink,
        tagline: bikeFormData.tagline.trim(),
        models: models.length ? models : [bikeFormData.name.trim()],
        status: bikeFormData.status,
        order: Number(bikeFormData.order) || bikeCategories.length + 1
      };

      const updated = [...bikeCategories, newBike];
      saveBikeCategories(updated);
      if (addToast) addToast({ type: 'success', message: `Bike Category "${newBike.name}" added successfully!` });
    } else {
      const updated = bikeCategories.map((b) =>
        b.id === selectedBike.id
          ? {
            ...b,
            name: bikeFormData.name.trim(),
            image: bikeFormData.image.trim() || b.image,
            link: generatedLink,
            tagline: bikeFormData.tagline.trim(),
            models: models.length ? models : b.models,
            status: bikeFormData.status,
            order: Number(bikeFormData.order)
          }
          : b
      );
      saveBikeCategories(updated);
      if (addToast) addToast({ type: 'success', message: `Bike Category "${bikeFormData.name}" updated!` });
    }

    setIsBikeModalOpen(false);
  };

  const handleDeleteBike = (bike) => {
    if (window.confirm(`Are you sure you want to delete Bike Category "${bike.name}"?`)) {
      const updated = bikeCategories.filter((b) => b.id !== bike.id);
      saveBikeCategories(updated);
      if (addToast) addToast({ type: 'info', message: `Bike Category "${bike.name}" removed.` });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans p-6 max-w-7xl mx-auto">
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Categories & Bike Fitment Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Manage motorcycle brands, bike categories with images, and part hierarchies for storefront filtering
          </p>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === 'trusted' && (
            <button
              onClick={handleResetTrustedDefaults}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border border-slate-200"
              title="Restore all 12 default trusted OEM bike brands"
            >
              <span>Restore 12 Defaults</span>
            </button>
          )}

          {activeTab === 'trusted' ? (
            <button
              onClick={handleOpenCreateTrusted}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>+ Add Trusted Brand</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleOpenCreateBike}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <span className="text-base">🏍️</span>
                <span>+ Add Bike Category</span>
              </button>

              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>+ Add Product Category</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===================== NAVIGATION TABS ===================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
        <button
          onClick={() => {
            setActiveTab('bikes');
            setSearch('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'bikes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <span>🏍️ Shop By Bike Categories ({bikeCategories.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('products');
            setSearch('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <span>📦 Product Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('trusted');
            setSearch('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'trusted'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <ShieldCheck className={`w-4 h-4 ${activeTab === 'trusted' ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>🤝 Category Trusted Brands ({trustedBrands.length})</span>
        </button>
      </div>

      {/* ===================== SEARCH & STATS ===================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'bikes'
                ? 'Search bike brands (KTM, Yamaha, Royal Enfield, models...)'
                : activeTab === 'products'
                ? 'Search product categories or subcategories...'
                : 'Search trusted OEM brands (Bajaj, KTM, BMW, Benelli, TVS...)'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-3">
          {activeTab === 'bikes' ? (
            <span>
              Total Brands: <strong className="text-slate-900">{bikeCategories.length}</strong> (
              {bikeCategories.filter((b) => b.status === 'active').length} Active on Storefront)
            </span>
          ) : activeTab === 'products' ? (
            <span>
              Total Categories: <strong className="text-slate-900">{categories.length}</strong> (
              {categories.reduce((acc, c) => acc + c.productCount, 0)} Total Products)
            </span>
          ) : (
            <span>
              Total Trusted Brands: <strong className="text-slate-900">{trustedBrands.length}</strong> (
              {trustedBrands.filter((b) => b.status === 'active').length} Active on Homepage Carousel)
            </span>
          )}
        </div>
      </div>

      {/* ===================== TAB 1: BIKE CATEGORIES (SHOP BY BIKE) ===================== */}
      {activeTab === 'bikes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredBikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Bike Image Box with Light Theme Background */}
                <div className="relative h-44 bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png';
                    }}
                  />
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${bike.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                  >
                    {bike.status}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{bike.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400">Order #{bike.order || 1}</span>
                  </div>

                  {bike.tagline && (
                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">{bike.tagline}</p>
                  )}

                  {/* Models list */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>Models ({bike.models?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(bike.models || []).slice(0, 4).map((m, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                        >
                          {m}
                        </span>
                      ))}
                      {(bike.models || []).length > 4 && (
                        <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                          +{(bike.models || []).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions & Storefront Link */}
              <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <a
                  href={bike.link || `/shop?bike=${encodeURIComponent(bike.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  <span>Filter Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditBike(bike)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Edit Bike Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBike(bike)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Bike Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== TAB 2: PRODUCT CATEGORIES GRID ===================== */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Category Cover Image with Overlay */}
                <div className="relative h-36 bg-slate-900 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xl bg-white/20 backdrop-blur-md p-1.5 rounded-xl">
                        {cat.icon}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${cat.status === 'active'
                            ? 'bg-emerald-500 text-white shadow-2xs'
                            : 'bg-slate-700 text-slate-300'
                          }`}
                      >
                        {cat.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{cat.name}</h3>
                      <p className="text-[11px] font-mono text-amber-400">/{cat.slug}</p>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories list pills */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>Subcategories ({cat.subcategories.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cat.productCount} Active Products</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== TAB 3: CATEGORY TRUSTED BRANDS (BRAND WE TRUST) ===================== */}
      {activeTab === 'trusted' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTrusted.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Brand Logo Box with Crisp Light Container */}
                <div className="relative h-32 bg-white p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      if (brand.fallbackImage && e.target.src !== brand.fallbackImage) {
                        e.target.src = brand.fallbackImage;
                      } else {
                        e.target.src = '/brands/bajaj.svg';
                      }
                    }}
                  />
                  <span
                    className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${
                      brand.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {brand.status}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{brand.name}</h3>
                    <span className="text-[9px] font-bold text-slate-400">#{brand.order || 1}</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 line-clamp-1">{brand.link}</p>
                </div>
              </div>

              {/* Footer Actions & Storefront Link */}
              <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <Link
                  to={`/shop?bike=${encodeURIComponent(brand.name)}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60"
                  title={`View bike store for ${brand.name}`}
                >
                  <span>Store View</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditTrusted(brand)}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Edit Trusted Brand"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrusted(brand)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Trusted Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== ADD / EDIT BIKE CATEGORY MODAL ===================== */}
      {isBikeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏍️</span>
                <h3 className="font-bold text-lg text-slate-900">
                  {bikeModalMode === 'create' ? 'Add Bike Category (Shop By Bike)' : 'Edit Bike Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsBikeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBike} className="mt-5 space-y-4">
              {/* Bike Brand Name & Order */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Bike Brand / Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KTM, Kawasaki, Royal Enfield, BMW"
                    value={bikeFormData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBikeFormData({
                        ...bikeFormData,
                        name: val,
                        link: bikeFormData.link ? bikeFormData.link : `/shop?bike=${encodeURIComponent(val)}`
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={bikeFormData.order}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, order: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-center text-xs font-bold focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Bike Image Upload & URL input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bike Image (Upload or URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">PNG / JPG on White Background</span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Live Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                    {bikeFormData.image ? (
                      <img
                        src={bikeFormData.image}
                        alt="Bike Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/39_b13f13eb-5755-43c9-9c34-14e963ef0738.png';
                        }}
                      />
                    ) : (
                      <span className="text-xl">🏍️</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Hidden file input */}
                    <input
                      ref={bikeFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBikeImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => bikeFileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload Bike Photo from Computer</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /40_9eb1ac3b.png or https://...)"
                      value={bikeFormData.image}
                      onChange={(e) => setBikeFormData({ ...bikeFormData, image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Tagline / Series Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ready To Race - Duke, RC & Adventure Series"
                  value={bikeFormData.tagline}
                  onChange={(e) => setBikeFormData({ ...bikeFormData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Sub-models / Series Models */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Sub-Models / Compatible Bikes (Comma-separated)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Duke 390, RC 390, Adventure 390, Duke 250, RC 200"
                  value={bikeFormData.modelsInput}
                  onChange={(e) => setBikeFormData({ ...bikeFormData, modelsInput: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Target Storefront Filter Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Storefront Filter Link (Auto-mapped to /shop?bike=...)
                </label>
                <input
                  type="text"
                  placeholder="/shop?bike=KTM"
                  value={bikeFormData.link}
                  onChange={(e) => setBikeFormData({ ...bikeFormData, link: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Status</label>
                <select
                  value={bikeFormData.status}
                  onChange={(e) => setBikeFormData({ ...bikeFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                >
                  <option value="active">Active (Visible on Homepage & Filters)</option>
                  <option value="inactive">Inactive / Draft (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBikeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {bikeModalMode === 'create' ? 'Save & Add Bike Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== ADD / EDIT PRODUCT CATEGORY MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  {modalMode === 'create' ? 'Create New Category' : 'Edit Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Helmets & Gear / Performance Exhausts"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-center text-sm focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  URL Slug (Auto-generated if empty)
                </label>
                <input
                  type="text"
                  placeholder="e.g. helmets-gear"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Category Image Upload & URL input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Category Image (Upload or URL)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Card / Banner Photo</span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Live Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Category Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Hidden file input */}
                    <input
                      ref={productFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => productFileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Image from Computer</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Brief description for SEO & category page banner..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Subcategories (Comma-separated)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Full Face Helmets, Modular Helmets, Riding Gloves"
                  value={formData.subcategoriesInput}
                  onChange={(e) => setFormData({ ...formData, subcategoriesInput: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  {modalMode === 'create' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===================== ADD / EDIT TRUSTED BRAND MODAL ===================== */}
      {isTrustedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-lg text-slate-900">
                  {trustedModalMode === 'create' ? 'Add Category Trusted Brand' : 'Edit Trusted Brand'}
                </h3>
              </div>
              <button
                onClick={() => setIsTrustedModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTrusted} className="mt-5 space-y-4">
              {/* Brand Name & Order */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Brand Name (OEM Manufacturer)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BAJAJ, KTM, ROYAL ENFIELD, BENELLI"
                    value={trustedFormData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTrustedFormData({
                        ...trustedFormData,
                        name: val,
                        link: trustedFormData.link && trustedFormData.link !== '/shop?bike=' ? trustedFormData.link : `/shop?bike=${encodeURIComponent(val)}`
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={trustedFormData.order}
                    onChange={(e) => setTrustedFormData({ ...trustedFormData, order: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-center text-xs font-bold focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Brand Logo Upload & URL input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="block text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Brand Logo Image (SVG, PNG or JPG)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Transparent or White Background</span>
                </label>

                <div className="flex items-center gap-3">
                  {/* Live Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                    {trustedFormData.image ? (
                      <img
                        src={trustedFormData.image}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/brands/bajaj.svg';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Hidden file input */}
                    <input
                      ref={trustedFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleTrustedImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => trustedFileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Logo from Computer</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /brands/bajaj.svg or https://...)"
                      value={trustedFormData.image}
                      onChange={(e) => setTrustedFormData({ ...trustedFormData, image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Storefront Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Destination Storefront URL / Route
                </label>
                <input
                  type="text"
                  placeholder="/shop?bike=Bajaj"
                  value={trustedFormData.link}
                  onChange={(e) => setTrustedFormData({ ...trustedFormData, link: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Status</label>
                <select
                  value={trustedFormData.status}
                  onChange={(e) => setTrustedFormData({ ...trustedFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
                >
                  <option value="active">Active (Visible on Homepage "Brand We Trust" Carousel)</option>
                  <option value="inactive">Inactive / Draft (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTrustedModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {trustedModalMode === 'create' ? 'Save & Add Brand' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
