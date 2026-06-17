import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  LogOut,
  Bell,
  Search,
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
  Star,
  X,
  Camera,
  Edit3,
  Save,
  CheckSquare,

  Trophy,
  WifiOff,
  Wifi,
  Plus,
  RotateCcw,
  HelpCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');
  const [profileSubTab, setProfileSubTab] = useState('profile');
  const [selectedProgressSubject, setSelectedProgressSubject] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  
  // Notification states
  const [unreadNotifications, setUnreadNotifications] = useState([
    { id: 1, text: 'New Maths notes uploaded by Priya Sharma', time: '10m ago', isNew: true },
    { id: 2, text: 'Unit test results are available', time: '2h ago', isNew: true },
    { id: 3, text: 'Home tuition session scheduled for tomorrow', time: '1d ago', isNew: false }
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

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

  // Dynamic Student Profile data state
  const [profileData, setProfileData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@cograd.com',
    phone: '9876500112',
    standard: 'Class 10 (CBSE)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    studentId: 'CP-2026-STU88',
    parentName: 'Mr. Alok Sharma',
    parentPhone: '9876500999',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    medium: 'English & Hindi',
    joinDate: '12 April 2026',
    tuitionSlot: 'Evening (04:00 PM - 05:00 PM)',
    subjects: ['Mathematics', 'Science', 'English'],
    address: 'House No. 42, Sector 4, Shastri Nagar, Meerut',
    attendance: '91%',
    pendingHW: '1',
    testsThisWeek: '1'
  });

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
  const [syllabusChapters, setSyllabusChapters] = useState([
    { id: 'm1', subject: 'Mathematics', name: 'Real Numbers', status: 'Completed' },
    { id: 'm2', subject: 'Mathematics', name: 'Polynomials', status: 'Completed' },
    { id: 'm3', subject: 'Mathematics', name: 'Triangles', status: 'In Progress' },
    { id: 'm4', subject: 'Mathematics', name: 'Statistics', status: 'Not Started' },
    { id: 's1', subject: 'Science', name: 'Light — Reflection', status: 'Completed' },
    { id: 's2', subject: 'Science', name: 'Electricity', status: 'In Progress' },
    { id: 's3', subject: 'Science', name: 'Life Processes', status: 'Not Started' },
    { id: 'e1', subject: 'English', name: 'Grammar & Writing', status: 'Completed' },
    { id: 'e2', subject: 'English', name: 'Literature — First Flight', status: 'In Progress' }
  ]);



  // Reference dynamic state back to studentProfile for simple mapping
  const studentProfile = profileData;

  // Recent Results full analysis modal state
  const [selectedResult, setSelectedResult] = useState(null);
  const recentResults = [
    {
      id: 1,
      title: 'Chemistry Part Syllabus Test (Class 10 CBSE)',
      score: '88/100',
      percentage: 88,
      rank: '#4',
      date: '10 June 2026',
      status: 'Excellent',
      color: 'emerald',
      analysis: {
        correct: 22,
        incorrect: 3,
        unanswered: 5,
        timeSpent: '52 mins',
        topics: [
          { name: 'Organic Reaction Mechanisms', score: '95%', strength: 'Strong' },
          { name: 'Coordination Chemistry', score: '88%', strength: 'Strong' },
          { name: 'Chemical Kinetics', score: '70%', strength: 'Needs Practice' }
        ],
        feedback: 'Excellent grasp of reaction mechanisms. Focus on speeding up Kinetics calculations to avoid leaving unanswered questions.'
      }
    },
    {
      id: 2,
      title: 'Physics Mock Test (Mechanics & Waves)',
      score: '76/100',
      percentage: 76,
      rank: '#12',
      date: '05 June 2026',
      status: 'Good',
      color: 'blue',
      analysis: {
        correct: 19,
        incorrect: 5,
        unanswered: 6,
        timeSpent: '58 mins',
        topics: [
          { name: 'Rotational Dynamics', score: '62%', strength: 'Weak' },
          { name: 'Simple Harmonic Motion', score: '85%', strength: 'Strong' },
          { name: 'Electrostatics', score: '82%', strength: 'Strong' }
        ],
        feedback: 'Rotational dynamics requires conceptual refinement. Review lecture videos on Moment of Inertia calculations.'
      }
    }
  ];



  // --- PREMIUM DASHBOARD FEATURES STATE ---

  // 1. Offline Mode State
  const [isOffline, setIsOffline] = useState(false);



  // Parent Assigned Test states
  const [showParentTestModal, setShowParentTestModal] = useState(false);
  const [parentTestAnswers, setParentTestAnswers] = useState({});
  const [parentTestSubmitted, setParentTestSubmitted] = useState(false);
  const [parentTestScore, setParentTestScore] = useState(0);

  // 3. Study Planner & Goal Setting State
  const [userGoals, setUserGoals] = useState([
    { id: 1, text: 'Solve 10 Integration mock questions', completed: true },
    { id: 2, text: 'Revise Chemistry Carbonyl compounds roadmap', completed: false },
    { id: 3, text: 'Attempt physics optics practice sheet', completed: false }
  ]);
  const [newGoalText, setNewGoalText] = useState('');

  // 4. Smart Video Player State
  const [activeVideoLecture, setActiveVideoLecture] = useState(null);
  const [videoSpeed, setVideoSpeed] = useState(1.0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0); // in seconds
  const [videoNotes, setVideoNotes] = useState('');
  const [savedVideoNotes, setSavedVideoNotes] = useState([
    { timestamp: '02:15', note: 'Carbonyl carbon is sp2 hybridized and planar.' },
    { timestamp: '14:40', note: 'Nucleophilic addition follows nucleophilic attack on carbon followed by protonation.' }
  ]);



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
    { id: 1, title: 'Board Prep Consistency Master', date: 'June 01, 2026', type: 'Streak Master', unlockedAt: '10 Day Streak' },
    { id: 2, title: 'Chemistry Mock Test Gold Badge', date: 'June 10, 2026', type: 'Mock Champion', unlockedAt: 'Score > 85%' }
  ]);
  const [downloadingCertId, setDownloadingCertId] = useState(null);
  const [certDownloadProgress, setCertDownloadProgress] = useState(0);

  // --- END PREMIUM FEATURES STATE ---


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
  };

  const handleToggleGoal = (id) => {
    setUserGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) {
          triggerToast('Goal completed! Keep going!');
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
    triggerToast('Note saved with video timestamp!');
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
    triggerToast('Marked as Mastered!');
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



  // Study Materials list with individual download progress states

  const [downloadProgress, setDownloadProgress] = useState({}); // id -> progress percentage
  const [downloadingIds, setDownloadingIds] = useState({}); // id -> true/false

  const studyMaterials = [
    { id: 1, name: 'Organic Chemistry Roadmap - Carbonyl Compounds.pdf', size: '3.4 MB', type: 'PDF Notes' },
    { id: 2, name: 'JEE Physics Cheat Sheet - Electromagnetism formulas.pdf', size: '2.1 MB', type: 'Formula Sheet' },
    { id: 3, name: 'Calculus Integration Mock Practice Problems.pdf', size: '1.5 MB', type: 'Worksheet' },
    { id: 4, name: 'Inorganic Chemistry Coordination Complexes Key Notes.pdf', size: '4.0 MB', type: 'PDF Revision Notes' }
  ];

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
  const scheduledClasses = [
    { id: 1, subject: 'Chemistry', topic: 'Aldehydes, Ketones & Carboxylic Acids', teacher: 'Mr. Rajesh Kumar', time: 'Today, 04:00 PM', duration: '90 mins', isLive: true },
    { id: 2, subject: 'Mathematics', topic: 'Definite Integration & Areas under curve', teacher: 'Dr. Priya Sharma', time: 'Tomorrow, 10:00 AM', duration: '120 mins', isLive: false },
    { id: 3, subject: 'Physics', topic: 'Wave Optics - Young\'s Double Slit Experiment', teacher: 'Dr. Sarah Johnson', time: '15 June, 11:30 AM', duration: '90 mins', isLive: false }
  ];

  const recordedArchive = [
    { id: 101, subject: 'Chemistry', topic: 'Isomerism & Nomenclature basics', teacher: 'Mr. Rajesh Kumar', date: 'Yesterday', duration: '75 mins', rating: 4.9 },
    { id: 102, subject: 'Mathematics', topic: 'Limits, Continuity & Differentiability', teacher: 'Dr. Priya Sharma', date: '3 days ago', duration: '110 mins', rating: 4.8 },
    { id: 103, subject: 'Physics', topic: 'Electrostatics & Gauss\'s Law application', teacher: 'Dr. Sarah Johnson', date: '5 days ago', duration: '95 mins', rating: 4.9 }
  ];

  // Homework & Assessment States
  const [worksheets, setWorksheets] = useState([
    { id: 'w1', title: 'Mathematics Worksheet - Quadrilaterals & Circles', assignedBy: 'Ms. Priya Sharma', due: 'Tomorrow', status: 'Pending' },
    { id: 'w2', title: 'Physics Practice Sheet - Spherical Mirrors & Lenses', assignedBy: 'Ms. Anjali Rao', due: '2 days ago', status: 'Submitted', file: 'Physics_Practice_Sheet_Rahul.pdf' },
    { id: 'w3', title: 'Chemistry Homework - Carbon Compounds', assignedBy: 'Dr. Sanjay Verma', due: '4 days ago', status: 'Graded', score: '9/10', remarks: 'Excellent work on chemical structures!' }
  ]);
  const [selectedWorksheetId, setSelectedWorksheetId] = useState('w1');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUploadWorksheet = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      triggerToast('Please select a file to upload first.');
      return;
    }
    setUploadLoading(true);
    setTimeout(() => {
      setWorksheets(prev => prev.map(w => {
        if (w.id === selectedWorksheetId) {
          return { ...w, status: 'Submitted', file: selectedFile.name };
        }
        return w;
      }));
      setUploadLoading(false);
      setSelectedFile(null);
      triggerToast('Worksheet uploaded successfully!');
    }, 1500);
  };

  const [activeTestState, setActiveTestState] = useState(null); // 'taking', 'submitted', null
  const [testAnswers, setTestAnswers] = useState({ q1: '', q2: '', q3: '' });
  
  const handleStartTest = () => {
    setActiveTestState('taking');
    setTestAnswers({ q1: '', q2: '', q3: '' });
    triggerToast('Informal self-check quiz started.');
  };

  const handleSubmitTest = () => {
    setActiveTestState('submitted');
    triggerToast('Quiz completed successfully!');
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

  const mathCoverage = getSubjectCoverage('Mathematics');
  const physicsCoverage = getSubjectCoverage('Physics');
  const chemCoverage = getSubjectCoverage('Chemistry');
  const totalCoverage = getGlobalCoverage();

  // Tab - Progress Details
  const progressStats = {
    syllabusCoverage: totalCoverage,
    averageTestScore: 82,
    assignmentsSubmitted: 18,
    assignmentsPending: 1,
    studyHours: 142
  };

  const subjectBreakdown = [
    { subject: 'Mathematics', rate: mathCoverage, grade: mathCoverage >= 90 ? 'A+' : mathCoverage >= 70 ? 'A' : 'B+', color: 'blue' },
    { subject: 'Chemistry', rate: chemCoverage, grade: chemCoverage >= 90 ? 'A+' : chemCoverage >= 70 ? 'A' : 'B+', color: 'emerald' },
    { subject: 'Physics', rate: physicsCoverage, grade: physicsCoverage >= 90 ? 'A+' : physicsCoverage >= 70 ? 'A' : 'B+', color: 'indigo' }
  ];

  const achievementBadges = [
    { id: 1, title: 'Streak Master', desc: 'Maintained a study streak of 10+ days', icon: Flame, color: 'text-amber-500 bg-amber-50' },
    { id: 2, title: 'Concept Master', desc: 'Scored 90%+ in a home test worksheet', icon: Sparkles, color: 'text-purple-500 bg-purple-50' },
    { id: 3, title: 'Homework Champion', desc: 'Submitted all worksheets on time for 3 consecutive weeks', icon: Award, color: 'text-blue-500 bg-blue-50' },
    { id: 4, title: 'Regular Attendee', desc: 'Maintained attendance above 90% for a month', icon: CheckCircle2, color: 'text-blue-500 bg-blue-50' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    localStorage.removeItem('cograd_student_name');
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

  return (
    <div className="min-h-screen bg-slate-50 flex relative admin-page-enter">
      
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-100/60 flex flex-col z-40 transition-transform duration-300 ease-in-out shrink-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col overflow-y-auto flex-grow">
          {/* Logo Header */}
          <div className="px-5 py-5 border-b border-slate-100/60 flex items-center justify-between">
            <div>
              <span className="logo-shimmer font-black text-lg leading-none tracking-tight">Cograd Pathshala</span>
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">Student Hub</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-4 space-y-0.5">
            {[
              { name: 'Home', icon: LayoutDashboard },
              { name: 'My Schedule', icon: BookOpen },
              { name: 'Study Material', icon: BookMarked },
              { name: 'Homework', icon: FileText },
              { name: 'My Progress', icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => { setActiveTab(tab.name); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer group active:scale-[0.98] ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={isActive ? 'font-bold' : ''}>{tab.label || tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Block */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <button
              onClick={() => { setActiveTab('My Progress'); setProfileSubTab('profile'); }}
              className="flex items-center space-x-2.5 text-left flex-grow cursor-pointer hover:opacity-85 transition-opacity"
            >
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-200"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">{profileData.name}</div>
                <div className="text-[10px] font-semibold text-slate-400">Class 10 Student</div>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header Section */}
        <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            {/* Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {activeTab === 'Home' ? 'Student Workspace' : activeTab}
            </h1>
          </div>

          {/* Action Row */}
          <div className="flex items-center space-x-4">
            {/* Offline Mode Toggle */}
            <button
              onClick={() => {
                setIsOffline(!isOffline);
                triggerToast(!isOffline ? 'Offline Mode Enabled. Using cached data.' : 'Online Mode Enabled. Syncing data...');
              }}
              className={`p-2.5 border rounded-2xl transition-all cursor-pointer relative group ${
                isOffline
                  ? 'bg-rose-50 border-rose-100 text-rose-600'
                  : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isOffline ? "Switch Online" : "Switch Offline"}
            >
              {isOffline ? <WifiOff className="w-5 h-5 animate-pulse" /> : <Wifi className="w-5 h-5" />}
            </button>

            {/* Streak Badge */}
            <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-100/50 px-3 py-1.5 rounded-2xl text-amber-700 text-xs font-bold hover:scale-105 transition-transform duration-200 cursor-default">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{studentProfile.streak} Day Streak</span>
            </div>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="p-2.5 bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-900 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer relative group"
              >
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {unreadNotifications.some(n => n.isNew) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-xl py-3 px-4 z-50 animate-slide-up">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 mb-2.5">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Center Alerts</h4>
                    <button
                      onClick={() => {
                        setUnreadNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
                        triggerToast('All notifications marked as read.');
                      }}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      Clear Badge
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {unreadNotifications.map((noti) => (
                      <div
                        key={noti.id}
                        className={`p-2.5 rounded-2xl text-xs transition-colors border ${
                          noti.isNew ? 'bg-blue-50/50 border-blue-100/30' : 'bg-slate-50/50 border-slate-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className={`font-bold ${noti.isNew ? 'text-slate-800' : 'text-slate-600'}`}>{noti.text}</span>
                          {noti.isNew && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-1"></span>}
                        </div>
                        <span className="text-[10px] text-slate-400">{noti.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => { setActiveTab('My Progress'); setProfileSubTab('profile'); }}
              className="w-10 h-10 rounded-full border-2 border-slate-100 hover:border-blue-500 transition-colors cursor-pointer overflow-hidden shadow-sm"
              title="View Profile Details"
            >
              <img
                src={studentProfile.avatar}
                alt="Rahul Sharma"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        {isOffline && (
          <div className="bg-rose-500 text-white text-xs font-bold py-2.5 px-6 flex items-center justify-center space-x-2 animate-slide-up z-10 shadow-md">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>Offline Mode Enabled - Accessing cached notes, planner, and flashcards. Real-time class joining and teacher queries are locked.</span>
          </div>
        )}

        {/* 3. TAB CONTENT ROUTER CONTAINER */}
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* TAB 1: HOME (MY DASHBOARD) */}
          {activeTab === 'Home' && (
            <div className="space-y-6 tab-content-enter">
              
              {/* Row 1: Welcome & Up Next Live Timer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Welcome Card */}
                <div className="lg:col-span-7 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-blue-600/15 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Hi Rahul, 👋</h3>
                    <p className="text-blue-100 text-xs max-w-md font-medium leading-relaxed">
                      Welcome back! Your home tutor Priya Sharma will visit today at 4 PM. Complete your pending homework before the session.
                    </p>
                    {localStorage.getItem('cograd_parent_message_to_Rahul_Varma') && (
                      <div className="mt-3 p-2.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/10 text-xs text-white max-w-md">
                        <div className="font-extrabold uppercase tracking-wider text-[9px] text-amber-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                          <span>Message from Mrs. Sharma (Parent)</span>
                        </div>
                        <p className="mt-1 font-semibold italic text-slate-100">"{localStorage.getItem('cograd_parent_message_to_Rahul_Varma')}"</p>
                      </div>
                    )}
                    

                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('My Schedule')}
                      className="bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer flex items-center space-x-1"
                    >
                      <span>View Schedule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-blue-200 font-semibold bg-white/10 px-3.5 py-2 rounded-2xl">
                      Class 10 • CBSE
                    </span>
                  </div>
                </div>

                {/* Up Next - Home Tuition Session */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-xl">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>UP NEXT</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Home visit in</span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-slate-800 tracking-tight">Mathematics — Triangles</h4>
                    <p className="text-slate-500 text-xs mt-1">Tutor: Priya Sharma • At your home</p>
                  </div>

                  <div className="my-5 py-3 px-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold">Today at 4:00 PM</span>
                    </div>
                    <span className="text-base font-black text-slate-800 tabular-nums">
                      {timeLeft > 0 ? formatTime(timeLeft) : 'Starting soon!'}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setReminderSet(!reminderSet);
                        triggerToast(reminderSet ? 'Reminder cancelled' : 'Reminder set for your tuition session.');
                      }}
                      className={`w-full py-2.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                        reminderSet
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {reminderSet ? 'Reminder Set ✓' : 'Set Reminder'}
                    </button>
                  </div>
                </div>
              </div>



              {/* Parent Assigned Test Card */}
              {localStorage.getItem('cograd_assigned_tests_Rahul_Varma') && (() => {
                let testObj;
                try {
                  testObj = JSON.parse(localStorage.getItem('cograd_assigned_tests_Rahul_Varma'));
                } catch {
                  return null;
                }
                if (!testObj) return null;
                const testResult = localStorage.getItem('cograd_assigned_tests_result_Rahul_Varma');
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
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">Completed</span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full animate-pulse">Pending Action</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-bold mt-1">Topic: {testObj.subject} — {testObj.topic} ({testObj.questionCount} Questions)</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Assigned by parent to check concept understanding. Complete before your next session!</p>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { title: 'Attendance', val: studentProfile.attendance, desc: 'Home tuition sessions', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
                  { title: 'Pending HW', val: studentProfile.pendingHW, desc: 'Due: Tomorrow', icon: AlertCircle, color: 'text-rose-600 bg-rose-50' },
                  { title: 'This Week', val: studentProfile.testsThisWeek + ' test', desc: 'School assessment', icon: FileText, color: 'text-purple-600 bg-purple-50' }
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
                
                {/* My Home Tutors */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">My Home Tutors</h3>
                    <span className="text-xs font-semibold text-slate-400">Verified teachers</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'b1', name: 'Priya Sharma', tutor: 'Mathematics & Science', syllabus: 68, rating: 'A-', code: 'MATH-SCI' },
                      { id: 'b2', name: 'Neha Gupta', tutor: 'English', syllabus: 55, rating: 'A', code: 'ENG' }
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
                          <p className="text-slate-400 text-xs font-medium">Subjects: {batch.tutor}</p>
                          
                          {/* Syllabus progress bar */}
                          <div className="flex items-center space-x-3 w-48 sm:w-56 mt-2">
                            <div className="h-1.5 bg-slate-200 rounded-full flex-grow">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${batch.syllabus}%` }}></div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold shrink-0">{batch.syllabus}% Syllabus covered</span>
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
                      <button onClick={() => { setActiveTab('My Progress'); setProfileSubTab('progress'); }} className="text-xs text-blue-600 hover:underline font-bold">View Progress</button>
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
          {activeTab === 'My Schedule' && (
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
          {activeTab === 'Homework' && (
            <div className="space-y-6 tab-content-enter">
              {/* Test Simulator Card */}
              {activeTestState === 'taking' ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <span className="text-xs bg-blue-600 text-white font-bold px-2.5 py-1 rounded-xl">Informal Self-Check Quiz</span>
                      <h3 className="text-lg font-black text-slate-800 mt-2">Active: Topic Quick Review</h3>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl text-right">
                      <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wide">Self-Paced Mode</span>
                      <span className="text-xs font-black text-emerald-800">No timers</span>
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
                      onClick={() => setActiveTestState(null)}
                      className="px-5 py-2.5 bg-white border border-slate-100 text-slate-500 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Cancel Quiz
                    </button>
                    <button
                      onClick={handleSubmitTest}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Submit Answers
                    </button>
                  </div>
                </div>
              ) : activeTestState === 'submitted' ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">Quiz Completed!</h3>
                  <p className="text-xs text-slate-500 mt-2">Excellent job! Here is your informal self-check breakdown:</p>

                  <div className="my-6 p-4 bg-slate-50 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="p-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Q1: Cannizzaro Reaction</span>
                      <span className="text-xs font-bold text-slate-700 block mt-1">Your answer: {testAnswers.q1 || 'Not answered'}</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Correct: Formaldehyde</span>
                    </div>
                    <div className="p-2 border-l border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Q2: Concave mirror in water</span>
                      <span className="text-xs font-bold text-slate-700 block mt-1">Your answer: {testAnswers.q2 || 'Not answered'}</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Correct: Remains Unchanged</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTestState(null)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Back to Homework Center
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Worksheets List & Upload Panel */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Pending Assignments List */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">Assigned Home Worksheets</h3>
                      <div className="space-y-3">
                        {worksheets.map((sheet) => (
                          <div key={sheet.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 hover:bg-white transition-all">
                            <div>
                              <div className="flex items-center space-x-2.5">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                  sheet.status === 'Graded' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                  sheet.status === 'Submitted' ? 'bg-blue-50 text-blue-800 border border-blue-100' :
                                  'bg-amber-50 text-amber-800 border border-amber-100'
                                }`}>
                                  {sheet.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">Assigned by: {sheet.assignedBy}</span>
                              </div>
                              <h4 className="text-xs font-black text-slate-800 mt-2">{sheet.title}</h4>
                              <p className="text-[10px] text-slate-500 font-semibold mt-1">Due: {sheet.due}</p>
                              {sheet.remarks && (
                                <p className="text-[10px] text-emerald-600 font-bold mt-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/30">
                                  Tutor Remarks: "{sheet.remarks}"
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              {sheet.status === 'Pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedWorksheetId(sheet.id);
                                    triggerToast(`Selected ${sheet.title} for upload`);
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
                                >
                                  Submit Solution
                                </button>
                              )}
                              {sheet.status === 'Graded' && (
                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                                  Score: {sheet.score}
                                </span>
                              )}
                              {sheet.status === 'Submitted' && (
                                <span className="text-[10px] font-semibold text-slate-400 italic">
                                  Under Review
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upload Homework Scan Panel */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Upload Completed Worksheet</h3>
                      <p className="text-slate-400 text-xs font-semibold mb-5">Scan your notebook pages or export your worksheet as a PDF/Image to submit it to your tutor.</p>
                      
                      <form onSubmit={handleUploadWorksheet} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Select Target Homework Worksheet</label>
                          <select
                            value={selectedWorksheetId}
                            onChange={(e) => setSelectedWorksheetId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none transition-colors"
                          >
                            {worksheets.filter(w => w.status === 'Pending').map(w => (
                              <option key={w.id} value={w.id}>{w.title}</option>
                            ))}
                            {worksheets.filter(w => w.status === 'Pending').length === 0 && (
                              <option value="">No pending worksheets to submit</option>
                            )}
                          </select>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/20 hover:bg-slate-50/50 hover:border-blue-400 transition-all cursor-pointer relative">
                          <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-2">
                            <div className="text-2xl">📁</div>
                            <h4 className="text-xs font-black text-slate-700">
                              {selectedFile ? selectedFile.name : 'Click or Drag file here to upload'}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold">Supports PDF, PNG, JPG (Max 10MB)</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={uploadLoading || !selectedFile || !selectedWorksheetId}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                          >
                            <span>{uploadLoading ? 'Uploading...' : 'Submit to Tutor'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Informal Quiz Trigger */}
                  <div className="space-y-6">
                    {/* Start self-check quiz */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 shadow-lg shadow-blue-600/10">
                      <h3 className="text-base font-black tracking-tight">Informal Topic Self-Check</h3>
                      <p className="text-white/80 text-xs font-medium leading-relaxed mt-2">
                        Assess your understanding of recently covered concepts at your own pace. Timers are turned off.
                      </p>
                      <button
                        onClick={handleStartTest}
                        className="w-full mt-6 bg-white hover:bg-slate-50 text-blue-805 font-bold text-xs py-3.5 rounded-xl shadow-sm transition-all cursor-pointer text-center block"
                      >
                        Start Quick Quiz
                      </button>
                    </div>

                    {/* Brief Guidance box */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">💡 Tuitions Homework Policy</h3>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        Solutions are reviewed by your dedicated tutor within 24 hours of submission. Graded feedback and ratings will show up directly in this dashboard.
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROGRESS */}
          {activeTab === 'My Progress' && profileSubTab === 'progress' && (
            <div className="space-y-6 tab-content-enter">
              {/* Sub-tab Switcher */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => { setProfileSubTab('profile'); setIsEditingProfile(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    profileSubTab === 'profile'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Profile Details
                </button>
                <button
                  type="button"
                  onClick={() => { setProfileSubTab('progress'); setIsEditingProfile(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    profileSubTab === 'progress'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Academic Progress
                </button>
              </div>

              {/* Stats KPI Block */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Syllabus Covered', val: `${progressStats.syllabusCoverage}%`, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Average Test Score', val: `${progressStats.averageTestScore}%`, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Assigned Homework', val: progressStats.assignmentsSubmitted, color: 'text-indigo-600 bg-indigo-50' },
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
                {/* Left Column: Visual Analytics & Chapter Checklist */}
                <div className="lg:col-span-8 space-y-6">
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
                      {/* Bar chart flex container */}
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
                              {/* Hover Tooltip */}
                              <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
                                {item.hrs} hrs
                              </span>
                              {/* Dynamic Bar */}
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
                      {/* Custom SVG line graph sparkline */}
                      <div className="h-32 pt-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 320 80">
                          <defs>
                            <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="50%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                          </defs>
                          {/* Grid line guidelines */}
                          <line x1="0" y1="15" x2="320" y2="15" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                          <line x1="0" y1="45" x2="320" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                          <line x1="0" y1="75" x2="320" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                          
                          {/* Smooth Curve sparkline path representing scores: 72, 76, 80, 85, 88 */}
                          <path
                            d="M 10 75 Q 80 65 150 50 T 250 35 T 310 20"
                            fill="none"
                            stroke="url(#trendGrad)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          
                          {/* Test score dots and labels */}
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

                  {/* Subject-wise Performance & Focus Tracker Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subject-wise Performance Card */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Subject-wise Performance</h3>
                        <div className="space-y-4">
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
                    </div>

                    {/* Focus & Strength Tracker */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Focus & Strength Tracker</h3>
                        
                        <div className="space-y-3">
                          {/* Strength block */}
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

                          {/* Growth block */}
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
                    </div>
                  </div>

                  {/* Chapter Tracker & Leaderboard Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Interactive Chapter Checklist Tracker */}
                  {/* Chapter Tracker */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col gap-3 mb-4">
                        <div>
                          <h3 className="text-base font-black text-slate-800 tracking-tight">Syllabus Chapter Tracker</h3>
                          <p className="text-slate-400 text-[10px] font-semibold mt-0.5">Click status badges to cycle states</p>
                        </div>
                        
                        {/* Filter pills */}
                        <div className="flex bg-slate-100 p-1 rounded-xl w-full justify-between border border-slate-200/20">
                          {['All', 'Mathematics', 'Physics', 'Chemistry'].map(subj => (
                            <button
                              key={subj}
                              onClick={() => setSelectedProgressSubject(subj)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
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

                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {syllabusChapters
                          .filter(ch => selectedProgressSubject === 'All' || ch.subject === selectedProgressSubject)
                          .map(ch => (
                            <div
                              key={ch.id}
                              className="p-3 border border-slate-100 hover:border-blue-100/50 hover:bg-blue-50/5 rounded-2xl flex items-center justify-between transition-all"
                            >
                              <div className="min-w-0 pr-3">
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  ch.subject === 'Chemistry' ? 'bg-emerald-50 text-emerald-800' :
                                  ch.subject === 'Mathematics' ? 'bg-blue-50 text-blue-800' :
                                  'bg-indigo-50 text-indigo-800'
                                }`}>
                                  {ch.subject}
                                </span>
                                <h4 className="text-xs font-bold text-slate-800 mt-1.5 truncate">{ch.name}</h4>
                              </div>

                              <button
                                onClick={() => toggleChapterStatus(ch.id)}
                                className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-colors active:scale-95 cursor-pointer shadow-sm shrink-0 ${
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
                  </div>
                </div>

                {/* Right Column: Planner, Stepper, Badges, XP Store */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Daily Target Planner */}
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

                    {/* Progress Bar of Completed Goals */}
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

                    {/* Checklist items */}
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
                            className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded-lg focus:ring-0 cursor-pointer"
                          />
                          <span className="flex-grow select-none leading-snug">{g.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleAddGoal} className="flex gap-2">
                      <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Add daily target..."
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

                  {/* Milestone Badges */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Milestone Badges</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {achievementBadges.map((badge) => {
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
                      })}
                    </div>
                  </div>

                  {/* Academic Stepper timeline */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 tracking-tight mb-4">Academic Stepper</h3>
                    <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                      {[
                        { title: 'Core Syllabus Finish', time: 'Oct 15, 2026', desc: 'Focusing on school curriculum syllabus', active: true, done: true },
                        { title: 'Full Mock Test Phase', time: 'Nov - Dec 2026', desc: 'Complete board-pattern practice tests', active: true, done: false },
                        { title: 'Board Mock Exams Run', time: 'Jan 2027', desc: 'Complete school mock exams', active: false, done: false },
                        { title: 'School Board Final Exams', time: 'May 2027', desc: 'Targeting 95%+ aggregate board score', active: false, done: false }
                      ].map((step, idx) => (
                        <div key={idx} className="relative text-xs">
                          {/* Dot accent */}
                          <div className={`absolute -left-6.5 top-0.5 w-3 h-3 rounded-full border-2 ${
                            step.done ? 'bg-blue-600 border-blue-500' :
                            step.active ? 'bg-white border-blue-500 animate-pulse' :
                            'bg-white border-slate-200'
                          }`} />
                          <h5 className={`font-extrabold ${step.done || step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</h5>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{step.time}</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal font-semibold">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}




          {/* TAB 7: DETAILED STUDENTS PROFILE */}
          {activeTab === 'My Progress' && profileSubTab === 'profile' && (
            <div className="space-y-6 tab-content-enter">
              {/* Sub-tab Switcher */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => { setProfileSubTab('profile'); setIsEditingProfile(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    profileSubTab === 'profile'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Profile Details
                </button>
                <button
                  type="button"
                  onClick={() => { setProfileSubTab('progress'); setIsEditingProfile(false); }}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    profileSubTab === 'progress'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Academic Progress
                </button>
              </div>
              
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
                      <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-800 px-3 py-1 rounded-full font-black uppercase tracking-wider">CBSE Board Exam Target</span>
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

              {/* View / Edit container layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Form fields */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  
                  {!isEditingProfile ? (
                    <div className="space-y-6">
                      {/* Personal registry details */}
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
                              <option value="Class 1">Class 1</option>
                              <option value="Class 2">Class 2</option>
                              <option value="Class 3">Class 3</option>
                              <option value="Class 4">Class 4</option>
                              <option value="Class 5">Class 5</option>
                              <option value="Class 6">Class 6</option>
                              <option value="Class 7">Class 7</option>
                              <option value="Class 8">Class 8</option>
                              <option value="Class 9 (CBSE Board)">Class 9 (CBSE Board)</option>
                              <option value="Class 10 (CBSE Board)">Class 10 (CBSE Board)</option>
                              <option value="Class 11 (Science / Commerce / Arts)">Class 11 (Science / Commerce / Arts)</option>
                              <option value="Class 12 (Board Prep)">Class 12 (Board Prep)</option>
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

                {/* Right Panel: Tuition registry statistics */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Tuition provider metadata */}
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

        </div>
      </main>

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
                      triggerToast('Please answer all questions before submitting.');
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
                    triggerToast(`Test completed! Score: ${score}/3.`);
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

      {/* 5. GLOBAL FLOATING toast notifications */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl z-50 text-xs font-semibold flex items-center space-x-2.5 animate-slide-up border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
