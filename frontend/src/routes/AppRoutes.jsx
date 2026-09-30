import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded Public Pages
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ShopPage = lazy(() => import('../pages/Shop/ShopPage'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetails/ProductDetailsPage'));
const CartPage = lazy(() => import('../pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/Checkout/OrderConfirmationPage'));
const WishlistPage = lazy(() => import('../pages/Wishlist/WishlistPage'));
const BlogPage = lazy(() => import('../pages/Blog/BlogPage'));
const BlogDetailsPage = lazy(() => import('../pages/Blog/BlogDetailsPage'));
const CollectionsPage = lazy(() => import('../pages/Collections/CollectionsPage'));
const WholesalePage = lazy(() => import('../pages/Wholesale/WholesalePage'));
const OffersPage = lazy(() => import('../pages/Offers/OffersPage'));
const TrackOrderPage = lazy(() => import('../pages/Orders/TrackOrderPage'));
const FaqPage = lazy(() => import('../pages/Faq/FaqPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));
const BrandDirectoryPage = lazy(() => import('../pages/BrandDirectory/BrandDirectoryPage'));
const TermsPage = lazy(() => import('../pages/Legal/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/Legal/PrivacyPage'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

// Lazy-loaded Auth Pages
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/Auth/ResetPasswordPage'));
const AccountBlockedPage = lazy(() => import('../pages/Auth/AccountBlockedPage'));

// Lazy-loaded Protected Account & Order Pages
const AccountPage = lazy(() => import('../pages/Account/AccountPage'));
const ProfilePage = lazy(() => import('../pages/Account/ProfilePage'));
const OrdersPage = lazy(() => import('../pages/Account/OrdersPage'));
const OrderDetailsPage = lazy(() => import('../pages/Orders/OrderDetailsPage'));
const OrderPrintPage = lazy(() => import('../pages/Orders/OrderPrintPage'));
const ReturnsPage = lazy(() => import('../pages/Orders/ReturnsPage'));
const ReturnDetailsPage = lazy(() => import('../pages/Orders/ReturnDetailsPage'));
const AddressesPage = lazy(() => import('../pages/Account/AddressesPage'));
const NotificationsPage = lazy(() => import('../pages/Account/NotificationsPage'));
const ReviewsPage = lazy(() => import('../pages/Account/ReviewsPage'));
const SettingsPage = lazy(() => import('../pages/Account/SettingsPage'));

// Lazy-loaded Admin Operations Suite
const AdminRoute = lazy(() => import('./AdminRoute'));
const AdminLoginPage = lazy(() => import('../pages/Admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/Admin/AdminProducts'));
const AdminAddProduct = lazy(() => import('../pages/Admin/AdminAddProduct'));
const AdminMediaGallery = lazy(() => import('../pages/Admin/AdminMediaGallery'));
const AdminInventory = lazy(() => import('../pages/Admin/AdminInventory'));
const AdminOrders = lazy(() => import('../pages/Admin/AdminOrders'));
const AdminCategories = lazy(() => import('../pages/Admin/AdminCategories'));
const AdminBikeCategories = lazy(() => import('../pages/Admin/AdminBikeCategories'));
const AdminShopByCategory = lazy(() => import('../pages/Admin/AdminShopByCategory'));
const AdminLookingFor = lazy(() => import('../pages/Admin/AdminLookingFor'));
const AdminBrands = lazy(() => import('../pages/Admin/AdminBrands'));
const AdminCustomers = lazy(() => import('../pages/Admin/AdminCustomers'));
const AdminPayments = lazy(() => import('../pages/Admin/AdminPayments'));
const AdminCoupons = lazy(() => import('../pages/Admin/AdminCoupons'));
const AdminReviews = lazy(() => import('../pages/Admin/AdminReviews'));
const AdminUsers = lazy(() => import('../pages/Admin/AdminUsers'));
const AdminAnalytics = lazy(() => import('../pages/Admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('../pages/Admin/AdminSettings'));

// Page loading indicator
const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-400">Loading RU BIKER WORLD...</span>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Standalone Admin Login Portal & Account Blocked Portal */}
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin-login" element={<AdminLoginPage />} />
        <Route path="account-blocked" element={<AccountBlockedPage />} />

        {/* Admin Management Suite Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminAddProduct />} />
            <Route path="products/edit/:id" element={<AdminAddProduct />} />
            <Route path="media" element={<AdminMediaGallery />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="shop-by-category" element={<AdminShopByCategory />} />
            <Route path="looking-for" element={<AdminLookingFor />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="bike-categories" element={<AdminBikeCategories />} />
            <Route path="bikes" element={<AdminBikeCategories />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductDetailsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogDetailsPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:slug" element={<ShopPage />} />
          <Route path="pages/wholesale-price" element={<WholesalePage />} />
          <Route path="wholesale" element={<WholesalePage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="brands" element={<BrandDirectoryPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />

          {/* Auth Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />

          {/* User Account Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<AccountPage />} />
            <Route path="account/overview" element={<AccountPage />} />
            <Route path="account/profile" element={<ProfilePage />} />
            <Route path="account/addresses" element={<AddressesPage />} />
            <Route path="account/wishlist" element={<WishlistPage />} />
            <Route path="account/orders" element={<OrdersPage />} />
            <Route path="account/orders/:id" element={<OrderDetailsPage />} />
            <Route path="account/orders/:id/print" element={<OrderPrintPage />} />
            <Route path="account/returns" element={<ReturnsPage />} />
            <Route path="account/returns/:id" element={<ReturnDetailsPage />} />
            <Route path="account/reviews" element={<ReviewsPage />} />
            <Route path="account/notifications" element={<NotificationsPage />} />
            <Route path="account/settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
