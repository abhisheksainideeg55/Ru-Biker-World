/**
 * Tax Service Architecture for calculating GST / Tax Breakdown.
 *
 * @param {Array} cartItems - Items in cart
 * @param {number} subtotal - Subtotal after discounts
 * @param {Object} [address] - Destination address (for future CGST/SGST vs IGST distinction)
 * @returns {Object} Tax calculation result { taxAmount, taxRate, breakdown }
 */
export const calculateTax = (cartItems = [], subtotal = 0, address = null) => {
  if (!subtotal || subtotal <= 0) {
    return {
      taxAmount: 0,
      taxRate: 0.18,
      breakdown: {
        cgst: 0,
        sgst: 0,
        igst: 0,
        type: 'standard_gst',
      },
    };
  }

  // Standard Indian Automobile Spares GST rate: 18% (included or calculated on net taxable amount)
  // Here we calculate 18% GST (9% CGST + 9% SGST or 18% IGST)
  const isInterState = address?.state && address.state.toLowerCase() !== 'maharashtra';
  const taxRate = 0.18; // 18% GST standard
  // To avoid unexpected inflating of prices for customer-facing display if prices are retail inclusive or exclusive,
  // we compute estimated tax cleanly (e.g. standard 18% or nominal ₹0 if inclusive, let's provide calculated tax)
  const taxableAmount = Math.max(0, subtotal);
  const taxAmount = Math.round(taxableAmount * 0.18);

  return {
    taxAmount,
    taxRate,
    breakdown: {
      cgst: isInterState ? 0 : Math.round(taxAmount / 2),
      sgst: isInterState ? 0 : Math.round(taxAmount / 2),
      igst: isInterState ? taxAmount : 0,
      type: isInterState ? 'IGST (18%)' : 'CGST (9%) + SGST (9%)',
    },
  };
};

export default {
  calculateTax,
};
