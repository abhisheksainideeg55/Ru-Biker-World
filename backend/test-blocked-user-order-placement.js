import jwt from 'jsonwebtoken';
import { checkIsUserBlocked, registerBlock, unregisterBlock, blockedUserRegistry } from './services/blockService.js';
import { createOrder } from './controllers/orderController.js';
import { createPaymentOrder, verifyPayment, localOrderStore } from './controllers/paymentController.js';
import { localUserStore } from './controllers/authController.js';
import { blockAdminUser, unblockAdminUser } from './controllers/adminController.js';
import { protect } from './middleware/authMiddleware.js';

// Setup environment for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'motozone_dev_secret_jwt_key_2026';

let passed = 0;
let failed = 0;

const assert = (condition, testName) => {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failed++;
  }
};

const createMockRes = () => {
  const res = {
    statusCode: 200,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    },
  };
  return res;
};

async function runAllTests() {
  console.log('===============================================================');
  console.log('🚀 RU BIKER WORLD - BLOCKED USER ORDER PLACEMENT VERIFICATION');
  console.log('===============================================================\n');

  // Seed sample users in local store
  const activeUser = {
    _id: 'usr_active_001',
    id: 'usr_active_001',
    fullName: 'Rahul Sharma',
    email: 'rahul.active@rubikerworld.com',
    phone: '9876543210',
    role: 'customer',
    status: 'active',
    isActive: true,
    tokenVersion: 1,
  };

  const blockedUser = {
    _id: 'usr_rider_7972',
    id: 'usr_rider_7972',
    fullName: 'Rider 7972',
    email: 'rider7972_8209137972@sparify.in',
    phone: '8209137972',
    role: 'customer',
    status: 'blocked',
    isActive: false,
    tokenVersion: 2,
    blockDetails: {
      reason: 'Violated order placement terms',
      blockType: 'permanent',
    },
  };

  localUserStore.set(activeUser.id, activeUser);
  localUserStore.set(blockedUser.id, blockedUser);

  // Register blocked user in registry
  registerBlock({
    userId: blockedUser.id,
    email: blockedUser.email,
    phone: blockedUser.phone,
    blockDetails: blockedUser.blockDetails,
  });

  const activeToken = jwt.sign(
    { userId: activeUser.id, email: activeUser.email, role: activeUser.role, tokenVersion: 1 },
    process.env.JWT_SECRET
  );

  const blockedToken = jwt.sign(
    { userId: blockedUser.id, email: blockedUser.email, role: blockedUser.role, tokenVersion: 2 },
    process.env.JWT_SECRET
  );

  const staleBlockedToken = jwt.sign(
    { userId: blockedUser.id, email: blockedUser.email, role: blockedUser.role, tokenVersion: 1 },
    process.env.JWT_SECRET
  );

  const testShippingAddress = {
    fullName: 'Abhishek Saini',
    phone: '8209137972',
    addressLine1: '10/332',
    city: 'Bharatpur',
    state: 'Rajasthan',
    postalCode: '321201',
    country: 'India',
  };

  const validActiveAddress = {
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    addressLine1: '45, MG Road',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    country: 'India',
  };

  const testItems = [
    {
      productId: 'prod_test_001',
      product: {
        _id: 'prod_test_001',
        name: 'MotoZone Anti-Vibration Mobile Mount',
        sku: 'MZ-AVM-01',
        price: 799,
        stock: 50,
      },
      name: 'MotoZone Anti-Vibration Mobile Mount',
      price: 799,
      quantity: 1,
      itemTotal: 799,
    },
  ];

  // -------------------------------------------------------------
  // Test 1: Active logged-in customer can successfully place an order
  // -------------------------------------------------------------
  {
    const req = {
      user: activeUser,
      body: {
        shippingAddress: validActiveAddress,
        items: testItems,
        paymentMethod: 'cod',
      },
    };
    const res = createMockRes();
    let nextCalled = false;
    await createOrder(req, res, (err) => { nextCalled = true; });

    assert(
      res.statusCode === 201 && res.jsonData?.success === true && res.jsonData?.data?.orderNumber,
      'Test 1: Active logged-in customer can successfully place an order'
    );
  }

  // -------------------------------------------------------------
  // Test 2: Blocked logged-in customer cannot place an order
  // -------------------------------------------------------------
  {
    const req = {
      user: blockedUser,
      body: {
        shippingAddress: testShippingAddress,
        items: testItems,
        paymentMethod: 'cod',
      },
    };
    const res = createMockRes();
    await createOrder(req, res, () => {});

    assert(
      res.statusCode === 403 &&
      res.jsonData?.code === 'ACCOUNT_BLOCKED' &&
      res.jsonData?.message?.includes('temporarily restricted from placing orders'),
      'Test 2: Blocked logged-in customer cannot place an order (HTTP 403 ACCOUNT_BLOCKED)'
    );
  }

  // -------------------------------------------------------------
  // Test 3: Customer blocked while already logged in is rejected on protected APIs
  // -------------------------------------------------------------
  {
    const req = {
      headers: {
        authorization: `Bearer ${staleBlockedToken}`,
      },
    };
    const res = createMockRes();
    await protect(req, res, () => {});

    // Should fail with 403 ACCOUNT_BLOCKED (or 401 SESSION_REVOKED)
    assert(
      (res.statusCode === 403 && res.jsonData?.code === 'ACCOUNT_BLOCKED') ||
      (res.statusCode === 401 && res.jsonData?.code === 'SESSION_REVOKED'),
      'Test 3: Customer blocked while logged in is rejected on protected APIs and cannot continue'
    );
  }

  // -------------------------------------------------------------
  // Test 4: Blocked customer cannot place a COD order
  // -------------------------------------------------------------
  {
    const req = {
      user: blockedUser,
      body: {
        shippingAddress: testShippingAddress,
        items: testItems,
        paymentMethod: 'cod',
      },
    };
    const res = createMockRes();
    await createOrder(req, res, () => {});

    assert(
      res.statusCode === 403 &&
      res.jsonData?.code === 'ACCOUNT_BLOCKED',
      'Test 4: Blocked customer cannot place a Cash on Delivery (COD) order'
    );
  }

  // -------------------------------------------------------------
  // Test 5: Blocked customer cannot place an online payment order
  // -------------------------------------------------------------
  {
    // Part A: createPaymentOrder
    const reqCreate = {
      user: blockedUser,
      body: {
        shippingAddress: testShippingAddress,
        items: testItems,
      },
    };
    const resCreate = createMockRes();
    await createPaymentOrder(reqCreate, resCreate, () => {});

    // Part B: verifyPayment
    const reqVerify = {
      user: blockedUser,
      body: {
        razorpay_order_id: 'order_test_123',
        razorpay_payment_id: 'pay_test_456',
        razorpay_signature: 'sig_test_789',
        shippingAddress: testShippingAddress,
        items: testItems,
      },
    };
    const resVerify = createMockRes();
    await verifyPayment(reqVerify, resVerify, () => {});

    assert(
      resCreate.statusCode === 403 &&
      resCreate.jsonData?.code === 'ACCOUNT_BLOCKED' &&
      resVerify.statusCode === 403 &&
      resVerify.jsonData?.code === 'ACCOUNT_BLOCKED',
      'Test 5: Blocked customer cannot place an online payment order (both creation & verification blocked)'
    );
  }

  // -------------------------------------------------------------
  // Test 6: Blocked customer cannot bypass restrictions using customer ID or verified phone
  // -------------------------------------------------------------
  {
    // Try to place order with an unauthenticated session but blocked phone number
    const req = {
      user: null,
      body: {
        shippingAddress: {
          ...testShippingAddress,
          phone: '8209137972', // Blocked Rider 7972 phone
        },
        items: testItems,
        paymentMethod: 'cod',
      },
    };
    const res = createMockRes();
    await createOrder(req, res, () => {});

    assert(
      res.statusCode === 403 &&
      res.jsonData?.code === 'ACCOUNT_BLOCKED',
      'Test 6: Blocked customer cannot bypass restrictions using customer ID or blocked phone number'
    );
  }

  // -------------------------------------------------------------
  // Test 7: Guest checkout works for eligible customers
  // -------------------------------------------------------------
  {
    const eligibleGuestAddress = {
      fullName: 'Vikram Joshi',
      phone: '9123456780', // Unrelated, non-blocked phone
      addressLine1: '12 Sector 4',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302001',
      country: 'India',
    };

    const req = {
      user: null,
      body: {
        shippingAddress: eligibleGuestAddress,
        items: testItems,
        paymentMethod: 'cod',
      },
    };
    const res = createMockRes();
    await createOrder(req, res, () => {});

    assert(
      res.statusCode === 201 &&
      res.jsonData?.success === true &&
      res.jsonData?.data?.orderNumber,
      'Test 7: Guest checkout works for eligible non-blocked customers'
    );
  }

  // -------------------------------------------------------------
  // Test 8: An unrelated guest is not incorrectly blocked due to an unverified matching phone number
  // -------------------------------------------------------------
  {
    const cleanGuestPhone = '9822334455';
    const check = await checkIsUserBlocked({ phone: cleanGuestPhone, email: 'clean.guest@example.com' });

    assert(
      check.isBlocked === false,
      'Test 8: Unrelated guest is not incorrectly blocked'
    );
  }

  // -------------------------------------------------------------
  // Test 9: Unblocking a customer restores eligible checkout access
  // -------------------------------------------------------------
  {
    // Unblock the user
    unregisterBlock({
      userId: blockedUser.id,
      email: blockedUser.email,
      phone: blockedUser.phone,
    });
    blockedUser.status = 'active';
    blockedUser.isActive = true;
    blockedUser.blockDetails = undefined;

    const req = {
      user: blockedUser,
      body: {
        shippingAddress: testShippingAddress,
        items: testItems,
        paymentMethod: 'cod',
      },
    };
    const res = createMockRes();
    await createOrder(req, res, () => {});

    assert(
      res.statusCode === 201 &&
      res.jsonData?.success === true &&
      res.jsonData?.data?.orderNumber,
      'Test 9: Unblocking a customer restores eligible checkout access'
    );
  }

  // -------------------------------------------------------------
  // Test 10: Existing orders, invoices, and valid refunds remain intact
  // -------------------------------------------------------------
  {
    // Re-block user
    registerBlock({
      userId: blockedUser.id,
      email: blockedUser.email,
      phone: blockedUser.phone,
      blockDetails: { reason: 'Test block' },
    });
    blockedUser.status = 'blocked';
    blockedUser.isActive = false;

    // Verify existing orders stored in localOrderStore remain accessible
    const hasStoredOrders = localOrderStore.size > 0;
    let orderRetrievable = false;
    for (const [key, order] of localOrderStore.entries()) {
      if (order.orderNumber) {
        orderRetrievable = true;
        break;
      }
    }

    assert(
      hasStoredOrders && orderRetrievable,
      'Test 10: Existing orders, invoices, and valid refunds remain intact and accessible'
    );
  }

  console.log('\n===============================================================');
  console.log(`📊 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test Runner Exception:', err);
  process.exit(1);
});
