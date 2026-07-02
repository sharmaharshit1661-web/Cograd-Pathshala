// Centralized Mock Database Utility for Cograd Pathshala
// Synced with Local MongoDB Backend
import { api } from './api';

const STUDENTS_KEY = 'cograd_students';
const TEACHERS_KEY = 'cograd_teachers';
const ASSIGNMENTS_KEY = 'cograd_assignments';
const ADMIN_USERS_KEY = 'cograd_admin_users';

// Initialize cache from localStorage
let cachedStudents = JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
let cachedTeachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
let cachedAssignments = JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || '[]');

// Synchronize with Express Backend
export const syncWithBackend = async () => {
  if (!localStorage.getItem('cograd_token')) {
    return; // Don't sync if not logged in
  }
  try {
    const students = await api.get('/students');
    const teachers = await api.get('/teachers');
    const assignments = await api.get('/assignments');

    cachedStudents = students;
    cachedTeachers = teachers;
    cachedAssignments = assignments;

    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));

    // Dispatch storage event to trigger reactive reload in React components
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Failed to sync with backend:', error.message);
  }
};

// Start background synchronization on import
if (localStorage.getItem('cograd_token')) {
  syncWithBackend();
}

// CRUD Operations (synchronous read from cache)
export const getStudents = () => {
  cachedStudents = JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
  return cachedStudents;
};

export const saveStudents = async (students) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  cachedStudents = students;
  
  // Find if student was updated and update backend
  try {
    for (const student of students) {
      await api.put(`/students/${student.id}`, student);
    }
    syncWithBackend();
  } catch (error) {
    console.error('Failed to save student updates to backend:', error.message);
  }
};

export const getTeachers = () => {
  cachedTeachers = JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
  return cachedTeachers;
};

export const saveTeachers = async (teachers) => {
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
  cachedTeachers = teachers;
  
  try {
    for (const teacher of teachers) {
      await api.put(`/teachers/${teacher.id}`, teacher);
    }
    syncWithBackend();
  } catch (error) {
    console.error('Failed to save teacher updates to backend:', error.message);
  }
};

export const getAssignments = () => {
  cachedAssignments = JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || '[]');
  return cachedAssignments;
};

export const saveAssignments = async (assignments) => {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  cachedAssignments = assignments;
};

export const getAdminUsers = () => {
  return JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
};

// Matching Algorithm
export const findSuggestedTeachers = (student) => {
  const teachers = getTeachers();
  const studentGrade = student.standard ? student.standard.split(' ')[0] : 'Class 10'; 

  // If student is not matching eligible, return empty array
  if (student.matching_eligible === false) {
    return [];
  }

  // Filter teachers
  const eligibleTeachers = teachers.filter(t => {
    // 1. City Match (case-insensitive) — cheapest filter, runs first
    if (!t.city || !student.city || t.city.trim().toLowerCase() !== student.city.trim().toLowerCase()) return false;

    // 2. Verification Check
    if (t.verification_status !== 'Verified') return false;

    // 3. Capacity Check
    if (t.current_student_count >= t.max_student_capacity) return false;

    // 4. Subject Match
    const hasSubjectMatch = student.subjects.some(sub => 
      t.subjects_taught && t.subjects_taught.some(ts => ts.toLowerCase() === sub.toLowerCase())
    );
    if (!hasSubjectMatch) return false;

    // 5. Grade level Qualification Match
    const isGradeQualified = t.grade_levels_qualified && t.grade_levels_qualified.some(g => g.toLowerCase() === studentGrade.toLowerCase());
    if (!isGradeQualified) return false;

    return true;
  });

  // Score & Rank Eligible Teachers
  const rankedTeachers = eligibleTeachers.map(t => {
    let score = 0;
    const reasons = [];

    let totalScoreSum = 0;
    let scoreCount = 0;
    if (student.test_score) {
      Object.keys(student.test_score).forEach(sub => {
        if (typeof student.test_score[sub] === 'number') {
          totalScoreSum += student.test_score[sub];
          scoreCount++;
        }
      });
    }
    const avgStudentScore = scoreCount > 0 ? (totalScoreSum / scoreCount) : 50;

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

    const availabilityScore = (t.max_student_capacity - t.current_student_count) * 2;
    score += availabilityScore;
    reasons.push(`High availability (${t.max_student_capacity - t.current_student_count} slots open)`);

    const compatibilityPercent = Math.min(100, Math.round((score / 20) * 100));

    return {
      teacher: t,
      score: compatibilityPercent,
      reasons: reasons
    };
  });

  return rankedTeachers.sort((a, b) => b.score - a.score);
};

// Allot tutor (Admin Action)
export const allotTutor = async (studentId, teacherId) => {
  try {
    await api.post('/assignments/allot', { studentId, teacherId });
    await syncWithBackend();
    return true;
  } catch (error) {
    console.error('Failed to allot tutor:', error.message);
    return false;
  }
};

// Confirm/Reject tutor availability (Teacher Action)
export const updateAssignmentStatus = async (studentId, teacherId, accept) => {
  try {
    await api.put('/assignments/status', { studentId, teacherId, accept });
    await syncWithBackend();
    return true;
  } catch (error) {
    console.error('Failed to update assignment status:', error.message);
    return false;
  }
};

// Reset Simulation State
export const resetSimulationState = async (studentId = 'stu_rahul', targetStatus = 'pending_test') => {
  try {
    await api.post('/students/reset', { studentId, targetStatus });
    await syncWithBackend();
  } catch (error) {
    console.error('Failed to reset simulation state:', error.message);
  }
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
