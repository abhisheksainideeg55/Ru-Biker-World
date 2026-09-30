import React from 'react';
import Container from '../common/Container';
import Breadcrumb from '../common/Breadcrumb';
import SectionTitle from '../common/SectionTitle';
import CheckoutProgress from './CheckoutProgress';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import CheckoutFooter from './CheckoutFooter';

export const CheckoutLayout = ({
  currentStep = 1,
  onStepClick,
  children,
  actionButton,
}) => {
  return (
    <div className="py-6 sm:py-8 min-h-[80vh]">
      <Container size="wide">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Cart', to: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        {/* Page Title */}
        <div className="mb-4">
          <SectionTitle
            title="Secure Checkout"
            subtitle="Complete your delivery and payment details to confirm your motorcycle parts order."
            badge="Protected Checkout"
          />
        </div>

        {/* Progress Step Indicator */}
        <CheckoutProgress currentStep={currentStep} onStepClick={onStepClick} />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Main Step Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {children}
            {actionButton && <div className="mt-4">{actionButton}</div>}
          </div>

          {/* Sticky Order Summary Column (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <CheckoutOrderSummary />
          </div>
        </div>

        {/* Security & Trust Guarantee Footer */}
        <CheckoutFooter />
      </Container>
    </div>
  );
};

export default CheckoutLayout;
