import React from 'react';
import { AccountLayout } from '../../components/account';
import { PreferencesForm, ChangePasswordForm } from '../../components/forms';
import { useAuth } from '../../hooks/useAuth';
import { FiSettings, FiSliders, FiShield, FiLock } from 'react-icons/fi';

export const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <AccountLayout breadcrumbs={[{ label: 'Account Settings', path: null }]}>
      <div className="space-y-6">
        {/* Section 1: Notifications & Communication Preferences */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
              <FiSliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 font-display">
                Notification & Communication Preferences
              </h1>
              <p className="text-xs text-slate-500">
                Choose what notifications and promotional updates you want to receive.
              </p>
            </div>
          </div>

          <PreferencesForm />
        </section>

        {/* Section 2: Account Security / Change Password */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                Account Security & Password
              </h2>
              <p className="text-xs text-slate-500">
                Update your login password to maintain high account security.
              </p>
            </div>
          </div>

          <ChangePasswordForm />
        </section>

        {/* Section 3: Active Session Info */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-display">
                Active Session & Security
              </h3>
              <p className="text-xs text-slate-500">
                Current rider account status and JWT authentication details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Authenticated Rider
              </span>
              <p className="font-bold text-slate-900">{user?.name || 'Rider'}</p>
              <p className="text-slate-500 mt-0.5">{user?.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Security Architecture
              </span>
              <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>JWT Authentication + bcrypt 12-round Hash</span>
              </p>
              <p className="text-slate-500 mt-0.5">7-Day Token Lifetime</p>
            </div>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
};

export default SettingsPage;
