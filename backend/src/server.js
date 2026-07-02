import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Admin from './models/Admin.js';
import Assignment from './models/Assignment.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('<h1>Cograd Pathshala Backend API is running successfully</h1><p>Visit the health status check at <a href="/api/health">/api/health</a></p>');
});

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cograd Pathshala API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Seed data function
const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
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

    if (userCount === 0) {
      console.log('Seeding default users...');

      const defaultParents = [
        {
          id: 'parent_1',
          name: 'Mrs. Sharma',
          email: 'parent@cograd.com',
          password: 'password',
          phone: '9876500999',
          role: 'parent'
        }
      ];

      const defaultStudents = [
        {
          id: 'stu_rahul',
          name: 'Rahul Sharma',
          email: 'student@cograd.com',
          password: 'password',
          phone: '9876500999',
          role: 'student',
          standard: 'Class 10 (CBSE)',
          subjects: ['Mathematics', 'Science'],
          status: 'pending_test',
          city: 'Meerut',
          state: 'Uttar Pradesh',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          parentName: 'Mr. Alok Sharma',
          parentPhone: '9876500999',
          address: 'House No. 42, Sector 4, Shastri Nagar, Meerut',
          attendance: 'N/A',
          joinDate: '12 April 2026',
          tuitionSlot: 'Evening (04:00 PM - 05:00 PM)',
          test_score: null,
        },
        {
          id: 'stu_arjun',
          name: 'Arjun Mehta',
          email: 'arjun@cograd.com',
          password: 'password',
          phone: '9876500333',
          role: 'student',
          standard: 'Class 9',
          subjects: ['Mathematics'],
          status: 'active',
          city: 'Delhi',
          state: 'Delhi',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          parentName: 'Sanjay Mehta',
          parentPhone: '9876500333',
          address: 'Sector 15, Dwarka, Delhi',
          assigned_teacher_id: '1',
          test_score: { Mathematics: 75 },
          test_completed_at: new Date('2026-06-10T14:30:00')
        }
      ];

      const defaultTeachers = [
        {
          id: '1',
          name: 'Priya Sharma',
          email: 'priya@cograd.com',
          password: 'password',
          phone: '9876543210',
          role: 'teacher',
          subjects_taught: ['Mathematics', 'Science'],
          grade_levels_qualified: ['Class 10', 'Class 9', 'Class 7', 'Class 3'],
          verification_status: 'Verified',
          current_student_count: 1,
          max_student_capacity: 5,
          city: 'Meerut',
          teaching_style: 'beginner',
          hourly_rate: '₹600/hr',
          rating: 4.9,
          experience: '6+ Years',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          bio: 'Passionate educator dedicated to simplifying maths and science concepts for school students.',
          qualification: 'M.Sc. in Mathematics, B.Ed.',
          travelRange: '5 km radius',
          free_slots: ["Monday - 9:00 AM", "Tuesday - 10:00 AM", "Wednesday - 2:00 PM"],
          documents: [
            { id: 1, name: 'M.Sc. Degree Certificate', type: 'Academic', status: 'Approved' },
            { id: 2, name: 'B.Ed. Certification', type: 'Academic', status: 'Approved' },
            { id: 3, name: 'Aadhaar ID Card', type: 'Identity', status: 'Approved' },
            { id: 4, name: 'Previous Experience Letter', type: 'Experience', status: 'Approved' }
          ]
        },
        {
          id: '2',
          name: 'Mr. Rajesh Kumar',
          email: 'rajesh@cograd.com',
          password: 'password',
          phone: '9876543211',
          role: 'teacher',
          subjects_taught: ['Science', 'Chemistry'],
          grade_levels_qualified: ['Class 10', 'Class 9', 'Class 8'],
          verification_status: 'Verified',
          current_student_count: 2,
          max_student_capacity: 5,
          city: 'Noida',
          teaching_style: 'advanced',
          hourly_rate: '₹650/hr',
          rating: 4.7,
          experience: '9+ Years',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          bio: 'Chemistry enthusiast who designs creative visual aids and fun home-based experiments.',
          qualification: 'M.Sc. Chemistry, IIT Delhi',
          free_slots: ["Monday - 10:00 AM", "Wednesday - 3:00 PM", "Friday - 4:00 PM"],
          documents: [
            { id: 1, name: 'M.Sc. Chemistry Certificate', type: 'Academic', status: 'Approved' },
            { id: 2, name: 'Aadhaar ID Card', type: 'Identity', status: 'Approved' }
          ]
        },
        {
          id: '3',
          name: 'Ms. Neha Gupta',
          email: 'neha@cograd.com',
          password: 'password',
          phone: '9876543212',
          role: 'teacher',
          subjects_taught: ['English'],
          grade_levels_qualified: ['Class 7', 'Class 6'],
          verification_status: 'Verified',
          current_student_count: 1,
          max_student_capacity: 5,
          city: 'Mumbai',
          teaching_style: 'beginner',
          hourly_rate: '₹500/hr',
          rating: 4.7,
          experience: '6+ Years',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
          bio: 'Focuses on communication skills and board-level academic writing.',
          qualification: 'MA English Literature',
          free_slots: ["Tuesday - 9:00 AM", "Thursday - 3:00 PM", "Saturday - 2:00 PM"],
          documents: [
            { id: 1, name: 'MA English Certificate', type: 'Academic', status: 'Approved' },
            { id: 2, name: 'Aadhaar ID Card', type: 'Identity', status: 'Approved' }
          ]
        },
        {
          id: '4',
          name: 'Dr. Satish Sharma',
          email: 'satish@cograd.com',
          password: 'password',
          phone: '9876543213',
          role: 'teacher',
          subjects_taught: ['Mathematics'],
          grade_levels_qualified: ['Class 9', 'Class 10'],
          verification_status: 'Verified',
          current_student_count: 4,
          max_student_capacity: 5,
          city: 'Pune',
          teaching_style: 'advanced',
          hourly_rate: '₹700/hr',
          rating: 4.9,
          experience: '12+ Years',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          bio: 'PhD in Algebra, dedicated to advanced problem solving.',
          qualification: 'PhD Mathematics',
          free_slots: ["Monday - 11:00 AM", "Wednesday - 5:00 PM", "Friday - 6:00 PM"],
          documents: [
            { id: 1, name: 'PhD Mathematics Certificate', type: 'Academic', status: 'Approved' },
            { id: 2, name: 'Aadhaar ID Card', type: 'Identity', status: 'Approved' }
          ]
        }
      ];

      // Save using loop so pre-save save hook (bcrypt) runs on each
      for (const u of [...defaultParents, ...defaultStudents, ...defaultTeachers]) {
        await User.create(u);
      }
      console.log('Users seeded successfully.');
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

    const assignmentCount = await Assignment.countDocuments();
    if (assignmentCount === 0) {
      console.log('Seeding default assignments...');
      await Assignment.create({
        id: 'asg_arjun',
        student_id: 'stu_arjun',
        teacher_id: '1',
        assigned_by: 'admin_1',
        assigned_at: new Date('2026-06-10T14:40:00'),
        status: 'active'
      });
      console.log('Assignments seeded successfully.');
    }
  } catch (err) {
    console.error(`Error seeding default data: ${err.message}`);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  await seedData();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
