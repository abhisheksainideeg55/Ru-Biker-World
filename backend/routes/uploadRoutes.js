import express from 'express';
import multer from 'multer';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  if (mime.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, etc.) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter,
});

/**
 * @route   POST /api/upload
 * @desc    Upload single image to Cloudinary
 * @access  Public / Protected
 */
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('[Upload Error]', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please select an image file to upload.',
        });
      }

      const folder = req.body.folder || 'ru_biker_world/products';
      const result = await uploadBufferToCloudinary(req.file.buffer, folder);

      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully to Cloudinary',
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
      });
    } catch (error) {
      console.error('[Cloudinary Upload Exception]', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Cloudinary image upload failed',
      });
    }
  });
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images to Cloudinary (up to 5)
 * @access  Public / Protected
 */
router.post('/multiple', upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one image to upload.' });
    }

    const folder = req.body.folder || 'ru_biker_world/products';
    const uploadPromises = req.files.map((file) => uploadBufferToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: `${results.length} images uploaded successfully to Cloudinary`,
      images: results.map((r) => ({
        url: r.secure_url,
        publicId: r.public_id,
        format: r.format,
      })),
      urls: results.map((r) => r.secure_url),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Multiple images upload failed',
    });
  }
});

export default router;
