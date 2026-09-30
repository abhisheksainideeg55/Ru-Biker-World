import { validateObjectId, sanitizeQuery } from './middleware/validationMiddleware.js';
import { createRateLimiter, authLimiter, paymentLimiter, trackingLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import {
  generateProductSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from '../frontend/src/utils/seo.js';

// Mock helpers
const mockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.setHeader = (key, val) => {
    res.headers[key] = val;
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
};

const runTests = async () => {
  console.log('🚀 [MOTOZONE PHASE 12 SECURITY, SEO, ERROR RESILIENCE & PERFORMANCE TEST SUITE]');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // ==========================================
    // 1. QUERY SANITIZATION & NOSQL INJECTION DEFENSE
    // ==========================================
    const mockReqInjection = {
      query: {
        category: 'Brakes',
        $where: 'this.password.length > 0',
        nested: { $gt: '' },
      },
    };
    sanitizeQuery(mockReqInjection, {}, () => {});
    assert(
      mockReqInjection.query.$where === undefined &&
        mockReqInjection.query.category === 'Brakes' &&
        mockReqInjection.query.nested.$gt === undefined,
      '1. sanitizeQuery strips malicious $ operators from query parameters'
    );

    // ==========================================
    // 2. OBJECT ID & SLUG VALIDATION
    // ==========================================
    const mockReqValidId = { params: { id: '65f001000000000000000001' } };
    let validPassed = false;
    validateObjectId('id')(mockReqValidId, mockRes(), () => {
      validPassed = true;
    });
    assert(validPassed, '2. validateObjectId allows valid 24-character hex ObjectIds');

    const mockReqValidSlug = { params: { id: 'ORD-2026-000001' } };
    let slugPassed = false;
    validateObjectId('id')(mockReqValidSlug, mockRes(), () => {
      slugPassed = true;
    });
    assert(slugPassed, '3. validateObjectId allows alphanumeric slug/order format (ORD-2026-000001)');

    const mockReqInvalidId = { params: { id: 'invalid$id!*injection' } };
    const resInvalid = mockRes();
    validateObjectId('id')(mockReqInvalidId, resInvalid, () => {});
    assert(
      resInvalid.statusCode === 400 && resInvalid.body.code === 'INVALID_OBJECT_ID',
      '4. validateObjectId blocks invalid format identifiers with 400'
    );

    // ==========================================
    // 3. RATE LIMITING ENGINE
    // ==========================================
    const testLimiter = createRateLimiter({ windowMs: 1000, max: 2 });
    const reqTestIp = { ip: '192.168.1.100', baseUrl: '/api/auth', path: '/login', headers: {} };

    const resL1 = mockRes();
    testLimiter(reqTestIp, resL1, () => {});
    const resL2 = mockRes();
    testLimiter(reqTestIp, resL2, () => {});
    const resL3 = mockRes();
    testLimiter(reqTestIp, resL3, () => {});

    assert(
      resL1.statusCode === 200 &&
        resL2.statusCode === 200 &&
        resL3.statusCode === 429 &&
        resL3.body.code === 'RATE_LIMIT_EXCEEDED' &&
        resL1.headers['X-RateLimit-Limit'] === 2,
      '5. RateLimiter permits max requests and blocks burst traffic with 429 and rate headers'
    );

    // ==========================================
    // 4. SANITIZED PRODUCTION ERROR HANDLING
    // ==========================================
    process.env.NODE_ENV = 'production';
    const resProdError = mockRes();
    const mockCastError = new Error('Cast to ObjectId failed');
    mockCastError.name = 'CastError';
    mockCastError.value = 'bad-id-123';
    mockCastError.stack = 'SecretStackInDB /var/www/secret.js:42';

    errorHandler(mockCastError, {}, resProdError, () => {});
    assert(
      resProdError.statusCode === 500 &&
        resProdError.body.success === false &&
        resProdError.body.code === 'RESOURCE_CAST_ERROR' &&
        resProdError.body.stack === undefined,
      '6. errorHandler masks internal stack traces in production environment'
    );

    // ==========================================
    // 5. JSON-LD STRUCTURED DATA GENERATORS
    // ==========================================
    const productData = {
      id: 'prod-001',
      name: 'Brembo Sintered Brake Pads',
      brand: 'Brembo',
      price: 899,
      rating: 4.8,
      reviewCount: 42,
      stock: true,
      stockCount: 15,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
    };

    const productSchema = generateProductSchema(productData);
    assert(
      productSchema['@type'] === 'Product' &&
        productSchema.name === 'Brembo Sintered Brake Pads' &&
        productSchema.offers.price === 899 &&
        productSchema.aggregateRating.ratingValue === 4.8,
      '7. generateProductSchema outputs valid schema.org Product metadata'
    );

    const articleData = {
      title: 'Pre-Ride Maintenance Checklist',
      excerpt: 'Essential maintenance guide for motorcyclists.',
      publishedAt: '2026-09-20T00:00:00.000Z',
      authorName: 'MotoZone Team',
    };
    const articleSchema = generateArticleSchema(articleData);
    assert(
      articleSchema['@type'] === 'Article' &&
        articleSchema.headline === 'Pre-Ride Maintenance Checklist' &&
        articleSchema.publisher.name === 'MotoZone',
      '8. generateArticleSchema outputs valid schema.org Article metadata'
    );

    const breadcrumbs = [{ label: 'Shop', path: '/shop' }, { label: 'Brakes', path: '/shop?category=brakes' }];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    assert(
      breadcrumbSchema['@type'] === 'BreadcrumbList' &&
        breadcrumbSchema.itemListElement.length === 2 &&
        breadcrumbSchema.itemListElement[0].position === 1,
      '9. generateBreadcrumbSchema outputs valid schema.org BreadcrumbList metadata'
    );

    const orgSchema = generateOrganizationSchema();
    assert(
      orgSchema['@type'] === 'Organization' && orgSchema.name === 'MotoZone',
      '10. generateOrganizationSchema outputs valid schema.org Organization metadata'
    );

  } catch (err) {
    console.error('Test Suite Failed With Exception:', err);
    failed++;
  } finally {
    console.log('\n========================================');
    console.log(`Phase 12 Tests Complete: ${passed} Passed | ${failed} Failed`);
    console.log('========================================\n');
  }
};

runTests();
