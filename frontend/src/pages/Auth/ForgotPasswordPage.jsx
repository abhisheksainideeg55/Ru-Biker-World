import React from 'react';
import Container from '../../components/common/Container';
import Logo from '../../components/header/Logo';
import { ForgotPasswordForm } from '../../components/forms';

export const ForgotPasswordPage = () => {
  return (
    <div className="py-8 sm:py-14 bg-slate-50/60 min-h-[85vh] flex items-center">
      <Container size="narrow">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-elevated overflow-hidden max-w-lg mx-auto p-6 sm:p-10">
          <div className="text-center mb-8">
            <Logo size="md" className="justify-center mb-4" />
            <h1 className="text-2xl font-black text-slate-900 font-display">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter the email address registered with your MotoZone account to receive a secure password reset link.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
