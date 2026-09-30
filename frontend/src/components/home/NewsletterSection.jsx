import React, { useState } from 'react';
import { FiMail, FiCheckCircle, FiAlertCircle, FiArrowRight, FiShield } from 'react-icons/fi';
import Container from '../common/Container';
import Button from '../common/Button';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-14 sm:py-20 bg-surface-950 text-white relative overflow-hidden border-t border-surface-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="narrow" className="relative z-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
          <FiMail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white mb-2">
          Stay Updated With MotoZone
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
          Get new part drops, model compatibility updates, DIY installation guides, and exclusive rider discounts straight to your inbox.
        </p>

        {isSubmitted ? (
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 max-w-md mx-auto animate-fadeIn text-center space-y-2">
            <FiCheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">You're on the MotoZone VIP List!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thank you for subscribing. We've registered your email for priority dispatch alerts and exclusive promo codes.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-[11px] text-brand-400 hover:underline pt-2 inline-block font-semibold"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address"
                  className="w-full bg-surface-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={FiArrowRight}
                iconPosition="right"
                className="py-3 px-6 text-xs sm:text-sm font-black shadow-glow shrink-0"
              >
                Subscribe
              </Button>
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium">
                <FiAlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <FiShield className="w-3.5 h-3.5" />
              <span>Zero spam. Unsubscribe at any time with a single click.</span>
            </div>
          </form>
        )}
      </Container>
    </section>
  );
};

export default NewsletterSection;
