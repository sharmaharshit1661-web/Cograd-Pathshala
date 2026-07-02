import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'cograd_pathshala_fallback_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone, role, ...extraFields } = req.body;

  try {
    const exists = role === 'admin' 
      ? await Admin.findOne({ email }) 
      : await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate custom ID based on role
    let customId;
    if (role === 'student') {
      customId = `stu_${Date.now()}`;
    } else if (role === 'teacher') {
      customId = `teacher_${Date.now()}`;
    } else if (role === 'parent') {
      customId = `parent_${Date.now()}`;
    } else {
      customId = `admin_${Date.now()}`;
    }

    let finalPassword = password;
    let tempPassword = null;
    if (role === 'teacher') {
      if (!finalPassword) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
        let generatedPassword = '';
        for (let i = 0; i < 10; i++) {
          generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        finalPassword = generatedPassword;
        tempPassword = generatedPassword;
      }
    }

    // Build the user data object
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

    // Normalize city values to lowercase for consistent storage
    if (userData.city) {
      userData.city = userData.city.toLowerCase();
    }
    if (userData.childCity) {
      userData.childCity = userData.childCity.toLowerCase();
    }

    // If teacher, set default fields
    if (role === 'teacher') {
      userData.verification_status = extraFields.verification_status || 'Pending';
      userData.current_student_count = 0;
      userData.max_student_capacity = 5;
      userData.rating = 5.0;
      userData.avatar = extraFields.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
      userData.documents = [
        { id: 1, name: 'M.Sc. Degree Certificate', type: 'Academic', status: 'Approved' },
        { id: 2, name: 'B.Ed. Certification', type: 'Academic', status: 'Approved' },
        { id: 3, name: 'Aadhaar ID Card', type: 'Identity', status: 'Approved' },
        { id: 4, name: 'Previous Experience Letter', type: 'Experience', status: 'Approved' }
      ];
    }

    // If student, set default fields
    if (role === 'student') {
      userData.status = extraFields.status || 'pending_match';
      userData.avatar = extraFields.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
      userData.attendance = '100%';
      userData.joinDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      userData.tuitionSlot = extraFields.tuitionSlot || 'Evening (05:00 PM - 06:30 PM)';
      userData.locality = extraFields.locality || null;
      // If city is 'Other', set matching_eligible to false and status to waitlist
      if (userData.city && userData.city.toLowerCase() === 'other') {
        userData.matching_eligible = false;
        userData.status = 'waitlist';
        userData.test_score = null;
        userData.test_completed_at = null;
      }
    }

    // If parent, set default fields
    if (role === 'parent') {
      userData.status = extraFields.status || 'pending_match';
      userData.relationship = extraFields.relationship;
      userData.childName = extraFields.childName;
      userData.childDob = extraFields.childDob;
      userData.childStandard = extraFields.childStandard;
      userData.childSubjects = extraFields.childSubjects;
      userData.childCity = extraFields.childCity;
      userData.childLocality = extraFields.childLocality;
      userData.childTuitionMode = extraFields.childTuitionMode;
      // If child city is 'Other', set matching_eligible to false and status to waitlist
      if (userData.childCity && userData.childCity.toLowerCase() === 'other') {
        userData.childMatchingEligible = false;
        userData.status = 'waitlist';
        userData.test_score = null;
        userData.test_completed_at = null;
      }
    }

    const user = role === 'admin' 
      ? await Admin.create(userData) 
      : await User.create(userData);

    res.status(201).json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `An account with this ${field} already exists.` });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const loginUser = (email || '').trim().toLowerCase();
    if (!loginUser) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const isPhone = /^\+?[0-9\s\-()]{10,}$/.test(loginUser) && !loginUser.includes('@');
    let query;
    if (isPhone) {
      // Clean phone number input from non-digits to match stored format if needed
      // but let's keep it simple or direct first:
      query = { phone: loginUser };
    } else {
      // Basic email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginUser)) {
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
      if (!user) {
        user = await Admin.findOne(query);
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }

    // Check if currently locked out
    if (user.lock_until && user.lock_until > Date.now()) {
      const remainingMinutes = Math.ceil((user.lock_until - Date.now()) / 60000);
      return res.status(401).json({
        message: `Account is temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minute(s).`
      });
    }

    // Validate user, password and role
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      // Check if roles match. We can be lax or strict, let's match the requested role.
      if (role && user.role !== role) {
        return res.status(401).json({ message: `Access denied. You are registered as a ${user.role}.` });
      }

      if (user.role === 'teacher' && user.verification_status !== 'Verified') {
        return res.status(401).json({ message: 'Your teacher application is pending admin review. You will receive your login credentials via email once approved.' });
      }

      // Reset login attempts on successful login
      user.login_attempts = 0;
      user.lock_until = null;
      await user.save();

      res.json({
        token: generateToken(user.id),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      user.login_attempts = (user.login_attempts || 0) + 1;
      let responseMessage = 'Invalid email/phone or password';

      if (user.login_attempts >= 4) {
        user.lock_until = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
        responseMessage = 'Account is temporarily locked due to too many failed attempts. Try again in 15 minutes.';
      } else {
        const attemptsLeft = 4 - user.login_attempts;
        responseMessage = `Invalid email/phone or password. ${attemptsLeft} attempts remaining before temporary lockout.`;
      }

      await user.save();
      res.status(401).json({ message: responseMessage });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
