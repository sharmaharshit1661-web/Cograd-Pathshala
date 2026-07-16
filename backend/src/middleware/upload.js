/**
 * middleware/upload.js
 *
 * Multer + Cloudinary storage for teacher document uploads.
 *
 * Files are uploaded directly to Cloudinary under the folder:
 *   cograd-pathshala/teacher-docs/<teacherId>/
 *
 * Each uploaded file gets a permanent, CDN-backed URL stored in MongoDB.
 * This means documents survive server restarts and Render redeployments.
 *
 * req._teacherId MUST be set on the request BEFORE this middleware runs.
 *
 * Accepted fields:
 *   doc_degree            → Academic certificate  (PDF/JPG/PNG, max 5 MB)
 *   doc_id_proof          → Government ID         (PDF/JPG/PNG, max 5 MB)
 *   doc_experience_letter → Experience letter      (PDF/JPG/PNG, max 5 MB, optional)
 */

import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Map field name → descriptive prefix used in the Cloudinary public_id
const FIELD_PREFIX = {
  doc_degree:            'degree',
  doc_id_proof:          'id_proof',
  doc_resume:            'resume',
  avatar:                'avatar',
};

const ALLOWED_DOC_FORMATS = ['pdf', 'jpg', 'jpeg', 'png'];
const ALLOWED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const teacherId = req._teacherId || `teacher_${Date.now()}`;
    const prefix    = FIELD_PREFIX[file.fieldname] || file.fieldname;
    const ext       = path.extname(file.originalname).toLowerCase();
    const safeName  = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9._-]/g, '_'); // sanitise

    const isPdf = file.mimetype === 'application/pdf' || ext === '.pdf';
    const isVideo = file.fieldname === 'demo_video' || file.mimetype.startsWith('video/');

    if (isVideo) {
      return {
        folder        : `cograd-pathshala/teacher-docs/${teacherId}`,
        public_id     : `${prefix}_${Date.now()}_${safeName}`,
        resource_type : 'video',
        allowed_formats: ALLOWED_VIDEO_FORMATS
      };
    }

    return {
      folder        : `cograd-pathshala/teacher-docs/${teacherId}`,
      public_id     : `${prefix}_${Date.now()}_${safeName}`,
      resource_type : 'image', // Force 'image' resource type to allow public PDF delivery without 401
      ...(isPdf ? {
        format: 'pdf',
        allowed_formats: ['pdf']
      } : {
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ quality: 'auto' }],
      })
    };
  },
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop().toLowerCase();
  const isVideoField = file.fieldname === 'demo_video';

  if (isVideoField) {
    if (ALLOWED_VIDEO_FORMATS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(
        `File type ".${ext}" is not allowed for videos. Only MP4, MOV, AVI, MKV, and WEBM are accepted.`
      ));
    }
  } else {
    if (ALLOWED_DOC_FORMATS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(
        `File type ".${ext}" is not allowed. Only PDF, JPG, and PNG are accepted.`
      ));
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max limit to allow video
});

export const validateUploadSizes = (fields) => {
  return (req, res, next) => {
    const files = req.files || {};
    if (req.file) {
      const file = req.file;
      const maxBytes = fields[file.fieldname];
      if (maxBytes && file.size > maxBytes) {
        const limitLabel = maxBytes >= 1024 * 1024 
          ? `${maxBytes / (1024 * 1024)} MB` 
          : `${maxBytes / 1024} KB`;
        return res.status(400).json({ 
          message: `File upload failed: Field "${file.fieldname}" exceeds the size limit of ${limitLabel}.` 
        });
      }
    }
    for (const [fieldName, maxBytes] of Object.entries(fields)) {
      if (files[fieldName] && files[fieldName][0]) {
        const file = files[fieldName][0];
        if (file.size > maxBytes) {
          const limitLabel = maxBytes >= 1024 * 1024 
            ? `${maxBytes / (1024 * 1024)} MB` 
            : `${maxBytes / 1024} KB`;
          return res.status(400).json({ 
            message: `File upload failed: Field "${fieldName}" exceeds the size limit of ${limitLabel}.` 
          });
        }
      }
    }
    next();
  };
};

export const uploadTeacherDocs = upload.fields([
  { name: 'doc_degree',            maxCount: 1 },
  { name: 'doc_id_proof',          maxCount: 1 },
  { name: 'doc_resume',            maxCount: 1 },
  { name: 'avatar',                maxCount: 1 },
]);

export const uploadIdentityDocs = upload.fields([
  { name: 'selfie',                maxCount: 1 },
  { name: 'doc_aadhaar',           maxCount: 1 },
  { name: 'doc_pan',               maxCount: 1 },
]);

export const uploadQualificationDocs = upload.fields([
  { name: 'doc_degree',            maxCount: 1 },
  { name: 'doc_professional',      maxCount: 1 },
]);

export const uploadDemoVideo = upload.fields([
  { name: 'demo_video',            maxCount: 1 },
]);
