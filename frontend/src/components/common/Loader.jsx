import React from 'react';
import Spinner from './Spinner';

export const Loader = ({
  message = 'Loading MotoZone parts...',
  fullScreen = false,
  className = '',
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Spinner size="lg" color="brand" />
      {message && <p className="mt-4 text-sm font-medium text-slate-600 animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
