import React from 'react';

export const ProductSpecifications = ({ specifications = {} }) => {
  if (!specifications || Object.keys(specifications).length === 0) return null;

  const entries = Object.entries(specifications);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-left text-xs sm:text-sm">
        <tbody className="divide-y divide-slate-200">
          {entries.map(([key, value], idx) => (
            <tr
              key={key}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
            >
              <td className="py-3 px-4 font-bold text-slate-900 w-1/3 sm:w-1/4">
                {key}
              </td>
              <td className="py-3 px-4 text-slate-700 font-medium">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSpecifications;
