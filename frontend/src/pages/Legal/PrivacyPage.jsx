import React from 'react';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';

export const PrivacyPage = () => {
  return (
    <div className="py-8 bg-slate-50 min-h-[70vh]">
      <Container size="narrow">
        <Breadcrumb items={[{ label: 'Privacy Policy', path: null }]} className="mb-4" />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-card space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h1 className="text-xl font-black text-slate-900 font-display">
            Privacy Policy
          </h1>
          <p>
            At MotoZone, we are committed to safeguarding your privacy. This policy outlines how your contact information, delivery addresses, and vehicle garage records are protected.
          </p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">1. Information We Collect</h2>
          <p>
            We collect account details (name, email, phone number) and shipping addresses necessary to fulfill orders and provide tailored motorcycle compatibility suggestions.
          </p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">2. Security & Encryption</h2>
          <p>
            Customer passwords are encrypted using one-way bcrypt hashing. All authenticated traffic is protected via secure JSON Web Tokens (JWT).
          </p>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPage;
