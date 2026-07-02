import express from 'express';
import User from '../models/User.js';
import Assignment from '../models/Assignment.js';
import DemoBooking from '../models/DemoBooking.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const mapDistrictToCity = (district) => {
  if (!district) return '';
  return district.toLowerCase().trim();
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

const sendTeacherCredentialsEmail = (name, email, password) => {
  console.log(`
============================================================
📧 EMAIL SENT (SIMULATED)
============================================================
From: admissions@cogradpathshala.com
To: ${email}
Subject: Welcome to Cograd Pathshala - Your Teacher Account is Approved!

Dear ${name},

Congratulations! Your application to join Cograd Pathshala as a
teacher has been verified and approved by our admin team.

Here are your login credentials:
------------------------------------------
Login URL: http://localhost:5173/login
Email:     ${email}
Password:  ${password}
------------------------------------------

Please log in to your dashboard to set up your profile, manage
your slots, and view student requests.

Best regards,
Cograd Pathshala Admin Team
============================================================
`);
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

      // Match percentage (max 100%)
      const compatibilityPercent = Math.min(100, Math.round((score / 20) * 100));

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
    res.status(550).json({ message: error.message });
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

export default router;
