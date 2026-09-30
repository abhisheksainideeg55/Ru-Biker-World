// Utility helpers
export const formatCurrency = (amount, currency = '₹') => {
  return `${currency}${Number(amount || 0).toLocaleString('en-IN')}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
