import mongoose from 'mongoose';
import BlogPost from '../models/BlogPost.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const defaultBlogPosts = [
  {
    _id: 'blog_001',
    title: 'Top 7 Pre-Ride Maintenance Checks Every Motorcyclist Must Do',
    slug: 'pre-ride-maintenance-checklist-motorcycle',
    excerpt: 'Before hitting the highway or twisties, performing a quick 5-minute inspection on tire pressures, chain slack, brake fluid, and engine oil can prevent breakdowns and save lives.',
    content: `
### Why Pre-Ride Inspections Matter
Whether you are commuting through urban rush hour or heading out on a 500-kilometer weekend tour, your motorcycle is subjected to extreme vibrational stress and heat cycles. A systematic pre-ride inspection (often referred to as T-CLOCS) ensures mechanical reliability.

#### 1. Tire Pressure & Tread Depth
Tires are your only contact patch with the tarmac. Always check cold tire pressures using a calibrated digital pressure gauge. Inspect tread grooves for embedded gravel, glass, or nails. Ensure tread wear indicators (TWI) are not flush with the surface.

#### 2. Chain Slack & Lubrication
A dry or overtightened chain robs engine horsepower and can snap under load. Maintain 25–30mm of vertical free play. Clean with kerosene or dedicated chain cleaner every 500 km and lubricate with high-tack synthetic chain lube (like Motul C2/C4).

#### 3. Brake Fluid & Pad Thickness
Inspect the front and rear master cylinder sight glasses. Fluid should be clear amber (DOT 4/5.1). If it looks dark brown or black, it has absorbed moisture and needs bleeding. Check pad friction material—never allow pads to wear down below 1.5mm.

#### 4. Engine Oil Level & Color
Place the motorcycle upright on level ground. Check the sight glass or dipstick. Oil should be between the MIN and MAX markers. Synthetic oils like 10W-50 or 15W-50 offer superior shear stability in high-ambient temperatures.

#### 5. Clutch & Throttle Free Play
Ensure the throttle snaps back smoothly when released in all handlebar steering angles. Adjust clutch cable free play to 2–3mm at the lever pivot to prevent premature clutch plate slippage.

#### 6. Electricals, Lights & Horn
Test high/low beam headlights, brake light switches (both front lever and rear foot pedal activation), hazard indicators, and horn.

#### 7. Suspension & Fluid Leaks
Examine front fork stanchions for oily rings indicating blown fork oil seals. Bounce the front and rear to verify smooth damping rebound without clunks or harsh bottoming out.
    `,
    coverImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200',
    category: 'Bike Maintenance',
    tags: ['Maintenance', 'Safety', 'Tires', 'Brakes', 'Oil'],
    authorName: 'Vikram Joshi (MotoZone Tech Lead)',
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    readTime: 6,
    isPublished: true,
  },
  {
    _id: 'blog_002',
    title: 'Sintered vs Organic Brake Pads: Which Should You Choose?',
    slug: 'sintered-vs-organic-brake-pads-guide',
    excerpt: 'Comparing friction coefficients, heat dissipation, rotor wear, and wet weather performance between sintered metallic and organic ceramic compound brake pads.',
    content: `
### Understanding Brake Pad Friction Materials
When upgrading your motorcycle's braking system, choosing the right brake pad compound makes a profound difference in stopping distance, lever feedback, and rotor longevity.

#### Sintered Metallic Pads (HH Rated)
Sintered pads are created by fusing metallic particles (copper, bronze, iron) under extreme heat and pressure.
- **Pros:** Maximum initial bite, impervious to high heat fade (up to 600°C), exceptional wet weather performance.
- **Cons:** Slightly more abrasive on soft stainless steel discs; can produce brake squeal when cold.
- **Best For:** Performance sports bikes, track days, fast highway touring, and heavy adventure tourers.

#### Organic / Carbon-Ceramic Pads
Organic pads use non-metallic bonded fibers, resins, and ceramic friction modifiers.
- **Pros:** Gentle on brake rotors, silent operation, progressive and predictable lever modulation at low speeds.
- **Cons:** Shorter service life, prone to brake fade under repeated high-speed stops.
- **Best For:** Commuter motorcycles, vintage bikes, light street riding, and rear brakes where gentle modulation prevents lockups.
    `,
    coverImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200',
    category: 'Motorcycle Accessories',
    tags: ['Brakes', 'Brembo', 'Performance', 'Safety'],
    authorName: 'Arjun Verma (Master Mechanic)',
    publishedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    readTime: 5,
    isPublished: true,
  },
  {
    _id: 'blog_003',
    title: 'Essential Riding Gear Guide: Helmet Safety Standards (ECE 22.06 vs DOT vs ISI)',
    slug: 'helmet-safety-standards-ece-dot-isi-guide',
    excerpt: 'Demystifying helmet safety ratings. Why the new ECE 22.06 rotational impact test sets the gold standard for rider cranial protection in modern motorcycling.',
    content: `
### The Hierarchy of Motorcycle Helmet Certifications
Your helmet is the most critical piece of personal protective equipment (PPE). Understanding certification labels empowers you to make an informed investment in your survival.

#### ECE 22.06 (European Economic Commission)
The newest ECE 22.06 standard introduces stringent oblique impact testing, measuring rotational brain acceleration which is the primary cause of severe concussions and diffuse axonal injury. It tests helmets at variable impact velocities and includes visor shatter resistance.

#### DOT FMVSS 218 (United States Standard)
DOT is a self-certified regulatory standard in North America. While it establishes baseline safety, it lacks independent third-party batch testing and does not evaluate rotational dynamics.

#### ISI (Bureau of Indian Standards - IS 4151)
Mandatory in India. Modern ISI certification aligns with basic impact attenuation and chin strap retention tests. Riders seeking maximum highway protection should prioritize helmets certified with dual **ECE 22.06 + ISI** ratings.
    `,
    coverImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    category: 'Riding Gear',
    tags: ['Gear', 'Helmets', 'Safety', 'ECE2206'],
    authorName: 'Sneha Roy (Riding Safety Instructor)',
    publishedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    readTime: 7,
    isPublished: true,
  },
  {
    _id: 'blog_004',
    title: 'How to Properly Clean and Lube Your Motorcycle Drive Chain',
    slug: 'motorcycle-chain-cleaning-lubrication-steps',
    excerpt: 'Step-by-step guide to extending your X-ring and O-ring sprocket kit lifespan beyond 25,000 kilometers with correct maintenance chemicals and techniques.',
    content: `
### Why Drive Chain Maintenance Cannot Be Ignored
An unmaintained chain experiences severe roller wear, link binding, and sprocket tooth hooking. High quality O-ring and X-ring chains contain internal grease sealed by rubber rings. Using improper solvents like gasoline destroys these seals within minutes.

#### Step 1: Secure the Bike on a Paddock Stand or Center Stand
Ensure the rear wheel spins freely. **NEVER run the engine in gear while cleaning the chain with your hands**—always rotate the wheel manually.

#### Step 2: Apply Specialized Chain Cleaner
Spray non-chlorinated chain cleaner or clean kerosene onto the chain. Let it penetrate grease and road grime for 3 minutes.

#### Step 3: Scrub with a Grunge Brush
Use a 3-sided nylon chain cleaning brush to dislodge grit from inner rollers and outer side plates.

#### Step 4: Wipe Dry with a Lint-Free Rag
Wipe until the side plates and rollers shine with clean bare metal.

#### Step 5: Apply Synthetic Chain Lube
Apply lube to the inside of the lower chain run right before the rear sprocket, allowing centrifugal force to distribute lubricant into the rollers. Let it sit for 30 minutes before riding.
    `,
    coverImage: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=1200',
    category: 'Bike Care',
    tags: ['Chain', 'Maintenance', 'Motul', 'Rolon'],
    authorName: 'Vikram Joshi (MotoZone Tech Lead)',
    publishedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    readTime: 4,
    isPublished: true,
  },
];

/**
 * @desc    Get paginated blog posts with category and search filtering
 * @route   GET /api/blog
 * @access  Public
 */
export const getBlogPosts = async (req, res, next) => {
  try {
    const queryObj = req.query || {};
    const page = Math.max(1, parseInt(queryObj.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(queryObj.limit, 10) || 9));
    const category = queryObj.category;
    const search = queryObj.search?.trim();

    if (isDbConnected()) {
      const query = { isPublished: true };
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const total = await BlogPost.countDocuments(query);
      const totalPages = Math.ceil(total / limit) || 1;
      const skip = (page - 1) * limit;

      const posts = await BlogPost.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        data: {
          posts,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      });
    } else {
      let filtered = defaultBlogPosts.filter((p) => p.isPublished);

      if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const skip = (page - 1) * limit;
      const paginated = filtered.slice(skip, skip + limit);

      return res.status(200).json({
        success: true,
        data: {
          posts: paginated,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single blog post by slug
 * @route   GET /api/blog/:slug
 * @access  Public
 */
export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (isDbConnected()) {
      const post = await BlogPost.findOne({ slug: slug.toLowerCase(), isPublished: true });
      if (!post) {
        return res.status(404).json({ success: false, message: 'Article not found.' });
      }
      return res.status(200).json({ success: true, data: post });
    } else {
      const post = defaultBlogPosts.find((p) => p.slug === slug.toLowerCase() && p.isPublished);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Article not found.' });
      }
      return res.status(200).json({ success: true, data: post });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get distinct blog categories with post count
 * @route   GET /api/blog/categories
 * @access  Public
 */
export const getBlogCategories = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const categories = await BlogPost.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]);
      return res.status(200).json({ success: true, data: categories });
    } else {
      const catMap = {};
      defaultBlogPosts.forEach((p) => {
        catMap[p.category] = (catMap[p.category] || 0) + 1;
      });
      const categories = Object.keys(catMap).map((k) => ({ name: k, count: catMap[k] }));
      return res.status(200).json({ success: true, data: categories });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get related blog posts by category/tags excluding current
 * @route   GET /api/blog/:slug/related
 * @access  Public
 */
export const getRelatedPosts = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (isDbConnected()) {
      const current = await BlogPost.findOne({ slug });
      const category = current?.category || 'Bike Maintenance';

      const related = await BlogPost.find({
        slug: { $ne: slug },
        isPublished: true,
        category,
      })
        .limit(4)
        .sort({ publishedAt: -1 });

      return res.status(200).json({ success: true, data: related });
    } else {
      const current = defaultBlogPosts.find((p) => p.slug === slug);
      const category = current?.category || 'Bike Maintenance';
      const related = defaultBlogPosts
        .filter((p) => p.slug !== slug && p.isPublished && p.category === category)
        .slice(0, 4);

      return res.status(200).json({ success: true, data: related });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Live debounced blog search endpoint
 * @route   GET /api/blog/search
 * @access  Public
 */
export const searchBlogPosts = async (req, res, next) => {
  try {
    const queryObj = req.query || {};
    const q = queryObj.q?.trim();

    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }

    if (isDbConnected()) {
      const results = await BlogPost.find({
        isPublished: true,
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { excerpt: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } },
        ],
      })
        .limit(8)
        .select('title slug excerpt category coverImage publishedAt readTime');

      return res.status(200).json({ success: true, data: results });
    } else {
      const term = q.toLowerCase();
      const results = defaultBlogPosts
        .filter(
          (p) =>
            p.isPublished &&
            (p.title.toLowerCase().includes(term) ||
              p.excerpt.toLowerCase().includes(term) ||
              p.tags.some((t) => t.toLowerCase().includes(term)))
        )
        .slice(0, 8);

      return res.status(200).json({ success: true, data: results });
    }
  } catch (error) {
    next(error);
  }
};
