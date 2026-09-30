import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: './backend/.env' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'motozone_dev_secret_jwt_key_2026';

import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeGuestCart,
  applyCoupon,
  removeCoupon,
  getShippingQuote,
  saveForLater,
  moveToCart,
} from './controllers/cartController.js';
import { validateCoupon, getActiveCoupons } from './controllers/couponController.js';
import { calculateShipping } from './services/shippingService.js';
import { calculateTax } from './services/taxService.js';

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
  console.log('\n🚀 [MOTOZONE PHASE 8 TEST SUITE]');
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

  const userReq = {
    user: {
      _id: '66e888888888888888888888',
      id: '66e888888888888888888888',
      fullName: 'Vikram Rider',
      email: 'vikram.p8@motozone.in',
    },
  };

  try {
    // 1. Initial Cart (empty)
    const res1 = mockRes();
    await getCart(userReq, res1, mockNext);
    assert(res1.statusCode === 200 && res1.body.success === true, '1. GET /api/cart returns 200 and success: true');
    assert(res1.body.data.items.length === 0, '2. Initial cart items is empty');

    // 2. Add Item 1: Ceramic Brake Pads (price: 899, quantity: 2)
    const res2 = mockRes();
    await addItem({ ...userReq, body: { productId: 'prod-001', quantity: 2 } }, res2, mockNext);
    assert(res2.statusCode === 200 && res2.body.data.items.length === 1, '3. POST /api/cart/items adds prod-001 x 2');
    assert(res2.body.data.subtotal === 1798, '4. Subtotal calculated on server: 899 * 2 = 1798');
    assert(res2.body.data.shipping === 0, '5. Subtotal >= 999 qualifies for Free Shipping (fee: ₹0)');

    // 3. Stock validation (attempting 50 units when stock is 24)
    const res3 = mockRes();
    await addItem({ ...userReq, body: { productId: 'prod-001', quantity: 50 } }, res3, mockNext);
    assert(res3.statusCode === 400 && res3.body.code === 'INSUFFICIENT_STOCK', '6. Exceeding stock limit triggers 400 INSUFFICIENT_STOCK');

    // 4. Update quantity to 1
    const res4 = mockRes();
    await updateItem({ ...userReq, params: { itemId: 'prod-001' }, body: { quantity: 1 } }, res4, mockNext);
    assert(res4.statusCode === 200 && res4.body.data.subtotal === 899, '7. PUT /api/cart/items/:itemId updates qty to 1 (subtotal: 899)');
    assert(res4.body.data.shipping === 99, '8. Subtotal < 999 applies Standard shipping ₹99');

    // 5. Add second item: Rolon Chain & Sprocket (price: 2450)
    const res5 = mockRes();
    await addItem({ ...userReq, body: { productId: 'prod-002', quantity: 1 } }, res5, mockNext);
    assert(res5.statusCode === 200 && res5.body.data.items.length === 2, '9. Add prod-002: subtotal is 899 + 2450 = 3349');

    // 6. Public Coupon Validation
    const resCouponValid = mockRes();
    await validateCoupon({ body: { code: 'MOTO10', subtotal: 3349 } }, resCouponValid, mockNext);
    assert(resCouponValid.statusCode === 200 && resCouponValid.body.data.discountAmount === 335, '10. Coupon MOTO10 gives 10% on ₹3349 = ₹335');

    const resCouponInvalid = mockRes();
    await validateCoupon({ body: { code: 'EXPIRED999', subtotal: 3349 } }, resCouponInvalid, mockNext);
    assert(resCouponInvalid.statusCode === 400, '11. Invalid coupon returns 400 error');

    // 7. Apply coupon to Cart
    const resApplyCoupon = mockRes();
    await applyCoupon({ ...userReq, body: { code: 'MOTO10' } }, resApplyCoupon, mockNext);
    assert(resApplyCoupon.statusCode === 200 && resApplyCoupon.body.data.discount > 0, '12. POST /api/cart/coupon applies MOTO10 to cart');

    // 8. Remove coupon from Cart
    const resRemoveCoupon = mockRes();
    await removeCoupon(userReq, resRemoveCoupon, mockNext);
    assert(resRemoveCoupon.statusCode === 200 && resRemoveCoupon.body.data.discount === 0, '13. DELETE /api/cart/coupon removes discount');

    // 9. Shipping Quote for Express delivery
    const resShip = mockRes();
    await getShippingQuote({ ...userReq, body: { shippingMethod: 'express' } }, resShip, mockNext);
    assert(resShip.statusCode === 200 && resShip.body.data.shippingFee === 199, '14. Express shipping quote returns ₹199');

    // 10. Save for Later
    const resSave = mockRes();
    await saveForLater({ ...userReq, body: { itemId: 'prod-002' } }, resSave, mockNext);
    assert(resSave.statusCode === 200 && resSave.body.data.saveForLater.length === 1, '15. POST /api/cart/save-for-later moves item to saved list');

    // 11. Move back to Cart
    const resMove = mockRes();
    await moveToCart({ ...userReq, body: { itemId: 'prod-002' } }, resMove, mockNext);
    assert(resMove.statusCode === 200 && resMove.body.data.items.length === 2, '16. POST /api/cart/move-to-cart restores item');

    // 12. Merge Guest Cart
    const resMerge = mockRes();
    await mergeGuestCart({
      ...userReq,
      body: {
        items: [
          { productId: 'prod-003', quantity: 1 }, // Dual LED Fog Lights (3899)
          { productId: 'prod-001', quantity: 2 }, // Combined with existing prod-001 (total: 3)
        ],
      },
    }, resMerge, mockNext);
    assert(resMerge.statusCode === 200 && resMerge.body.data.items.length === 3, '17. POST /api/cart/merge combines guest items and updates quantities');

    // 13. Remove Item
    const resRemove = mockRes();
    await removeItem({ ...userReq, params: { itemId: 'prod-003' } }, resRemove, mockNext);
    assert(resRemove.statusCode === 200 && resRemove.body.data.items.length === 2, '18. DELETE /api/cart/items/:itemId removes product');

    // 14. Clear Cart
    const resClear = mockRes();
    await clearCart(userReq, resClear, mockNext);
    assert(resClear.statusCode === 200 && resClear.body.data.items.length === 0, '19. DELETE /api/cart empties entire cart');

    // 15. Shipping Service standalone unit test
    const shipStdFree = calculateShipping({ subtotal: 1200, shippingMethod: 'standard', totalQuantity: 2 });
    assert(shipStdFree.amount === 0 && shipStdFree.isFree === true, '20. Shipping Service correctly flags free standard shipping');

    const shipExp = calculateShipping({ subtotal: 1500, shippingMethod: 'express', totalQuantity: 2 });
    assert(shipExp.amount === 199, '21. Shipping Service computes ₹199 for Express');

    // 16. Tax Service standalone unit test
    const taxRes = calculateTax([], 1000);
    assert(taxRes.taxAmount === 180 && taxRes.taxRate === 0.18, '22. Tax Service calculates 18% GST (₹180 on ₹1000)');

    // 17. Active promotional coupons query
    const resActiveCoupons = mockRes();
    await getActiveCoupons({}, resActiveCoupons, mockNext);
    assert(resActiveCoupons.statusCode === 200 && resActiveCoupons.body.data.length >= 3, '23. GET /api/coupons/active returns available promotion coupons');

  } catch (err) {
    console.error('Test Suite Failed With Exception:', err);
    failed++;
  } finally {
    console.log('\n========================================');
    console.log(`Phase 8 Tests Complete: ${passed} Passed | ${failed} Failed`);
    console.log('========================================\n');
  }
};

runTests();
