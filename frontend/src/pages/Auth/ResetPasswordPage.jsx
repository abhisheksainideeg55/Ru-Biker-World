import React from 'react';
import Container from '../../components/common/Container';
import Logo from '../../components/header/Logo';
import { ResetPasswordForm } from '../../components/forms';

export const ResetPasswordPage = () => {
  return (
    <div className="py-8 sm:py-14 bg-slate-50/60 min-h-[85vh] flex items-center">
      <Container size="narrow">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-elevated overflow-hidden max-w-lg mx-auto p-6 sm:p-10">
          <div className="text-center mb-8">
            <Logo size="md" className="justify-center mb-4" />
            <h1 className="text-2xl font-black text-slate-900 font-display">
              Set New Password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose a strong, secure password for your MotoZone rider account.
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
