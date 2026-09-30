import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import { setPageMeta } from '../../utils/seo';

const faqsData = [
  {
    category: 'General',
    items: [
      {
        id: 'general-1',
        question: "Didn't find the product you are looking for ?",
        answer: (
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              For availability and further details, reach out to our customer support team on WhatsApp at{' '}
              <a
                href="https://wa.me/918105003848"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                +91 8105003848
              </a>
              . Our team is ready to assist you with all your queries promptly. Contact us today!
            </p>
            <p>
              Additionally, explore our wide range of products on our website{' '}
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                www.RU BIKER world.co
              </Link>
              . You can shop by spare parts, accessories, or bike categories to find exactly what you need.
            </p>
          </div>
        ),
      },
      {
        id: 'general-2',
        question: 'How long will you take to dispatch it after confirmation of order ?',
        answer: (
          <p className="text-sm text-slate-700 leading-relaxed">
            It usually takes 24-48 working hours for a product to be dispatched from our warehouse. We always strive to process your orders for dispatch as quickly as possible.
          </p>
        ),
      },
      {
        id: 'general-3',
        question: 'Do you stock all original spare parts and accessories for motorcycles?',
        answer: (
          <p className="text-sm text-slate-700 leading-relaxed">
            Yes, we maintain a comprehensive inventory that includes OEM (Original Equipment Manufacturer), OES (Original Equipment Supplier), aftermarket, and imported categories of spare parts and accessories. Detailed information for each product is clearly mentioned in the product's description on our website. Please be assured, we do not sell used or refurbished products.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Returns',
    items: [
      {
        id: 'returns-1',
        question: 'What are the conditions under which I can return a product?',
        answer: (
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              You can return products if they are damaged in transit, the wrong item was delivered, or if there are product compatibility issues. Please report damaged or incorrect products within 2 days, and initiate other returns within 7 days of delivery. For more details about RU BIKER world's return and exchange policy, click on the link below:
            </p>
            <p>
              <Link to="/returns" className="text-blue-600 hover:underline font-medium">
                Return and Exchange Policy
              </Link>
            </p>
          </div>
        ),
      },
      {
        id: 'returns-2',
        question: 'How will my refund be processed if I return a product?',
        answer: (
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              If the product arrives damaged or the wrong item is delivered, you are entitled to a full refund. For cases where you change your mind or no longer want the product, refunds will be processed after deducting logistic charges based on the original order value:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Orders below ₹500: ₹100 deduction</li>
              <li>Orders between ₹501 - ₹999: ₹140 deduction</li>
              <li>Orders between ₹1,000 - ₹5,000: ₹200 deduction</li>
              <li>Orders between ₹5,001 - ₹15,000: ₹300 deduction</li>
              <li>Orders between ₹15,001 - ₹25,000: ₹700 deduction</li>
            </ul>
            <p>
              All refunds will be issued to the original method of payment. For cash on delivery (COD) orders, your bank details will be required to process the refund.
            </p>
          </div>
        ),
      },
      {
        id: 'returns-3',
        question: 'What should I know about exchanging a product?',
        answer: (
          <p className="text-sm text-slate-700 leading-relaxed">
            You can request an exchange within 7 days of delivery, subject to product availability. Items must be returned in their original condition and packaging. Please contact our customer support for assistance with exchanges.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Shipping',
    items: [
      {
        id: 'shipping-1',
        question: 'How do you ship the orders ?',
        answer: (
          <p className="text-sm text-slate-700 leading-relaxed">
            At RU BIKER world, we ensure your orders reach you safely and promptly by partnering with highly reliable couriers like Delhivery, Ekart, Shiprocket, Amazon Shipping, Blue Dart, Ecom Express, and XpressBees. Shop with confidence, knowing your products are in trusted hands.
          </p>
        ),
      },
      {
        id: 'shipping-2',
        question: 'How long will it take to get my order delivered ?',
        answer: (
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              After successfully placing your order, delivery takes between 2-6 working days, depending on your location:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Metro cities: 2-4 days</li>
              <li>Other parts of India: 3-6 days</li>
              <li>North East and J&K: 4-7 days</li>
            </ul>
            <p className="font-medium text-slate-800">
              Note: 24-hour delivery is available in select pin codes in Bangalore on pre-request (applicable on limited SKUs only).
            </p>
          </div>
        ),
      },
      {
        id: 'shipping-3',
        question: 'How can i track my order ?',
        answer: (
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>To track your order, click on the link below:</p>
            <p>
              <Link to="/track-order" className="text-blue-600 hover:underline font-medium">
                Track Your Order
              </Link>
            </p>
            <p>
              Your tracking information will also be shared via WhatsApp and email. If you encounter any issues, feel free to reach out to our customer support team on WhatsApp. Our agents are happy to assist you.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              <strong>Note:</strong> RU BIKER world never solicits or requests financial information such as bank account numbers, credit/debit card details, UPI IDs, or OTPs from customers over the phone. We strongly advise you not to disclose such information to anyone claiming to represent our company.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you become aware of any fraudulent activity on your account, we recommend that you contact your bank or financial institution immediately to report the incident and take appropriate action to safeguard your account.
            </p>
          </div>
        ),
      },
      {
        id: 'shipping-4',
        question: 'Do you ship all over India?',
        answer: (
          <p className="text-sm text-slate-700 leading-relaxed">
            Yes, we ship to over 35,000 pin codes across India. No matter which town or village you stay in, we are happy to deliver your products. Shop now at{' '}
            <Link to="/" className="text-blue-600 hover:underline font-medium">
              www.RU BIKER world.co
            </Link>
            .
          </p>
        ),
      },
    ],
  },
];

export const FaqPage = () => {
  const [openItems, setOpenItems] = useState({
    'general-1': true,
    'general-2': true,
    'general-3': true,
    'returns-1': true,
    'returns-2': true,
    'returns-3': true,
    'shipping-1': true,
    'shipping-2': true,
    'shipping-3': true,
    'shipping-4': true,
  });

  useEffect(() => {
    setPageMeta({
      title: 'Frequently Asked Questions – RU BIKER world | FAQ & Help',
      description:
        'Find answers to all frequently asked questions about RU BIKER world bike parts, dispatch times, 7-day returns, refund policy, courier partners, and tracking.',
      canonical: window.location.origin + '/pages/faqs',
    });
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 font-sans">
      <Container size="wide" className="px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto">
        {/* Centered Page Heading matching Screenshot */}
        <div className="pt-8 pb-8 sm:pt-12 sm:pb-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-sans">
            Frequently Asked Questions
          </h1>
        </div>

        {/* Categories Section - Clean without extra search bars or boxes */}
        <div className="space-y-12">
          {faqsData.map((group) => (
            <div key={group.category} className="space-y-4">
              {/* Category Title (General, Returns, Shipping) */}
              <h2 className="text-xl sm:text-2xl font-bold text-black font-sans tracking-tight mb-4">
                {group.category}
              </h2>

              {/* Accordion Questions List */}
              <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                {group.items.map((item) => {
                  const isOpen = Boolean(openItems[item.id]);

                  return (
                    <div key={item.id} className="py-4 sm:py-5">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none cursor-pointer"
                      >
                        <span className="text-[14px] sm:text-[15px] font-bold text-black tracking-tight group-hover:text-slate-700 transition-colors">
                          {item.question}
                        </span>
                        <FiChevronDown
                          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-black' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="mt-3 pt-1 animate-fadeIn">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default FaqPage;
