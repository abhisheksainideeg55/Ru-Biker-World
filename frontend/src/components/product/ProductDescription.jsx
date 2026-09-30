import React from 'react';

export const ProductDescription = ({ description = '' }) => {
  if (!description) return null;

  const paragraphs = description.split('\n\n').filter(Boolean);

  return (
    <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
      {paragraphs.map((para, idx) => (
        <p key={idx}>{para}</p>
      ))}
    </div>
  );
};

export default ProductDescription;
