import dotenv from 'dotenv';
import cloudinary from './config/cloudinary.js';

dotenv.config();

const testBase64Upload = async () => {
  try {
    const dummyBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    console.log('[Testing] Uploading base64 to Cloudinary...');
    const res = await cloudinary.uploader.upload(dummyBase64, {
      folder: 'ru_biker_world/products',
    });
    console.log('[Success] Base64 upload worked! Secure URL:', res.secure_url);
    process.exit(0);
  } catch (err) {
    console.error('[Error] Base64 upload failed:', err.message);
    process.exit(1);
  }
};

testBase64Upload();
