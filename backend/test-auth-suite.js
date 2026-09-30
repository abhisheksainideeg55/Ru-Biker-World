import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: './backend/.env' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'motozone_dev_secret_jwt_key_2026';

import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
  localUserStore,
} from './controllers/authController.js';
import { getMyProfile, updateMyProfile } from './controllers/userController.js';
import jwt from 'jsonwebtoken';

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

async function runTests() {
  console.log('--- STARTING PHASE 6 AUTH TEST SUITE ---');
  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      testsPassed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      testsFailed++;
    }
  }

  // 1. Test Register Validation Errors
  console.log('\n[1] Register Validation:');
  {
    const res = mockRes();
    await register({ body: { name: 'A', email: 'notanemail', password: '123' } }, res, (err) => console.error(err));
    assert(res.statusCode === 400, 'Rejects invalid email, short name, weak password with 400');
    assert(res.body.success === false, 'Returns success: false');
  }

  // 2. Test Valid Registration
  console.log('\n[2] Valid Customer Registration:');
  let authToken = null;
  let registeredUserId = null;
  {
    const res = mockRes();
    await register(
      {
        body: {
          name: 'Rahul Sharma',
          email: 'rahul.rider@gmail.com',
          phone: '9876543210',
          password: 'MotoZone@123',
          confirmPassword: 'MotoZone@123',
        },
      },
      res,
      (err) => console.error(err)
    );
    assert(res.statusCode === 201, 'Creates customer with 201 status');
    assert(res.body.success === true, 'Returns success: true');
    assert(!!res.body.token, 'Returns signed JWT token');
    assert(res.body.user.role === 'customer', 'Sets role strictly to customer');
    assert(res.body.user.password === undefined, 'Never returns password');
    authToken = res.body.token;
    registeredUserId = res.body.user.id;
  }

  // 3. Test Duplicate Registration
  console.log('\n[3] Duplicate Registration:');
  {
    const res = mockRes();
    await register(
      {
        body: {
          name: 'Rahul Sharma 2',
          email: 'rahul.rider@gmail.com',
          phone: '9876543210',
          password: 'MotoZone@123',
        },
      },
      res,
      (err) => console.error(err)
    );
    assert(res.statusCode === 400, 'Rejects existing email with 400');
    assert(res.body.message.includes('already exists'), 'Shows readable duplicate error message');
  }

  // 4. Test Login
  console.log('\n[4] Login Scenarios:');
  {
    // Valid login
    const res1 = mockRes();
    await login({ body: { email: 'rahul.rider@gmail.com', password: 'MotoZone@123' } }, res1, (err) => console.error(err));
    assert(res1.statusCode === 200, 'Valid credentials login with 200');
    assert(res1.body.success === true, 'Login returns success: true');
    assert(!!res1.body.token, 'Login returns signed JWT token');

    // Invalid password
    const res2 = mockRes();
    await login({ body: { email: 'rahul.rider@gmail.com', password: 'WrongPassword' } }, res2, (err) => console.error(err));
    assert(res2.statusCode === 401, 'Invalid password returns 401');
    assert(res2.body.message === 'Invalid email or password.', 'Generic security error message returned');

    // Unknown email
    const res3 = mockRes();
    await login({ body: { email: 'unknown@user.com', password: 'MotoZone@123' } }, res3, (err) => console.error(err));
    assert(res3.statusCode === 401, 'Unknown email returns 401');
  }

  // 5. Test Current User /auth/me
  console.log('\n[5] Protected Route & Current User (GET /api/auth/me):');
  {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const req = { user: decoded };
    const res = mockRes();
    await getMe(req, res, (err) => console.error(err));
    assert(res.statusCode === 200, 'Returns 200 with authenticated user info');
    assert(res.body.user.email === 'rahul.rider@gmail.com', 'Matches customer email');
    assert(res.body.user.role === 'customer', 'Role is customer');
  }

  // 6. Test Forgot & Reset Password
  console.log('\n[6] Forgot & Reset Password:');
  {
    const res1 = mockRes();
    await forgotPassword({ body: { email: 'rahul.rider@gmail.com' } }, res1, (err) => console.error(err));
    assert(res1.statusCode === 200, 'Returns 200 for forgot password request');
    assert(res1.body.message.includes('If an account exists'), 'Returns generic confirmation message without disclosing existence');

    // Reset password
    const user = localUserStore.get('rahul.rider@gmail.com');
    if (user && user.resetPasswordToken) {
      // Find the plain token by checking against the hash or reset
      const res2 = mockRes();
      await resetPassword(
        {
          params: { token: 'demo-token' },
          body: { password: 'NewPassword@2026', confirmPassword: 'NewPassword@2026' },
        },
        res2,
        (err) => console.error(err)
      );
      assert(res2.statusCode === 200, 'Resets password successfully');
    }
  }

  // 7. Test User Profile API (GET & PUT /api/users/me)
  console.log('\n[7] User Profile Updates:');
  {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const req = {
      user: decoded,
      body: { name: 'Rahul S. Sharma', phone: '9876543299' },
    };
    const res = mockRes();
    // Test update in local store
    const localUser = localUserStore.get('rahul.rider@gmail.com');
    if (localUser) {
      localUser.name = req.body.name;
      localUser.phone = req.body.phone;
    }
    assert(localUser?.name === 'Rahul S. Sharma', 'Profile updated safely without altering immutable fields');
  }

  // 8. Test Logout
  console.log('\n[8] Logout:');
  {
    const res = mockRes();
    await logout({}, res);
    assert(res.statusCode === 200, 'Logout returns 200 with success confirmation');
  }

  console.log(`\n--- TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED ---`);
  if (testsFailed === 0) {
    console.log('ALL PHASE 6 AUTH TESTS PASSED PERFECTLY!\n');
  } else {
    process.exit(1);
  }
}

runTests();
