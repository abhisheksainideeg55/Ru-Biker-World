import React, { useState } from 'react';
import { 
  FiFileText, 
  FiList, 
  FiCheckSquare, 
  FiTool, 
  FiShield, 
  FiTruck, 
  FiChevronDown 
} from 'react-icons/fi';
import ProductDescription from './ProductDescription';
import ProductSpecifications from './ProductSpecifications';
import ProductFeatures from './ProductFeatures';
import ProductInstallation from './ProductInstallation';
import ProductWarranty from './ProductWarranty';
import ProductIncluded from './ProductIncluded';
import ProductShipping from './ProductShipping';

export const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    specifications: false,
    features: false,
    installation: false,
    warranty: false,
    shipping: false,
  });

  if (!product) return null;

  const tabs = [
    { id: 'description', label: 'Description', icon: FiFileText },
    { id: 'specifications', label: 'Specifications', icon: FiList },
    { id: 'features', label: 'Features', icon: FiCheckSquare },
    { id: 'installation', label: 'Installation', icon: FiTool },
    { id: 'warranty', label: 'Warranty', icon: FiShield },
    { id: 'shipping', label: 'Shipping & Returns', icon: FiTruck },
  ];

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderContent = (id) => {
    switch (id) {
      case 'description':
        return <ProductDescription description={product.description} />;
      case 'specifications':
        return <ProductSpecifications specifications={product.specifications} />;
      case 'features':
        return <ProductFeatures features={product.features} />;
      case 'installation':
        return (
          <div className="space-y-6">
            <ProductInstallation installation={product.installation} />
            <ProductIncluded included={product.included} />
          </div>
        );
      case 'warranty':
        return <ProductWarranty warranty={product.warranty} />;
      case 'shipping':
        return (
          <ProductShipping
            shipping={product.shipping}
            returns={product.returns}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
      {/* Desktop Horizontal Tab Header (Hidden on Mobile) */}
      <div className="hidden md:flex items-center border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap focus:outline-none ${
                isActive
                  ? 'border-brand-500 text-brand-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Tab Panel Body */}
      <div className="hidden md:block p-6 sm:p-8">
        {renderContent(activeTab)}
      </div>

      {/* Mobile Accordion List (Visible on <768px) */}
      <div className="md:hidden divide-y divide-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isOpen = openAccordions[tab.id];
          return (
            <div key={tab.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion(tab.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 bg-slate-50/60 hover:bg-slate-100 text-left transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  <Icon className="w-4 h-4 text-brand-600" />
                  <span>{tab.label}</span>
                </div>
                <FiChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 bg-white border-t border-slate-100 animate-fadeIn">
                  {renderContent(tab.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTabs;
