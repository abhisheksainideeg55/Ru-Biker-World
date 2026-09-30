import React from 'react';

export const BlogCategories = ({ categories = [], selectedCategory = 'All', onSelectCategory }) => {
  const allCategories = [{ name: 'All' }, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none ${
              isSelected
                ? 'bg-slate-900 text-amber-400 shadow-sm font-black'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{cat.name}</span>
            {cat.count !== undefined && (
              <span className={`ml-1.5 text-[10px] ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                ({cat.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BlogCategories;
