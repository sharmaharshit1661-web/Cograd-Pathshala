import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Uploads root: backend/uploads/teacher-docs/<teacherId>/
const UPLOAD_ROOT = path.join(__dirname, '../../uploads/teacher-docs');

// Ensure the root folder exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use timestamp-based temp folder; we'll rename after we get the teacher ID
    const tempDir = path.join(UPLOAD_ROOT, `temp_${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    req._uploadDir = tempDir;   // stash for use in the route
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName   = `${Date.now()}_${safeOriginal}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}. Only PDF, JPG and PNG are accepted.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});

// Middleware: accept up to 3 named document fields
export const uploadTeacherDocs = upload.fields([
  { name: 'doc_degree',            maxCount: 1 },
  { name: 'doc_id_proof',          maxCount: 1 },
  { name: 'doc_experience_letter', maxCount: 1 },
]);

export { UPLOAD_ROOT };
