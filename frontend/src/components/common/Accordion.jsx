import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export const AccordionItem = ({
  title,
  children,
  isOpen: defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-slate-200 py-3 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-semibold text-slate-800 hover:text-brand-600 transition-colors py-1"
      >
        <span>{title}</span>
        <FiChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-brand-600' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pt-2.5 pb-1 text-sm text-slate-600 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export const Accordion = ({ items = [], className = '' }) => {
  return (
    <div className={`divide-y divide-slate-200 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} isOpen={item.isOpen}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
