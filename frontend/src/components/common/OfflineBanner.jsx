import React, { useState, useEffect } from 'react';
import { FiWifiOff } from 'react-icons/fi';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-rose-600 text-white py-2 px-4 text-center text-xs font-bold fixed bottom-0 left-0 right-0 z-50 shadow-lg flex items-center justify-center gap-2 animate-bounce">
      <FiWifiOff className="w-4 h-4" />
      <span>You are currently offline. Please check your internet connection. Live inventory and payments require network access.</span>
    </div>
  );
};

export default OfflineBanner;
