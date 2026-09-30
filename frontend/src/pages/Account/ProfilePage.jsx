import React from 'react';
import { AccountLayout } from '../../components/account';
import { ProfileForm, ChangePasswordForm } from '../../components/forms';
import { FiUserCheck, FiLock } from 'react-icons/fi';

export const ProfilePage = () => {
  return (
    <AccountLayout breadcrumbs={[{ label: 'Profile Information', path: null }]}>
      <div className="space-y-6">
        {/* Section 1: Profile Details & Photo */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-200/60">
              <FiUserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 font-display">
                Profile Information
              </h1>
              <p className="text-xs text-slate-500">
                Update your contact information and motorcycle rider avatar.
              </p>
            </div>
          </div>

          <ProfileForm />
        </section>

        {/* Section 2: Security / Change Password */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                Change Account Password
              </h2>
              <p className="text-xs text-slate-500">
                Ensure your rider account is protected with a secure password.
              </p>
            </div>
          </div>

          <ChangePasswordForm />
        </section>
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
