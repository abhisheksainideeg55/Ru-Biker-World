import React from 'react';
import { FiCheckCircle, FiShield, FiHeadphones, FiTruck } from 'react-icons/fi';
import Container from '../common/Container';

const trustItems = [
  { icon: FiCheckCircle, text: '100% GENUINE PRODUCTS' },
  { icon: FiShield, text: 'SECURE PAYMENTS' },
  { icon: FiHeadphones, text: 'OUTSTANDING SUPPORT' },
  { icon: FiTruck, text: 'FAST DELIVERY' },
];

export const TrustSection = () => {
  return (
    <section className="">
      <Container size="wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-between text-center">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-center gap-2 py-1">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00a2e8]" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-100">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default TrustSection;

