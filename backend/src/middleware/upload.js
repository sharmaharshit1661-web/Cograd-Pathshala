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
};

const ALLOWED_FORMATS = ['pdf', 'jpg', 'jpeg', 'png'];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const teacherId = req._teacherId || `teacher_${Date.now()}`;
    const prefix    = FIELD_PREFIX[file.fieldname] || file.fieldname;
    const ext       = path.extname(file.originalname).toLowerCase();
    const safeName  = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9._-]/g, '_'); // sanitise

    const isPdf = file.mimetype === 'application/pdf' || ext === '.pdf';

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
  if (ALLOWED_FORMATS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(
      `File type ".${ext}" is not allowed. Only PDF, JPG, and PNG are accepted.`
    ));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});

export const uploadTeacherDocs = upload.fields([
  { name: 'doc_degree',            maxCount: 1 },
  { name: 'doc_id_proof',          maxCount: 1 },
  { name: 'doc_resume',            maxCount: 1 },
]);
