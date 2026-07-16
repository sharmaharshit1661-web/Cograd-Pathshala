import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import DiagnosticGame from '../components/DiagnosticGame';
import DemoBooking from './DemoBooking';
import { api } from '../utils/api';
import { getDiagnosticQuestions } from '../utils/mockDb';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  Mic,
  Send,
  Download,
  Play,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  User,
  BookMarked,
  X,
  Camera,
  Edit3,
  Save,
  UploadCloud,
  MessageSquare,
  Bot,
  Paperclip,
  Users,
  WifiOff,
  Wifi,
  RotateCcw,
  ChevronRight,
  Star,
  Search,
  Trophy,
  HelpCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedProgressSubject, setSelectedProgressSubject] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAiChatbot, setShowAiChatbot] = useState(false);

  // Achievements & Portfolio Tracker State (Moved here to avoid Temporal Dead Zone errors in useEffect hooks)
  const [earnedCertificates, setEarnedCertificates] = useState([]);
  const [studentXp, setStudentXp] = useState(0);
  const [unlockedRewards, setUnlockedRewards] = useState([]); // rewardIds

  // 6. Smart Notes & Flashcards State (Moved here to avoid Temporal Dead Zone errors in useEffect hooks)
  const [flashcardDecks] = useState([
    {
      id: 'd1',
      name: 'Organic Reaction Mechanisms',
      subject: 'Chemistry',
      cards: [
        { front: 'What undergoes Cannizzaro reaction?', back: 'Non-enolizable aldehydes (aldehydes without alpha-hydrogens, e.g., Formaldehyde, Benzaldehyde) in the presence of strong base.' },
        { front: 'What is the rate-determining step in SN1 kinetics?', back: 'The formation of the carbocation intermediate (ionization step).' },
        { front: 'Which solvent type favors SN2 reaction mechanism?', back: 'Polar aprotic solvents (like DMSO, Acetone, DMF) as they do not solvate the nucleophile strongly.' }
      ]
    },
    {
      id: 'd2',
      name: 'Hydrogenic Atoms (Bohr Derivations)',
      subject: 'Physics',
      cards: [
        { front: "What is Bohr's orbit radius proportional to?", back: 'Directly proportional to the square of principal quantum number (n^2 / Z).' },
        { front: 'What is the speed of an electron in Bohr\'s orbit proportional to?', back: 'Directly proportional to (Z / n).' },
        { front: 'What is the total energy of an electron in H-atom in ground state?', back: '-13.6 eV' }
      ]
    },
    {
      id: 'd3',
      name: 'Integral calculus standard forms',
      subject: 'Mathematics',
      cards: [
        { front: 'What is the integral of sec(x) dx?', back: 'ln|sec(x) + tan(x)| + C' },
        { front: 'What is the integral of 1/(x^2 + a^2) dx?', back: '(1/a) * arctan(x/a) + C' },
        { front: 'What is the integral of e^x * (f(x) + f\'(x)) dx?', back: 'e^x * f(x) + C' }
      ]
    }
  ]);
  const [activeDeckId, setActiveDeckId] = useState('d1');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [deckProgress, setDeckProgress] = useState({ d1: 0, d2: 0, d3: 0 }); // deckId -> mastered count

  // Dynamic Student Profile data state
  const [profileData, setProfileData] = useState({
    name: 'Loading...',
    email: '',
    phone: '',
    standard: '',
    avatar: '',
    studentId: '',
    parentName: '',
    parentPhone: '',
    district: '',
    state: '',
    medium: '',
    joinDate: '',
    tuitionSlot: '',
    subjects: [],
    address: '',
    streak: 0,
    rank: 'N/A',
    attendance: 'N/A',
    pendingHW: '0',
    testsThisWeek: '0',
    test_score: null,
    test_completed_at: null,
    assigned_teacher_id: null,
    matching_eligible: true,
    locality: '',
    status: 'pending_match',
    mock_tests_log: [],
    study_hours_log: [],
  });

  const [showDiagnosticTest, setShowDiagnosticTest] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [placementAnswers, setPlacementAnswers] = useState({});

  // Notification states
  const [unreadNotifications, setUnreadNotifications] = useState([]);




  const [reminderSet, setReminderSet] = useState(false);
  const [myDemoBookings, setMyDemoBookings] = useState([]);

  // Load real user data from backend
  const [, setLoadingData] = useState(true);
  const [matchedTeacherData, setMatchedTeacherData] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('cograd_role');
    const token = localStorage.getItem('cograd_token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (role && role !== 'student') {
      if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'parent') navigate('/parent/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    }
  }, [navigate]);

  const loadData = useCallback(async () => {
    try {
      if (!localStorage.getItem('cograd_token')) return;
      const user = await api.get('/auth/me');
      
      if (user && user.role && user.role !== 'student') {
        localStorage.setItem('cograd_role', user.role);
        if (user.role === 'teacher') navigate('/teacher/dashboard');
        else if (user.role === 'parent') navigate('/parent/dashboard');
        else if (user.role === 'admin') navigate('/admin/dashboard');
        return;
      }

      // Fetch notifications inside the same call
      api.get('/notifications/my-notifications')
        .then(dbNotifs => setUnreadNotifications(dbNotifs || []))
        .catch(e => console.error('Failed to fetch user notifications:', e));

      // Fetch demo bookings inside the same call
      api.get('/demo-bookings/my-bookings')
        .then(res => setMyDemoBookings(res || []))
        .catch(e => console.error('Failed to fetch user demo bookings:', e));

      if (user) {
        // Setup state from DB fields:
        setAiHistory(user.ai_chat_history || []);
        setTeacherDoubts(user.teacher_doubts || []);
        setStudyHours(user.study_hours_log && user.study_hours_log.length > 0
          ? user.study_hours_log.reduce((acc, curr) => acc + (curr.hours || 0), 0)
          : 0);
        setUserGoals(user.study_goals || []);
        setSavedVideoNotes(user.video_notes || []);
        setStudentXp(user.xp || 0);
        setUnlockedRewards(user.unlocked_rewards || []);
        setEarnedCertificates(user.earned_certificates || []);
        setDeckProgress(user.flashcard_mastered || { d1: 0, d2: 0, d3: 0 });

        // Initialize syllabus chapters from DB or fallback defaults
        if (user.syllabus_chapters && user.syllabus_chapters.length > 0) {
          if (!user.assigned_teacher_id) {
            const cleanedChapters = user.syllabus_chapters.map(c => ({ ...c, status: 'Not Started' }));
            setSyllabusChapters(cleanedChapters);
            api.put(`/students/${user.id}`, { syllabus_chapters: cleanedChapters }).catch(e => console.error(e));
          } else {
            setSyllabusChapters(user.syllabus_chapters);
          }
        } else {
          const defaultChapters = {
            'Mathematics': ['Linear Equations', 'Quadratic Equations', 'Trigonometry', 'Coordinate Geometry', 'Probability'],
            'Science': ['Chemical Reactions', 'Life Processes', 'Light Reflection & Refraction', 'Electricity', 'Carbon Compounds'],
            'Physics': ['Kinematics', 'Laws of Motion', 'Work, Energy & Power', 'Gravitation', 'Thermodynamics'],
            'Chemistry': ['Structure of Atom', 'Chemical Bonding', 'States of Matter', 'Chemical Kinetics', 'Organic Chemistry'],
            'Biology': ['Cell Division', 'Human Anatomy', 'Plant Physiology', 'Genetics', 'Evolution'],
            'English': ['Tenses & Grammar', 'Reading Comprehension', 'Short Stories', 'Poetry Analysis', 'Letter Writing']
          };
          const generated = [];
          const subjectsList = user.subjects || ['Mathematics', 'Science'];
          subjectsList.forEach(sub => {
            const chapters = defaultChapters[sub] || ['Chapter 1: Intro', 'Chapter 2: Core', 'Chapter 3: Application', 'Chapter 4: Revision'];
            chapters.forEach((ch, idx) => {
              generated.push({
                id: `${sub.toLowerCase().substring(0, 2)}_${idx + 1}`,
                subject: sub,
                name: ch,
                status: 'Not Started'
              });
            });
          });
          setSyllabusChapters(generated);
          api.put(`/students/${user.id}`, { syllabus_chapters: generated }).catch(e => console.error(e));
        }

        // Compute pending homework and tests dynamically
        let liveAssignmentsPending = 0;
        let liveTestsThisWeek = 0;
        if (user.assigned_teacher_id) {
          try {
            const matchedTeacher = await api.get(`/teachers/${user.assigned_teacher_id}`);
            if (matchedTeacher) {
              setMatchedTeacherData(matchedTeacher);

              // Calculate pending assignments
              const teacherAsgs = matchedTeacher.assignments || [];
              const studentSubs = user.homework_submissions || [];
              teacherAsgs.forEach(asg => {
                const matchedSub = studentSubs.find(sub => sub.assignmentName === asg.name);
                if (!matchedSub) {
                  liveAssignmentsPending += 1;
                }
              });

              // Calculate tests this week
              const teacherTests = matchedTeacher.tests || [];
              liveTestsThisWeek = teacherTests.length;
            }
          } catch (err) {
            console.error('Failed to fetch matched teacher details:', err);
          }
        }

        setProfileData(prev => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
          standard: user.standard || prev.standard,
          avatar: user.avatar || prev.avatar,
          parentName: user.parentName || prev.parentName,
          parentPhone: user.parentPhone || prev.parentPhone,
          city: user.city || prev.district,
          district: user.city || prev.district,
          state: user.state || prev.state,
          joinDate: user.joinDate || prev.joinDate,
          tuitionSlot: user.tuitionSlot || prev.tuitionSlot,
          subjects: user.subjects || prev.subjects,
          address: user.address || prev.address,
          studentId: user.id || prev.studentId,
          test_score: user.test_score || prev.test_score,
          test_completed_at: user.test_completed_at || prev.test_completed_at,
          assigned_teacher_id: user.assigned_teacher_id || null,
          matching_eligible: user.matching_eligible !== undefined ? user.matching_eligible : prev.matching_eligible,
          locality: user.locality || prev.locality,
          status: user.status || prev.status,
          streak: user.streak || 0,
          rank: user.rank || 'N/A',
          attendance: user.attendance || 'N/A',
          attendance_log: user.attendance_log || [],
          pendingHW: liveAssignmentsPending.toString(),
          testsThisWeek: liveTestsThisWeek.toString(),
          homework_submissions: user.homework_submissions || [],
          mock_tests_log: user.mock_tests_log || [],
          study_hours_log: user.study_hours_log || [],
        }));
      }
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Poll data every 15 seconds to sync dashboard in real-time
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);



  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const [supportForm, setSupportForm] = useState({ category: 'General Support', title: '', description: '' });
  const [supportSubmitting, setSupportSubmitting] = useState(false);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSupportSubmitting(true);
    try {
      await api.post('/support-tickets', {
        userId: profileData.studentId || 'STUDENT_GUEST',
        userName: profileData.name || 'Student User',
        userRole: 'Student',
        title: supportForm.title,
        description: supportForm.description,
        category: supportForm.category
      });
      setSupportForm({ category: 'General Support', title: '', description: '' });
      triggerToast('Support ticket submitted successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to submit support ticket. Please try again.');
    } finally {
      setSupportSubmitting(false);
    }
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
  ];

  // Syllabus Chapter checklist state
  const [syllabusChapters, setSyllabusChapters] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && syllabusChapters.length > 0) {
      api.put(`/students/${profileData.studentId}`, { syllabus_chapters: syllabusChapters })
        .catch(err => console.error('Failed to sync syllabus chapters:', err));
    }
  }, [syllabusChapters, profileData.studentId]);

  // AI Doubt Solver uploader states
  const [isScanning, setIsScanning] = useState(false);
  const [scannerProgress, setScannerProgress] = useState(0);

  // Reference dynamic state back to studentProfile for simple mapping
  const studentProfile = profileData;

  // Recent Results full analysis modal state
  const [selectedResult, setSelectedResult] = useState(null);

  const recentResults = [];
  if (profileData.test_score) {
    const subjectsWithScores = Object.keys(profileData.test_score).filter(k => typeof profileData.test_score[k] === 'number');
    if (subjectsWithScores.length > 0) {
      let total = 0;
      let count = 0;
      const topics = subjectsWithScores.map(sub => {
        const score = profileData.test_score[sub];
        total += score;
        count++;
        return {
          name: `${sub} Diagnostic Topics`,
          score: `${score}%`,
          strength: score >= 80 ? 'Strong' : score >= 60 ? 'Medium' : 'Needs Practice'
        };
      });
      const avg = Math.round(total / count);
      recentResults.push({
        id: 1,
        title: 'Diagnostic Placement Test',
        score: `${avg}/100`,
        percentage: avg,
        rank: '#10',
        date: profileData.test_completed_at ? new Date(profileData.test_completed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Recently',
        status: avg >= 80 ? 'Excellent' : avg >= 60 ? 'Good' : 'Needs Practice',
        color: avg >= 80 ? 'emerald' : avg >= 60 ? 'blue' : 'amber',
        analysis: {
          correct: Math.round(avg / 4),
          incorrect: Math.round((100 - avg) / 4),
          unanswered: 0,
          timeSpent: '25 mins',
          topics: topics,
          feedback: `Placement Diagnostic complete. You scored ${avg}% on average. We recommend focusing on your weaker areas as highlighted.`
        }
      });
    }
  }

  if (profileData.mock_tests_log && profileData.mock_tests_log.length > 0) {
    profileData.mock_tests_log.forEach((mock, idx) => {
      recentResults.push({
        id: `mock_${mock.id || idx}`,
        title: mock.title,
        score: mock.score,
        percentage: mock.percentage,
        rank: mock.rank,
        date: mock.date,
        status: mock.percentage >= 80 ? 'Excellent' : mock.percentage >= 60 ? 'Good' : 'Needs Practice',
        color: mock.percentage >= 80 ? 'emerald' : mock.percentage >= 60 ? 'blue' : 'amber',
        analysis: {
          correct: mock.correct,
          incorrect: mock.incorrect,
          unanswered: 0,
          timeSpent: '3 mins',
          topics: [
            { name: 'Core Chemistry Concepts', score: mock.percentage >= 66 ? 'Passed' : 'Needs Review' },
            { name: 'Concave Mirror Optics', score: mock.percentage >= 66 ? 'Passed' : 'Needs Review' },
            { name: 'Kinetics and Order', score: mock.percentage >= 100 ? 'Passed' : 'Needs Review' }
          ],
          feedback: `Mock exam submitted. You scored ${mock.percentage}% in this mock test. Focus on speed and accuracy in high-yield topics.`
        }
      });
    });
  }

  // Ask AI Doubt Solver state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiHistory, setAiHistory] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && aiHistory.length > 0) {
      api.put(`/students/${profileData.studentId}`, { ai_chat_history: aiHistory })
        .catch(err => console.error('Failed to sync AI chat history:', err));
    }
  }, [aiHistory, profileData.studentId]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [simulatedVoiceState, setSimulatedVoiceState] = useState('idle'); // idle, listening

  // Ask Teacher Doubt state
  const [doubtMode, setDoubtMode] = useState('ai'); // 'ai' or 'teacher'
  const [selectedTeacherForDoubt, setSelectedTeacherForDoubt] = useState('Mr. Rajesh Kumar');
  const [teacherDoubtText, setTeacherDoubtText] = useState('');
  const [teacherDoubtAttachment, setTeacherDoubtAttachment] = useState(null);
  const [isUploadingDoubtFile, setIsUploadingDoubtFile] = useState(false);
  const [uploadDoubtProgress, setUploadDoubtProgress] = useState(0);
  const [expandedTeacherDoubtId, setExpandedTeacherDoubtId] = useState(null);

  const [teacherDoubts, setTeacherDoubts] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && teacherDoubts.length > 0) {
      api.put(`/students/${profileData.studentId}`, { teacher_doubts: teacherDoubts })
        .catch(err => console.error('Failed to sync doubts:', err));
    }
  }, [teacherDoubts, profileData.studentId]);

  // Sync XP to backend
  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && studentXp > 0) {
      api.put(`/students/${profileData.studentId}`, { xp: studentXp })
        .catch(err => console.error('Failed to sync XP:', err));
    }
  }, [studentXp, profileData.studentId]);

  // Sync Unlocked Rewards to backend
  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && unlockedRewards.length > 0) {
      api.put(`/students/${profileData.studentId}`, { unlocked_rewards: unlockedRewards })
        .catch(err => console.error('Failed to sync rewards:', err));
    }
  }, [unlockedRewards, profileData.studentId]);

  // Sync Earned Certificates to backend
  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && earnedCertificates.length > 0) {
      api.put(`/students/${profileData.studentId}`, { earned_certificates: earnedCertificates })
        .catch(err => console.error('Failed to sync certificates:', err));
    }
  }, [earnedCertificates, profileData.studentId]);

  // Sync Flashcard deck progress to backend
  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      // Only sync if any deck has mastery count > 0 to avoid zero-overwrites
      const hasProgress = Object.values(deckProgress).some(v => v > 0);
      if (hasProgress) {
        api.put(`/students/${profileData.studentId}`, { flashcard_mastered: deckProgress })
          .catch(err => console.error('Failed to sync flashcard progress:', err));
      }
    }
  }, [deckProgress, profileData.studentId]);

  // --- PREMIUM DASHBOARD FEATURES STATE ---

  // 1. Offline Mode State
  const [isOffline, setIsOffline] = useState(false);

  const [studyHours, setStudyHours] = useState(0);
  useEffect(() => {
    // Loaded via loadData
  }, [profileData.studentId]);



  // Parent Assigned Test states
  const [showParentTestModal, setShowParentTestModal] = useState(false);
  const [parentTestAnswers, setParentTestAnswers] = useState({});
  const [parentTestSubmitted, setParentTestSubmitted] = useState(false);
  const [parentTestScore, setParentTestScore] = useState(0);

  // 3. Study Planner & Goal Setting State
  const [userGoals, setUserGoals] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && userGoals.length > 0) {
      api.put(`/students/${profileData.studentId}`, { study_goals: userGoals })
        .catch(err => console.error('Failed to sync goals:', err));
    }
  }, [userGoals, profileData.studentId]);



  // 4. Smart Video Player State
  const [activeVideoLecture, setActiveVideoLecture] = useState(null);
  const [videoSpeed, setVideoSpeed] = useState(1.0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0); // in seconds
  const [videoNotes, setVideoNotes] = useState('');
  const [savedVideoNotes, setSavedVideoNotes] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...' && savedVideoNotes.length > 0) {
      api.put(`/students/${profileData.studentId}`, { video_notes: savedVideoNotes })
        .catch(err => console.error('Failed to sync video notes:', err));
    }
  }, [savedVideoNotes, profileData.studentId]);

  // 5. Peer Learning & Study Groups State
  const [studyGroups, setStudyGroups] = useState([]);

  useEffect(() => {
    if (!profileData.studentId || profileData.studentId === 'Loading...') return;
    setStudyGroups(profileData.study_groups || []);
  }, [profileData.study_groups, profileData.studentId]);
  const [activeGroupId, setActiveGroupId] = useState('g1');

  // 6. Smart Notes & Flashcards State (Moved to top of component body to prevent initialization/TDZ errors)



  // --- END PREMIUM FEATURES STATE ---


  const handleAiSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);
    const questionText = aiQuestion;
    setAiQuestion('');

    try {
      // Limit history items passed to AI to the last 5 questions/answers to save tokens
      const recentHistory = aiHistory.slice(0, 5).reverse().map(h => ({
        question: h.question,
        answer: h.answer
      }));

      const res = await api.post('/ai/chat', { question: questionText, history: recentHistory });

      setAiHistory((prev) => [
        { question: questionText, answer: res.answer || '', timestamp: 'Just Now' },
        ...prev
      ]);
      triggerToast('AI Doubt Solver completed resolution!');
    } catch (err) {
      console.error('Failed to call AI Chat API, falling back to local database:', err);

      // Local NCERT/JEE mock database answers fallback
      let resolvedAnswer = '';
      const lowerQ = questionText.toLowerCase();

      if (lowerQ.includes('sn1') || lowerQ.includes('sn2')) {
        resolvedAnswer = `**SN1 vs SN2 Mechanisms:**\n\n- **SN1 (Substitution Nucleophilic Unimolecular):** Renders a 2-step process with a carbocation intermediate. Rate depends only on substrate concentration: Rate = k[R-X]. Favored by polar protic solvents and tertiary substrates.\n- **SN2 (Substitution Nucleophilic Bimolecular):** Renders a 1-step concerted process with transition state and inversion of configuration (Walden Inversion). Rate depends on both: Rate = k[R-X][Nu⁻]. Favored by polar aprotic solvents and primary substrates.`;
      } else if (lowerQ.includes('bohr') || lowerQ.includes('orbit')) {
        resolvedAnswer = `**Bohr's Orbit Radius Derivation:**\n\nFor a hydrogenic atom, the electrostatic force balances the centripetal force:\n$$\\frac{m v^2}{r} = \\frac{Z e^2}{4 \\pi \\epsilon_0 r^2}$$\n\nApplying Bohr's quantization condition ($mvr = nh/2\\pi$), we solve for $r_n$:\n$$r_n = \\frac{\\epsilon_0 n^2 h^2}{\\pi m Z e^2} = 0.529 \\frac{n^2}{Z} \\text{ Å}$$\n\nThis shows the radius is directly proportional to the square of the principal quantum number ($n^2$).`;
      } else if (lowerQ.includes('avogadro')) {
        resolvedAnswer = `**Avogadro's Hypothesis:**\n\n"Equal volumes of all gases, at the same temperature and pressure, contain the same number of molecules."\n\n- **Formula:** $V \\propto n$ (where $n$ is the number of moles).\n- **At STP:** 1 mole of any ideal gas occupies exactly $22.4 \\text{ Liters}$ and contains $6.022 \\times 10^{23}$ particles.`;
      } else if (lowerQ.includes('newton') || lowerQ.includes('force') || lowerQ.includes('law')) {
        resolvedAnswer = `**Newton's Laws of Motion:**\n\n- **First Law (Inertia):** An object remains at rest or in uniform motion unless acted upon by a net external force.\n- **Second Law ($F = ma$):** The rate of change of momentum is directly proportional to the applied force.\n- **Third Law (Action-Reaction):** For every action, there is an equal and opposite reaction.\n- **Problem Tip:** Always draw a Free Body Diagram (FBD) first before setting up equations of motion.`;
      } else if (lowerQ.includes('quadratic') || lowerQ.includes('equation') || lowerQ.includes('root')) {
        resolvedAnswer = `**Quadratic Equations & Roots:**\n\nFor any quadratic equation $a x^2 + b x + c = 0$:\n- **Quadratic Formula:** $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n- **Discriminant ($D = b^2 - 4ac$):**\n  - $D > 0$: Two distinct real roots.\n  - $D = 0$: Two equal real roots.\n  - $D < 0$: Two complex conjugate roots.\n- **Sum of Roots:** $\\alpha + \\beta = -\\frac{b}{a}$\n- **Product of Roots:** $\\alpha \\beta = \\frac{c}{a}$`;
      } else if (lowerQ.includes('photosynthesis') || lowerQ.includes('chlorophyll') || lowerQ.includes('plant')) {
        resolvedAnswer = `**Photosynthesis Process:**\n\nLight-driven process where plants synthesize glucose from carbon dioxide and water:\n$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light/Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$\n\n- **Light Reactions (in Thylakoid):** Splitting of water (photolysis) to release oxygen, producing ATP and NADPH.\n- **Dark Reactions (Calvin Cycle, in Stroma):** Carbon fixation using ATP and NADPH to construct glucose.`;
      } else if (lowerQ.includes('acid') || lowerQ.includes('base') || lowerQ.includes('ph')) {
        resolvedAnswer = `**Acids, Bases & pH Scale:**\n\n- **Arrhenius Concept:** Acids yield $\\text{H}^+$ ions in water; bases yield $\\text{OH}^-$ ions.\n- **Brønsted-Lowry:** Acids are proton donors; bases are proton acceptors.\n- **Lewis Concept:** Acids are electron-pair acceptors; bases are electron-pair donors.\n- **pH Formula:** $\\text{pH} = -\\log_{10}[\\text{H}^+]$\n  - $\\text{pH} < 7$: Acidic\n  - $\\text{pH} = 7$: Neutral\n  - $\\text{pH} > 7$: Basic`;
      } else {
        resolvedAnswer = `**AI Resolution for:** "${questionText}"\n\nBased on your JEE Prep syllabus, here is the analytical breakdown:\n1. **Core Concept:** This question falls under physical chemistry / general principles.\n2. **Detailed Steps:** Follow the conservation laws. Apply standard molecular kinetics equations where pressure is held constant.\n3. **Exam Tip:** Keep track of units (e.g. converting liters to $m^3$ or Kelvin temperatures).`;
      }

      setAiHistory((prev) => [
        { question: questionText, answer: resolvedAnswer, timestamp: 'Local Cache' },
        ...prev
      ]);
      triggerToast('Using Offline NCERT / JEE Cache');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Voice Simulation
  const simulateVoiceInput = () => {
    setSimulatedVoiceState('listening');
    triggerToast('Listening... Speak your academic doubt.');
    setTimeout(() => {
      setAiQuestion('Explain SN1 vs SN2 reaction kinetics in detail');
      setSimulatedVoiceState('idle');
      triggerToast('Speech parsed successfully!');
    }, 2500);
  };

  // Image Scan Simulation
  const triggerImageScan = () => {
    setIsScanning(true);
    setScannerProgress(0);
    triggerToast("Scanning handwritten page... OCR parser active");

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setScannerProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          const parsedQuestion = "Explain SN1 vs SN2 reaction kinetics in detail";
          setAiQuestion(parsedQuestion);
          triggerToast("Handwritten page successfully parsed by AI!");
        }, 400);
      }
    }, 200);
  };

  // Direct Teacher Doubt Helpers
  const simulateTeacherDoubtUpload = () => {
    setIsUploadingDoubtFile(true);
    setUploadDoubtProgress(0);
    triggerToast("Uploading attachment to teacher inbox...");

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setUploadDoubtProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploadingDoubtFile(false);
          setTeacherDoubtAttachment("doubt_worksheet_scan.png");
          triggerToast("Worksheet attached successfully!");
        }, 300);
      }
    }, 200);
  };

  const handleTeacherDoubtSubmit = async (e) => {
    e.preventDefault();
    if (!teacherDoubtText.trim() || !matchedTeacherData) return;

    const doubtText = teacherDoubtText.trim();
    const newDoubt = {
      id: 'doubt_' + Date.now(),
      studentId: profileData.studentId,
      studentName: profileData.name,
      teacherId: matchedTeacherData.id,
      teacherName: matchedTeacherData.name,
      subject: matchedTeacherData.primarySubject || 'General',
      question: doubtText,
      status: 'Pending',
      askedAt: new Date().toISOString(),
      timestamp: 'Just Now',
      avatar: matchedTeacherData.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      attachment: teacherDoubtAttachment || null
    };

    setTeacherDoubtText('');
    setTeacherDoubtAttachment(null);

    try {
      const updatedDoubts = [newDoubt, ...teacherDoubts];
      await api.put(`/students/${profileData.studentId}`, { teacher_doubts: updatedDoubts });
      setTeacherDoubts(updatedDoubts);
      triggerToast('Doubt submitted to tutor successfully!');

      const message = `Hello ${matchedTeacherData.name}, I have a doubt in ${matchedTeacherData.primarySubject || 'General'}:\n\n${doubtText}`;
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save doubt to database.');
    }
  };


  // --- PREMIUM DASHBOARD FEATURES HANDLERS ---

  // 1. Video Player Simulated Playback Effect
  useEffect(() => {
    let playInterval;
    if (videoPlaying && activeVideoLecture) {
      playInterval = setInterval(() => {
        setVideoTime(prev => {
          if (prev >= 600) { // cap at 10 minutes for demo
            setVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(playInterval);
  }, [videoPlaying, activeVideoLecture]);



  // 4. Smart Video Player
  const handleStartVideoPlayer = (lecture) => {
    setActiveVideoLecture(lecture);
    setVideoPlaying(true);
    setVideoTime(0);
    triggerToast(`Opened Smart Video Player for: ${lecture.topic}`);
  };

  const handleSaveVideoNote = (e) => {
    e.preventDefault();
    if (!videoNotes.trim()) return;

    const formatTimeScrub = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const newNote = {
      timestamp: formatTimeScrub(videoTime),
      note: videoNotes.trim()
    };

    setSavedVideoNotes(prev => [newNote, ...prev]);
    setVideoNotes('');
    triggerToast('Note saved with video timestamp! +20 XP');
    setStudentXp(prev => prev + 20);
  };


  // 6. Flashcards
  const handleFlipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const handleNextCard = () => {
    setIsCardFlipped(false);
    const deck = flashcardDecks.find(d => d.id === activeDeckId);
    if (deck) {
      setCurrentCardIndex(prev => (prev + 1) % deck.cards.length);
    }
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    const deck = flashcardDecks.find(d => d.id === activeDeckId);
    if (deck) {
      setCurrentCardIndex(prev => (prev - 1 + deck.cards.length) % deck.cards.length);
    }
  };

  const handleMarkMastered = () => {
    triggerToast('Marked as Mastered! +30 XP earned.');
    setStudentXp(prev => prev + 30);
    setDeckProgress(prev => ({
      ...prev,
      [activeDeckId]: prev[activeDeckId] + 1
    }));
    handleNextCard();
  };



  // --- END PREMIUM FEATURES HANDLERS ---

  // Study Materials list with individual download progress states

  const [downloadProgress, setDownloadProgress] = useState({}); // id -> progress percentage
  const [downloadingIds, setDownloadingIds] = useState({}); // id -> true/false

  const studyMaterials = matchedTeacherData?.study_materials || [];

  const triggerBrowserDownload = (fileName) => {
    const textContent = `Cograd Pathshala - Study Notes & Materials\n\nFile Name: ${fileName}\n\nThis is a placeholder study resource matching your syllabus chapter. Real academic study sheets, practice assignments, and formula cards will be uploaded here by your allotted teacher.`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.zip') || fileName.endsWith('.pdf') || fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (id, name) => {
    if (downloadingIds[id]) return;

    setDownloadingIds(prev => ({ ...prev, [id]: true }));
    setDownloadProgress(prev => ({ ...prev, [id]: 0 }));

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setDownloadProgress(prev => ({ ...prev, [id]: current }));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadingIds(prev => ({ ...prev, [id]: false }));
          triggerBrowserDownload(name);
          triggerToast(`Downloaded: ${name}`);
        }, 300);
      }
    }, 300);
  };

  // Tab - My Classes Schedules
  let liveScheduledClasses = [];
  if (profileData.assigned_teacher_id && matchedTeacherData) {
    try {
      const teacherTimetable = matchedTeacherData.timetable?.[0] || {};
      const teacherName = matchedTeacherData.name || 'Class Tutor';
      const teacherSubject = matchedTeacherData.primarySubject || matchedTeacherData.subjects_taught?.[0] || 'Mathematics';
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = daysOfWeek[new Date().getDay()];

      liveScheduledClasses = Object.keys(teacherTimetable).map((key, idx) => {
        const parts = key.split('-');
        const day = parts[0];
        const slot = parts.slice(1).join('-');
        const session = teacherTimetable[key];
        return {
          id: idx + 1,
          subject: teacherSubject,
          topic: session.title,
          teacher: teacherName,
          time: `${day}, ${slot.split(' - ')[0]}`,
          duration: '90 mins',
          isLive: day.toLowerCase() === currentDay.toLowerCase()
        };
      });
    } catch (e) {
      console.error('Failed to parse teacher timetable:', e);
    }
  }

  const scheduledClasses = liveScheduledClasses;
  const recordedArchive = [];

  // Tab - Tests States
  const [activeTestState, setActiveTestState] = useState(null); // 'taking', 'submitted', null
  const [testTimeRemaining, setTestTimeRemaining] = useState(180); // 3 mins demo timer
  const [testAnswers, setTestAnswers] = useState({ q1: '', q2: '', q3: '' });

  const handleStartTest = () => {
    setActiveTestState('taking');
    setTestTimeRemaining(180);
    setTestAnswers({ q1: '', q2: '', q3: '' });
    triggerToast('Mock Test started. Standard timer running.');
  };

  const handleSubmitTest = async () => {
    let correct = 0;
    if (testAnswers.q1 === 'Formaldehyde') correct++;
    if (testAnswers.q2 === 'Remains Unchanged') correct++;
    if (testAnswers.q3 === 'First order') correct++;

    const totalQuestions = mockTestQuestions.length;
    const scoreText = `${correct * 4} / ${totalQuestions * 4}`;
    const percentage = Math.round((correct / totalQuestions) * 100);

    const newMockResult = {
      id: `mock_${Date.now()}`,
      title: 'Chemistry & Physics Mini Mock #1',
      score: scoreText,
      percentage: percentage,
      rank: `#${Math.floor(Math.random() * 20) + 1}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      correct: correct,
      incorrect: totalQuestions - correct,
      percentageNum: percentage,
      xpEarned: 100
    };

    try {
      const currentLog = profileData.mock_tests_log || [];
      const updatedLog = [newMockResult, ...currentLog];
      const nextXp = studentXp + 100;

      await api.put(`/students/${profileData.studentId}`, {
        mock_tests_log: updatedLog,
        xp: nextXp
      });

      setProfileData(prev => ({
        ...prev,
        mock_tests_log: updatedLog,
      }));
      setStudentXp(nextXp);
      setActiveTestState('submitted');
      triggerToast('Mock Test submitted and saved to cloud! +100 XP');
    } catch (err) {
      console.error('Failed to save mock test:', err);
      setActiveTestState('submitted');
      triggerToast('Mock Test submitted successfully!');
    }
  };

  useEffect(() => {
    let tInterval;
    if (activeTestState === 'taking') {
      tInterval = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(tInterval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(tInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTestState]);

  const [logHoursInput, setLogHoursInput] = useState('');

  const handleLogStudyHours = async (e) => {
    e.preventDefault();
    const hrs = parseFloat(logHoursInput);
    if (isNaN(hrs) || hrs <= 0 || hrs > 24) {
      triggerToast('Please enter a valid number of hours (0.5 to 24).');
      return;
    }

    const newLogEntry = {
      date: new Date().toISOString(),
      hours: hrs
    };

    try {
      const currentLog = profileData.study_hours_log || [];
      const updatedLog = [...currentLog, newLogEntry];
      const nextStudyHours = studyHours + hrs;
      const nextXp = studentXp + Math.round(hrs * 10); // Award 10 XP per hour

      await api.put(`/students/${profileData.studentId}`, {
        study_hours_log: updatedLog,
        xp: nextXp
      });

      setProfileData(prev => ({
        ...prev,
        study_hours_log: updatedLog
      }));
      setStudyHours(nextStudyHours);
      setStudentXp(nextXp);
      setLogHoursInput('');
      triggerToast(`Successfully logged ${hrs} study hours! +${Math.round(hrs * 10)} XP`);
    } catch (err) {
      console.error('Failed to log study hours:', err);
      triggerToast('Failed to save study hours to cloud.');
    }
  };

  const getWeeklyHoursData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const loggedHours = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    const log = profileData.study_hours_log || [];
    log.forEach(item => {
      try {
        const d = new Date(item.date);
        const dayName = days[d.getDay()];
        loggedHours[dayName] += item.hours || 0;
      } catch (e) {
        console.error(e);
      }
    });

    const maxHrs = Math.max(...Object.values(loggedHours), 1);
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
      const hrs = loggedHours[day] || 0;
      return {
        day,
        hrs,
        pct: `${Math.min(Math.round((hrs / maxHrs) * 100), 100)}%`
      };
    });
  };

  const getMockTestTrendData = () => {
    const list = [...(profileData.mock_tests_log || [])].slice(0, 5).reverse();
    return list.map((item, idx) => ({
      label: `Mock #${idx + 1}`,
      score: item.percentage,
      pct: `${item.percentage}%`
    }));
  };

  // Mock Active Test details
  const mockTestQuestions = [
    { id: 'q1', text: 'Which of the following undergoes Cannizzaro reaction?', options: ['Acetaldehyde', 'Formaldehyde', 'Acetone', 'Benzophenone'] },
    { id: 'q2', text: 'The focal length of a concave mirror in water compared to air:', options: ['Increases', 'Decreases', 'Remains Unchanged', 'Becomes zero'] },
    { id: 'q3', text: 'What is the order of reaction if half-life is independent of initial concentration?', options: ['Zero order', 'First order', 'Second order', 'Third order'] }
  ];

  // Helper calculations for dynamic syllabus coverage
  const getSubjectCoverage = (subj) => {
    const chapters = syllabusChapters.filter(c => c.subject === subj);
    if (!chapters.length) return 0;
    const completed = chapters.filter(c => c.status === 'Completed').length;
    const inProgress = chapters.filter(c => c.status === 'In Progress').length;
    return Math.round(((completed + inProgress * 0.5) / chapters.length) * 100);
  };

  const getGlobalCoverage = () => {
    const completed = syllabusChapters.filter(c => c.status === 'Completed').length;
    const inProgress = syllabusChapters.filter(c => c.status === 'In Progress').length;
    return Math.round(((completed + inProgress * 0.5) / syllabusChapters.length) * 100);
  };

  const toggleChapterStatus = (id) => {
    setSyllabusChapters(prev => prev.map(c => {
      if (c.id === id) {
        let nextStatus = 'Not Started';
        if (c.status === 'Not Started') nextStatus = 'In Progress';
        else if (c.status === 'In Progress') nextStatus = 'Completed';
        triggerToast(`Updated "${c.name}" to ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const totalCoverage = getGlobalCoverage();

  const getAverageTestScore = () => {
    let totalPct = 0;
    let count = 0;

    if (profileData.test_score) {
      const math = profileData.test_score.Mathematics || 0;
      const science = profileData.test_score.Science || 0;
      totalPct += Math.round((math + science) / 2);
      count++;
    }

    if (profileData.mock_tests_log && profileData.mock_tests_log.length > 0) {
      profileData.mock_tests_log.forEach(test => {
        totalPct += test.percentage;
        count++;
      });
    }

    if (count > 0) {
      return Math.round(totalPct / count);
    }
    return 0;
  };

  // Tab - Progress Details
  const doubtsSolved = aiHistory.length + teacherDoubts.filter(d => d.status === 'Resolved').length;


  let liveAssignmentsSubmitted = 0;
  let liveAssignmentsPending = 0;
  if (profileData.assigned_teacher_id && matchedTeacherData) {
    const teacherAsgs = matchedTeacherData.assignments || [];
    const studentSubs = profileData.homework_submissions || [];

    teacherAsgs.forEach(asg => {
      const matchedSub = studentSubs.find(sub => sub.assignmentName === asg.name);
      if (matchedSub) {
        liveAssignmentsSubmitted += 1;
      } else {
        liveAssignmentsPending += 1;
      }
    });
  }

  const progressStats = {
    syllabusCoverage: totalCoverage,
    averageTestScore: getAverageTestScore(),
    assignmentsSubmitted: profileData.assigned_teacher_id ? liveAssignmentsSubmitted : 0,
    assignmentsPending: profileData.assigned_teacher_id ? liveAssignmentsPending : 0,
    doubtSolvedCount: doubtsSolved,
    studyHours: studyHours
  };

  const subjectBreakdown = (profileData.subjects || []).map((sub) => {
    const rate = getSubjectCoverage(sub);
    const grade = rate >= 90 ? 'A+' : rate >= 70 ? 'A' : 'B+';
    const colors = {
      'Mathematics': 'blue',
      'Chemistry': 'emerald',
      'Physics': 'indigo',
      'Science': 'orange',
      'Biology': 'rose',
      'English': 'purple'
    };
    const color = colors[sub] || 'slate';
    return { subject: sub, rate, grade, color };
  });



  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    localStorage.removeItem('cograd_student_name');
    localStorage.removeItem('cograd_token');
    triggerToast('Logged out successfully. Redirecting...');
    setTimeout(() => navigate('/login'), 900);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = { ...editProfileData };

      // Handle city waitlist transitions
      if (editProfileData.city === 'Other') {
        payload.matching_eligible = false;
        payload.status = 'waitlist';
      } else if (profileData.city === 'Other' && (editProfileData.city === 'Meerut' || editProfileData.city === 'Allahabad')) {
        payload.matching_eligible = true;
        payload.status = 'pending_match';
      }

      const updatedUser = await api.put(`/students/${profileData.studentId}`, payload);

      setProfileData({
        ...profileData,
        ...updatedUser,
        city: updatedUser.city,
        locality: updatedUser.locality,
        matching_eligible: updatedUser.matching_eligible,
        status: updatedUser.status,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        parentName: updatedUser.parentName,
        parentPhone: updatedUser.parentPhone,
        address: updatedUser.address,
        tuitionSlot: updatedUser.tuitionSlot,
        standard: updatedUser.standard,
        medium: updatedUser.medium,
        district: updatedUser.district,
        schoolName: updatedUser.schoolName,
        board: updatedUser.board
      });

      setIsEditingProfile(false);
      triggerToast('Profile details saved successfully!');

      // Check if they need to complete diagnostic placement test
      if (payload.matching_eligible && !updatedUser.test_score) {
        setPlacementAnswers({});
        setShowDiagnosticTest(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile details.');
    }
  };

  const handleCancelProfileEdit = () => {
    setEditProfileData({ ...profileData });
    setIsEditingProfile(false);
  };

  const NAV_ITEMS = [
    { name: 'Home', icon: LayoutDashboard },
    { name: 'Study Material', icon: BookMarked },
    { name: 'Tests', icon: FileText },
    { name: 'My Profile', icon: User },
    { name: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <>
      <DashboardShell
        navItems={NAV_ITEMS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        roleName="Student Dashboard"
        roleColor="emerald"
        userName={profileData.name}
        userAvatar={profileData.avatar}
        notifications={unreadNotifications}
        onClearNotifs={async () => {
          setUnreadNotifications(p => p.map(n => ({ ...n, isNew: false })));
          try {
            await api.put('/notifications/my-notifications/read-all');
          } catch (e) {
            console.error('Failed to mark user notifications as read:', e);
          }
        }}
        onDeleteNotif={async (id) => {
          setUnreadNotifications(p => p.filter(n => n.id !== id));
          try {
            await api.delete(`/notifications/my-notifications/${id}`);
          } catch (e) {
            console.error('Failed to delete notification:', e);
          }
        }}
        onClearAllNotifs={async () => {
          setUnreadNotifications([]);
          try {
            await api.delete('/notifications/my-notifications/clear-all');
          } catch (e) {
            console.error('Failed to clear notifications:', e);
          }
        }}
        onLogout={handleLogout}
        toast={{ show: showToast, message: toastMessage, type: 'success' }}
        onCtaClick={() => setActiveTab('Book Demo')}
        headerRight={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl text-amber-700 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{profileData.streak}d</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-indigo-700 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500 animate-pulse" />
              <span>{studentXp} XP</span>
            </div>
          </div>
        }
      >


        {/* ── TAB CONTENT ── */}
        <div className="tab-content-enter">
          {profileData.matching_eligible === false || profileData.status === 'waitlist' ? (
            showDiagnosticTest ? (
              <DiagnosticGame
                questions={getDiagnosticQuestions(profileData.standard)}
                standard={profileData.standard}
                onComplete={async (scores) => {
                  try {
                    const updated = {
                      ...profileData,
                      test_score: scores,
                      test_completed_at: new Date().toISOString(),
                      status: 'pending_match'
                    };
                    await api.put(`/students/${profileData.studentId}`, updated);
                    setProfileData(updated);
                    setShowDiagnosticTest(false);
                    triggerToast('Diagnostic placement test completed successfully!');
                  } catch (err) {
                    alert(err.message || 'Failed to submit test score.');
                  }
                }}
              />
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-9 h-9 text-amber-500" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">You're on Our Waitlist!</h3>
                    <p className="text-slate-500 text-xs mt-2">
                      Welcome to Cograd, <strong>{profileData.name}</strong>!
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-100 text-left">
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      Cograd Pathshala currently operates in <strong>Meerut</strong> and <strong>Allahabad</strong>. We've recorded your preference for <strong>{profileData.city || 'your city'}</strong>, and we'll notify you as soon as we expand to your area.
                    </p>
                  </div>

                  {!isEditingProfile ? (
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-2">Submitted Details</span>
                        <div className="space-y-1.5 text-xs text-slate-650">
                          <p><span className="font-bold text-slate-800">Name:</span> {profileData.name}</p>
                          <p><span className="font-bold text-slate-800">Class:</span> {profileData.standard}</p>
                          <p><span className="font-bold text-slate-800">City:</span> {profileData.city}</p>
                          {profileData.locality && <p><span className="font-bold text-slate-800">Locality:</span> {profileData.locality}</p>}
                          <p><span className="font-bold text-slate-800">Subjects:</span> {profileData.subjects.join(', ')}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditProfileData({ ...profileData });
                          setIsEditingProfile(true);
                        }}
                        className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile / Change City
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-5 border border-slate-100 text-left space-y-4">
                      <span className="text-xs font-black text-slate-850 block">Update Profile Details</span>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Student Full Name</label>
                        <input
                          type="text"
                          required
                          value={editProfileData.name}
                          onChange={(e) => setEditProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">City</label>
                          <select
                            value={editProfileData.city}
                            onChange={(e) => setEditProfileData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                          >
                            <option value="Meerut">Meerut</option>
                            <option value="Allahabad">Allahabad</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Area / Locality</label>
                          <input
                            type="text"
                            value={editProfileData.locality || ''}
                            onChange={(e) => setEditProfileData(prev => ({ ...prev, locality: e.target.value }))}
                            placeholder="e.g. Civil Lines, Sadar"
                            />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">School Name</label>
                          <input
                            type="text"
                            required
                            value={editProfileData.schoolName || ''}
                            onChange={(e) => setEditProfileData(prev => ({ ...prev, schoolName: e.target.value }))}
                            placeholder="Enter school name"
                            className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Board of Education</label>
                          <select
                            value={editProfileData.board || ''}
                            onChange={(e) => setEditProfileData(prev => ({ ...prev, board: e.target.value }))}
                            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                          >
                            <option value="" disabled>Choose your board</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="State Board">State Board</option>
                            <option value="UP Board">UP Board</option>
                            <option value="IB">IB</option>
                            <option value="IGCSE">IGCSE</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Updates
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )
          ) : showDiagnosticTest ? (
            <DiagnosticGame
              questions={getDiagnosticQuestions(profileData.standard)}
              standard={profileData.standard}
              onComplete={async (scores, testAnswers) => {
                try {
                  const updated = {
                    ...profileData,
                    test_score: {
                      ...scores,
                      answers: testAnswers
                    },
                    test_completed_at: new Date().toISOString(),
                    status: 'pending_match'
                  };
                  await api.put(`/students/${profileData.studentId}`, updated);
                  setProfileData(updated);
                  setShowDiagnosticTest(false);
                  triggerToast('Diagnostic placement test completed successfully!');
                } catch (err) {
                  alert(err.message || 'Failed to submit test score.');
                }
              }}
            />
          ) : (
            <>
              {/* TAB 1: HOME (MY DASHBOARD) */}
              {activeTab === 'Home' && (
                <div className="space-y-5 animate-fade-in text-left">

                  {/* ── 1. WELCOME HERO ── */}
                  <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/15 relative overflow-hidden">
                    <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute right-8 bottom-6 text-white/10 pointer-events-none hidden md:block">
                      <GraduationCap className="w-36 h-36 transform rotate-12" />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Hi {profileData.name ? profileData.name.split(' ')[0] : 'Student'} 👋</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-white/20 backdrop-blur-md text-white font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 fill-indigo-200 text-indigo-200 animate-pulse" />
                            <span>{studentXp} XP</span>
                          </span>
                          <span className="text-[10px] bg-white/20 backdrop-blur-md text-white font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-sm">
                            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                            <span>{profileData.streak}d Streak</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-blue-100 text-sm max-w-xl font-medium leading-relaxed">
                        {profileData.test_score ? (
                          `Your diagnostic placement score is ${profileData.test_score.totalMarksText} (${getAverageTestScore()}%). We have personalized your study plan for ${profileData.standard || 'your grade'}!`
                        ) : (
                          "Welcome to Cograd Pathshala. Complete homework and review study materials."
                        )}
                      </p>
                      {localStorage.getItem(`cograd_parent_message_to_${profileData.studentId}`) && (
                        <div className="mt-4 p-3.5 bg-white/12 backdrop-blur-md rounded-2xl border border-white/10 text-xs text-white max-w-md">
                          <div className="font-extrabold uppercase tracking-wider text-[9px] text-amber-300 flex items-center gap-1 mb-1">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                            Message from {profileData.parentName || 'Parent'}
                          </div>
                          <p className="font-semibold italic text-slate-100">"{localStorage.getItem(`cograd_parent_message_to_${profileData.studentId}`)}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── 2. QUICK STATS ROW ── */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: 'Attendance',
                        val: (!studentProfile.attendance_log || studentProfile.attendance_log.length === 0) ? 'Pending' : studentProfile.attendance,
                        desc: (!studentProfile.attendance_log || studentProfile.attendance_log.length === 0) ? 'Needs 1st session' : 'Aim for 95%+',
                        accent: 'border-l-blue-500'
                      },
                      {
                        title: 'Tests This Week',
                        val: studentProfile.testsThisWeek === '0' ? '0' : studentProfile.testsThisWeek,
                        desc: studentProfile.testsThisWeek === '0' ? 'No scheduled tests' : 'Mock papers assigned',
                        accent: 'border-l-purple-500'
                      },
                      {
                        title: 'Pending HW',
                        val: studentProfile.pendingHW === '0' ? '0' : studentProfile.pendingHW,
                        desc: studentProfile.pendingHW === '0' ? 'All caught up!' : 'Homework due soon',
                        accent: 'border-l-rose-500'
                      },
                      {
                        title: 'Study Streak',
                        val: `${profileData.streak} Days`,
                        desc: profileData.streak > 0 ? 'Keep it going!' : 'Start studying today',
                        accent: 'border-l-amber-500'
                      }
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${stat.accent} p-4 shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                        <div className="text-xl font-black text-slate-800 tracking-tight mt-2">{stat.val}</div>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate" title={stat.desc}>{stat.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* ── 3. PLACEMENT ASSESSMENT BANNER ── */}
                  {profileData.matching_eligible && !profileData.test_score && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                      <div className="p-3 bg-amber-100 rounded-xl shrink-0">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <h4 className="text-sm font-black text-slate-800">Placement Assessment Required</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Complete your Diagnostic Placement Test to find nearby tutors matching your level.</p>
                      </div>
                      <button
                        onClick={() => {
                          setPlacementAnswers({});
                          setShowDiagnosticTest(true);
                        }}
                        className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <FileText className="w-4 h-4" />
                        Start Test
                      </button>
                    </div>
                  )}

                  {/* ── 4. DIAGNOSTIC RESULT + PARENT QUIZ ── */}
                  {(profileData.test_score || localStorage.getItem(`cograd_assigned_tests_${profileData.studentId}`)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {profileData.test_score && (
                        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">Test Analysis</span>
                              <span className="text-[9px] text-slate-400 font-bold">
                                {new Date(profileData.test_completed_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-800">Diagnostic Performance</h4>
                            <p className="text-[11px] text-slate-500 font-semibold">
                              Personalized path for <strong className="text-slate-700">{profileData.standard}</strong>:
                            </p>
                            <div className="flex gap-3">
                              <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-center flex-1">
                                <span className="text-[8px] text-slate-400 font-bold uppercase block">Math</span>
                                <span className="text-xs font-black text-emerald-600 block mt-0.5">{profileData.test_score.mathMarksText}</span>
                              </div>
                              <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-center flex-1">
                                <span className="text-[8px] text-slate-400 font-bold uppercase block">Science</span>
                                <span className="text-xs font-black text-blue-600 block mt-0.5">{profileData.test_score.scienceMarksText}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowQuestionsModal(true)}
                            className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-0"
                          >
                            <Sparkles className="w-3 h-3" />
                            View Questions Analysis
                          </button>
                        </div>
                      )}

                      {localStorage.getItem(`cograd_assigned_tests_${profileData.studentId}`) && (() => {
                        let testObj;
                        try {
                          testObj = JSON.parse(localStorage.getItem(`cograd_assigned_tests_${profileData.studentId}`));
                        } catch {
                          return null;
                        }
                        if (!testObj) return null;
                        const testResult = localStorage.getItem(`cograd_assigned_tests_result_${profileData.studentId}`);
                        return (
                          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">📝 Parent Assigned Quiz</h4>
                                {testResult ? (
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-extrabold px-2 py-0.5 rounded-full">Done</span>
                                ) : (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">Pending</span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-slate-700">{testObj.subject} — {testObj.topic} ({testObj.questionCount} Qs)</p>
                              <p className="text-[10px] text-slate-400 font-semibold">Parent assigned quiz to verify understanding. Earn +100 XP!</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              {testResult ? (
                                <div className="bg-slate-50 border border-emerald-100 rounded-xl px-3 py-1 text-center">
                                  <span className="text-[9px] text-slate-400 font-bold block">Score</span>
                                  <span className="text-sm font-black text-emerald-600">{testResult}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setParentTestSubmitted(false);
                                    setParentTestAnswers({});
                                    setShowParentTestModal(true);
                                  }}
                                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-sm text-center transition-all cursor-pointer border-0"
                                >
                                  Start Quiz
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ── 5. MOCK TEST TREND + TUTOR CARD ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Mock Test Trend Chart */}
                    <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                        <div>
                          <h5 className="text-sm font-black text-slate-800">Mock Test Scores Trend</h5>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Visual report of last 5 mock papers</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2.5 py-1 rounded-lg">Avg: {getAverageTestScore()}%</span>
                      </div>

                      {getMockTestTrendData().length === 0 ? (
                        <div className="h-36 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 text-center p-4">
                          <Award className="w-6 h-6 text-slate-300 animate-bounce" />
                          <span className="text-[10px] font-black text-slate-500 mt-1.5 block">No mock test scores logged yet.</span>
                        </div>
                      ) : (
                        <div className="h-36 flex items-end justify-between px-2 pt-6">
                          {getMockTestTrendData().map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-grow group">
                              <div className="w-full px-2 relative flex justify-center">
                                <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow z-10">
                                  {item.score}%
                                </span>
                                <div
                                  style={{ height: item.pct }}
                                  className="w-7 bg-gradient-to-t from-indigo-400 to-indigo-500 hover:from-indigo-600 hover:to-indigo-600 rounded-t-lg transition-all duration-300 shadow-sm shadow-indigo-400/20 cursor-pointer"
                                ></div>
                              </div>
                              <span className="text-[9px] text-slate-400 font-extrabold mt-2 truncate w-14 text-center">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assigned Tutor + Demo Bookings */}
                    <div className="lg:col-span-4 space-y-5">
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Assigned Tutors</h5>
                        {!profileData.assigned_teacher_id || !matchedTeacherData ? (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl py-5 text-center text-xs text-slate-500 font-semibold">
                            Tutor matching in progress.
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3">
                            <div className="relative w-10 h-10 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white">
                              <img src={matchedTeacherData.avatar || "/assets/avatar-teacher.png"} alt="Teacher avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-grow">
                              <span className="text-[8px] bg-blue-50 text-blue-700 border border-blue-100 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Home Tutor
                              </span>
                              <h5 className="text-[11px] font-black text-slate-800 mt-1 truncate">{matchedTeacherData.name}</h5>
                              <span className="text-[9px] text-slate-400 font-semibold block truncate">
                                {matchedTeacherData.primarySubject || 'Mathematics'} • {matchedTeacherData.qualification || 'Verified'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {myDemoBookings.length > 0 && (
                        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                          <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Demo & Trial Classes</h5>
                          <div className="space-y-2.5">
                            {myDemoBookings.map((booking) => {
                              const isPendingTeacher = booking.status === 'pending_teacher_acceptance';
                              const isConfirmed = booking.status === 'confirmed';
                              const isDeclined = booking.status === 'declined';
                              return (
                                <div key={booking.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-left">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h6 className="text-[11px] font-black text-slate-800">
                                        {booking.subjects.join(', ')} Trial
                                      </h6>
                                      <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                                        {booking.preferredDate} at {booking.preferredTime}
                                      </span>
                                    </div>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                      isConfirmed
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : isPendingTeacher
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : isDeclined
                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                      {isConfirmed ? 'Scheduled' : isPendingTeacher ? 'Pending Teacher' : isDeclined ? 'Declined' : 'Pending Admin'}
                                    </span>
                                  </div>
                                  {booking.assigned_teacher_id && (
                                    <div className="pt-2 border-t border-slate-100/70 flex items-center space-x-2">
                                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px]">
                                        👨‍🏫
                                      </div>
                                      <div className="min-w-0 flex-grow">
                                        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wide block">Allotted Tutor</span>
                                        <span className="text-[10px] font-bold text-slate-700 block truncate">
                                          {matchedTeacherData?.id === booking.assigned_teacher_id ? matchedTeacherData.name : 'Assigned Tutor'}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── 6. SUBJECT PERFORMANCE ── */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Subject Performance</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mb-4">Syllabus progress based on session logs.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {subjectBreakdown.map((sb) => (
                        <div key={sb.subject} className="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                            <span>{sb.subject}</span>
                            <span className="text-[9px] bg-white px-2 py-0.5 rounded border border-slate-100 font-black uppercase tracking-wider text-slate-500">
                              {sb.grade}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="h-2 bg-slate-200 rounded-full flex-grow overflow-hidden">
                              <div
                                className={`h-full rounded-full ${sb.color === 'emerald' ? 'bg-blue-600' :
                                  sb.color === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'
                                }`}
                                style={{ width: `${sb.rate}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-800 shrink-0">{sb.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── 7. WEEKLY STUDY TRACKER + ATTENDANCE ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Study Hours Chart */}
                    <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-3 gap-2 text-left">
                        <div>
                          <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider">Weekly Study Tracker</h5>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Log self-study or guided session hours.</p>
                        </div>
                        <form onSubmit={handleLogStudyHours} className="flex items-center gap-2.5 shrink-0">
                          <div className="relative flex items-center">
                            <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="24"
                              required
                              value={logHoursInput}
                              onChange={(e) => setLogHoursInput(e.target.value)}
                              placeholder="Hours"
                              className="text-xs pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none w-28 font-bold text-slate-800 transition-all placeholder-slate-400"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs px-5 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 uppercase tracking-wider flex items-center gap-1.5"
                          >
                            Log Hours
                          </button>
                        </form>
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getWeeklyHoursData()} margin={{ top: 12, right: 8, left: -20, bottom: 0 }} barCategoryGap="25%">
                            <defs>
                              <linearGradient id="studyHoursGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f030" />
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                              axisLine={false}
                              tickLine={false}
                              unit="h"
                            />
                            <Tooltip
                              cursor={{ fill: 'rgba(59,130,246,0.06)', radius: 8 }}
                              contentStyle={{
                                background: '#0f172a',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '8px 14px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                              }}
                              labelStyle={{ color: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                              itemStyle={{ color: '#60a5fa', fontSize: 12, fontWeight: 800 }}
                              formatter={(value) => [`${value} hrs`, 'Study Time']}
                            />
                            <Bar dataKey="hrs" fill="url(#studyHoursGradient)" radius={[8, 8, 0, 0]} maxBarSize={36} animationDuration={800} animationEasing="ease-out">
                              {getWeeklyHoursData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fillOpacity={entry.hrs > 0 ? 1 : 0.25} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Attendance Sheet */}
                    <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                      <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Attendance Sheet</h5>
                      {!studentProfile.attendance_log || studentProfile.attendance_log.length === 0 ? (
                        <div className="bg-slate-50 rounded-xl border border-slate-100/50 py-6 text-center">
                          <CheckCircle2 className="w-6 h-6 text-slate-300 mx-auto" />
                          <p className="text-[10px] font-bold text-slate-500 mt-1">Attendance logs will sync after your first class.</p>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between p-3 bg-blue-50/40 border border-blue-100/50 rounded-xl">
                            <div>
                              <span className="text-[11px] font-black text-blue-900 block">Rate</span>
                              <p className="text-[9px] text-blue-600 font-bold mt-0.5">Center presence metric</p>
                            </div>
                            <span className={`text-sm font-black px-2.5 py-1 rounded-xl shadow-sm border ${parseFloat(studentProfile.attendance) >= 90 ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                              parseFloat(studentProfile.attendance) >= 75 ? 'bg-amber-50 text-amber-800 border-amber-100' :
                                'bg-rose-50 text-rose-800 border-rose-100'
                            }`}>
                              {studentProfile.attendance}
                            </span>
                          </div>
                          <div className="space-y-2 text-[10px] font-bold text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <div className="flex justify-between">
                              <span>Total classes</span>
                              <span className="text-slate-800 font-black">{studentProfile.attendance_log.length}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100/50 pt-1.5">
                              <span>Present</span>
                              <span className="text-slate-800 font-black">{studentProfile.attendance_log.filter(l => l.status === 'Present').length}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100/50 pt-1.5">
                              <span>Absent</span>
                              <span className="text-slate-800 font-black">{studentProfile.attendance_log.filter(l => l.status === 'Absent').length}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── 8. STUDY MATERIAL — RECENTLY ADDED ── */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="text-sm font-black text-slate-800 tracking-tight">Study Material</h5>
                        <p className="text-slate-400 text-[10px] mt-0.5 font-semibold">Recently added resources</p>
                      </div>
                      <button onClick={() => setActiveTab('Study Material')} className="text-xs text-blue-600 hover:underline font-bold cursor-pointer">View Library</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {studyMaterials.map((mat) => (
                        <div
                          key={mat.id}
                          className="p-4 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/5 rounded-xl transition-all flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{mat.type}</span>
                            <h4 className="text-xs font-bold text-slate-800 mt-2 line-clamp-2 h-8 leading-tight">{mat.name}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Size: {mat.size}</span>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                            {downloadingIds[mat.id] ? (
                              <div className="w-full">
                                <div className="flex justify-between items-center text-[9px] font-bold text-blue-700 mb-1">
                                  <span>Downloading...</span>
                                  <span className="tabular-nums">{downloadProgress[mat.id]}%</span>
                                </div>
                                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600" style={{ width: `${downloadProgress[mat.id]}%` }}></div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="text-[10px] text-slate-400 font-semibold">Ready</span>
                                <button
                                  onClick={() => handleDownload(mat.id, mat.name)}
                                  className="p-1.5 bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-100 rounded-xl transition-all cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB: BOOK DEMO */}
              {activeTab === 'Book Demo' && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-2 sm:p-6 text-left animate-fade-in no-glass">
                  <DemoBooking isEmbedded={true} onClose={() => setActiveTab('Home')} prefillData={profileData} theme="green" />
                </div>
              )}

              {/* TAB 3: STUDY MATERIAL */}
              {activeTab === 'Study Material' && (
                <div className="space-y-6 tab-content-enter">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Side: Digital Resource Library */}
                    <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">Digital Resource Library</h3>
                          <p className="text-slate-400 text-xs">Access syllabus notes, practice worksheets, and formula cheat sheets.</p>
                        </div>
                        <div className="relative w-full sm:w-48">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search PDF..."
                            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studyMaterials.length === 0 ? (
                          <div className="md:col-span-2 empty-state bg-slate-50 border border-slate-100 rounded-2xl py-10">
                            <BookMarked className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-xs font-bold text-slate-500 mt-2">No study materials shared by your tutor yet.</p>
                          </div>
                        ) : (
                          studyMaterials.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-4 border border-slate-100 hover:border-blue-100 hover:bg-slate-50/20 rounded-2xl transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-center">
                                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase bg-blue-50 text-blue-800`}>
                                    {doc.batch || 'Study Notes'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-semibold">{doc.size || '1.4 MB'}</span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-805 mt-3 leading-snug">{doc.name}</h4>
                                <span className="text-[10px] text-slate-400 mt-1 block">Uploaded: {doc.date || 'Recently'}</span>
                              </div>

                              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                                {downloadingIds[doc.id] ? (
                                  <div className="w-full flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-blue-700 animate-pulse">Downloading...</span>
                                    <span className="text-[9px] font-bold text-blue-700">{downloadProgress[doc.id]}%</span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-[10px] text-slate-400">PDF Document</span>
                                    <button
                                      onClick={() => handleDownload(doc.id, doc.name)}
                                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 border border-slate-100 hover:border-blue-100"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right Side: Smart Notes & Flashcards Engine */}
                    <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                          <div>
                            <h3 className="text-base font-black text-slate-800 tracking-tight">Smart Flashcards Arena</h3>
                            <p className="text-slate-400 text-[10px] font-semibold">Interactive active recall cards</p>
                          </div>
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2.5 py-1 rounded-xl">Active Study Session</span>
                        </div>

                        {/* Deck Selector Dropdowns */}
                        <div className="grid grid-cols-3 gap-1.5 mb-5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                          {flashcardDecks.map(deck => (
                            <button
                              key={deck.id}
                              type="button"
                              onClick={() => {
                                setActiveDeckId(deck.id);
                                setCurrentCardIndex(0);
                                setIsCardFlipped(false);
                                triggerToast(`Switched to deck: ${deck.name}`);
                              }}
                              className={`py-2 px-1 text-[10px] font-bold rounded-xl text-center truncate cursor-pointer transition-all ${activeDeckId === deck.id
                                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200/50'
                                  : 'text-slate-500 hover:text-slate-800'
                                }`}
                              title={deck.name}
                            >
                              {deck.subject}
                            </button>
                          ))}
                        </div>

                        {/* 3D Flashcard Box */}
                        {(() => {
                          const activeDeck = flashcardDecks.find(d => d.id === activeDeckId);
                          const currentCard = activeDeck?.cards[currentCardIndex];
                          const totalCards = activeDeck?.cards.length || 0;
                          const masteredCount = deckProgress[activeDeckId] || 0;
                          return (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-1">
                                <span>Deck: {activeDeck?.name}</span>
                                <span>Card {currentCardIndex + 1} of {totalCards}</span>
                              </div>

                              {/* Flipping Card body */}
                              <div
                                onClick={handleFlipCard}
                                className={`h-52 rounded-2xl cursor-pointer flex flex-col items-center justify-center p-6 text-center transition-all duration-500 relative overflow-hidden select-none hover:shadow-lg border ${isCardFlipped
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:border-blue-200'
                                  }`}
                              >
                                {isCardFlipped ? (
                                  <div className="space-y-2.5 animate-fade-in">
                                    <span className="text-[9px] bg-white/20 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Answer</span>
                                    <p className="text-sm font-semibold leading-relaxed text-white">{currentCard?.back}</p>
                                    <span className="text-[9px] text-blue-200 block pt-1">Tap to flip back</span>
                                  </div>
                                ) : (
                                  <div className="space-y-2.5">
                                    <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100">{activeDeck?.subject}</span>
                                    <p className="text-sm font-bold leading-snug text-slate-800">{currentCard?.front}</p>
                                    <span className="text-[9px] text-slate-400 block pt-1">Tap to reveal answer</span>
                                  </div>
                                )}
                              </div>

                              {/* Card Controls */}
                              <div className="flex items-center justify-between pt-1">
                                <button
                                  onClick={handlePrevCard}
                                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  Prev
                                </button>

                                <button
                                  onClick={handleMarkMastered}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1"
                                >
                                  <Trophy className="w-3.5 h-3.5 text-white" />
                                  <span>Mastered</span>
                                </button>

                                <button
                                  onClick={handleNextCard}
                                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  Next
                                </button>
                              </div>

                              {/* Deck Progress Info */}
                              <div className="pt-3 border-t border-slate-100 space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                  <span>Mastery progress</span>
                                  <span>{masteredCount} cards mastered</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((masteredCount / totalCards) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="mt-5 bg-blue-50 border border-blue-100/30 rounded-2xl p-4 flex items-start space-x-3">
                        <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-blue-905">Active Recall Technique</h4>
                          <p className="text-[10px] text-blue-700 font-semibold leading-relaxed mt-1">
                            Use flashcards for self-testing to trigger brain active recall pathways, strengthening long-term memory retrieval.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: TESTS */}
              {activeTab === 'Tests' && (
                <div className="space-y-6 tab-content-enter">
                  {/* Test Simulator Card */}
                  {activeTestState === 'taking' ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <div>
                          <span className="text-xs bg-blue-600 text-white font-bold px-2.5 py-1 rounded-xl">JEE Mock Arena</span>
                          <h3 className="text-lg font-black text-slate-800 mt-2">Active Test: Chemistry & Physics Mini Mock #1</h3>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-right">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Time Remaining</span>
                          <span className="text-lg font-black text-red-500 tabular-nums">
                            {Math.floor(testTimeRemaining / 60)}:{(testTimeRemaining % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {mockTestQuestions.map((q, qidx) => (
                          <div key={q.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                            <div className="text-xs font-bold text-slate-800 mb-3">Q{qidx + 1}. {q.text}</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {q.options.map((opt) => {
                                const isSelected = testAnswers[q.id] === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setTestAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    className={`text-left p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isSelected
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-end space-x-3">
                        <button
                          onClick={() => {
                            if (confirm('Cancel test session? Responses will not be graded.')) {
                              setActiveTestState(null);
                            }
                          }}
                          className="px-5 py-2.5 bg-white border border-slate-100 text-slate-500 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-50"
                        >
                          Cancel Exam
                        </button>
                        <button
                          onClick={handleSubmitTest}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                        >
                          Submit Paper
                        </button>
                      </div>
                    </div>
                  ) : activeTestState === 'submitted' ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center max-w-lg mx-auto">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800">Test Submitted Successfully!</h3>
                      <p className="text-xs text-slate-500 mt-2">Your automated evaluation report has been finalized.</p>

                      <div className="my-6 p-4 bg-slate-50 rounded-2xl grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Correct</span>
                          <span className="text-base font-black text-blue-600">2 / 3</span>
                        </div>
                        <div className="text-center border-x border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Incorrect</span>
                          <span className="text-base font-black text-red-500">1 / 3</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Score</span>
                          <span className="text-base font-black text-slate-800">4 / 12</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTestState(null)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        Back to Test Lobby
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                      {/* Left: Active Mock test */}
                      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-lg font-black text-slate-805 tracking-tight mb-4">Active Assessment Papers</h3>

                        {!profileData.assigned_teacher_id || !matchedTeacherData ? (
                          <div className="empty-state bg-slate-50 border border-slate-100 rounded-2xl py-10">
                            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-xs font-bold text-slate-500 mt-2">No tutor matched yet.</p>
                          </div>
                        ) : !matchedTeacherData.tests || matchedTeacherData.tests.length === 0 ? (
                          <div className="empty-state bg-slate-50 border border-slate-100 rounded-2xl py-10">
                            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-xs font-bold text-slate-500 mt-2">No active tests assigned by your tutor yet.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {matchedTeacherData.tests.map((test) => (
                              <div key={test.id} className="p-5 border border-blue-100 bg-blue-50/10 rounded-2xl flex justify-between items-center">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{test.batch || 'Tutor Assignment'}</span>
                                    <span className="text-[10px] text-slate-400 font-bold">Duration: {test.duration || '60 mins'}</span>
                                  </div>
                                  <h4 className="text-sm font-black text-slate-800">{test.name}</h4>
                                  <p className="text-xs text-slate-500 mt-1">Status: {test.status || 'Active'}</p>
                                </div>
                                <button
                                  onClick={handleStartTest}
                                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
                                >
                                  Start Test Room
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Previous results */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Past Test Performance</h3>
                        <div className="space-y-3">
                          {!profileData.mock_tests_log || profileData.mock_tests_log.length === 0 ? (
                            <div className="py-6 text-center text-slate-400 text-[11px] font-semibold bg-slate-50 rounded-2xl border border-slate-100/55">
                              No mock tests completed yet. Start a test above!
                            </div>
                          ) : (
                            profileData.mock_tests_log.map((mock, idx) => (
                              <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs animate-fade-in">
                                <div>
                                  <span className="font-bold text-slate-700">{mock.title}</span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">Date: {mock.date}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-slate-800">{mock.score}</span>
                                  <span className="text-[9px] text-blue-600 block font-bold">Rank: {mock.rank}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}
              {/* TAB 5: MY PROFILE */}
              {activeTab === 'My Profile' && (
                <div className="space-y-6 tab-content-enter text-left">
                  {/* Header registry card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">

                      {/* Photo with Edit hover effect */}
                      <div className="relative group w-24 h-24 shrink-0 rounded-full border-4 border-blue-50 shadow-md bg-slate-100 flex items-center justify-center overflow-hidden">
                        {profileData.avatar ? (
                          <img
                            src={profileData.avatar}
                            alt={profileData.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-black text-slate-400 select-none">
                            {profileData.name ? profileData.name.replace(/Mrs\.|Mr\.|Dr\./, '').trim().slice(0, 2).toUpperCase() : 'S'}
                          </span>
                        )}

                        {isEditingProfile && (
                          <button
                            type="button"
                            onClick={() => setShowAvatarModal(true)}
                            className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0"
                            title="Edit Avatar Image"
                          >
                            <Camera className="w-6 h-6" />
                          </button>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{profileData.name}</h3>
                        <p className="text-xs text-slate-400 font-bold mt-1">Enrollment ID: <span className="text-slate-600 font-black">{profileData.studentId}</span></p>

                        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                          <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-800 px-3 py-1 rounded-full font-black uppercase tracking-wider">{profileData.board ? (profileData.board.toLowerCase().includes('board') ? profileData.board : `${profileData.board} Board`) : 'CBSE Board'}</span>
                          <span className="text-[9px] bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 rounded-full font-black uppercase tracking-wider">Join Date: {profileData.joinDate}</span>
                          <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 fill-indigo-400 text-indigo-400 animate-pulse" />
                            <span>{studentXp} XP</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isEditingProfile ? (
                      <button
                        onClick={() => {
                          setEditProfileData({ ...profileData });
                          setIsEditingProfile(true);
                        }}
                        className="w-full md:w-auto self-start md:self-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile Details</span>
                      </button>
                    ) : null}
                  </div>

                  {/* Profile Details Card */}
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      {!isEditingProfile ? (
                        <div className="space-y-6">
                          {/* Academic target preferences */}
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Academic Target Preferences</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Enrolled Program Target</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.standard}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Preferred Learning Subjects</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.subjects.join(', ')}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Medium of instruction</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.medium}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Tuition Location District</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.district}, {profileData.state}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">School Name</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.schoolName || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Board of Education</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.board || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tuition contact details */}
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Student Contact Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Student Primary Email</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.email}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Student Phone Number</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">+91 {profileData.phone}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Parent / Guardian Name</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.parentName}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Parent Contact Phone</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">+91 {profileData.parentPhone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Home address & preferred schedule slots */}
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Home Tuition Address & Schedule Slots</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                              <div className="md:col-span-2">
                                <span className="text-[10px] text-slate-400 font-extrabold block">Tuition Delivery Address</span>
                                <span className="text-xs font-semibold text-slate-700 mt-1 block leading-relaxed">{profileData.address}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-extrabold block">Preferred Daily Slot</span>
                                <span className="text-xs font-black text-slate-800 mt-1 block">{profileData.tuitionSlot}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSaveProfile} className="space-y-6">

                          {/* Presets inline avatar selection when editing */}
                          {showAvatarModal && (
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50 mb-4 animate-slide-up space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
                                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Select Profile Image</span>
                                <button type="button" onClick={() => setShowAvatarModal(false)} className="text-xs font-bold text-red-500 hover:text-red-700">Close</button>
                              </div>

                              {/* Presets row */}
                              <div className="space-y-1.5 text-left">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Preset Characters</span>
                                <div className="flex flex-wrap gap-3">
                                  {presetAvatars.map((av, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setEditProfileData(prev => ({ ...prev, avatar: av }));
                                        triggerToast("Preset avatar selected!");
                                      }}
                                      className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${editProfileData.avatar === av ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100'}`}
                                    >
                                      <img src={av} alt="Preset avatar" className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Upload / Custom URL */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                {/* Upload Local File */}
                                <div className="space-y-1.5 text-left">
                                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Upload Local File</span>
                                  <label className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700 transition-all">
                                    <UploadCloud className="w-4 h-4 text-slate-400" />
                                    <span>Choose Image...</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          if (file.size > 800000) {
                                            triggerToast("Choose an image under 800KB.");
                                            return;
                                          }
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            setEditProfileData(prev => ({ ...prev, avatar: reader.result }));
                                            triggerToast("Custom photo loaded!");
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>

                                {/* Custom Image URL */}
                                <div className="space-y-1.5 text-left">
                                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Paste Image URL</span>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder="https://example.com/photo.jpg"
                                      value={editProfileData.avatar && !editProfileData.avatar.startsWith('data:') ? editProfileData.avatar : ''}
                                      onChange={(e) => setEditProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                                      className="flex-1 text-xs py-2 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold w-full"
                                    />
                                    {editProfileData.avatar && !editProfileData.avatar.startsWith('data:') && (
                                      <button
                                        type="button"
                                        onClick={() => triggerToast("Custom URL applied!")}
                                        className="bg-blue-650 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-2 rounded-xl transition-all uppercase tracking-wider shrink-0 border-0"
                                      >
                                        Apply
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Remove profile photo option */}
                              {editProfileData.avatar && (
                                <div className="pt-2 flex justify-start border-t border-slate-200/40">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditProfileData(prev => ({ ...prev, avatar: '' }));
                                      triggerToast("Profile photo removed!");
                                    }}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Remove Photo (Use Initials)</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Update Personal & Registry Info</h4>

                            {/* Name & Target Exam */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Student Full Name</label>
                                <input
                                  type="text"
                                  required
                                  value={editProfileData.name}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Target exam class</label>
                                <select
                                  value={editProfileData.standard}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, standard: e.target.value }))}
                                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="Class 12 (JEE Main & Advanced)">Class 12 (JEE Main & Advanced)</option>
                                  <option value="Class 12 (NEET Target)">Class 12 (NEET Target)</option>
                                  <option value="Class 11 (JEE Core Foundation)">Class 11 (JEE Core Foundation)</option>
                                  <option value="Class 10 CBSE Boards Core">Class 10 CBSE Boards Core</option>
                                </select>
                              </div>
                            </div>

                            {/* School Name & Board */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">School Name</label>
                                <input
                                  type="text"
                                  required
                                  value={editProfileData.schoolName || ''}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, schoolName: e.target.value }))}
                                  className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                  placeholder="Enter school name"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Board of Education</label>
                                <select
                                  value={editProfileData.board || ''}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, board: e.target.value }))}
                                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="" disabled>Choose your board</option>
                                  <option value="CBSE">CBSE</option>
                                  <option value="ICSE">ICSE</option>
                                  <option value="State Board">State Board</option>
                                  <option value="UP Board">UP Board</option>
                                  <option value="IB">IB</option>
                                  <option value="IGCSE">IGCSE</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>

                            {/* Contacts student */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Primary Email Address</label>
                                <input
                                  type="email"
                                  required
                                  value={editProfileData.email}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, email: e.target.value }))}
                                  className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Student Mobile Number</label>
                                <input
                                  type="tel"
                                  required
                                  pattern="[6-9][0-9]{9}"
                                  maxLength="10"
                                  value={editProfileData.phone}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setEditProfileData(prev => ({ ...prev, phone: val }));
                                  }}
                                  className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                            </div>

                            {/* Parents Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Parent / Guardian Name</label>
                                <input
                                  type="text"
                                  required
                                  value={editProfileData.parentName}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, parentName: e.target.value }))}
                                  className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Parent Phone number</label>
                                <input
                                  type="tel"
                                  required
                                  pattern="[6-9][0-9]{9}"
                                  maxLength="10"
                                  value={editProfileData.parentPhone}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setEditProfileData(prev => ({ ...prev, parentPhone: val }));
                                  }}
                                  className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                            </div>

                            {/* City & Area / Locality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">City</label>
                                <select
                                  value={editProfileData.city}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, city: e.target.value }))}
                                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-205 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="Meerut">Meerut</option>
                                  <option value="Allahabad">Allahabad</option>
                                  <option value="Other">Other</option>
                                </select>
                                {editProfileData.city === 'Other' && (
                                  <p className="text-[10px] text-amber-600 font-semibold mt-1 leading-relaxed text-left">
                                    ⚠️ Cograd operates in Meerut and Allahabad. We'll add you to our waitlist!
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Area / Locality</label>
                                <input
                                  type="text"
                                  maxLength={100}
                                  value={editProfileData.locality || ''}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, locality: e.target.value }))}
                                  placeholder="e.g. Civil Lines, Sadar"
                                  className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                            </div>

                            {/* Timing Slots, Medium & Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Instruction Medium</label>
                                <select
                                  value={editProfileData.medium}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, medium: e.target.value }))}
                                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="English & Hinglish">English & Hinglish</option>
                                  <option value="Pure English medium">Pure English medium</option>
                                  <option value="Pure Hindi medium">Pure Hindi medium</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Home Tuition Schedule Slot</label>
                                <select
                                  value={editProfileData.tuitionSlot}
                                  onChange={(e) => setEditProfileData(prev => ({ ...prev, tuitionSlot: e.target.value }))}
                                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="Morning (07:00 AM - 10:00 AM)">Morning (07:00 AM - 10:00 AM)</option>
                                  <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                                  <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1 text-left">Home Tuition Address</label>
                              <textarea
                                required
                                rows="3"
                                value={editProfileData.address}
                                onChange={(e) => setEditProfileData(prev => ({ ...prev, address: e.target.value }))}
                                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold resize-none"
                              />
                            </div>
                          </div>

                          {/* Form CTAs */}
                          <div className="flex items-center justify-end space-x-3.5 pt-4 border-t border-slate-50">
                            <button
                              type="button"
                              onClick={handleCancelProfileEdit}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 border-0"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 border-0"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </button>
                          </div>

                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}






              {/* 4. DETAILS modal for Recent Results score breakdown */}
              {selectedResult && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in">
                  <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-slide-up">
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-800 leading-snug">{selectedResult.title}</h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Attempted on {selectedResult.date}</p>
                      </div>
                    </div>

                    <div className="my-5 p-4 bg-slate-50 rounded-2xl grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Correct</span>
                        <span className="text-sm font-black text-blue-600">{selectedResult.analysis.correct} Answers</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Incorrect</span>
                        <span className="text-sm font-black text-red-500">{selectedResult.analysis.incorrect} Mistakes</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Time Taken</span>
                        <span className="text-sm font-black text-slate-700">{selectedResult.analysis.timeSpent}</span>
                      </div>
                    </div>

                    {/* Subject Topic breakdown */}
                    <div className="mb-5 space-y-2.5">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Topic-wise Breakdown</h4>
                      {selectedResult.analysis.topics.map((t, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50/50 rounded-xl">
                          <span className="font-semibold text-slate-600">{t.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-800">{t.score}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${t.strength === 'Strong' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                              {t.strength}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Feedback alert */}
                    <div className="bg-blue-50 border border-blue-100/30 rounded-2xl p-4 flex items-start space-x-3 mb-6">
                      <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-blue-900">Mentor Recommendations</h5>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">{selectedResult.analysis.feedback}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedResult(null)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl shadow-md cursor-pointer text-center block"
                    >
                      Close Performance Report
                    </button>
                  </div>
                </div>
              )}

              {/* Smart Video Player Modal */}
              {activeVideoLecture && (
                <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in">
                  <div className="bg-white rounded-3xl border border-slate-100 max-w-5xl w-full h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative animate-slide-up">

                    {/* Close button */}
                    <button
                      onClick={() => {
                        setActiveVideoLecture(null);
                        setVideoPlaying(false);
                      }}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer z-10 bg-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Left Side: Video Canvas & Controls */}
                    <div className="w-full md:w-3/5 bg-slate-950 p-6 flex flex-col justify-between h-1/2 md:h-full text-white">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-1 rounded-xl uppercase">
                          {activeVideoLecture.subject} • Smart Player
                        </span>
                        <span className="text-xs font-medium text-slate-400 mr-8">Instructor: {activeVideoLecture.teacher}</span>
                      </div>

                      {/* Animated Video Canvas */}
                      <div className="flex-grow flex flex-col items-center justify-center relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group">
                        <div className="text-center p-6 space-y-4">
                          {videoPlaying ? (
                            <div className="space-y-3">
                              <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto animate-ping">
                                <Play className="w-6 h-6 text-blue-500 fill-current" />
                              </div>
                              <div className="text-sm font-bold text-slate-300">Streaming: {activeVideoLecture.topic}</div>
                              <div className="text-xs text-slate-500 font-semibold flex items-center justify-center space-x-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span>Simulated Playback (Speed: {videoSpeed}x)</span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <button
                                type="button"
                                onClick={() => setVideoPlaying(true)}
                                className="w-16 h-16 bg-white text-slate-950 rounded-full flex items-center justify-center mx-auto hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                              >
                                <Play className="w-6 h-6 text-slate-950 fill-current ml-1" />
                              </button>
                              <div className="text-sm font-bold text-slate-300">Video Paused</div>
                              <p className="text-[10px] text-slate-500 font-semibold">Click to resume lecture</p>
                            </div>
                          )}
                        </div>

                        {/* Bookmark overlays along the scrub */}
                        <div className="absolute bottom-4 left-6 right-6 flex justify-between px-2 text-[9px] text-slate-400 bg-slate-950/80 p-1 rounded-md">
                          <span>02:15 - Carbonyl Hybridization</span>
                          <span>05:30 - Nucleophilic attack</span>
                          <span>08:45 - SN1 vs SN2 comparison</span>
                        </div>
                      </div>

                      {/* Player Controls */}
                      <div className="mt-4 space-y-3">
                        {/* Scrubber Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                            <span>{Math.floor(videoTime / 60)}:{(videoTime % 60).toString().padStart(2, '0')}</span>
                            <span>10:00</span>
                          </div>
                          <div
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const clickX = e.clientX - rect.left;
                              const width = rect.width;
                              const newTime = Math.floor((clickX / width) * 600);
                              setVideoTime(newTime);
                            }}
                            className="h-1.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden relative"
                          >
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(videoTime / 600) * 100}%` }}></div>
                          </div>
                        </div>

                        {/* Buttons Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setVideoPlaying(!videoPlaying)}
                              className="px-4 py-2 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              {videoPlaying ? 'Pause' : 'Play'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setVideoTime(0)}
                              className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Restart Video"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Playback speed selector */}
                          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                            {[1.0, 1.25, 1.5, 2.0].map((speed) => (
                              <button
                                key={speed}
                                type="button"
                                onClick={() => {
                                  setVideoSpeed(speed);
                                  triggerToast(`Playback speed set to ${speed}x`);
                                }}
                                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${videoSpeed === speed
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                  }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Notes and Transcript */}
                    <div className="w-full md:w-2/5 bg-slate-50 p-6 flex flex-col justify-between h-1/2 md:h-full border-t md:border-t-0 md:border-l border-slate-200">

                      {/* Transcript Section */}
                      <div className="flex-grow flex flex-col min-h-0">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">Live Interactive Transcript</h4>

                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex-grow overflow-y-auto mb-4 text-xs font-semibold text-slate-600 leading-relaxed shadow-inner max-h-[160px] md:max-h-none">
                          <p className={videoTime >= 0 && videoTime < 30 ? 'text-blue-600 font-extrabold border-l-2 border-blue-500 pl-2 bg-blue-50/50' : 'opacity-50'}>
                            [00:00 - 00:30] Welcome back to Cograd Pathshala. In this recorded session, we will break down the crucial reactions of carbonyl compounds for JEE Mains & Advanced.
                          </p>
                          <p className={videoTime >= 30 && videoTime < 90 ? 'text-blue-600 font-extrabold border-l-2 border-blue-500 pl-2 bg-blue-50/50 mt-3.5' : 'opacity-50 mt-3.5'}>
                            [00:30 - 01:30] Let's look at the electrostatic properties of the carbonyl group. The carbon-oxygen double bond is highly polarized due to the high electronegativity of oxygen.
                          </p>
                          <p className={videoTime >= 90 && videoTime < 180 ? 'text-blue-600 font-extrabold border-l-2 border-blue-500 pl-2 bg-blue-50/50 mt-3.5' : 'opacity-50 mt-3.5'}>
                            [01:30 - 03:00] Due to polarization, the carbonyl carbon behaves as a strong electrophile, inviting nucleophilic addition reactions from carbon-based or nitrogen-based nucleophiles.
                          </p>
                          <p className={videoTime >= 180 && videoTime < 300 ? 'text-blue-600 font-extrabold border-l-2 border-blue-500 pl-2 bg-blue-50/50 mt-3.5' : 'opacity-50 mt-3.5'}>
                            [03:00 - 05:00] Now we will examine the mechanism of SN1 vs SN2 substitutions in adjacent halogenated side-chains. Remember that SN2 involves a transition state, while SN1 forms a carbocation.
                          </p>
                          <p className={videoTime >= 300 ? 'text-blue-600 font-extrabold border-l-2 border-blue-500 pl-2 bg-blue-50/50 mt-3.5' : 'opacity-50 mt-3.5'}>
                            [05:00+] Finally, let's look at Bohr's atomic radius derivations. We calculate radius by equating centripetal electrostatic attraction and angular momentum quantization.
                          </p>
                        </div>

                        {/* Notes Input Section */}
                        <form onSubmit={handleSaveVideoNote} className="space-y-2 mb-4">
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase block">Take Timestamped Notes</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={videoNotes}
                              onChange={(e) => setVideoNotes(e.target.value)}
                              placeholder="Add study note at this video timestamp..."
                              className="w-full text-xs pl-3 pr-16 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 font-semibold"
                            />
                            <button
                              type="submit"
                              disabled={!videoNotes.trim()}
                              className="absolute right-1.5 top-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer"
                            >
                              Save Tag
                            </button>
                          </div>
                        </form>

                        {/* Saved notes container */}
                        <div className="flex-grow overflow-y-auto max-h-[140px] border-t border-slate-200 pt-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Saved Notes for this video</span>
                          <div className="space-y-2">
                            {savedVideoNotes.map((n, idx) => (
                              <div key={idx} className="p-2.5 bg-white border border-slate-150 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-start space-x-2">
                                <span className="text-[9px] bg-blue-50 text-blue-700 font-black px-1.5 py-0.5 rounded shrink-0">{n.timestamp}</span>
                                <p className="leading-tight">{n.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* Parent Assigned Test Simulator Modal */}
              {showParentTestModal && (
                <div className="modal-overlay">
                  <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-slide-up max-h-[90vh] flex flex-col justify-between">
                    <button
                      onClick={() => setShowParentTestModal(false)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="mb-4">
                      <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 font-extrabold uppercase px-2.5 py-1 rounded-full">
                        Parent Homework Assessment
                      </span>
                      <h3 className="text-lg font-black text-slate-800 mt-2">
                        Taking: {JSON.parse(localStorage.getItem(`cograd_assigned_tests_${profileData.studentId}`))?.topic || 'Assigned Test'}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold">
                        Complete this test to show your understanding to your parents!
                      </p>
                    </div>

                    {!parentTestSubmitted ? (
                      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                        {/* Question 1 */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mb-1">Question 1</span>
                          <p className="text-xs font-bold text-slate-800 mb-3">What is lim (x → 0) of (sin x) / x?</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['0', '1', 'Does not exist', '-1'].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setParentTestAnswers(prev => ({ ...prev, q1: option }))}
                                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${parentTestAnswers.q1 === option
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question 2 */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mb-1">Question 2</span>
                          <p className="text-xs font-bold text-slate-800 mb-3">Evaluate lim (x → ∞) of (1 + 1/x)^x.</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['0', '1', 'e', '∞'].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setParentTestAnswers(prev => ({ ...prev, q2: option }))}
                                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${parentTestAnswers.q2 === option
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question 3 */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mb-1">Question 3</span>
                          <p className="text-xs font-bold text-slate-800 mb-3">Find lim (x → 2) of (x^2 - 4) / (x - 2).</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['0', '2', '4', 'Does not exist'].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setParentTestAnswers(prev => ({ ...prev, q3: option }))}
                                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${parentTestAnswers.q3 === option
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!parentTestAnswers.q1 || !parentTestAnswers.q2 || !parentTestAnswers.q3) {
                              alert('Please answer all questions before submitting.');
                              return;
                            }
                            let score = 0;
                            if (parentTestAnswers.q1 === '1') score++;
                            if (parentTestAnswers.q2 === 'e') score++;
                            if (parentTestAnswers.q3 === '4') score++;

                            setParentTestScore(score);
                            setParentTestSubmitted(true);

                            // Save result in localStorage and sync with database
                            const resultScore = `${score}/3`;
                            localStorage.setItem(`cograd_assigned_tests_result_${profileData.studentId}`, resultScore);
                            api.put(`/students/${profileData.studentId}`, {
                              parent_assigned_test_result: resultScore,
                              xp: studentXp + 100
                            }).then(() => {
                              setProfileData(prev => ({
                                ...prev,
                                parent_assigned_test_result: resultScore
                              }));
                              setStudentXp(prev => prev + 100);
                              triggerToast(`Test completed! Score: ${resultScore}. +100 XP`);
                            }).catch(err => {
                              console.error('Failed to save test result:', err);
                              triggerToast('Failed to save test result to database.');
                            });
                          }}
                          className="w-full btn-primary py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          Submit Answers
                        </button>
                      </div>
                    ) : (
                      <div className="empty-state font-sans">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-100 shadow-inner">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-800">Test Completed Successfully!</h4>
                          <p className="text-xs text-slate-400 font-semibold mt-1">
                            Your answers were submitted. Your parents can now see your score report in real-time.
                          </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-xs mx-auto">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Your Score</span>
                          <span className="text-3xl font-black text-slate-800">{parentTestScore} / 3</span>
                          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Excellent Effort!</span>
                        </div>
                        <button
                          onClick={() => setShowParentTestModal(false)}
                          className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-bold cursor-pointer"
                        >
                          Close Modal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Help & Support' && (
                <div className="space-y-6 text-left">
                  <div className="bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/10 p-6 rounded-3xl border border-[#10B981]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-slate-800 tracking-tight">Help & Support Desk</h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Submit query directly to CoGrad Admin Team</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                      <h3 className="text-base font-black text-slate-800 tracking-tight">Create Support Ticket</h3>
                      <form onSubmit={handleSupportSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                          <select
                            required
                            value={supportForm.category}
                            onChange={(e) => setSupportForm(p => ({ ...p, category: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                          >
                            <option value="General Support">General Support</option>
                            <option value="Technical Issue">Technical Issue</option>
                            <option value="Academic Enquiry">Academic Enquiry</option>
                            <option value="Billing & Fee">Billing & Fee</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Subject</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. Book download error"
                            value={supportForm.title}
                            onChange={(e) => setSupportForm(p => ({ ...p, title: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                          <textarea
                            required
                            rows="4"
                            placeholder="Please describe your query in detail..."
                            value={supportForm.description}
                            onChange={(e) => setSupportForm(p => ({ ...p, description: e.target.value }))}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700 font-semibold"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={supportSubmitting}
                          className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          {supportSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                      <h3 className="text-base font-black text-slate-800 tracking-tight">CoGrad Admin Support</h3>
                      <div className="space-y-4 text-xs font-semibold text-slate-600">
                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-extrabold text-slate-800">+91-9876500000</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Mon–Sat, 10am – 6pm IST</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-extrabold text-slate-800">admin@cograd.com</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Reply within 24 hours</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-extrabold text-slate-800">CoGrad Admin Support Desk</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Direct Administration Team</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>{/* end tab-content-enter */}
      </DashboardShell>

      {/* Floating AI Chatbot Button & Overlay Drawer */}
      <div className="fixed bottom-8 right-8 sm:bottom-12 sm:right-12 md:bottom-16 md:right-16 z-[9999] flex flex-col items-end">
        {/* Chatbot Overlay Card */}
        {showAiChatbot && (
          <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[580px] bg-white border border-slate-150 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up text-slate-800 no-glass">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-750 text-white p-4.5 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner relative border border-white/15">
                  <Bot className="w-5.5 h-5.5 text-white animate-pulse" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="text-xs font-black leading-none">
                    {doubtMode === 'ai' ? 'CoGrad AI Tutor' : 'Direct Tutor Connect'}
                  </h3>
                  <p className="text-[9px] text-blue-150 font-bold mt-1">
                    {doubtMode === 'ai' ? '24/7 AI Doubt Solver' : 'Direct Teacher Doubt Desk'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiChatbot(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-50 p-1.5 border-b border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setDoubtMode('ai')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${doubtMode === 'ai'
                    ? 'bg-white text-blue-900 shadow-sm border border-slate-200/30'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>24/7 AI Tutor</span>
              </button>
              <button
                type="button"
                onClick={() => setDoubtMode('teacher')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${doubtMode === 'teacher'
                    ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/30'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                <MessageSquare className="w-3 h-3 text-indigo-500" />
                <span>Ask Tutors</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow flex flex-col min-h-0 bg-slate-50/20">
              {doubtMode === 'ai' ? (
                <>
                  {/* Main Scrollable Chat Logs Area */}
                  <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-0">
                    {/* OCR scan overlay inside chat log container */}
                    {isScanning && (
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl text-center relative overflow-hidden transition-all shadow-sm animate-pulse">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600 shadow-md shadow-emerald-500 animate-bounce"></div>
                        <UploadCloud className="w-6 h-6 text-blue-500 mx-auto animate-pulse" />
                        <span className="text-[10px] font-black text-blue-800 block mt-1">AI OCR scanning notebook page... {scannerProgress}%</span>
                      </div>
                    )}

                    {/* Beta notice banner as an introductory bubble */}
                    <div className="bg-emerald-50/75 border border-emerald-200/30 rounded-2xl p-3 text-left text-[9px] text-emerald-800 font-semibold flex gap-2 shadow-sm shrink-0">
                      <span className="text-[10px]">✨</span>
                      <span><strong>AI Solver Connected:</strong> Responses are generated in real-time by the Google DiffusionGemma model via NVIDIA NIM API!</span>
                    </div>

                    {aiHistory.length === 0 && (
                      <div className="empty-state">
                        <Sparkles className="w-8 h-8 mx-auto text-blue-300 animate-pulse" />
                        <p className="text-[10px] font-bold">Ask a question to start the session.</p>
                      </div>
                    )}

                    {isAiLoading && (
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-2.5 animate-pulse">
                        <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                        <span className="text-[10px] font-bold text-slate-500">AI Tutor is drafting steps...</span>
                      </div>
                    )}

                    {aiHistory.map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 bg-white rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-4.5 h-4.5 bg-blue-100 text-blue-800 rounded-md text-[9px] font-black flex items-center justify-center shadow-inner">Q</span>
                            <h4 className="text-[10px] font-extrabold text-slate-800">{item.question}</h4>
                          </div>
                          <span className="text-[8px] text-slate-400 font-bold">{item.timestamp}</span>
                        </div>
                        <p className="pl-6 text-[10px] text-slate-600 leading-normal font-semibold whitespace-pre-line border-l-2 border-blue-500/20">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Teacher mode just scrolls everything */
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  <div className="space-y-3.5">
                    {/* Teacher selector */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Select Teacher</span>
                      <div className="grid grid-cols-3 gap-2">
                        {!profileData.assigned_teacher_id || !matchedTeacherData ? (
                          <div className="col-span-3 text-[10px] text-slate-500 font-semibold text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                            No matched tutor yet.
                          </div>
                        ) : (
                          [
                            {
                              name: matchedTeacherData.name,
                              subject: matchedTeacherData.primarySubject || 'Tutor',
                              status: 'Online'
                            }
                          ].map((t) => {

                            return (
                              <button
                                key={t.name}
                                type="button"
                                onClick={() => setSelectedTeacherForDoubt(t.name)}
                                className={`col-span-3 p-2 rounded-xl border text-center transition-all cursor-pointer truncate border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/10 shadow-sm text-indigo-800 font-black`}
                              >
                                <div className="text-[9px] truncate leading-none">{t.name}</div>
                                <div className="text-[7px] text-slate-400 font-bold mt-1">{t.subject}</div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Submission form */}
                    <form onSubmit={handleTeacherDoubtSubmit} className="space-y-2">
                      <textarea
                        value={teacherDoubtText}
                        disabled={isOffline}
                        onChange={(e) => setTeacherDoubtText(e.target.value)}
                        placeholder="Ask teacher a question..."
                        rows="3"
                        className="w-full text-[10px] p-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none disabled:opacity-50"
                      />
                      <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-slate-150">
                        <div>
                          {isUploadingDoubtFile ? (
                            <span className="text-[8px] font-bold text-indigo-600 animate-pulse">Uploading {uploadDoubtProgress}%</span>
                          ) : teacherDoubtAttachment ? (
                            <div className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg text-[8px] font-bold">
                              <span className="truncate max-w-[80px]">{teacherDoubtAttachment}</span>
                              <button type="button" onClick={() => setTeacherDoubtAttachment(null)} className="text-indigo-400 hover:text-indigo-600"><X className="w-2 h-2" /></button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={isOffline}
                              onClick={simulateTeacherDoubtUpload}
                              className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-[8px] font-bold transition-all cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Attach Homework Scan</span>
                            </button>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={isOffline || !teacherDoubtText.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-[9px] transition-all cursor-pointer disabled:opacity-40"
                        >
                          Send
                        </button>
                      </div>
                    </form>

                    {/* Teacher doubts list */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Doubts History</span>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-0.5">
                        {teacherDoubts.map((doubt) => {
                          const isExpanded = expandedTeacherDoubtId === doubt.id;
                          return (
                            <div key={doubt.id} className="border border-slate-100 bg-white rounded-2xl overflow-hidden hover:border-slate-200 transition-colors">
                              <div
                                onClick={() => setExpandedTeacherDoubtId(isExpanded ? null : doubt.id)}
                                className="p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50/50"
                              >
                                <div className="min-w-0">
                                  <div className="text-[10px] font-black text-slate-800 flex items-center space-x-1.5">
                                    <span>{doubt.teacher}</span>
                                    <span className="text-[7px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">{doubt.subject}</span>
                                  </div>
                                  <div className="text-[8px] text-slate-500 truncate max-w-[150px] mt-0.5">{doubt.question}</div>
                                </div>
                                <div className="flex items-center space-x-1 shrink-0">
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${doubt.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{doubt.status}</span>
                                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                </div>
                              </div>
                              {isExpanded && (
                                <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-50 bg-slate-50/20 text-[9px] text-slate-655 space-y-2">
                                  <p className="font-semibold text-slate-700">{doubt.question}</p>
                                  {doubt.status === 'Resolved' ? (
                                    <div className="bg-indigo-50/40 border border-indigo-100/30 rounded-xl p-2 text-slate-700 leading-normal">
                                      <p className="whitespace-pre-line">{doubt.answer}</p>
                                    </div>
                                  ) : (
                                    <p className="italic text-slate-450 font-semibold">Teacher is reviewing. Expected soon...</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form at Footer (for AI Mode) */}
            {doubtMode === 'ai' && (
              <div className="flex flex-col bg-white border-t border-slate-150 shrink-0">
                {/* Horizontal Scroll Suggestions */}
                <div className="flex items-center space-x-2 px-3 py-1.5 border-b border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
                  {['Explain SN1 vs SN2 kinetics', 'Derive definite integration formula', 'Explain Lenz\'s Law induction basis', 'Bohr hydrogen energy level'].map(pill => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setAiQuestion(pill)}
                      className="text-[9px] whitespace-nowrap bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-700 px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0"
                    >
                      {pill}
                    </button>
                  ))}
                </div>

                {/* Form Input */}
                <form onSubmit={handleAiSubmit} className="relative flex items-center p-3">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask CoGrad AI..."
                    className="w-full text-[10px] pl-3 pr-24 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-500 font-semibold"
                  />
                  <div className="absolute right-4.5 flex items-center space-x-1">
                    {/* Camera Scan Button */}
                    {isScanning ? (
                      <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin block"></span>
                    ) : (
                      <button
                        type="button"
                        onClick={triggerImageScan}
                        title="Scan handwriting or notebook page"
                        className="p-1.5 rounded-lg border border-slate-100 bg-white text-slate-450 hover:text-slate-600 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Mic Button */}
                    <button
                      type="button"
                      onClick={simulateVoiceInput}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${simulatedVoiceState === 'listening'
                          ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'
                          : 'bg-white border-slate-100 text-slate-450 hover:text-slate-600'
                        }`}
                      title="Simulate Speech"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={isAiLoading || !aiQuestion.trim()}
                      className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer disabled:opacity-40"
                    >
                      {isAiLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Chatbot Toggle Button */}
        <button
          type="button"
          onClick={() => {
            setShowAiChatbot(!showAiChatbot);
            if (!showAiChatbot) triggerToast("Opening AI Doubt solver chatbot!");
          }}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-750 hover:from-blue-750 hover:to-indigo-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group ${showAiChatbot ? 'rotate-90' : ''
            }`}
          title="Ask AI Doubt Solver"
        >
          {showAiChatbot ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6 animate-pulse" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black text-white">
                1
              </span>
              <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white font-bold text-[9px] px-2 py-1 rounded shadow whitespace-nowrap">
                Ask AI Solver!
              </span>
            </>
          )}
        </button>
      </div>

      {/* Diagnostic Questions Modal */}
      {showQuestionsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl animate-scale-up flex flex-col text-left overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-black text-slate-800">Diagnostic Test Analysis</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Review test questions and correct answers for {profileData.standard}</p>
              </div>
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 flex-grow overflow-y-auto">
              {getDiagnosticQuestions(profileData.standard).map((q, idx) => {
                const selectedAnswer = profileData.test_score?.answers?.[q.id];
                const hasSelected = selectedAnswer !== undefined;

                return (
                  <div key={q.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        q.subject === 'Mathematics' 
                          ? 'bg-blue-50 text-blue-700 border-blue-150' 
                          : 'bg-indigo-50 text-indigo-700 border-indigo-150'
                      }`}>
                        {q.subject}
                      </span>
                      <span className="text-[9px] text-slate-400 font-extrabold">{q.marks} Marks</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-700 leading-relaxed">
                      Q{idx + 1}. {q.text}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => {
                        const isCorrect = opt === q.correct;
                        const isSelected = opt === selectedAnswer;

                        let cardStyle = 'bg-white text-slate-600 border-slate-150';
                        let icon = null;

                        if (isSelected) {
                          if (isCorrect) {
                            cardStyle = 'bg-emerald-50 text-emerald-700 border-emerald-250 ring-1 ring-emerald-200';
                            icon = (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black shrink-0">
                                ✓
                              </span>
                            );
                          } else {
                            cardStyle = 'bg-rose-50 text-rose-700 border-rose-250 ring-1 ring-rose-200';
                            icon = (
                              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-black shrink-0">
                                ✗
                              </span>
                            );
                          }
                        } else if (isCorrect) {
                          cardStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                          icon = (
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-[9px] font-black shrink-0">
                              ✓
                            </span>
                          );
                        }

                        return (
                          <div
                            key={opt}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-between transition-all ${cardStyle}`}
                          >
                            <span>{opt}</span>
                            {icon}
                          </div>
                        );
                      })}
                    </div>
                    {hasSelected && (
                      <div className="text-[9px] font-bold mt-1.5 flex items-center gap-1">
                        <span className="text-slate-400">Your Answer:</span>
                        <span className={selectedAnswer === q.correct ? 'text-emerald-600' : 'text-rose-600'}>
                          {selectedAnswer} {selectedAnswer === q.correct ? '(Correct)' : '(Incorrect)'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl text-right">
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDashboard;

