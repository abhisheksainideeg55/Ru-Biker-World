import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export const BlogSearch = ({ value = '', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Debounce search by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <FiSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search maintenance guides, riding gear, oil comparisons..."
        className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-2xs"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default BlogSearch;
