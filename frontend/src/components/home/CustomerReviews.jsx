import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import {
  FiCheckCircle,
  FiPackage,
  FiShoppingBag,
  FiCreditCard,
  FiFlag,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import Container from '../common/Container';
import { sparifyReviews, customerMediaGallery, trustBadges } from '../../data/homeReviews';

export const CustomerReviews = () => {
  const [expandedFaq, setExpandedFaq] = useState(0);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqList = [
    {
      id: 'lifestyle',
      title: 'RU BIKER WORLD - Enhancing Your Motorcycle Lifestyle',
      content:
        "Welcome to RU BIKER WORLD, your one-stop shop for bike spare parts and accessories that match your unique riding style. Our collection is packed with trendy and top-quality products that will take your motorcycle experience to the next level. Whether you're looking for performance parts or stylish add-ons, we've got you covered at affordable prices. Let your bike reflect your personal style and ride with confidence, knowing that RU BIKER WORLD has everything you need. Get ready to unleash the full potential of your ride and make it truly yours.",
    },
    {
      id: 'different',
      title: "How's RU BIKER WORLD is different?",
      content:
        'At RU BIKER WORLD, we have a team of passionate experts who are deeply ingrained in the motorcycle industry. With their in-depth knowledge and understanding of bikes, they precisely know what is best for your ride. Our experts stay updated with the latest trends and advancements in the industry, ensuring that we offer you the most relevant and high-quality spare parts and accessories for your motorcycle. We are committed to providing the best customer experience possible. Our team of motorcycle enthusiasts goes the extra mile to assist you in making well-informed decisions. Whether you need technical advice, recommendations for the perfect part, or help with installation, our experts are dedicated to delivering personalized support and guidance. We believe in building long-lasting relationships with our customers by providing exceptional service and ensuring their satisfaction. Choose RU BIKER WORLD for a brand that not only offers premium motorcycle spare parts and accessories but also has a team of experts who are passionate about motorcycles and committed to providing you with the best customer experience. Trust us to provide you with reliable advice and top-notch products that enhance your riding journey. Experience the expertise and dedication of RU BIKER WORLD as we cater to your motorcycle needs.',
    },
    {
      id: 'find',
      title: 'What Can You Find on RU BIKER WORLD?',
      content:
        "Discover a wide range of premium spare parts and accessories at RU BIKER WORLD, designed to enhance your motorcycle experience. We offer an extensive selection of reliable and high-quality products that you won't find elsewhere. Brake System - Find top-notch brake components to ensure optimal stopping power and safety on the road. Chain Sprocket - Upgrade your motorcycle's drivetrain with durable and efficient chain sprockets for smooth performance. Crash Guards - Protect your bike from unforeseen accidents with sturdy crash guards that provide added safety and security. Riding Gloves - Stay comfortable and protected during your rides with our range of riding gloves designed for maximum grip and durability. Auxiliary Lights - Illuminate the road ahead with powerful auxiliary lights that enhance visibility in challenging conditions. Handlebar Kits - Customize your motorcycle's handlebar setup with our selection of handlebar kits, allowing for a personalized and ergonomic riding position. Mirrors - Choose from a variety of mirrors that offer clear rearward visibility and add a stylish touch to your bike's aesthetics. Electrical Parts - Find essential electrical components and accessories to ensure reliable performance and functionality. At RU BIKER WORLD, we make shopping for spare parts and accessories easy with our user-friendly interface. Our website provides various filtering and sorting options, allowing you to quickly find the specific products you need. You can filter by category, brand, price range, compatibility, and more, ensuring a seamless and convenient shopping experience. Rest assured, shopping on RU BIKER WORLD is safe and reliable. We prioritize quality and authenticity, offering genuine products from trusted manufacturers. Our spare parts and accessories are carefully selected and tested to meet the highest standards of performance and durability. When you're in search of premium bike spare parts and accessories, think RU BIKER WORLD. We are committed to providing you with the best products and an exceptional shopping experience. Ride with confidence and elevate your motorcycle to new heights with RU BIKER WORLD.",
    },
    {
      id: 'assurance',
      title: 'The RU BIKER WORLD Assurance',
      content:
        "At RU BIKER WORLD, we prioritize your satisfaction and aim to provide you with a delightful shopping experience. Here's how we cater to your expectations: Convenient Returns - If you're unsure about your purchase, we offer an easy 7-day return policy. Simply return or replace your RU BIKER WORLD order within 7 days through a hassle-free process. Quality Assurance - We guarantee the authenticity and quality of our products. RU BIKER WORLD ensures that all spare parts and accessories meet the highest standards, providing you with 100% certified and reliable items. Secure Delivery - We prioritize the safe and timely delivery of your orders. RU BIKER WORLD packages your items in secure, tamper-evident packaging and provides free and insured delivery. Multiple Payment Options - We offer convenient payment options to suit your preferences. Choose from Cash on Delivery (COD) service all over India or Card on Delivery in select locations. At RU BIKER WORLD, you can complete your purchase without any hesitation. When you think of premium spare parts and accessories, think RU BIKER WORLD. We are committed to providing you with trendy and high-quality products, accompanied by excellent service. Trust RU BIKER WORLD to meet your motorcycle needs and elevate your riding experience.",
    },
  ];

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'package':
        return <FiPackage className="w-8 h-8 text-neutral-800 stroke-[1.8]" />;
      case 'bag':
        return <FiShoppingBag className="w-8 h-8 text-neutral-800 stroke-[1.8]" />;
      case 'card':
        return <FiCreditCard className="w-8 h-8 text-neutral-800 stroke-[1.8]" />;
      case 'flag':
        return <FiFlag className="w-8 h-8 text-neutral-800 stroke-[1.8]" />;
      default:
        return <FiPackage className="w-8 h-8 text-neutral-800 stroke-[1.8]" />;
    }
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Customer Raving Experience Section */}
      <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 bg-white border-b border-slate-100">
        <Container size="wide">
          {/* Section Main Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight font-sans">
              Customers can't stop raving about their &quot;RU BIKER WORLD&quot; experience
            </h2>
          </div>

          {/* Main 2-Column Section Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer Media Collage (Exact 3-tier mosaic from screenshot) */}
            <div className="lg:col-span-6 flex flex-col gap-1.5 rounded-lg overflow-hidden bg-white shadow-xs border border-slate-200/80 p-1.5">
              {/* Row 1: 2 photos */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="relative aspect-4/3 overflow-hidden rounded-xs bg-slate-100 group">
                  <img
                    src="/customer2.webp"
                    alt="Biker in helmet with parcel"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-4/3 overflow-hidden rounded-xs bg-slate-100 group">
                  <img
                    src="/customer3.webp"
                    alt="Happy customer with parcel on Royal Enfield tank"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Row 2: 3 photos */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="relative aspect-square overflow-hidden rounded-xs bg-slate-100 group">
                  <img
                    src="/customer7.webp"
                    alt="Motorcycle wheel and exhaust"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-xs bg-slate-100 group">
                  <img
                    src="/71jm5ICjmoL.jpg"
                    alt="Lady rider smiling next to KTM Duke"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-xs bg-slate-100 group">
                  <img
                    src="/2DB7D2DC-9C82-4ACC-80D6-FCAC8AD10A8F.jpg"
                    alt="Rider in helmet and balaclava"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Row 3: 2 photos */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="relative aspect-4/3 overflow-hidden rounded-xs bg-slate-100 group">
                  <img
                    src="/customer4.webp"
                    alt="Young rider video testimonial"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative aspect-4/3 overflow-hidden rounded-xs bg-slate-100 group">
                  <img
                    src="/customer6.webp"
                    alt="Customer unboxing product package"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: 2-Column Testimonials Grid */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {sparifyReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border-2 border-[#1E60F2] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300 min-h-[160px] sm:min-h-[175px]"
                  >
                    <div>
                      {/* 5 Golden Stars */}
                      <div className="flex items-center gap-1 text-[#F59E0B] text-sm mb-3">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-[13px] text-[#222222] font-normal leading-relaxed line-clamp-4">
                        {rev.reviewText}
                      </p>
                    </div>

                    {/* Customer Name & Verified Badge */}
                    <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                      <span className="font-bold text-xs sm:text-sm text-[#111111]">
                        {rev.name}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E60F2]">
                          <FiCheckCircle className="w-3.5 h-3.5 fill-[#1E60F2] text-white" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shop Now Action Button */}
              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-3 bg-black text-white text-sm font-bold rounded-full shadow-sm hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Value Proposition / Trust Features Strip */}
      <section className="py-10 bg-white border-b border-slate-200/80">
        <Container size="wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.id} className="flex items-start gap-4">
                <div className="shrink-0 p-1">{getBadgeIcon(badge.icon)}</div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#111111] mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs sm:text-xs text-slate-600 leading-relaxed font-normal">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Accordions: RU BIKER world Lifestyle, Difference, What You Can Find & RU BIKER world Assurance */}
      <section className="py-8 bg-white border-b border-slate-200/60">
        <Container size="wide">
          <div className="space-y-4">
            {faqList.map((item, index) => (
              <div
                key={item.id}
                className="border-b border-slate-200/80 pb-4 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full py-2 flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#111111]  transition-colors cursor-pointer"
                >
                  <span className="font-bold">{item.title}</span>
                  {expandedFaq === index ? (
                    <FiChevronUp className="w-5 h-5 text-slate-700 shrink-0 ml-4" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-slate-700 shrink-0 ml-4" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CustomerReviews;
