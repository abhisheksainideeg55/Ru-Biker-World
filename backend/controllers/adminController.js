import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import ReturnRequest from '../models/ReturnRequest.js';
import AuditLog from '../models/AuditLog.js';
import cloudinary from '../config/cloudinary.js';
import { localUserStore } from './authController.js';
import { localReturnStore } from '../services/returnService.js';
import { broadcastUserBlocked, broadcastUserUpdated } from '../services/socketService.js';
import { registerBlock, unregisterBlock } from '../services/blockService.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * Upload Base64 image to Cloudinary if needed
 */
const uploadIfBase64 = async (img) => {
  if (typeof img === 'string' && img.startsWith('data:image')) {
    try {
      const result = await cloudinary.uploader.upload(img, {
        folder: 'ru_biker_world/products',
      });
      return result.secure_url;
    } catch (err) {
      console.error('[Cloudinary Upload Error]', err.message);
      return img;
    }
  }
  return img;
};

/**
 * Generate a URL-friendly slug from string
 */
const generateSlug = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

/**
 * GET /api/admin/dashboard
 * Retrieve admin dashboard overview, KPI summaries, chart trends, and low stock alerts.
 */
export const getAdminDashboardStats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: {
          kpis: {
            totalRevenue: 0,
            revenueGrowth: '0%',
            totalOrders: 0,
            ordersGrowth: '0%',
            totalProducts: 0,
            totalUsers: 0,
            usersGrowth: '0%',
            pendingOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
            lowStockCount: 0,
            outOfStockCount: 0,
            inventoryValuation: 0,
            avgOrderValue: 0,
          },
          salesTrends: [],
          categoryDistribution: [],
          lowStockAlerts: [],
          recentOrders: [],
        },
      });
    }

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      revenueAgg,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockAlerts,
      outOfStockCount,
      valuationAgg,
      categoryAgg,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } },
      ]),
      Order.countDocuments({
        orderStatus: { $in: ['Pending', 'Processing', 'Confirmed', 'Packed'] },
      }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),
      Product.find({ stockCount: { $lte: 5, $gt: 0 }, isActive: true })
        .limit(8)
        .lean(),
      Product.countDocuments({
        $or: [{ stockCount: { $lte: 0 } }, { stock: false }],
      }),
      Product.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: { $multiply: [{ $ifNull: ['$price', 0] }, { $ifNull: ['$stockCount', 0] }] },
            },
          },
        },
      ]),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('user', 'name email phone')
        .lean(),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const inventoryValuation = valuationAgg[0]?.total || 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const categoryDistribution = categoryAgg.map((c, idx) => {
      const palette = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#eab308'];
      const pct = totalProducts > 0 ? Math.round((c.count / totalProducts) * 100) : 0;
      return {
        name: c._id || 'Uncategorized',
        value: pct,
        count: c.count,
        color: palette[idx % palette.length],
      };
    });

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesTrends = days.map((day) => ({
      name: day,
      revenue: 0,
      orders: 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          revenueGrowth: '+0%',
          totalOrders,
          ordersGrowth: '+0%',
          totalProducts,
          totalUsers,
          usersGrowth: '+0%',
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          lowStockCount: lowStockAlerts.length,
          outOfStockCount,
          inventoryValuation,
          avgOrderValue,
        },
        salesTrends,
        categoryDistribution,
        lowStockAlerts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/products
 * Query products with text search, categories, brands, stock filter, sorting & pagination.
 */
export const getAdminProducts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: {
          products: [],
          total: 0,
          page: 1,
          totalPages: 1,
          limit: 15,
        },
      });
    }

    const {
      search = '',
      category = 'all',
      brand = 'all',
      stockStatus = 'all',
      sort = 'createdAt_desc',
      page = 1,
      limit = 15,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      query.$or = [
        { name: regex },
        { sku: regex },
        { brand: regex },
        { category: regex },
        { subcategory: regex },
      ];
    }

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (brand && brand !== 'all') {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'inStock') {
        query.stockCount = { $gt: 5 };
        query.stock = true;
      } else if (stockStatus === 'lowStock') {
        query.stockCount = { $lte: 5, $gt: 0 };
      } else if (stockStatus === 'outOfStock') {
        query.$or = [{ stockCount: { $lte: 0 } }, { stock: false }];
      }
    }

    const sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'stock_asc':
        sortOptions.stockCount = 1;
        break;
      case 'stock_desc':
        sortOptions.stockCount = -1;
        break;
      case 'rating_desc':
        sortOptions.rating = -1;
        break;
      case 'sales_desc':
        sortOptions.salesCount = -1;
        break;
      case 'name_asc':
        sortOptions.name = 1;
        break;
      case 'createdAt_desc':
      default:
        sortOptions.createdAt = -1;
        break;
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: {
        products: products.map((p) => ({ ...p, id: p._id.toString() })),
        total,
        page: pageNum,
        totalPages,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Error in getAdminProducts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin products',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/products
 * Admin creates a new product in the database.
 */
export const createAdminProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      price,
      originalPrice,
      cost,
      brand,
      sku,
      image,
      images,
      video,
      videoTitle,
      videoThumbnail,
      stockCount,
      isActive,
      description,
      shortDescription,
      technicalSpecs,
      shippingCharge,
      weight,
      dimensions,
      shippingTier,
      isFreeShipping,
      bikeBrands,
      bikeModels,
      featured,
      isNew,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, and Price are required fields.',
      });
    }

    const baseSlug = generateSlug(name) || `product-${Date.now()}`;
    let uniqueSlug = baseSlug;

    const generatedSku =
      sku ||
      `MZ-${(category || 'PRT').substring(0, 3).toUpperCase()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

    const numPrice = Number(price);
    const numOrig = originalPrice ? Number(originalPrice) : numPrice;
    const discount =
      numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;
    const countVal = stockCount !== undefined ? Number(stockCount) : 10;
    const inStock = countVal > 0 && (isActive !== undefined ? isActive : true);

    const productImages = Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];
    const mainImage = image || (productImages.length > 0 ? productImages[0] : '');

    if (!isDbConnected()) {
      const generatedId = `prod-${Date.now()}`;
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          _id: generatedId,
          id: generatedId,
          name: name.trim(),
          slug: uniqueSlug,
          sku: generatedSku,
          brand: brand || 'Sparify Genuine Parts',
          category: category.trim(),
          subcategory: subcategory ? subcategory.trim() : 'General',
          price: numPrice,
          originalPrice: numOrig,
          cost: cost ? Number(cost) : undefined,
          discount,
          stock: inStock,
          stockCount: countVal,
          maxPurchaseQuantity: 5,
          isActive: isActive !== undefined ? isActive : true,
          image: mainImage,
          images: productImages,
          video: video || '',
          videoTitle: videoTitle || '',
          videoThumbnail: videoThumbnail || '',
          bikeBrands: Array.isArray(bikeBrands) ? bikeBrands : [],
          bikeModels: Array.isArray(bikeModels) ? bikeModels : [],
          description: description || shortDescription || '',
          shortDescription: shortDescription || description || '',
          technicalSpecs: technicalSpecs || '',
          shippingCharge: isFreeShipping ? 0 : Number(shippingCharge || 0),
          weight: weight || '',
          dimensions: dimensions || '',
          shippingTier: shippingTier || 'standard',
          isFreeShipping: Boolean(isFreeShipping),
          featured: Boolean(featured),
          isNew: Boolean(isNew),
          rating: 5.0,
          reviewCount: 0,
          salesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    // Process and auto-upload any base64 images to Cloudinary
    let processedImages = [];
    if (Array.isArray(productImages)) {
      processedImages = await Promise.all(productImages.map((img) => uploadIfBase64(img)));
    }
    const processedMainImage = await uploadIfBase64(mainImage || (processedImages[0] || ''));

    let count = 1;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const newProduct = new Product({
      name: name.trim(),
      slug: uniqueSlug,
      sku: generatedSku,
      brand: brand || 'Sparify Genuine Parts',
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : 'General',
      price: numPrice,
      originalPrice: numOrig,
      cost: cost ? Number(cost) : undefined,
      discount,
      stock: inStock,
      stockCount: countVal,
      maxPurchaseQuantity: 5,
      isActive: isActive !== undefined ? isActive : true,
      image: processedMainImage,
      images: processedImages,
      video: video || '',
      videoTitle: videoTitle || '',
      videoThumbnail: videoThumbnail || '',
      bikeBrands: Array.isArray(bikeBrands) ? bikeBrands : [],
      bikeModels: Array.isArray(bikeModels) ? bikeModels : [],
      description: description || shortDescription || '',
      shortDescription: shortDescription || description || '',
      technicalSpecs: technicalSpecs || '',
      shippingCharge: isFreeShipping ? 0 : Number(shippingCharge || 0),
      weight: weight || '',
      dimensions: dimensions || '',
      shippingTier: shippingTier || 'standard',
      isFreeShipping: Boolean(isFreeShipping),
      featured: Boolean(featured),
      isNew: Boolean(isNew),
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
    });

    const saved = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { ...saved.toObject(), id: saved._id.toString() },
    });
  } catch (error) {
    console.error('Error in createAdminProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/products/:id
 * Admin updates an existing product.
 */
export const updateAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: { _id: id, id, ...req.body, updatedAt: new Date().toISOString() },
      });
    }

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.$or = [{ slug: id }, { sku: id }];
    }

    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updates = { ...req.body };

    if (updates.name && updates.name !== product.name && !updates.slug) {
      const baseSlug = generateSlug(updates.name);
      let uniqueSlug = baseSlug;
      let count = 1;
      while (
        await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } })
      ) {
        uniqueSlug = `${baseSlug}-${count++}`;
      }
      updates.slug = uniqueSlug;
    }

    if (updates.stockCount !== undefined) {
      const cnt = Number(updates.stockCount);
      updates.stockCount = Math.max(0, cnt);
      updates.stock = updates.stockCount > 0;
    }

    if (updates.price !== undefined || updates.originalPrice !== undefined) {
      const pPrice = updates.price !== undefined ? Number(updates.price) : product.price;
      const pOrig = updates.originalPrice !== undefined ? Number(updates.originalPrice) : product.originalPrice;
      if (pOrig && pOrig > pPrice) {
        updates.discount = Math.round(((pOrig - pPrice) / pOrig) * 100);
      } else {
        updates.discount = 0;
      }
    }

    if (Array.isArray(updates.images)) {
      updates.images = await Promise.all(updates.images.map((img) => uploadIfBase64(img)));
    }
    if (updates.image) {
      updates.image = await uploadIfBase64(updates.image);
    }

    Object.assign(product, updates);
    const updated = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { ...updated.toObject(), id: updated._id.toString() },
    });
  } catch (error) {
    console.error('Error in updateAdminProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/products/:id
 * Admin deletes a product from the database.
 */
export const deleteAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.$or = [{ slug: id }, { sku: id }];
    }

    const product = await Product.findOneAndDelete(query);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error in deleteAdminProduct:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/products/:id/stock
 * Quick stock adjustment for a single product.
 */
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockCount, delta } = req.body;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.$or = [{ slug: id }, { sku: id }];
    }

    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let newStock = product.stockCount || 0;
    if (stockCount !== undefined) {
      newStock = Math.max(0, Number(stockCount));
    } else if (delta !== undefined) {
      newStock = Math.max(0, newStock + Number(delta));
    }

    product.stockCount = newStock;
    product.stock = newStock > 0;
    await product.save();

    return res.status(200).json({
      success: true,
      data: {
        id: product._id.toString(),
        stockCount: product.stockCount,
        stock: product.stock,
      },
    });
  } catch (error) {
    console.error('Error in updateProductStock:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/inventory
 * Overview of inventory valuation, counts, and items.
 */
export const getAdminInventory = async (req, res) => {
  try {
    const products = await Product.find().sort({ stockCount: 1 }).lean();

    const summary = {
      totalItems: products.length,
      totalUnits: products.reduce((sum, p) => sum + (p.stockCount || 0), 0),
      totalValuation: products.reduce(
        (sum, p) => sum + Number(p.price || 0) * (p.stockCount || 0),
        0
      ),
      lowStockCount: products.filter(
        (p) => (p.stockCount || 0) <= 5 && (p.stockCount || 0) > 0
      ).length,
      outOfStockCount: products.filter(
        (p) => (p.stockCount || 0) === 0 || p.stock === false
      ).length,
    };

    return res.status(200).json({
      success: true,
      data: {
        summary,
        inventory: products.map((p) => ({ ...p, id: p._id.toString() })),
      },
    });
  } catch (error) {
    console.error('Error in getAdminInventory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/inventory/batch
 * Batch update stock levels for multiple products.
 */
export const batchUpdateInventory = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updates provided',
      });
    }

    const bulkOps = updates
      .filter((u) => u.id && u.stockCount !== undefined)
      .map((u) => {
        const count = Math.max(0, Number(u.stockCount));
        const query = mongoose.Types.ObjectId.isValid(u.id)
          ? { _id: u.id }
          : { sku: u.id };
        return {
          updateOne: {
            filter: query,
            update: {
              $set: {
                stockCount: count,
                stock: count > 0,
              },
            },
          },
        };
      });

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${bulkOps.length} inventory items`,
    });
  } catch (error) {
    console.error('Error in batchUpdateInventory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to batch update inventory',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/users
 * Retrieve all registered users.
 */
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        users: users.map((u) => ({ ...u, id: u._id.toString() })),
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Error in getAdminUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/users
 * Admin creates a new staff / user account.
 */
export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone || '',
      isActive: true,
    });

    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { ...userObj, id: userObj._id.toString() },
    });
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/users/:id
 * Admin updates user role or active status.
 */
export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive, name, phone } = req.body;

    let user = null;

    if (isDbConnected()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      } else {
        const cleanPhone = id.replace(/\D/g, '').slice(-10);
        user = await User.findOne({
          $or: [
            { email: id.toLowerCase().trim() },
            { phone: id },
            ...(cleanPhone ? [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }] : [])
          ]
        });
      }

      if (user) {
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = Boolean(isActive);
        if (name) user.name = name.trim();
        if (phone !== undefined) user.phone = phone;
        await user.save();
      }
    }

    // Also update localUserStore
    for (const [key, lu] of localUserStore.entries()) {
      const luPhone = (lu.phone || '').replace(/\D/g, '').slice(-10);
      const cleanIdPhone = id.replace(/\D/g, '').slice(-10);

      if (
        lu.id === id || 
        lu._id === id || 
        lu.email === id.toLowerCase().trim() ||
        (cleanIdPhone && luPhone === cleanIdPhone)
      ) {
        if (role) lu.role = role;
        if (isActive !== undefined) lu.isActive = Boolean(isActive);
        if (name) lu.name = name.trim();
        if (phone !== undefined) lu.phone = phone;
        localUserStore.set(key, lu);
        if (!user) user = lu;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { ...userObj, id: userObj._id ? userObj._id.toString() : userObj.id },
    });
  } catch (error) {
    console.error('Error in updateAdminUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Admin deletes user account.
 */
export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin' && user.email === 'admin@rubikerworld.com') {
      return res.status(400).json({
        success: false,
        message: 'Master Super Admin cannot be deleted.',
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteAdminUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/users/:id/block
 * Admin blocks user (Permanent or Temporary with duration & reason),
 * increments tokenVersion to revoke all active sessions, writes audit log, and emits real-time WebSocket event.
 */
export const blockAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { blockType = 'permanent', reason = '', durationHours, customBlockedUntil } = req.body;

    let user = null;

    if (isDbConnected()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      } else {
        const cleanPhone = id.replace(/\D/g, '').slice(-10);
        user = await User.findOne({
          $or: [
            { email: id.toLowerCase().trim() },
            { phone: id },
            ...(cleanPhone ? [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }] : [])
          ]
        });
      }
    }

    // Local fallback check
    if (!user) {
      for (const [key, lu] of localUserStore.entries()) {
        const luPhone = (lu.phone || '').replace(/\D/g, '').slice(-10);
        const cleanIdPhone = id.replace(/\D/g, '').slice(-10);
        if (
          lu.id === id || 
          lu._id === id || 
          lu.email === id.toLowerCase().trim() ||
          (cleanIdPhone && luPhone === cleanIdPhone)
        ) {
          user = lu;
          break;
        }
      }
    }

    const cleanIdDigits = id.replace(/\D/g, '').slice(-10);

    // If still not found, create fallback entry for ID or phone so it is immediately blocked everywhere
    if (!user) {
      const fallbackEmail = id.includes('@') ? id.toLowerCase().trim() : (cleanIdDigits.length === 10 ? `rider_${cleanIdDigits}@sparify.in` : `user_${id}@sparify.in`);
      const fallbackPhone = cleanIdDigits.length === 10 ? cleanIdDigits : '';
      user = {
        _id: id,
        id: id,
        name: cleanIdDigits.length === 10 ? `Rider ${cleanIdDigits.slice(-4)}` : 'Customer',
        email: fallbackEmail,
        phone: fallbackPhone,
        role: 'customer',
        isActive: true,
        tokenVersion: 0,
      };
      localUserStore.set(fallbackEmail, user);
      if (fallbackPhone) localUserStore.set(fallbackPhone, user);
    }

    if (user.role === 'admin' && user.email === 'admin@rubikerworld.com') {
      return res.status(400).json({
        success: false,
        message: 'Master Super Admin cannot be blocked.',
      });
    }

    // Determine Block Expiry
    let blockedUntil = null;
    const isTemp = blockType === 'temporary';
    if (isTemp) {
      if (customBlockedUntil) {
        blockedUntil = new Date(customBlockedUntil);
      } else if (durationHours) {
        blockedUntil = new Date(Date.now() + Number(durationHours) * 60 * 60 * 1000);
      } else {
        blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // default 24h
      }
    }

    const blockReasonText = reason.trim() || 'Suspension by administrator for platform security.';
    const blockPayload = {
      reason: blockReasonText,
      blockType: isTemp ? 'temporary' : 'permanent',
      blockedAt: new Date(),
      blockedUntil: isTemp ? blockedUntil : null,
      blockedBy: req.user?._id || req.user?.id || null,
    };

    const nextTokenVersion = (user.tokenVersion || 0) + 1;

    if (isDbConnected() && typeof user.save === 'function') {
      user.status = isTemp ? 'temporarily_blocked' : 'blocked';
      user.isActive = false;
      user.tokenVersion = nextTokenVersion;
      user.blockDetails = blockPayload;
      await user.save();
    } else {
      user.status = isTemp ? 'temporarily_blocked' : 'blocked';
      user.isActive = false;
      user.tokenVersion = nextTokenVersion;
      user.blockDetails = blockPayload;
      localUserStore.set(user.email, user);
      if (user.phone) {
        const pDigits = user.phone.replace(/\D/g, '').slice(-10);
        if (pDigits) localUserStore.set(pDigits, user);
      }
    }

    const userIdStr = user._id ? user._id.toString() : user.id;

    // Register active block in global block service registry
    registerBlock({
      userId: userIdStr,
      email: user.email,
      phone: user.phone || cleanIdDigits,
      blockDetails: blockPayload,
      blockedUntil: isTemp ? blockedUntil : null,
    });

    // Record in Audit Log
    try {
      if (isDbConnected()) {
        await AuditLog.create({
          adminId: req.user?._id || req.user?.id || null,
          adminEmail: req.user?.email || 'admin@rubikerworld.com',
          action: isTemp ? 'TEMP_BLOCK_USER' : 'BLOCK_USER',
          targetUserId: userIdStr,
          targetUserEmail: user.email,
          targetUserName: user.name,
          reason: blockReasonText,
          blockType: isTemp ? 'temporary' : 'permanent',
          blockedUntil: isTemp ? blockedUntil : null,
          ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
        });
      }
    } catch (auditErr) {
      console.error('[AuditLog Error]:', auditErr.message);
    }

    // Real-time WebSocket session revocation across all devices
    broadcastUserBlocked(userIdStr, {
      code: 'ACCOUNT_BLOCKED',
      message: 'Your account has been temporarily restricted from placing orders. Please contact RU Biker World Support for assistance.',
      blockDetails: blockPayload,
    });
    if (user.phone) {
      const pClean = user.phone.replace(/\D/g, '').slice(-10);
      if (pClean) broadcastUserBlocked(pClean, { code: 'ACCOUNT_BLOCKED', blockDetails: blockPayload });
    }

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been ${isTemp ? 'temporarily' : 'permanently'} blocked. All active sessions have been revoked.`,
      data: {
        id: userIdStr,
        status: user.status,
        isActive: false,
        tokenVersion: nextTokenVersion,
        blockDetails: blockPayload,
      },
    });
  } catch (error) {
    console.error('Error in blockAdminUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to block user',
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/users/:id/unblock
 * Admin unblocks user account, resets status to active, and writes audit log.
 */
export const unblockAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Restored access by administration' } = req.body;

    let user = null;

    if (isDbConnected()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      } else {
        const cleanPhone = id.replace(/\D/g, '').slice(-10);
        user = await User.findOne({
          $or: [
            { email: id.toLowerCase().trim() },
            { phone: id },
            ...(cleanPhone ? [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }] : [])
          ]
        });
      }
    }

    if (!user) {
      for (const [key, lu] of localUserStore.entries()) {
        const luPhone = (lu.phone || '').replace(/\D/g, '').slice(-10);
        const cleanIdPhone = id.replace(/\D/g, '').slice(-10);
        if (
          lu.id === id || 
          lu._id === id || 
          lu.email === id.toLowerCase().trim() ||
          (cleanIdPhone && luPhone === cleanIdPhone)
        ) {
          user = lu;
          break;
        }
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const nextTokenVersion = (user.tokenVersion || 0) + 1;

    if (isDbConnected() && typeof user.save === 'function') {
      user.status = 'active';
      user.isActive = true;
      user.blockDetails = undefined;
      user.tokenVersion = nextTokenVersion;
      await user.save();
    } else {
      user.status = 'active';
      user.isActive = true;
      user.blockDetails = undefined;
      user.tokenVersion = nextTokenVersion;
      localUserStore.set(user.email, user);
      if (user.phone) {
        const pDigits = user.phone.replace(/\D/g, '').slice(-10);
        if (pDigits) localUserStore.set(pDigits, user);
      }
    }

    const userIdStr = user._id ? user._id.toString() : user.id;

    // Unregister block from global registry
    unregisterBlock({
      userId: userIdStr,
      email: user.email,
      phone: user.phone,
    });

    // Record in Audit Log
    try {
      if (isDbConnected()) {
        await AuditLog.create({
          adminId: req.user?._id || req.user?.id || null,
          adminEmail: req.user?.email || 'admin@rubikerworld.com',
          action: 'UNBLOCK_USER',
          targetUserId: userIdStr,
          targetUserEmail: user.email,
          targetUserName: user.name,
          reason: reason.trim() || 'Access restored by administrator',
          ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
        });
      }
    } catch (auditErr) {
      console.error('[AuditLog Error]:', auditErr.message);
    }

    broadcastUserUpdated(userIdStr, { status: 'active', isActive: true });

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been unblocked successfully.`,
      data: {
        id: userIdStr,
        status: 'active',
        isActive: true,
      },
    });
  } catch (error) {
    console.error('Error in unblockAdminUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unblock user',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/audit-logs
 * Fetch recent admin audit logs
 */
export const getAdminAuditLogs = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: { logs: [], total: 0 },
      });
    }

    const logs = await AuditLog.find()
      .populate('adminId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        logs: logs.map((l) => ({ ...l, id: l._id.toString() })),
        total: logs.length,
      },
    });
  } catch (error) {
    console.error('Error in getAdminAuditLogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/orders
 * Retrieve all orders in the system.
 */
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        orders: orders.map((o) => ({
          ...o,
          id: o._id.toString(),
          customerName: o.shippingAddress?.fullName || o.user?.name || 'Customer',
          userEmail: o.user?.email || '',
          userPhone: o.shippingAddress?.phone || o.user?.phone || '',
          totalAmount: o.grandTotal,
        })),
        total: orders.length,
      },
    });
  } catch (error) {
    console.error('Error in getAdminOrders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/orders/:id/status
 * Admin updates order tracking status or adds notes.
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingCarrier, trackingNumber, notes } = req.body;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        message: notes || `Order status updated to ${orderStatus} by Administrator.`,
        timestamp: new Date(),
      });
    }

    if (trackingCarrier || trackingNumber) {
      order.tracking = order.tracking || {};
      if (trackingCarrier) order.tracking.carrier = trackingCarrier;
      if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { ...order.toObject(), id: order._id.toString() },
    });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/returns
 * Retrieve all customer return & refund requests
 */
export const getAdminReturns = async (req, res) => {
  try {
    let returns = [];
    if (isDbConnected()) {
      returns = await ReturnRequest.find({})
        .populate('user', 'name email phone avatar')
        .populate('order', 'orderNumber orderStatus grandTotal createdAt paymentMethod paymentStatus')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      for (const [, r] of localReturnStore.entries()) {
        returns.push(r);
      }
      returns.sort((a, b) => new Date(b.createdAt || b.requestedAt) - new Date(a.createdAt || a.requestedAt));
    }

    return res.status(200).json({
      success: true,
      count: returns.length,
      data: returns,
    });
  } catch (error) {
    console.error('Error in getAdminReturns:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch return requests',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/returns/:id
 * Update status, admin note, or refund amount for a return request
 */
export const updateAdminReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote, refundAmount, refundMethod } = req.body;

    let returnReq = null;
    if (isDbConnected()) {
      let query = [];
      if (mongoose.Types.ObjectId.isValid(id)) query.push({ _id: id });
      returnReq = await ReturnRequest.findOne({ $or: query }).populate('order');
    } else {
      returnReq = localReturnStore.get(id);
    }

    if (!returnReq) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found.',
      });
    }

    if (status) {
      returnReq.status = status;
    }
    if (adminNote !== undefined) {
      returnReq.adminNote = adminNote;
    }
    if (refundAmount !== undefined) {
      returnReq.refundAmount = Number(refundAmount);
    }
    if (refundMethod !== undefined) {
      returnReq.refundMethod = refundMethod;
    }
    if (status === 'Refunded' || status === 'Approved') {
      returnReq.processedAt = new Date();
    }

    if (isDbConnected()) {
      await returnReq.save();

      if (returnReq.order) {
        const order = await Order.findById(returnReq.order._id || returnReq.order);
        if (order) {
          if (status === 'Refunded') {
            order.paymentStatus = 'Refunded';
            order.orderStatus = 'Refunded';
          } else if (status === 'Approved') {
            order.orderStatus = 'Return Approved';
          } else if (status === 'Rejected') {
            order.orderStatus = 'Return Rejected';
          }
          if (!order.statusHistory) order.statusHistory = [];
          order.statusHistory.push({
            status: order.orderStatus,
            message: adminNote ? `Return request ${status}: ${adminNote}` : `Return request marked as ${status} by Administrator.`,
            timestamp: new Date(),
          });
          await order.save();
        }
      }
    } else {
      returnReq.updatedAt = new Date();
      localReturnStore.set(id, returnReq);
    }

    return res.status(200).json({
      success: true,
      message: `Return request updated to ${status || returnReq.status}`,
      data: returnReq,
    });
  } catch (error) {
    console.error('Error in updateAdminReturnStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update return request',
      error: error.message,
    });
  }
};

export default {
  getAdminDashboardStats,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateProductStock,
  getAdminInventory,
  batchUpdateInventory,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  blockAdminUser,
  unblockAdminUser,
  getAdminAuditLogs,
  getAdminOrders,
  updateOrderStatus,
  getAdminReturns,
  updateAdminReturnStatus,
};