/**
 * middleware/upload.js
 *
 * Multer configuration for teacher document uploads.
 *
 * Files are stored at:
 *   backend/uploads/teacher-docs/<teacherId>/<docType>_<timestamp>_<safeFilename>
 *
 * The teacherId MUST be set on req._teacherId BEFORE this middleware runs
 * (the auth route does this by generating the customId first, then calling
 * uploadTeacherDocs as a second step — see routes/auth.js).
 *
 * Accepted fields:
 *   doc_degree            → Academic certificate (PDF/JPG/PNG, max 5 MB)
 *   doc_id_proof          → Government ID (PDF/JPG/PNG, max 5 MB)
 *   doc_experience_letter → Experience letter (PDF/JPG/PNG, max 5 MB, optional)
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { teacherDocDir } from '../utils/paths.js';

const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

// Map field name → human-readable prefix used in the saved filename
const FIELD_PREFIX = {
  doc_degree:            'degree',
  doc_id_proof:          'id_proof',
  doc_experience_letter: 'experience',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // req._teacherId is set by the route handler before multer runs
    const teacherId = req._teacherId || `teacher_${Date.now()}`;
    const dir = teacherDocDir(teacherId);
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const prefix    = FIELD_PREFIX[file.fieldname] || file.fieldname;
    const safeName  = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext       = path.extname(safeName);
    const base      = path.basename(safeName, ext);
    const finalName = `${prefix}_${Date.now()}_${base}${ext}`;
    cb(null, finalName);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(
      `File type "${file.mimetype}" is not allowed. Only PDF, JPG, and PNG are accepted.`
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
  { name: 'doc_experience_letter', maxCount: 1 },
]);
