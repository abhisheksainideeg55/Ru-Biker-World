import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '../../components/common/Container';
import KwikPassLogin from '../../components/auth/KwikPassLogin';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/account';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  return (
    <div className="py-8 sm:py-16 bg-slate-100 min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <KwikPassLogin />
      </div>
    </div>
  );
};

export default LoginPage;
