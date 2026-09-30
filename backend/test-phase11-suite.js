import {
  getProductReviews,
  checkReviewEligibility,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview,
  localReviewStore,
} from './controllers/reviewController.js';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} from './controllers/notificationController.js';
import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogCategories,
  getRelatedPosts,
  searchBlogPosts,
} from './controllers/blogController.js';
import {
  getActiveOffers,
  getOfferBySlug,
} from './controllers/offerController.js';
import {
  createProductAlert,
  deleteProductAlert,
  getMyProductAlerts,
} from './controllers/productAlertController.js';
import { localOrderStore } from './controllers/paymentController.js';

// Mock helper
const mockRes = () => {
  const res = {};
  res.statusCode = 200;
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

const mockNext = (err) => {
  if (err) console.error('Next error called:', err);
};

const runTests = async () => {
  console.log('🚀 [MOTOZONE PHASE 11 REVIEWS, NOTIFICATIONS, BLOG & OFFERS TEST SUITE]');
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
    const userA = { _id: 'usr_phase11_a', userId: 'usr_phase11_a', name: 'Kabir Khan', email: 'kabir@motozone.in' };
    const userB = { _id: 'usr_phase11_b', userId: 'usr_phase11_b', name: 'Rohan Joshi', email: 'rohan@motozone.in' };

    // Setup a Delivered order for userA with prod-001
    const orderRef = {
      _id: 'ord_p11_001',
      orderNumber: 'ORD-2026-000201',
      user: 'usr_phase11_a',
      orderStatus: 'Delivered',
      items: [
        {
          _id: 'item_p11_001',
          product: 'prod-001',
          productId: 'prod-001',
          productName: 'Brembo Sintered Brake Pads (Front)',
          quantity: 1,
          unitPrice: 899,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    localOrderStore.set('ord_p11_001', orderRef);

    // ==========================================
    // 1. PUBLIC REVIEWS & RATING SUMMARY
    // ==========================================
    const resReviews = mockRes();
    await getProductReviews({ params: { productId: 'prod-001' }, query: {} }, resReviews, mockNext);
    assert(
      resReviews.statusCode === 200 &&
        resReviews.body.data.reviews.length >= 1 &&
        resReviews.body.data.summary.average > 0 &&
        resReviews.body.data.summary.distribution[5] >= 1,
      '1. GET /api/products/:productId/reviews returns reviews and computed rating distribution'
    );

    // ==========================================
    // 2. REVIEW ELIGIBILITY
    // ==========================================
    const resEligibleUserA = mockRes();
    await checkReviewEligibility({ user: userA, params: { productId: 'prod-001' } }, resEligibleUserA, mockNext);
    assert(
      resEligibleUserA.statusCode === 200 && resEligibleUserA.body.data.isEligible === true,
      '2. checkReviewEligibility returns isEligible: true for customer who purchased item'
    );

    // ==========================================
    // 3. REVIEW CREATION & VALIDATION
    // ==========================================
    const resCreateShort = mockRes();
    await createReview(
      {
        user: userA,
        params: { productId: 'prod-001' },
        body: { rating: 5, comment: 'Too short' },
      },
      resCreateShort,
      mockNext
    );
    assert(resCreateShort.statusCode === 400, '3. Rejects review comment shorter than 10 characters with 400');

    const resCreateValid = mockRes();
    await createReview(
      {
        user: userA,
        params: { productId: 'prod-001' },
        body: {
          rating: 5,
          title: 'Unbelievable Stopping Power',
          comment: 'Installed on my bike and tested on highways. Stopping distance reduced significantly with zero fade.',
          images: [],
        },
      },
      resCreateValid,
      mockNext
    );
    assert(
      resCreateValid.statusCode === 201 && resCreateValid.body.data.rating === 5,
      '4. POST /api/products/:productId/reviews creates verified purchase review'
    );

    const createdReviewId = resCreateValid.body.data._id;

    // ==========================================
    // 4. REVIEW EDIT & DELETE OWNERSHIP
    // ==========================================
    const resEditUserB = mockRes();
    await updateReview(
      {
        user: userB,
        params: { id: createdReviewId },
        body: { rating: 1, comment: 'Hacked review content' },
      },
      resEditUserB,
      mockNext
    );
    assert(resEditUserB.statusCode === 403, '5. SECURITY: Alien user B receives 403 when attempting to edit User A review');

    const resEditUserA = mockRes();
    await updateReview(
      {
        user: userA,
        params: { id: createdReviewId },
        body: { title: 'Updated Review Title', comment: 'Updated description with more than 10 characters.' },
      },
      resEditUserA,
      mockNext
    );
    assert(resEditUserA.statusCode === 200 && resEditUserA.body.data.title === 'Updated Review Title', '6. PUT /api/reviews/:id updates customer review');

    // ==========================================
    // 5. HELPFUL VOTING & REPORTING
    // ==========================================
    const resHelpful1 = mockRes();
    await markReviewHelpful({ user: userB, params: { id: createdReviewId } }, resHelpful1, mockNext);
    assert(
      resHelpful1.statusCode === 200 && resHelpful1.body.data.isHelpful === true && resHelpful1.body.data.helpfulCount >= 1,
      '7. POST /api/reviews/:id/helpful registers helpful vote'
    );

    const resReport = mockRes();
    await reportReview({ user: userB, params: { id: createdReviewId }, body: { reason: 'Spam' } }, resReport, mockNext);
    assert(resReport.statusCode === 200 && resReport.body.success === true, '8. POST /api/reviews/:id/report registers review report');

    // ==========================================
    // 6. NOTIFICATIONS API
    // ==========================================
    const resNotif = mockRes();
    await getNotifications({ user: userA }, resNotif, mockNext);
    assert(resNotif.statusCode === 200 && resNotif.body.notifications.length >= 1, '9. GET /api/notifications returns user notification list');

    const resUnread = mockRes();
    await getUnreadCount({ user: userA }, resUnread, mockNext);
    assert(resUnread.statusCode === 200 && typeof resUnread.body.data.unreadCount === 'number', '10. GET /api/notifications/unread-count returns unread count');

    const resMarkAll = mockRes();
    await markAllAsRead({ user: userA }, resMarkAll, mockNext);
    assert(resMarkAll.statusCode === 200 && resMarkAll.body.unreadCount === 0, '11. PATCH /api/notifications/read-all marks all notifications read');

    // ==========================================
    // 7. BLOG SYSTEM API
    // ==========================================
    const resBlogList = mockRes();
    await getBlogPosts({ query: {} }, resBlogList, mockNext);
    assert(
      resBlogList.statusCode === 200 && resBlogList.body.data.posts.length >= 1,
      '12. GET /api/blog returns published blog articles'
    );

    const resBlogSlug = mockRes();
    await getBlogPostBySlug({ params: { slug: 'pre-ride-maintenance-checklist-motorcycle' } }, resBlogSlug, mockNext);
    assert(resBlogSlug.statusCode === 200 && resBlogSlug.body.data.slug === 'pre-ride-maintenance-checklist-motorcycle', '13. GET /api/blog/:slug retrieves article details');

    const resBlogCategories = mockRes();
    await getBlogCategories({}, resBlogCategories, mockNext);
    assert(resBlogCategories.statusCode === 200 && resBlogCategories.body.data.length >= 1, '14. GET /api/blog/categories returns article category counts');

    const resBlogSearch = mockRes();
    await searchBlogPosts({ query: { q: 'Brake' } }, resBlogSearch, mockNext);
    assert(resBlogSearch.statusCode === 200 && resBlogSearch.body.data.length >= 1, '15. GET /api/blog/search matches articles by search query');

    // ==========================================
    // 8. OFFERS SYSTEM API
    // ==========================================
    const resOffers = mockRes();
    await getActiveOffers({}, resOffers, mockNext);
    assert(
      resOffers.statusCode === 200 && resOffers.body.data.length >= 1 && resOffers.body.data[0].couponCode,
      '16. GET /api/offers returns active promotion coupons and banners'
    );

    // ==========================================
    // 9. PRODUCT ALERTS (BACK-IN-STOCK & PRICE DROP)
    // ==========================================
    const resAlertSub = mockRes();
    await createProductAlert(
      {
        user: userA,
        params: { productId: 'prod-001' },
        body: { type: 'BACK_IN_STOCK' },
      },
      resAlertSub,
      mockNext
    );
    assert(
      (resAlertSub.statusCode === 201 || resAlertSub.statusCode === 200) && resAlertSub.body.data.type === 'BACK_IN_STOCK',
      '17. POST /api/products/:productId/alerts registers back-in-stock subscription'
    );

    const resAlertList = mockRes();
    await getMyProductAlerts({ user: userA }, resAlertList, mockNext);
    assert(resAlertList.statusCode === 200 && resAlertList.body.data.length >= 1, '18. GET /api/products/alerts returns active alerts for customer');

    const resAlertUnsub = mockRes();
    await deleteProductAlert({ user: userA, params: { productId: 'prod-001', type: 'BACK_IN_STOCK' } }, resAlertUnsub, mockNext);
    assert(resAlertUnsub.statusCode === 200, '19. DELETE /api/products/:productId/alerts/:type unsubscribes alert');

  } catch (err) {
    console.error('Test Suite Failed With Exception:', err);
    failed++;
  } finally {
    console.log('\n========================================');
    console.log(`Phase 11 Tests Complete: ${passed} Passed | ${failed} Failed`);
    console.log('========================================\n');
  }
};

runTests();
