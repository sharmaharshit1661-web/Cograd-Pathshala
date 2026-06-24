import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone, role, ...extraFields } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
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

    // Build the user data object
    const userData = {
      id: customId,
      name,
      email,
      password,
      phone,
      role,
      ...extraFields,
    };

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
    }

    const user = await User.create(userData);

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
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    // Validate user, password and role
    if (user && (await user.matchPassword(password))) {
      // Check if roles match. We can be lax or strict, let's match the requested role.
      if (role && user.role !== role) {
        return res.status(401).json({ message: `Access denied. You are registered as a ${user.role}.` });
      }

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
      res.status(401).json({ message: 'Invalid email or password' });
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
