/**
 * routes/auth.js
 *
 * Auth routes — thin layer that wires HTTP to controllers.
 *
 * Teacher registration flow:
 *   1. Pre-multer middleware generates the teacherId and stores it on req._teacherId
 *   2. multer reads req._teacherId to save files directly into the correct folder
 *   3. registerUser controller builds the User document and persists everything
 */

import express from 'express';
import { protect }                          from '../middleware/auth.js';
import { uploadTeacherDocs, validateUploadSizes } from '../middleware/upload.js';
import { 
  registerUser, 
  loginUser, 
  getMe,
  verifyEmail,
  resendVerification,
  googleLogin,
  sendLoginOTP,
  verifyLoginOTP,
  forgotPasswordOTP,
  resetPasswordOTP,
  sendRegistrationOtps,
  verifyRegistrationOtps
} from '../controllers/authController.js';

const router = express.Router();

// ── Step 1: generate teacherId BEFORE multer so files land in the right folder ──
const assignTeacherId = (req, res, next) => {
  const ct   = req.headers['content-type'] || '';
  const role = req.query.role || '';          // for multipart the role comes as query param OR body

  // We only need to pre-assign for multipart teacher registrations.
  // For plain-JSON registrations (student, parent) we skip multer entirely.
  if (ct.includes('multipart/form-data')) {
    req._teacherId = `teacher_${Date.now()}`;
    return uploadTeacherDocs(req, res, (err) => {
      if (err) return next(err);
      const sizeValidator = validateUploadSizes({
        doc_degree: 10 * 1024 * 1024,
        doc_id_proof: 10 * 1024 * 1024,
        doc_resume: 10 * 1024 * 1024,
        avatar: 150 * 1024
      });
      sizeValidator(req, res, next);
    });
  }

  next(); // plain JSON — no files
};

// @route   POST /api/auth/register
// @access  Public
router.post('/register', assignTeacherId, registerUser);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', verifyEmail);

// @route   POST /api/auth/resend-verification
// @access  Public
router.post('/resend-verification', resendVerification);

// @route   POST /api/auth/google-login
// @access  Public
router.post('/google-login', googleLogin);

// @route   POST /api/auth/send-login-otp
// @access  Public
router.post('/send-login-otp', sendLoginOTP);

// @route   POST /api/auth/verify-login-otp
// @access  Public
router.post('/verify-login-otp', verifyLoginOTP);

// @route   POST /api/auth/forgot-password-otp
// @access  Public
router.post('/forgot-password-otp', forgotPasswordOTP);

// @route   POST /api/auth/reset-password-otp
// @access  Public
router.post('/reset-password-otp', resetPasswordOTP);

// @route   POST /api/auth/send-registration-otps
// @access  Public
router.post('/send-registration-otps', sendRegistrationOtps);

// @route   POST /api/auth/verify-registration-otps
// @access  Public
router.post('/verify-registration-otps', verifyRegistrationOtps);

// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

export default router;
