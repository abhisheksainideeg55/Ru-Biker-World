import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: './backend/.env' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'motozone_dev_secret_jwt_key_2026';

import jwt from 'jsonwebtoken';
import {
  register,
  login,
  localUserStore,
} from './controllers/authController.js';
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  removeAvatar,
  getPreferences,
  updatePreferences,
} from './controllers/userController.js';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from './controllers/addressController.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from './controllers/wishlistController.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from './controllers/notificationController.js';

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

async function runPhase7Tests() {
  console.log('--- STARTING PHASE 7 SUITE: ACCOUNT, ADDRESSES, WISHLIST, NOTIFICATIONS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // Setup test user
  const regRes = mockRes();
  await register(
    {
      body: {
        name: 'Vikram Singh',
        email: 'vikram.rider@motozone.in',
        phone: '9876501234',
        password: 'MotoZone@123',
        confirmPassword: 'MotoZone@123',
      },
    },
    regRes,
    (err) => console.error(err)
  );

  const token = regRes.body.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const req = { user: decoded };

  // 1. Test Get Profile & Update Profile
  console.log('\n[1] Profile Information & Avatar:');
  {
    const res1 = mockRes();
    await getMyProfile(req, res1, (err) => console.error(err));
    assert(res1.statusCode === 200, 'Fetches profile with status 200');
    assert(res1.body.user.name === 'Vikram Singh', 'Correct user name');

    // Update profile
    const res2 = mockRes();
    await updateMyProfile(
      { ...req, body: { name: 'Vikram R. Singh', phone: '9876599999', avatar: 'data:image/png;base64,mockavatar' } },
      res2,
      (err) => console.error(err)
    );
    assert(res2.statusCode === 200, 'Updates profile with 200');
    assert(res2.body.user.name === 'Vikram R. Singh', 'Name updated successfully');
    assert(res2.body.user.avatar !== null, 'Avatar saved successfully');

    // Remove avatar
    const res3 = mockRes();
    await removeAvatar(req, res3, (err) => console.error(err));
    assert(res3.statusCode === 200, 'Removes avatar with 200');
    assert(res3.body.user.avatar === null, 'Avatar is now null');
  }

  // 2. Test Change Password
  console.log('\n[2] Change Password:');
  {
    // Wrong current password
    const res1 = mockRes();
    await changePassword(
      { ...req, body: { currentPassword: 'WrongPassword', newPassword: 'NewPassword@123' } },
      res1,
      (err) => console.error(err)
    );
    assert(res1.statusCode === 400, 'Rejects incorrect current password with 400');

    // Valid change password
    const res2 = mockRes();
    await changePassword(
      { ...req, body: { currentPassword: 'MotoZone@123', newPassword: 'NewSecurePassword@2026', confirmNewPassword: 'NewSecurePassword@2026' } },
      res2,
      (err) => console.error(err)
    );
    assert(res2.statusCode === 200, 'Changes password successfully with 200');

    // Verify login with new password
    const loginRes = mockRes();
    await login({ body: { email: 'vikram.rider@motozone.in', password: 'NewSecurePassword@2026' } }, loginRes, (err) => console.error(err));
    assert(loginRes.statusCode === 200, 'Customer can log in with new password');
  }

  // 3. Test Address Management (CRUD, Atomicity, Defaults)
  console.log('\n[3] Address Management (CRUD & Atomic Defaults):');
  let addr1Id = null;
  let addr2Id = null;
  {
    // Invalid address validation
    const res1 = mockRes();
    await addAddress(
      { ...req, body: { fullName: 'A', phone: '123', postalCode: 'invalid' } },
      res1,
      (err) => console.error(err)
    );
    assert(res1.statusCode === 400, 'Rejects invalid address fields with 400');

    // Add first address (should auto-become default)
    const res2 = mockRes();
    await addAddress(
      {
        ...req,
        body: {
          fullName: 'Vikram Singh',
          phone: '9876501234',
          addressLine1: 'Plot 101, Civil Lines',
          addressLine2: 'Near Central Mall',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302001',
          type: 'Home',
        },
      },
      res2,
      (err) => console.error(err)
    );
    assert(res2.statusCode === 201, 'Adds first address with 201');
    assert(res2.body.address.isDefault === true, 'First address automatically becomes default');
    addr1Id = res2.body.address._id || res2.body.address.id;

    // Add second address with isDefault: true (should atomicaly unset first address as default)
    const res3 = mockRes();
    await addAddress(
      {
        ...req,
        body: {
          fullName: 'Vikram Singh Workshop',
          phone: '9876501234',
          addressLine1: 'Unit 4, Speed Garage, Tonk Road',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302015',
          type: 'Work',
          isDefault: true,
        },
      },
      res3,
      (err) => console.error(err)
    );
    assert(res3.statusCode === 201, 'Adds second address with 201');
    assert(res3.body.address.isDefault === true, 'Second address is default');
    addr2Id = res3.body.address._id || res3.body.address.id;

    // Verify first address is no longer default
    const listRes1 = mockRes();
    await getAddresses(req, listRes1, (err) => console.error(err));
    const addr1 = listRes1.body.addresses.find((a) => (a._id || a.id) === addr1Id);
    assert(addr1.isDefault === false, 'Previous default was atomically cleared');

    // Update address
    const res4 = mockRes();
    await updateAddress(
      {
        ...req,
        params: { addressId: addr1Id },
        body: {
          fullName: 'Vikram Singh (Home Residence)',
          phone: '9876501234',
          addressLine1: 'Plot 101, New Civil Lines',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302001',
          type: 'Home',
        },
      },
      res4,
      (err) => console.error(err)
    );
    assert(res4.statusCode === 200, 'Updates address details with 200');

    // Switch default back to addr1
    const res5 = mockRes();
    await setDefaultAddress({ ...req, params: { addressId: addr1Id } }, res5, (err) => console.error(err));
    assert(res5.statusCode === 200, 'Sets addr1 as default with 200');

    // Delete default address (addr1) -> addr2 should automatically become the default
    const res6 = mockRes();
    await deleteAddress({ ...req, params: { addressId: addr1Id } }, res6, (err) => console.error(err));
    assert(res6.statusCode === 200, 'Deletes address with 200');
    assert(res6.body.addresses.length === 1, 'Only 1 address remaining');
    assert(res6.body.addresses[0].isDefault === true, 'Remaining address automatically reassigned as default');
  }

  // 4. Test Wishlist API
  console.log('\n[4] Wishlist API:');
  {
    // Add product to wishlist
    const res1 = mockRes();
    await addToWishlist({ ...req, body: { productId: 'brembo-brake-pads-rc' } }, res1, (err) => console.error(err));
    assert(res1.statusCode === 200, 'Adds product to wishlist with 200');
    assert(res1.body.wishlist.includes('brembo-brake-pads-rc'), 'Product present in wishlist');

    // Get wishlist
    const res2 = mockRes();
    await getWishlist(req, res2, (err) => console.error(err));
    assert(res2.statusCode === 200, 'Fetches wishlist with 200');

    // Remove from wishlist
    const res3 = mockRes();
    await removeFromWishlist({ ...req, params: { productId: 'brembo-brake-pads-rc' } }, res3, (err) => console.error(err));
    assert(res3.statusCode === 200, 'Removes product from wishlist with 200');
    assert(!res3.body.wishlist.includes('brembo-brake-pads-rc'), 'Product removed from wishlist');
  }

  // 5. Test Notifications API
  console.log('\n[5] Notifications API:');
  {
    const res1 = mockRes();
    await getNotifications(req, res1, (err) => console.error(err));
    assert(res1.statusCode === 200, 'Fetches customer notifications with 200');
    assert(res1.body.unreadCount >= 0, 'Returns unreadCount');

    // Mark single as read
    const notifId = res1.body.notifications[0]?._id || res1.body.notifications[0]?.id;
    if (notifId) {
      const res2 = mockRes();
      await markAsRead({ ...req, params: { id: notifId } }, res2, (err) => console.error(err));
      assert(res2.statusCode === 200, 'Marks notification as read with 200');
    }

    // Mark all as read
    const res3 = mockRes();
    await markAllAsRead(req, res3, (err) => console.error(err));
    assert(res3.statusCode === 200, 'Marks all notifications as read with 200');
    assert(res3.body.unreadCount === 0, 'unreadCount becomes 0');
  }

  // 6. Test Preferences API
  console.log('\n[6] Preferences API:');
  {
    const res1 = mockRes();
    await getPreferences(req, res1, (err) => console.error(err));
    assert(res1.statusCode === 200, 'Gets preferences with 200');

    const res2 = mockRes();
    await updatePreferences(
      { ...req, body: { emailNotifications: false, orderNotifications: true, promotionalNotifications: true } },
      res2,
      (err) => console.error(err)
    );
    assert(res2.statusCode === 200, 'Updates preferences with 200');
    assert(res2.body.preferences.emailNotifications === false, 'Email notifications set to false');
    assert(res2.body.preferences.promotionalNotifications === true, 'Promotions set to true');
  }

  console.log(`\n--- PHASE 7 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed === 0) {
    console.log('ALL PHASE 7 USER ACCOUNT & FOUNDATION TESTS PASSED!\n');
  } else {
    process.exit(1);
  }
}

runPhase7Tests();
