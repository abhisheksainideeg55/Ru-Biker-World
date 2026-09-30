import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: './backend/.env' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'motozone_dev_secret_jwt_key_2026';

import { localUserStore } from './controllers/authController.js';
import { localOrderStore } from './controllers/paymentController.js';
import { localCartStore } from './controllers/cartController.js';
import { localReturnStore } from './services/returnService.js';
import { getMyOrders, getOrderById, cancelOrder, reorder, trackOrder } from './controllers/orderController.js';
import { createReturn, getMyReturns, getReturnById, cancelReturn } from './controllers/returnController.js';

const mockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
};

const mockNext = (err) => {
  if (err) console.error('Next error called:', err);
};

const runTests = async () => {
  console.log('\n🚀 [MOTOZONE PHASE 10 ORDERS, TRACKING & RETURNS TEST SUITE]');
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

  // Test Users
  const userA = {
    _id: '66e111111111111111111111',
    id: '66e111111111111111111111',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.phase10@motozone.in',
    phone: '9822012345',
  };

  const userB = {
    _id: '66e111111111111111111112',
    id: '66e111111111111111111112',
    fullName: 'Sneha Patel',
    email: 'sneha.phase10@motozone.in',
    phone: '9822054321',
  };

  localUserStore.set(userA.email, userA);
  localUserStore.set(userB.email, userB);

  const reqUserA = { user: userA };
  const reqUserB = { user: userB };

  // Seed sample test orders for User A
  const sampleOrder1 = {
    _id: 'ord_sample_001',
    orderNumber: 'ORD-2026-000101',
    user: userA._id,
    orderStatus: 'Confirmed',
    paymentStatus: 'Paid',
    items: [
      {
        _id: 'item_101',
        product: 'prod-001',
        productId: 'prod-001',
        productName: 'MotoZone Ceramic Race Front Brake Pads',
        SKU: 'MZ-BRK-001',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300',
        quantity: 2,
        unitPrice: 899,
        itemTotal: 1798,
      },
    ],
    shippingAddress: {
      fullName: 'Rohan Deshmukh',
      phone: '9822012345',
      email: 'rohan.phase10@motozone.in',
      addressLine1: 'B-104, Royal Palms',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
    },
    shippingMethod: { type: 'standard', amount: 0, estimatedDays: '3–7 business days' },
    subtotal: 1798,
    discount: 0,
    shipping: 0,
    tax: 324,
    grandTotal: 2122,
    statusHistory: [
      { status: 'Pending', message: 'Order placed', timestamp: new Date(Date.now() - 3600000) },
      { status: 'Confirmed', message: 'Payment verified', timestamp: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sampleOrder2 = {
    _id: 'ord_sample_002',
    orderNumber: 'ORD-2026-000102',
    user: userA._id,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      {
        _id: 'item_102',
        product: 'prod-002',
        productId: 'prod-002',
        productName: 'Rolon Brass X-Ring Chain & Sprocket Kit',
        SKU: 'ROL-CHN-039',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300',
        quantity: 1,
        unitPrice: 2450,
        itemTotal: 2450,
      },
    ],
    shippingAddress: {
      fullName: 'Rohan Deshmukh',
      phone: '9822012345',
      email: 'rohan.phase10@motozone.in',
      addressLine1: 'B-104, Royal Palms',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
    },
    shippingMethod: { type: 'express', amount: 199, estimatedDays: '1–3 business days' },
    subtotal: 2450,
    discount: 0,
    shipping: 199,
    tax: 441,
    grandTotal: 3090,
    statusHistory: [
      { status: 'Delivered', message: 'Delivered by courier', timestamp: new Date(Date.now() - 86400000) }, // 1 day ago
    ],
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  };

  localOrderStore.set(sampleOrder1._id, sampleOrder1);
  localOrderStore.set(sampleOrder1.orderNumber, sampleOrder1);
  localOrderStore.set(sampleOrder2._id, sampleOrder2);
  localOrderStore.set(sampleOrder2.orderNumber, sampleOrder2);

  try {
    // 1. Get Paginated Orders (GET /api/orders)
    const resOrders = mockRes();
    await getMyOrders({ ...reqUserA, query: { page: 1, limit: 10 } }, resOrders, mockNext);
    assert(resOrders.statusCode === 200 && resOrders.body.data.orders.length === 2, '1. GET /api/orders returns customer orders list');
    assert(resOrders.body.data.pagination.total === 2, '2. Order pagination metadata computed accurately');

    // 2. Status Filter Test (GET /api/orders?status=Delivered)
    const resDelivered = mockRes();
    await getMyOrders({ ...reqUserA, query: { status: 'Delivered' } }, resDelivered, mockNext);
    assert(resDelivered.body.data.orders.length === 1 && resDelivered.body.data.orders[0].orderNumber === 'ORD-2026-000102', '3. Status filter matches only Delivered orders');

    // 3. Search Filter Test (GET /api/orders?search=ORD-2026-000101)
    const resSearch = mockRes();
    await getMyOrders({ ...reqUserA, query: { search: 'ORD-2026-000101' } }, resSearch, mockNext);
    assert(resSearch.body.data.orders.length === 1 && resSearch.body.data.orders[0]._id === 'ord_sample_001', '4. Order search by orderNumber finds matching record');

    // 4. Order Details Query (GET /api/orders/:id)
    const resDetails = mockRes();
    await getOrderById({ ...reqUserA, params: { id: 'ORD-2026-000101' } }, resDetails, mockNext);
    assert(resDetails.statusCode === 200 && resDetails.body.data.grandTotal === 2122, '5. GET /api/orders/:id returns order details');

    // 5. User Isolation Security Test
    const resAlien = mockRes();
    await getOrderById({ ...reqUserB, params: { id: 'ORD-2026-000101' } }, resAlien, mockNext);
    assert(resAlien.statusCode === 404, '6. SECURITY: User B cannot access User A order (returns 404)');

    // 6. Public Order Tracking with phone verification (POST /api/orders/track)
    const resTrackSuccess = mockRes();
    await trackOrder({ body: { orderNumber: 'ORD-2026-000101', contact: '9822012345' } }, resTrackSuccess, mockNext);
    assert(resTrackSuccess.statusCode === 200 && resTrackSuccess.body.data.orderStatus === 'Confirmed', '7. POST /api/orders/track verifies valid phone and returns tracking info');

    const resTrackWrongContact = mockRes();
    await trackOrder({ body: { orderNumber: 'ORD-2026-000101', contact: '9999999999' } }, resTrackWrongContact, mockNext);
    assert(resTrackWrongContact.statusCode === 401, '8. POST /api/orders/track rejects invalid contact with 401');

    // 7. Cancel Order Test (POST /api/orders/:id/cancel)
    const resCancel = mockRes();
    await cancelOrder(
      { ...reqUserA, params: { id: 'ORD-2026-000101' }, body: { reason: 'Found a better price elsewhere' } },
      resCancel,
      mockNext
    );
    assert(resCancel.statusCode === 200 && resCancel.body.data.orderStatus === 'Cancelled', '9. POST /api/orders/:id/cancel cancels Confirmed order');
    assert(resCancel.body.data.statusHistory.some((s) => s.status === 'Cancelled'), '10. Status history entry appended for cancellation');

    // 8. Reorder Test (POST /api/orders/:id/reorder)
    const resReorder = mockRes();
    await reorder({ ...reqUserA, params: { id: 'ORD-2026-000102' } }, resReorder, mockNext);
    assert(resReorder.statusCode === 200 && resReorder.body.data.addedItems.length === 1, '11. POST /api/orders/:id/reorder adds historical items to current cart');

    // 9. Return Request Submission (POST /api/returns) for Delivered Order 2
    const resReturn = mockRes();
    await createReturn(
      {
        ...reqUserA,
        body: {
          orderId: 'ORD-2026-000102',
          items: [{ orderItemId: 'item_102', productId: 'prod-002', quantity: 1, reason: 'Wrong Product Delivered' }],
          reason: 'Wrong Product Delivered',
          description: 'Package contained 428 chain instead of 520 pitch kit.',
        },
      },
      resReturn,
      mockNext
    );
    assert(resReturn.statusCode === 201 && resReturn.body.data.refundAmount === 2450, '12. POST /api/returns submits return request for delivered order');

    const returnId = resReturn.body.data._id;

    // 10. Return List & Details Query (GET /api/returns & GET /api/returns/:id)
    const resReturnsList = mockRes();
    await getMyReturns(reqUserA, resReturnsList, mockNext);
    assert(resReturnsList.statusCode === 200 && resReturnsList.body.data.length >= 1, '13. GET /api/returns retrieves customer return requests');

    const resReturnDetail = mockRes();
    await getReturnById({ ...reqUserA, params: { id: returnId } }, resReturnDetail, mockNext);
    assert(resReturnDetail.statusCode === 200 && resReturnDetail.body.data.orderNumber === 'ORD-2026-000102', '14. GET /api/returns/:id retrieves return request details');

    // 11. Cancel Return Request (POST /api/returns/:id/cancel)
    const resCancelReturn = mockRes();
    await cancelReturn({ ...reqUserA, params: { id: returnId } }, resCancelReturn, mockNext);
    assert(resCancelReturn.statusCode === 200 && resCancelReturn.body.data.status === 'Cancelled', '15. POST /api/returns/:id/cancel cancels return request');

  } catch (err) {
    console.error('Phase 10 Test Suite Exception:', err);
    failed++;
  } finally {
    console.log('\n========================================');
    console.log(`Phase 10 Tests Complete: ${passed} Passed | ${failed} Failed`);
    console.log('========================================\n');
  }
};

runTests();
