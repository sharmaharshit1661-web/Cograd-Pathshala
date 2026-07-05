/**
 * controllers/authController.js
 *
 * Handles all authentication and registration logic,
 * separated from route definitions for cleaner organisation.
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

export const generateToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || 'cograd_pathshala_fallback_secret_key',
    { expiresIn: '30d' }
  );

/** Random temporary password for new teachers */
const makeTempPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
  return Array.from({ length: 10 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

// Maps form field name → document metadata
const DOC_FIELD_MAP = {
  doc_degree:            { type: 'Academic',    label: 'Degree / Qualification Certificate' },
  doc_id_proof:          { type: 'Identity',    label: 'Government ID Proof' },
  doc_resume:            { type: 'Resume',      label: 'Professional Resume / CV' },
};

// ── Controller: Register ──────────────────────────────────────────────────────

export const registerUser = async (req, res) => {
  const { name, email, password, phone, role, ...extraFields } = req.body;

  if (role === 'student' || role === 'parent') {
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least 1 uppercase letter.' });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least 1 lowercase letter.' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least 1 number.' });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least 1 special character.' });
    }
  }

  try {
    // Duplicate check
    const exists = role === 'admin'
      ? await Admin.findOne({ email })
      : await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // The customId was already generated and set on req._teacherId (for teachers)
    // so multer saved files into the correct folder.
    // For other roles generate it now.
    const customId = req._teacherId || (
      role === 'student' ? `stu_${Date.now()}`  :
      role === 'parent'  ? `parent_${Date.now()}` :
      role === 'admin'   ? `admin_${Date.now()}`  :
      `user_${Date.now()}`
    );

    // Password handling
    let finalPassword = password;
    let tempPassword  = null;
    if (role === 'teacher' && !finalPassword) {
      finalPassword = makeTempPassword();
      tempPassword  = finalPassword;
    }

    // Parse stringified arrays for multipart teacher uploads
    if (role === 'teacher') {
      if (typeof extraFields.subjects_taught === 'string') {
        try {
          extraFields.subjects_taught = JSON.parse(extraFields.subjects_taught);
        } catch (e) {
          console.error('Failed to parse subjects_taught:', e);
        }
      }
      if (typeof extraFields.grade_levels_qualified === 'string') {
        try {
          extraFields.grade_levels_qualified = JSON.parse(extraFields.grade_levels_qualified);
        } catch (e) {
          console.error('Failed to parse grade_levels_qualified:', e);
        }
      }
    }

    // Base user data
    const userData = {
      id: customId,
      name,
      email,
      password: finalPassword,
      phone,
      role,
      tempPassword,
      ...extraFields,
    };

    // Normalise cities
    if (userData.city)      userData.city      = userData.city.toLowerCase();
    if (userData.childCity) userData.childCity = userData.childCity.toLowerCase();

    // ── Teacher defaults + uploaded documents ──────────────────────────────
    if (role === 'teacher') {
      userData.verification_status   = 'Pending';
      userData.current_student_count = 0;
      userData.max_student_capacity  = 5;
      userData.rating                = 5.0;
      userData.avatar                = extraFields.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

      // Build documents array from Cloudinary-uploaded files
      // multer-storage-cloudinary sets:
      //   f.path     → permanent Cloudinary CDN URL  (e.g. https://res.cloudinary.com/...)
      //   f.filename → Cloudinary public_id          (used to delete/transform later)
      const uploadedFiles = req.files || {};
      const processedDocs = [];
      let docIndex = 1;

      for (const [fieldName, meta] of Object.entries(DOC_FIELD_MAP)) {
        const fileArr = uploadedFiles[fieldName];
        if (fileArr && fileArr.length > 0) {
          const f = fileArr[0];
          processedDocs.push({
            id:          docIndex++,
            name:        f.originalname,
            type:        meta.type,
            status:      'Under Review',
            fileUrl:     f.path,        // permanent Cloudinary URL ← used by admin to view
            publicId:    f.filename,    // Cloudinary public_id    ← used to delete file
            mimetype:    f.mimetype,
            uploadedAt:  new Date(),
          });
        }
      }

      userData.documents = processedDocs;
    }

    // ── Student defaults ───────────────────────────────────────────────────
    if (role === 'student') {
      userData.status    = extraFields.status || 'pending_match';
      userData.avatar    = extraFields.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
      userData.attendance  = '100%';
      userData.joinDate    = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
      userData.tuitionSlot = extraFields.tuitionSlot || 'Evening (05:00 PM - 06:30 PM)';
      userData.locality    = extraFields.locality || null;

      if (userData.city?.toLowerCase() === 'other') {
        userData.matching_eligible = false;
        userData.status            = 'waitlist';
        userData.test_score        = null;
        userData.test_completed_at = null;
      }
    }

    // ── Parent defaults ────────────────────────────────────────────────────
    if (role === 'parent') {
      userData.status           = extraFields.status || 'pending_match';
      userData.relationship     = extraFields.relationship;

      // If parent linked to an existing student account
      if (extraFields.linkedChildId) {
        userData.linkedChildId = extraFields.linkedChildId;
        // Copy child info from the linked student record
        const linkedStudent = await User.findOne({ id: extraFields.linkedChildId, role: 'student' });
        if (linkedStudent) {
          userData.childName        = linkedStudent.name;
          userData.childStandard    = linkedStudent.standard;
          userData.childSubjects    = linkedStudent.subjects;
          userData.childCity        = linkedStudent.city;
          userData.childLocality    = linkedStudent.locality;
          userData.test_score       = linkedStudent.test_score;
          userData.test_completed_at = linkedStudent.test_completed_at;
          userData.status           = linkedStudent.status || 'pending_match';
          // Update the student's parentPhone and parentName so /parents/children works
          linkedStudent.parentPhone = userData.phone;
          linkedStudent.parentName  = userData.name;
          await linkedStudent.save();
        }
      } else {
        // Manual child entry (no existing student account)
        userData.childName        = extraFields.childName;
        userData.childDob         = extraFields.childDob;
        userData.childStandard    = extraFields.childStandard;
        userData.childSubjects    = extraFields.childSubjects;
        userData.childCity        = extraFields.childCity;
        userData.childLocality    = extraFields.childLocality;
        userData.childTuitionMode = extraFields.childTuitionMode;
      }

      if (userData.childCity?.toLowerCase() === 'other') {
        userData.childMatchingEligible = false;
        userData.status                = 'waitlist';
        userData.test_score            = null;
        userData.test_completed_at     = null;
      }
    }

    const user = role === 'admin'
      ? await Admin.create(userData)
      : await User.create(userData);

    return res.status(201).json({
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });

  } catch (error) {
    console.error('[registerUser]', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `An account with this ${field} already exists.` });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// ── Controller: Login ──────────────────────────────────────────────────────────

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const loginUser = (email || '').trim().toLowerCase();
    if (!loginUser) {
      return res.status(400).json({ message: 'Email or phone number is required.' });
    }

    const isPhone = /^\+?[0-9\s\-()]{10,}$/.test(loginUser) && !loginUser.includes('@');
    let query;
    if (isPhone) {
      query = { phone: loginUser };
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginUser)) {
        return res.status(400).json({ message: 'Please enter a valid email address or phone number.' });
      }
      query = { email: loginUser };
    }

    let user;
    if (role === 'admin') {
      user = await Admin.findOne(query);
    } else if (role) {
      user = await User.findOne(query);
    } else {
      user = await User.findOne(query);
      if (!user) user = await Admin.findOne(query);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/phone or password.' });
    }

    if (user.lock_until && user.lock_until > Date.now()) {
      const mins = Math.ceil((user.lock_until - Date.now()) / 60000);
      return res.status(401).json({
        message: `Account locked. Try again in ${mins} minute(s).`,
      });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      if (role && user.role !== role) {
        return res.status(401).json({ message: `Access denied. You are registered as a ${user.role}.` });
      }
      if (user.role === 'teacher' && user.verification_status !== 'Verified') {
        return res.status(401).json({
          message: 'Your application is pending admin review. Credentials will be sent once approved.',
        });
      }

      user.login_attempts = 0;
      user.lock_until     = null;
      await user.save();

      return res.json({
        token: generateToken(user.id),
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      });
    }

    // Wrong password
    user.login_attempts = (user.login_attempts || 0) + 1;
    let responseMessage = 'Invalid email/phone or password.';
    if (user.login_attempts >= 4) {
      user.lock_until    = Date.now() + 15 * 60 * 1000;
      responseMessage    = 'Account locked for 15 minutes due to too many failed attempts.';
    } else {
      const left = 4 - user.login_attempts;
      responseMessage = `Invalid email/phone or password. ${left} attempt(s) remaining.`;
    }
    await user.save();
    return res.status(401).json({ message: responseMessage });

  } catch (error) {
    console.error('[loginUser]', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// ── Controller: Get current user ───────────────────────────────────────────────

export const getMe = (req, res) => res.json(req.user);
