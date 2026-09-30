import React, { useState, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Container from '../../components/common/Container';
import { setPageMeta } from '../../utils/seo';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageMeta({
      title: 'Contact Us – RU BIKER WORLD | Customer Support & Inquiries',
      description:
        'Contact RU BIKER WORLD for any questions regarding motorcycle parts, orders, or compatibility. Reach out via email, phone, or WhatsApp.',
      canonical: window.location.origin + '/pages/contact',
    });
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 font-sans">
      <Container size="wide" className="px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto">
        {/* Centered Page Heading matching Screenshot 1 */}
        <div className="pt-8 pb-6 sm:pt-12 sm:pb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-black tracking-tight font-sans">
            Contact Us
          </h1>
        </div>

        {/* Contact Info Intro Section matching Screenshot 1 */}
        <div className="space-y-3 text-sm text-slate-800 mb-12 sm:mb-16">
          <p className="font-normal">
            Email id -{' '}
            <a
              href="mailto:support@rubikerworld.com"
              className="text-slate-800 hover:text-black hover:underline"
            >
              support@rubikerworld.com
            </a>
          </p>
          <p className="font-normal">
            Whatsapp -{' '}
            <a
              href="https://wa.me/918105003848"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 hover:text-black hover:underline"
            >
              +91 8105003848
            </a>
          </p>
          <p className="font-normal">
            Working hours - Monday to Saturday ( 11am - 7pm )
          </p>
        </div>

        {/* 2-Column Form & GET IN TOUCH Section matching Screenshot 1 & 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center sm:text-left">
                <div className="flex items-center gap-3 text-emerald-800 font-bold mb-2">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Message Sent Successfully!</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Thank you for contacting RU BIKER WORLD. One of our support executives will reach out to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', comment: '' });
                  }}
                  className="mt-4 text-xs font-bold text-slate-900 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Name"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email *"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Phone number */}
                <div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>

                {/* Row 3: Comment */}
                <div>
                  <textarea
                    rows={5}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Comment"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>

                {/* Send Button matching Screenshot 2 */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#121212] hover:bg-black text-white text-sm font-semibold px-9 py-3 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: GET IN TOUCH matching Screenshot 1 & 2 */}
          <div className="lg:col-span-5 space-y-4 pt-1">
            <h2 className="text-base sm:text-lg font-bold text-black uppercase tracking-wide">
              GET IN TOUCH
            </h2>

            <div className="space-y-3.5 text-sm text-slate-800">
              <p className="font-normal">
                Email id -{' '}
                <a
                  href="mailto:support@rubikerworld.com"
                  className="text-slate-800 hover:text-black hover:underline"
                >
                  support@rubikerworld.com
                </a>
              </p>

              <p className="font-normal">
                Contact number -{' '}
                <a
                  href="tel:+918105003848"
                  className="text-slate-800 hover:text-black hover:underline"
                >
                  +91 8105003848
                </a>
              </p>

              <p className="font-normal">
                Working hours - Monday to Saturday ( 11am - 7pm )
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
