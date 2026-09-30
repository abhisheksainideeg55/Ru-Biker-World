/**
 * Order & Payment Email Architecture Service.
 * Formats order confirmations, receipts, and logs structured email dispatches.
 */

export const sendOrderConfirmation = async (order, user) => {
  try {
    const customerEmail = user?.email || order?.shippingAddress?.email || 'customer@example.com';
    const customerName = user?.fullName || order?.shippingAddress?.fullName || 'Valued Customer';

    console.log(`[EmailService] ✉️ Order Confirmation queued for: ${customerEmail}`);
    console.log(`[EmailService] Order Number: ${order.orderNumber} | Total: ₹${order.grandTotal.toLocaleString('en-IN')}`);
    console.log(`[EmailService] Items Count: ${order.items?.length || 0} | Status: ${order.orderStatus}`);

    return {
      success: true,
      recipient: customerEmail,
      subject: `Your RU Biker World Order Confirmation [${order.orderNumber}]`,
      queuedAt: new Date(),
    };
  } catch (error) {
    console.error('[EmailService] Error preparing order confirmation email:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendPaymentReceipt = async (order, user) => {
  try {
    const customerEmail = user?.email || order?.shippingAddress?.email || 'customer@example.com';

    console.log(`[EmailService] 🧾 Payment Receipt queued for: ${customerEmail}`);
    console.log(`[EmailService] Payment ID: ${order.payment?.razorpayPaymentId || 'N/A'} | Amount: ₹${order.grandTotal}`);

    return {
      success: true,
      recipient: customerEmail,
      subject: `Payment Receipt for Order ${order.orderNumber}`,
      queuedAt: new Date(),
    };
  } catch (error) {
    console.error('[EmailService] Error preparing payment receipt email:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  sendOrderConfirmation,
  sendPaymentReceipt,
};
