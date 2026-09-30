import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import Footer from './Footer';
import ToastContainer from '../common/Toast';
import CartDrawer from '../cart/CartDrawer';
import RewardsWidget from '../common/RewardsWidget';
import WhatsAppButton from '../common/WhatsAppButton';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50 text-slate-900">
      {/* Universal Header */}
      <Header />

      {/* Dynamic Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Global Slide-in Cart Drawer */}
      <CartDrawer />

      {/* Global Toast Notification Container */}
      <ToastContainer />

      {/* Floating RU BIKER Rewards Tab */}
      <RewardsWidget />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
