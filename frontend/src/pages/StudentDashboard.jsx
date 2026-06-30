import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { api } from '../utils/api';
import { syncWithBackend, getAssignments, getTeachers, getStudents } from '../utils/mockDb';
import {
  LayoutDashboard,
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
  Paperclip,
  Users,
  CheckSquare,
  WifiOff,
  Wifi,
  Plus,
  RotateCcw,
  Zap,
  ChevronRight,
  Star,
  Search,
  Trophy,
  HelpCircle,
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedProgressSubject, setSelectedProgressSubject] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAiChatbot, setShowAiChatbot] = useState(false);

  // Dynamic Student Profile data state
  const [profileData, setProfileData] = useState({
    name: 'Loading...',
    email: '',
    phone: '',
    standard: 'Loading...',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    studentId: 'CP-2026-STU88',
    parentName: 'Mr. Alok Sharma',
    parentPhone: '9876500999',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    medium: 'English & Hinglish',
    joinDate: '12 April 2026',
    tuitionSlot: 'Evening (04:00 PM - 07:00 PM)',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    address: 'House No. 42, Sector 4, Shastri Nagar, Meerut',
    streak: 0,
    rank: 'N/A',
    attendance: 'N/A',
    pendingHW: '0',
    testsThisWeek: '0',
    test_score: null,
    test_completed_at: null,
    assigned_teacher_id: null,
  });

  // Notification states
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      const saved = localStorage.getItem(`cograd_student_notifications_${profileData.studentId}`);
      setUnreadNotifications(saved ? JSON.parse(saved) : []);
    }
  }, [profileData.studentId]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      localStorage.setItem(`cograd_student_notifications_${profileData.studentId}`, JSON.stringify(unreadNotifications));
    }
  }, [unreadNotifications, profileData.studentId]);


  // Up Next live class timer state: set class start time 14 minutes and 32 seconds from now
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 32);
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load real user data from backend
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!localStorage.getItem('cograd_token')) return;
        const user = await api.get('/auth/me');
        if (user) {
          // Compute pending homework and tests dynamically
          let liveAssignmentsPending = 0;
          let liveTestsThisWeek = 0;
          if (user.assigned_teacher_id) {
            const teacherAsgsRaw = localStorage.getItem(`cograd_teacher_assignments_${user.assigned_teacher_id}`);
            const teacherSubsRaw = localStorage.getItem(`cograd_teacher_submissions_${user.assigned_teacher_id}`);
            const teacherTestsRaw = localStorage.getItem(`cograd_teacher_tests_${user.assigned_teacher_id}`);
            
            let teacherAsgs = [];
            let teacherSubs = [];
            let teacherTests = [];
            try { if (teacherAsgsRaw) teacherAsgs = JSON.parse(teacherAsgsRaw); } catch(e) {}
            try { if (teacherSubsRaw) teacherSubs = JSON.parse(teacherSubsRaw); } catch(e) {}
            try { if (teacherTestsRaw) teacherTests = JSON.parse(teacherTestsRaw); } catch(e) {}
            
            teacherAsgs.forEach(asg => {
              const matchedSub = teacherSubs.find(sub => sub.assignmentName === asg.name && sub.studentName === user.name);
              if (!matchedSub) {
                liveAssignmentsPending += 1;
              }
            });
            liveTestsThisWeek = teacherTests.length;
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
            streak: 0,
            rank: 'N/A',
            attendance: 'N/A',
            pendingHW: liveAssignmentsPending.toString(),
            testsThisWeek: liveTestsThisWeek.toString(),
          }));
        }
        await syncWithBackend();
      } catch (err) {
        console.error('Failed to load student data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m : ${s.toString().padStart(2, '0')}s`;
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
    if (!profileData.studentId || profileData.studentId === 'Loading...') return;
    const cacheKey = `cograd_student_syllabus_${profileData.studentId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setSyllabusChapters(JSON.parse(cached));
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
      const subjectsList = profileData.subjects || ['Mathematics', 'Science'];
      subjectsList.forEach(sub => {
        const chapters = defaultChapters[sub] || ['Chapter 1: Intro', 'Chapter 2: Core', 'Chapter 3: Application', 'Chapter 4: Revision'];
        chapters.forEach((ch, idx) => {
          generated.push({
            id: `${sub.toLowerCase().substring(0, 2)}_${idx + 1}`,
            subject: sub,
            name: ch,
            status: idx < 2 ? 'Completed' : idx === 2 ? 'In Progress' : 'Not Started'
          });
        });
      });
      setSyllabusChapters(generated);
      localStorage.setItem(cacheKey, JSON.stringify(generated));
    }
  }, [profileData.subjects, profileData.studentId]);

  // AI Doubt Solver persona and uploader states
  const [tutorPersona, setTutorPersona] = useState('chemistry'); // chemistry, mathematics, physics
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

  // Ask AI Doubt Solver state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiHistory, setAiHistory] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      const saved = localStorage.getItem(`cograd_student_ai_history_${profileData.studentId}`);
      setAiHistory(saved ? JSON.parse(saved) : []);
    }
  }, [profileData.studentId]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      localStorage.setItem(`cograd_student_ai_history_${profileData.studentId}`, JSON.stringify(aiHistory));
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
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      const saved = localStorage.getItem(`cograd_student_teacher_doubts_${profileData.studentId}`);
      setTeacherDoubts(saved ? JSON.parse(saved) : []);
    }
  }, [profileData.studentId]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      localStorage.setItem(`cograd_student_teacher_doubts_${profileData.studentId}`, JSON.stringify(teacherDoubts));
    }
  }, [teacherDoubts, profileData.studentId]);

  // --- PREMIUM DASHBOARD FEATURES STATE ---

  // 1. Offline Mode State
  const [isOffline, setIsOffline] = useState(false);

  const [studyHours, setStudyHours] = useState(0);
  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      const saved = localStorage.getItem(`cograd_student_study_hours_${profileData.studentId}`);
      if (saved) {
        setStudyHours(parseInt(saved, 10));
      } else {
        localStorage.setItem(`cograd_student_study_hours_${profileData.studentId}`, '0');
      }
    }
  }, [profileData.studentId]);



  // Parent Assigned Test states
  const [showParentTestModal, setShowParentTestModal] = useState(false);
  const [parentTestAnswers, setParentTestAnswers] = useState({});
  const [parentTestSubmitted, setParentTestSubmitted] = useState(false);
  const [parentTestScore, setParentTestScore] = useState(0);

  // 3. Study Planner & Goal Setting State
  const [userGoals, setUserGoals] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      const saved = localStorage.getItem(`cograd_student_user_goals_${profileData.studentId}`);
      setUserGoals(saved ? JSON.parse(saved) : []);
    }
  }, [profileData.studentId]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      localStorage.setItem(`cograd_student_user_goals_${profileData.studentId}`, JSON.stringify(userGoals));
    }
  }, [userGoals, profileData.studentId]);

  const [newGoalText, setNewGoalText] = useState('');

  // 4. Smart Video Player State
  const [activeVideoLecture, setActiveVideoLecture] = useState(null);
  const [videoSpeed, setVideoSpeed] = useState(1.0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0); // in seconds
  const [videoNotes, setVideoNotes] = useState('');
  const [savedVideoNotes, setSavedVideoNotes] = useState([]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      const saved = localStorage.getItem(`cograd_student_video_notes_${profileData.studentId}`);
      setSavedVideoNotes(saved ? JSON.parse(saved) : []);
    }
  }, [profileData.studentId]);

  useEffect(() => {
    if (profileData.studentId && profileData.studentId !== 'Loading...') {
      localStorage.setItem(`cograd_student_video_notes_${profileData.studentId}`, JSON.stringify(savedVideoNotes));
    }
  }, [savedVideoNotes, profileData.studentId]);

  // 5. Peer Learning & Study Groups State
  const [studyGroups, setStudyGroups] = useState([]);

  useEffect(() => {
    if (!profileData.studentId || profileData.studentId === 'Loading...') return;
    const cacheKey = `cograd_student_study_groups_${profileData.studentId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setStudyGroups(JSON.parse(cached));
    } else {
      const generated = (profileData.subjects || ['Mathematics', 'Science']).map((sub, idx) => ({
        id: `g${idx + 1}`,
        name: `${sub} Study Group`,
        subject: sub,
        activePeers: Math.floor(Math.random() * 10) + 5,
        description: `Collaborative study group for ${sub} discussion and doubt resolution.`
      }));
      setStudyGroups(generated);
      localStorage.setItem(cacheKey, JSON.stringify(generated));
    }
  }, [profileData.subjects, profileData.studentId]);
  const [activeGroupId, setActiveGroupId] = useState('g1');
  const [groupChats, setGroupChats] = useState({
    g1: [
      { id: 1, sender: 'Aryan', text: "Hey guys, did you check Rajesh sir's newly uploaded organic notes?", time: '12:30 PM' },
      { id: 2, sender: 'Divya', text: 'Yes! The Carbonyl reactions roadmap is extremely helpful.', time: '12:32 PM' },
      { id: 3, sender: 'You', text: 'I am starting the worksheet questions now.', time: '12:35 PM' }
    ],
    g2: [
      { id: 1, sender: 'Kunal', text: 'How do we solve integration of sec^3(x)? It seems tricky.', time: '11:00 AM' },
      { id: 2, sender: 'Preeti', text: "Priya ma'am resolved it yesterday! Check history, she used integration by parts.", time: '11:05 AM' }
    ],
    g3: [
      { id: 1, sender: 'Rohan', text: 'Who has solved chapter 15 Rotational Dynamics question 28?', time: 'Yesterday' },
      { id: 2, sender: 'Simran', text: 'I have. The trick is to conserve angular momentum about the hinge point.', time: 'Yesterday' }
    ]
  });
  const [newGroupMessage, setNewGroupMessage] = useState('');

  // 6. Smart Notes & Flashcards State
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

  // 7. Achievements & Portfolio Tracker State
  const [earnedCertificates] = useState([
    { id: 1, title: 'JEE Prep Consistency Master', date: 'June 01, 2026', type: 'Streak Master', unlockedAt: '10 Day Streak' },
    { id: 2, title: 'Chemistry Mock Test Gold Badge', date: 'June 10, 2026', type: 'Mock Champion', unlockedAt: 'Score > 85%' }
  ]);
  const [studentXp, setStudentXp] = useState(4850);
  const [unlockedRewards, setUnlockedRewards] = useState(['r1']); // rewardIds
  const rewardsList = [
    { id: 'r1', name: 'Virtual Student Hub Access', cost: 1000, desc: 'Unlocks advanced peer groups chats' },
    { id: 'r2', name: '1-on-1 Personal Mentor Call', cost: 3000, desc: '30-minute private advice slot with Mr. Rajesh Kumar' },
    { id: 'r3', name: 'Advanced JEE Practice Set PDF', cost: 1500, desc: 'Exclusively curated physical chem questions' }
  ];
  const [downloadingCertId, setDownloadingCertId] = useState(null);
  const [certDownloadProgress, setCertDownloadProgress] = useState(0);

  // --- END PREMIUM FEATURES STATE ---


  const handleAiSubmit = (e) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);
    const questionText = aiQuestion;
    setAiQuestion('');

    setTimeout(() => {
      let resolvedAnswer = '';
      if (questionText.toLowerCase().includes('sn1') || questionText.toLowerCase().includes('sn2')) {
        resolvedAnswer = `**SN1 vs SN2 Mechanisms:**\n\n- **SN1 (Substitution Nucleophilic Unimolecular):** Renders a 2-step process with a carbocation intermediate. Rate depends only on substrate concentration: Rate = k[R-X]. Favored by polar protic solvents and tertiary substrates.\n- **SN2 (Substitution Nucleophilic Bimolecular):** Renders a 1-step concerted process with transition state and inversion of configuration (Walden Inversion). Rate depends on both: Rate = k[R-X][Nu⁻]. Favored by polar aprotic solvents and primary substrates.`;
      } else if (questionText.toLowerCase().includes('bohr') || questionText.toLowerCase().includes('orbit')) {
        resolvedAnswer = `**Bohr's Orbit Radius Derivation:**\n\nFor a hydrogenic atom, the electrostatic force balances the centripetal force:\n$$\\frac{m v^2}{r} = \\frac{Z e^2}{4 \\pi \\epsilon_0 r^2}$$\n\nApplying Bohr's quantization condition ($mvr = nh/2\\pi$), we solve for $r_n$:\n$$r_n = \\frac{\\epsilon_0 n^2 h^2}{\\pi m Z e^2} = 0.529 \\frac{n^2}{Z} \\text{ Å}$$\n\nThis shows the radius is directly proportional to the square of the principal quantum number ($n^2$).`;
      } else if (questionText.toLowerCase().includes('avogadro')) {
        resolvedAnswer = `**Avogadro's Hypothesis:**\n\n"Equal volumes of all gases, at the same temperature and pressure, contain the same number of molecules."\n\n- **Formula:** $V \\propto n$ (where $n$ is the number of moles).\n- **At STP:** 1 mole of any ideal gas occupies exactly $22.4 \\text{ Liters}$ and contains $6.022 \\times 10^{23}$ particles.`;
      } else {
        resolvedAnswer = `**AI Resolution for:** "${questionText}"\n\nBased on your JEE Prep syllabus, here is the analytical breakdown:\n1. **Core Concept:** This question falls under physical chemistry / general principles.\n2. **Detailed Steps:** Follow the conservation laws. Apply standard molecular kinetics equations where pressure is held constant.\n3. **Exam Tip:** Keep track of units (e.g. converting liters to $m^3$ or Kelvin temperatures).`;
      }

      setAiHistory((prev) => [
        { question: questionText, answer: resolvedAnswer, timestamp: 'Just Now' },
        ...prev
      ]);
      setIsAiLoading(false);
      triggerToast('AI Doubt Solver completed resolution!');
    }, 1500);
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
          const parsedQuestion = tutorPersona === 'chemistry'
            ? "Explain SN1 vs SN2 reaction kinetics in detail"
            : tutorPersona === 'mathematics'
              ? "Derive the radius formula for Bohr's orbit"
              : "Explain Lenz's Law of Electromagnetic Induction";
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

  const handleTeacherDoubtSubmit = (e) => {
    e.preventDefault();
    if (!teacherDoubtText.trim()) return;

    const teacherObj = [
      { name: 'Mr. Rajesh Kumar', subject: 'Chemistry', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
      { name: 'Dr. Priya Sharma', subject: 'Mathematics', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
      { name: 'Dr. Sarah Johnson', subject: 'Physics', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80' }
    ].find(t => t.name === selectedTeacherForDoubt) || { name: selectedTeacherForDoubt, subject: 'General' };

    const doubtText = teacherDoubtText.trim();
    setTeacherDoubtText('');
    setTeacherDoubtAttachment(null);

    const message = `Hello ${teacherObj.name}, I have a doubt in ${teacherObj.subject}:\n\n${doubtText}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
    triggerToast(`Redirecting to WhatsApp to send doubt to ${teacherObj.name}...`);
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

  // 3. Goal Planner
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal = {
      id: Date.now(),
      text: newGoalText.trim(),
      completed: false
    };
    setUserGoals(prev => [...prev, newGoal]);
    setNewGoalText('');
    triggerToast('Goal added to your daily planner!');
    setStudentXp(prev => prev + 20); // award 20 XP
  };

  const handleToggleGoal = (id) => {
    setUserGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) {
          triggerToast('Goal completed! +50 XP earned.');
          setStudentXp(xp => xp + 50); // award 50 XP
        }
        return { ...g, completed: nextState };
      }
      return g;
    }));
  };

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

  // 5. Peer Chat
  const handleSendGroupMessage = (e) => {
    e.preventDefault();
    if (!newGroupMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: newGroupMessage.trim(),
      time: 'Just now'
    };

    setGroupChats(prev => ({
      ...prev,
      [activeGroupId]: [...(prev[activeGroupId] || []), newMessage]
    }));
    setNewGroupMessage('');

    // Simulated automated peer reply after 3 seconds
    setTimeout(() => {
      const automatedReplies = {
        g1: { sender: 'Aryan', text: "Nice! Let's schedule a study session for that organic chemistry worksheet soon." },
        g2: { sender: 'Kunal', text: "Thanks! That parts formula makes perfect sense now. I am working on the practice problems next." },
        g3: { sender: 'Rohan', text: "Got it! Angular momentum conservation makes rotational dynamics much cleaner." }
      };
      const reply = automatedReplies[activeGroupId] || { sender: 'Aryan', text: 'Glad we are studying together!' };
      const botMsg = {
        id: Date.now() + 1,
        sender: reply.sender,
        text: reply.text,
        time: 'Just now'
      };
      setGroupChats(prev => ({
        ...prev,
        [activeGroupId]: [...(prev[activeGroupId] || []), botMsg]
      }));
    }, 3000);
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

  // 7. Achievements Certificates Downloader
  const handleDownloadCertificate = (id, title) => {
    if (downloadingCertId) return;
    setDownloadingCertId(id);
    setCertDownloadProgress(0);
    triggerToast(`Generating digital certificate: ${title}...`);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setCertDownloadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadingCertId(null);
          triggerToast(`Certificate PDF downloaded: ${title}`);
        }, 300);
      }
    }, 200);
  };

  // 8. Rewards store
  const handleRedeemReward = (reward) => {
    if (studentXp < reward.cost) {
      triggerToast(`Insufficient XP! You need ${reward.cost - studentXp} more XP.`);
      return;
    }

    setStudentXp(prev => prev - reward.cost);
    setUnlockedRewards(prev => [...prev, reward.id]);
    triggerToast(`Redeemed: ${reward.name}! Unlocked successfully.`);
  };

  // --- END PREMIUM FEATURES HANDLERS ---

  // Study Materials list with individual download progress states

  const [downloadProgress, setDownloadProgress] = useState({}); // id -> progress percentage
  const [downloadingIds, setDownloadingIds] = useState({}); // id -> true/false

  const allStudyMaterials = [
    { id: 1, name: 'Organic Chemistry Roadmap - Carbonyl Compounds.pdf', size: '3.4 MB', type: 'PDF Notes', subject: 'Chemistry' },
    { id: 2, name: 'JEE Physics Cheat Sheet - Electromagnetism formulas.pdf', size: '2.1 MB', type: 'Formula Sheet', subject: 'Physics' },
    { id: 3, name: 'Calculus Integration Mock Practice Problems.pdf', size: '1.5 MB', type: 'Worksheet', subject: 'Mathematics' },
    { id: 4, name: 'Inorganic Chemistry Coordination Complexes Key Notes.pdf', size: '4.0 MB', type: 'PDF Revision Notes', subject: 'Chemistry' },
    { id: 5, name: 'Class 10 Science - Chemical Reactions & Equations.pdf', size: '2.8 MB', type: 'PDF Notes', subject: 'Science' },
    { id: 6, name: 'Cell Structure Revision Notes.pdf', size: '3.1 MB', type: 'PDF Notes', subject: 'Biology' },
    { id: 7, name: 'Grammar and Writing Skills Guide.pdf', size: '1.9 MB', type: 'PDF Notes', subject: 'English' }
  ];

  const studyMaterials = allStudyMaterials.filter(m => (profileData.subjects || []).includes(m.subject));

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
          triggerToast(`Downloaded: ${name}`);
        }, 300);
      }
    }, 300);
  };

  // Tab - My Classes Schedules
  let liveScheduledClasses = [];
  if (profileData.assigned_teacher_id) {
    const teacherTimetableRaw = localStorage.getItem(`cograd_teacher_timetable_${profileData.assigned_teacher_id}`);
    if (teacherTimetableRaw) {
      try {
        const teacherTimetable = JSON.parse(teacherTimetableRaw);
        const teachers = getTeachers();
        const matchedTeacher = teachers.find(t => t.id === profileData.assigned_teacher_id);
        const teacherName = matchedTeacher ? matchedTeacher.name : 'Class Tutor';
        const teacherSubject = matchedTeacher?.subjects_taught?.[0] || 'Mathematics';

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
            isLive: day === 'Monday'
          };
        });
      } catch (e) {
        console.error('Failed to parse teacher timetable:', e);
      }
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

  const handleSubmitTest = () => {
    setActiveTestState('submitted');
    triggerToast('Mock Test submitted successfully! Report generated.');
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

  const mathCoverage = getSubjectCoverage('Mathematics');
  const physicsCoverage = getSubjectCoverage('Physics');
  const chemCoverage = getSubjectCoverage('Chemistry');
  const totalCoverage = getGlobalCoverage();

  const getAverageTestScore = () => {
    if (profileData.test_score) {
      const math = profileData.test_score.Mathematics || 0;
      const science = profileData.test_score.Science || 0;
      return Math.round((math + science) / 2);
    }
    return 82; // Default fallback
  };

  // Tab - Progress Details
  const doubtsSolved = aiHistory.length + teacherDoubts.filter(d => d.status === 'Resolved').length;
  const streakDays = profileData.streak || 0;
  const attendanceVal = parseFloat(profileData.attendance) || 0;

  let liveAssignmentsSubmitted = 0;
  let liveAssignmentsPending = 0;
  if (profileData.assigned_teacher_id) {
    const teacherAsgsRaw = localStorage.getItem(`cograd_teacher_assignments_${profileData.assigned_teacher_id}`);
    const teacherSubsRaw = localStorage.getItem(`cograd_teacher_submissions_${profileData.assigned_teacher_id}`);
    
    let teacherAsgs = [];
    let teacherSubs = [];
    try { if (teacherAsgsRaw) teacherAsgs = JSON.parse(teacherAsgsRaw); } catch(e) {}
    try { if (teacherSubsRaw) teacherSubs = JSON.parse(teacherSubsRaw); } catch(e) {}
    
    teacherAsgs.forEach(asg => {
      const matchedSub = teacherSubs.find(sub => sub.assignmentName === asg.name && sub.studentName === profileData.name);
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

  const achievementBadges = [
    ...(streakDays >= 10 ? [{ id: 1, title: 'Streak Master', desc: `Maintained a study streak of ${streakDays} days (10+ required)`, icon: Flame, color: 'text-amber-500 bg-amber-50' }] : []),
    ...(doubtsSolved >= 5 ? [{ id: 2, title: 'Doubt Buster', desc: `Resolved ${doubtsSolved} academic doubts (5+ required)`, icon: Sparkles, color: 'text-purple-500 bg-purple-50' }] : []),
    ...(profileData.rank && parseInt(profileData.rank.replace('#', '')) <= 5 ? [{ id: 3, title: 'Top Scorer', desc: `Ranked ${profileData.rank} in JEE weekly mocks (Top 5 required)`, icon: Award, color: 'text-blue-500 bg-blue-50' }] : []),
    ...(attendanceVal >= 90 ? [{ id: 4, title: 'Regular Attendee', desc: `Maintained attendance at ${profileData.attendance} (90%+ required)`, icon: CheckCircle2, color: 'text-blue-500 bg-blue-50' }] : [])
  ];

  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    localStorage.removeItem('cograd_student_name');
    localStorage.removeItem('cograd_token');
    triggerToast('Logged out successfully. Redirecting...');
    setTimeout(() => navigate('/login'), 900);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setProfileData(editProfileData);
    setIsEditingProfile(false);
    triggerToast('Profile details saved successfully!');
  };

  const handleCancelProfileEdit = () => {
    setEditProfileData({ ...profileData });
    setIsEditingProfile(false);
  };

  const NAV_ITEMS = [
    { name: 'Home',           icon: LayoutDashboard },
    { name: 'My Classes',     icon: BookOpen },
    { name: 'Study Material', icon: BookMarked },
    { name: 'Tests',          icon: FileText },
    { name: 'Study Groups',   icon: Users },
    { name: 'Profile & Progress', icon: User },
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
      onClearNotifs={() => setUnreadNotifications(p => p.map(n => ({ ...n, isNew: false })))}
      onLogout={handleLogout}
      toast={{ show: showToast, message: toastMessage, type: 'success' }}
      headerRight={
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsOffline(!isOffline); triggerToast(!isOffline ? 'Offline Mode Enabled.' : 'Online Mode Enabled.'); }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${isOffline ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
            title={isOffline ? 'Switch Online' : 'Switch Offline'}
          >
            {isOffline ? <WifiOff className="w-4 h-4 animate-pulse" /> : <Wifi className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl text-amber-700 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{profileData.streak}d</span>
          </div>
        </div>
      }
    >
      {/* Offline banner */}
      {isOffline && (
        <div className="mb-4 bg-rose-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2">
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          Offline Mode — cached notes, planner and flashcards available. Live classes locked.
        </div>
      )}

      {/* ── TAB CONTENT ── */}
      <div className="tab-content-enter">
        {/* TAB 1: HOME (MY DASHBOARD) */}
        {activeTab === 'Home' && (
          <div className="space-y-6">
            {/* Row 1: Welcome & Up Next Live Timer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Welcome Card */}
              <div className="lg:col-span-7 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-blue-600/15 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Hi {profileData.name ? profileData.name.split(' ')[0] : 'Student'} 👋</h3>
                  <p className="text-blue-100 text-sm max-w-md font-medium leading-relaxed">
                    {profileData.test_score ? (
                      `Your diagnostic placement test score is ${profileData.test_score.totalMarksText} (${getAverageTestScore()}%). We have personalized your study plan for ${profileData.standard || 'your grade'}!`
                    ) : (
                      "Welcome to Cograd Pathshala. Complete homework and attend today's live lecture."
                    )}
                  </p>
                  {localStorage.getItem(`cograd_parent_message_to_${profileData.studentId || 'Rahul_Varma'}`) && (
                    <div className="mt-4 p-3 bg-white/15 backdrop-blur-md rounded-xl border border-white/10 text-xs text-white max-w-md">
                      <div className="font-extrabold uppercase tracking-wider text-[9px] text-amber-300 flex items-center gap-1 mb-1">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        Message from {profileData.parentName || 'Parent'}
                      </div>
                      <p className="font-semibold italic text-slate-100">"{localStorage.getItem(`cograd_parent_message_to_${profileData.studentId || 'Rahul_Varma'}`)}"</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button onClick={() => isOffline ? triggerToast('Offline — cannot join live.') : setActiveTab('My Classes')} className="bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5">
                    Join Live Room <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-blue-200 font-semibold bg-white/10 px-3.5 py-2 rounded-xl">Target: {profileData.standard || 'Grade Preparation'}</span>
                </div>
              </div>

              {/* Up Next card */}
              <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    UP NEXT LIVE
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Starts in</span>
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 tracking-tight">Organic Chemistry: Carbonyl Compounds</h4>
                  <p className="text-slate-400 text-xs mt-1">Instructor: Mr. Rajesh Kumar</p>
                </div>
                <div className="my-4 py-3 px-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold">Countdown</span>
                  </div>
                  <span className="text-base font-black text-slate-800 tabular-nums">{timeLeft > 0 ? formatTime(timeLeft) : 'Live Now!'}</span>
                </div>
                <div className="flex gap-2.5">
                  <button onClick={() => { setReminderSet(!reminderSet); triggerToast(reminderSet ? 'Reminder cancelled' : 'Reminder set!'); }} className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${reminderSet ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}>
                    {reminderSet ? 'Reminder Set ✓' : 'Set Reminder'}
                  </button>
                  <button onClick={() => isOffline ? triggerToast('Offline.') : window.open('https://zoom.us', '_blank')} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" /> Join Class
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnostic Placement Test Result Card */}
            {profileData.test_score && (
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 animate-slide-up">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      Placement Profile
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      Completed on {new Date(profileData.test_completed_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 tracking-tight">Your Diagnostic Performance Summary</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                      Based on your placement test for <strong className="text-slate-850 font-bold">{profileData.standard}</strong>, you scored <strong className="text-indigo-600 font-extrabold">{profileData.test_score.totalMarksText}</strong> marks overall. 
                      Here is how your profile is personalized:
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm text-center min-w-[120px]">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Mathematics</span>
                      <span className="text-base font-black text-emerald-600 block mt-0.5">{profileData.test_score.mathMarksText}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.25 rounded-md font-bold inline-block mt-1">
                        {profileData.test_score.Mathematics >= 75 ? 'Excellent' : profileData.test_score.Mathematics >= 50 ? 'Strong' : 'Needs Practice'}
                      </span>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm text-center min-w-[120px]">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Science</span>
                      <span className="text-base font-black text-blue-600 block mt-0.5">{profileData.test_score.scienceMarksText}</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.25 rounded-md font-bold inline-block mt-1">
                        {profileData.test_score.Science >= 75 ? 'Excellent' : profileData.test_score.Science >= 50 ? 'Strong' : 'Needs Practice'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm min-w-[240px] space-y-3.5">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Custom Recommendations</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-slate-600 font-semibold leading-normal">
                        {profileData.test_score.Mathematics < 60 
                          ? 'Assigned math tutoring focusing on Algebra foundations.' 
                          : 'Cleared for high-track JEE Mathematics batch.'}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-slate-600 font-semibold leading-normal">
                        {profileData.test_score.Science < 60 
                          ? 'Enrolled in Science basics module & concept review.' 
                          : 'Matched with Advanced Chemistry/Physics modules.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 font-bold">Matched Tutor will contact you shortly</span>
                  </div>
                </div>
              </div>
            )}

            {/* Parent Assigned Test Card */}
            {localStorage.getItem(`cograd_assigned_tests_${profileData.studentId || 'Rahul_Varma'}`) && (() => {
              let testObj;
              try {
                testObj = JSON.parse(localStorage.getItem(`cograd_assigned_tests_${profileData.studentId || 'Rahul_Varma'}`));
              } catch {
                return null;
              }
              if (!testObj) return null;
              const testResult = localStorage.getItem(`cograd_assigned_tests_result_${profileData.studentId || 'Rahul_Varma'}`);
              return (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up">
                  <div className="flex items-start space-x-3.5">
                    <div className="p-3 bg-amber-100 border border-amber-200 text-amber-700 rounded-2xl shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-extrabold text-amber-900">📝 Custom Homework Test Assigned by Parent</h4>
                        {testResult ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">Completed</span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full animate-pulse">Pending Action</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-bold mt-1">Topic: {testObj.subject} — {testObj.topic} ({testObj.questionCount} Questions)</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Assigned by parent to check concept understanding. Earns +100 XP upon completion!</p>
                    </div>
                  </div>

                  <div>
                    {testResult ? (
                      <div className="bg-white border border-emerald-100 rounded-2xl px-4 py-2 text-center shadow-inner">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Result Score</span>
                        <span className="text-base font-black text-emerald-600">{testResult}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setParentTestSubmitted(false);
                          setParentTestAnswers({});
                          setShowParentTestModal(true);
                        }}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        Start Custom Quiz
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

              {/* Row 2: Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { title: 'Attendance', val: studentProfile.attendance, desc: 'Aim for 95%+', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
                  { title: 'Batch Rank', val: studentProfile.rank, desc: 'Out of 120 Students', icon: Award, color: 'text-amber-600 bg-amber-50' },
                  { title: 'Tests This Week', val: studentProfile.testsThisWeek, desc: 'Completed: 1', icon: FileText, color: 'text-purple-600 bg-purple-50' },
                  { title: 'Pending HW', val: studentProfile.pendingHW, desc: 'Due: Tomorrow', icon: AlertCircle, color: 'text-rose-600 bg-rose-50' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:-translate-y-1 transition-transform duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                        <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.val}</div>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">{stat.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Row 3: My Batches & Recent Results */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* My Batches List */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">My Batches</h3>
                    <span className="text-xs font-semibold text-slate-400">Total Enrolled: 2</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'b1', name: 'JEE Advanced Focus Batch', tutor: 'Mr. Rajesh Kumar (Chem) & Sarah J. (Phys)', syllabus: 68, rating: 'A-', code: 'JEE-CHEM-PHYS' },
                      { id: 'b2', name: 'Class 12 Boards Core Syllabus', tutor: 'Dr. Priya Sharma (Maths)', syllabus: 88, rating: 'A+', code: 'C12-BOARD-MATH' }
                    ].map((batch) => (
                      <div
                        key={batch.id}
                        className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-black text-slate-800">{batch.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-bold">{batch.rating}</span>
                          </div>
                          <p className="text-slate-400 text-xs font-medium">Tutor: {batch.tutor}</p>
                          
                          {/* Syllabus progress bar */}
                          <div className="flex items-center space-x-3 w-48 sm:w-56 mt-2">
                            <div className="h-1.5 bg-slate-200 rounded-full flex-grow">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${batch.syllabus}%` }}></div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold shrink-0">{batch.syllabus}% Syllabus</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownload(batch.id, `${batch.code}_Class_Notes.zip`)}
                          className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-1.5 bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          {downloadingIds[batch.id] ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                              <span className="tabular-nums">{downloadProgress[batch.id]}%</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Notes</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Results */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Results</h3>
                      <button onClick={() => setActiveTab('Profile & Progress')} className="text-xs text-blue-600 hover:underline font-bold">All Mocks</button>
                    </div>

                    <div className="space-y-3">
                      {recentResults.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center justify-between transition-all"
                        >
                          <div className="min-w-0 flex-grow pr-3">
                            <div className="text-xs font-bold text-slate-800 truncate">{res.title}</div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{res.date}</div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <div className="text-right">
                              <span className="text-sm font-black text-slate-800">{res.score}</span>
                              <div className="text-[9px] text-slate-400 font-bold">Rank: {res.rank}</div>
                            </div>
                            <button
                              onClick={() => setSelectedResult(res)}
                              className="text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                            >
                              Analysis
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-50 border border-blue-100/30 rounded-2xl p-3.5 flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-blue-900">Leaderboard update is live</h5>
                      <p className="text-[10px] text-emerald-700">You climbed 2 positions in Chemistry this week!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Ask Doubt to Your Teacher */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-500/25">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">Ask Doubt to Your Teacher</h3>
                      <p className="text-slate-400 text-xs font-medium">Select a home tutor below to send them your academic questions directly.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-xl uppercase tracking-wider">Direct Connect</span>
                </div>

                {/* Teacher Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
                  {[
                    { name: 'Mr. Rajesh Kumar', subject: 'Chemistry', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', status: 'Online' },
                    { name: 'Dr. Priya Sharma', subject: 'Mathematics', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', status: 'Online' },
                    { name: 'Dr. Sarah Johnson', subject: 'Physics', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80', status: 'Away' }
                  ].map((t) => {
                    const isSelected = selectedTeacherForDoubt === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelectedTeacherForDoubt(t.name)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all cursor-pointer active:scale-98 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/10 shadow-sm'
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/20 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0 border border-slate-100">
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${t.status === 'Online' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="text-xs font-black text-slate-800 truncate">{t.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{t.subject} • {t.status}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Form to submit doubt */}
                <form onSubmit={handleTeacherDoubtSubmit} className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={teacherDoubtText}
                      disabled={isOffline}
                      onChange={(e) => setTeacherDoubtText(e.target.value)}
                      placeholder={
                        isOffline ? "You are offline. Please go online in the header to ask doubts to teachers." :
                        selectedTeacherForDoubt === 'Mr. Rajesh Kumar' ? 'Ask Rajesh sir about organic mechanisms, isomerism, or inorganic complexes...' :
                        selectedTeacherForDoubt === 'Dr. Priya Sharma' ? 'Ask Priya ma\'am about derivatives, integrations, matrices, or probability...' :
                        'Ask Sarah ma\'am about electromagnetic waves, wave optics, or electrostatics...'
                      }
                      rows="3"
                      className="w-full text-xs p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none disabled:opacity-50"
                    />
                    
                    {/* Attachment and Send Row */}
                    <div className="flex items-center justify-between mt-2.5 bg-slate-50/85 p-2 rounded-xl border border-slate-100">
                      <div className="flex items-center space-x-2">
                        {isUploadingDoubtFile ? (
                          <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-600 px-2 py-1">
                            <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                            <span>Uploading {uploadDoubtProgress}%</span>
                          </div>
                        ) : teacherDoubtAttachment ? (
                          <div className="flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{teacherDoubtAttachment}</span>
                            <button
                              type="button"
                              onClick={() => setTeacherDoubtAttachment(null)}
                              className="text-indigo-400 hover:text-indigo-600 ml-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isOffline}
                            onClick={simulateTeacherDoubtUpload}
                            className="flex items-center space-x-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border border-dashed border-slate-200 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Attach Homework Scan</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isOffline || !teacherDoubtText.trim()}
                        className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/15 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send to Teacher</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Teacher doubts list */}
                <div className="mt-6 space-y-3.5 border-t border-slate-50 pt-5">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Doubts History with Tutors</h4>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {teacherDoubts.map((doubt) => {
                      const isExpanded = expandedTeacherDoubtId === doubt.id;
                      return (
                        <div
                          key={doubt.id}
                          className="border border-slate-100 bg-slate-50/20 rounded-2xl overflow-hidden hover:border-slate-200 transition-colors"
                        >
                          {/* Header Summary Row */}
                          <div
                            onClick={() => setExpandedTeacherDoubtId(isExpanded ? null : doubt.id)}
                            className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/40 transition-colors"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100">
                                <img src={doubt.avatar} alt={doubt.teacher} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-black text-slate-800 flex items-center space-x-2">
                                  <span>{doubt.teacher}</span>
                                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-lg">{doubt.subject}</span>
                                </div>
                                <div className="text-[10px] text-slate-600 font-semibold truncate mt-0.5 max-w-[200px] sm:max-w-xs">{doubt.question}</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 shrink-0">
                              <div className="text-right">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${
                                  doubt.status === 'Resolved'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800 animate-pulse'
                                }`}>
                                  {doubt.status}
                                </span>
                                <span className="text-[8px] text-slate-400 block mt-0.5">{doubt.timestamp}</span>
                              </div>
                              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                          </div>

                          {/* Expanded Content Drawer */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 border-t border-slate-50/50 bg-slate-50/30 text-xs text-slate-600 space-y-3">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Your Question</span>
                                <p className="font-semibold text-slate-700">{doubt.question}</p>
                                {doubt.attachment && (
                                  <div className="inline-flex items-center space-x-1.5 bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg text-[9px] font-bold mt-1.5">
                                    <Paperclip className="w-2.5 h-2.5" />
                                    <span>{doubt.attachment}</span>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-100/50">
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider block mb-1">Teacher's Explanation</span>
                                {doubt.status === 'Resolved' ? (
                                  <div className="bg-indigo-50/40 border border-indigo-100/30 rounded-xl p-3 text-slate-700 leading-relaxed font-medium">
                                    <p className="whitespace-pre-line">{doubt.answer}</p>
                                    <span className="text-[8px] text-slate-400 block mt-2 text-right">Resolved: {doubt.replyTime}</span>
                                  </div>
                                ) : (
                                  <p className="italic text-slate-400 font-semibold flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                                    <span>Teacher is reviewing your sheet. Expected resolution shortly...</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 5: Study Material - Recently Added */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Study Material - Recently Added</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Click download to trigger local download loading states.</p>
                  </div>
                  <button onClick={() => setActiveTab('Study Material')} className="text-xs text-blue-600 hover:underline font-bold">View Library</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {studyMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/5 rounded-2xl transition-all flex flex-col justify-between"
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

          {/* TAB 2: MY CLASSES */}
          {activeTab === 'My Classes' && (
            <div className="space-y-6 tab-content-enter">
              {/* Scheduled Classes */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">Upcoming Live & Scheduled Rooms</h3>
                
                <div className="space-y-4">
                  {scheduledClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                        cls.isLive
                          ? 'border-blue-100 bg-blue-50/20'
                          : 'border-slate-100 bg-slate-50/30'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg ${
                            cls.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-800' :
                            cls.subject === 'Mathematics' ? 'bg-blue-100 text-blue-800' :
                            'bg-indigo-100 text-indigo-800'
                          }`}>
                            {cls.subject}
                          </span>
                          {cls.isLive && (
                            <span className="inline-flex items-center space-x-1 bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                              <span>LIVE NOW</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-slate-800 mt-1">{cls.topic}</h4>
                        <p className="text-xs text-slate-500">Taught by {cls.teacher} • Duration: {cls.duration}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-xs font-bold text-slate-700">{cls.time}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (cls.isLive) {
                              if (isOffline) {
                                triggerToast('You are offline. Cannot join live classes.');
                              } else {
                                window.open('https://zoom.us', '_blank');
                              }
                            } else {
                              triggerToast(`Reminder alert set for ${cls.topic}`);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                            cls.isLive
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/15'
                              : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {cls.isLive ? (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Join Session</span>
                            </>
                          ) : (
                            <span>Set Alert</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recorded Archive */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">Recorded Lectures Archive</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recordedArchive.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">{rec.subject}</span>
                          <div className="flex items-center space-x-1 text-amber-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold">{rec.rating}</span>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-3 h-8 line-clamp-2 leading-tight">{rec.topic}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">By {rec.teacher}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold">{rec.date} • {rec.duration}</span>
                        <button
                          onClick={() => handleStartVideoPlayer(rec)}
                          className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Watch</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    {[
                      { id: 10, name: 'S-Block Elements Comprehensive Revision Notes', size: '2.8 MB', subject: 'Chemistry', date: 'June 09, 2026' },
                      { id: 11, name: 'Electrostatics Part 1 (Charge & Field) Problems', size: '1.9 MB', subject: 'Physics', date: 'June 08, 2026' },
                      { id: 12, name: 'Vector Algebra Theory & Advanced Solved Set', size: '4.2 MB', subject: 'Mathematics', date: 'June 06, 2026' },
                      { id: 13, name: 'Gaseous State & Molecular Theory Notes', size: '3.1 MB', subject: 'Chemistry', date: 'June 04, 2026' },
                      { id: 14, name: 'Kinematics 2D Relative Motion Worksheet', size: '1.2 MB', subject: 'Physics', date: 'June 02, 2026' },
                      { id: 15, name: 'Permutations & Combinations Core Concepts', size: '2.5 MB', subject: 'Mathematics', date: 'May 28, 2026' }
                    ].map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border border-slate-100 hover:border-blue-100 hover:bg-slate-50/20 rounded-2xl transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                              doc.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-800' :
                              doc.subject === 'Mathematics' ? 'bg-blue-50 text-blue-800' :
                              'bg-indigo-50 text-indigo-800'
                            }`}>
                              {doc.subject}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{doc.size}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 mt-3 leading-snug">{doc.name}</h4>
                          <span className="text-[10px] text-slate-400 mt-1 block">Uploaded: {doc.date}</span>
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
                    ))}
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
                          className={`py-2 px-1 text-[10px] font-bold rounded-xl text-center truncate cursor-pointer transition-all ${
                            activeDeckId === deck.id
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
                            className={`h-52 rounded-2xl cursor-pointer flex flex-col items-center justify-center p-6 text-center transition-all duration-500 relative overflow-hidden select-none hover:shadow-lg border ${
                              isCardFlipped
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
                                className={`text-left p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  isSelected
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
                    <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">Active Assessment Papers</h3>
                    
                    <div className="p-5 border border-blue-100 bg-blue-50/10 rounded-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">JEE Mains Mini Mock</span>
                        <span className="text-[10px] text-slate-400 font-bold">Duration: 180s (Demo Timer)</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800">Chemistry & Physics Mini Mock #1</h4>
                      <p className="text-xs text-slate-500 mt-1">Includes Alkyl halides, Bohr derivation model, and electrostatics calculation problems.</p>
                      
                      <div className="mt-5 flex items-center justify-end space-x-3">
                        <button
                          onClick={handleStartTest}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                        >
                          Start Test Room
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Previous results */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Past Test Performance</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Weekly Mock Test #7', score: '92/100', rank: '#2', date: '28 May 2026' },
                        { title: 'Physics Part Syllabus', score: '68/100', rank: '#24', date: '22 May 2026' },
                        { title: 'Chemistry Mechanics MCQ', score: '80/100', rank: '#8', date: '15 May 2026' }
                      ].map((mock, idx) => (
                        <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-700">{mock.title}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Date: {mock.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-800">{mock.score}</span>
                            <span className="text-[9px] text-blue-600 block font-bold">Rank: {mock.rank}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & PROGRESS */}
          {activeTab === 'Profile & Progress' && (
            <div className="space-y-6 tab-content-enter">
              {/* Header registry card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                  
                  {/* Photo with Edit hover effect */}
                  <div className="relative group w-24 h-24 shrink-0 rounded-full border-4 border-blue-50 shadow-md">
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                    
                    {isEditingProfile && (
                      <button
                        type="button"
                        onClick={() => setShowAvatarModal(true)}
                        className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                      <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-800 px-3 py-1 rounded-full font-black uppercase tracking-wider">JEE Main 2026 Target</span>
                      <span className="text-[9px] bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 rounded-full font-black uppercase tracking-wider">Join Date: {profileData.joinDate}</span>
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

              {/* Stats KPI Block */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Syllabus Covered', val: `${progressStats.syllabusCoverage}%`, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Average Test Score', val: `${progressStats.averageTestScore}%`, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Assigned Homework', val: progressStats.assignmentsSubmitted, color: 'text-indigo-600 bg-indigo-50' },
                  { label: 'Doubts Asked', val: progressStats.doubtSolvedCount, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Total Study Hours', val: `${progressStats.studyHours}h`, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Streak Days', val: profileData.streak, color: 'text-rose-600 bg-rose-50' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block leading-none mb-1.5">{stat.label}</span>
                    <span className={`text-xl font-black rounded-lg px-2 py-0.5 inline-block ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>

              {/* Progress details layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Profile Details & Visual Analytics */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Form fields */}
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
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 mb-4 animate-slide-up">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Select Student Avatar</span>
                              <button type="button" onClick={() => setShowAvatarModal(false)} className="text-xs font-bold text-red-500">Close</button>
                            </div>
                            <div className="flex space-x-3.5">
                              {presetAvatars.map((av, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setEditProfileData(prev => ({ ...prev, avatar: av }));
                                    setShowAvatarModal(false);
                                    triggerToast("Selected avatar updated in edit draft!");
                                  }}
                                  className={`w-14 h-14 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                                    editProfileData.avatar === av ? 'border-blue-500 ring-2 ring-emerald-500/20' : 'border-slate-100'
                                  }`}
                                >
                                  <img src={av} alt="Student avatar candidate" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Update Personal & Registry Info</h4>
                          
                          {/* Name & Target Exam */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Target exam class</label>
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

                          {/* Contacts student */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Primary Email Address</label>
                              <input
                                type="email"
                                required
                                value={editProfileData.email}
                                onChange={(e) => setEditProfileData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Student Mobile Number</label>
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
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Parent / Guardian Name</label>
                              <input
                                type="text"
                                required
                                value={editProfileData.parentName}
                                onChange={(e) => setEditProfileData(prev => ({ ...prev, parentName: e.target.value }))}
                                className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Parent Phone number</label>
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

                          {/* Timing Slots, Medium & Address */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Instruction Medium</label>
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
                              <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Home Tuition Schedule Slot</label>
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
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Home Tuition Address</label>
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
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </button>
                        </div>

                      </form>
                    )}
                  </div>

                  {/* Visual Analytics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Daily Study Tracker */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Weekly Study Hours</h4>
                          <span className="text-sm font-black text-slate-800">Total: 49 Hours</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+12% vs last week</span>
                      </div>
                      <div className="h-32 flex items-end justify-between px-2 pt-6">
                        {[
                          { day: 'Mon', hrs: 6, pct: '60%' },
                          { day: 'Tue', hrs: 8, pct: '80%' },
                          { day: 'Wed', hrs: 5, pct: '50%' },
                          { day: 'Thu', hrs: 9, pct: '90%' },
                          { day: 'Fri', hrs: 7, pct: '70%' },
                          { day: 'Sat', hrs: 10, pct: '100%' },
                          { day: 'Sun', hrs: 4, pct: '40%' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center flex-grow group">
                            <div className="w-full px-1 relative flex justify-center">
                              <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
                                {item.hrs} hrs
                              </span>
                              <div
                                style={{ height: item.pct }}
                                className="w-5 bg-gradient-to-t from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-600 rounded-t-lg transition-all duration-300 shadow-sm shadow-blue-400/20 cursor-pointer"
                              ></div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold mt-2">{item.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Test Score Progress Trend */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Mock Test Scores Trend</h4>
                          <span className="text-sm font-black text-slate-800">Average Tier: A (82%)</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Last 5 Weekly Mocks</span>
                      </div>
                      <div className="h-32 pt-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 320 80">
                          <defs>
                            <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="50%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="15" x2="320" y2="15" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                          <line x1="0" y1="45" x2="320" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                          <line x1="0" y1="75" x2="320" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                          
                          <path
                            d="M 10 75 Q 80 65 150 50 T 250 35 T 310 20"
                            fill="none"
                            stroke="url(#trendGrad)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          
                          <circle cx="10" cy="75" r="4.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                          <text x="10" y="90" textAnchor="middle" className="text-[9px] fill-slate-400 font-bold">72%</text>

                          <circle cx="90" cy="63" r="4.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                          <text x="90" y="50" textAnchor="middle" className="text-[9px] fill-slate-500 font-black">76%</text>

                          <circle cx="170" cy="48" r="4.5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                          <text x="170" y="35" textAnchor="middle" className="text-[9px] fill-slate-500 font-black">80%</text>

                          <circle cx="250" cy="35" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                          <text x="250" y="22" textAnchor="middle" className="text-[9px] fill-slate-500 font-black">85%</text>

                          <circle cx="310" cy="20" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                          <text x="310" y="10" textAnchor="middle" className="text-[9px] fill-slate-500 font-black">88%</text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Subject-wise Performance Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Subject-wise Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {subjectBreakdown.map((sb) => (
                        <div key={sb.subject} className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                            <span>{sb.subject}</span>
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-black uppercase tracking-wider">{sb.grade}</span>
                          </div>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="h-2.5 bg-slate-200 rounded-full flex-grow overflow-hidden">
                              <div className={`h-full rounded-full ${
                                sb.color === 'emerald' ? 'bg-blue-600' :
                                sb.color === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'
                              }`} style={{ width: `${sb.rate}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-slate-800 shrink-0">{sb.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Chapter Checklist Tracker */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight">Interactive Syllabus Chapter Tracker</h3>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">Click badges to cycle status and update coverage calculations live!</p>
                      </div>
                      
                      <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/20">
                        {['All', 'Mathematics', 'Physics', 'Chemistry'].map(subj => (
                          <button
                            key={subj}
                            onClick={() => setSelectedProgressSubject(subj)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              selectedProgressSubject === subj
                                ? 'bg-white text-blue-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {subj === 'Mathematics' ? 'Maths' : subj}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                      {syllabusChapters
                        .filter(ch => selectedProgressSubject === 'All' || ch.subject === selectedProgressSubject)
                        .map(ch => (
                          <div
                            key={ch.id}
                            className="p-3.5 border border-slate-100 hover:border-blue-100/50 hover:bg-blue-50/5 rounded-2xl flex items-center justify-between transition-all"
                          >
                            <div className="min-w-0 pr-3">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                ch.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-800' :
                                ch.subject === 'Mathematics' ? 'bg-blue-50 text-blue-800' :
                                'bg-indigo-50 text-indigo-800'
                              }`}>
                                {ch.subject}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 mt-2 truncate">{ch.name}</h4>
                            </div>

                            <button
                              onClick={() => toggleChapterStatus(ch.id)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95 cursor-pointer shadow-sm ${
                                ch.status === 'Completed' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                ch.status === 'In Progress' ? 'bg-amber-400 hover:bg-amber-500 text-white' :
                                'bg-slate-100 hover:bg-slate-200 text-slate-500'
                              }`}
                            >
                              {ch.status}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Tutors, Attendance, Goals, Leaderboard, Certificates */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Vetted Home Tutors Assigned */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Vetted Home Tutors Assigned</h3>
                    <div className="space-y-3">
                      {[
                        { subject: 'Chemistry', teacher: 'Mr. Rajesh Kumar', qual: 'M.Sc, IIT Delhi alumnus', type: 'Assigned Home Tutor' },
                        { subject: 'Mathematics', teacher: 'Dr. Priya Sharma', qual: 'Ph.D in Algebra, 10+ yrs exp', type: 'Assigned Backup Tutor' }
                      ].map((tut, i) => (
                        <div key={i} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                          <span className="text-[8px] bg-blue-50 text-blue-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">{tut.type}</span>
                          <h4 className="text-xs font-black text-slate-800 mt-2">{tut.teacher}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{tut.subject} • {tut.qual}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attendance block summary */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 tracking-tight mb-3.5">Center Attendance Sheet</h3>
                    <div className="flex items-center justify-between p-3 bg-blue-50/30 border border-blue-100/50 rounded-2xl mb-4">
                      <div>
                        <span className="text-xs font-black text-blue-900 block">Attendance Rate</span>
                        <p className="text-[10px] text-blue-600 font-bold mt-0.5">Vetted center presence metric</p>
                      </div>
                      <span className="text-xl font-black text-blue-800 px-3 py-1 bg-white rounded-xl shadow-sm border border-blue-100/30">91%</span>
                    </div>
                    <div className="space-y-2 text-[10px] font-bold text-slate-500">
                      <div className="flex justify-between">
                        <span>Total classes scheduled</span>
                        <span className="text-slate-800 font-black">44 Lectures</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Present classes</span>
                        <span className="text-slate-800 font-black">40 Lectures</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Excused leaves logged</span>
                        <span className="text-slate-800 font-black">4 Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Target Planner & Goal Setting */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                          <span>Daily Target Planner</span>
                        </h3>
                        <p className="text-slate-400 text-[10px] font-semibold mt-0.5">Stay disciplined. Complete daily goals for XP!</p>
                      </div>
                    </div>

                    {(() => {
                      const completedCount = userGoals.filter(g => g.completed).length;
                      const totalCount = userGoals.length;
                      const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                      return (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Daily Completion</span>
                            <span>{completedCount} / {totalCount} ({percent}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                      {userGoals.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => handleToggleGoal(g.id)}
                          className={`p-3 rounded-2xl border text-xs font-semibold cursor-pointer flex items-center space-x-3 transition-colors ${
                            g.completed
                              ? 'bg-blue-50/30 border-blue-100 text-slate-400 line-through'
                              : 'bg-slate-50/50 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={g.completed}
                            onChange={() => {}} // handled by outer click
                            className="w-4.5 h-4.5 text-blue-600 border-slate-355 rounded-lg focus:ring-0 cursor-pointer"
                          />
                          <span className="flex-grow select-none leading-snug">{g.text}</span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddGoal} className="flex gap-2">
                      <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Add a custom daily target..."
                        className="flex-grow text-xs py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600/20 font-semibold"
                      />
                      <button
                        type="submit"
                        disabled={!newGoalText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2.5 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-45"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Focus & Strength Tracker */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Focus & Strength Tracker</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50/40 border border-blue-100/50 p-3.5 rounded-2xl">
                        <div className="flex items-center space-x-2 text-blue-800 mb-2">
                          <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
                          <span className="text-xs font-black uppercase tracking-wider">Top Concept Strengths</span>
                        </div>
                        <ul className="text-xs text-blue-700 font-semibold space-y-1 pl-6 list-disc">
                          <li>Organic reaction mechanisms</li>
                          <li>Definite Integration derivations</li>
                          <li>Electrostatics charge fields</li>
                        </ul>
                      </div>

                      <div className="bg-rose-50/40 border border-rose-100/50 p-3.5 rounded-2xl">
                        <div className="flex items-center space-x-2 text-rose-800 mb-2">
                          <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
                          <span className="text-xs font-black uppercase tracking-wider">Growth Focus Areas</span>
                        </div>
                        <ul className="text-xs text-rose-700 font-semibold space-y-1 pl-6 list-disc">
                          <li>Rotational dynamics kinematics</li>
                          <li>Chemical Kinetics rate calculations</li>
                          <li>Vector algebra geometry vectors</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard & XP Store */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                          <Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                          <span>Leaderboard & XP Store</span>
                        </h3>
                        <p className="text-slate-400 text-[10px] font-semibold mt-0.5">Trade your earned XP for premium JEE study items!</p>
                      </div>
                      <span className="text-xs font-black bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 animate-pulse">
                        {studentXp} XP Available
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Batch Leaderboard (Rank Coordinates)</span>
                      {[
                        { name: 'Priya Patel', xp: 5120, rank: 1, isMe: false },
                        { name: 'Harsh Verma', xp: 4980, rank: 2, isMe: false },
                        { name: 'Aman Kumar', xp: 4900, rank: 3, isMe: false },
                        { name: 'Rahul Sharma (You)', xp: studentXp, rank: 4, isMe: true },
                        { name: 'Neha Singh', xp: 4750, rank: 5, isMe: false }
                      ]
                        .sort((a, b) => b.xp - a.xp)
                        .map((u, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors ${
                              u.isMe
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-50 border border-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                                u.rank === 1 ? 'bg-amber-400 text-amber-900' :
                                u.rank === 2 ? 'bg-slate-300 text-slate-905' :
                                u.rank === 3 ? 'bg-amber-600 text-white' :
                                'bg-slate-200 text-slate-800'
                              }`}>
                                {u.rank}
                              </span>
                              <span>{u.name}</span>
                            </div>
                            <span className="font-black">{u.xp} XP</span>
                          </div>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">XP Redeem Shop</span>
                      <div className="space-y-2">
                        {rewardsList.map((reward) => {
                          const isUnlocked = unlockedRewards.includes(reward.id);
                          return (
                            <div key={reward.id} className="p-3 bg-slate-50/50 border border-slate-150 rounded-2xl flex justify-between items-center gap-3">
                              <div className="min-w-0 flex-grow">
                                <h4 className="text-xs font-black text-slate-800 leading-tight">{reward.name}</h4>
                                <p className="text-[9px] text-slate-550 font-semibold mt-0.5">{reward.desc}</p>
                                <span className="text-[9px] text-amber-700 font-extrabold mt-1 block">Cost: {reward.cost} XP</span>
                              </div>
                              <button
                                type="button"
                                disabled={isUnlocked}
                                onClick={() => handleRedeemReward(reward)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shrink-0 ${
                                  isUnlocked
                                    ? 'bg-emerald-100 text-emerald-800 cursor-default font-extrabold'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                                }`}
                              >
                                {isUnlocked ? 'Unlocked' : 'Redeem'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Milestone Badges */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Milestone Badges</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {achievementBadges.length === 0 ? (
                        <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                          No milestone badges unlocked yet. Keep studying to earn badges!
                        </div>
                      ) : (
                        achievementBadges.map((badge) => {
                          const Icon = badge.icon;
                          return (
                            <div
                              key={badge.id}
                              className="p-3 border border-slate-50 hover:border-blue-100/30 rounded-2xl text-center flex flex-col items-center justify-center transition-all bg-slate-50/30 hover:bg-white"
                            >
                              <div className={`p-2 rounded-xl mb-1.5 ${badge.color}`}>
                                <Icon className="w-4.5 h-4.5" />
                              </div>
                              <span className="text-[10px] font-black text-slate-800 truncate w-full">{badge.title}</span>
                              <span className="text-[8px] text-slate-400 leading-tight mt-0.5 line-clamp-2">{badge.desc}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Academic Stepper timeline */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Academic Stepper</h3>
                    <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                      {[
                        { title: 'Core Syllabus Finish', time: 'Oct 15, 2026', desc: 'Focusing on physical chem & mechanics', active: true, done: true },
                        { title: 'Full Mock Test Phase', time: 'Nov - Dec 2026', desc: 'Complete 3-hour exam drills', active: true, done: false },
                        { title: 'JEE Main Phase 1 Attempt', time: 'Jan 2027', desc: 'First official attempt run', active: false, done: false },
                        { title: 'JEE Advanced Exam Finale', time: 'May 2027', desc: 'Targeting Top 500 AIR rank', active: false, done: false }
                      ].map((step, idx) => (
                        <div key={idx} className="relative text-xs">
                          <div className={`absolute -left-6.5 top-0.5 w-3 h-3 rounded-full border-2 ${
                            step.done ? 'bg-blue-600 border-blue-500' :
                            step.active ? 'bg-white border-blue-500 animate-pulse' :
                            'bg-white border-slate-200'
                          }`} />
                          <h5 className={`font-extrabold ${step.done || step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</h5>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{step.time}</span>
                          <p className="text-[10px] text-slate-550 mt-1 leading-normal font-semibold">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Academic Certificates */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Academic Certificates</h3>
                    <p className="text-slate-400 text-[10px] font-semibold">Verified credential awards portfolio</p>
                    
                    <div className="space-y-3">
                      {earnedCertificates.map((cert) => {
                        const isDownloading = downloadingCertId === cert.id;
                        return (
                          <div key={cert.id} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xs font-black text-slate-800 leading-tight">{cert.title}</h4>
                                <span className="text-[9px] text-blue-600 font-extrabold mt-1 block">{cert.type} • {cert.unlockedAt}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold pt-2 border-t border-slate-100/50">
                              <span>Earned: {cert.date}</span>
                              
                              {isDownloading ? (
                                <div className="w-24 text-right">
                                  <div className="flex justify-between text-[8px] text-blue-750 font-bold mb-0.5">
                                    <span>Downloading...</span>
                                    <span>{certDownloadProgress}%</span>
                                  </div>
                                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${certDownloadProgress}%` }}></div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDownloadCertificate(cert.id, cert.title)}
                                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download PDF</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDY GROUPS */}
          {activeTab === 'Study Groups' && (
            <div className="space-y-6 tab-content-enter">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 min-h-[580px]">
                
                {/* Left Panel: Available Rooms */}
                <div className="w-full lg:w-1/3 space-y-4 lg:border-r lg:border-slate-150 lg:pr-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Peer Study Hub</h3>
                    <p className="text-slate-400 text-xs">Collaborate, share notes, and solve doubts with cohort peers.</p>
                  </div>

                  <div className="space-y-2.5">
                    {studyGroups.map((group) => {
                      const isSelected = activeGroupId === group.id;
                      return (
                        <button
                          key={group.id}
                          onClick={() => {
                            setActiveGroupId(group.id);
                            triggerToast(`Joined group chat: ${group.name}`);
                          }}
                          className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/10 shadow-sm'
                              : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              group.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-800' :
                              group.subject === 'Mathematics' ? 'bg-blue-50 text-blue-800' :
                              'bg-indigo-50 text-indigo-800'
                            }`}>
                              {group.subject}
                            </span>
                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                              {group.activePeers} online
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 mt-2.5">{group.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">{group.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Discussion Panel & Messages */}
                {(() => {
                  const activeGroup = studyGroups.find(g => g.id === activeGroupId);
                  const chats = groupChats[activeGroupId] || [];
                  return (
                    <div className="w-full lg:w-2/3 flex flex-col justify-between h-[450px] lg:h-auto">
                      {/* Active Room Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner">
                            {activeGroup?.name[0]}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 leading-none">{activeGroup?.name}</h4>
                            <span className="text-[10px] font-semibold text-slate-400 mt-1 block">Discussion room for JEE {activeGroup?.subject} topics</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2.5 py-1 rounded-xl uppercase shadow-sm">
                          Direct Feed
                        </span>
                      </div>

                      {/* Chat Messages Log */}
                      {isOffline ? (
                        <div className="flex-grow flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-150 p-6 text-center">
                          <WifiOff className="w-10 h-10 text-rose-500 animate-pulse mb-3" />
                          <h5 className="text-xs font-black text-slate-800">Peer Chat Unavailable Offline</h5>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1 max-w-xs">
                            Please switch your workspace back to online mode in the header to sync live chat rooms.
                          </p>
                        </div>
                      ) : (
                        <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-50/40 rounded-3xl border border-slate-100 text-center space-y-5">
                          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <MessageSquare className="w-7 h-7" />
                          </div>
                          
                          <div className="max-w-md space-y-1.5">
                            <h4 className="text-sm font-black text-slate-800">Direct WhatsApp Group Chat</h4>
                            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                              To ensure high-fidelity communication, instant notifications, and seamless sharing of study sheets, assignments, and doubts, peer discussions for **{activeGroup?.name}** have been redirected to our official WhatsApp study group channels.
                            </p>
                          </div>

                          <div className="w-full max-w-xs bg-white border border-slate-100 rounded-xl p-3.5 text-left space-y-2.5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500 text-[10px]">✔</span>
                              <span className="text-[10px] text-slate-700 font-bold">Daily practice questions shared by mentors</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500 text-[10px]">✔</span>
                              <span className="text-[10px] text-slate-700 font-bold">Collaborative doubt solving with batchmates</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500 text-[10px]">✔</span>
                              <span className="text-[10px] text-slate-700 font-bold">Official updates on curriculum schedules</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              window.open(`https://wa.me/919876543210?text=Hello%2C%20I%20am%20a%20student%20at%20Cograd%20Pathshala%20and%20would%20like%20to%20join%20the%20official%20${encodeURIComponent(activeGroup?.name || 'Study Group')}.`, "_blank");
                            }}
                            className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-2xl shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Join WhatsApp Group Chat</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

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
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      t.strength === 'Strong' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
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
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                          videoSpeed === speed
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                Taking: {JSON.parse(localStorage.getItem('cograd_assigned_tests_Rahul_Varma'))?.topic || 'Assigned Test'}
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
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          parentTestAnswers.q1 === option
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
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          parentTestAnswers.q2 === option
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
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          parentTestAnswers.q3 === option
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
                    
                    // Save result in localStorage
                    localStorage.setItem('cograd_assigned_tests_result_Rahul_Varma', `${score}/3`);
                    triggerToast(`Test completed! Score: ${score}/3. +100 XP`);
                    setStudentXp(prev => prev + 100);
                  }}
                  className="w-full btn-primary py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit Answers
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 font-sans">
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

      </div>{/* end tab-content-enter */}
    </DashboardShell>

    {/* Floating AI Chatbot Button & Overlay Drawer */}
    <div className="fixed bottom-20 right-16 z-[9999] flex flex-col items-end">
      {/* Chatbot Overlay Card */}
      {showAiChatbot && (
        <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[580px] bg-white border border-slate-150 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up text-slate-800 no-glass">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-750 text-white p-4.5 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner relative border border-white/15">
                <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="text-xs font-black leading-none">
                  {doubtMode === 'ai' ? (
                    tutorPersona === 'chemistry' ? 'Dr. Atoms (Chemistry Tutor)' :
                    tutorPersona === 'mathematics' ? 'Prof. Vector (Math Tutor)' :
                    'Dr. Volt (Physics Tutor)'
                  ) : 'Direct Tutor Connect'}
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
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                doubtMode === 'ai'
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
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                doubtMode === 'teacher'
                  ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-indigo-500" />
              <span>Ask Tutors</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/20">
            {doubtMode === 'ai' ? (
              <>
                {/* Persona Switcher Dropdown */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Tutor Persona</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'chemistry', name: 'Dr. Atoms', color: 'emerald' },
                      { id: 'mathematics', name: 'Prof. Vector', color: 'blue' },
                      { id: 'physics', name: 'Dr. Volt', color: 'indigo' }
                    ].map(persona => (
                      <button
                        key={persona.id}
                        onClick={() => {
                          setTutorPersona(persona.id);
                          triggerToast(`Switched Tutor to ${persona.name}`);
                        }}
                        className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer truncate ${
                          tutorPersona === persona.id
                            ? 'bg-blue-50/40 border-blue-500/30 text-blue-700 font-extrabold shadow-sm'
                            : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {persona.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OCR handwriting scanner */}
                <div className="bg-white border border-slate-100 rounded-2xl p-3 text-center relative overflow-hidden transition-all group shadow-sm">
                  {isScanning ? (
                    <div className="space-y-2 relative z-10 py-1">
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600 shadow-md shadow-emerald-500 animate-bounce"></div>
                      <UploadCloud className="w-6 h-6 text-blue-500 mx-auto animate-pulse" />
                      <span className="text-[10px] font-black text-blue-800 block">AI OCR scanning notebook page...</span>
                      <div className="max-w-xs mx-auto">
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${scannerProgress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={triggerImageScan}
                      className="w-full text-center cursor-pointer flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Scan handwriting or notebook page</span>
                    </button>
                  )}
                </div>

                {/* Suggestions list */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Suggested Questions</span>
                  <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto pr-0.5">
                    {tutorPersona === 'chemistry' ? (
                      ['Explain SN1 vs SN2 kinetics', 'Cannizzaro reaction steps', 'Bohr hydrogen energy level'].map(pill => (
                        <button
                          key={pill}
                          onClick={() => setAiQuestion(pill)}
                          className="text-[9px] bg-white border border-slate-150 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer"
                        >
                          {pill}
                        </button>
                      ))
                    ) : tutorPersona === 'mathematics' ? (
                      ['Derive definite integration formula', 'Derive vector dot product derivation', 'Matrix multiplication rules'].map(pill => (
                        <button
                          key={pill}
                          onClick={() => setAiQuestion(pill)}
                          className="text-[9px] bg-white border border-slate-150 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer"
                        >
                          {pill}
                        </button>
                      ))
                    ) : (
                      ['Explain Lenz\'s Law induction basis', 'Derive Moment of Inertia for rod', 'State Coulomb\'s Law force'].map(pill => (
                        <button
                          key={pill}
                          onClick={() => setAiQuestion(pill)}
                          className="text-[9px] bg-white border border-slate-150 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer"
                        >
                          {pill}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat logs */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-0.5 border-t border-slate-100 pt-3">
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
              <div className="space-y-3.5">
                {/* Teacher selector */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Select Teacher</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Mr. Rajesh Kumar', subject: 'Chemistry', status: 'Online' },
                      { name: 'Dr. Priya Sharma', subject: 'Maths', status: 'Online' },
                      { name: 'Dr. Sarah Johnson', subject: 'Physics', status: 'Away' }
                    ].map((t) => {
                      const isSelected = selectedTeacherForDoubt === t.name;
                      return (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => setSelectedTeacherForDoubt(t.name)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer truncate ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/10 shadow-sm text-indigo-800 font-black'
                              : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600 text-[9px] font-bold'
                          }`}
                        >
                          <div className="text-[9px] truncate leading-none">{t.name.split(' ')[1]}</div>
                          <div className="text-[7px] text-slate-400 font-bold mt-1">{t.subject}</div>
                        </button>
                      );
                    })}
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
            )}
          </div>

          {/* Input Form at Footer (for AI Mode) */}
          {doubtMode === 'ai' && (
            <form onSubmit={handleAiSubmit} className="relative flex items-center p-3 border-t border-slate-150 bg-white shrink-0">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={`Ask ${tutorPersona === 'chemistry' ? 'Dr. Atoms' : tutorPersona === 'mathematics' ? 'Prof. Vector' : 'Dr. Volt'}...`}
                className="w-full text-[10px] pl-3 pr-16 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-600/20 focus:border-blue-500 font-semibold"
              />
              <div className="absolute right-4.5 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={simulateVoiceInput}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    simulatedVoiceState === 'listening'
                      ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'
                      : 'bg-white border-slate-100 text-slate-450 hover:text-slate-600'
                  }`}
                  title="Simulate Speech"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
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
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-750 hover:from-blue-750 hover:to-indigo-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group ${
          showAiChatbot ? 'rotate-90' : ''
        }`}
        title="Ask AI Doubt Solver"
      >
        {showAiChatbot ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Sparkles className="w-6 h-6 animate-pulse" />
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
  </>
);
};

export default StudentDashboard;

