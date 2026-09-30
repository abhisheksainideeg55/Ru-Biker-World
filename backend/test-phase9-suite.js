import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: './backend/.env' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'motozone_dev_secret_jwt_key_2026';
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'motozone_razorpay_secret_key_2026';

import crypto from 'crypto';
import { localUserStore } from './controllers/authController.js';
import { localCartStore, addItem, getCart } from './controllers/cartController.js';
import { createPaymentOrder, verifyPayment, localOrderStore } from './controllers/paymentController.js';
import { getMyOrders, getOrderById, cancelOrder } from './controllers/orderController.js';
import { generateOrderNumber, validateCheckout } from './services/checkoutService.js';
import { verifyRazorpayPayment } from './services/paymentService.js';

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
  console.log('\n🚀 [MOTOZONE PHASE 9 CHECKOUT & PAYMENT TEST SUITE]');
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

  // Test Customer A
  const testUserA = {
    _id: '66e999999999999999999991',
    id: '66e999999999999999999991',
    fullName: 'Arjun Biker',
    email: 'arjun.phase9@motozone.in',
    addresses: [
      {
        _id: 'addr_001',
        id: 'addr_001',
        fullName: 'Arjun Biker',
        phone: '9876543210',
        addressLine1: 'Flat 402, Revving Towers',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
        isDefault: true,
      },
    ],
  };

  // Test Customer B (for isolation tests)
  const testUserB = {
    _id: '66e999999999999999999992',
    id: '66e999999999999999999992',
    fullName: 'Pooja Rider',
    email: 'pooja.phase9@motozone.in',
    addresses: [],
  };

  localUserStore.set(testUserA.email, testUserA);
  localUserStore.set(testUserB.email, testUserB);

  const reqUserA = { user: testUserA };
  const reqUserB = { user: testUserB };

  try {
    // 1. Order Number Format Test
    const orderNum = await generateOrderNumber();
    assert(
      /^ORD-\d{4}-\d{6}$/.test(orderNum),
      `1. Order Number formatted as ORD-YYYY-XXXXXX: ${orderNum}`
    );

    // 2. Checkout validation on empty cart returns 400 CART_EMPTY
    let emptyCartCaught = false;
    try {
      await validateCheckout({ userId: testUserA._id, addressId: 'addr_001' });
    } catch (err) {
      emptyCartCaught = err.code === 'CART_EMPTY';
    }
    assert(emptyCartCaught, '2. Checkout validation rejects empty cart with CART_EMPTY');

    // 3. Add items to User A cart (prod-001: 899 x 2 = 1798)
    const resAdd = mockRes();
    await addItem({ ...reqUserA, body: { productId: 'prod-001', quantity: 2 } }, resAdd, mockNext);
    assert(resAdd.statusCode === 200 && resAdd.body.data.items.length === 1, '3. Added items to cart (subtotal 1798)');

    // 4. Create Razorpay Payment Order (POST /api/payments/razorpay/create-order)
    const resCreateOrder = mockRes();
    await createPaymentOrder(
      { ...reqUserA, body: { shippingAddressId: 'addr_001', shippingMethod: 'standard' } },
      resCreateOrder,
      mockNext
    );
    assert(resCreateOrder.statusCode === 200 && resCreateOrder.body.success === true, '4. POST /api/payments/razorpay/create-order returns 200');
    assert(resCreateOrder.body.data.razorpayOrderId.startsWith('order_'), '5. Generates valid razorpayOrderId reference');
    assert(resCreateOrder.body.data.amount > 0, '6. Returns amount in paise calculated from server grandTotal');
    assert(!resCreateOrder.body.data.keySecret, '7. SECURITY: Never returns keySecret to client');

    const razorpayOrderId = resCreateOrder.body.data.razorpayOrderId;
    const razorpayPaymentId = `pay_${Date.now()}_test123`;

    // 5. Test Cryptographic Signature Verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const sigCheckValid = verifyRazorpayPayment({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: validSignature,
    });
    assert(sigCheckValid.isValid === true, '8. HMAC-SHA256 signature verification succeeds for authentic payment');

    const sigCheckTampered = verifyRazorpayPayment({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: 'tampered_fake_signature_hex_12345',
    });
    assert(sigCheckTampered.isValid === false, '9. Signature verification rejects tampered / fake signature');

    // 6. Payment Verification & Order Finalization (POST /api/payments/razorpay/verify)
    const resVerify = mockRes();
    await verifyPayment(
      {
        ...reqUserA,
        body: {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: validSignature,
          shippingAddressId: 'addr_001',
          shippingMethod: 'standard',
        },
      },
      resVerify,
      mockNext
    );
    assert(resVerify.statusCode === 201 && resVerify.body.success === true, '10. POST /api/payments/razorpay/verify creates confirmed order');
    assert(resVerify.body.data.paymentStatus === 'Paid', '11. Payment marked as Paid');
    assert(resVerify.body.data.orderStatus === 'Confirmed', '12. Order marked as Confirmed');
    assert(resVerify.body.data.orderNumber.startsWith('ORD-'), '13. Order assigned unique orderNumber');

    const createdOrderId = resVerify.body.data.orderId;

    // 7. Verify Cart is Cleared after successful payment
    const resCartCheck = mockRes();
    await getCart(reqUserA, resCartCheck, mockNext);
    assert(resCartCheck.body.data.items.length === 0, '14. Cart is cleared after successful order confirmation');

    // 8. Order Query API (GET /api/orders & GET /api/orders/:id)
    const resMyOrders = mockRes();
    await getMyOrders(reqUserA, resMyOrders, mockNext);
    const ordersList = resMyOrders.body.data?.orders || resMyOrders.body.data || [];
    assert(resMyOrders.statusCode === 200 && ordersList.length >= 1, '15. GET /api/orders returns customer orders');

    const resSingleOrder = mockRes();
    await getOrderById({ ...reqUserA, params: { id: createdOrderId } }, resSingleOrder, mockNext);
    assert(resSingleOrder.statusCode === 200 && resSingleOrder.body.data.orderNumber === resVerify.body.data.orderNumber, '16. GET /api/orders/:id retrieves order details');

    // 9. User Isolation Security Test: User B cannot view User A's order
    const resHackerOrder = mockRes();
    await getOrderById({ ...reqUserB, params: { id: createdOrderId } }, resHackerOrder, mockNext);
    assert(resHackerOrder.statusCode === 404, '17. SECURITY: User B receives 404 when attempting to access User A order');

    // 10. Order Cancellation (POST /api/orders/:id/cancel)
    const resCancel = mockRes();
    await cancelOrder({ ...reqUserA, params: { id: createdOrderId } }, resCancel, mockNext);
    assert(resCancel.statusCode === 200 && resCancel.body.data.orderStatus === 'Cancelled', '18. POST /api/orders/:id/cancel cancels order');

  } catch (err) {
    console.error('Test Suite Failed With Exception:', err);
    failed++;
  } finally {
    console.log('\n========================================');
    console.log(`Phase 9 Tests Complete: ${passed} Passed | ${failed} Failed`);
    console.log('========================================\n');
  }
};

runTests();
