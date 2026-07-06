import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary only if variables are available
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary service connected.');
} else {
  console.log('Cloudinary not configured. Defaulting to local file uploads.');
}

/**
 * Uploads a local file to Cloudinary.
 * If Cloudinary is not configured, returns the local static URL.
 * @param {string} localFilePath - Path to file stored on server disk.
 * @returns {Promise<string>} Image URL
 */
export const uploadImage = async (localFilePath) => {
  try {
    if (!localFilePath) return '';

    if (isCloudinaryConfigured) {
      const response = await cloudinary.uploader.upload(localFilePath, {
        folder: 'advocate_portfolio',
      });
      // Delete file from local server disk
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
      return response.secure_url;
    } else {
      // Return relative path for local serving
      // Note: we will make server serve static 'uploads' folder
      const filename = localFilePath.replace(/\\/g, '/').split('/').pop();
      return `/uploads/${filename}`;
    }
  } catch (error) {
    console.error('Upload failed, falling back to local file path:', error);
    const filename = localFilePath.replace(/\\/g, '/').split('/').pop();
    return `/uploads/${filename}`;
  }
};
