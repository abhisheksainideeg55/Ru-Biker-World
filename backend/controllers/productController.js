import mongoose from 'mongoose';
import Product from '../models/Product.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * GET /api/products
 * Fetch filtered, sorted, paginated public products from MongoDB
 */
export const getProducts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: [],
        products: [],
        pagination: {
          total: 0,
          page: 1,
          totalPages: 1,
          limit: 12,
        },
      });
    }
    const {
      search = '',
      category = '',
      categories = '',
      subcategory = '',
      brand = '',
      productBrands = '',
      bike = '',
      bikeBrand = '',
      bikeBrands = '',
      model = '',
      bikeModel = '',
      bikeModels = '',
      minPrice,
      maxPrice,
      inStockOnly,
      featured,
      sort = 'featured',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = { isActive: true };

    // Smart Multi-Word Search Query
    if (search && search.trim()) {
      const q = search.trim();
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const words = q.split(/\s+/).filter(Boolean).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      
      const searchConditions = [
        { name: new RegExp(escapedQ, 'i') },
        { brand: new RegExp(escapedQ, 'i') },
        { category: new RegExp(escapedQ, 'i') },
        { subcategory: new RegExp(escapedQ, 'i') },
        { sku: new RegExp(escapedQ, 'i') },
        { bikeBrands: new RegExp(escapedQ, 'i') },
        { bikeModels: new RegExp(escapedQ, 'i') },
        { shortDescription: new RegExp(escapedQ, 'i') },
        { description: new RegExp(escapedQ, 'i') },
      ];

      // If multiple words (e.g. "mobile holder"), match if all words exist across fields
      if (words.length > 1) {
        const allWordsAnd = words.map(w => {
          const wReg = new RegExp(w, 'i');
          return {
            $or: [
              { name: wReg },
              { brand: wReg },
              { category: wReg },
              { subcategory: wReg },
              { shortDescription: wReg },
              { description: wReg },
            ]
          };
        });
        searchConditions.push({ $and: allWordsAnd });
      }

      query.$and = query.$and || [];
      query.$and.push({ $or: searchConditions });
    }

    // Category filter with clean category isolation
    const catList = (categories || category)
      ? (categories || category).split(',').map((c) => c.trim()).filter(Boolean)
      : [];
    if (catList.length > 0) {
      const catConditions = [];
      for (const raw of catList) {
        if (!raw) continue;
        const clean = raw.toLowerCase().trim();
        
        if (clean === 'luggage' || clean === 'luggage-touring' || clean.includes('luggage')) {
          catConditions.push({ category: /luggage/i });
        } else if (clean.includes('perform') || clean.includes('exhaust') || clean.includes('fuelx')) {
          catConditions.push({ category: /performance/i });
        } else if (clean.includes('spare') || clean.includes('spares')) {
          catConditions.push({ category: /spare/i });
        } else if (clean.includes('helmet') || clean === 'riding-gear' || clean === 'helmets-gear' || clean === 'apparel' || clean === 'apparels' || clean === 'protection' || clean.includes('gear')) {
          catConditions.push({ category: /helmet|gear/i });
        } else if (clean.includes('light') || clean.includes('electric') || clean.includes('lamp') || clean.includes('fog')) {
          catConditions.push({ category: /light|electric/i });
        } else if (clean.includes('protect') || clean.includes('guard')) {
          catConditions.push({ category: /protect/i });
        } else if (clean.includes('oil') || clean.includes('fluid') || clean.includes('lube')) {
          catConditions.push({ category: /oil|fluid/i });
        } else if (clean.includes('access') || clean.includes('tour') || clean.includes('steering') || clean.includes('handle')) {
          catConditions.push({ category: /accessories/i });
        } else {
          const cleanName = clean.replace(/[-_]+/g, ' ');
          catConditions.push({
            $or: [
              { category: new RegExp(`^${cleanName}$`, 'i') },
              { category: new RegExp(cleanName, 'i') },
              { subcategory: new RegExp(cleanName, 'i') }
            ]
          });
        }
      }

      if (catConditions.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({ $or: catConditions });
      }
    }

    if (subcategory) {
      const cleanSub = subcategory.trim().toLowerCase();
      const subWords = subcategory.trim().replace(/[-_]+/g, ' ');
      const subPatterns = [new RegExp(subWords, 'i')];
      
      const words = subWords.split(/\s+/).filter((w) => w.length > 2);
      words.forEach((w) => subPatterns.push(new RegExp(w, 'i')));

      if (cleanSub.includes('brake')) {
        subPatterns.push(/brake/i);
      }
      if (cleanSub.includes('chain') || cleanSub.includes('sprocket')) {
        subPatterns.push(/chain/i, /sprocket/i);
      }
      if (cleanSub.includes('clutch') || cleanSub.includes('cable')) {
        subPatterns.push(/clutch/i, /cable/i);
      }
      if (cleanSub.includes('spark') || cleanSub.includes('plug')) {
        subPatterns.push(/spark/i, /plug/i);
      }
      if (cleanSub.includes('filter')) {
        subPatterns.push(/filter/i);
      }
      if (cleanSub.includes('suspension') || cleanSub.includes('fork') || cleanSub.includes('seal')) {
        subPatterns.push(/suspension/i, /fork/i, /seal/i);
      }

      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { subcategory: { $in: subPatterns } },
          { category: { $in: subPatterns } },
          { name: { $in: subPatterns } }
        ]
      });
    }

    // Brand filter (Supports exact, case-insensitive, space/hyphen/plus variations)
    const brandList = (productBrands || brand)
      ? (productBrands || brand).split(',').map((b) => decodeURIComponent(b).trim()).filter(Boolean)
      : [];
    if (brandList.length > 0) {
      const brandRegexes = brandList.map((b) => {
        const cleanBrand = b.replace(/[-_+]+/g, ' ').trim();
        const flexiblePattern = cleanBrand.split(/\s+/).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[-_\\s+]*');
        return new RegExp(`^${flexiblePattern}$`, 'i');
      });
      query.brand = { $in: brandRegexes };
    }

    // Bike Brands filter (Strict matching for the selected bike brand)
    const rawBikeParam = bikeBrands || bikeBrand || bike || '';
    const bikeBrandList = rawBikeParam
      ? rawBikeParam.split(',').map((b) => decodeURIComponent(b).trim()).filter(Boolean)
      : [];
    if (bikeBrandList.length > 0) {
      const bikeConditions = [];
      for (const raw of bikeBrandList) {
        // Handle aliases and composite names (e.g. "Piaggio / Aprilia", "BMW Motorrad", "Hero MotoCorp", "Honda BigWing")
        const terms = raw.split(/\s*\/\s*|\s*,\s*/).map((t) => t.replace(/[-_+]+/g, ' ').trim()).filter(Boolean);
        for (const term of terms) {
          const escTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const cleanPattern = term.replace(/\b(motorrad|motocorp|bigwing)\b/gi, '').trim();
          const escClean = cleanPattern ? cleanPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : escTerm;

          const termRegex = new RegExp(escTerm, 'i');
          const cleanRegex = new RegExp(escClean, 'i');

          bikeConditions.push(
            { bikeBrands: { $in: [termRegex, cleanRegex] } },
            { bikeModels: { $in: [termRegex, cleanRegex] } },
            { name: { $in: [termRegex, cleanRegex] } },
            { description: { $in: [termRegex, cleanRegex] } }
          );
        }
      }

      if (bikeConditions.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({ $or: bikeConditions });
      }
    }

    // Bike Models filter
    const rawModelParam = bikeModels || bikeModel || model || '';
    const bikeModelList = rawModelParam
      ? rawModelParam.split(',').map((m) => decodeURIComponent(m).trim()).filter(Boolean)
      : [];
    if (bikeModelList.length > 0) {
      const modelConditions = [];
      for (const raw of bikeModelList) {
        const cleanM = raw.replace(/[-_+]+/g, ' ').trim();
        const escM = cleanM.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const mRegex = new RegExp(escM, 'i');
        modelConditions.push(
          { bikeModels: { $in: [mRegex] } },
          { name: { $in: [mRegex] } },
          { description: { $in: [mRegex] } }
        );
      }
      if (modelConditions.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({ $or: modelConditions });
      }
    }

    // Price filtering
    const hasMin = minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice));
    const hasMax = maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice));
    if (hasMin || hasMax) {
      query.price = {};
      if (hasMin) {
        query.price.$gte = Number(minPrice);
      }
      if (hasMax) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Stock filtering
    if (inStockOnly === 'true' || inStockOnly === true) {
      query.stock = true;
      query.stockCount = { $gt: 0 };
    }

    // Featured only
    if (featured === 'true' || featured === true) {
      query.featured = true;
    }

    // Sorting
    const sortOptions = {};
    switch (sort) {
      case 'price-asc':
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price-desc':
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'rating':
      case 'rating-desc':
      case 'rating_desc':
        sortOptions.rating = -1;
        break;
      case 'popular':
      case 'sales':
      case 'best-selling':
        sortOptions.salesCount = -1;
        break;
      case 'newest':
      case 'isNew':
        sortOptions.createdAt = -1;
        break;
      case 'name-asc':
        sortOptions.name = 1;
        break;
      case 'name-desc':
        sortOptions.name = -1;
        break;
      case 'featured':
      default:
        sortOptions.featured = -1;
        sortOptions.createdAt = -1;
        break;
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: p._id.toString(),
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
      products: formatted,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

/**
 * GET /api/products/:id
 * Fetch single product by id, slug, or sku from MongoDB
 */
export const getProductByIdOrSlug = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Product ID or slug is required' });
    }

    if (!isDbConnected()) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const query = [];
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.push({ _id: id });
    }
    query.push({ slug: id });
    query.push({ sku: id });

    const product = await Product.findOne({ $or: query, isActive: true }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { ...product, id: product._id.toString(), _id: product._id.toString() },
    });
  } catch (error) {
    console.error('Error in getProductByIdOrSlug:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

/**
 * GET /api/products/featured
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, data: [] });
    }
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 8);
    let products = await Product.find({ isActive: true, featured: true })
      .sort({ salesCount: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    if (!products || products.length === 0) {
      products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    }

    return res.status(200).json({
      success: true,
      data: products.map((p) => ({ ...p, id: p._id.toString() })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/products/bestselling
 */
export const getBestSellingProducts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, data: [] });
    }
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 8);
    const products = await Product.find({ isActive: true })
      .sort({ salesCount: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: products.map((p) => ({ ...p, id: p._id.toString() })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/products/related/:id
 * Retrieve related products matching category, subcategory, or bike brand
 */
export const getRelatedProducts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, data: [] });
    }
    const { id } = req.params;
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 8);

    let query = [];
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.push({ _id: id });
    }
    query.push({ slug: id });
    query.push({ sku: id });

    const currentProduct = await Product.findOne({ $or: query, isActive: true }).lean();
    if (!currentProduct) {
      return res.status(200).json({ success: true, data: [] });
    }

    const matchConditions = [
      { category: currentProduct.category },
    ];
    if (currentProduct.subcategory) {
      matchConditions.push({ subcategory: currentProduct.subcategory });
    }
    if (Array.isArray(currentProduct.bikeBrands) && currentProduct.bikeBrands.length > 0) {
      matchConditions.push({ bikeBrands: { $in: currentProduct.bikeBrands } });
    }

    const related = await Product.find({
      _id: { $ne: currentProduct._id },
      isActive: true,
      $or: matchConditions,
    })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: related.map((p) => ({ ...p, id: p._id.toString() })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/categories
 * Aggregate all categories and their subcategories from database products
 */
export const getProductCategories = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, data: [] });
    }
    const categoriesAgg = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          subcategories: { $addToSet: '$subcategory' },
          count: { $sum: 1 },
          image: { $first: '$image' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const data = categoriesAgg.map((cat) => ({
      name: cat._id,
      slug: cat._id ? cat._id.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general',
      subcategories: (cat.subcategories || []).filter(Boolean),
      count: cat.count,
      image: cat.image || '',
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/bikes
 * Aggregate all bike brands and models from database products
 */
export const getProductBikes = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, data: [] });
    }
    const bikesAgg = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$bikeBrands' },
      {
        $group: {
          _id: '$bikeBrands',
          models: { $addToSet: '$bikeModels' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const data = bikesAgg.map((b) => ({
      brand: b._id,
      models: Array.from(new Set((b.models || []).flat().filter(Boolean))),
      count: b.count,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  getBestSellingProducts,
  getRelatedProducts,
  getProductCategories,
  getProductBikes,
};
