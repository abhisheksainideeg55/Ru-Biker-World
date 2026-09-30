import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import SearchSuggestions from './SearchSuggestions';

const DEFAULT_TYPING_PHRASES = [
  'Search For NGK Iridium Spark Plug',
  'Search For Red Roos',
  'Search For Brembo Brake Pads',
  'Search For Rolon Chain Kit',
  'Search For Royal Enfield Accessories',
  'Search For Motul 7100 Engine Oil',
  'Search For Crash Guards',
  'Search For HJG Fog Lights',
];

export const SearchBar = ({
  className = '',
  placeholder,
  id = 'main-search-bar',
  phrases = DEFAULT_TYPING_PHRASES,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Dynamic Typing Effect State
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState(placeholder || phrases[0] || 'Search...');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Typing Effect Animation Loop
  useEffect(() => {
    if (placeholder) {
      setDisplayedPlaceholder(placeholder);
      return;
    }

    // Pause typing effect if input is actively being typed in
    if (query.length > 0) {
      return;
    }

    const currentPhrase = phrases[phraseIndex % phrases.length];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing whole phrase, pause before deleting
      typingSpeed = 2200;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, pause before starting next word
      typingSpeed = 400;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setDisplayedPlaceholder(currentPhrase.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedPlaceholder(currentPhrase.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, phrases, placeholder, query]);

  // Keyboard navigation & ESC key handler
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit(query);
    }
  };

  const handleSearchSubmit = (searchTerm) => {
    const target = searchTerm || query;
    if (!target.trim()) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(target.trim())}`);
  };

  const handleSelectSuggestion = (text) => {
    setQuery(text);
    handleSearchSubmit(text);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <label htmlFor={id} className="sr-only">Search motorcycle parts and brands</label>

        {/* Left Magnifying Glass in Brand Racing Red */}
        <div className="absolute left-4 text-[#c81e2b] pointer-events-none flex items-center justify-center">
          <FiSearch className="w-5 h-5 text-[#c81e2b]" />
        </div>

        {/* Search Input with Dynamic Animated Typing Placeholder */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={displayedPlaceholder}
          aria-expanded={isOpen}
          aria-controls="search-suggestions-menu"
          aria-autocomplete="list"
          className="w-full bg-white text-slate-800 placeholder:text-slate-500 text-sm md:text-[15px] font-medium rounded-full pl-12 pr-10 py-2.5 shadow-none border border-slate-300/80 focus:outline-none focus:border-[#c81e2b] focus:ring-1 focus:ring-[#c81e2b] transition-all duration-200"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-full hover:bg-slate-100"
            aria-label="Clear search input"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <SearchSuggestions
          query={query}
          onSelectSuggestion={handleSelectSuggestion}
          onViewAll={(term) => handleSearchSubmit(term)}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
