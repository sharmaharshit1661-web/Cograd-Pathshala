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

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key    : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET,
  secure     : true,   // always use https URLs
});

export default cloudinary;
