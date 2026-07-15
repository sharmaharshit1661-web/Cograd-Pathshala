/**
 * controllers/authController.js
 *
 * Handles all authentication and registration logic,
 * separated from route definitions for cleaner organisation.
 */

import jwt from 'jsonwebtoken';
import Student from '../models/student/Student.js';
import Teacher from '../models/teacher/Teacher.js';
import Parent from '../models/parent/Parent.js';
import Admin from '../models/Admin.js';
import { sendSMS } from '../utils/sms.js';
import TempOtp from '../models/TempOtp.js';

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

const sendVerificationEmail = async (name, email, code) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); background-color: #ffffff;">
      <h2 style="color: #2563eb; font-weight: 800; margin-bottom: 20px; text-align: center;">Verify Your Email Address</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for registering with Cograd Pathshala. Please verify your email address by entering the following 6-digit verification code:</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; font-family: monospace; border: 1px solid #e2e8f0; margin: 25px 0; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">
        ${code}
      </div>
      <p style="text-align: center; color: #64748b; font-size: 13px;">This code will expire in 15 minutes.</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center;">Best regards,<br/>Cograd Pathshala Team</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_VcRTuqUC_4KVDYJK1FujUzyziyPx4bsyv'}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: `Verify Your Email - Cograd Pathshala`,
        html: htmlContent
      })
    });
    const result = await response.json();
    console.log('Verification email sent via Resend:', result);
  } catch (err) {
    console.error('Failed to send verification email via Resend:', err);
  }
};

const sendOnboardingTeacherCredentialsEmail = async (name, email, password) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://cograd-pathshala-frontend.vercel.app';
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 12px; background-color: #fff;">
      <h2 style="color: #2563eb; font-weight: 800; margin-bottom: 20px; text-align: center;">Welcome to Cograd Pathshala!</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your registration as a teacher has been successfully received. To complete your joining verification, please log in and follow the onboarding steps (Identity checks, Competency quiz, and Demo video upload).</p>
      <p>Here are your temporary login credentials:</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-family: monospace; border: 1px solid #e2e8f0; margin: 15px 0; line-height: 1.6;">
        <strong>Login URL:</strong> <a href="${frontendUrl}/login" style="color: #2563eb; text-decoration: none;">${frontendUrl}/login</a><br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Password:</strong> ${password}
      </div>
      <p>Log in now to complete your 4-step onboarding process so you can start teaching and getting matched with students!</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center;">Best regards,<br/>Cograd Pathshala Admin Team</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_VcRTuqUC_4KVDYJK1FujUzyziyPx4bsyv'}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: `Teacher Onboarding - Cograd Pathshala Account: ${name}`,
        html: htmlContent
      })
    });
    const result = await response.json();
    console.log('Onboarding credentials email sent via Resend:', result);
  } catch (err) {
    console.error('Failed to send onboarding credentials email:', err);
  }
};

// Maps form field name → document metadata
const DOC_FIELD_MAP = {
  doc_degree:            { type: 'Academic',    label: 'Degree / Qualification Certificate' },
  doc_id_proof:          { type: 'Identity',    label: 'Government ID Proof' },
  doc_resume:            { type: 'Resume',      label: 'Professional Resume / CV' },
};

// ── Email domain restriction ──────────────────────────────────────────────────
const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'cograd.com', 'cograd.in', 'admin.in'];
const isAllowedEmailDomain = (email) => {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@').pop().toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
};

// ── Controller: Register ──────────────────────────────────────────────────────

export const registerUser = async (req, res) => {
  const { name, email, password, phone, role, ...extraFields } = req.body;

  // Email domain restriction
  if (email && !isAllowedEmailDomain(email)) {
    return res.status(400).json({ message: 'Only @gmail.com and @yahoo.com email addresses are allowed.' });
  }

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
    // Duplicate check across corresponding collections
    let exists = false;
    if (role === 'admin') {
      exists = await Admin.findOne({ email });
    } else if (role === 'student') {
      exists = await Student.findOne({ email });
    } else if (role === 'teacher') {
      exists = await Teacher.findOne({ email });
    } else if (role === 'parent') {
      exists = await Parent.findOne({ email });
    }

    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

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

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Base user data
    const userData = {
      id: customId,
      name,
      email,
      password: finalPassword,
      phone,
      role,
      tempPassword,
      isEmailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
      ...extraFields,
    };

    // Normalise cities
    if (userData.city)      userData.city      = userData.city.toLowerCase();
    if (userData.childCity) userData.childCity = userData.childCity.toLowerCase();

    // ── Teacher defaults + uploaded documents ──────────────────────────────
    if (role === 'teacher') {
      userData.verification_status   = 'Verified';
      userData.current_student_count = 0;
      userData.max_student_capacity  = 5;
      userData.rating                = 5.0;
      userData.onboarding_progress   = {
        current_step: 4,
        step_1_identity: {
          status: 'Approved',
          aadhaarNumber: '',
          panNumber: '',
          selfieUrl: '',
          aadhaarFileUrl: '',
          panFileUrl: '',
          isMobileVerified: true,
          isEmailVerified: true,
          rejectionReason: ''
        },
        step_2_qualification: {
          status: 'Approved',
          degreeName: '',
          degreeUrl: '',
          professionalCertName: '',
          professionalCertUrl: '',
          universityName: '',
          graduationYear: '',
          rejectionReason: ''
        },
        step_3_competency: {
          status: 'Approved',
          testAttempts: []
        },
        step_4_demo: {
          status: 'Approved',
          targetGrade: '',
          topic: '',
          demoVideoUrl: '',
          feedback: ''
        }
      };
      const uploadedFiles = req.files || {};
      userData.avatar = (uploadedFiles.avatar && uploadedFiles.avatar.length > 0)
        ? uploadedFiles.avatar[0].path
        : (extraFields.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

      // Build documents array from Cloudinary-uploaded files
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
            status:      'Approved',
            fileUrl:     f.path,        // permanent Cloudinary URL ← used by admin to view
            publicId:    f.filename,    // Cloudinary public_id    ← used to delete file
            mimetype:    f.mimetype,
            uploadedAt:  new Date(),
          });
        }
      }

      userData.documents = processedDocs;

      // Map initial registration files to onboarding progress
      if (uploadedFiles.avatar && uploadedFiles.avatar.length > 0) {
        userData.onboarding_progress.step_1_identity.selfieUrl = uploadedFiles.avatar[0].path;
      }
      if (uploadedFiles.doc_id_proof && uploadedFiles.doc_id_proof.length > 0) {
        userData.onboarding_progress.step_1_identity.aadhaarFileUrl = uploadedFiles.doc_id_proof[0].path;
      }
      if (uploadedFiles.doc_degree && uploadedFiles.doc_degree.length > 0) {
        userData.onboarding_progress.step_2_qualification.degreeUrl = uploadedFiles.doc_degree[0].path;
        userData.onboarding_progress.step_2_qualification.degreeName = extraFields.qualifications || '';
      }
    }

    // ── Student defaults ───────────────────────────────────────────────────
    if (role === 'student') {
      userData.status    = extraFields.status || 'pending_match';
      userData.attendance = '100%';
      userData.joinDate   = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
      userData.tuitionSlot = extraFields.tuitionSlot || 'Evening (05:00 PM - 06:30 PM)';
    }

    // ── Parent defaults ────────────────────────────────────────────────────
    if (role === 'parent') {
      userData.status       = extraFields.status || 'pending_match';
      userData.relationship = extraFields.relationship || 'Mother';

      if (extraFields.linkedChildId) {
        const linkedStudent = await Student.findOne({ id: extraFields.linkedChildId });
        if (linkedStudent) {
          userData.childName = linkedStudent.name;
          userData.childStandard = linkedStudent.standard;
          userData.childSubjects = linkedStudent.subjects;
          userData.childCity = linkedStudent.city;
          userData.childLocality = linkedStudent.locality;
          userData.childAddress = linkedStudent.address;
          userData.status = linkedStudent.status || 'pending_match';

          linkedStudent.parentPhone = userData.phone;
          linkedStudent.parentName = userData.name;
          await linkedStudent.save();
        }
      }
    }

    // Save to the appropriate collection
    let newUser;
    if (role === 'student') {
      newUser = await Student.create(userData);
    } else if (role === 'teacher') {
      newUser = await Teacher.create(userData);
    } else if (role === 'parent') {
      newUser = await Parent.create(userData);
    } else if (role === 'admin') {
      newUser = await Admin.create(userData);
    }

    // If teacher, trigger temporary credentials email
    if (role === 'teacher') {
      await sendOnboardingTeacherCredentialsEmail(name, email, tempPassword);
    }

    res.status(201).json({
      token: generateToken(newUser.id),
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role },
      message: 'Account successfully registered.'
    });

  } catch (error) {
    console.error('[registerUser]', error);
    res.status(400).json({ message: error.message });
  }
};

// ── Controller: Login ─────────────────────────────────────────────────────────

export const loginUser = async (req, res) => {
  const { loginUser: destLoginUser, email, password, role } = req.body;
  const loginUser = destLoginUser || email;

  if (!loginUser || !password) {
    return res.status(400).json({ message: 'Email/Phone and Password are required.' });
  }

  try {
    const isPhone = /^\+?[0-9\s\-()]{10,}$/.test(loginUser) && !loginUser.includes('@');
    let query;
    if (isPhone) {
      query = { phone: loginUser };
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginUser)) {
        return res.status(400).json({ message: 'Please enter a valid email address or phone number.' });
      }
      if (!isAllowedEmailDomain(loginUser)) {
        return res.status(400).json({ message: 'Only @gmail.com and @yahoo.com email addresses are allowed.' });
      }
      query = { email: loginUser };
    }

    let user;
    if (role === 'admin') {
      user = await Admin.findOne(query);
    } else if (role === 'student') {
      user = await Student.findOne(query);
    } else if (role === 'teacher') {
      user = await Teacher.findOne(query);
    } else if (role === 'parent') {
      user = await Parent.findOne(query);
    } else if (role) {
      // General role fallback
      if (role === 'student') user = await Student.findOne(query);
      else if (role === 'teacher') user = await Teacher.findOne(query);
      else if (role === 'parent') user = await Parent.findOne(query);
    } else {
      // Unified query fallback
      user = await Student.findOne(query);
      if (!user) user = await Teacher.findOne(query);
      if (!user) user = await Parent.findOne(query);
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
    if (!isMatch) {
      // Handle password failure limits
      user.login_attempts = (user.login_attempts || 0) + 1;
      if (user.login_attempts >= 5) {
        user.lock_until = Date.now() + 30 * 60 * 1000; // 30 min lock
        user.login_attempts = 0;
        await user.save();
        return res.status(401).json({ message: 'Too many incorrect attempts. Account locked for 30 minutes.' });
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid email/phone or password.' });
    }

    // Reset login attempts on success
    user.login_attempts = 0;
    user.lock_until = null;
    await user.save();

    res.json({
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone || '', role: user.role },
    });

  } catch (error) {
    console.error('[loginUser]', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// ── Controller: Get current user ───────────────────────────────────────────────

export const getMe = (req, res) => res.json(req.user);

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and verification code are required.' });
  }

  try {
    let user = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!user) user = await Teacher.findOne({ email: email.toLowerCase().trim() });
    if (!user) user = await Parent.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.json({
      message: 'Email verified successfully.',
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });

  } catch (error) {
    console.error('[verifyEmail]', error);
    return res.status(500).json({ message: 'Server error during email verification.' });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    let user = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!user) user = await Teacher.findOne({ email: email.toLowerCase().trim() });
    if (!user) user = await Parent.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    // Generate new code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = code;
    user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // Send email
    await sendVerificationEmail(user.name, user.email, code);

    return res.json({ message: 'Verification code resent successfully.' });

  } catch (error) {
    console.error('[resendVerification]', error);
    return res.status(500).json({ message: 'Server error during code resend.' });
  }
};

export const googleLogin = async (req, res) => {
  const { credentialToken, role, extraFields } = req.body;

  if (!credentialToken) {
    return res.status(400).json({ message: 'Google credential token is required.' });
  }

  try {
    // 1. Verify with Google Tokeninfo endpoint
    let payload;
    
    // For local testing/fallback, if the token contains "mock-google-token-"
    if (credentialToken.startsWith('mock-google-token-')) {
      const email = credentialToken.replace('mock-google-token-', '');
      payload = {
        email: email,
        email_verified: 'true',
        name: email.split('@')[0],
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        sub: 'mock-sub-' + Date.now()
      };
    } else {
      const googleVerifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credentialToken)}`);
      
      if (googleVerifyRes.status !== 200) {
        return res.status(400).json({ message: 'Invalid or expired Google credential token.' });
      }
      
      payload = await googleVerifyRes.json();

      // Verify audience matches if Client ID is configured
      if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
        return res.status(400).json({ message: 'Google credential token audience mismatch.' });
      }
    }

    if (!payload.email || payload.email_verified !== 'true') {
      return res.status(400).json({ message: 'Google email must be verified.' });
    }

    const email = payload.email.toLowerCase().trim();

    // Email domain restriction for Google sign-in
    if (!isAllowedEmailDomain(email)) {
      return res.status(400).json({ message: 'Only @gmail.com and @yahoo.com email addresses are allowed.' });
    }

    // 2. Check if user exists
    let user = await Student.findOne({ email });
    if (!user) user = await Teacher.findOne({ email });
    if (!user) user = await Parent.findOne({ email });
    if (!user) user = await Admin.findOne({ email });

    if (user) {
      // User exists - log them in!
      if (role && user.role !== role) {
        return res.status(400).json({ message: `This Google account is already registered as a ${user.role}.` });
      }
      
      // Auto verify email if it wasn't already
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }

      return res.json({
        token: generateToken(user.id),
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone || '', role: user.role },
      });
    }

    // 3. User does not exist
    if (!role) {
      // Need role selection
      return res.json({
        require_registration: true,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      });
    }

    // Create user with Google profile information and requested role
    const customId = role === 'student' ? `stu_${Date.now()}` :
                     role === 'parent'  ? `parent_${Date.now()}` :
                     role === 'teacher' ? `teacher_${Date.now()}` :
                     `user_${Date.now()}`;

    // For Google login, create a random placeholder password
    const finalPassword = makeTempPassword() + 'Aa1!'; 

    const userData = {
      id: customId,
      name: payload.name || email.split('@')[0],
      email,
      password: finalPassword,
      phone: extraFields?.phone || '0000000000',
      role,
      isEmailVerified: true, // Google email is verified
      avatar: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      ...extraFields,
    };

    // Defaults based on role
    if (role === 'student') {
      userData.status = extraFields?.status || 'pending_match';
      userData.attendance = '100%';
      userData.joinDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
      userData.tuitionSlot = extraFields?.tuitionSlot || 'Evening (05:00 PM - 06:30 PM)';
    } else if (role === 'parent') {
      userData.status = extraFields?.status || 'pending_match';
      userData.relationship = extraFields?.relationship || 'Mother';
      
      if (extraFields?.linkedChildId) {
        const linkedStudent = await Student.findOne({ id: extraFields.linkedChildId });
        if (linkedStudent) {
          userData.childName = linkedStudent.name;
          userData.childStandard = linkedStudent.standard;
          userData.childSubjects = linkedStudent.subjects;
          userData.childCity = linkedStudent.city;
          userData.childLocality = linkedStudent.locality;
          userData.childAddress = linkedStudent.address;
          userData.status = linkedStudent.status || 'pending_match';
          
          linkedStudent.parentPhone = userData.phone;
          linkedStudent.parentName = userData.name;
          await linkedStudent.save();
        }
      }
    }

    let newUser;
    if (role === 'student') newUser = await Student.create(userData);
    else if (role === 'teacher') newUser = await Teacher.create(userData);
    else if (role === 'parent') newUser = await Parent.create(userData);

    return res.status(201).json({
      token: generateToken(newUser.id),
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role },
    });

  } catch (error) {
    console.error('[googleLogin]', error);
    return res.status(500).json({ message: error.message || 'Server error during Google login.' });
  }
};

const sendOTPEmail = async (name, email, code, subjectText, introText) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); background-color: #ffffff;">
      <h2 style="color: #2563eb; font-weight: 800; margin-bottom: 20px; text-align: center;">${subjectText}</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>${introText}</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; font-family: monospace; border: 1px solid #e2e8f0; margin: 25px 0; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">
        ${code}
      </div>
      <p style="text-align: center; color: #64748b; font-size: 13px;">This code will expire in 15 minutes.</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center;">Best regards,<br/>Cograd Pathshala Team</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_VcRTuqUC_4KVDYJK1FujUzyziyPx4bsyv'}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: subjectText,
        html: htmlContent
      })
    });
    const result = await response.json();
    console.log('OTP Email sent via Resend:', result);
  } catch (err) {
    console.error('Failed to send OTP email via Resend:', err);
  }
};

// @desc    Send OTP to user for Login
// @route   POST /api/auth/send-login-otp
// @access  Public
export const sendLoginOTP = async (req, res) => {
  try {
    const { identifier, role } = req.body;
    if (!identifier || !role) {
      return res.status(400).json({ message: 'Identifier and role are required.' });
    }

    let user;
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      const emailQuery = identifier.toLowerCase().trim();
      if (role === 'admin') {
        user = await Admin.findOne({ email: emailQuery });
      } else if (role === 'student') {
        user = await Student.findOne({ email: emailQuery });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ email: emailQuery });
      } else if (role === 'parent') {
        user = await Parent.findOne({ email: emailQuery });
      }
    } else {
      const digits = identifier.replace(/\D/g, '');
      if (digits.length < 10) {
        return res.status(400).json({ message: 'Please enter a valid email or 10-digit phone number.' });
      }
      const searchRegex = new RegExp(digits.slice(-10) + '$');
      if (role === 'admin') {
        user = await Admin.findOne({ phone: searchRegex });
      } else if (role === 'student') {
        user = await Student.findOne({ phone: searchRegex });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ phone: searchRegex });
      } else if (role === 'parent') {
        user = await Parent.findOne({ phone: searchRegex });
      }
    }

    if (!user) {
      return res.status(404).json({ message: `No registered account found with that email/phone for the selected role.` });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp_code = otp;
    user.otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    if (isEmail) {
      await sendOTPEmail(user.name, user.email, otp, 'Cograd Pathshala Login OTP', 'Please use the following 6-digit One Time Password (OTP) to log in to your account:');
    } else {
      await sendSMS(user.phone, `Your Cograd Pathshala Login OTP is ${otp}. It will expire in 15 minutes.`);
    }

    return res.json({ message: 'Verification OTP has been sent successfully.' });
  } catch (error) {
    console.error('[sendLoginOTP]', error);
    return res.status(500).json({ message: 'Server error while sending OTP.' });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-login-otp
// @access  Public
export const verifyLoginOTP = async (req, res) => {
  try {
    const { identifier, role, otp } = req.body;
    if (!identifier || !role || !otp) {
      return res.status(400).json({ message: 'All parameters (identifier, role, otp) are required.' });
    }

    let user;
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      const emailQuery = identifier.toLowerCase().trim();
      if (role === 'admin') {
        user = await Admin.findOne({ email: emailQuery });
      } else if (role === 'student') {
        user = await Student.findOne({ email: emailQuery });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ email: emailQuery });
      } else if (role === 'parent') {
        user = await Parent.findOne({ email: emailQuery });
      }
    } else {
      const digits = identifier.replace(/\D/g, '');
      const searchRegex = new RegExp(digits.slice(-10) + '$');
      if (role === 'admin') {
        user = await Admin.findOne({ phone: searchRegex });
      } else if (role === 'student') {
        user = await Student.findOne({ phone: searchRegex });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ phone: searchRegex });
      } else if (role === 'parent') {
        user = await Parent.findOne({ phone: searchRegex });
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    if (!user.otp_code || user.otp_code !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code.' });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Clear OTP fields
    user.otp_code = null;
    user.otp_expires_at = null;
    await user.save();

    return res.json({
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    console.error('[verifyLoginOTP]', error);
    return res.status(500).json({ message: 'Server error while verifying OTP.' });
  }
};

// @desc    Send OTP to user for Password Reset
// @route   POST /api/auth/forgot-password-otp
// @access  Public
export const forgotPasswordOTP = async (req, res) => {
  try {
    const { identifier, role } = req.body;
    if (!identifier || !role) {
      return res.status(400).json({ message: 'Identifier and role are required.' });
    }

    let user;
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      const emailQuery = identifier.toLowerCase().trim();
      if (role === 'admin') {
        user = await Admin.findOne({ email: emailQuery });
      } else if (role === 'student') {
        user = await Student.findOne({ email: emailQuery });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ email: emailQuery });
      } else if (role === 'parent') {
        user = await Parent.findOne({ email: emailQuery });
      }
    } else {
      const digits = identifier.replace(/\D/g, '');
      if (digits.length < 10) {
        return res.status(400).json({ message: 'Please enter a valid email or 10-digit phone number.' });
      }
      const searchRegex = new RegExp(digits.slice(-10) + '$');
      if (role === 'admin') {
        user = await Admin.findOne({ phone: searchRegex });
      } else if (role === 'student') {
        user = await Student.findOne({ phone: searchRegex });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ phone: searchRegex });
      } else if (role === 'parent') {
        user = await Parent.findOne({ phone: searchRegex });
      }
    }

    if (!user) {
      return res.status(404).json({ message: `No registered account found with that email/phone for the selected role.` });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.reset_otp_code = otp;
    user.reset_otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    if (isEmail) {
      await sendOTPEmail(user.name, user.email, otp, 'Reset Your Password - Cograd Pathshala', 'We received a request to reset your password. Please use the following 6-digit verification code:');
    } else {
      await sendSMS(user.phone, `Use code ${otp} to reset your password. Valid for 15 minutes.`);
    }

    return res.json({ message: 'Password reset OTP has been sent successfully.' });
  } catch (error) {
    console.error('[forgotPasswordOTP]', error);
    return res.status(500).json({ message: 'Server error while sending password reset OTP.' });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password-otp
// @access  Public
export const resetPasswordOTP = async (req, res) => {
  try {
    const { identifier, role, otp, newPassword } = req.body;
    if (!identifier || !role || !otp || !newPassword) {
      return res.status(400).json({ message: 'All parameters (identifier, role, otp, newPassword) are required.' });
    }

    let user;
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      const emailQuery = identifier.toLowerCase().trim();
      if (role === 'admin') {
        user = await Admin.findOne({ email: emailQuery });
      } else if (role === 'student') {
        user = await Student.findOne({ email: emailQuery });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ email: emailQuery });
      } else if (role === 'parent') {
        user = await Parent.findOne({ email: emailQuery });
      }
    } else {
      const digits = identifier.replace(/\D/g, '');
      const searchRegex = new RegExp(digits.slice(-10) + '$');
      if (role === 'admin') {
        user = await Admin.findOne({ phone: searchRegex });
      } else if (role === 'student') {
        user = await Student.findOne({ phone: searchRegex });
      } else if (role === 'teacher') {
        user = await Teacher.findOne({ phone: searchRegex });
      } else if (role === 'parent') {
        user = await Parent.findOne({ phone: searchRegex });
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    // Set new password (pre-save hook will automatically hash it)
    user.password = newPassword;
    user.reset_otp_code = null;
    user.reset_otp_expires_at = null;
    await user.save();

    return res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error('[resetPasswordOTP]', error);
    return res.status(500).json({ message: 'Server error while resetting password.' });
  }
};

export const sendRegistrationOtps = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Save or update temp verification record
    await TempOtp.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { emailOtp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // 2. Dispatch Email OTP via Resend
    await sendVerificationEmail('Tutor', email, emailOtp);

    return res.json({ message: 'Verification code successfully sent to email.' });
  } catch (error) {
    console.error('[sendRegistrationOtps]', error);
    return res.status(500).json({ message: 'Server error while sending verification code.' });
  }
};

export const verifyRegistrationOtps = async (req, res) => {
  const { email, emailOtp } = req.body;
  if (!email || !emailOtp) {
    return res.status(400).json({ message: 'All parameters (email, emailOtp) are required.' });
  }

  try {
    const record = await TempOtp.findOne({ email: email.toLowerCase().trim() });
    if (!record) {
      return res.status(400).json({ message: 'Verification record not found or expired.' });
    }

    if (record.emailOtp !== emailOtp.trim()) {
      return res.status(400).json({ message: 'Invalid Email OTP code.' });
    }

    // Success! Clear the temp verification code
    await TempOtp.deleteOne({ _id: record._id });

    return res.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error('[verifyRegistrationOtps]', error);
    return res.status(500).json({ message: 'Server error while verifying email code.' });
  }
};
