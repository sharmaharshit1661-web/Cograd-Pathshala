/**
 * paths.js — single source of truth for all filesystem paths in the backend.
 *
 * Directory layout (relative to repo root):
 *
 *   backend/
 *   ├── src/
 *   │   ├── config/        DB connection
 *   │   ├── controllers/   Route handler logic (separated from route definitions)
 *   │   ├── middleware/     Express middleware (auth, upload)
 *   │   ├── models/        Mongoose schemas
 *   │   ├── routes/        Express routers
 *   │   └── utils/         Shared helpers  ← you are here
 *   └── uploads/           Static files served at  GET /uploads/*
 *       └── teacher-docs/
 *           └── <teacherId>/
 *               ├── degree_<timestamp>_<filename>
 *               ├── id_proof_<timestamp>_<filename>
 *               └── experience_<timestamp>_<filename>
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// backend/  (two levels up from src/utils/)
export const BACKEND_ROOT = path.resolve(__dirname, '../../');

// backend/uploads/
export const UPLOADS_ROOT = path.join(BACKEND_ROOT, 'uploads');

// backend/uploads/teacher-docs/
export const TEACHER_DOCS_ROOT = path.join(UPLOADS_ROOT, 'teacher-docs');

/**
 * Returns the absolute path for a specific teacher's document folder.
 * Creates the directory if it does not yet exist.
 * @param {string} teacherId  e.g. "teacher_1782981991771"
 */
export const teacherDocDir = (teacherId) => {
  const dir = path.join(TEACHER_DOCS_ROOT, teacherId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

/**
 * Converts an absolute file path to the URL path served by Express
 * e.g. /abs/path/backend/uploads/teacher-docs/t1/file.pdf
 *      → "uploads/teacher-docs/t1/file.pdf"
 */
export const toRelativeUploadPath = (absolutePath) =>
  path.relative(BACKEND_ROOT, absolutePath).replace(/\\/g, '/');
