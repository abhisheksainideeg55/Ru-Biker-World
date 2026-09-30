import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiCheck, FiSearch } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import Container from '../common/Container';

const countries = [
  { name: 'India', code: 'IN', currency: 'INR ₹' },
  { name: 'Australia', code: 'AU', currency: 'AUD $' },
  { name: 'Austria', code: 'AT', currency: 'EUR €' },
  { name: 'Belgium', code: 'BE', currency: 'EUR €' },
  { name: 'Canada', code: 'CA', currency: 'CAD $' },
  { name: 'Czechia', code: 'CZ', currency: 'CZK Kč' },
  { name: 'Denmark', code: 'DK', currency: 'DKK kr' },
  { name: 'Finland', code: 'FI', currency: 'EUR €' },
  { name: 'France', code: 'FR', currency: 'EUR €' },
  { name: 'Germany', code: 'DE', currency: 'EUR €' },
  { name: 'Hong Kong SAR', code: 'HK', currency: 'HKD $' },
  { name: 'Ireland', code: 'IE', currency: 'EUR €' },
  { name: 'Israel', code: 'IL', currency: 'ILS ₪' },
  { name: 'Italy', code: 'IT', currency: 'EUR €' },
  { name: 'Japan', code: 'JP', currency: 'JPY ¥' },
  { name: 'Malaysia', code: 'MY', currency: 'MYR RM' },
  { name: 'Netherlands', code: 'NL', currency: 'EUR €' },
  { name: 'New Zealand', code: 'NZ', currency: 'NZD $' },
  { name: 'Norway', code: 'NO', currency: 'NOK kr' },
  { name: 'Singapore', code: 'SG', currency: 'SGD $' },
  { name: 'South Africa', code: 'ZA', currency: 'ZAR R' },
  { name: 'Spain', code: 'ES', currency: 'EUR €' },
  { name: 'Sweden', code: 'SE', currency: 'SEK kr' },
  { name: 'Switzerland', code: 'CH', currency: 'CHF CHF' },
  { name: 'United Arab Emirates', code: 'AE', currency: 'AED AED' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP £' },
  { name: 'United States', code: 'US', currency: 'USD $' },
];

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const countryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <footer className="bg-black text-white select-none border-t border-black">
      {/* Main Footer Links & Newsletter Grid */}
      <div className="py-14 lg:py-16">
        <Container size="wide" className="px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Column 1: Office Address */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white tracking-wide">
                Reg office address :
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed font-normal">
                1/1 H siddaiah road , Bangalore - 560002
              </p>
              <p className="text-sm text-gray-300 pt-2 font-normal">
                Email id- <a href="mailto:support@RU BIKER world.co" className="hover:underline">support@RU BIKER world.co</a>
              </p>
            </div>

            {/* Column 2: Information */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white tracking-wide">
                Information
              </h4>
              <ul className="space-y-3 text-sm text-gray-300 font-normal">
                <li>
                  <Link to="/contact" className="hover:underline hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:underline hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="hover:underline hover:text-white transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:underline hover:text-white transition-colors">
                    Terms Of Service
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="hover:underline hover:text-white transition-colors">
                    Return And Replacement
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: About Us */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white tracking-wide">
                About Us
              </h4>
              <ul className="space-y-3 text-sm text-gray-300 font-normal">
                <li>
                  <Link to="/about" className="hover:underline hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:underline hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:underline hover:text-white transition-colors">
                    Terms And Condition
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:underline hover:text-white transition-colors">
                    Shipping Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white tracking-wide">
                Subscribe to our emails
              </h4>
              <p className="text-sm text-gray-300 font-normal leading-relaxed">
                Subscribe to get notified about product launches, special offers and news.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-black border border-white/40 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-black font-semibold text-sm px-7 py-2.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
                {isSubscribed && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Thank you for subscribing to RU BIKER world!
                  </p>
                )}
              </form>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Footer Bar */}
      <div className="pt-8 pb-12 border-t border-white/10">
        <Container size="wide" className="px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Country/region selector & Copyright */}
            <div className="flex flex-col items-start gap-2 relative" ref={countryRef}>
              <span className="text-xs text-gray-400 font-normal">Country/region</span>
              
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className="border border-white/30 rounded-lg px-3.5 py-2 text-xs text-white flex items-center gap-3 cursor-pointer hover:border-white/60 transition-colors bg-black focus:outline-none"
              >
                <span>{selectedCountry.name} | {selectedCountry.currency}</span>
                <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover Menu above button */}
              {isCountryOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-black border border-white/20 rounded-xl shadow-2xl p-2.5 z-50 animate-fadeIn">
                  {/* Search inside popup */}
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      className="w-full bg-black border border-white/30 text-white text-xs px-3 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:border-white"
                      autoFocus
                    />
                  </div>

                  {/* Countries List */}
                  <div className="max-h-56 overflow-y-auto space-y-0.5 scrollbar-thin">
                    {filteredCountries.map((c) => {
                      const isSelected = selectedCountry.code === c.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryOpen(false);
                            setSearchQuery('');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-white/15 text-white font-medium'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span>{c.name}</span>
                          {isSelected && <FiCheck className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 font-normal pt-2">
                © {new Date().getFullYear()}, RU BIKER WORLD
              </p>
            </div>

            {/* Center: Creator Credit */}
            <div className="text-xs text-gray-300 font-normal">
              Made with love by ❤️ <span className="font-semibold text-white">TechMac Digital</span>
            </div>

            {/* Right: Follow Us Social Icons */}
            <div className="flex flex-col items-end gap-3">
              <span className="text-xs text-gray-400 font-normal">Follow Us</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
