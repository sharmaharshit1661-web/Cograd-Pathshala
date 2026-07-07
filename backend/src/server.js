import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Admin from './models/Admin.js';
import Assignment from './models/Assignment.js';
import DemoBooking from './models/DemoBooking.js';
import SupportTicket from './models/SupportTicket.js';
import Payment from './models/Payment.js';
import Announcement from './models/Announcement.js';
import Enquiry from './models/Enquiry.js';
import AdminSettings from './models/AdminSettings.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import { UPLOADS_ROOT } from './utils/paths.js';
import Notification from './models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Core middleware ───────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://cograd-pathshala-frontend.vercel.app',
  'https://cograd-pathshala-frontend-lovat.vercel.app',
];

if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/$/, ''));
  allowedOrigins.push(...envOrigins);
  envOrigins.forEach(o => {
    if (o.startsWith('ttps://')) {
      allowedOrigins.push(o.replace('ttps://', 'https://'));
    }
  });
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => normalizedOrigin === allowed);
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static: serve uploaded teacher documents ──────────────────────────────────
// Files are stored at  backend/uploads/**
// Served at            GET /uploads/**
// e.g. GET /uploads/teacher-docs/teacher_123/degree_ts_cert.pdf
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(UPLOADS_ROOT));

// Database connection status middleware (prevents API hanging when DB is offline)
app.use((req, res, next) => {
  if (
    req.path === '/' ||
    req.path === '/api/health' ||
    req.path === '/api/debug-cloudinary' ||
    req.path.startsWith('/uploads')
  ) {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database connection is not established. Please check backend logs and verify your MongoDB connection/URI.'
    });
  }
  next();
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);


// Root Route
app.get('/', (req, res) => {
  res.send('<h1>Cograd Pathshala Backend API is running successfully</h1><p>Visit the health status check at <a href="/api/health">/api/health</a></p>');
});

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Cloudinary env check endpoint for debugging
app.get('/api/debug-cloudinary', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Access denied in production mode.' });
  }
  res.json({
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    hasCloudinaryUrl: !!process.env.CLOUDINARY_URL,
    cloudinaryUrlStartsWith: process.env.CLOUDINARY_URL ? process.env.CLOUDINARY_URL.substring(0, 20) : 'none'
  });
});

// Global error handling middleware (always returns JSON, never HTML)
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err);
  let msg = err.message || 'An unexpected error occurred on the server.';
  if (err.storageErrors && err.storageErrors.length > 0) {
    msg = err.storageErrors.map(e => e.message || JSON.stringify(e)).join(', ');
  }
  res.status(err.status || 500).json({
    message: msg
  });
});

// Seed data function
const seedData = async () => {
  try {
    // Database persistence: do not clear collections on startup.

    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      console.log('Seeding default admins...');
      const defaultAdmins = [
        {
          id: 'admin_1',
          name: 'Cograd Admin Staff',
          email: 'admin@cograd.com',
          password: 'password',
          phone: '9876500000',
          role: 'admin'
        }
      ];
      for (const a of defaultAdmins) {
        await Admin.create(a);
      }
      console.log('Admins seeded successfully.');
    }

    // Ensure the specific admin user exists
    const specificAdmin = await Admin.findOne({ email: 'cograd@admin.in' });
    if (!specificAdmin) {
      console.log('Registering specific admin credentials...');
      await Admin.create({
        id: `admin_specific_${Date.now()}`,
        name: 'Cograd Root Admin',
        email: 'cograd@admin.in',
        password: 'CoGrad@Amin543',
        phone: '9876599999',
        role: 'admin'
      });
      console.log('Specific admin credentials registered successfully.');
    }
  } catch (err) {
    console.error(`Error clearing/seeding data: ${err.message}`);
  }
};

// Start server
const startServer = async () => {
  // Start listening on port immediately to prevent net::ERR_CONNECTION_REFUSED on frontend
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error('================================================================');
      console.error(`FATAL ERROR: Port ${PORT} is already in use by another process!`);
      console.error(`Please free port ${PORT} or configure a different PORT in backend/.env.`);
      console.error('================================================================');
      process.exit(1);
    } else {
      console.error('Server error:', err.message);
    }
  });

  // Connect to database and seed data asynchronously
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      await seedData();
    }
  } catch (err) {
    console.error('Failed to initialize database on startup:', err.message);
  }
};

startServer();
