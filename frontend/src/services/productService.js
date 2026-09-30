import api from './api';
import { allProducts as fallbackProducts } from '../data/products';

// Helper to get fallback products in memory
const getCachedAdminProducts = () => fallbackProducts || [];

// Normalization helper for query matching (e.g. 'spare-parts' -> 'spare parts')
const normalizeSlug = (str = '') =>
  str.toLowerCase().replace(/[-_]/g, ' ').trim();

export const productService = {
  /**
   * Fetch filtered, sorted and paginated products from backend API
   */
  getProducts: async (options = {}) => {
    try {
      const filters = options.filters || options;
      const categoriesParam = Array.isArray(filters.categories)
        ? filters.categories.join(',')
        : filters.categories || filters.category || options.category || options.categories || '';
      
      const productBrandsParam = Array.isArray(filters.productBrands)
        ? filters.productBrands.join(',')
        : filters.productBrands || filters.brand || options.brand || options.productBrands || '';

      const bikeBrandsParam = Array.isArray(filters.bikeBrands)
        ? filters.bikeBrands.join(',')
        : filters.bikeBrands || filters.bikeBrand || options.bikeBrand || options.bikeBrands || '';

      const bikeModelsParam = Array.isArray(filters.bikeModels)
        ? filters.bikeModels.join(',')
        : filters.bikeModels || filters.bikeModel || options.bikeModel || options.bikeModels || '';

      const reqPage = options.page || filters.page || 1;
      const reqLimit = options.limit || filters.limit || 10;

      const res = await api.get('/products', {
        params: {
          search: options.search || filters.search || filters.q || '',
          category: categoriesParam,
          categories: categoriesParam,
          subcategory: filters.subcategory || options.subcategory || '',
          brand: productBrandsParam,
          productBrands: productBrandsParam,
          bikeBrand: bikeBrandsParam,
          bikeBrands: bikeBrandsParam,
          bikeModel: bikeModelsParam,
          minPrice: filters.minPrice !== undefined ? filters.minPrice : options.minPrice,
          maxPrice: filters.maxPrice !== undefined ? filters.maxPrice : options.maxPrice,
          inStockOnly: filters.availability === 'in-stock' || filters.availability === 'inStock' || options.inStockOnly,
          featured: filters.featured !== undefined ? filters.featured : options.featured,
          sort: options.sort || filters.sort || 'featured',
          page: reqPage,
          limit: reqLimit,
        },
      });

      if (res.data && res.data.success) {
        const productList = res.data.products || res.data.data || [];
        const pagination = res.data.pagination || {};
        const total = pagination.total !== undefined ? pagination.total : productList.length;
        const totalPages = pagination.totalPages !== undefined ? pagination.totalPages : (Math.ceil(total / reqLimit) || 1);
        const curPage = pagination.page !== undefined ? pagination.page : reqPage;

        return {
          products: productList.map((p) => ({ ...p, id: p.id || p._id })),
          totalCount: total,
          totalPages,
          currentPage: curPage,
          limit: reqLimit,
          startIndex: total === 0 ? 0 : (curPage - 1) * reqLimit + 1,
          endIndex: Math.min(curPage * reqLimit, total),
        };
      }
    } catch (e) {
      console.warn('Backend products fetch warning, falling back to local dataset:', e.message);
    }

    // Fallback in-memory / cached products
    let list = [...getCachedAdminProducts()];

    const searchQuery = (options.search || filters?.search || filters?.q || '').trim().toLowerCase();
    if (searchQuery) {
      list = list.filter((p) => {
        const titleMatch = p.name?.toLowerCase().includes(searchQuery);
        const brandMatch = p.brand?.toLowerCase().includes(searchQuery);
        const categoryMatch = p.category?.toLowerCase().includes(searchQuery);
        const subcategoryMatch = p.subcategory?.toLowerCase().includes(searchQuery);
        const skuMatch = p.sku?.toLowerCase().includes(searchQuery);
        const bikeBrandMatch = p.bikeBrands?.some((b) => b.toLowerCase().includes(searchQuery));
        const bikeModelMatch = p.bikeModels?.some((m) => m.toLowerCase().includes(searchQuery));
        return (
          titleMatch ||
          brandMatch ||
          categoryMatch ||
          subcategoryMatch ||
          skuMatch ||
          bikeBrandMatch ||
          bikeModelMatch
        );
      });
    }

    if (filters.categories && filters.categories.length > 0) {
      const selectedCats = Array.isArray(filters.categories)
        ? filters.categories.map((c) => normalizeSlug(c))
        : [normalizeSlug(filters.categories)];

      list = list.filter((p) => {
        const prodCat = normalizeSlug(p.category);
        const prodSub = normalizeSlug(p.subcategory);
        return selectedCats.some(
          (sel) =>
            prodCat === sel ||
            prodSub === sel ||
            (sel === 'luggage' ? (prodCat === 'luggage' || prodSub.includes('bag') || prodSub.includes('luggage')) : (prodCat.includes(sel) || sel.includes(prodCat)))
        );
      });
    }

    if (filters.subcategory) {
      const targetSub = normalizeSlug(filters.subcategory);
      list = list.filter((p) => {
        const prodSub = normalizeSlug(p.subcategory);
        const prodCat = normalizeSlug(p.category);
        const prodName = normalizeSlug(p.name);
        return prodSub.includes(targetSub) || targetSub.includes(prodSub) || prodCat.includes(targetSub) || prodName.includes(targetSub);
      });
    }

    if (filters.bikeBrands && filters.bikeBrands.length > 0) {
      const selectedBikes = Array.isArray(filters.bikeBrands)
        ? filters.bikeBrands.map((b) => normalizeSlug(b))
        : [normalizeSlug(filters.bikeBrands)];

      list = list.filter((p) =>
        p.bikeBrands?.some((b) => selectedBikes.includes(normalizeSlug(b)))
      );
    }

    if (filters.bikeModels && filters.bikeModels.length > 0) {
      const selectedModels = Array.isArray(filters.bikeModels)
        ? filters.bikeModels.map((m) => normalizeSlug(m))
        : [normalizeSlug(filters.bikeModels)];

      list = list.filter((p) =>
        p.bikeModels?.some((m) => selectedModels.includes(normalizeSlug(m)))
      );
    }

    if (filters.productBrands && filters.productBrands.length > 0) {
      const selectedBrands = Array.isArray(filters.productBrands)
        ? filters.productBrands.map((b) => normalizeSlug(b))
        : [normalizeSlug(filters.productBrands)];

      list = list.filter((p) => selectedBrands.includes(normalizeSlug(p.brand)));
    }

    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      const min = Number(filters.minPrice);
      if (!isNaN(min)) {
        list = list.filter((p) => p.price >= min);
      }
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      const max = Number(filters.maxPrice);
      if (!isNaN(max)) {
        list = list.filter((p) => p.price <= max);
      }
    }

    if (filters.availability && filters.availability !== 'all') {
      if (filters.availability === 'in-stock' || filters.availability === 'inStock') {
        list = list.filter((p) => p.stock === true && (p.stockCount ?? 1) > 0);
      } else if (filters.availability === 'out-of-stock' || filters.availability === 'outOfStock') {
        list = list.filter((p) => p.stock === false || (p.stockCount ?? 0) === 0);
      }
    }

    switch (sort) {
      case 'price-low':
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'best-selling':
      case 'bestselling':
        list.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    const totalCount = list.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedItems = list.slice(startIndex, startIndex + limit);

    return {
      products: paginatedItems.map((p) => ({ ...p, id: p.id || p._id })),
      totalCount,
      totalPages,
      currentPage: safePage,
      limit,
      startIndex: totalCount === 0 ? 0 : startIndex + 1,
      endIndex: Math.min(startIndex + limit, totalCount),
    };
  },

  getProductById: async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data?.success && res.data?.data) {
        const p = res.data.data;
        return { ...p, id: p.id || p._id };
      }
    } catch (e) {}

    const list = getCachedAdminProducts();
    const found = list.find((p) => p.id === id || p._id === id || p.slug === id);
    return found ? { ...found, id: found.id || found._id } : null;
  },

  getProductBySlug: async (slug) => {
    if (!slug) return null;
    try {
      const res = await api.get(`/products/${encodeURIComponent(slug)}`);
      if (res.data?.success && res.data?.data) {
        const p = res.data.data;
        return { ...p, id: p.id || p._id };
      }
    } catch (e) {}

    const normalized = slug.trim().toLowerCase();
    const list = getCachedAdminProducts();
    const found = list.find(
      (p) =>
        p.slug?.toLowerCase() === normalized ||
        p.id?.toLowerCase() === normalized ||
        p._id?.toString().toLowerCase() === normalized
    );
    return found ? { ...found, id: found.id || found._id } : null;
  },

  searchProducts: async (query) => {
    const res = await productService.getProducts({ search: query, limit: 10 });
    return res.products;
  },

  getFeaturedProducts: async (limit = 8) => {
    try {
      const res = await api.get('/products/featured', { params: { limit } });
      if (res.data?.success && res.data?.data) {
        return res.data.data.map((p) => ({ ...p, id: p.id || p._id }));
      }
    } catch (e) {}

    const list = getCachedAdminProducts();
    const featured = list.filter((p) => p.featured);
    return (featured.length > 0 ? featured : list).slice(0, limit).map((p) => ({ ...p, id: p.id || p._id }));
  },

  getBestSellingProducts: async (limit = 8) => {
    try {
      const res = await api.get('/products/bestselling', { params: { limit } });
      if (res.data?.success && res.data?.data) {
        return res.data.data.map((p) => ({ ...p, id: p.id || p._id }));
      }
    } catch (e) {}

    const list = [...getCachedAdminProducts()];
    return list
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, limit)
      .map((p) => ({ ...p, id: p.id || p._id }));
  },

  /**
   * Fetch related products based on category, subcategory, and bike brand
   */
  getRelatedProducts: async (product, limit = 10) => {
    if (!product) return [];
    const prodId = product._id || product.id || product.slug;

    try {
      const res = await api.get(`/products/related/${prodId}`, { params: { limit } });
      if (res.data?.success && res.data?.data && res.data.data.length > 0) {
        return res.data.data.map((p) => ({ ...p, id: p.id || p._id }));
      }
    } catch (e) {}

    const all = getCachedAdminProducts();
    const related = all.filter((p) => {
      if (p.id === prodId || p._id === prodId) return false;
      const sameSub = p.subcategory && product.subcategory && p.subcategory === product.subcategory;
      const sameCat = p.category === product.category;
      const shareBike =
        p.bikeBrands &&
        product.bikeBrands &&
        p.bikeBrands.some((b) => product.bikeBrands.includes(b));
      return sameSub || sameCat || shareBike;
    });

    related.sort((a, b) => {
      const aSubMatch = a.subcategory === product.subcategory ? 3 : a.category === product.category ? 2 : (a.brand === product.brand ? 1 : 0);
      const bSubMatch = b.subcategory === product.subcategory ? 3 : b.category === product.category ? 2 : (b.brand === product.brand ? 1 : 0);
      return bSubMatch - aSubMatch;
    });

    return related.slice(0, limit).map((p) => ({ ...p, id: p.id || p._id }));
  },

  /**
   * Fetch frequently bought together products
   */
  getFrequentlyBoughtTogether: async (product, limit = 2) => {
    if (!product) return [];
    const all = getCachedAdminProducts();
    const candidates = all.filter((p) => {
      if (p.id === product.id || p._id === product._id) return false;
      return (
        p.category === 'Accessories' ||
        p.subcategory === 'Lighting' ||
        p.subcategory === 'Mobile Holders' ||
        p.subcategory === 'USB Chargers' ||
        p.category === product.category
      );
    });

    return candidates.slice(0, limit).map((p) => ({ ...p, id: p.id || p._id }));
  },
};

export default productService;
