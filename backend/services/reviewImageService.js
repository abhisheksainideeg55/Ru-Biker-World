/**
 * Review Image Upload and Validation Service
 */

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const validateReviewImages = (images = []) => {
  if (!Array.isArray(images)) {
    return { isValid: false, message: 'Images must be provided as an array.' };
  }

  if (images.length > MAX_IMAGES) {
    return { isValid: false, message: `Maximum ${MAX_IMAGES} images allowed per review.` };
  }

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (typeof img !== 'string') {
      return { isValid: false, message: 'Invalid image format.' };
    }

    // If Base64 data URL
    if (img.startsWith('data:')) {
      const mimeMatch = img.match(/^data:([^;]+);base64,/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1].toLowerCase();
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
          return {
            isValid: false,
            message: `Unsupported image format (${mimeType}). Allowed: JPG, JPEG, PNG, WEBP.`,
          };
        }

        // Check approximate base64 payload size
        const base64Data = img.split(',')[1];
        const approxSize = Math.round((base64Data.length * 3) / 4);
        if (approxSize > MAX_FILE_SIZE_BYTES) {
          return {
            isValid: false,
            message: `Image ${i + 1} exceeds maximum allowed size of 2 MB.`,
          };
        }
      }
    }
  }

  return { isValid: true };
};

export default {
  validateReviewImages,
  MAX_IMAGES,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
};
