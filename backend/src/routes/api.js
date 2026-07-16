import express from 'express';
import User from '../models/User.js';
import Assignment from '../models/Assignment.js';
import DemoBooking from '../models/DemoBooking.js';
import SupportTicket from '../models/SupportTicket.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';
import Enquiry from '../models/Enquiry.js';
import AdminSettings from '../models/AdminSettings.js';
import Notification from '../models/Notification.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import { sendSMS, sendWhatsApp } from '../utils/sms.js';
import { protect } from '../middleware/auth.js';
import { uploadIdentityDocs, uploadQualificationDocs, uploadDemoVideo, validateUploadSizes } from '../middleware/upload.js';

const router = express.Router();

const mapDistrictToCity = (district) => {
  if (!district) return '';
  return district.toLowerCase().trim();
};

const addEarningToTeacher = async (studentId, studentName, amount, method) => {
  try {
    const studentUser = await User.findOne({ id: studentId });
    if (studentUser && studentUser.assigned_teacher_id) {
      const teacher = await User.findOne({ id: studentUser.assigned_teacher_id });
      if (teacher) {
        const parsedAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d]/g, '')) : parseFloat(amount);
        const newEarning = {
          id: 'INV-' + Math.floor(100000 + Math.random() * 900000),
          studentName: studentName,
          date: new Date().toISOString().split('T')[0],
          amount: parsedAmount || 3000,
          status: 'Paid',
          method: method || 'Cash / Manual'
        };
        teacher.earnings_log = [newEarning, ...(teacher.earnings_log || [])];
        await teacher.save();
        console.log(`Automatically logged ₹${parsedAmount} earning for teacher ${teacher.name} assigned to student ${studentName}`);
      }
    }
  } catch (err) {
    console.error('Failed to automatically log teacher earning:', err);
  }
};

// @desc    Get available slots for teachers in a district
// @route   GET /api/teachers/available-slots
// @access  Public
router.get('/teachers/available-slots', async (req, res) => {
  try {
    const { district } = req.query;
    if (!district) {
      return res.status(400).json({ message: 'District is required' });
    }

    const targetCity = mapDistrictToCity(district);
    const teachers = await User.find({
      role: 'teacher',
      verification_status: 'Verified',
      city: { $regex: new RegExp('^' + targetCity + '$', 'i') }
    });

    const slots = [];
    teachers.forEach((t) => {
      if (t.free_slots && Array.isArray(t.free_slots)) {
        t.free_slots.forEach((slotStr) => {
          const parts = slotStr.split(' - ');
          const day = parts[0] || '';
          const time = parts[1] || '';
          slots.push({
            teacherId: t.id,
            teacherName: t.name,
            slot: slotStr,
            day,
            time
          });
        });
      }
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// STUDENT ROUTES
// ==========================================

// @desc    Search for a student by email or phone (for parent linking during registration)
// @route   GET /api/students/search
// @access  Public (returns only safe fields)
router.get('/students/search', async (req, res) => {
  try {
    const { email, phone } = req.query;
    if (!email && !phone) {
      return res.status(400).json({ message: 'Please provide email or phone to search' });
    }

    const query = { role: 'student' };
    if (email) query.email = email.toLowerCase().trim();
    else if (phone) query.phone = phone.trim();

    const student = await User.findOne(query);
    if (!student) {
      return res.status(404).json({ message: 'No student account found with this information' });
    }

    // Return only safe, non-sensitive fields
    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      standard: student.standard,
      subjects: student.subjects,
      city: student.city,
      locality: student.locality,
      test_score: student.test_score,
      test_completed_at: student.test_completed_at,
      status: student.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all students
// @route   GET /api/students
// @access  Private
router.get('/students', protect, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get student by custom ID
// @route   GET /api/students/:id
// @access  Private
router.get('/students/:id', protect, async (req, res) => {
  try {
    const student = await User.findOne({ id: req.params.id, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a student (admin action)
// @route   POST /api/students
// @access  Private
router.post('/students', protect, async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      id: req.body.id || `stu_${Date.now()}`,
      role: 'student',
      status: req.body.status || 'Active',
      joinDate: req.body.joinDate || new Date().toISOString().split('T')[0],
    };

    // If password not provided (e.g. admin creation), set default
    if (!studentData.password) {
      studentData.password = 'password';
    }

    const student = await User.create(studentData);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
router.put('/students/:id', protect, async (req, res) => {
  try {
    const student = await User.findOne({ id: req.params.id, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      student[key] = req.body[key];
    });

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
router.delete('/students/:id', protect, async (req, res) => {
  try {
    const student = await User.findOneAndDelete({ id: req.params.id, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Also delete any assignments for this student
    await Assignment.deleteMany({ student_id: req.params.id });
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// TEACHER ROUTES
// ==========================================

// @desc    Get onboarding status for teachers
// @route   GET /api/teachers/onboarding/status
// @access  Private
router.get('/teachers/onboarding/status', protect, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    res.json({
      verification_status: user.verification_status,
      onboarding_progress: user.onboarding_progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const mapUserToTeacherId = (req, res, next) => {
  if (req.user) {
    req._teacherId = req.user.id;
  }
  next();
};

// @desc    Submit Step 1: Identity Verification
// @route   POST /api/teachers/onboarding/identity
// @access  Private
router.post('/teachers/onboarding/identity', protect, mapUserToTeacherId, uploadIdentityDocs, validateUploadSizes({
  selfie: 150 * 1024,
  doc_aadhaar: 10 * 1024 * 1024,
  doc_pan: 10 * 1024 * 1024
}), async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const { aadhaarNumber, panNumber } = req.body;
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits' });
    }
    if (!panNumber || panNumber.length !== 10) {
      return res.status(400).json({ message: 'PAN number must be exactly 10 alphanumeric characters' });
    }

    const files = req.files || {};
    if (!files.selfie && (!user.onboarding_progress?.step_1_identity?.selfieUrl || user.onboarding_progress?.step_1_identity?.selfieUrl === '')) {
      return res.status(400).json({ message: 'Selfie upload is required' });
    }
    if (!files.doc_aadhaar && (!user.onboarding_progress?.step_1_identity?.aadhaarFileUrl || user.onboarding_progress?.step_1_identity?.aadhaarFileUrl === '')) {
      return res.status(400).json({ message: 'Aadhaar card upload is required' });
    }
    if (!files.doc_pan && (!user.onboarding_progress?.step_1_identity?.panFileUrl || user.onboarding_progress?.step_1_identity?.panFileUrl === '')) {
      return res.status(400).json({ message: 'PAN card upload is required' });
    }

    const step1 = user.onboarding_progress?.step_1_identity || {};
    
    const updatedStep1 = {
      status: 'Submitted',
      aadhaarNumber,
      panNumber,
      selfieUrl: files.selfie ? files.selfie[0].path : step1.selfieUrl,
      aadhaarFileUrl: files.doc_aadhaar ? files.doc_aadhaar[0].path : step1.aadhaarFileUrl,
      panFileUrl: files.doc_pan ? files.doc_pan[0].path : step1.panFileUrl,
      isMobileVerified: true,
      isEmailVerified: user.isEmailVerified || true,
      rejectionReason: ''
    };

    user.onboarding_progress.step_1_identity = updatedStep1;

    // Push to standard documents array for backward compatibility
    if (files.doc_aadhaar) {
      user.documents.push({
        id: user.documents.length + 1,
        name: files.doc_aadhaar[0].originalname,
        type: 'Identity',
        status: 'Under Review',
        fileUrl: files.doc_aadhaar[0].path,
        publicId: files.doc_aadhaar[0].filename,
        mimetype: files.doc_aadhaar[0].mimetype,
        uploadedAt: new Date()
      });
    }
    if (files.doc_pan) {
      user.documents.push({
        id: user.documents.length + 1,
        name: files.doc_pan[0].originalname,
        type: 'Identity',
        status: 'Under Review',
        fileUrl: files.doc_pan[0].path,
        publicId: files.doc_pan[0].filename,
        mimetype: files.doc_pan[0].mimetype,
        uploadedAt: new Date()
      });
    }

    if (files.selfie) {
      user.avatar = files.selfie[0].path;
    }

    user.onboarding_progress.current_step = 2;
    await user.save();

    res.json({ message: 'Step 1: Identity verification submitted successfully', onboarding_progress: user.onboarding_progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit Step 2: Qualification Verification
// @route   POST /api/teachers/onboarding/qualification
// @access  Private
router.post('/teachers/onboarding/qualification', protect, mapUserToTeacherId, uploadQualificationDocs, validateUploadSizes({
  doc_degree: 10 * 1024 * 1024,
  doc_professional: 10 * 1024 * 1024
}), async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const { degreeName, universityName, graduationYear, professionalCertName } = req.body;
    if (!degreeName || !universityName || !graduationYear) {
      return res.status(400).json({ message: 'Degree, University and Graduation Year are required' });
    }

    const currentYear = new Date().getFullYear();
    const gradYearNum = parseInt(graduationYear, 10);
    if (isNaN(gradYearNum) || gradYearNum < 1970 || gradYearNum > currentYear) {
      return res.status(400).json({ message: `Please enter a valid graduation year between 1970 and ${currentYear}` });
    }

    const files = req.files || {};
    if (!files.doc_degree && (!user.onboarding_progress?.step_2_qualification?.degreeUrl || user.onboarding_progress?.step_2_qualification?.degreeUrl === '')) {
      return res.status(400).json({ message: 'Degree certificate upload is required' });
    }

    const step2 = user.onboarding_progress?.step_2_qualification || {};
    const updatedStep2 = {
      status: 'Submitted',
      degreeName,
      universityName,
      graduationYear,
      degreeUrl: files.doc_degree ? files.doc_degree[0].path : step2.degreeUrl,
      professionalCertName: professionalCertName || step2.professionalCertName || '',
      professionalCertUrl: files.doc_professional ? files.doc_professional[0].path : step2.professionalCertUrl || '',
      rejectionReason: ''
    };

    if (files.doc_degree) {
      user.documents.push({
        id: user.documents.length + 1,
        name: files.doc_degree[0].originalname,
        type: 'Academic',
        status: 'Under Review',
        fileUrl: files.doc_degree[0].path,
        publicId: files.doc_degree[0].filename,
        mimetype: files.doc_degree[0].mimetype,
        uploadedAt: new Date()
      });
    }
    if (files.doc_professional) {
      user.documents.push({
        id: user.documents.length + 1,
        name: files.doc_professional[0].originalname,
        type: 'Academic',
        status: 'Under Review',
        fileUrl: files.doc_professional[0].path,
        publicId: files.doc_professional[0].filename,
        mimetype: files.doc_professional[0].mimetype,
        uploadedAt: new Date()
      });
    }

    user.onboarding_progress.step_2_qualification = updatedStep2;
    user.onboarding_progress.current_step = 3;
    user.qualifications = `${degreeName} from ${universityName} (${graduationYear})`;
    await user.save();

    res.json({ message: 'Step 2: Qualifications submitted successfully', onboarding_progress: user.onboarding_progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit Step 3: Competency Test Score
// @route   POST /api/teachers/onboarding/competency-test/submit
// @access  Private
router.post('/teachers/onboarding/competency-test/submit', protect, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    if (user.onboarding_progress && 
        (user.onboarding_progress.step_1_identity.status !== 'Verified' ||
         user.onboarding_progress.step_2_qualification.status !== 'Verified')) {
      return res.status(400).json({ message: 'Access denied: Step 3 (Test) and Step 4 (Video) are locked until Step 1 and Step 2 are verified by the admin.' });
    }

    const { subject, scorePercentage } = req.body;
    if (!subject || scorePercentage === undefined) {
      return res.status(400).json({ message: 'Subject and scorePercentage are required' });
    }

    const passingScore = 75;
    const passed = scorePercentage >= passingScore;

    const attempt = {
      subject,
      scorePercentage,
      passed,
      attemptedAt: new Date()
    };

    if (!user.onboarding_progress.step_3_competency) {
      user.onboarding_progress.step_3_competency = { status: 'Pending', testAttempts: [] };
    }

    user.onboarding_progress.step_3_competency.testAttempts.push(attempt);
    
    if (passed) {
      user.onboarding_progress.step_3_competency.status = 'Passed';
      user.onboarding_progress.current_step = 4;
      if (!user.subjects_taught.includes(subject)) {
        user.subjects_taught.push(subject);
      }
    } else {
      user.onboarding_progress.step_3_competency.status = 'Failed';
    }

    await user.save();

    res.json({
      message: passed ? 'Passed competency test! Step 4 unlocked.' : 'Did not meet passing score of 75%. Please try again.',
      passed,
      onboarding_progress: user.onboarding_progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit Step 4: Demo Class
// @route   POST /api/teachers/onboarding/demo-class
// @access  Private
router.post('/teachers/onboarding/demo-class', protect, mapUserToTeacherId, uploadDemoVideo, validateUploadSizes({
  demo_video: 50 * 1024 * 1024
}), async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    if (user.onboarding_progress && 
        (user.onboarding_progress.step_1_identity.status !== 'Verified' ||
         user.onboarding_progress.step_2_qualification.status !== 'Verified')) {
      return res.status(400).json({ message: 'Access denied: Step 3 (Test) and Step 4 (Video) are locked until Step 1 and Step 2 are verified by the admin.' });
    }

    const { targetGrade, topic, demoVideoUrl } = req.body;
    if (!targetGrade || !topic) {
      return res.status(400).json({ message: 'Target Grade and Topic are required' });
    }

    const files = req.files || {};
    let finalVideoUrl = demoVideoUrl || '';

    if (files.demo_video) {
      finalVideoUrl = files.demo_video[0].path;
    }

    if (!finalVideoUrl && (!user.onboarding_progress?.step_4_demo?.demoVideoUrl || user.onboarding_progress?.step_4_demo?.demoVideoUrl === '')) {
      return res.status(400).json({ message: 'A demo video upload or public video URL is required' });
    }

    user.onboarding_progress.step_4_demo = {
      status: 'Submitted',
      targetGrade,
      topic,
      demoVideoUrl: finalVideoUrl,
      feedback: ''
    };

    user.verification_status = 'Pending';
    await user.save();

    res.json({
      message: 'Demo class submitted! Your application is now under final administrative review.',
      onboarding_progress: user.onboarding_progress,
      verification_status: user.verification_status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify Step by Admin
// @route   POST /api/admin/teachers/:id/verify-step
// @access  Private (Admin)
router.post('/admin/teachers/:id/verify-step', protect, async (req, res) => {
  try {
    const { step, action, feedback } = req.body;
    const teacher = await User.findOne({ id: req.params.id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (!teacher.onboarding_progress) {
      return res.status(400).json({ message: 'Teacher onboarding progress not initialized' });
    }

    const newStatus = action === 'verify' ? 'Verified' : 'Rejected';

    if (step === 1) {
      teacher.onboarding_progress.step_1_identity.status = newStatus;
      teacher.onboarding_progress.step_1_identity.rejectionReason = feedback || '';
      if (action === 'reject') {
        teacher.onboarding_progress.current_step = 1;
        teacher.verification_status = 'Onboarding';
      }
    } else if (step === 2) {
      teacher.onboarding_progress.step_2_qualification.status = newStatus;
      teacher.onboarding_progress.step_2_qualification.rejectionReason = feedback || '';
      if (action === 'reject') {
        teacher.onboarding_progress.current_step = 2;
        teacher.verification_status = 'Onboarding';
      }
    } else if (step === 4) {
      teacher.onboarding_progress.step_4_demo.status = action === 'verify' ? 'Approved' : 'Rejected';
      teacher.onboarding_progress.step_4_demo.feedback = feedback || '';
      if (action === 'reject') {
        teacher.onboarding_progress.current_step = 4;
        teacher.verification_status = 'Onboarding';
      }
    }

    await teacher.save();
    res.json({ message: `Step ${step} status updated successfully`, onboarding_progress: teacher.onboarding_progress, verification_status: teacher.verification_status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve Teacher by Admin
// @route   POST /api/admin/teachers/:id/approve
// @access  Private (Admin)
router.post('/admin/teachers/:id/approve', protect, async (req, res) => {
  try {
    const teacher = await User.findOne({ id: req.params.id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.verification_status = 'Verified';
    if (teacher.onboarding_progress) {
      teacher.onboarding_progress.step_1_identity.status = 'Verified';
      teacher.onboarding_progress.step_2_qualification.status = 'Verified';
      teacher.onboarding_progress.step_3_competency.status = 'Passed';
      teacher.onboarding_progress.step_4_demo.status = 'Approved';
    }

    if (teacher.tempPassword) {
      try {
        await sendTeacherCredentialsEmail(teacher.name, teacher.email, teacher.tempPassword);
      } catch (e) {
        console.error('Credentials email error:', e);
      }
      teacher.tempPassword = null;
    }

    await teacher.save();
    res.json({ message: 'Teacher fully approved and verified successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// COGRAD CERTIFICATION PROGRAM ROUTES
// ============================================================

const CERTIFICATION_LECTURES = [
  // Month 1: Foundations of Teaching
  { id: 1, month: 1, title: 'Introduction to Modern Pedagogy', description: 'Understanding student-centric learning approaches and how modern pedagogy differs from traditional methods.', duration: '45 min' },
  { id: 2, month: 1, title: 'Understanding Child Psychology', description: 'Key developmental stages in children and how to adapt teaching strategies for different age groups.', duration: '50 min' },
  { id: 3, month: 1, title: 'Effective Lesson Planning', description: 'How to create structured, goal-driven lesson plans with learning objectives and assessments.', duration: '40 min' },
  { id: 4, month: 1, title: 'Communication Skills for Educators', description: 'Verbal and non-verbal communication techniques to engage students and build rapport with parents.', duration: '35 min' },
  // Month 2: Classroom Mastery
  { id: 5, month: 2, title: 'Classroom Management Techniques', description: 'Strategies for maintaining discipline, managing disruptions, and creating a positive learning environment.', duration: '50 min' },
  { id: 6, month: 2, title: 'Inclusive Education Practices', description: 'Teaching diverse learners including students with special needs, language barriers, and varying abilities.', duration: '45 min' },
  { id: 7, month: 2, title: 'Assessment & Evaluation Methods', description: 'Formative vs summative assessments, rubric design, and using data to track student progress.', duration: '55 min' },
  { id: 8, month: 2, title: 'Technology in Education', description: 'Leveraging EdTech tools, digital whiteboards, and online resources to enhance home tutoring sessions.', duration: '40 min' },
  // Month 3: Professional Excellence
  { id: 9, month: 3, title: 'Parent-Teacher Collaboration', description: 'Building effective partnerships with parents, conducting progress meetings, and managing expectations.', duration: '35 min' },
  { id: 10, month: 3, title: 'Motivation & Student Engagement', description: 'Intrinsic vs extrinsic motivation, gamification techniques, and keeping students focused during sessions.', duration: '45 min' },
  { id: 11, month: 3, title: 'Ethics & Professionalism in Teaching', description: 'Professional conduct, confidentiality, ethical decision-making, and CoGrad community standards.', duration: '30 min' },
  { id: 12, month: 3, title: 'Building Your Teaching Brand', description: 'Personal branding for tutors, collecting reviews, showcasing results, and growing your student base.', duration: '40 min' },
];

const CERTIFICATION_TEST_QUESTIONS = [
  { id: 1, question: 'What is the primary focus of student-centric pedagogy?', options: ['Teacher lectures', 'Student active participation', 'Textbook memorization', 'Strict discipline'], answer: 1 },
  { id: 2, question: 'According to Piaget, which stage involves abstract thinking?', options: ['Sensorimotor', 'Preoperational', 'Concrete operational', 'Formal operational'], answer: 3 },
  { id: 3, question: 'A well-structured lesson plan should always begin with?', options: ['Homework review', 'Learning objectives', 'Attendance check', 'Random questions'], answer: 1 },
  { id: 4, question: 'Which communication technique helps build rapport with shy students?', options: ['Loud instructions', 'Active listening', 'Ignoring them', 'Public questioning'], answer: 1 },
  { id: 5, question: 'What is the best strategy for managing classroom disruptions?', options: ['Shouting at students', 'Preventive planning and clear rules', 'Ignoring all behavior', 'Punishing immediately'], answer: 1 },
  { id: 6, question: 'Inclusive education means?', options: ['Teaching only gifted students', 'Excluding weak students', 'Accommodating all learning needs', 'Using one method for everyone'], answer: 2 },
  { id: 7, question: 'Formative assessment is conducted?', options: ['Only at year-end', 'During the learning process', 'Before admission', 'Never'], answer: 1 },
  { id: 8, question: 'Which EdTech tool is most useful for interactive home tutoring?', options: ['Fax machine', 'Digital whiteboard', 'Typewriter', 'Landline phone'], answer: 1 },
  { id: 9, question: 'How often should parent-teacher communication happen ideally?', options: ['Never', 'Once a year', 'Regularly throughout the term', 'Only during emergencies'], answer: 2 },
  { id: 10, question: 'Intrinsic motivation refers to?', options: ['External rewards', 'Punishment fear', 'Internal desire to learn', 'Parental pressure'], answer: 2 },
  { id: 11, question: 'Professional ethics for a tutor includes?', options: ['Sharing student data publicly', 'Maintaining confidentiality', 'Favoritism', 'Skipping sessions'], answer: 1 },
  { id: 12, question: 'Building a teaching brand involves?', options: ['Hiding your qualifications', 'Collecting reviews and showcasing results', 'Avoiding parents', 'Never updating your profile'], answer: 1 },
  { id: 13, question: 'What is Bloom\'s Taxonomy used for?', options: ['Grading students', 'Classifying learning objectives', 'Scheduling classes', 'Hiring teachers'], answer: 1 },
  { id: 14, question: 'The Zone of Proximal Development (ZPD) was proposed by?', options: ['Piaget', 'Vygotsky', 'Montessori', 'Dewey'], answer: 1 },
  { id: 15, question: 'Which is NOT a characteristic of effective feedback?', options: ['Specific', 'Timely', 'Vague and generic', 'Constructive'], answer: 2 },
  { id: 16, question: 'Differentiated instruction means?', options: ['Teaching the same way to all', 'Adapting teaching to individual needs', 'Only using lectures', 'Ignoring student differences'], answer: 1 },
  { id: 17, question: 'What is the ideal student-teacher ratio for home tutoring?', options: ['1:50', '1:1 to 1:5', '1:100', '1:30'], answer: 1 },
  { id: 18, question: 'Summative assessment examples include?', options: ['Quick class polls', 'Final exams and term papers', 'Entry tickets', 'Think-pair-share'], answer: 1 },
  { id: 19, question: 'Active learning strategies include?', options: ['Only lecturing', 'Group discussions and problem-solving', 'Silent reading only', 'Copying from the board'], answer: 1 },
  { id: 20, question: 'A growth mindset in students is encouraged by?', options: ['Praising effort over talent', 'Punishing mistakes', 'Comparing students', 'Fixed grading'], answer: 0 },
];

const CERT_PASS_THRESHOLD = 60; // 60 out of 100

// @desc    Get certification status for a teacher
// @route   GET /api/teachers/certification/status
// @access  Private
router.get('/teachers/certification/status', protect, async (req, res) => {
  try {
    const teacher = await User.findOne({ id: req.user.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const cert = teacher.certification || {};
    res.json({
      payment_status: cert.payment_status || 'unpaid',
      payment_date: cert.payment_date || null,
      completed_lectures: cert.completed_lectures || [],
      test_attempts: cert.test_attempts || [],
      is_certified: cert.is_certified || false,
      certified_at: cert.certified_at || null,
      total_lectures: CERTIFICATION_LECTURES.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get certification lectures with completion status
// @route   GET /api/teachers/certification/lectures
// @access  Private
router.get('/teachers/certification/lectures', protect, async (req, res) => {
  try {
    const teacher = await User.findOne({ id: req.user.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const cert = teacher.certification || {};
    if (cert.payment_status !== 'paid') {
      return res.status(403).json({ message: 'Payment required to access lectures' });
    }

    const completedIds = cert.completed_lectures || [];
    const lectures = CERTIFICATION_LECTURES.map(l => ({
      ...l,
      completed: completedIds.includes(l.id)
    }));

    res.json({ lectures, completed_count: completedIds.length, total: CERTIFICATION_LECTURES.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Record ₹499 certification payment (simulated)
// @route   POST /api/teachers/certification/pay
// @access  Private
router.post('/teachers/certification/pay', protect, async (req, res) => {
  try {
    const teacher = await User.findOne({ id: req.user.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    if (teacher.certification && teacher.certification.payment_status === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    const txnId = 'CG-CERT-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

    if (!teacher.certification) teacher.certification = {};
    teacher.certification.payment_status = 'paid';
    teacher.certification.payment_date = new Date();
    teacher.certification.payment_transaction_id = txnId;
    teacher.markModified('certification');
    await teacher.save();

    res.json({ message: 'Payment recorded successfully', transaction_id: txnId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark a lecture as completed
// @route   POST /api/teachers/certification/complete-lecture
// @access  Private
router.post('/teachers/certification/complete-lecture', protect, async (req, res) => {
  try {
    const { lectureId } = req.body;
    if (!lectureId) return res.status(400).json({ message: 'lectureId is required' });

    const teacher = await User.findOne({ id: req.user.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const cert = teacher.certification || {};
    if (cert.payment_status !== 'paid') {
      return res.status(403).json({ message: 'Payment required' });
    }

    const validLecture = CERTIFICATION_LECTURES.find(l => l.id === lectureId);
    if (!validLecture) return res.status(400).json({ message: 'Invalid lecture ID' });

    if (!teacher.certification) teacher.certification = {};
    const completed = teacher.certification.completed_lectures || [];
    if (!completed.includes(lectureId)) {
      completed.push(lectureId);
      teacher.certification.completed_lectures = completed;
      teacher.markModified('certification');
      await teacher.save();
    }

    res.json({ message: 'Lecture marked as completed', completed_lectures: completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit certification test answers
// @route   POST /api/teachers/certification/submit-test
// @access  Private
router.post('/teachers/certification/submit-test', protect, async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: selectedOptionIndex, ... }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Answers object is required' });
    }

    const teacher = await User.findOne({ id: req.user.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const cert = teacher.certification || {};
    if (cert.payment_status !== 'paid') {
      return res.status(403).json({ message: 'Payment required' });
    }

    const completed = cert.completed_lectures || [];
    if (completed.length < CERTIFICATION_LECTURES.length) {
      return res.status(403).json({ message: 'Complete all lectures before taking the test' });
    }

    if (cert.is_certified) {
      return res.status(400).json({ message: 'You are already certified' });
    }

    // Grade the test: 5 marks per correct answer = 100 total
    let correctCount = 0;
    const results = CERTIFICATION_TEST_QUESTIONS.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.answer;
      if (isCorrect) correctCount++;
      return { questionId: q.id, selected, correct: q.answer, isCorrect };
    });

    const score = correctCount * 5;
    const passed = score >= CERT_PASS_THRESHOLD;

    if (!teacher.certification) teacher.certification = {};
    if (!teacher.certification.test_attempts) teacher.certification.test_attempts = [];
    teacher.certification.test_attempts.push({
      score,
      total: 100,
      passed,
      attemptedAt: new Date()
    });

    if (passed) {
      teacher.certification.is_certified = true;
      teacher.certification.certified_at = new Date();
    }

    teacher.markModified('certification');
    await teacher.save();

    res.json({ score, total: 100, passed, correctCount, totalQuestions: 20, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
router.get('/teachers', protect, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get teacher by custom ID
// @route   GET /api/teachers/:id
// @access  Private
router.get('/teachers/:id', protect, async (req, res) => {
  try {
    const teacher = await User.findOne({ id: req.params.id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Private
router.post('/teachers', protect, async (req, res) => {
  try {
    const teacherData = {
      ...req.body,
      id: req.body.id || `teacher_${Date.now()}`,
      role: 'teacher',
    };

    if (!teacherData.password) {
      teacherData.password = 'password';
    }

    const teacher = await User.create(teacherData);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const sendTeacherCredentialsEmail = async (name, email, password) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://cograd-pathshala-frontend.vercel.app';
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 12px; background-color: #fff;">
      <h2 style="color: #2563eb; font-weight: 800; margin-bottom: 20px;">Welcome to Cograd Pathshala!</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>Congratulations! Your application to join Cograd Pathshala as a teacher has been verified and approved by our admin team.</p>
      <p>Here are your login credentials:</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-family: monospace; border: 1px solid #e2e8f0; margin: 15px 0; line-height: 1.6;">
        <strong>Login URL:</strong> <a href="${frontendUrl}/login" style="color: #2563eb; text-decoration: none;">${frontendUrl}/login</a><br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Password:</strong> ${password}
      </div>
      <p>Please log in to your dashboard to set up your profile, manage your slots, and view student requests.</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5;">Best regards,<br/>Cograd Pathshala Admin Team</p>
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
        subject: `Welcome to Cograd Pathshala - Approved Account: ${name}`,
        html: htmlContent
      })
    });
    const result = await response.json();
    console.log('Resend email sent:', result);
  } catch (err) {
    console.error('Failed to send approved credentials email via Resend:', err);
  }
};

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private
router.put('/teachers/:id', protect, async (req, res) => {
  try {
    const teacher = await User.findOne({ id: req.params.id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const oldVerificationStatus = teacher.verification_status;

    Object.keys(req.body).forEach((key) => {
      teacher[key] = req.body[key];
    });

    // Check if verification status transitioned to 'Verified'
    if (oldVerificationStatus === 'Pending' && teacher.verification_status === 'Verified' && teacher.tempPassword) {
      sendTeacherCredentialsEmail(teacher.name, teacher.email, teacher.tempPassword);
      teacher.tempPassword = null; // Clear plain-text password for security
    }

    const updatedTeacher = await teacher.save();
    res.json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private
router.delete('/teachers/:id', protect, async (req, res) => {
  try {
    const teacher = await User.findOneAndDelete({ id: req.params.id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    // Also delete any assignments for this teacher
    await Assignment.deleteMany({ teacher_id: req.params.id });
    res.json({ message: 'Teacher removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ASSIGNMENT ROUTES
// ==========================================

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
router.get('/assignments', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Allot tutor (Admin Action)
// @route   POST /api/assignments/allot
// @access  Private
router.post('/assignments/allot', protect, async (req, res) => {
  const { studentId, teacherId } = req.body;

  try {
    const student = await User.findOne({ id: studentId, role: 'student' });
    const teacher = await User.findOne({ id: teacherId, role: 'teacher' });

    if (!student || !teacher) {
      return res.status(404).json({ message: 'Student or Teacher not found' });
    }

    // End other active or proposed assignments for this student
    await Assignment.updateMany(
      { student_id: studentId, teacher_id: { $ne: teacherId }, status: { $in: ['proposed', 'active'] } },
      { status: 'ended' }
    );

    // Update Student
    student.assigned_teacher_id = teacherId;
    student.status = 'matched'; // Assigned but pending teacher confirmation
    await student.save();

    // Create Assignment
    const newAssignment = await Assignment.create({
      id: `asg_${studentId}_${Date.now()}`,
      student_id: studentId,
      teacher_id: teacherId,
      assigned_by: req.user.id,
      status: 'proposed',
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Confirm/Reject tutor availability (Teacher Action)
// @route   PUT /api/assignments/status
// @access  Private
router.put('/assignments/status', protect, async (req, res) => {
  const { studentId, teacherId, accept } = req.body;

  try {
    const assignment = await Assignment.findOne({
      student_id: studentId,
      teacher_id: teacherId,
      status: 'proposed',
    });
    const student = await User.findOne({ id: studentId, role: 'student' });
    const teacher = await User.findOne({ id: teacherId, role: 'teacher' });

    if (!assignment || !student || !teacher) {
      return res.status(404).json({ message: 'Proposed assignment or users not found' });
    }

    if (accept) {
      assignment.status = 'active';
      student.status = 'active';
      teacher.current_student_count = (teacher.current_student_count || 0) + 1;
    } else {
      assignment.status = 'ended';
      student.status = 'pending_match';
      student.assigned_teacher_id = null;
    }

    await assignment.save();
    await student.save();
    await teacher.save();

    // Synchronize status back to DemoBooking if one exists for the student
    if (student.parentPhone) {
      const demoBooking = await DemoBooking.findOne({
        parentPhone: student.parentPhone,
        assigned_teacher_id: teacherId,
        status: 'pending_teacher_acceptance'
      });
      if (demoBooking) {
        demoBooking.status = accept ? 'confirmed' : 'declined';
        await demoBooking.save();
      }
    }

    res.json({ message: 'Assignment status updated successfully', assignment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// SUGGESTED MATCH ROUTE
// ==========================================

// @desc    Find suggested teachers for a student
// @route   GET /api/teachers/suggested/:studentId
// @access  Private
router.get('/teachers/suggested/:studentId', protect, async (req, res) => {
  try {
    const student = await User.findOne({ id: req.params.studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If student is not matching eligible, return empty array (waitlist)
    if (student.matching_eligible === false) {
      return res.json([]);
    }

    const teachers = await User.find({ role: 'teacher' });
    const studentGrade = student.standard ? student.standard.split(' ')[0] : 'Class 10';

    // Filter teachers
    const eligibleTeachers = teachers.filter((t) => {
      // 1. City Match (case-insensitive) — cheapest filter, runs first
      if (!t.city || !student.city || t.city.toLowerCase() !== student.city.toLowerCase()) return false;

      // 2. Verification Check
      if (t.verification_status !== 'Verified') return false;

      // 3. Capacity Check
      if ((t.current_student_count || 0) >= (t.max_student_capacity || 5)) return false;

      // 4. Subject Match
      const hasSubjectMatch = student.subjects.some((sub) =>
        t.subjects_taught.some((ts) => ts.toLowerCase() === sub.toLowerCase())
      );
      if (!hasSubjectMatch) return false;

      // 5. Grade level Qualification Match
      const isGradeQualified = t.grade_levels_qualified.some(
        (g) => g.toLowerCase() === studentGrade.toLowerCase()
      );
      if (!isGradeQualified) return false;

      return true;
    });

    // Score & Rank Eligible Teachers
    const rankedTeachers = eligibleTeachers.map((t) => {
      let score = 0;
      const reasons = [];

      // Calculate average student score
      let totalScoreSum = 0;
      let scoreCount = 0;
      if (student.test_score) {
        Object.keys(student.test_score).forEach((sub) => {
          if (typeof student.test_score[sub] === 'number') {
            totalScoreSum += student.test_score[sub];
            scoreCount++;
          }
        });
      }
      const avgStudentScore = scoreCount > 0 ? totalScoreSum / scoreCount : 50;

      // Score-band match (max 10 points)
      if (avgStudentScore < 60) {
        if (t.teaching_style === 'beginner') {
          score += 10;
          reasons.push('Strong with beginner-level support');
        } else if (t.teaching_style === 'intermediate') {
          score += 5;
          reasons.push('Intermediate support fit');
        }
      } else if (avgStudentScore >= 80) {
        if (t.teaching_style === 'advanced') {
          score += 10;
          reasons.push('Ideal for advanced material');
        } else if (t.teaching_style === 'intermediate') {
          score += 5;
          reasons.push('Solid foundations support');
        }
      } else {
        if (t.teaching_style === 'intermediate') {
          score += 10;
          reasons.push('Strong general foundations focus');
        } else {
          score += 5;
          reasons.push('General capability fit');
        }
      }

      // Load balancing match (max 10 points)
      const openSlots = (t.max_student_capacity || 5) - (t.current_student_count || 0);
      const availabilityScore = openSlots * 2;
      score += availabilityScore;
      reasons.push(`High availability (${openSlots} slots open)`);

      // Locality Match (max 30 points)
      if (student.locality && t.locality && student.locality.trim().toLowerCase() === t.locality.trim().toLowerCase()) {
        score += 30;
        reasons.push(`Mutual Location Match: Same locality (${student.locality})`);
      } else {
        const studentLoc = student.locality || 'N/A';
        const teacherLoc = t.locality || 'N/A';
        reasons.push(`Same City (${student.city}) but different locality (Student: ${studentLoc}, Tutor: ${teacherLoc})`);
      }

      // Match percentage (max 100%)
      const compatibilityPercent = Math.min(100, Math.round((score / 50) * 100));

      return {
        teacher: t,
        score: compatibilityPercent,
        reasons: reasons,
      };
    });

    // Sort by score descending
    rankedTeachers.sort((a, b) => b.score - a.score);

    res.json(rankedTeachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// PARENT ROUTES
// ==========================================

// @desc    Get all parents
// @route   GET /api/parents
// @access  Private
router.get('/parents', protect, async (req, res) => {
  try {
    const parents = await User.find({ role: 'parent' });
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/parents/children', protect, async (req, res) => {
  try {
    // Match students where parentPhone matches the logged-in user's phone
    let children = await User.find({
      role: 'student',
      parentPhone: req.user.phone
    });

    if (children.length === 0 && req.user.childName) {
      // Return a dynamically constructed student record based on parent's child fields
      children = [{
        id: `stu_${req.user.id}_child`,
        name: req.user.childName,
        role: 'student',
        standard: req.user.childStandard,
        subjects: req.user.childSubjects,
        city: req.user.childCity,
        locality: req.user.childLocality,
        tuitionMode: req.user.childTuitionMode,
        matching_eligible: req.user.childMatchingEligible,
        test_score: req.user.test_score, // parent's test_score is the child's score
        test_completed_at: req.user.test_completed_at,
        status: req.user.status,
        parentName: req.user.name,
        parentPhone: req.user.phone,
        address: `House No. 101, Near Main Chowk, ${req.user.childCity}`
      }];
    }

    res.json(children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a parent
// @route   PUT /api/parents/:id
// @access  Private
router.put('/parents/:id', protect, async (req, res) => {
  try {
    const parent = await User.findOne({ id: req.params.id, role: 'parent' });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      parent[key] = req.body[key];
    });

    const updatedParent = await parent.save();
    res.json(updatedParent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// ASSIGNMENT FILTER ROUTES
// ==========================================

// @desc    Get assignments for a specific student
// @route   GET /api/assignments/student/:studentId
// @access  Private
router.get('/assignments/student/:studentId', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ student_id: req.params.studentId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get assignments for a specific teacher
// @route   GET /api/assignments/teacher/:teacherId
// @access  Private
router.get('/assignments/teacher/:teacherId', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher_id: req.params.teacherId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// SIMULATION RESET ROUTE
// ==========================================

// @desc    Reset simulation state for a student
// @route   POST /api/students/reset
// @access  Private
router.post('/students/reset', protect, async (req, res) => {
  const { studentId, targetStatus } = req.body;
  const statusToSet = targetStatus || 'pending_test';

  try {
    const student = await User.findOne({ id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const currentTeacherId = student.assigned_teacher_id;

    // Reset student fields
    student.assigned_teacher_id = null;
    student.status = statusToSet;

    if (statusToSet === 'pending_test') {
      student.test_score = null;
      student.test_completed_at = null;
    }

    await student.save();

    // If teacher had this student active, decrement count
    if (currentTeacherId) {
      const teacher = await User.findOne({ id: currentTeacherId, role: 'teacher' });
      if (teacher) {
        teacher.current_student_count = Math.max(0, (teacher.current_student_count || 0) - 1);
        await teacher.save();
      }
    }

    // Delete or end assignments for this student
    await Assignment.deleteMany({ student_id: studentId });

    res.json({ message: 'Simulation state reset successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// DEMO BOOKING ROUTES
// ==========================================

// @desc    Book a free demo (Public Route)
// @route   POST /api/demo-bookings
// @access  Public
router.post('/demo-bookings', async (req, res) => {
  try {
    const {
      studentName,
      parentPhone,
      studentClass,
      subjects,
      preferredDate,
      preferredTime,
      preferredDays,
      district,
      villageArea,
      landmark,
    } = req.body;

    const refCode = 'DEMO-' + Math.floor(100000 + Math.random() * 900000);

    let assignedTeacherId = req.body.assigned_teacher_id || req.body.teacherId || null;

    if (!assignedTeacherId) {
      // 1. Find verified teachers in nearby location (matching city)
      const teachers = await User.find({ role: 'teacher', verification_status: 'Verified' });
      const targetCity = mapDistrictToCity(district);

      let eligibleTeachers = teachers.filter((t) => {
        return t.city && t.city.toLowerCase() === targetCity;
      });

      if (eligibleTeachers.length > 0) {
        // Score and rank teachers to pick the best match
        const ranked = eligibleTeachers.map((t) => {
          let score = 0;
          // Subject match
          const hasSubjectMatch = subjects.some((sub) =>
            t.subjects_taught && t.subjects_taught.some((ts) => ts.toLowerCase() === sub.toLowerCase())
          );
          if (hasSubjectMatch) score += 10;

          // Grade match
          const isGradeQualified = t.grade_levels_qualified && t.grade_levels_qualified.some(
            (g) => g.toLowerCase() === studentClass.toLowerCase()
          );
          if (isGradeQualified) score += 10;

          // Rating
          score += (t.rating || 5.0) * 2;

          // Capacity
          if ((t.current_student_count || 0) < (t.max_student_capacity || 5)) {
            score += 5;
          }

          return { id: t.id, score };
        });

        ranked.sort((a, b) => b.score - a.score);
        assignedTeacherId = ranked[0].id;
      }
    }

    const demoBooking = await DemoBooking.create({
      id: refCode,
      studentName,
      parentPhone,
      studentClass,
      subjects,
      preferredDate,
      preferredTime,
      preferredDays,
      district,
      villageArea,
      landmark,
      assigned_teacher_id: assignedTeacherId,
      status: 'pending_admin_confirmation',
    });

    // 1. Create Admin Notification
    await Notification.create({
      id: 'ntf_' + Date.now(),
      text: `New Demo Booking Request (${refCode}) submitted for student: ${studentName}`,
      time: 'Just now',
      isNew: true
    });

    // 2. Dispatch SMS / WhatsApp reminder if configured
    const settings = await AdminSettings.findOne({ key: 'main' });
    if (settings && settings.autoReminders && parentPhone) {
      const msgText = `Hello! We have received your demo booking request (Ref: ${refCode}) for ${studentName} (${studentClass}). Our team will confirm the timing shortly. Thank you!`;
      if (settings.whatsappSync) {
        await sendWhatsApp(parentPhone, msgText);
      } else {
        await sendSMS(parentPhone, msgText);
      }
    }

    res.status(201).json(demoBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all demo bookings (Admin Route)
// @route   GET /api/demo-bookings
// @access  Private
router.get('/demo-bookings', protect, async (req, res) => {
  try {
    const bookings = await DemoBooking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get demo bookings for logged-in student/parent
// @route   GET /api/demo-bookings/my-bookings
// @access  Private (User)
router.get('/demo-bookings/my-bookings', protect, async (req, res) => {
  try {
    const phones = [req.user.phone, req.user.parentPhone].filter(Boolean);
    const bookings = await DemoBooking.find({
      parentPhone: { $in: phones }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Confirm/Assign demo booking (Admin Route)
// @desc    Confirm/Assign demo booking (Admin Route)
// @route   PUT /api/demo-bookings/:id/confirm
// @access  Private
router.put('/demo-bookings/:id/confirm', protect, async (req, res) => {
  try {
    const booking = await DemoBooking.findOne({ id: req.params.id });
    if (!booking) {
      return res.status(404).json({ message: 'Demo booking not found' });
    }

    const { teacherId } = req.body;
    if (teacherId) {
      booking.assigned_teacher_id = teacherId;
    }
    booking.status = 'pending_teacher_acceptance';
    await booking.save();

    // 1. Notify Student/Parent & Create Assignment & Update student matching details
    const studentUsers = await User.find({
      $or: [{ phone: booking.parentPhone }, { parentPhone: booking.parentPhone }],
      role: 'student'
    });

    for (const student of studentUsers) {
      // End other active or proposed assignments for this student
      await Assignment.updateMany(
        { student_id: student.id, teacher_id: { $ne: teacherId }, status: { $in: ['proposed', 'active'] } },
        { status: 'ended' }
      );

      student.assigned_teacher_id = teacherId;
      student.status = 'matched'; // Assigned but pending teacher confirmation

      if (!student.notifications) student.notifications = [];
      student.notifications.push({
        id: 'ntf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        text: `Your demo booking for ${booking.subjects.join(', ')} has been approved by Admin and is pending tutor acceptance.`,
        isNew: true,
        time: 'Just now',
        createdAt: new Date()
      });
      await student.save();

      // Create Assignment if it doesn't already exist
      const existingAssignment = await Assignment.findOne({
        student_id: student.id,
        teacher_id: teacherId,
        status: 'proposed'
      });
      if (!existingAssignment) {
        await Assignment.create({
          id: `asg_${student.id}_${Date.now()}`,
          student_id: student.id,
          teacher_id: teacherId,
          assigned_by: req.user.id,
          status: 'proposed',
        });
      }
    }

    // 2. Notify Teacher
    if (teacherId) {
      const teacherUser = await User.findOne({ id: teacherId, role: 'teacher' });
      if (teacherUser) {
        if (!teacherUser.notifications) teacherUser.notifications = [];
        teacherUser.notifications.push({
          id: 'ntf_' + Date.now() + '_tch',
          text: `You have been assigned a new demo class request for student: ${booking.studentName} (${booking.studentClass}) in ${booking.villageArea}. Please accept or decline the request.`,
          isNew: true,
          time: 'Just now',
          createdAt: new Date()
        });
        await teacherUser.save();
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get demo bookings for a specific teacher
// @route   GET /api/demo-bookings/teacher/:teacherId
// @access  Private
router.get('/demo-bookings/teacher/:teacherId', protect, async (req, res) => {
  try {
    const bookings = await DemoBooking.find({
      assigned_teacher_id: req.params.teacherId,
      status: { $ne: 'pending_admin_confirmation' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Teacher accept/decline demo booking
// @route   PUT /api/demo-bookings/:id/status
// @access  Private
router.put('/demo-bookings/:id/status', protect, async (req, res) => {
  try {
    const booking = await DemoBooking.findOne({ id: req.params.id });
    if (!booking) {
      return res.status(404).json({ message: 'Demo booking not found' });
    }

    const { accept, status } = req.body;
    if (status) {
      booking.status = status;
    } else if (accept !== undefined) {
      booking.status = accept ? 'confirmed' : 'declined';
    }

    await booking.save();

    // Update corresponding student and assignment status in MongoDB
    const studentUsers = await User.find({
      $or: [{ phone: booking.parentPhone }, { parentPhone: booking.parentPhone }],
      role: 'student'
    });

    for (const student of studentUsers) {
      const assignment = await Assignment.findOne({
        student_id: student.id,
        teacher_id: booking.assigned_teacher_id,
        status: 'proposed'
      });

      if (booking.status === 'confirmed') {
        student.status = 'active';
        if (assignment) {
          assignment.status = 'active';
          await assignment.save();
        }
        const teacher = await User.findOne({ id: booking.assigned_teacher_id, role: 'teacher' });
        if (teacher) {
          teacher.current_student_count = (teacher.current_student_count || 0) + 1;
          await teacher.save();
        }
      } else if (booking.status === 'declined') {
        student.status = 'pending_match';
        student.assigned_teacher_id = null;
        if (assignment) {
          assignment.status = 'ended';
          await assignment.save();
        }
      }
      
      if (!student.notifications) student.notifications = [];
      const isConfirmed = booking.status === 'confirmed';
      student.notifications.push({
        id: 'ntf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        text: isConfirmed 
          ? `Congratulations! Your demo class for ${booking.subjects.join(', ')} on ${booking.preferredDate} at ${booking.preferredTime} has been CONFIRMED by tutor.` 
          : `Your demo class request for ${booking.subjects.join(', ')} was declined by the assigned tutor. Admin will assign a different tutor shortly.`,
        isNew: true,
        time: 'Just now',
        createdAt: new Date()
      });
      await student.save();
    }

    // 2. Create Admin Notification
    await Notification.create({
      id: 'ntf_' + Date.now(),
      text: `Demo Booking (${booking.id}) status updated to ${booking.status.toUpperCase()} by teacher for student: ${booking.studentName}`,
      time: 'Just now',
      isNew: true
    });

    // 2. Dispatch SMS / WhatsApp reminder if confirmed and configured
    const settings = await AdminSettings.findOne({ key: 'main' });
    if (settings && settings.autoReminders && booking.parentPhone) {
      const isConfirmed = booking.status === 'confirmed';
      const msgText = isConfirmed 
        ? `Hello! Your demo class for student ${booking.studentName} has been CONFIRMED by the tutor for ${booking.preferredDate} at ${booking.preferredTime}. Thank you!`
        : `Hello. The demo booking request for student ${booking.studentName} was declined or updated by the tutor (Status: ${booking.status}). Our admin team will reach out to reschedule.`;
      
      if (settings.whatsappSync) {
        await sendWhatsApp(booking.parentPhone, msgText);
      } else {
        await sendSMS(booking.parentPhone, msgText);
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Submit student attendance sheet (Teacher Action)
// @route   POST /api/attendance
// @access  Private
router.post('/attendance', protect, async (req, res) => {
  const { teacherId, date, records } = req.body;

  try {
    if (!teacherId) {
      return res.status(400).json({ message: 'Missing required field: teacherId' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Missing required field: date' });
    }
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Missing or invalid field: records (must be an array)' });
    }

    const teacherObj = await User.findOne({ id: teacherId, role: 'teacher' });
    if (!teacherObj) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await Promise.all(
      records.map(async (rec) => {
        const student = await User.findOne({ id: rec.studentId, role: 'student' });
        if (!student) return;

        const newLogItem = {
          date,
          status: rec.present ? 'Present' : 'Absent',
          markedBy: teacherObj.name
        };

        const oldLogs = student.attendance_log || [];
        // Prevent duplicate logs for the same day
        const filteredLogs = oldLogs.filter((log) => log.date !== date);
        const newLogs = [...filteredLogs, newLogItem];

        // Compute new attendance percentage
        const presentCount = newLogs.filter((log) => log.status === 'Present').length;
        const computedPct = Math.round((presentCount / newLogs.length) * 100) + '%';

        student.attendance = computedPct;
        student.attendance_log = newLogs;
        
        await student.save();
      })
    );

    res.json({ message: 'Attendance sheet marked and updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Call AI Chat completions (using Nvidia API Key)
// @route   POST /api/ai/chat
// @access  Private
router.post('/ai/chat', protect, async (req, res) => {
  const { question, history } = req.body;
  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  try {
    const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
    const bearerToken = process.env.NVIDIA_API_KEY || "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";

    // Format chat message history for Nvidia completions API
    const messages = [
      {
        role: "system",
        content: "You are a helpful, expert AI tutor for school students preparing for exams like NCERT/JEE. Explain concepts clearly with derivations if necessary. Support markdown formatting."
      }
    ];

    if (history && Array.isArray(history)) {
      history.forEach((h) => {
        if (h.question) messages.push({ role: "user", content: h.question });
        if (h.answer) messages.push({ role: "assistant", content: h.answer });
      });
    }

    messages.push({ role: "user", content: question });

    const payload = {
      model: "google/diffusiongemma-26b-a4b-it",
      messages: messages,
      max_tokens: 4096,
      temperature: 1.00,
      top_p: 0.95,
      stream: false,
      chat_template_kwargs: { enable_thinking: true }
    };

    const response = await fetch(invokeUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Nvidia API failure response:', data);
      throw new Error(data.message || `API error (status ${response.status})`);
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const answer = data.choices[0].message.content;
      res.json({ answer });
    } else {
      throw new Error('Invalid response structure from Nvidia API');
    }
  } catch (error) {
    console.error('AI chat endpoint error:', error.message);
    res.status(500).json({ message: error.message || 'AI service is currently offline. Please try again later.' });
  }
});

// @desc    Submit a new support ticket (Student, Teacher, Parent)
// @route   POST /api/support-tickets
router.post('/support-tickets', async (req, res) => {
  try {
    const { userId, userName, userRole, title, description, category } = req.body;
    if (!userId || !userName || !userRole || !title || !description) {
      return res.status(400).json({ message: 'All fields (userId, userName, userRole, title, description) are required.' });
    }

    const ticketId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);
    const ticket = new SupportTicket({
      id: ticketId,
      userId,
      userName,
      userRole,
      title,
      description,
      category: category || 'General Support',
      status: 'Pending'
    });

    await ticket.save();

    // 1. Create Admin Notification
    await Notification.create({
      id: 'ntf_' + Date.now(),
      text: `Support Ticket (${ticketId}) created by ${userName} (${userRole}): "${title}"`,
      time: 'Just now',
      isNew: true
    });

    res.status(201).json({ message: 'Support ticket submitted successfully.', ticket });
  } catch (error) {
    console.error('Submit ticket error:', error);
    res.status(500).json({ message: 'Server error while submitting support ticket.' });
  }
});

// @desc    Get all support tickets
// @route   GET /api/support-tickets
router.get('/support-tickets', async (req, res) => {
  try {
    const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error('Fetch tickets error:', error);
    res.status(500).json({ message: 'Server error while fetching support tickets.' });
  }
});

// @desc    Resolve a support ticket
// @route   POST /api/support-tickets/:id/resolve
router.post('/support-tickets/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findOne({ id });
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found.' });
    }
    ticket.status = 'Resolved';
    await ticket.save();
    res.json({ message: 'Support ticket resolved successfully.', ticket });
  } catch (error) {
    console.error('Resolve ticket error:', error);
    res.status(500).json({ message: 'Server error while resolving support ticket.' });
  }
});

// ==========================================
// PAYMENT ROUTES
// ==========================================

// @desc    Get all payment records
// @route   GET /api/payments
// @access  Private
router.get('/payments', protect, async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Record a new payment
// @route   POST /api/payments
// @access  Private
router.post('/payments', protect, async (req, res) => {
  try {
    const { studentId, studentName, amount, method } = req.body;
    if (!studentId || !studentName || !amount) {
      return res.status(400).json({ message: 'studentId, studentName, and amount are required.' });
    }
    const paymentId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
    const payment = await Payment.create({
      id: paymentId,
      studentId,
      studentName,
      amount,
      method: method || 'Cash / Manual',
      status: 'Paid',
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'admin',
    });

    // 1. Create Admin Notification
    await Notification.create({
      id: 'ntf_' + Date.now(),
      text: `Payment of ₹${parseFloat(amount).toLocaleString('en-IN')} recorded for student: ${studentName}`,
      time: 'Just now',
      isNew: true
    });

    // 2. Dispatch SMS / WhatsApp reminder if configured
    const studentUser = await User.findOne({ id: studentId });
    if (studentUser) {
      studentUser.feeDue = 0;
      studentUser.feeStatus = 'Paid';
      studentUser.feeDueDate = 'Paid on ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const updatedActivities = [
        {
          id: 'pay_' + Date.now(),
          text: `Tuition fee payment of ₹${parseFloat(amount).toLocaleString('en-IN')} recorded by Admin via ${method || 'Cash / Manual'}`,
          time: 'Just now',
          tag: 'Billing',
          type: 'success'
        },
        ...(studentUser.activities || [])
      ];
      studentUser.activities = updatedActivities;
      await studentUser.save();

      // Automatically log earning for assigned teacher
      await addEarningToTeacher(studentId, studentName, amount, method);
    }

    const phone = studentUser ? studentUser.phone : null;
    const settings = await AdminSettings.findOne({ key: 'main' });
    if (settings && settings.autoReminders && phone) {
      const msgText = `Hello! A tuition payment of ₹${parseFloat(amount).toLocaleString('en-IN')} has been recorded successfully for ${studentName} via ${method || 'Cash / Manual'}. Thank you!`;
      if (settings.whatsappSync) {
        await sendWhatsApp(phone, msgText);
      } else {
        await sendSMS(phone, msgText);
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay-order
// @access  Private
router.post('/payments/razorpay-order', protect, async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    if (!studentId || !amount) {
      return res.status(400).json({ message: 'studentId and amount are required' });
    }

    const student = await User.findOne({ id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const orderAmount = Math.round(parseFloat(amount) * 100); // Razorpay expects amount in paisa

    const options = {
      amount: orderAmount,
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
      notes: {
        studentId: studentId,
        studentName: student.name,
      }
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('[Razorpay Order Creation Error]', error);
    res.status(500).json({ message: error.message || 'Failed to create Razorpay order' });
  }
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/razorpay-verify
// @access  Private
router.post('/payments/razorpay-verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentId,
      amount
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !studentId || !amount) {
      return res.status(400).json({ message: 'Missing required parameters for verification' });
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mockKeySecret12345';
    const shasum = crypto.createHmac('sha256', keySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: Signature mismatch.' });
    }

    // Signature verified! Process payment updates
    const student = await User.findOne({ id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 1. Create a Payment record
    const paymentId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
    await Payment.create({
      id: paymentId,
      studentId,
      studentName: student.name,
      amount: String(amount),
      method: 'Card / UPI (Razorpay)',
      status: 'Paid',
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'Razorpay Verification'
    });

    // 2. Update Student fee details
    student.feeDue = 0;
    student.feeStatus = 'Paid';
    student.feeDueDate = 'Paid on ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    const updatedActivities = [
      {
        id: 'pay_' + Date.now(),
        text: `Paid Tuition fee of ₹${parseFloat(amount).toLocaleString('en-IN')} successfully via Razorpay (Ref: ${razorpay_payment_id})`,
        time: 'Just now',
        tag: 'Billing',
        type: 'success'
      },
      ...(student.activities || [])
    ];
    student.activities = updatedActivities;
    await student.save();

    // Automatically log earning for assigned teacher
    await addEarningToTeacher(studentId, student.name, amount, 'Razorpay');

    // 3. Create Admin Notification
    await Notification.create({
      id: 'ntf_' + Date.now(),
      text: `Fee payment of ₹${parseFloat(amount).toLocaleString('en-IN')} received via Razorpay for student: ${student.name}`,
      time: 'Just now',
      isNew: true
    });

    // 4. Dispatch SMS / WhatsApp reminder if configured
    const settings = await AdminSettings.findOne({ key: 'main' });
    if (settings && settings.autoReminders && student.phone) {
      const msgText = `Hello! A tuition payment of ₹${parseFloat(amount).toLocaleString('en-IN')} has been received successfully for ${student.name} via Razorpay. Thank you!`;
      if (settings.whatsappSync) {
        await sendWhatsApp(student.phone, msgText);
      } else {
        await sendSMS(student.phone, msgText);
      }
    }

    res.json({ verified: true, message: 'Payment successfully verified and recorded.' });
  } catch (error) {
    console.error('[Razorpay Verification Error]', error);
    res.status(500).json({ message: error.message || 'Internal server error during verification' });
  }
});

// @desc    Delete a payment record
// @route   DELETE /api/payments/:id
// @access  Private
router.delete('/payments/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ id: req.params.id });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ANNOUNCEMENT ROUTES
// ==========================================

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
router.get('/announcements', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private
router.post('/announcements', protect, async (req, res) => {
  try {
    const { title, text, target, priority } = req.body;
    if (!title || !text) {
      return res.status(400).json({ message: 'title and text are required.' });
    }
    const announcementId = 'ANN-' + Math.floor(100000 + Math.random() * 900000);
    const announcement = await Announcement.create({
      id: announcementId,
      title,
      text,
      target: target || 'All Students & Teachers',
      priority: priority || 'Medium',
      date: new Date().toISOString().split('T')[0],
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private
router.delete('/announcements/:id', protect, async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndDelete({ id: req.params.id });
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ENQUIRY / CRM ROUTES
// ==========================================

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private
router.get('/enquiries', protect, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an enquiry
// @route   POST /api/enquiries
// @access  Private
router.post('/enquiries', protect, async (req, res) => {
  try {
    const { name, course, phone, email } = req.body;
    if (!name || !course) {
      return res.status(400).json({ message: 'name and course are required.' });
    }
    const enquiryId = 'ENQ-' + Math.floor(100000 + Math.random() * 900000);
    const enquiry = await Enquiry.create({
      id: enquiryId,
      name,
      course,
      phone: phone || '',
      email: email || '',
      type: 'New',
    });
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update enquiry stage
// @route   PUT /api/enquiries/:id
// @access  Private
router.put('/enquiries/:id', protect, async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ id: req.params.id });
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    Object.keys(req.body).forEach((key) => {
      enquiry[key] = req.body[key];
    });
    const updated = await enquiry.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private
router.delete('/enquiries/:id', protect, async (req, res) => {
  try {
    const enquiry = await Enquiry.findOneAndDelete({ id: req.params.id });
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ADMIN SETTINGS ROUTES
// ==========================================

// @desc    Get admin settings
// @route   GET /api/admin/settings
// @access  Private
router.get('/admin/settings', protect, async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ key: 'main' });
    if (!settings) {
      settings = await AdminSettings.create({ key: 'main' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update admin settings
// @route   PUT /api/admin/settings
// @access  Private
router.put('/admin/settings', protect, async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ key: 'main' });
    if (!settings) {
      settings = await AdminSettings.create({ key: 'main' });
    }
    const allowedFields = ['centreName', 'contactEmail', 'contactPhone', 'address', 'session', 'currency', 'autoReminders', 'emailAlerts', 'whatsappSync'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get daily reports for a specific student
// @route   GET /api/students/:studentId/daily-reports
// @access  Private
router.get('/students/:studentId/daily-reports', protect, async (req, res) => {
  try {
    const teachers = await User.find({
      role: 'teacher',
      'daily_reports.studentId': req.params.studentId
    });
    
    let reports = [];
    teachers.forEach((t) => {
      if (t.daily_reports) {
        const studentReports = t.daily_reports.filter((r) => r.studentId === req.params.studentId);
        reports = reports.concat(studentReports);
      }
    });

    // Sort by date or submittedAt descending
    reports.sort((a, b) => new Date(b.submittedAt || b.date) - new Date(a.submittedAt || a.date));

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── NOTIFICATION ROUTES ───────────────────────────────────────────────────────

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private (Admin)
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private (Admin)
router.post('/notifications', protect, async (req, res) => {
  try {
    const { text, time } = req.body;
    const id = 'ntf_' + Date.now();
    const notification = await Notification.create({ id, text, time, isNew: true });
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private (Admin)
router.put('/notifications/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ isNew: true }, { $set: { isNew: false } });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin)
router.delete('/notifications/:id', protect, async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user-specific notifications
// @route   GET /api/notifications/my-notifications
// @access  Private (User)
router.get('/notifications/my-notifications', protect, async (req, res) => {
  try {
    res.json(req.user.notifications || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark user-specific notifications as read
// @route   PUT /api/notifications/my-notifications/read-all
// @access  Private (User)
router.put('/notifications/my-notifications/read-all', protect, async (req, res) => {
  try {
    if (req.user.notifications && req.user.notifications.length > 0) {
      req.user.notifications.forEach(n => {
        n.isNew = false;
      });
      req.user.markModified('notifications');
      await req.user.save();
    }
    res.json({ message: 'All user notifications marked as read', notifications: req.user.notifications || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Clear all user-specific notifications
// @route   DELETE /api/notifications/my-notifications/clear-all
// @access  Private (User)
router.delete('/notifications/my-notifications/clear-all', protect, async (req, res) => {
  try {
    req.user.notifications = [];
    req.user.markModified('notifications');
    await req.user.save();
    res.json({ message: 'All notifications cleared', notifications: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a specific user-specific notification
// @route   DELETE /api/notifications/my-notifications/:id
// @access  Private (User)
router.delete('/notifications/my-notifications/:id', protect, async (req, res) => {
  try {
    const notifId = req.params.id;
    if (req.user.notifications && req.user.notifications.length > 0) {
      req.user.notifications = req.user.notifications.filter(n => n.id !== notifId);
      req.user.markModified('notifications');
      await req.user.save();
    }
    res.json({ message: 'Notification deleted successfully', notifications: req.user.notifications || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

