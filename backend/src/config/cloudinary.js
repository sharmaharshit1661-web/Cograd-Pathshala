/**
 * config/cloudinary.js
 *
 * Cloudinary SDK configuration.
 * Credentials are loaded from environment variables — never hardcode them.
 *
 * Required env vars (set in backend/.env and on Render dashboard):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

// If CLOUDINARY_URL is defined, Cloudinary SDK automatically configures itself.
// Otherwise, fall back to individual environment variables.
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key    : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
    secure     : true,   // always use https URLs
  });
} else {
  // Ensure secure option is active even when loading via CLOUDINARY_URL
  cloudinary.config({
    secure: true
  });
}

export default cloudinary;
