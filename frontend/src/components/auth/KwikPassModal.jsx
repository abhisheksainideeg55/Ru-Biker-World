import React from 'react';
import KwikPassLogin from './KwikPassLogin';

export const KwikPassModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl animate-scaleUp">
        <KwikPassLogin onClose={onClose} isModal={true} onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default KwikPassModal;
