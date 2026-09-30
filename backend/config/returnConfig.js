export const returnConfig = {
  RETURN_WINDOW_DAYS: 7, // Customer can return items up to 7 days after delivery
  RETURN_ALLOWED_STATUSES: ['Delivered', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'],
  CANCELLATION_ALLOWED_STATUSES: ['Pending', 'Confirmed', 'Processing'],
  REFUND_PROCESSING_DAYS: 3,
  MAX_RETURN_IMAGES: 5,
  MAX_IMAGE_SIZE_BYTES: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  RETURN_REASONS: [
    'Damaged in Transit',
    'Wrong Product Delivered',
    'Missing Parts or Hardware',
    'Product Not as Expected',
    'Defective or Malfunctioning',
    'Incompatible with Bike Model',
    'Other',
  ],
  CANCELLATION_REASONS: [
    'Changed my mind',
    'Ordered by mistake',
    'Found a better price elsewhere',
    'Delivery taking too long',
    'Incorrect shipping address or bike model selected',
    'Other',
  ],
};

export default returnConfig;
