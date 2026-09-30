import api from './api';
import { allProducts } from '../data/products';

const ADMIN_PRODUCTS_STORAGE_KEY = 'motozone_admin_products_v2';
const ADMIN_USERS_STORAGE_KEY = 'motozone_admin_users_v2';
const ADMIN_ORDERS_STORAGE_KEY = 'motozone_admin_orders_v2';

// Initial fallback mock users
const initialUsers = [
  {
    id: 'usr-001',
    _id: 'usr-001',
    name: 'Abhishek Sharma',
    email: 'abhishek@motozone.com',
    phone: '+91 98765 43210',
    role: 'admin',
    isActive: true,
    ordersCount: 18,
    totalSpent: 54900,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15T10:30:00.000Z',
    address: 'Flat 402, Royal Palms, Bangalore, Karnataka - 560001',
  },
  {
    id: 'usr-002',
    _id: 'usr-002',
    name: 'Vikram Rajput',
    email: 'vikram.r@gmail.com',
    phone: '+91 98234 56789',
    role: 'customer',
    isActive: true,
    ordersCount: 7,
    totalSpent: 21850,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-03-10T14:20:00.000Z',
    address: 'B-12, Green Avenue, Pune, Maharashtra - 411038',
  },
  {
    id: 'usr-003',
    _id: 'usr-003',
    name: 'Sneha Patel',
    email: 'sneha.patel@outlook.com',
    phone: '+91 97123 45678',
    role: 'customer',
    isActive: true,
    ordersCount: 4,
    totalSpent: 9640,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-04-02T09:15:00.000Z',
    address: '15, Shanti Niketan, Ahmedabad, Gujarat - 380015',
  },
  {
    id: 'usr-004',
    _id: 'usr-004',
    name: 'Rahul Verma',
    email: 'rahul.speed@yahoo.com',
    phone: '+91 99887 66554',
    role: 'manager',
    isActive: true,
    ordersCount: 11,
    totalSpent: 38700,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-20T11:45:00.000Z',
    address: '77, Ring Road, New Delhi, Delhi - 110001',
  },
  {
    id: 'usr-005',
    _id: 'usr-005',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@gmail.com',
    phone: '+91 91234 56780',
    role: 'customer',
    isActive: true,
    ordersCount: 2,
    totalSpent: 4200,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-05-12T16:00:00.000Z',
    address: '104, TTK Road, Chennai, Tamil Nadu - 600018',
  },
  {
    id: 'usr-006',
    _id: 'usr-006',
    name: 'Karan Malhotra',
    email: 'karan.m@gmail.com',
    phone: '+91 94567 89012',
    role: 'staff',
    isActive: true,
    ordersCount: 5,
    totalSpent: 12300,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-05-01T08:30:00.000Z',
    address: 'Plot 88, Sector 18, Gurgaon, Haryana - 122001',
  }
];

// Initial fallback mock orders
const initialOrders = [
  {
    _id: 'ord-101',
    id: 'ord-101',
    orderNumber: 'MZ-89241',
    customerName: 'Vikram Rajput',
    userEmail: 'vikram.r@gmail.com',
    userPhone: '+91 98234 56789',
    totalAmount: 4899,
    orderStatus: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI (Google Pay)',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        productName: 'MotoZone Ceramic Race Front Brake Pads',
        SKU: 'MZ-BRK-001',
        quantity: 2,
        price: 899,
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      },
      {
        productName: 'Rolon Brass X-Ring Chain & Sprocket Kit',
        SKU: 'ROL-CHN-039',
        quantity: 1,
        price: 2450,
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
      }
    ],
    shippingAddress: {
      fullName: 'Vikram Rajput',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411038',
      addressLine1: 'B-12, Green Avenue, Kothrud',
    },
    tracking: {
      carrier: 'Delhivery Express',
      trackingNumber: 'DEL8924109IN',
    }
  },
  {
    _id: 'ord-102',
    id: 'ord-102',
    orderNumber: 'MZ-89240',
    customerName: 'Sneha Patel',
    userEmail: 'sneha.patel@outlook.com',
    userPhone: '+91 97123 45678',
    totalAmount: 1650,
    orderStatus: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    items: [
      {
        productName: 'BMC Performance High-Flow Air Filter',
        SKU: 'BMC-AIR-015',
        quantity: 1,
        price: 1650,
        image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&auto=format&fit=crop&q=80',
      }
    ],
    shippingAddress: {
      fullName: 'Sneha Patel',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380015',
      addressLine1: '15, Shanti Niketan, Bodakdev',
    },
    tracking: {
      carrier: 'Blue Dart',
      trackingNumber: 'BLU7732910IN',
    }
  },
  {
    _id: 'ord-103',
    id: 'ord-103',
    orderNumber: 'MZ-89239',
    customerName: 'Rahul Verma',
    userEmail: 'rahul.speed@yahoo.com',
    userPhone: '+91 99887 66554',
    totalAmount: 8400,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'NetBanking',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    items: [
      {
        productName: 'Dual High-Intensity Cree LED Auxiliary Fog Light Pods',
        SKU: 'HEL-LGT-002',
        quantity: 2,
        price: 3899,
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
      }
    ],
    shippingAddress: {
      fullName: 'Rahul Verma',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      addressLine1: '77, Ring Road, Connaught Place',
    },
    tracking: {
      carrier: 'Delhivery Express',
      trackingNumber: 'DEL8830114IN',
    }
  },
  {
    _id: 'ord-104',
    id: 'ord-104',
    orderNumber: 'MZ-89238',
    customerName: 'Pooja Iyer',
    userEmail: 'pooja.iyer@gmail.com',
    userPhone: '+91 91234 56780',
    totalAmount: 2450,
    orderStatus: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery (COD)',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    items: [
      {
        productName: 'Aviation Aluminum Sump Guard & Engine Bash Plate',
        SKU: 'MZ-GRD-045',
        quantity: 1,
        price: 1999,
        image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80',
      }
    ],
    shippingAddress: {
      fullName: 'Pooja Iyer',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600018',
      addressLine1: '104, TTK Road, Alwarpet',
    },
    tracking: {
      carrier: 'DTDC',
      trackingNumber: 'DTD9021945IN',
    }
  }
];

// Initialized caches populated with full products catalog
let memoryProducts = [];
let memoryUsers = [];
let memoryOrders = [];

const getStoredProducts = () => {
  if (!memoryProducts || memoryProducts.length === 0) {
    try {
      const stored = localStorage.getItem('rubiker_admin_custom_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryProducts = parsed;
        } else {
          memoryProducts = [...allProducts];
        }
      } else {
        memoryProducts = [...allProducts];
      }
    } catch {
      memoryProducts = [...allProducts];
    }
  }
  return memoryProducts;
};

const saveStoredProducts = (products) => {
  memoryProducts = products;
  try {
    localStorage.setItem('rubiker_admin_custom_products', JSON.stringify(products));
  } catch {}
};

const getStoredUsers = () => {
  if (!memoryUsers || memoryUsers.length === 0) {
    try {
      const stored = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
      memoryUsers = stored ? JSON.parse(stored) : [...initialUsers];
    } catch {
      memoryUsers = [...initialUsers];
    }
  }
  return memoryUsers;
};

const saveStoredUsers = (users) => {
  memoryUsers = users;
  try {
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {}
};

const getStoredOrders = () => {
  if (!memoryOrders || memoryOrders.length === 0) {
    try {
      const stored = localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY);
      memoryOrders = stored ? JSON.parse(stored) : [...initialOrders];
    } catch {
      memoryOrders = [...initialOrders];
    }
  }
  return memoryOrders;
};

const saveStoredOrders = (orders) => {
  memoryOrders = orders;
  try {
    localStorage.setItem(ADMIN_ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {}
};

export const adminService = {
  /**
   * Get Dashboard Summary KPI & Charts
   */
  getDashboardStats: async () => {
    try {
      const res = await api.get('/admin/dashboard', {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {
      // Fallback calculation using local store
    }

    const products = getStoredProducts();
    const orders = getStoredOrders();
    const users = getStoredUsers();

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0) + 128450;
    const totalOrders = orders.length + 42;
    const totalProducts = products.length;
    const totalUsers = users.length + 120;

    const lowStockAlerts = products.filter((p) => (p.stockCount ?? 10) <= 5 && (p.stockCount ?? 10) > 0);
    const outOfStockCount = products.filter((p) => (p.stockCount ?? 10) === 0 || p.stock === false).length;
    const inventoryValuation = products.reduce((sum, p) => sum + (Number(p.price || 0) * (p.stockCount ?? 10)), 0);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesTrends = days.map((d, i) => ({
      name: d,
      revenue: Math.round(22000 + Math.sin(i + 1) * 9000 + i * 4000),
      orders: Math.round(8 + i * 3 + Math.floor(Math.random() * 5)),
    }));

    const categoryDistribution = [
      { name: 'Spare Parts', value: 44, count: 96, color: '#f97316' },
      { name: 'Accessories', value: 24, count: 52, color: '#3b82f6' },
      { name: 'Protection', value: 18, count: 38, color: '#10b981' },
      { name: 'Oils & Fluids', value: 14, count: 28, color: '#8b5cf6' },
    ];

    return {
      kpis: {
        totalRevenue,
        revenueGrowth: '+18.4%',
        totalOrders,
        ordersGrowth: '+12.6%',
        totalProducts,
        totalUsers,
        usersGrowth: '+24.1%',
        pendingOrders: orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length,
        deliveredOrders: orders.filter((o) => o.orderStatus === 'Delivered').length,
        cancelledOrders: orders.filter((o) => o.orderStatus === 'Cancelled').length,
        lowStockCount: lowStockAlerts.length,
        outOfStockCount,
        inventoryValuation,
        avgOrderValue: Math.round(totalRevenue / totalOrders),
      },
      salesTrends,
      categoryDistribution,
      lowStockAlerts: lowStockAlerts.slice(0, 6),
      recentOrders: orders.slice(0, 8),
    };
  },

  /**
   * Get all products with filters, sorting and pagination
   */
  getProducts: async ({ search = '', category = 'all', brand = 'all', stockStatus = 'all', sort = 'createdAt_desc', page = 1, limit = 15 } = {}) => {
    try {
      const res = await api.get('/admin/products', {
        params: { search, category, brand, stockStatus, sort, page, limit },
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {}

    let list = [...getStoredProducts()];

    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (brand && brand !== 'all') {
      list = list.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
    }

    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'inStock') {
        list = list.filter((p) => (p.stockCount ?? 10) > 5);
      } else if (stockStatus === 'lowStock') {
        list = list.filter((p) => (p.stockCount ?? 10) <= 5 && (p.stockCount ?? 10) > 0);
      } else if (stockStatus === 'outOfStock') {
        list = list.filter((p) => (p.stockCount ?? 10) === 0 || p.stock === false);
      }
    }

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'stock_asc':
        list.sort((a, b) => (a.stockCount ?? 0) - (b.stockCount ?? 0));
        break;
      case 'stock_desc':
        list.sort((a, b) => (b.stockCount ?? 0) - (a.stockCount ?? 0));
        break;
      case 'rating_desc':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'sales_desc':
        list.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case 'name_asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'createdAt_desc':
      default:
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      products: paginated,
      total,
      page,
      totalPages,
      limit,
    };
  },

  /**
   * Add a new product
   */
  createProduct: async (productData) => {
    try {
      const res = await api.post('/admin/products', productData, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        const current = getStoredProducts();
        saveStoredProducts([res.data.data, ...current.filter((p) => (p.id || p._id) !== (res.data.data.id || res.data.data._id))]);
        return res.data.data;
      }
    } catch (e) {}

    // Offline / Local Persistence Fallback
    const newProduct = {
      ...productData,
      id: 'prod-custom-' + Date.now(),
      _id: 'prod-custom-' + Date.now(),
      createdAt: new Date().toISOString(),
      stock: (Number(productData.stockCount) || 10) > 0,
      stockCount: Number(productData.stockCount) || 10,
      rating: 5.0,
      reviewCount: 0,
    };
    const current = getStoredProducts();
    saveStoredProducts([newProduct, ...current]);
    return newProduct;
  },

  /**
   * Update existing product
   */
  updateProduct: async (id, updates) => {
    try {
      const res = await api.put(`/admin/products/${id}`, updates, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        const current = getStoredProducts();
        const idx = current.findIndex((p) => p.id === id || p._id === id);
        if (idx !== -1) {
          current[idx] = res.data.data;
          saveStoredProducts(current);
        }
        return res.data.data;
      }
    } catch (e) {}

    const current = getStoredProducts();
    const idx = current.findIndex((p) => p.id === id || p._id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates, updatedAt: new Date().toISOString() };
      saveStoredProducts(current);
      return current[idx];
    }
    throw new Error('Product not found');
  },

  /**
   * Delete product
   */
  deleteProduct: async (id) => {
    try {
      await api.delete(`/admin/products/${id}`, {
        headers: { 'x-admin-dev-access': 'true' },
      });
    } catch (e) {}
    const current = getStoredProducts();
    const filtered = current.filter((p) => p.id !== id && p._id !== id);
    saveStoredProducts(filtered);
    return true;
  },

  /**
   * Quick Update Product Stock
   */
  updateStock: async (id, { stockCount, delta }) => {
    try {
      const res = await api.patch(`/admin/products/${id}/stock`, { stockCount, delta }, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        const current = getStoredProducts();
        const p = current.find((x) => x.id === id || x._id === id);
        if (p) {
          p.stockCount = res.data.data.stockCount;
          p.stock = res.data.data.stock;
          saveStoredProducts(current);
        }
        return res.data.data;
      }
    } catch (e) {}

    const current = getStoredProducts();
    const p = current.find((x) => x.id === id || x._id === id);
    if (!p) throw new Error('Product not found');

    let newCount = 0;
    if (stockCount !== undefined) {
      newCount = Math.max(0, Number(stockCount));
    } else if (delta !== undefined) {
      newCount = Math.max(0, (p.stockCount ?? 0) + Number(delta));
    }

    p.stockCount = newCount;
    p.stock = newCount > 0;
    p.updatedAt = new Date().toISOString();
    saveStoredProducts(current);

    return { id, stockCount: newCount, stock: newCount > 0 };
  },

  /**
   * Get Inventory Analytics & Records
   */
  getInventory: async () => {
    try {
      const res = await api.get('/admin/inventory', {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {}

    const products = getStoredProducts();
    const summary = {
      totalItems: products.length,
      totalUnits: products.reduce((sum, p) => sum + (p.stockCount ?? 0), 0),
      totalValuation: products.reduce((sum, p) => sum + (Number(p.price || 0) * (p.stockCount ?? 0)), 0),
      lowStockCount: products.filter((p) => (p.stockCount ?? 10) <= 5 && (p.stockCount ?? 10) > 0).length,
      outOfStockCount: products.filter((p) => (p.stockCount ?? 10) === 0 || p.stock === false).length,
    };

    return {
      summary,
      inventory: products,
    };
  },

  /**
   * Batch Update Inventory
   */
  batchUpdateInventory: async (updates) => {
    try {
      await api.patch('/admin/inventory/batch', { updates }, {
        headers: { 'x-admin-dev-access': 'true' },
      });
    } catch (e) {}

    const current = getStoredProducts();
    updates.forEach((item) => {
      const p = current.find((x) => x.id === item.id || x._id === item.id);
      if (p) {
        const count = Math.max(0, Number(item.stockCount));
        p.stockCount = count;
        p.stock = count > 0;
      }
    });
    saveStoredProducts(current);
    return true;
  },

  /**
   * Get User Directory
   */
  getUsers: async () => {
    try {
      const res = await api.get('/admin/users', {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        return res.data.data.users;
      }
    } catch (e) {}

    return getStoredUsers();
  },

  /**
   * Update User role or active status
   */
  updateUser: async (id, updates) => {
    try {
      const res = await api.put(`/admin/users/${id}`, updates, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        const current = getStoredUsers();
        const idx = current.findIndex((u) => u._id === id || u.id === id);
        if (idx !== -1) {
          current[idx] = res.data.data;
          saveStoredUsers(current);
        }
        return res.data.data;
      }
    } catch (e) {}

    const current = getStoredUsers();
    const idx = current.findIndex((u) => u._id === id || u.id === id);
    if (idx === -1) throw new Error('User not found');

    const updated = {
      ...current[idx],
      ...updates,
    };
    current[idx] = updated;
    saveStoredUsers(current);
    return updated;
  },

  /**
   * Block User (Permanent or Temporary with duration & reason)
   */
  blockUser: async (id, { blockType = 'permanent', reason = '', durationHours, customBlockedUntil } = {}) => {
    try {
      const res = await api.post(`/admin/users/${id}/block`, {
        blockType,
        reason,
        durationHours,
        customBlockedUntil,
      }, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success) {
        const current = getStoredUsers();
        const idx = current.findIndex((u) => u._id === id || u.id === id);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            isActive: false,
            status: blockType === 'temporary' ? 'temporarily_blocked' : 'blocked',
            blockDetails: res.data.data?.blockDetails || {
              reason,
              blockType,
              blockedAt: new Date().toISOString(),
            },
          };
          saveStoredUsers(current);
        }
        return res.data;
      }
    } catch (e) {
      // Local fallback
      const current = getStoredUsers();
      const idx = current.findIndex((u) => u._id === id || u.id === id);
      if (idx !== -1) {
        current[idx].isActive = false;
        current[idx].status = blockType === 'temporary' ? 'temporarily_blocked' : 'blocked';
        current[idx].blockDetails = {
          reason,
          blockType,
          blockedAt: new Date().toISOString(),
        };
        saveStoredUsers(current);
      }
      throw e;
    }
  },

  /**
   * Unblock User
   */
  unblockUser: async (id, { reason = 'Restored access by administration' } = {}) => {
    try {
      const res = await api.post(`/admin/users/${id}/unblock`, { reason }, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success) {
        const current = getStoredUsers();
        const idx = current.findIndex((u) => u._id === id || u.id === id);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            isActive: true,
            status: 'active',
            blockDetails: null,
          };
          saveStoredUsers(current);
        }
        return res.data;
      }
    } catch (e) {
      const current = getStoredUsers();
      const idx = current.findIndex((u) => u._id === id || u.id === id);
      if (idx !== -1) {
        current[idx].isActive = true;
        current[idx].status = 'active';
        current[idx].blockDetails = null;
        saveStoredUsers(current);
      }
      throw e;
    }
  },

  /**
   * Get Admin Audit Logs
   */
  getAuditLogs: async () => {
    try {
      const res = await api.get('/admin/audit-logs', {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        return res.data.data.logs;
      }
    } catch (e) {}
    return [];
  },

  /**
   * Add new staff / user
   */
  createUser: async (userData) => {
    try {
      const res = await api.post('/admin/users', userData, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        const current = getStoredUsers();
        saveStoredUsers([res.data.data, ...current]);
        return res.data.data;
      }
    } catch (e) {}

    const current = getStoredUsers();
    const newUser = {
      _id: `usr-${Date.now()}`,
      id: `usr-${Date.now()}`,
      ...userData,
      isActive: true,
      ordersCount: 0,
      totalSpent: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    saveStoredUsers([newUser, ...current]);
    return newUser;
  },

  /**
   * Delete User account
   */
  deleteUser: async (id) => {
    try {
      const res = await api.delete(`/admin/users/${id}`, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success) {
        const current = getStoredUsers();
        saveStoredUsers(current.filter((u) => u._id !== id && u.id !== id));
        return true;
      }
    } catch (e) {}

    const current = getStoredUsers();
    saveStoredUsers(current.filter((u) => u._id !== id && u.id !== id));
    return true;
  },

  /**
   * Get Orders List
   */
  getOrders: async () => {
    try {
      const res = await api.get('/admin/orders', {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        return res.data.data.orders;
      }
    } catch (e) {}

    return getStoredOrders();
  },

  /**
   * Update Order Status & Carrier Tracking
   */
  updateOrderStatus: async (id, { orderStatus, trackingCarrier, trackingNumber, notes }) => {
    try {
      const res = await api.patch(`/admin/orders/${id}/status`, { orderStatus, trackingCarrier, trackingNumber, notes }, {
        headers: { 'x-admin-dev-access': 'true' },
      });
      if (res.data?.success && res.data?.data) {
        const current = getStoredOrders();
        const idx = current.findIndex((o) => o._id === id || o.id === id || o.orderNumber === id);
        if (idx !== -1) {
          current[idx] = res.data.data;
          saveStoredOrders(current);
        }
        return res.data.data;
      }
    } catch (e) {}

    const current = getStoredOrders();
    const idx = current.findIndex((o) => o._id === id || o.id === id || o.orderNumber === id);
    if (idx === -1) throw new Error('Order not found');

    const updated = {
      ...current[idx],
      orderStatus: orderStatus || current[idx].orderStatus,
      tracking: {
        ...current[idx].tracking,
        carrier: trackingCarrier || current[idx].tracking?.carrier || 'Delhivery Express',
        trackingNumber: trackingNumber || current[idx].tracking?.trackingNumber,
      }
    };
    current[idx] = updated;
    saveStoredOrders(current);
    return updated;
  },

  /**
   * ==========================================
   * BIKE ACCESSORIES, PARTS & HELMETS INVENTORY
   * ==========================================
   */
  getIngredients: async () => {
    const STORAGE_KEY = 'sparify_admin_inventory_v2';
    const initialItems = [
      {
        id: 'item-1',
        name: 'Ceramic Sintered Brake Pads (Front/Rear)',
        unit: 'sets',
        onHand: 18,
        threshold: 8,
        supplier: 'Brembo India',
        cost: 1250,
        category: 'Spare Parts',
        totalCapacity: 50,
      },
      {
        id: 'item-2',
        name: 'Full Face ECE 22.06 Helmet (Matte Black)',
        unit: 'pcs',
        onHand: 4,
        threshold: 8,
        supplier: 'MT Helmets / Axor',
        cost: 3400,
        category: 'Helmets & Gear',
        totalCapacity: 20,
      },
      {
        id: 'item-3',
        name: 'X-Ring High-Tensile Drive Chain 520 Pitch',
        unit: 'pcs',
        onHand: 36,
        threshold: 15,
        supplier: 'DID Racing Japan',
        cost: 2800,
        category: 'Spare Parts',
        totalCapacity: 60,
      },
      {
        id: 'item-4',
        name: 'LED Auxiliary Fog Light Pods (60W Cree)',
        unit: 'pairs',
        onHand: 3,
        threshold: 6,
        supplier: 'Hella Gold',
        cost: 2400,
        category: 'Accessories & Touring',
        totalCapacity: 20,
      },
      {
        id: 'item-5',
        name: '10W-50 Fully Synthetic 4T Engine Oil',
        unit: 'L',
        onHand: 120,
        threshold: 30,
        supplier: 'Motul 7100 Distributors',
        cost: 650,
        category: 'Oils & Fluids',
        totalCapacity: 200,
      },
      {
        id: 'item-6',
        name: 'DOT 4 High-Temp Synthetic Brake Fluid',
        unit: 'L',
        onHand: 14,
        threshold: 10,
        supplier: 'Castrol Auto Lubes',
        cost: 420,
        category: 'Oils & Fluids',
        totalCapacity: 30,
      },
      {
        id: 'item-7',
        name: 'Carbon Knuckle All-Weather Riding Gloves',
        unit: 'pairs',
        onHand: 2,
        threshold: 6,
        supplier: 'Rynox Gears',
        cost: 1650,
        category: 'Helmets & Gear',
        totalCapacity: 25,
      },
      {
        id: 'item-8',
        name: 'High-Flow Performance Air Filter',
        unit: 'pcs',
        onHand: 22,
        threshold: 8,
        supplier: 'BMC Italy Filters',
        cost: 1850,
        category: 'Performance',
        totalCapacity: 40,
      },
      {
        id: 'item-9',
        name: 'Heavy-Duty Aluminum Engine Bash Plate',
        unit: 'pcs',
        onHand: 12,
        threshold: 5,
        supplier: 'Zana Motorcycles',
        cost: 1950,
        category: 'Protection',
        totalCapacity: 30,
      }
    ];

    if (memoryInventory.length > 0) {
      return memoryInventory;
    }

    try {
      const res = await api.get('/content/inventory_items');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        memoryInventory = res.data.data;
        return memoryInventory;
      }
    } catch (e) {}

    memoryInventory = initialItems;
    return initialItems;
  },

  saveIngredients: async (ingredients) => {
    memoryInventory = ingredients;
    try {
      await api.put('/content/inventory_items', { data: ingredients });
    } catch (e) {
      console.warn('Failed to save inventory to database:', e.message);
    }
  },

  addIngredient: async (data) => {
    const list = await adminService.getIngredients();
    const newIng = {
      id: `ing-${Date.now()}`,
      name: data.name,
      unit: data.unit || 'kg',
      onHand: Number(data.onHand || 0),
      threshold: Number(data.threshold || 5),
      supplier: data.supplier || 'Local Vendor',
      cost: Number(data.cost || 0),
      category: data.category || 'General',
      totalCapacity: Number(data.totalCapacity || Math.max(Number(data.onHand) * 1.5, 20)),
    };
    const updated = [newIng, ...list];
    await adminService.saveIngredients(updated);
    return newIng;
  },

  updateIngredient: async (id, updates) => {
    const list = await adminService.getIngredients();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Ingredient not found');
    list[idx] = { ...list[idx], ...updates };
    await adminService.saveIngredients(list);
    return list[idx];
  },

  deleteIngredient: async (id) => {
    const list = await adminService.getIngredients();
    const filtered = list.filter((i) => i.id !== id);
    await adminService.saveIngredients(filtered);
    return true;
  },

  /**
   * Universal Store Content API methods (Database Persisted)
   */
  getContent: async (key) => {
    try {
      const res = await api.get(`/content/${key}`);
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {
      console.warn(`[AdminService] getContent(${key}) API fallback:`, e.message);
    }
    return null;
  },

  saveContent: async (key, data) => {
    try {
      const res = await api.put(`/content/${key}`, { data });
      return res.data?.data || data;
    } catch (e) {
      console.error(`[AdminService] saveContent(${key}) error:`, e.message);
      throw e;
    }
  },

  getCategories: async () => {
    return (await adminService.getContent('product_categories')) || [];
  },

  saveCategories: async (data) => {
    return await adminService.saveContent('product_categories', data);
  },

  getBikes: async () => {
    return (await adminService.getContent('bike_categories')) || [];
  },

  saveBikes: async (data) => {
    return await adminService.saveContent('bike_categories', data);
  },

  getTrustedBrands: async () => {
    return (await adminService.getContent('trusted_brands')) || [];
  },

  saveTrustedBrands: async (data) => {
    return await adminService.saveContent('trusted_brands', data);
  },

  getFeaturedBrands: async () => {
    return (await adminService.getContent('featured_brands')) || [];
  },

  saveFeaturedBrands: async (data) => {
    return await adminService.saveContent('featured_brands', data);
  },

  getShopByCategory: async () => {
    const data = await adminService.getContent('shop_by_category');
    if (!data || !Array.isArray(data) || data.length === 0 || (data.length <= 4 && data.some((c) => c.id === 'sbc-1' || c.title === 'Helmets & Visors'))) {
      const original = [
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
      ];
      try {
        await adminService.saveContent('shop_by_category', original);
      } catch {}
      return original;
    }
    return data;
  },

  saveShopByCategory: async (data) => {
    return await adminService.saveContent('shop_by_category', data);
  },

  getLookingFor: async () => {
    const data = await adminService.getContent('looking_for_today');
    if (!data || !Array.isArray(data) || data.length === 0 || (data.length === 3 && data.some((c) => c.id === 'lft-1' || c.title === 'Crash Guards & Sliders'))) {
      const original = [
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
      ];
      try {
        await adminService.saveContent('looking_for_today', original);
      } catch {}
      return original;
    }
    return data;
  },

  saveLookingFor: async (data) => {
    return await adminService.saveContent('looking_for_today', data);
  },

  getStoreSettings: async () => {
    return await adminService.getContent('store_settings');
  },

  saveStoreSettings: async (data) => {
    return await adminService.saveContent('store_settings', data);
  },

  getReturns: async () => {
    try {
      const response = await api.get('/admin/returns');
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (e) {
      console.warn('API /admin/returns failed, using fallback returns data', e.message);
    }
    return [
      {
        _id: 'ret_88219_01',
        orderNumber: 'ORD-88219',
        user: {
          name: 'Aman Sharma',
          email: 'aman.sharma@gmail.com',
          phone: '+91 98765 43210',
        },
        items: [
          {
            orderItemId: 'item_1',
            productId: 'prod_1',
            productName: 'Royal Enfield Meteor 350 Touring Screen',
            SKU: 'RE-MET-TS01',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=160',
            quantity: 1,
            unitPrice: 3450,
            reason: 'Incompatible with Bike Model',
          }
        ],
        reason: 'Incompatible with Bike Model',
        description: 'The mounting bracket does not align with my 2024 Meteor 350 handlebar frame.',
        images: [
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400'
        ],
        status: 'Requested',
        refundMethod: 'original_source',
        refundAmount: 3450,
        adminNote: '',
        createdAt: '2026-09-29T10:15:00.000Z',
        requestedAt: '2026-09-29T10:15:00.000Z',
      },
      {
        _id: 'ret_88218_02',
        orderNumber: 'ORD-88218',
        user: {
          name: 'Vikram Rajput',
          email: 'vikram.r@gmail.com',
          phone: '+91 98234 56789',
        },
        items: [
          {
            orderItemId: 'item_2',
            productId: 'prod_2',
            productName: 'CNC Aluminum Crash Guard - Matte Black',
            SKU: 'CG-BLK-09',
            image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=160',
            quantity: 1,
            unitPrice: 5400,
            reason: 'Damaged in Transit',
          }
        ],
        reason: 'Damaged in Transit',
        description: 'Deep scratch and bent corner on the left guard plate when received.',
        images: [
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400'
        ],
        status: 'Under Review',
        refundMethod: 'original_source',
        refundAmount: 5400,
        adminNote: 'Pickup arranged via Delhivery reverse logistics on Oct 2nd.',
        createdAt: '2026-09-28T16:30:00.000Z',
        requestedAt: '2026-09-28T16:30:00.000Z',
      },
      {
        _id: 'ret_88204_03',
        orderNumber: 'ORD-88204',
        user: {
          name: 'Pooja Iyer',
          email: 'pooja.iyer@gmail.com',
          phone: '+91 91234 56780',
        },
        items: [
          {
            orderItemId: 'item_3',
            productId: 'prod_3',
            productName: 'Waterproof Magnetic Tank Bag 18L',
            SKU: 'TB-18L-WP',
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=160',
            quantity: 1,
            unitPrice: 3200,
            reason: 'Wrong Product Delivered',
          }
        ],
        reason: 'Wrong Product Delivered',
        description: 'Received 12L bag instead of the ordered 18L model.',
        images: [
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400'
        ],
        status: 'Refunded',
        refundMethod: 'original_source',
        refundAmount: 3200,
        adminNote: 'Refund credited to customer via PhonePe UPI (Txn: rfnd_Nq25P001923).',
        createdAt: '2026-09-26T09:00:00.000Z',
        requestedAt: '2026-09-26T09:00:00.000Z',
      }
    ];

    try {
      const userStored = localStorage.getItem('rubiker_returns_requests_v1');
      const userReturns = userStored ? JSON.parse(userStored) : [];
      const combined = [...userReturns, ...defaultReturns.filter((dr) => !userReturns.some((ur) => ur._id === dr._id || ur.orderNumber === dr.orderNumber))];
      return combined;
    } catch {
      return defaultReturns;
    }
  },

  updateReturnStatus: async (id, payload) => {
    try {
      const response = await api.patch(`/admin/returns/${id}`, payload);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (e) {}

    try {
      const userStored = localStorage.getItem('rubiker_returns_requests_v1');
      if (userStored) {
        const userReturns = JSON.parse(userStored);
        const idx = userReturns.findIndex((r) => r._id === id || r.id === id);
        if (idx !== -1) {
          userReturns[idx] = { ...userReturns[idx], ...payload, updatedAt: new Date().toISOString() };
          localStorage.setItem('rubiker_returns_requests_v1', JSON.stringify(userReturns));
          return userReturns[idx];
        }
      }
    } catch {}

    return { _id: id, ...payload, updatedAt: new Date().toISOString() };
  },
};

export default adminService;

