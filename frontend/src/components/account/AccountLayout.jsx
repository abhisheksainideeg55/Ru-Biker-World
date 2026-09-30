import React from 'react';
import Container from '../common/Container';
import Breadcrumb from '../common/Breadcrumb';
import AccountSidebar from './AccountSidebar';
import AccountMobileNavigation from './AccountMobileNavigation';

export const AccountLayout = ({ breadcrumbs = [], children }) => {
  const defaultBreadcrumbs = [
    { label: 'My Account', path: '/account' },
    ...breadcrumbs,
  ];

  return (
    <div className="bg-slate-50/60 min-h-[85vh] py-6 sm:py-8">
      <Container>
        <Breadcrumb items={defaultBreadcrumbs} className="mb-4" />

        {/* Mobile Navigation */}
        <AccountMobileNavigation />

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Desktop Left Sidebar */}
          <div className="hidden lg:block shrink-0">
            <AccountSidebar />
          </div>

          {/* Right Main Account Area */}
          <main className="flex-1 w-full min-w-0">{children}</main>
        </div>
      </Container>
    </div>
  );
};

export default AccountLayout;
