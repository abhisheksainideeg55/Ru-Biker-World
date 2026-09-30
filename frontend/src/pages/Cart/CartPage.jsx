import React from 'react';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import SectionTitle from '../../components/common/SectionTitle';
import {
  CartList,
  CartSummary,
  CouponInput,
  ShippingMethodSelector,
  EmptyCart,
  CartLoading,
} from '../../components/cart';
import { useCart } from '../../hooks/useCart';

export const CartPage = () => {
  const { items, isLoading } = useCart();

  const isCartEmpty = !items || items.length === 0;

  return (
    <div className="py-6 sm:py-8 min-h-[75vh]">
      <Container size="wide">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Shopping Cart' }]} />

        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <SectionTitle
            title="Shopping Cart"
            subtitle="Review your items, apply coupons, select delivery method, and proceed to checkout."
            badge="Customer Cart"
          />
        </div>

        {/* Main Content Area */}
        {isLoading && items.length === 0 ? (
          <CartLoading />
        ) : isCartEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items & Save for Later (8 cols) */}
            <div className="lg:col-span-8">
              <CartList items={items} />
            </div>

            {/* Right Column: Shipping + Coupon + Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              <ShippingMethodSelector />
              <CouponInput />
              <CartSummary />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
