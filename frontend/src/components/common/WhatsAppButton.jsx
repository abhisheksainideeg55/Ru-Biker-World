import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919876543210?text=Hi%20RU%20BIKER%20WORLD%2C%20I%20have%20an%20inquiry%20about%20bike%20spares%20and%20accessories"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-xl bg-[#108474] hover:bg-[#0c6b5d] text-white shadow-xl flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
      aria-label="Chat with RU BIKER world on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
    </a>
  );
};

export default WhatsAppButton;
