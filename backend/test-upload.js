import dotenv from 'dotenv';
import { uploadBufferToCloudinary } from './config/cloudinary.js';

dotenv.config();

const testUpload = async () => {
  try {
    console.log('[Test] Testing Cloudinary connection...');
    console.log('[Test] Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('[Test] API Key:', process.env.CLOUDINARY_API_KEY);

    // Create a 1x1 transparent GIF buffer
    const dummyGifBuffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    console.log('[Test] Uploading 1x1 test buffer to Cloudinary...');
    const result = await uploadBufferToCloudinary(dummyGifBuffer, 'ru_biker_world/tests');
    console.log('[Test] Upload Successful!');
    console.log('[Test] Secure URL:', result.secure_url);
    console.log('[Test] Public ID:', result.public_id);
    process.exit(0);
  } catch (error) {
    console.error('[Test] Upload Failed:', error.message);
    process.exit(1);
  }
};

testUpload();
