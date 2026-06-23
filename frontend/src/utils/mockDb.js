// Centralized Mock Database Utility for Cograd Pathshala
// Persisted in localStorage

const STUDENTS_KEY = 'cograd_students';
const TEACHERS_KEY = 'cograd_teachers';
const ASSIGNMENTS_KEY = 'cograd_assignments';
const ADMIN_USERS_KEY = 'cograd_admin_users';

const DEFAULT_STUDENTS = [
  {
    id: 'stu_rahul',
    name: 'Rahul Sharma',
    email: 'student@cograd.com',
    standard: 'Class 10 (CBSE)',
    subjects: ['Mathematics', 'Science'],
    test_score: null, // format: { Mathematics: null, Science: null }
    test_completed_at: null,
    assigned_teacher_id: null,
    status: 'pending_test', // pending_test, pending_match, matched, active
    city: 'Meerut',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    parentName: 'Mr. Alok Sharma',
    parentPhone: '9876500999',
    address: 'House No. 42, Sector 4, Shastri Nagar, Meerut',
    attendance: '91%',
    joinDate: '12 April 2026',
    tuitionSlot: 'Evening (04:00 PM - 05:00 PM)'
  },
  {
    id: 'stu_arjun',
    name: 'Arjun Mehta',
    email: 'arjun@cograd.com',
    standard: 'Class 9',
    subjects: ['Mathematics'],
    test_score: { Mathematics: 75 },
    test_completed_at: '2026-06-10T14:30:00',
    assigned_teacher_id: 1,
    status: 'active',
    city: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    parentName: 'Sanjay Mehta',
    parentPhone: '9876500333',
    address: 'Sector 15, Dwarka, Delhi'
  }
];

const DEFAULT_TEACHERS = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya@cograd.com',
    subjects_taught: ['Mathematics', 'Science'],
    grade_levels_qualified: ['Class 10', 'Class 9', 'Class 7', 'Class 3'],
    verification_status: 'Verified',
    current_student_count: 1,
    max_student_capacity: 5,
    city: 'Meerut',
    teaching_style: 'beginner', // beginner, intermediate, advanced
    hourly_rate: '₹600/hr',
    rating: 4.9,
    experience: '6+ Years',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    bio: 'Passionate educator dedicated to simplifying maths and science concepts for school students.',
    qualification: 'M.Sc. in Mathematics, B.Ed.',
    travelRange: '5 km radius'
  },
  {
    id: 2,
    name: 'Mr. Rajesh Kumar',
    email: 'rajesh@cograd.com',
    subjects_taught: ['Science', 'Chemistry'],
    grade_levels_qualified: ['Class 10', 'Class 9', 'Class 8'],
    verification_status: 'Verified',
    current_student_count: 2,
    max_student_capacity: 5,
    city: 'Meerut',
    teaching_style: 'advanced',
    hourly_rate: '₹650/hr',
    rating: 4.7,
    experience: '9+ Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bio: 'Chemistry enthusiast who designs creative visual aids and fun home-based experiments.',
    qualification: 'M.Sc. Chemistry, IIT Delhi'
  },
  {
    id: 3,
    name: 'Ms. Neha Gupta',
    email: 'neha@cograd.com',
    subjects_taught: ['English'],
    grade_levels_qualified: ['Class 7', 'Class 6'],
    verification_status: 'Verified',
    current_student_count: 1,
    max_student_capacity: 5,
    city: 'Delhi',
    teaching_style: 'beginner',
    hourly_rate: '₹500/hr',
    rating: 4.7,
    experience: '6+ Years',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    bio: 'Focuses on communication skills and board-level academic writing.',
    qualification: 'MA English Literature'
  },
  {
    id: 4,
    name: 'Dr. Satish Sharma',
    email: 'satish@cograd.com',
    subjects_taught: ['Mathematics'],
    grade_levels_qualified: ['Class 9', 'Class 10'],
    verification_status: 'Verified',
    current_student_count: 4,
    max_student_capacity: 5,
    city: 'Meerut',
    teaching_style: 'advanced',
    hourly_rate: '₹700/hr',
    rating: 4.9,
    experience: '12+ Years',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    bio: 'PhD in Algebra, dedicated to advanced problem solving.',
    qualification: 'PhD Mathematics'
  }
];

const DEFAULT_ASSIGNMENTS = [
  {
    id: 'asg_arjun',
    student_id: 'stu_arjun',
    teacher_id: 1,
    assigned_by: 'admin_1',
    assigned_at: '2026-06-10T14:40:00',
    status: 'active' // proposed, confirmed, active, ended
  }
];

const DEFAULT_ADMINS = [
  { id: 'admin_1', name: 'Cograd Admin Staff', role: 'Superadmin' }
];

export const initializeDb = () => {
  if (!localStorage.getItem(STUDENTS_KEY)) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem(TEACHERS_KEY)) {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(DEFAULT_TEACHERS));
  }
  if (!localStorage.getItem(ASSIGNMENTS_KEY)) {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(DEFAULT_ASSIGNMENTS));
  }
  if (!localStorage.getItem(ADMIN_USERS_KEY)) {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(DEFAULT_ADMINS));
  }
};

// CRUD Operations
export const getStudents = () => {
  initializeDb();
  return JSON.parse(localStorage.getItem(STUDENTS_KEY));
};

export const saveStudents = (students) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const getTeachers = () => {
  initializeDb();
  return JSON.parse(localStorage.getItem(TEACHERS_KEY));
};

export const saveTeachers = (teachers) => {
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
};

export const getAssignments = () => {
  initializeDb();
  return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY));
};

export const saveAssignments = (assignments) => {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
};

export const getAdminUsers = () => {
  initializeDb();
  return JSON.parse(localStorage.getItem(ADMIN_USERS_KEY));
};

// Matching Algorithm
export const findSuggestedTeachers = (student) => {
  const teachers = getTeachers();
  
  // Clean student grade level for matching (e.g. 'Class 10 (CBSE)' -> 'Class 10')
  const studentGrade = student.standard.split(' ')[0]; 

  // Filter teachers
  const eligibleTeachers = teachers.filter(t => {
    // 1. Verification Check
    if (t.verification_status !== 'Verified') return false;

    // 2. Capacity Check
    if (t.current_student_count >= t.max_student_capacity) return false;

    // 3. City Match (strictly match city for local in-home tutor)
    if (t.city.toLowerCase() !== student.city.toLowerCase()) return false;

    // 4. Subject Match
    const hasSubjectMatch = student.subjects.some(sub => 
      t.subjects_taught.some(ts => ts.toLowerCase() === sub.toLowerCase())
    );
    if (!hasSubjectMatch) return false;

    // 5. Grade level Qualification Match
    const isGradeQualified = t.grade_levels_qualified.some(g => g.toLowerCase() === studentGrade.toLowerCase());
    if (!isGradeQualified) return false;

    return true;
  });

  // Score & Rank Eligible Teachers
  const rankedTeachers = eligibleTeachers.map(t => {
    let score = 0;
    const reasons = [];

    // Calculate average student score
    let totalScoreSum = 0;
    let scoreCount = 0;
    if (student.test_score) {
      Object.keys(student.test_score).forEach(sub => {
        if (student.test_score[sub] !== null) {
          totalScoreSum += student.test_score[sub];
          scoreCount++;
        }
      });
    }
    const avgStudentScore = scoreCount > 0 ? (totalScoreSum / scoreCount) : 50;

    // Score-band match (max 10 points)
    if (avgStudentScore < 60) {
      if (t.teaching_style === 'beginner') {
        score += 10;
        reasons.push("Strong with beginner-level support");
      } else if (t.teaching_style === 'intermediate') {
        score += 5;
        reasons.push("Intermediate support fit");
      }
    } else if (avgStudentScore >= 80) {
      if (t.teaching_style === 'advanced') {
        score += 10;
        reasons.push("Ideal for advanced material");
      } else if (t.teaching_style === 'intermediate') {
        score += 5;
        reasons.push("Solid foundations support");
      }
    } else {
      if (t.teaching_style === 'intermediate') {
        score += 10;
        reasons.push("Strong general foundations focus");
      } else {
        score += 5;
        reasons.push("General capability fit");
      }
    }

    // Load balancing match (max 10 points: 0 students = 10pts, 4 students = 2pts)
    const availabilityScore = (t.max_student_capacity - t.current_student_count) * 2;
    score += availabilityScore;
    reasons.push(`High availability (${t.max_student_capacity - t.current_student_count} slots open)`);

    // Match percentage (max 100%)
    const compatibilityPercent = Math.min(100, Math.round((score / 20) * 100));

    return {
      teacher: t,
      score: compatibilityPercent,
      reasons: reasons
    };
  });

  // Sort by score descending
  return rankedTeachers.sort((a, b) => b.score - a.score);
};

// Allot tutor (Admin Action)
export const allotTutor = (studentId, teacherId, adminId = 'admin_1') => {
  const students = getStudents();
  const teachers = getTeachers();
  const assignments = getAssignments();

  const studentIdx = students.findIndex(s => s.id === studentId);
  const teacherIdx = teachers.findIndex(t => t.id === teacherId);

  if (studentIdx === -1 || teacherIdx === -1) return false;

  // Update Student
  students[studentIdx].assigned_teacher_id = teacherId;
  students[studentIdx].status = 'matched'; // Assigned but pending teacher confirmation

  // Create Assignment
  const newAssignment = {
    id: `asg_${studentId}_${Date.now()}`,
    student_id: studentId,
    teacher_id: teacherId,
    assigned_by: adminId,
    assigned_at: new Date().toISOString(),
    status: 'proposed'
  };

  // Add assignment and save
  assignments.push(newAssignment);
  saveAssignments(assignments);
  saveStudents(students);
  return true;
};

// Confirm/Reject tutor availability (Teacher Action)
export const updateAssignmentStatus = (studentId, teacherId, accept) => {
  const assignments = getAssignments();
  const students = getStudents();
  const teachers = getTeachers();

  const asgIdx = assignments.findIndex(a => a.student_id === studentId && a.teacher_id === teacherId && a.status === 'proposed');
  const stuIdx = students.findIndex(s => s.id === studentId);
  const teaIdx = teachers.findIndex(t => t.id === teacherId);

  if (asgIdx === -1 || stuIdx === -1 || teaIdx === -1) return false;

  if (accept) {
    assignments[asgIdx].status = 'active';
    students[stuIdx].status = 'active';
    teachers[teaIdx].current_student_count += 1;
  } else {
    // Flag conflict / reject
    assignments[asgIdx].status = 'ended';
    students[stuIdx].status = 'pending_match';
    students[stuIdx].assigned_teacher_id = null;
  }

  saveAssignments(assignments);
  saveStudents(students);
  saveTeachers(teachers);
  return true;
};

// Reset Simulation State
export const resetSimulationState = (studentId = 'stu_rahul', targetStatus = 'pending_test') => {
  const students = getStudents();
  const teachers = getTeachers();
  const assignments = getAssignments();

  const stuIdx = students.findIndex(s => s.id === studentId);
  if (stuIdx === -1) return;

  const currentTeacherId = students[stuIdx].assigned_teacher_id;

  // Clear assigned teacher
  students[stuIdx].assigned_teacher_id = null;
  students[stuIdx].status = targetStatus;

  if (targetStatus === 'pending_test') {
    students[stuIdx].test_score = null;
    students[stuIdx].test_completed_at = null;
  }

  // Remove proposed or active assignments for this student
  const filteredAssignments = assignments.filter(a => {
    if (a.student_id === studentId) {
      if (a.status === 'active' && currentTeacherId) {
        // Decrease teacher count
        const teaIdx = teachers.findIndex(t => t.id === currentTeacherId);
        if (teaIdx !== -1) {
          teachers[teaIdx].current_student_count = Math.max(0, teachers[teaIdx].current_student_count - 1);
        }
      }
      return false;
    }
    return true;
  });

  saveStudents(students);
  saveTeachers(teachers);
  saveAssignments(filteredAssignments);
};

export const getDiagnosticQuestions = (standard) => {
  const isSenior = standard && (
    standard.includes('11') || 
    standard.includes('12') || 
    standard.includes('Science') || 
    standard.includes('JEE') || 
    standard.includes('NEET')
  );
  
  if (isSenior) {
    return [
      {
        id: 'q1',
        subject: 'Mathematics',
        text: 'If log_2(x) + log_2(x-2) = 3, then x is:',
        options: ['4', '-2', '4 and -2', '8'],
        correct: '4',
        marks: 4
      },
      {
        id: 'q2',
        subject: 'Science',
        text: 'The hybridisation of carbon in ethyne (C2H2) is:',
        options: ['sp', 'sp2', 'sp3', 'dsp2'],
        correct: 'sp',
        marks: 4
      },
      {
        id: 'q3',
        subject: 'Mathematics',
        text: 'The derivative of e^(x^2) with respect to x is:',
        options: ['e^(x^2)', '2x * e^(x^2)', 'x^2 * e^(x^2)', '2 * e^(x^2)'],
        correct: '2x * e^(x^2)',
        marks: 4
      },
      {
        id: 'q4',
        subject: 'Science',
        text: 'Which quantum number determines the orientation of an orbital in space?',
        options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (m)', 'Spin (s)'],
        correct: 'Magnetic (m)',
        marks: 4
      }
    ];
  } else {
    return [
      {
        id: 'q1',
        subject: 'Mathematics',
        text: 'Solve for x: 3x - 7 = 8',
        options: ['3', '5', '15', '2'],
        correct: '5',
        marks: 4
      },
      {
        id: 'q2',
        subject: 'Science',
        text: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        correct: 'Mitochondria',
        marks: 4
      },
      {
        id: 'q3',
        subject: 'Mathematics',
        text: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correct: '180°',
        marks: 4
      },
      {
        id: 'q4',
        subject: 'Science',
        text: 'Which gas is most abundant in Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
        correct: 'Nitrogen',
        marks: 4
      }
    ];
  }
};
