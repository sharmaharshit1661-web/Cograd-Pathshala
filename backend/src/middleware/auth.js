import jwt from 'jsonwebtoken';
import Student from '../models/student/Student.js';
import Teacher from '../models/teacher/Teacher.js';
import Parent from '../models/parent/Parent.js';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cograd_pathshala_fallback_secret_key');

      // Get user from the token and attach to request across multi-collections
      let userObj = await Student.findOne({ id: decoded.id }).select('-password');
      if (!userObj) {
        userObj = await Teacher.findOne({ id: decoded.id }).select('-password');
      }
      if (!userObj) {
        userObj = await Parent.findOne({ id: decoded.id }).select('-password');
      }
      if (!userObj) {
        userObj = await Admin.findOne({ id: decoded.id }).select('-password');
      }

      req.user = userObj;
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
