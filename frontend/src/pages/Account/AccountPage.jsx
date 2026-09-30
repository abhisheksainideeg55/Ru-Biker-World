import React from 'react';
import {
  AccountLayout,
  AccountHeader,
  UserProfileSummary,
  AccountOverviewCards,
} from '../../components/account';
import { useAuth } from '../../hooks/useAuth';

export const AccountPage = () => {
  const { user } = useAuth();

  return (
    <AccountLayout breadcrumbs={[]}>
      <div className="space-y-6">
        {/* Header Hero */}
        <AccountHeader
          user={user}
          title={`Welcome back, ${user?.name || 'Rider'}`}
          subtitle="Manage your motorcycle orders, saved vehicles, and delivery addresses."
        />

        {/* Profile Quick Summary Card */}
        <UserProfileSummary user={user} />

        {/* Quick Action Shortcuts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-slate-900 font-display">
              Account Overview & Garage
            </h2>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              100% Genuine MotoZone Parts
            </span>
          </div>
          <AccountOverviewCards user={user} />
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountPage;
