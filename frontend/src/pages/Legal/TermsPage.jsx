import React from 'react';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';

export const TermsPage = () => {
  return (
    <div className="py-8 bg-slate-50 min-h-[70vh]">
      <Container size="narrow">
        <Breadcrumb items={[{ label: 'Terms & Conditions', path: null }]} className="mb-4" />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-card space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h1 className="text-xl font-black text-slate-900 font-display">
            Terms & Conditions
          </h1>
          <p>
            Welcome to MotoZone. By accessing our platform and placing orders for motorcycle spare parts and accessories, you agree to comply with our store policies, warranty guidelines, and safe usage practices.
          </p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">1. Product Compatibility & Installation</h2>
          <p>
            While our Bike Compatibility checker provides fitment guidance, we recommend verifying exact motorcycle year and chassis specifications prior to final assembly.
          </p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">2. Warranty & Replacements</h2>
          <p>
            Standard manufacturer warranties cover defects in materials and manufacturing. Components damaged due to improper installation or track misuse are excluded.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default TermsPage;
