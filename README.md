# MotoZone — Motorcycle Accessories & Spare Parts E-Commerce Platform

MotoZone is a high-performance, production-hardened e-commerce platform engineered specifically for motorcycle enthusiasts, riders, and garages across India. The platform supports seamless bike compatibility lookups, genuine OEM/aftermarket parts catalog, verified customer reviews, dynamic shopping cart & coupons, Razorpay payment processing, order tracking & returns, technical editorial blogs, and promotional discount campaigns.

---

## 🚀 Key Highlights & Customer Capabilities (Phases 1–12)

1. **Rider Garage & Bike Compatibility**:
   - Filter over 10,000+ parts by Bike Make, Model, and Engine Variant (e.g. KTM Duke 390, Royal Enfield Classic 350, Yamaha R15).
   - Compatibility checker badge on product pages verifying exact fitment.

2. **Customer Authentication & Profile Management**:
   - Secure JWT token-based authentication with bcrypt password hashing.
   - Profile management, avatar upload, password changes, and saved address book with atomic default address management.

3. **Cart, Coupon & Shipping System**:
   - Persistent authenticated & guest cart with automatic cart merge upon login.
   - Dynamic coupon code validator (e.g. `MOTO10`, `WELCOME500`, `TRACK20`) and free shipping threshold calculations.
   - Real-time stock validation preventing backorder overselling.

4. **Checkout & Razorpay Payment Integration**:
   - Server-calculated order totals with 18% GST calculation.
   - HMAC-SHA256 server-side signature verification preventing client-side payment tampering.
   - Idempotent order confirmation and transactional confirmation notifications.

5. **Order Lifecycle, Tracking & Returns**:
   - Real status history timeline (Placed → Confirmed → Processing → Shipped → Delivered).
   - Live courier shipment card with carrier AWB tracking and public guest verification.
   - Atomic inventory stock restoration upon order cancellation.
   - 7-day delivery return window with multi-image evidence upload and refund status tracking.
   - Printable order receipt (`/account/orders/:id/print`) optimized for browser print.

6. **Verified Purchase Reviews**:
   - Only verified customers with delivered orders can submit reviews.
   - 1–5 star ratings, title, detailed comment, evidence image gallery, helpful voting, and moderation reporting.
   - Server-computed star distribution (5★ to 1★ percentage breakdown).

7. **Notification Center & Alerts**:
   - In-app notification center with unread count badge in header dropdown.
   - Customer product subscriptions for `BACK_IN_STOCK` and `PRICE_DROP` alerts.

8. **Technical Blog & Guides**:
   - Editorial motorcycle maintenance manuals, riding gear safety guides (ECE 22.06 vs DOT vs ISI), and DIY chain care.
   - Category filtering, debounced live search, and related articles.

9. **Promotional Offers & Discount Badges**:
   - Active deals showcase with one-click coupon copying, validity countdowns, and dynamic product offer badges.

10. **Production Hardening (Phase 12)**:
    - **SEO**: Dynamic metadata, OpenGraph tags, canonical links, XML sitemap (`/sitemap.xml`), and JSON-LD structured data (Product, Article, BreadcrumbList, Organization).
    - **Performance**: Route-level code splitting with `React.lazy` and `Suspense`, image lazy loading, and debounced API requests.
    - **Security**: Strict CORS origin scoping, Helmet security headers, in-memory sliding-window rate limiting on sensitive routes (`/api/auth/*`, `/api/payments/*`, `/api/orders/track`), and MongoDB query sanitization against NoSQL injection.
    - **Error Resilience**: React `ErrorBoundary`, offline network detection banner, and sanitized API error responses (zero stack traces exposed in production).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, TailwindCSS, React Router v6, React Icons, Axios |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, Helmet, Cors, Bcryptjs, JsonWebToken |
| **Database** | MongoDB Atlas / Local MongoDB (with resilient in-memory fallback for testing) |
| **Payment Gateway** | Razorpay Node.js SDK / Checkout.js integration |

---

## 📂 Project Architecture

```text
Sparify/
├── backend/
│   ├── config/             # DB and Return policy configuration
│   ├── controllers/        # Express route controllers (Auth, Products, Cart, Orders, Reviews, Blog, etc.)
│   ├── data/               # Product catalog, bike models, and categories seed data
│   ├── middleware/         # Auth, validation, error handling, and rate limiting middleware
│   ├── models/             # Mongoose schemas (User, Product, Order, ReturnRequest, Review, BlogPost, Offer, etc.)
│   ├── routes/             # Modular Express routers
│   ├── services/           # Business logic (Refunds, Returns, Review images, Shipping, Tax)
│   ├── server.js           # Production Express server entry point
│   ├── .env.example        # Backend environment template
│   └── test-phase*-suite.js# Automated unit & integration test suites
│
├── frontend/
│   ├── public/             # robots.txt, sitemap.xml, static assets
│   ├── src/
│   │   ├── components/     # Reusable UI widgets (account, blog, cart, header, layout, offer, order, product, review)
│   │   ├── context/        # React context providers (Auth, Cart, Wishlist, User, Notification, Order)
│   │   ├── hooks/          # Custom hooks (useAuth, useCart, useOrders, useReviews, useBlog, etc.)
│   │   ├── pages/          # Route page views (Home, Shop, ProductDetails, Checkout, Blog, Offers, Account, NotFound)
│   │   ├── routes/         # AppRoutes with React.lazy code splitting and ProtectedRoute guard
│   │   ├── services/       # Axios API client services
│   │   ├── utils/          # SEO, AuthStorage, and formatters
│   │   ├── App.jsx         # Root app wrapper with ErrorBoundary and OfflineBanner
│   │   └── main.jsx        # React DOM mount point
│   ├── .env.example        # Frontend environment template
│   └── vite.config.js      # Vite build configuration
│
└── .env.example            # Master environment variable template
```

---

## ⚙️ Environment Variables Setup

### Backend Configuration (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/motozone?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production_min_32_chars
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173

# Razorpay Keys (Backend Only)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

---

## 📦 Installation & Local Development

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start Backend Development Server
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm run dev
# App starts at http://localhost:5173
```

---

## 🧪 Automated Testing

Run the full end-to-end regression test suite across all development phases:

```bash
cd backend

# Run individual test suites
node test-phase7-suite.js   # Account, Addresses, Wishlist, Notifications (35 tests)
node test-phase8-suite.js   # Cart, Stock validation, Shipping, Coupons (23 tests)
node test-phase9-suite.js   # Checkout, Razorpay signatures, Payments (18 tests)
node test-phase10-suite.js  # Orders, Tracking, Cancellations, Returns (15 tests)
node test-phase11-suite.js  # Reviews, Blog, Offers, Product alerts (19 tests)
node test-phase12-suite.js  # Security headers, Rate limiters, SEO JSON-LD (10 tests)
```

**Total 120 / 120 Automated Assertions Passing (100% Pass Rate).**

---

## 🏗️ Production Build & Verification

```bash
cd frontend
npm run build
```
- Code splitting chunks created under `dist/assets/`.
- Total vendor bundle optimized to **~416 kB (123 kB gzip)**.

---

## 🔒 Security Summary

- **Never Trust Client**: All pricing, discounts, shipping fees, tax, and order statuses are strictly calculated and validated on the backend.
- **HMAC Signature Verification**: Razorpay payment signatures are validated on server before orders are confirmed.
- **Resource Ownership Scoping**: Orders, returns, reviews, addresses, and notifications are scoped to `req.user._id` (alien access returns 404/403).
- **Rate Limiting**: Brute-force protection enabled for login, registration, password resets, and tracking queries.
- **XSS & Injection Protection**: HTML sanitization, query sanitization (stripping `$where`, `$gt`), and helmet CSP configuration.

---

## 📄 License

ISC License. Built for MotoZone India.
