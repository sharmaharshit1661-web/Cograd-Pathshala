import { useState, useEffect, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  UserCheck, 
  UploadCloud, 
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Mail, 
  Search, 
  Bell, 
  User, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  GraduationCap, 
  Sparkles, 
  Send, 
  CornerUpLeft, 
  LogOut,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Download,
  Check,
  TrendingUp,
  Edit3,
  ShieldCheck,
  Video,
  Share2,
  DollarSign,
  FileSpreadsheet,
  Users,
  Tv,
  Eraser,
  Volume2,
  BrainCircuit,
  Play,
  Info
} from 'lucide-react';

const CONFETTI_COLORS = ['#3b82f6', '#7c3aed', '#ec4899', '#10b981', '#f59e0b'];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  // Dashboard navigation states
  const [activeTab, setActiveTab] = useState('My Dashboard');
  const [subTabs, setSubTabs] = useState({
    content: 'content_manager', // content_manager, sharing, co_creation
    ai: 'lesson_plan', // lesson_plan, teaching_assistance
    classroom: 'batches', // batches, live_class, demo_bookings
    grading: 'assignments', // assignments, test_engine, gradebook
    schedules: 'timetable', // timetable, attendance
    analytics: 'performance', // performance, earnings
    communication: 'announcements', // announcements, doubt_solver
    profile: 'public_profile', // public_profile, reviews
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [greeting] = useState(() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  });
  
  // Notification center states
  const [unreadNotifications, setUnreadNotifications] = useState([
    { id: 1, text: 'Rahul Varma submitted Assignment #3', time: '10m ago', isNew: true },
    { id: 2, text: 'Sanya Singh sent a doubt message', time: '1h ago', isNew: true },
    { id: 3, text: 'New class session scheduled for Batch Alpha-24', time: '2h ago', isNew: true }
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // 1. Teacher Profile States
  const [teacherProfile, setTeacherProfile] = useState({
    name: 'Priya Sharma',
    email: 'priya.sharma@cogradpathshala.com',
    phone: '9876543210',
    experience: '6+ Years',
    qualification: 'M.Sc. in Mathematics, B.Ed.',
    primarySubject: 'Mathematics (Calculus, Algebra, Geometry)',
    medium: 'English, Hindi',
    availableSlots: '25 hours/week',
    travelRange: '5 km radius',
    hourlyRate: '₹600 / hour',
    bio: 'Passionate mathematics educator dedicated to simplifying complex calculus and algebraic concepts for high school students in Tier 3 areas. Believes in interactive worksheets, weekly assessments, and regular feedback sessions.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    verified: true,
    documents: [
      { id: 1, name: 'M.Sc. Degree Certificate', type: 'Academic', status: 'Verified' },
      { id: 2, name: 'B.Ed. Certification', type: 'Academic', status: 'Verified' },
      { id: 3, name: 'Aadhaar ID Card', type: 'Identity', status: 'Verified' },
      { id: 4, name: 'Previous Experience Letter', type: 'Experience', status: 'Verified' }
    ]
  });

  const [editProfileData, setEditProfileData] = useState({ ...teacherProfile });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // 2. Shared Data States
  const [students, setStudents] = useState([
    { id: 1, name: 'Rahul Varma', batchId: 'alpha-24', attendanceRate: 94, avgGrade: 88, status: 'Active', doubtPending: false },
    { id: 2, name: 'Sanya Singh', batchId: 'jee-focus', attendanceRate: 98, avgGrade: 95, status: 'Active', doubtPending: true },
    { id: 3, name: 'Arjun Mehta', batchId: 'alpha-24', attendanceRate: 85, avgGrade: 76, status: 'Needs Attention', doubtPending: false },
    { id: 4, name: 'Adit K.', batchId: 'neet-masters', attendanceRate: 90, avgGrade: 84, status: 'Active', doubtPending: true },
    { id: 5, name: 'Vikram R.', batchId: 'foundation-a', attendanceRate: 92, avgGrade: 82, status: 'Active', doubtPending: false },
    { id: 6, name: 'Neha Gupta', batchId: 'jee-focus', attendanceRate: 96, avgGrade: 91, status: 'Active', doubtPending: false },
    { id: 7, name: 'Kunal Sen', batchId: 'neet-masters', attendanceRate: 78, avgGrade: 65, status: 'Needs Attention', doubtPending: false },
    { id: 8, name: 'Amit Shah', batchId: 'foundation-a', attendanceRate: 89, avgGrade: 80, status: 'Active', doubtPending: false }
  ]);

  const [batches, setBatches] = useState([
    { id: 'alpha-24', title: 'Mathematics Advanced', badge: 'JEE', badgeColor: 'bg-blue-500', cap: '42/50', progress: 65 },
    { id: 'jee-focus', title: 'Linear Algebra Focus', badge: 'JEE', badgeColor: 'bg-indigo-500', cap: '30/30', progress: 40 },
    { id: 'neet-masters', title: 'Calculus Masters', badge: 'NEET', badgeColor: 'bg-purple-500', cap: '15/25', progress: 88 },
    { id: 'foundation-a', title: 'Foundation Maths', badge: 'K-10', badgeColor: 'bg-emerald-500', cap: '48/50', progress: 25 }
  ]);

  const [newBatchTitle, setNewBatchTitle] = useState('');
  const [newBatchCategory, setNewBatchCategory] = useState('JEE');
  const [newBatchCap, setNewBatchCap] = useState('50');

  const [selectedBatchId, setSelectedBatchId] = useState('alpha-24');

  // 3. Attendance Tab State
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    return [
      { id: 1, name: 'Rahul Varma', present: true },
      { id: 2, name: 'Sanya Singh', present: true },
      { id: 3, name: 'Arjun Mehta', present: false },
      { id: 4, name: 'Adit K.', present: true },
      { id: 5, name: 'Vikram R.', present: true }
    ];
  });
  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  // 4. Content Management & Resource Sharing State
  const [materials, setMaterials] = useState([
    { id: 1, name: 'Calculus_101_Lecture_Notes.pdf', batch: 'Mathematics Advanced', size: '2.4 MB', date: '2026-06-11', downloads: 14 },
    { id: 2, name: 'JEE_Algebra_Practice_Set_2.pdf', batch: 'Linear Algebra Focus', size: '1.8 MB', date: '2026-06-08', downloads: 29 },
    { id: 3, name: 'Trigonometry_Formulas_Cheat_Sheet.pdf', batch: 'Foundation Maths', size: '920 KB', date: '2026-06-05', downloads: 41 }
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [newMaterialDesc, setNewMaterialDesc] = useState('');
  const [newMaterialType, setNewMaterialType] = useState('PDF Document');
  const [newMaterialBatch, setNewMaterialBatch] = useState('Mathematics Advanced');
  const [shareMaterialEmail, setShareMaterialEmail] = useState('');
  const [shareMaterialId, setShareMaterialId] = useState(1);

  // 5. Collaborative Lessons & Co-creation
  const [collaborativeLessons, setCollaborativeLessons] = useState([
    { id: 1, title: 'Calculus Integration Techniques', topic: 'Calculus', authors: ['Priya Sharma', 'Amit Sen'], lastEdit: 'Today, 11:20 AM', activeUsers: 2, comments: [
      { author: 'Amit Sen', text: 'Priya, I added 3 MCQ exercises to the final assessment slide.', time: '1h ago' },
      { author: 'Priya Sharma', text: 'Awesome Amit, I will format the solution sheet tonight.', time: '30m ago' }
    ]},
    { id: 2, title: 'Matrices and Determinants Prep', topic: 'Algebra', authors: ['Priya Sharma', 'Neha Gupta'], lastEdit: 'Yesterday', activeUsers: 1, comments: [
      { author: 'Neha Gupta', text: 'Can we include a section on Cramer\'s rule in the notes?', time: 'Yesterday' }
    ]}
  ]);
  const [activeCollabId, setActiveCollabId] = useState(1);
  const [newCollabComment, setNewCollabComment] = useState('');
  const [inviteCollabEmail, setInviteCollabEmail] = useState('');

  // 6. AI Lesson Plan Generator
  const [aiTopic, setAiTopic] = useState('Limits and Continuity');
  const [aiGrade, setAiGrade] = useState('Grade 11 (JEE Main)');
  const [aiObjective, setAiObjective] = useState('Understand limit definitions, calculate basic limits, and check continuous functions.');
  const [aiDuration, setAiDuration] = useState('60 Mins');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const aiProgressSteps = [
    "Analyzing syllabus standards and topic objectives...",
    "Sequencing timeline events and pedagogical tasks...",
    "Compiling interactive worksheets and quiz solutions...",
    "Polishing exit tickets and drafting teacher notes...",
    "Finalizing lesson template markdown structure..."
  ];

  // 7. AI Teaching Assistance
  const [aiFeedbackStudent, setAiFeedbackStudent] = useState('1');
  const [aiFeedbackTone, setAiFeedbackTone] = useState('Encouraging & Warm');
  const [aiGeneratedFeedback, setAiGeneratedFeedback] = useState('');
  const [aiGeneratingFeedback, setAiGeneratingFeedback] = useState(false);
  
  const [aiQuestionTopic, setAiQuestionTopic] = useState('Quadratic Polynomials');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiQuestionDifficulty, setAiQuestionDifficulty] = useState('Medium');
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  const [aiGeneratingQuestions, setAiGeneratingQuestions] = useState(false);

  // 8. Live Virtual Classroom
  const [isLiveClass, setIsLiveClass] = useState(false);
  const [liveClassBatch, setLiveClassBatch] = useState('alpha-24');
  const [liveMicMuted, setLiveMicMuted] = useState(false);
  const [liveVideoMuted, setLiveVideoMuted] = useState(false);
  const [liveScreenSharing, setLiveScreenSharing] = useState(false);
  const [liveRecording, setLiveRecording] = useState(false);
  const [liveRecordSeconds, setLiveRecordSeconds] = useState(0);
  const [liveChat, setLiveChat] = useState([
    { id: 1, sender: "System", text: "Virtual classroom session created. Stream online.", time: "11:00 AM" }
  ]);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [liveWhiteboardActive, setLiveWhiteboardActive] = useState(false);
  const [whiteboardColor, setWhiteboardColor] = useState('#3b82f6');
  const [whiteboardBrushSize, setWhiteboardBrushSize] = useState(5);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 9. Demo Class Bookings
  const [demoBookings, setDemoBookings] = useState([
    { id: 1, studentName: 'Aarav Mehta', grade: 'Grade 10', subject: 'Quadratic Equations', requestedSlot: '2026-06-15 at 04:00 PM', parentName: 'Sanjay Mehta', status: 'Pending', msg: 'Aarav is preparing for junior Olympiad and needs advanced concepts.' },
    { id: 2, studentName: 'Riya Gupta', grade: 'Grade 12', subject: 'Limits & Calculus', requestedSlot: '2026-06-16 at 02:00 PM', parentName: 'Deepa Gupta', status: 'Pending', msg: 'Riya is struggling with board level derivatives.' }
  ]);

  // 10. Assignments State
  const [assignments, setAssignments] = useState([
    { id: 1, name: 'Limits & Continuity Practice', batch: 'Mathematics Advanced', submissions: '22/25', dueDate: '2026-06-18' },
    { id: 2, name: 'Matrix Theory Homework', batch: 'Linear Algebra Focus', submissions: '30/30', dueDate: '2026-06-15' },
    { id: 3, name: 'Calculus Assignment #4', batch: 'Calculus Masters', submissions: '12/25', dueDate: '2026-06-20' }
  ]);
  const [newAssignName, setNewAssignName] = useState('');
  const [newAssignBatch, setNewAssignBatch] = useState('Mathematics Advanced');
  const [newAssignDueDate, setNewAssignDueDate] = useState('');

  const [gradingSubmissions, setGradingSubmissions] = useState([
    { id: 1, studentName: 'Arjun Mehta', assignmentName: 'Limits & Continuity Practice', file: 'Arjun_Calculus_HW.pdf', date: '2026-06-12', accuracy: 80, clarity: 75, timeliness: 90, remarks: 'Good approach, keep it up!', status: 'Graded', finalScore: 82 },
    { id: 2, studentName: 'Rahul Varma', assignmentName: 'Limits & Continuity Practice', file: 'Rahul_Limits_Homework.pdf', date: '2026-06-12', accuracy: 90, clarity: 95, timeliness: 100, remarks: 'Excellent logical steps and formulas written clearly.', status: 'Graded', finalScore: 95 },
    { id: 3, studentName: 'Sanya Singh', assignmentName: 'Limits & Continuity Practice', file: 'Sanya_Limits_Sheet.pdf', date: '2026-06-13', accuracy: 0, clarity: 0, timeliness: 0, remarks: '', status: 'Pending', finalScore: 0 }
  ]);
  const [selectedGradingSub, setSelectedGradingSub] = useState(null);
  const [rubricAccuracy, setRubricAccuracy] = useState(85);
  const [rubricClarity, setRubricClarity] = useState(80);
  const [rubricTimeliness, setRubricTimeliness] = useState(90);
  const [rubricRemarks, setRubricRemarks] = useState('');

  // 11. Test & Grading Engine (Quiz builder)
  const [tests, setTests] = useState([
    { id: 1, name: 'Weekly Quiz: Integration', batch: 'Mathematics Advanced', date: '2026-06-24', duration: '60 Mins', status: 'Upcoming', questionsCount: 5 },
    { id: 2, name: 'Full Term: Algebra Quiz', batch: 'Linear Algebra Focus', date: '2026-06-28', duration: '90 Mins', status: 'Upcoming', questionsCount: 8 }
  ]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestBatch, setNewTestBatch] = useState('Mathematics Advanced');
  const [newTestDate, setNewTestDate] = useState('');
  const [newTestDuration, setNewTestDuration] = useState('60 Mins');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQText, setCurrentQText] = useState('');
  const [currentQOptions, setCurrentQOptions] = useState(['', '', '', '']);
  const [currentQCorrect, setCurrentQCorrect] = useState('A');

  // 12. Gradebook & Report Cards State
  const [gradebookRecords, setGradebookRecords] = useState([
    { studentName: 'Rahul Varma', roll: '101', homework: 88, test1: 92, test2: 85, project: 90, finalGpa: 8.8 },
    { studentName: 'Sanya Singh', roll: '102', homework: 95, test1: 98, test2: 96, project: 94, finalGpa: 9.6 },
    { studentName: 'Arjun Mehta', roll: '103', homework: 76, test1: 82, test2: 70, project: 80, finalGpa: 7.8 },
    { studentName: 'Adit K.', roll: '104', homework: 84, test1: 88, test2: 82, project: 85, finalGpa: 8.5 },
    { studentName: 'Vikram R.', roll: '105', homework: 82, test1: 85, test2: 80, project: 83, finalGpa: 8.2 }
  ]);
  const [selectedReportStudent, setSelectedReportStudent] = useState(null);

  // 13. Smart Timetable & Scheduling
  const [timetableSessions, setTimetableSessions] = useState({
    'Monday-09:00 AM - 10:30 AM': { title: 'Calculus 101', batch: 'Grade 11 • Alpha-24', type: 'Lecture' },
    'Monday-11:00 AM - 12:30 PM': { title: 'Algebra Focus', batch: 'Grade 12 • JEE-Focus', type: 'Lecture' },
    'Tuesday-11:00 AM - 12:30 PM': { title: 'Algebra Focus', batch: 'Grade 12 • JEE-Focus', type: 'Lecture' },
    'Wednesday-09:00 AM - 10:30 AM': { title: 'Calculus 101', batch: 'Grade 11 • Alpha-24', type: 'Lecture' },
    'Wednesday-02:00 PM - 03:30 PM': { title: 'Geometry Fundamentals', batch: 'Grade 10 • Foundation-A', type: 'Lecture' },
    'Thursday-11:00 AM - 12:30 PM': { title: 'Algebra Focus', batch: 'Grade 12 • JEE-Focus', type: 'Lecture' },
    'Friday-09:00 AM - 10:30 AM': { title: 'Calculus 101', batch: 'Grade 11 • Alpha-24', type: 'Lecture' },
    'Friday-02:00 PM - 03:30 PM': { title: 'Geometry Fundamentals', batch: 'Grade 10 • Foundation-A', type: 'Lecture' },
    'Saturday-11:00 AM - 12:30 PM': { title: 'Calculus Masters', batch: 'Grade 12 • NEET-Masters', type: 'Lecture' }
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleSlotKey, setScheduleSlotKey] = useState('');
  const [scheduleBatch, setScheduleBatch] = useState('alpha-24');
  const [scheduleType, setScheduleType] = useState('Lecture');
  const [scheduleTitle, setScheduleTitle] = useState('');

  // 14. Doubt Resolver States
  const [doubts, setDoubts] = useState([
    { id: 1, student: 'Adit K.', msg: "Sir, I'm having trouble with Question 4 on the derivatives worksheet. Should we apply the chain rule twice?", isNew: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', reply: '', date: 'Today, 10:15 AM', type: 'text' },
    { id: 2, student: 'Vikram R.', msg: 'Is the test tomorrow covering the entire Chapter 3 or just the first three sections?', isNew: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', reply: 'It covers sections 3.1 to 3.4 only. Focus on quadratic polynomials.', date: 'Yesterday, 4:30 PM', type: 'text' }
  ]);
  const [doubtReplyId, setDoubtReplyId] = useState(null);
  const [doubtReplyInput, setDoubtReplyInput] = useState('');
  const [doubtFilter, setDoubtFilter] = useState('all');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState(0);

  // 15. Earnings & Profit States
  const [earningsStats, setEarningsStats] = useState({
    totalEarned: 45200,
    availablePayout: 12400,
    pendingInvoices: 3800
  });
  const billingLogs = [
    { id: 1, date: '2026-06-12', description: 'Weekly Batch Class: Mathematics Advanced', amount: 4800, status: 'Paid' },
    { id: 2, date: '2026-06-10', description: 'Weekly Batch Class: Linear Algebra Focus', amount: 3600, status: 'Paid' },
    { id: 3, date: '2026-06-08', description: '1-on-1 Session: Adit K. (Trigonometry)', amount: 1200, status: 'Paid' },
    { id: 4, date: '2026-06-05', description: 'Demo Class Booking: Aarav Mehta', amount: 600, status: 'Paid' }
  ];
  const [payoutProgress, setPayoutProgress] = useState(0);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  // 16. Ratings & Reviews Feed State
  const [reviewsList, setReviewsList] = useState([
    { id: 1, reviewer: 'Deepa Gupta (Parent)', rating: 5, date: '2 days ago', text: 'Ma\'am is very supportive and explains equations in multiple ways until my child understands.', reply: 'Thank you Deepa! Happy to teach Riya.' },
    { id: 2, reviewer: 'Sanjay Mehta (Parent)', rating: 5, date: '1 week ago', text: 'Highly recommend her mathematics classes. The homework reviews and regular feedback keep the progress visible.', reply: '' },
    { id: 3, reviewer: 'Kavita Singh (Parent)', rating: 4, date: '2 weeks ago', text: 'Very structured and focused calculus pedagogy. My son scored 92% in pre-board exam.', reply: '' }
  ]);
  const [selectedReviewReplyId, setSelectedReviewReplyId] = useState(null);
  const [reviewReplyInput, setReviewReplyInput] = useState('');

  // 17. Announcements Broadcasting
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, title: 'Calculus Quiz Postponed', batch: 'Mathematics Advanced', body: 'Please note the quiz scheduled for tomorrow is postponed to Monday. Please use this weekend to practice worksheet 4.', date: 'Today, 12:45 PM', views: 34 },
    { id: 2, title: 'Study Material Uploaded', batch: 'All Batches', body: 'New trigonometry cheat sheet has been uploaded in resource sharing. Check it out.', date: '3 days ago', views: 82 }
  ]);
  const [newBTitle, setNewBTitle] = useState('');
  const [newBTarget, setNewBTarget] = useState('Mathematics Advanced');
  const [newBBody, setNewBBody] = useState('');

  // Interactive dashboard states
  const [gradingConfetti, setGradingConfetti] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Greetings notification timer
  useEffect(() => {
    const toastTimer = setTimeout(() => {
      setToastMessage('New demo class request received from Sanjay Mehta');
      setShowToast(true);
    }, 5000);
    return () => clearTimeout(toastTimer);
  }, []);

  // ----------------------------------------------------
  // USE EFFECTS FOR SIMULATED LIVE CLASSROOM ACTIVITY
  // ----------------------------------------------------
  useEffect(() => {
    let chatInterval;
    if (isLiveClass) {
      const studentChatPool = [
        "Ma'am, should we solve this using the product rule or the quotient rule?",
        "Oh, now I see how the limit resolves to 2!",
        "Yes, the blackboard explanation is super clear.",
        "Could you please write down the chain rule formula once again?",
        "Understood, thank you ma'am!",
        "Will you post this session recording in the Resources section?",
        "Completed the drawing exercise!"
      ];
      const studentsNames = ["Rahul Varma", "Sanya Singh", "Arjun Mehta", "Adit K.", "Neha Gupta", "Kunal Sen"];

      chatInterval = setInterval(() => {
        const randName = studentsNames[Math.floor(Math.random() * studentsNames.length)];
        const randMsg = studentChatPool[Math.floor(Math.random() * studentChatPool.length)];
        setLiveChat(prev => [
          ...prev,
          {
            id: prev.length + 1,
            sender: randName,
            text: randMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 7000);
    }
    return () => clearInterval(chatInterval);
  }, [isLiveClass]);

  useEffect(() => {
    let recTimer;
    if (liveRecording) {
      recTimer = setInterval(() => {
        setLiveRecordSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [liveRecording]);

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    localStorage.removeItem('cograd_teacher_name');
    alert('Logged out successfully. Returning to Home.');
    navigate('/');
  };

  const triggerConfetti = () => {
    const particles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: 20 + Math.random() * 60,
      top: 20 + Math.random() * 60,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.1,
      duration: 1 + Math.random() * 1.5
    }));
    setGradingConfetti(particles);
    setTimeout(() => setGradingConfetti([]), 2000);
  };

  // Payout withdraw progress timer with async timeout safety
  useEffect(() => {
    let withdrawTimer;
    if (isProcessingPayout) {
      withdrawTimer = setTimeout(() => {
        if (payoutProgress < 100) {
          setPayoutProgress(prev => prev + 10);
        } else {
          setIsProcessingPayout(false);
          setEarningsStats(prev => ({
            ...prev,
            totalEarned: prev.totalEarned + prev.availablePayout,
            availablePayout: 0
          }));
          setToastMessage("Payout Successful! ₹12,400 transferred to your linked bank account.");
          setShowToast(true);
          triggerConfetti();
        }
      }, 150);
    }
    return () => clearTimeout(withdrawTimer);
  }, [isProcessingPayout, payoutProgress]);

  // AI Lesson Plan progress timer with dependency corrections
  useEffect(() => {
    let timer;
    if (aiGenerating) {
      timer = setTimeout(() => {
        if (aiStep < aiProgressSteps.length) {
          setAiStep(prev => prev + 1);
        } else {
          setAiGenerating(false);
          setGeneratedPlan({
            topic: aiTopic,
            grade: aiGrade,
            duration: aiDuration,
            objective: aiObjective,
            hook: "Hook & Warm-up (10 mins): Draw a dynamic graph on the board showing a tangent line that matches a curvy slope. Challenge students to calculate the exact slope at a single point without using two separate coordinates. Introduce limits as the magic bridge.",
            body: "Direct Concept Instruction (20 mins): Formulate standard limit calculations. Write lim(x->a) [f(x)-f(a)]/(x-a) as the instantaneous rate of change. Highlight continuity rules: f(x) is continuous if left-hand limit = right-hand limit = f(a).",
            practice: "Guided Practice & Worksheets (20 mins): Solve limits of f(x) = (x^2 - 4)/(x - 2) as x approaches 2. Demonstrate algebraic factoring to resolve the 0/0 indeterminate state. Let students solve 3 algebraic fraction limits independently.",
            exitTicket: "Exit Assessment Quiz (10 mins): Present the function f(x) = x^2 - x on the board and ask students to find the derivative using first principles limit definitions. Answer: 2x - 1."
          });
          setToastMessage("AI Lesson Plan drafted successfully!");
          setShowToast(true);
          triggerConfetti();
        }
      }, 1100);
    }
    return () => clearTimeout(timer);
  }, [aiGenerating, aiStep, aiTopic, aiGrade, aiDuration, aiObjective, aiProgressSteps.length]);

  const handleGenerateLessonPlan = (e) => {
    e.preventDefault();
    setAiGenerating(true);
    setAiStep(0);
    setGeneratedPlan(null);
  };

  const handleWithdrawFunds = () => {
    if (earningsStats.availablePayout <= 0) {
      alert("No available payout balance.");
      return;
    }
    setIsProcessingPayout(true);
    setPayoutProgress(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleToggleRecording = () => {
    if (!liveRecording) {
      setLiveRecordSeconds(0);
      setLiveRecording(true);
    } else {
      setLiveRecording(false);
    }
  };

  // AI Parent Feedback generator simulation
  const handleGenerateFeedback = () => {
    const student = students.find(s => s.id === parseInt(aiFeedbackStudent)) || students[0];
    setAiGeneratingFeedback(true);
    setTimeout(() => {
      setAiGeneratingFeedback(false);
      setAiGeneratedFeedback(
        `Subject: Academic Performance Update - ${student.name}\n\nDear Parent,\n\nI am writing to share a brief update on ${student.name}'s progress in our Mathematics batch. Currently, ${student.name} maintains an average grade of ${student.avgGrade}% with a highly commendable attendance record of ${student.attendanceRate}%.\n\nIn our latest sessions covering Algebra and Trigonometry, they have shown ${student.avgGrade > 85 ? 'great analytical logic and quick participation.' : 'steady improvement, but need to practice calculus worksheets more regularly to strengthen fundamentals.'}\n\nWe will be conducting our term quizzes shortly. Feel free to reach out if you have any questions.\n\nWarm regards,\nPriya Sharma\nCograd Pathshala Mentor`
      );
      setToastMessage("AI Feedback drafted!");
      setShowToast(true);
    }, 1500);
  };

  // AI Question Generator simulation
  const handleGenerateQuestions = (e) => {
    e.preventDefault();
    setAiGeneratingQuestions(true);
    setTimeout(() => {
      setAiGeneratingQuestions(false);
      const generated = Array.from({ length: aiQuestionCount }).map((_, idx) => ({
        id: idx + 1,
        question: `Question ${idx + 1} (${aiQuestionDifficulty}): If the roots of the quadratic equation x^2 - kx + 12 = 0 are in the ratio 3:1, what is the value of the constant factor k?`,
        options: ['k = 8 or -8', 'k = 6 or -6', 'k = 12', 'k = 4 or -4'],
        answer: 'A'
      }));
      setAiGeneratedQuestions(generated);
      setToastMessage(`Generated ${aiQuestionCount} math questions!`);
      setShowToast(true);
    }, 1800);
  };

  // Whiteboard drawing event handlers
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = whiteboardColor;
    ctx.lineWidth = whiteboardBrushSize;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Material upload simulation
  const handleMaterialUpload = () => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    const mockFiles = ['Calculus_Limits_Formulas.pdf', 'JEE_Matrix_Sheet.pdf', 'Algebra_Identities.pdf'];
    const fileName = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setCustomFileName(fileName);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          const newFile = {
            id: materials.length + 1,
            name: fileName,
            batch: newMaterialBatch,
            size: '1.4 MB',
            date: new Date().toISOString().split('T')[0],
            downloads: 0
          };
          setMaterials(prev => [newFile, ...prev]);
          setToastMessage('New study notes successfully cataloged!');
          setShowToast(true);
        }, 200);
      }
    }, 100);
  };

  // Schedule timetable slot
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleTitle) return;
    setTimetableSessions(prev => ({
      ...prev,
      [scheduleSlotKey]: {
        title: scheduleTitle,
        batch: batches.find(b => b.id === scheduleBatch)?.title || 'All Batches',
        type: scheduleType
      }
    }));
    setShowScheduleModal(false);
    setScheduleTitle('');
    setToastMessage('Class scheduled on weekly timetable!');
    setShowToast(true);
  };

  // Grade homework submission rubric calculation
  const handleSubGradeSubmit = (e) => {
    e.preventDefault();
    const finalCalculated = Math.round((rubricAccuracy + rubricClarity + rubricTimeliness) / 3);
    setGradingSubmissions(prev => prev.map(sub => 
      sub.id === selectedGradingSub.id 
        ? { ...sub, status: 'Graded', accuracy: rubricAccuracy, clarity: rubricClarity, timeliness: rubricTimeliness, remarks: rubricRemarks, finalScore: finalCalculated }
        : sub
    ));
    
    // Update gradebookRecords state
    setGradebookRecords(prev => prev.map(rec => 
      rec.studentName === selectedGradingSub.studentName
        ? { ...rec, homework: finalCalculated, finalGpa: parseFloat(((rec.test1 + rec.test2 + finalCalculated) / 30).toFixed(1)) }
        : rec
    ));

    // Update student average grade score in state
    setStudents(prev => prev.map(s => 
      s.name === selectedGradingSub.studentName
        ? { ...s, avgGrade: finalCalculated }
        : s
    ));
    setSelectedGradingSub(null);
    setRubricRemarks('');
    setToastMessage(`Graded successfully! Score: ${finalCalculated}/100`);
    setShowToast(true);
    triggerConfetti();
  };

  // Add questions to quiz builder
  const handleAddQuizQuestion = () => {
    if (!currentQText.trim()) return;
    setQuizQuestions(prev => [
      ...prev,
      {
        id: prev.length + 1,
        question: currentQText,
        options: [...currentQOptions],
        correct: currentQCorrect
      }
    ]);
    setCurrentQText('');
    setCurrentQOptions(['', '', '', '']);
    setCurrentQCorrect('A');
  };

  const handleSaveTestPaper = (e) => {
    e.preventDefault();
    if (!newTestName || !newTestDate) return;
    const newTestObj = {
      id: tests.length + 1,
      name: newTestName,
      batch: newTestBatch,
      date: newTestDate,
      duration: newTestDuration,
      status: 'Upcoming',
      questionsCount: quizQuestions.length || 5
    };
    setTests(prev => [...prev, newTestObj]);
    setNewTestName('');
    setNewTestDate('');
    setQuizQuestions([]);
    setToastMessage('New quiz paper published successfully!');
    setShowToast(true);
  };

  // Attendance Toggle
  const toggleAttendanceStatus = (id) => {
    setAttendanceRecords(prev => 
      prev.map(rec => rec.id === id ? { ...rec, present: !rec.present } : rec)
    );
  };

  const submitAttendanceSheet = () => {
    setSubmittingAttendance(true);
    setTimeout(() => {
      setSubmittingAttendance(false);
      setToastMessage('Attendance saved successfully!');
      setShowToast(true);
      triggerConfetti();
    }, 1000);
  };

  // ----------------------------------------------------
  // SUB-PAGES RENDERING
  // ----------------------------------------------------

  // 1. Dashboard View
  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students Enrolled</div>
            <div className="text-xl font-black text-slate-800 mt-1">85 Active</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Attendance</div>
            <div className="text-xl font-black text-slate-800 mt-1">91.4% Rate</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unsolved Doubts</div>
            <div className="text-xl font-black text-slate-800 mt-1">{doubts.filter(d => !d.reply).length} Questions</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue</div>
            <div className="text-xl font-black text-slate-800 mt-1">₹45,200</div>
          </div>
        </div>
      </div>

      {/* Schedule cards */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Today's Teaching Schedule</h2>
          <button onClick={() => { setActiveTab('Schedules & Attendance'); setSubTabs(p => ({ ...p, schedules: 'timetable' })); }} className="text-blue-500 hover:text-blue-700 text-xs font-extrabold flex items-center space-x-1 transition-colors cursor-pointer">
            <span>View full calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 09:00 AM - 10:30 AM
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800 leading-snug">Grade 11 - Calculus 101</h3>
            </div>
            <div className="text-xs text-slate-500 font-semibold bg-slate-50 py-1.5 px-3 rounded-lg w-max">Batch: Mathematics Advanced</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-blue-500 shadow-md flex flex-col justify-between h-36 ring-4 ring-blue-50">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-blue-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 11:00 AM - 12:30 PM (NOW)
                </span>
                <span className="bg-blue-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse">ONGOING</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 leading-snug">Grade 12 - Advanced Algebra</h3>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-blue-600 bg-blue-50 py-1.5 px-3 rounded-lg font-bold">Batch: Linear Algebra Focus</div>
              <button 
                onClick={() => { setActiveTab('Classroom & Batches'); setSubTabs(p => ({ ...p, classroom: 'live_class' })); setIsLiveClass(true); }} 
                className="bg-blue-500 text-white font-bold text-xs py-2 px-3 rounded-lg hover:bg-blue-600 transition-all cursor-pointer flex items-center gap-1 shadow-sm hover:scale-[1.02] active:scale-95 animate-bounce"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> <span>Enter Room</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 02:00 PM - 03:30 PM
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 leading-snug">Grade 10 - Geometry Fundamentals</h3>
            </div>
            <div className="text-xs text-slate-500 font-semibold bg-slate-50 py-1.5 px-3 rounded-lg w-max">Batch: Foundation-A</div>
          </div>
        </div>
      </section>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900">Recent Parent Reviews</h3>
              <button onClick={() => { setActiveTab('Public Profile & Reviews'); setSubTabs(p => ({ ...p, profile: 'reviews' })); }} className="text-blue-500 hover:text-blue-700 text-xs font-bold cursor-pointer">View Reviews</button>
            </div>
            <div className="space-y-4 divide-y divide-slate-50">
              {reviewsList.slice(0, 2).map(review => (
                <div key={review.id} className="pt-3 first:pt-0">
                  <div className="flex justify-between text-xs">
                    <span className="font-extrabold text-slate-800">{review.reviewer}</span>
                    <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900">Quick AI Lesson Planner</h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Enter lecture topic (e.g. Vectors)"
                className="flex-grow py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button 
                onClick={() => { setActiveTab('AI Assistant'); setSubTabs(p => ({ ...p, ai: 'lesson_plan' })); setAiGenerating(true); setAiStep(0); }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Draft Plan
              </button>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900">Pending Doubt Solve</h3>
            {doubts.filter(d => !d.reply).slice(0, 1).map(d => (
              <div key={d.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <img src={d.avatar} alt="Student" className="w-8 h-8 rounded-full border border-slate-100" />
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{d.student}</h4>
                    <p className="text-[10px] text-slate-400">{d.date}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-normal bg-slate-50 p-3 rounded-xl border border-slate-100/50">"{d.msg}"</p>
                <button 
                  onClick={() => { setActiveTab('Communication & Doubts'); setSubTabs(p => ({ ...p, communication: 'doubt_solver' })); setDoubtReplyId(d.id); }}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Write Response / Record Voice Note
                </button>
              </div>
            ))}
          </section>

          <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <DollarSign className="w-36 h-36 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Available Payout Balance</span>
              <h3 className="text-2xl font-black mt-1">₹{earningsStats.availablePayout}</h3>
              <p className="text-[10px] text-slate-400 mt-1">Calculated from completed demo classes & batch hours</p>
            </div>
            <button 
              onClick={() => { setActiveTab('Analytics & Earnings'); setSubTabs(p => ({ ...p, analytics: 'earnings' })); }}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
            >
              Go to Payout Dashboard
            </button>
          </section>
        </div>

      </div>
    </div>
  );

  // 2. Content & Resources
  const renderContentResources = () => {
    const isSharing = subTabs.content === 'sharing';
    const isCoCreation = subTabs.content === 'co_creation';

    const handleShareResource = (e) => {
      e.preventDefault();
      if (!shareMaterialEmail.trim()) return;
      setToastMessage(`Resource shared with teacher: ${shareMaterialEmail}`);
      setShowToast(true);
      setShareMaterialEmail('');
    };

    const handleAddCollabComment = (e) => {
      e.preventDefault();
      if (!newCollabComment.trim()) return;
      setCollaborativeLessons(prev => prev.map(c => 
        c.id === activeCollabId 
          ? { ...c, comments: [...c.comments, { author: 'Priya Sharma', text: newCollabComment, time: 'Just now' }] }
          : c
      ));
      setNewCollabComment('');
      setToastMessage("Collaboration feedback posted!");
      setShowToast(true);
    };

    const handleInviteCollab = (e) => {
      e.preventDefault();
      if (!inviteCollabEmail.trim()) return;
      setCollaborativeLessons(prev => prev.map(c => 
        c.id === activeCollabId 
          ? { ...c, authors: [...c.authors, inviteCollabEmail] }
          : c
      ));
      setToastMessage(`Co-creator invitation sent to: ${inviteCollabEmail}`);
      setShowToast(true);
      setInviteCollabEmail('');
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Content Repository & Resource Sharing</h2>
            <p className="text-slate-500 text-xs mt-1">Upload lecture notes, send assets to peers, and co-create lesson modules.</p>
          </div>
          
          {/* Sub-tab selection */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'content_manager', label: 'Content Manager' },
              { id: 'sharing', label: 'Resource Sharing' },
              { id: 'co_creation', label: 'Lesson Co-creation' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, content: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.content === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Manager Tab */}
        {!isSharing && !isCoCreation && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Upload Course Material</h3>
              <div 
                onClick={handleMaterialUpload}
                className={`border-2 border-dashed p-8 text-center cursor-pointer rounded-2xl hover:bg-blue-50/5 hover:border-blue-500 transition-all ${
                  isUploading ? 'border-blue-300 bg-blue-50/10' : 'border-slate-200'
                }`}
              >
                <UploadCloud className={`w-12 h-12 text-blue-500 mx-auto mb-3 ${isUploading ? 'animate-bounce' : ''}`} />
                <h4 className="text-sm font-bold text-slate-800">Drag & drop files here</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isUploading ? `Uploading ${customFileName} (${uploadProgress}%)` : 'Click to select files (PDF, ZIP, DOCX)'}
                </p>
                {isUploading && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Material Type</label>
                <select 
                  value={newMaterialType}
                  onChange={(e) => setNewMaterialType(e.target.value)}
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  <option>PDF Document</option>
                  <option>Video Lecture Link</option>
                  <option>Web Resource URL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Brief Description</label>
                <input 
                  type="text"
                  value={newMaterialDesc}
                  onChange={(e) => setNewMaterialDesc(e.target.value)}
                  placeholder="e.g. Contains integration exercises"
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Target Batch</label>
                <select 
                  value={newMaterialBatch}
                  onChange={(e) => setNewMaterialBatch(e.target.value)}
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.title}>{b.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Uploaded Course Materials</h3>
              <div className="divide-y divide-slate-50">
                {materials.map(mat => (
                  <div key={mat.id} className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className="w-10 h-10 bg-red-50 text-red-500 border border-red-100 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0">PDF</div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-800 truncate">{mat.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{mat.batch} • {mat.size} • {mat.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button onClick={() => alert("Downloading sample file...")} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"><Download className="w-4 h-4" /></button>
                      <button onClick={() => setMaterials(prev => prev.filter(m => m.id !== mat.id))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resource Sharing Tab */}
        {isSharing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Direct Peer Sharing</h3>
              <form onSubmit={handleShareResource} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Select Document to Share</label>
                  <select 
                    value={shareMaterialId}
                    onChange={(e) => setShareMaterialId(parseInt(e.target.value))}
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-slate-700 cursor-pointer"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Recipient Teacher's Email</label>
                  <input
                    type="email"
                    required
                    value={shareMaterialEmail}
                    onChange={(e) => setShareMaterialEmail(e.target.value)}
                    placeholder="e.g. amit.sen@cograd.com"
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1">
                  <Share2 className="w-4 h-4" /> Share Document
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Resource Sharing Log</h3>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center space-x-3 text-xs text-slate-500">
                <Info className="w-5 h-5 text-blue-500 shrink-0" />
                <p>Shared folders are synchronized instantly. Teachers with correct access can download or clone files to their active batch boards.</p>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-700">Calculus_101_Lecture_Notes.pdf</h4>
                    <p className="text-slate-400 mt-0.5">Shared with amit.sen@cograd.com • Today, 10:40 AM</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">Delivered</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collaborative Lessons & Co-creation Tab */}
        {isCoCreation && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-base font-black text-slate-800">Shared Lesson Plans</h3>
              <div className="space-y-3">
                {collaborativeLessons.map(lesson => (
                  <div 
                    key={lesson.id}
                    onClick={() => setActiveCollabId(lesson.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      activeCollabId === lesson.id 
                        ? 'border-blue-500 bg-blue-50/10 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <h4 className="text-sm font-extrabold text-slate-800">{lesson.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Topic: {lesson.topic}</p>
                    <div className="flex items-center space-x-2 mt-3 text-[10px] text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      <span>{lesson.authors.length} Collaborators</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
              {(() => {
                const activeL = collaborativeLessons.find(c => c.id === activeCollabId) || collaborativeLessons[0];
                return (
                  <>
                    <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-800">{activeL.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">Co-authors: {activeL.authors.join(', ')}</p>
                      </div>
                      <span className="bg-blue-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Active Draft</span>
                    </div>

                    {/* Peer Inviting Form */}
                    <form onSubmit={handleInviteCollab} className="flex gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                      <input 
                        type="email"
                        required
                        value={inviteCollabEmail}
                        onChange={(e) => setInviteCollabEmail(e.target.value)}
                        placeholder="Invite teacher by email..."
                        className="flex-grow bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
                      />
                      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer shrink-0">Invite</button>
                    </form>

                    {/* Lesson structure preview */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-xs text-slate-600 space-y-2">
                      <h4 className="font-extrabold text-slate-800">Draft Framework:</h4>
                      <p>• Warm-up Activity: Discuss real world rates of change (15 mins)</p>
                      <p>• Concept Overview: Power rule proof and notation (20 mins)</p>
                      <p>• Assignment exercises: 10 differentiation questions (25 mins)</p>
                    </div>

                    {/* Comments section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-800 flex items-center gap-1"><MessageSquare className="w-4 h-4 text-blue-500" /> Collaboration Feed</h4>
                      <div className="space-y-3 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 max-h-48 overflow-y-auto pr-1">
                        {activeL.comments.map((c, i) => (
                          <div key={i} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-700">
                              <span>{c.author}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{c.time}</span>
                            </div>
                            <p className="text-slate-600 mt-1 italic leading-normal font-semibold bg-white p-2.5 rounded-lg border border-slate-100">"{c.text}"</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAddCollabComment} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={newCollabComment}
                          onChange={(e) => setNewCollabComment(e.target.value)}
                          placeholder="Suggest a modification or ask a question..."
                          className="flex-grow py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                        />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-xl cursor-pointer shadow-sm"><Send className="w-4.5 h-4.5" /></button>
                      </form>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

      </div>
    );
  };

  // 3. AI Assistant
  const renderAIAssistant = () => {
    const isTeachingAssistant = subTabs.ai === 'teaching_assistance';

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Teaching Co-Pilot</h2>
            <p className="text-slate-500 text-xs mt-1">Generate lesson outlines, draft feedback to parents, and compile practice worksheets.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'lesson_plan', label: 'AI Lesson Plan Generator' },
              { id: 'teaching_assistance', label: 'AI Teaching Assistance' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, ai: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.ai === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Lesson Plan Generator Tab */}
        {!isTeachingAssistant && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <form onSubmit={handleGenerateLessonPlan} className="md:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                <BrainCircuit className="w-5 h-5 text-blue-500" /> Plan Parameters
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Lecture Topic</label>
                <input 
                  type="text" required value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Limits and Continuity"
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Target Grade/Standard</label>
                <input 
                  type="text" required value={aiGrade}
                  onChange={(e) => setAiGrade(e.target.value)}
                  placeholder="e.g. Grade 11 (Calculus)"
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Duration</label>
                  <select 
                    value={aiDuration}
                    onChange={(e) => setAiDuration(e.target.value)}
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="45 Mins">45 Mins</option>
                    <option value="60 Mins">60 Mins</option>
                    <option value="90 Mins">90 Mins</option>
                    <option value="120 Mins">120 Mins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Difficulty</label>
                  <select className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer">
                    <option>Standard Board</option>
                    <option>JEE Main / Olympiad</option>
                    <option>NEET Physics Math</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Core Learning Objective</label>
                <textarea 
                  required value={aiObjective}
                  onChange={(e) => setAiObjective(e.target.value)}
                  rows="3"
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={aiGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {aiGenerating ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Drafting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5 fill-current" />
                    <span>Generate Lesson Plan</span>
                  </>
                )}
              </button>
            </form>

            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[450px]">
              {aiGenerating && (
                <div className="flex-grow flex flex-col items-center justify-center space-y-4 animate-pulse">
                  <BrainCircuit className="w-14 h-14 text-blue-500 animate-bounce" />
                  <h4 className="text-sm font-extrabold text-slate-800">Cograd AI Engine Working</h4>
                  <p className="text-xs text-slate-400 text-center max-w-sm font-medium">{aiProgressSteps[aiStep]}</p>
                  <div className="w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${(aiStep + 1) * 20}%` }} />
                  </div>
                </div>
              )}

              {!aiGenerating && !generatedPlan && (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-3">
                  <BrainCircuit className="w-12 h-12 text-slate-300" />
                  <h4 className="text-sm font-extrabold text-slate-500">No Lesson Plan Drafted Yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs font-semibold leading-relaxed">Enter objectives on the left side panel and click generate to receive a structured pedagogical outline.</p>
                </div>
              )}

              {!aiGenerating && generatedPlan && (
                <div className="space-y-5 flex-grow">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div>
                      <h4 className="text-base font-black text-slate-800">{generatedPlan.topic}</h4>
                      <p className="text-xs text-slate-400 font-bold">{generatedPlan.grade} • {generatedPlan.duration}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => alert("Downloading lesson outline...")} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer" title="Download"><Download className="w-4 h-4" /></button>
                      <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(generatedPlan)); setToastMessage("Copied to clipboard!"); setShowToast(true); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer" title="Copy"><Check className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs leading-relaxed max-h-[350px] overflow-y-auto pr-1">
                    <div className="p-3 bg-blue-50/20 border border-blue-500/10 rounded-xl">
                      <h5 className="font-extrabold text-blue-600 uppercase text-[9px] mb-1">Core Objective</h5>
                      <p className="text-slate-600 font-semibold">{generatedPlan.objective}</p>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-700 uppercase text-[9px] mb-1">Hook / Warm-up</h5>
                      <p className="text-slate-600 font-semibold">{generatedPlan.hook}</p>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-700 uppercase text-[9px] mb-1">Concept Delivery Details</h5>
                      <p className="text-slate-600 font-semibold">{generatedPlan.body}</p>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-700 uppercase text-[9px] mb-1">Guided Practice & Worksheet</h5>
                      <p className="text-slate-600 font-semibold">{generatedPlan.practice}</p>
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-700 uppercase text-[9px] mb-1">Exit Assessment Checklist</h5>
                      <p className="text-slate-600 font-semibold">{generatedPlan.exitTicket}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Teaching Assistance Tab */}
        {isTeachingAssistant && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Parent Feedback Writer */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5"><Mail className="w-5 h-5 text-indigo-500" /> Parent Email Feedback Drafter</h3>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Select Student</label>
                <select 
                  value={aiFeedbackStudent}
                  onChange={(e) => setAiFeedbackStudent(e.target.value)}
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} (GPA: {s.avgGrade}%)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Drafting Tone</label>
                <select 
                  value={aiFeedbackTone}
                  onChange={(e) => setAiFeedbackTone(e.target.value)}
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  <option>Encouraging & Warm</option>
                  <option>Constructive & Focus Areas</option>
                  <option>Performance Warning</option>
                </select>
              </div>

              <button 
                onClick={handleGenerateFeedback}
                disabled={aiGeneratingFeedback}
                className="w-full py-2.5 bg-indigo-500 text-white font-bold text-xs rounded-xl hover:bg-indigo-600 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                {aiGeneratingFeedback ? 'Drafting mail...' : 'Draft Feedback Email'}
              </button>

              {aiGeneratedFeedback && (
                <div className="space-y-3">
                  <textarea 
                    value={aiGeneratedFeedback}
                    onChange={(e) => setAiGeneratedFeedback(e.target.value)}
                    rows="8"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold resize-none leading-relaxed text-slate-600"
                  />
                  <button 
                    onClick={() => { navigator.clipboard.writeText(aiGeneratedFeedback); setToastMessage("Email text copied!"); setShowToast(true); }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Copy Email Draft
                  </button>
                </div>
              )}
            </div>

            {/* AI Question Bank builder */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5"><FileSpreadsheet className="w-5 h-5 text-purple-500" /> Automated Question Generator</h3>
              <form onSubmit={handleGenerateQuestions} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Topic Subject</label>
                  <input
                    type="text" required value={aiQuestionTopic}
                    onChange={(e) => setAiQuestionTopic(e.target.value)}
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Questions count</label>
                    <input
                      type="number" min="1" max="15" required value={aiQuestionCount}
                      onChange={(e) => setAiQuestionCount(parseInt(e.target.value))}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Difficulty</label>
                    <select 
                      value={aiQuestionDifficulty}
                      onChange={(e) => setAiQuestionDifficulty(e.target.value)}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 bg-purple-500 text-white font-bold text-xs rounded-xl hover:bg-purple-600 transition-all cursor-pointer">
                  {aiGeneratingQuestions ? 'Generating quiz questions...' : 'Generate Practice Questions'}
                </button>
              </form>

              {aiGeneratedQuestions.length > 0 && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {aiGeneratedQuestions.map(q => (
                    <div key={q.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                      <h4 className="font-extrabold text-slate-800">{q.question}</h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-500">
                        {q.options.map((opt, i) => (
                          <div key={i} className="font-semibold">Option {String.fromCharCode(65 + i)}: {opt}</div>
                        ))}
                      </div>
                      <div className="text-[10px] text-green-600 font-black">Correct Option: {q.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    );
  };

  // 4. Classroom & Batches
  const renderClassroomBatches = () => {
    const isLive = subTabs.classroom === 'live_class';
    const isDemo = subTabs.classroom === 'demo_bookings';

    const handleCreateBatch = (e) => {
      e.preventDefault();
      if (!newBatchTitle) return;
      const newB = {
        id: newBatchTitle.toLowerCase().replace(/\s+/g, '-'),
        title: newBatchTitle,
        badge: newBatchCategory,
        badgeColor: newBatchCategory === 'JEE' ? 'bg-blue-500' : newBatchCategory === 'NEET' ? 'bg-purple-500' : 'bg-emerald-500',
        cap: `0/${newBatchCap}`,
        progress: 0
      };
      setBatches(prev => [...prev, newB]);
      setNewBatchTitle('');
      setToastMessage('New batch set up successfully!');
      setShowToast(true);
    };

    const handleAcceptDemo = (id) => {
      setDemoBookings(prev => prev.map(d => d.id === id ? { ...d, status: 'Accepted' } : d));
      setToastMessage('Demo booking accepted and added to timetable!');
      setShowToast(true);
      triggerConfetti();
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Classroom & Batch Management</h2>
            <p className="text-slate-500 text-xs mt-1">Manage student batches, enter live streaming virtual classes, and review demo slots.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'batches', label: 'Batches' },
              { id: 'live_class', label: 'Live Classroom' },
              { id: 'demo_bookings', label: 'Demo Bookings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, classroom: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.classroom === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Batches tab */}
        {!isLive && !isDemo && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {batches.map(batch => (
                <div 
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between h-40 ${
                    selectedBatchId === batch.id 
                      ? 'border-blue-500 bg-white ring-4 ring-blue-50 shadow-md scale-[1.02]' 
                      : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2.5">
                      <h3 className="text-sm font-extrabold text-slate-800 pr-2 leading-snug truncate">{batch.title}</h3>
                      <span className={`${batch.badgeColor} text-white font-black text-[9px] px-2 py-0.5 rounded shrink-0`}>{batch.badge}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">Capacity: <span className="text-slate-800 font-bold">{batch.cap} Students</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Syllabus Completion</span>
                      <span>{batch.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" style={{ width: `${batch.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Add Batch Form */}
              <div className="md:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5"><Plus className="w-5 h-5 text-blue-500" /> Create New Batch</h3>
                <form onSubmit={handleCreateBatch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Batch Name</label>
                    <input 
                      type="text" required value={newBatchTitle}
                      onChange={(e) => setNewBatchTitle(e.target.value)}
                      placeholder="e.g. Geometry Advanced"
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Category</label>
                      <select 
                        value={newBatchCategory}
                        onChange={(e) => setNewBatchCategory(e.target.value)}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        <option>JEE</option>
                        <option>NEET</option>
                        <option>Foundation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Max Limit</label>
                      <input 
                        type="number" required value={newBatchCap}
                        onChange={(e) => setNewBatchCap(e.target.value)}
                        className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm font-semibold text-center"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-blue-600 transition-all cursor-pointer">Create Batch</button>
                </form>
              </div>

              {/* Students Enrolled */}
              <div className="md:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-black text-slate-800">Students in {batches.find(b => b.id === selectedBatchId)?.title}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Attendance</th>
                        <th className="py-2.5 px-3">Avg Grade</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                      {students.filter(s => s.batchId === selectedBatchId).map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-extrabold text-slate-800">{s.name}</td>
                          <td className="py-3 px-3">{s.attendanceRate}%</td>
                          <td className="py-3 px-3">{s.avgGrade}%</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              s.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                            }`}>{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Live Classroom tab */}
        {isLive && (
          <div className="space-y-6">
            {!isLiveClass ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center max-w-md mx-auto space-y-5">
                <Tv className="w-16 h-16 text-blue-500 mx-auto animate-pulse" />
                <div>
                  <h3 className="text-lg font-black text-slate-800">Launch Live Virtual Stream</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-semibold">Select your scheduled batch below to initiate a premium live classroom with participants, text chat, and drawing whiteboard.</p>
                </div>
                <div>
                  <label className="block text-left text-xs font-bold text-slate-500 mb-1.5 uppercase">Select Live Class Batch</label>
                  <select 
                    value={liveClassBatch}
                    onChange={(e) => setLiveClassBatch(e.target.value)}
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                  >
                    {batches.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => setIsLiveClass(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Video className="w-4.5 h-4.5" /> Start Classroom Session
                </button>
              </div>
            ) : (
              /* Inside Live Classroom Workspace */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 rounded-3xl p-6 text-white min-h-[580px]">
                
                {/* Left Area - Stream / Whiteboard */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  <div className="relative bg-slate-950 border border-slate-800 rounded-2xl flex-grow overflow-hidden flex items-center justify-center min-h-[350px]">
                    
                    {/* Blinking record label */}
                    {liveRecording && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse z-10">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <span>REC • {formatTime(liveRecordSeconds)}</span>
                      </div>
                    )}

                    {!liveWhiteboardActive ? (
                      /* Video stream placeholder */
                      <div className="text-center space-y-3 animate-fade-in">
                        <div className="w-20 h-20 bg-blue-600 border-4 border-blue-500 text-white rounded-full flex items-center justify-center font-black text-2xl mx-auto shadow-lg animate-pulse">
                          PS
                        </div>
                        <h4 className="text-sm font-black tracking-wide">Priya Sharma (You)</h4>
                        <p className="text-[10px] text-slate-500">Broadcasting HD audio & video stream to 18 students...</p>
                      </div>
                    ) : (
                      /* Interactive Whiteboard Canvas */
                      <div className="w-full h-full flex flex-col bg-white text-slate-800 p-4 animate-fade-in">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 shrink-0">
                          <h4 className="text-xs font-black text-slate-700 flex items-center gap-1"><BookOpen className="w-4 h-4 text-blue-500" /> Interactive Drawing Canvas</h4>
                          <div className="flex items-center space-x-2">
                            {/* Color selects */}
                            {['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#0f172a'].map(color => (
                              <button
                                key={color}
                                onClick={() => setWhiteboardColor(color)}
                                className={`w-5 h-5 rounded-full border border-slate-300 transition-transform ${
                                  whiteboardColor === color ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            <span className="h-4 w-px bg-slate-200 mx-1"></span>
                            <span className="text-[10px] font-bold text-slate-500 ml-2">Brush: {whiteboardBrushSize}px</span>
                            <input
                              type="range" min="2" max="20"
                              value={whiteboardBrushSize}
                              onChange={(e) => setWhiteboardBrushSize(parseInt(e.target.value))}
                              className="w-16 h-1 cursor-pointer accent-blue-500"
                            />
                            <span className="h-4 w-px bg-slate-200 mx-1"></span>
                            <button onClick={clearWhiteboard} className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold">
                              <Eraser className="w-3.5 h-3.5" /> Clear
                            </button>
                          </div>
                        </div>

                        {/* Drawing body */}
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={280}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl cursor-crosshair flex-grow mt-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="bg-slate-950 border border-slate-800 px-5 py-4 rounded-2xl flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setLiveMicMuted(!liveMicMuted)} 
                        className={`p-3 rounded-xl transition-all cursor-pointer ${liveMicMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                        title={liveMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                      >
                        {liveMicMuted ? <AlertCircle className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                      </button>
                      <button 
                        onClick={() => setLiveVideoMuted(!liveVideoMuted)} 
                        className={`p-3 rounded-xl transition-all cursor-pointer ${liveVideoMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                        title={liveVideoMuted ? 'Start Video' : 'Stop Video'}
                      >
                        <Video className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => setLiveScreenSharing(!liveScreenSharing)} 
                        className={`p-3 rounded-xl transition-all cursor-pointer ${liveScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                        title={liveScreenSharing ? 'Stop Sharing' : 'Share Desktop'}
                      >
                        <Tv className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => setLiveWhiteboardActive(!liveWhiteboardActive)} 
                        className={`p-3 rounded-xl transition-all cursor-pointer ${liveWhiteboardActive ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                        title="Toggle Blackboard"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={handleToggleRecording}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          liveRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${liveRecording ? 'bg-white' : 'bg-red-500'}`}></span>
                        <span>{liveRecording ? 'Recording' : 'Record Class'}</span>
                      </button>

                      <button 
                        onClick={() => { setIsLiveClass(false); setToastMessage('Live class session saved to portal.'); setShowToast(true); }}
                        className="bg-red-500 hover:bg-red-600 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow transition-colors cursor-pointer"
                      >
                        End Class
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Area - Participants & Chat */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
                  {/* Students grid */}
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 flex-grow overflow-y-auto max-h-56 scrollbar-thin">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Students Online (6)</h4>
                    <div className="space-y-2">
                      {students.slice(0, 6).map(s => (
                        <div key={s.id} className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                          <span className="font-bold">{s.name}</span>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                            <span>Camera Online</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat feed */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-[280px]">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Classroom Chat</h4>
                    <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 text-xs max-h-[170px] scrollbar-thin">
                      {liveChat.map(c => (
                        <div key={c.id}>
                          <span className="font-extrabold text-blue-400">{c.sender}: </span>
                          <span className="text-slate-300 font-semibold">{c.text}</span>
                        </div>
                      ))}
                    </div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!liveChatInput.trim()) return;
                        setLiveChat(prev => [
                          ...prev,
                          { id: prev.length + 1, sender: "You", text: liveChatInput, time: "Now" }
                        ]);
                        setLiveChatInput('');
                      }} 
                      className="flex gap-1.5 border-t border-slate-800 pt-2 mt-2"
                    >
                      <input 
                        type="text"
                        value={liveChatInput}
                        onChange={(e) => setLiveChatInput(e.target.value)}
                        placeholder="Write a message to classroom..."
                        className="flex-grow bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-semibold"
                      />
                      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
                    </form>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Demo Bookings tab */}
        {isDemo && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-base font-black text-slate-800">Pending Parent Trials</h3>
            <div className="space-y-4">
              {demoBookings.map(demo => (
                <div key={demo.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-800">{demo.studentName} ({demo.grade})</h4>
                      {demo.status === 'Accepted' ? (
                        <span className="bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-green-100">Accepted</span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-100">Awaiting Approval</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Subject: <span className="text-slate-700">{demo.subject}</span> | Slot Requested: <span className="text-slate-700">{demo.requestedSlot}</span></p>
                    <p className="text-xs text-slate-400 italic">"Parent notes: {demo.msg}"</p>
                  </div>

                  {demo.status === 'Pending' && (
                    <div className="flex items-center space-x-2 shrink-0">
                      <button 
                        onClick={() => handleAcceptDemo(demo.id)} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        Accept Booking
                      </button>
                      <button 
                        onClick={() => setDemoBookings(prev => prev.filter(d => d.id !== demo.id))} 
                        className="bg-white hover:bg-red-50 text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  // 5. Assignments & Grading
  const renderAssignmentsGrading = () => {
    const isTestEngine = subTabs.grading === 'test_engine';
    const isGradebook = subTabs.grading === 'gradebook';

    const handleCreateAssignment = (e) => {
      e.preventDefault();
      if (!newAssignName || !newAssignDueDate) return;
      const newAssign = {
        id: assignments.length + 1,
        name: newAssignName,
        batch: newAssignBatch,
        submissions: '0/' + (newAssignBatch === 'Mathematics Advanced' ? '50' : '30'),
        dueDate: newAssignDueDate
      };
      setAssignments(prev => [...prev, newAssign]);
      setNewAssignName('');
      setNewAssignDueDate('');
      setToastMessage('New homework sheet dispatched to batch!');
      setShowToast(true);
      triggerConfetti();
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assignments, Tests & Gradebook</h2>
            <p className="text-slate-500 text-xs mt-1">Review student worksheets, structure test quizzes, and generate official student transcript cards.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'assignments', label: 'Homework' },
              { id: 'test_engine', label: 'Test Builder' },
              { id: 'gradebook', label: 'Gradebook' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, grading: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.grading === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Homework Tab */}
        {!isTestEngine && !isGradebook && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left side form & submissions */}
            <div className="md:col-span-5 space-y-6">
              <form onSubmit={handleCreateAssignment} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-black text-slate-800">Dispatch Assignment</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Title</label>
                  <input 
                    type="text" required value={newAssignName}
                    onChange={(e) => setNewAssignName(e.target.value)}
                    placeholder="e.g. Vectors Part 1"
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Assign to Batch</label>
                  <select 
                    value={newAssignBatch}
                    onChange={(e) => setNewAssignBatch(e.target.value)}
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.title}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Due Date</label>
                  <input 
                    type="date" required value={newAssignDueDate}
                    onChange={(e) => setNewAssignDueDate(e.target.value)}
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold text-slate-700 cursor-pointer"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer">Publish Homework</button>
              </form>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-black text-slate-800">Pending Evaluation (1)</h3>
                {gradingSubmissions.filter(s => s.status === 'Pending').map(sub => (
                  <div key={sub.id} className="p-3 bg-amber-50/20 border border-amber-500/10 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-extrabold text-slate-800">{sub.studentName}</h4>
                      <p className="text-slate-400 mt-0.5">{sub.assignmentName}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedGradingSub(sub); setRubricAccuracy(80); setRubricClarity(80); setRubricTimeliness(90); }}
                      className="bg-amber-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer"
                    >
                      Grade Rubric
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side assignment submissions list or active grading view */}
            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              {!selectedGradingSub ? (
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-800">Homework Submissions Log</h3>
                  <div className="space-y-3">
                    {gradingSubmissions.map(sub => (
                      <div key={sub.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <h4 className="font-extrabold text-slate-700">{sub.studentName}</h4>
                          <p className="text-slate-400 mt-0.5">{sub.assignmentName} • {sub.file}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded font-black text-[9px] uppercase ${
                          sub.status === 'Graded' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>{sub.status === 'Graded' ? `Score: ${sub.finalScore}/100` : 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Rubric evaluation form */
                <form onSubmit={handleSubGradeSubmit} className="space-y-5 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div>
                      <h4 className="text-base font-black text-slate-800">Grading: {selectedGradingSub.studentName}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{selectedGradingSub.assignmentName}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedGradingSub(null)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>Mathematical Accuracy</span>
                        <span className="text-blue-500 font-black">{rubricAccuracy} / 100</span>
                      </div>
                      <input 
                        type="range" min="10" max="100" step="5"
                        value={rubricAccuracy}
                        onChange={(e) => setRubricAccuracy(parseInt(e.target.value))}
                        className="w-full cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>Logical Explanation Clarity</span>
                        <span className="text-blue-500 font-black">{rubricClarity} / 100</span>
                      </div>
                      <input 
                        type="range" min="10" max="100" step="5"
                        value={rubricClarity}
                        onChange={(e) => setRubricClarity(parseInt(e.target.value))}
                        className="w-full cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>Timely Submission</span>
                        <span className="text-blue-500 font-black">{rubricTimeliness} / 100</span>
                      </div>
                      <input 
                        type="range" min="10" max="100" step="5"
                        value={rubricTimeliness}
                        onChange={(e) => setRubricTimeliness(parseInt(e.target.value))}
                        className="w-full cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Teacher Remarks</label>
                      <input 
                        type="text"
                        value={rubricRemarks}
                        onChange={(e) => setRubricRemarks(e.target.value)}
                        placeholder="Write constructive advice..."
                        className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <Check className="w-4.5 h-4.5" /> Submit Grading Rubric
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {/* Test Builder Tab */}
        {isTestEngine && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Quiz Blueprint</h3>
              <form onSubmit={handleSaveTestPaper} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Quiz Name</label>
                  <input
                    type="text" required value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    placeholder="e.g. Calculus Integration Midterm"
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Target Batch</label>
                    <select 
                      value={newTestBatch}
                      onChange={(e) => setNewTestBatch(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      {batches.map(b => <option key={b.id} value={b.title}>{b.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Test Duration</label>
                    <select 
                      value={newTestDuration}
                      onChange={(e) => setNewTestDuration(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <option>30 Mins</option>
                      <option>60 Mins</option>
                      <option>90 Mins</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Scheduled Date</label>
                  <input
                    type="date" required value={newTestDate}
                    onChange={(e) => setNewTestDate(e.target.value)}
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold text-slate-700 cursor-pointer"
                  />
                </div>

                <div className="border-t border-slate-50 pt-3">
                  <h4 className="text-xs font-extrabold text-slate-800 mb-2">Build Questions ({quizQuestions.length})</h4>
                  <div className="space-y-3">
                    <input 
                      type="text"
                      value={currentQText}
                      onChange={(e) => setCurrentQText(e.target.value)}
                      placeholder="Enter question text..."
                      className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {currentQOptions.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          required={currentQText.length > 0}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...currentQOptions];
                            updated[i] = e.target.value;
                            setCurrentQOptions(updated);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Correct option:</span>
                      <select 
                        value={currentQCorrect}
                        onChange={(e) => setCurrentQCorrect(e.target.value)}
                        className="bg-slate-50 border border-slate-200 py-1 px-2 rounded font-bold cursor-pointer"
                      >
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                      </select>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAddQuizQuestion}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-lg cursor-pointer"
                    >
                      Add Question to Quiz
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer">Publish Test Paper</button>
              </form>
            </div>

            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Quiz Blueprint Questions</h3>
              <div className="divide-y divide-slate-50 max-h-[450px] overflow-y-auto pr-1">
                {quizQuestions.length > 0 ? (
                  quizQuestions.map(q => (
                    <div key={q.id} className="py-3 text-xs space-y-1.5">
                      <div className="font-extrabold text-slate-800">{q.id}. {q.question}</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-500">
                        {q.options.map((opt, i) => (
                          <div key={i} className="font-semibold">{String.fromCharCode(65 + i)}: {opt}</div>
                        ))}
                      </div>
                      <div className="text-[10px] text-blue-500 font-black">Answer: {q.correct}</div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs font-bold text-slate-400">Add questions using the builder on the left to see them listed here.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gradebook & Report Cards Tab */}
        {isGradebook && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-base font-black text-slate-800">Student Cumulative Gradebook</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Homework Avg</th>
                    <th className="py-3 px-4">Quiz 1</th>
                    <th className="py-3 px-4">Quiz 2</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Term GPA</th>
                    <th className="py-3 px-4 text-right">Report Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                  {gradebookRecords.map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-extrabold text-slate-800">{rec.studentName}</td>
                      <td className="py-3.5 px-4">{rec.homework}%</td>
                      <td className="py-3.5 px-4">{rec.test1}%</td>
                      <td className="py-3.5 px-4">{rec.test2}%</td>
                      <td className="py-3.5 px-4">{rec.project}%</td>
                      <td className="py-3.5 px-4 text-blue-600 font-black">{rec.finalGpa} / 10.0</td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => setSelectedReportStudent(rec)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          View Transcript
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Card Modal */}
        {selectedReportStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 p-6 relative animate-slide-up">
              <button onClick={() => setSelectedReportStudent(null)} className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"><X className="w-5 h-5" /></button>
              
              <div className="text-center space-y-1 mb-5 border-b border-slate-50 pb-4">
                <div className="text-xs font-black uppercase tracking-wider text-blue-500">Official Report Transcript</div>
                <h3 className="text-xl font-black text-slate-900">Cograd Pathshala</h3>
                <p className="text-[10px] text-slate-400">Academic Year 2026 • Mathematics Faculty</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400">Student Name:</span>
                    <h4 className="font-extrabold text-slate-800 mt-0.5">{selectedReportStudent.studentName}</h4>
                  </div>
                  <div>
                    <span className="text-slate-400">Roll Number:</span>
                    <h4 className="font-extrabold text-slate-800 mt-0.5">#{selectedReportStudent.roll}</h4>
                  </div>
                </div>

                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="py-2">Assessment Section</th>
                      <th className="py-2 text-right">Weighted Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                    <tr>
                      <td className="py-2">Homework Assignments</td>
                      <td className="py-2 text-right">{selectedReportStudent.homework}%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Unit Quiz 1</td>
                      <td className="py-2 text-right">{selectedReportStudent.test1}%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Unit Quiz 2</td>
                      <td className="py-2 text-right">{selectedReportStudent.test2}%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Course Projects</td>
                      <td className="py-2 text-right">{selectedReportStudent.project}%</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between items-center bg-blue-50/40 p-4 rounded-xl border border-blue-100 mt-2">
                  <span className="text-xs font-bold text-slate-600">Calculated Final GPA:</span>
                  <span className="text-base font-black text-blue-600">{selectedReportStudent.finalGpa} / 10.0</span>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-slate-400">Instructor Feedback Remarks:</span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 leading-normal italic text-slate-600 font-semibold">"Exhibits deep algebraic logic and participates productively in virtual sessions. Strong foundation in derivatives."</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => { alert("Downloading report PDF..."); setSelectedReportStudent(null); }}
                  className="flex-grow bg-blue-500 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download Certificate Report
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  // 6. Schedules & Attendance
  const renderSchedulesAttendance = () => {
    const isAttendance = subTabs.schedules === 'attendance';
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['09:00 AM - 10:30 AM', '11:00 AM - 12:30 PM', '02:00 PM - 03:30 PM', '04:00 PM - 05:30 PM'];

    const handleSlotClick = (day, slot) => {
      setScheduleSlotKey(`${day}-${slot}`);
      setShowScheduleModal(true);
    };

    const enrolledStudents = students.filter(s => s.batchId === selectedBatchId);
    const totalCount = enrolledStudents.length;
    const presentCount = enrolledStudents.filter(student => {
      const rec = attendanceRecords.find(r => r.id === student.id);
      return rec ? rec.present : true;
    }).length;
    const absentCount = totalCount - presentCount;
    const percentPresent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lectures Calendar & Attendance Sheet</h2>
            <p className="text-slate-500 text-xs mt-1">Review locked schedule sessions, arrange remedial classes, and log daily presence records.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'timetable', label: 'Weekly Timetable' },
              { id: 'attendance', label: 'Attendance Tracker' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, schedules: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.schedules === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Tab */}
        {!isAttendance && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
            <div className="min-w-[850px] grid grid-cols-7 gap-4">
              
              <div className="py-2"></div>
              {days.map(d => (
                <div key={d} className="text-center text-xs font-black text-slate-500 py-2 uppercase tracking-wider border-b border-slate-50">{d}</div>
              ))}

              {timeSlots.map(slot => (
                <Fragment key={slot}>
                  <div className="flex items-center text-[10px] font-black text-slate-400 pr-2 leading-tight">{slot}</div>
                  
                  {days.map(day => {
                    const key = `${day}-${slot}`;
                    const session = timetableSessions[key];
                    return (
                      <div 
                        key={day} 
                        onClick={() => handleSlotClick(day, slot)}
                        className={`min-h-[85px] border border-slate-100 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:bg-blue-50/5 hover:border-blue-300 ${
                          session ? 'bg-blue-50/20 border-blue-500/20 text-blue-700' : 'bg-slate-50/10'
                        }`}
                      >
                        {session ? (
                          <div className="h-full flex flex-col justify-between text-xs">
                            <div className="font-extrabold leading-snug truncate" title={session.title}>{session.title}</div>
                            <div className="text-[10px] font-semibold opacity-90 truncate">{session.batch}</div>
                            <span className="text-[8px] bg-blue-500 text-white font-black px-1.5 py-0.5 rounded w-max mt-1 uppercase tracking-wider">{session.type}</span>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[9px] text-slate-300 font-semibold italic">
                            + Book Slot
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}

            </div>
          </div>
        )}

        {/* Attendance Tracker Tab */}
        {isAttendance && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</div>
                <div className="text-xl font-black text-slate-800 flex items-baseline gap-1">
                  <span>{presentCount}</span>
                  <span className="text-xs font-bold text-slate-400">/ {totalCount} Enrolled</span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 bg-emerald-50/50 border border-emerald-100/40 px-3 py-2 rounded-xl text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <div>
                  <div className="font-black text-emerald-700">{presentCount} Present</div>
                </div>
              </div>
              <div className="flex items-center space-x-2.5 bg-red-50/50 border border-red-100/40 px-3 py-2 rounded-xl text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <div>
                  <div className="font-black text-red-700">{absentCount} Absent</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Rate</span>
                  <span className="text-slate-800 font-extrabold">{percentPresent}%</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentPresent}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Class Batch</label>
                <select 
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.title} ({b.badge})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Session Date</label>
                <input 
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3">
              {enrolledStudents.map(student => {
                const rec = attendanceRecords.find(r => r.id === student.id) || { present: true };
                const isPresent = rec.present;
                return (
                  <div key={student.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/20 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-800">{student.name}</span>
                    <button 
                      onClick={() => toggleAttendanceStatus(student.id)}
                      className={`text-xs font-black px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                        isPresent ? 'bg-emerald-500 text-white shadow-sm' : 'bg-red-500 text-white shadow-sm'
                      }`}
                    >
                      {isPresent ? 'Present' : 'Absent'}
                    </button>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={submitAttendanceSheet}
              disabled={submittingAttendance}
              className="w-full bg-blue-500 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {submittingAttendance ? 'Saving...' : 'Save Attendance Sheet'}
            </button>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full border border-slate-100 p-6 relative animate-slide-up">
              <button onClick={() => setShowScheduleModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"><X className="w-5 h-5" /></button>
              
              <h3 className="text-base font-black text-slate-800 mb-4">Book Timetable Session</h3>
              <div className="text-xs text-slate-400 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">Slot Key: {scheduleSlotKey}</div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Lecture Title</label>
                  <input
                    type="text" required value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                    placeholder="e.g. Differentiation Fundamentals"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Class Batch</label>
                  <select 
                    value={scheduleBatch}
                    onChange={(e) => setScheduleBatch(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {batches.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Session Type</label>
                  <select 
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option>Lecture</option>
                    <option>Doubt Session</option>
                    <option>Extra Class</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="flex-grow bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-blue-600 transition-all cursor-pointer">Save Session</button>
                  {timetableSessions[scheduleSlotKey] && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setTimetableSessions(prev => {
                          const updated = { ...prev };
                          delete updated[scheduleSlotKey];
                          return updated;
                        });
                        setShowScheduleModal(false);
                        setToastMessage('Session removed from timetable.');
                        setShowToast(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 rounded-xl transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  };

  // 7. Analytics & Earnings
  const renderAnalyticsEarnings = () => {
    const isEarnings = subTabs.analytics === 'earnings';

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Performance Analytics & Earnings Dashboard</h2>
            <p className="text-slate-500 text-xs mt-1">Audit student score progress metrics, track weekly revenue logs, and request payouts.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'performance', label: 'Performance Analytics' },
              { id: 'earnings', label: 'Earnings Dashboard' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, analytics: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.analytics === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Analytics Tab */}
        {!isEarnings && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h3 className="text-base font-black text-slate-800">Student Average Score Distribution</h3>
              
              {/* SVG Bar Chart */}
              <div className="relative h-60 w-full bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-end justify-around">
                {students.map(student => (
                  <div key={student.id} className="flex flex-col items-center group w-full">
                    <span className="text-[10px] font-bold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{student.avgGrade}%</span>
                    <div 
                      className="w-7 bg-blue-500 hover:bg-blue-600 rounded-t-lg transition-all duration-700 cursor-pointer shadow-sm"
                      style={{ height: `${student.avgGrade * 1.5}px` }}
                    />
                    <span className="text-[8px] font-black text-slate-400 mt-2 truncate w-12 text-center uppercase">{student.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Academic Alerts</h3>
              <div className="space-y-3">
                {students.filter(s => s.status === 'Needs Attention').map(s => (
                  <div key={s.id} className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-2 text-xs">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-slate-800">{s.name}</h4>
                      <p className="text-slate-500 mt-0.5">Average GPA is {s.avgGrade}% with {s.attendanceRate}% attendance.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Earnings Dashboard Tab */}
        {isEarnings && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Net Revenue</div>
                  <div className="text-xl font-black text-slate-800 mt-1">₹{earningsStats.totalEarned}</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Payout</div>
                  <div className="text-xl font-black text-slate-800 mt-1">₹{earningsStats.availablePayout}</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Invoices</div>
                  <div className="text-xl font-black text-slate-800 mt-1">₹{earningsStats.pendingInvoices}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Withdraw Console */}
              <div className="md:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-black text-slate-800">Withdrawal Operations</h3>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs text-slate-500 leading-relaxed font-semibold">
                  Select available balance to wire direct bank transfer payouts. Processing takes less than 5 minutes.
                </div>
                <button 
                  onClick={handleWithdrawFunds}
                  disabled={isProcessingPayout || earningsStats.availablePayout <= 0}
                  className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessingPayout ? (
                    <>
                      <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing... {payoutProgress}%</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Request Cash-out (₹{earningsStats.availablePayout})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Invoices Logs */}
              <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-black text-slate-800">Billing Log Transactions</h3>
                <div className="divide-y divide-slate-50">
                  {billingLogs.map(log => (
                    <div key={log.id} className="py-3.5 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-extrabold text-slate-700">{log.description}</h4>
                        <p className="text-slate-400 mt-0.5">Logged on {log.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-800 block">₹{log.amount}</span>
                        <span className="bg-green-50 text-green-700 font-bold text-[9px] px-2 py-0.5 rounded border border-green-100 uppercase tracking-wider">{log.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  };

  // 8. Communication & Doubts
  const renderCommunicationDoubts = () => {
    const isDoubts = subTabs.communication === 'doubt_solver';

    const handleCreateAnnouncement = (e) => {
      e.preventDefault();
      if (!newBTitle || !newBBody) return;
      const newB = {
        id: broadcasts.length + 1,
        title: newBTitle,
        batch: newBTarget,
        body: newBBody,
        date: 'Just now',
        views: 0
      };
      setBroadcasts(prev => [newB, ...prev]);
      setNewBTitle('');
      setNewBBody('');
      setToastMessage('Broadcast announcement published!');
      setShowToast(true);
      triggerConfetti();
    };

    const handleSendDoubtText = (id) => {
      if (!doubtReplyInput.trim()) return;
      setDoubts(prev => prev.map(d => d.id === id ? { ...d, isNew: false, reply: doubtReplyInput, type: 'text' } : d));
      setDoubtReplyInput('');
      setDoubtReplyId(null);
      setToastMessage('Response posted to doubt feed!');
      setShowToast(true);
      triggerConfetti();
    };

    const handleRecordVoiceNote = (id) => {
      setIsRecordingVoice(true);
      setVoiceRecordSeconds(3);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setDoubts(prev => prev.map(d => d.id === id ? { ...d, isNew: false, reply: 'Voice Note Attachment (0:03)', type: 'voice' } : d));
        setToastMessage('Voice note reply published!');
        setShowToast(true);
        triggerConfetti();
      }, 3000);
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Broadcasting & Doubt Solver Feed</h2>
            <p className="text-slate-500 text-xs mt-1">Publish alerts to batches, review incoming doubts, and post voice/text replies.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'announcements', label: 'Broadcasts' },
              { id: 'doubt_solver', label: 'Doubt Solver' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, communication: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.communication === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Broadcasts Tab */}
        {!isDoubts && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <form onSubmit={handleCreateAnnouncement} className="md:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Draft Announcement</h3>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Title</label>
                <input 
                  type="text" required value={newBTitle}
                  onChange={(e) => setNewBTitle(e.target.value)}
                  placeholder="e.g. Test Syllabus Updated"
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Target Cohort</label>
                <select 
                  value={newBTarget}
                  onChange={(e) => setNewBTarget(e.target.value)}
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
                >
                  <option>All Batches</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.title}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Announcement Body</label>
                <textarea 
                  required value={newBBody}
                  onChange={(e) => setNewBBody(e.target.value)}
                  rows="4"
                  placeholder="Write clear instructions for students..."
                  className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-semibold resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-600 transition-all cursor-pointer">Post Announcement</button>
            </form>

            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Announcements Log</h3>
              <div className="space-y-4">
                {broadcasts.map(b => (
                  <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{b.title}</h4>
                        <p className="text-slate-400 font-semibold mt-0.5">Cohort: {b.batch} • {b.date}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">{b.views} Views</span>
                    </div>
                    <p className="text-slate-600 leading-normal font-semibold">"{b.body}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Doubt Solver Tab */}
        {isDoubts && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
              {[
                { id: 'all', label: 'All Inquiries' },
                { id: 'pending', label: 'Pending' },
                { id: 'resolved', label: 'Resolved' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDoubtFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    doubtFilter === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {doubts
                .filter(d => {
                  if (doubtFilter === 'pending') return !d.reply;
                  if (doubtFilter === 'resolved') return d.reply;
                  return true;
                })
                .map(d => (
                  <div key={d.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <img src={d.avatar} alt="Student Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0" />
                      <div className="min-w-0 flex-grow">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-extrabold text-slate-800 text-sm">{d.student}</h4>
                          <span className="text-[10px] text-slate-400 font-bold">{d.date}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold mt-1">"{d.msg}"</p>
                      </div>
                    </div>

                    {d.reply && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start space-x-2.5 text-xs">
                        <CornerUpLeft className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-blue-600">You replied: </span>
                          <span className="text-slate-700 font-semibold">{d.reply}</span>
                        </div>
                      </div>
                    )}

                    {!d.reply && doubtReplyId !== d.id && (
                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={() => setDoubtReplyId(d.id)}
                          className="text-blue-500 hover:text-blue-700 font-extrabold text-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <CornerUpLeft className="w-4 h-4" /> <span>Solve Doubt</span>
                        </button>
                      </div>
                    )}

                    {doubtReplyId === d.id && (
                      <div className="space-y-3 pt-3 border-t border-slate-50">
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={doubtReplyInput}
                            onChange={(e) => setDoubtReplyInput(e.target.value)}
                            placeholder="Type academic explanation..."
                            className="flex-grow py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                          />
                          <button 
                            onClick={() => handleSendDoubtText(d.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-xl cursor-pointer shrink-0"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <button 
                            type="button"
                            onClick={() => handleRecordVoiceNote(d.id)}
                            disabled={isRecordingVoice}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                              isRecordingVoice ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isRecordingVoice ? `Recording voice... 0:0${voiceRecordSeconds}` : '🎙️ Record Voice Note'}
                          </button>
                          <button onClick={() => setDoubtReplyId(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  // 9. Public Profile & Reviews
  const renderPublicProfileReviews = () => {
    const isReviews = subTabs.profile === 'reviews';

    const handleSaveProfile = (e) => {
      e.preventDefault();
      setTeacherProfile(editProfileData);
      setIsEditingProfile(false);
      setToastMessage('Profile details synchronized!');
      setShowToast(true);
      triggerConfetti();
    };

    const handleReviewReply = (id) => {
      if (!reviewReplyInput.trim()) return;
      setReviewsList(prev => prev.map(rev => 
        rev.id === id ? { ...rev, reply: reviewReplyInput } : rev
      ));
      setReviewReplyInput('');
      setSelectedReviewReplyId(null);
      setToastMessage('Reply published to parent reviews feed!');
      setShowToast(true);
      triggerConfetti();
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pr-2">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Public Directory Profile & Ratings</h2>
            <p className="text-slate-500 text-xs mt-1">Refine your public tutor card bio, hourly rate details, and reply to parent review comments.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 w-max shadow-inner">
            {[
              { id: 'public_profile', label: 'Tutor Card Editor' },
              { id: 'reviews', label: 'Ratings & Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTabs(prev => ({ ...prev, profile: tab.id }))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTabs.profile === tab.id 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Public Profile Tab */}
        {!isReviews && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side preview */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center space-y-4">
                <div className="relative w-28 h-28 mx-auto">
                  <img src={teacherProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-blue-50 ring-4 ring-blue-500/10 shadow" />
                  <span className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800 leading-none">{teacherProfile.name}</h4>
                  <p className="text-xs text-slate-400 font-bold mt-2">Senior Math Faculty</p>
                </div>
                <div className="inline-flex items-center gap-1 bg-green-50 border border-green-100 text-green-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> Verified Partner
                </div>

                <div className="border-t border-slate-50 pt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <span className="block font-black text-slate-800">4.9 ★</span>
                    <span className="text-[10px] text-slate-400">Rating</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <span className="block font-black text-slate-800">{teacherProfile.experience}</span>
                    <span className="text-[10px] text-slate-400">Experience</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Credential checklist</h4>
                {teacherProfile.documents.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <h5 className="font-extrabold text-slate-700 truncate w-32">{doc.name}</h5>
                      <span className="text-[10px] text-slate-400">{doc.type}</span>
                    </div>
                    <span className="text-[10px] text-green-600 font-black flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side editor */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
              {!isEditingProfile ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-black text-slate-800">Tutor Card Specifications</h3>
                    <button 
                      onClick={() => { setEditProfileData({ ...teacherProfile }); setIsEditingProfile(true); }}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Specifications
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400">Qualifications:</span>
                      <h4 className="font-extrabold text-slate-700 mt-1">{teacherProfile.qualification}</h4>
                    </div>
                    <div>
                      <span className="text-slate-400">Teaching Subject Focus:</span>
                      <h4 className="font-extrabold text-slate-700 mt-1">{teacherProfile.primarySubject}</h4>
                    </div>
                    <div>
                      <span className="text-slate-400">Instruction Medium:</span>
                      <h4 className="font-extrabold text-slate-700 mt-1">{teacherProfile.medium}</h4>
                    </div>
                    <div>
                      <span className="text-slate-400">Tuition Rate:</span>
                      <h4 className="font-extrabold text-slate-700 mt-1">{teacherProfile.hourlyRate}</h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-slate-400">Professional Bio:</span>
                    <p className="text-xs leading-relaxed text-slate-600 font-semibold p-4 bg-slate-50 border border-slate-100 rounded-2xl">{teacherProfile.bio}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Full Name</label>
                      <input 
                        type="text" required value={editProfileData.name}
                        onChange={(e) => setEditProfileData(p => ({ ...p, name: e.target.value }))}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Qualifications</label>
                      <input 
                        type="text" required value={editProfileData.qualification}
                        onChange={(e) => setEditProfileData(p => ({ ...p, qualification: e.target.value }))}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Hourly Rate Fee</label>
                      <input 
                        type="text" required value={editProfileData.hourlyRate}
                        onChange={(e) => setEditProfileData(p => ({ ...p, hourlyRate: e.target.value }))}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Instruction Medium</label>
                      <input 
                        type="text" required value={editProfileData.medium}
                        onChange={(e) => setEditProfileData(p => ({ ...p, medium: e.target.value }))}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Professional Bio</label>
                    <textarea 
                      required rows="4" value={editProfileData.bio}
                      onChange={(e) => setEditProfileData(p => ({ ...p, bio: e.target.value }))}
                      className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-50 pt-4">
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer">Save Specifications</button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

        {/* Ratings & Reviews Tab */}
        {isReviews && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="text-base font-black text-slate-800">Reputation Overview</h3>
              <div className="text-center">
                <h4 className="text-3xl font-black text-blue-500">4.9 ★</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">Aggregate parent satisfaction score</p>
              </div>

              {/* Rating breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span>5 Star</span>
                  <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[95%]" />
                  </div>
                  <span className="font-bold text-slate-500">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>4 Star</span>
                  <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[5%]" />
                  </div>
                  <span className="font-bold text-slate-500">5%</span>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-4 space-y-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Reputation Badges</h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase px-2 py-1 rounded">Parent Favorite</span>
                  <span className="bg-purple-50 text-purple-600 border border-purple-100 text-[9px] font-black uppercase px-2 py-1 rounded">Streak Master</span>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase px-2 py-1 rounded">95%+ Attd.</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Reviews History Feedback</h3>
              <div className="space-y-4">
                {reviewsList.map(review => (
                  <div key={review.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-extrabold text-slate-700">{review.reviewer}</h4>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 font-semibold leading-normal">"{review.text}"</p>
                    
                    {review.reply && (
                      <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-start space-x-2">
                        <CornerUpLeft className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-blue-600">You replied: </span>
                          <span className="text-slate-600 font-semibold">{review.reply}</span>
                        </div>
                      </div>
                    )}

                    {!review.reply && selectedReviewReplyId !== review.id && (
                      <button 
                        onClick={() => setSelectedReviewReplyId(review.id)}
                        className="text-blue-500 hover:text-blue-700 font-extrabold text-[10px] flex items-center space-x-1 cursor-pointer"
                      >
                        <CornerUpLeft className="w-3 h-3" /> <span>Reply to review</span>
                      </button>
                    )}

                    {selectedReviewReplyId === review.id && (
                      <div className="flex gap-2 pt-2 border-t border-slate-100/50">
                        <input
                          type="text"
                          value={reviewReplyInput}
                          onChange={(e) => setReviewReplyInput(e.target.value)}
                          placeholder="Write feedback appreciation..."
                          className="flex-grow py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                        />
                        <button 
                          onClick={() => handleReviewReply(review.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 rounded-xl cursor-pointer"
                        >
                          Send
                        </button>
                        <button onClick={() => setSelectedReviewReplyId(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'Content & Resources': return renderContentResources();
      case 'AI Assistant': return renderAIAssistant();
      case 'Classroom & Batches': return renderClassroomBatches();
      case 'Assignments & Grading': return renderAssignmentsGrading();
      case 'Schedules & Attendance': return renderSchedulesAttendance();
      case 'Analytics & Earnings': return renderAnalyticsEarnings();
      case 'Communication & Doubts': return renderCommunicationDoubts();
      case 'Public Profile & Reviews': return renderPublicProfileReviews();
      case 'My Dashboard':
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative overflow-hidden">
      
      {/* Confetti Animation Layer */}
      {gradingConfetti.length > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {gradingConfetti.map(p => (
            <div
              key={p.id}
              className="confetti-particle animate-pulse"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: '8px',
                height: '8px',
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 shadow-sm">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand area */}
          <div className="p-6 border-b border-slate-50 flex items-center shrink-0">
            <div>
              <div className="text-2xl font-black tracking-tight logo-shimmer">Cograd Pathshala</div>
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-1">Teacher Hub</div>
            </div>
          </div>

          {/* Navigation Menu (Scrollable) */}
          <nav className="p-4 space-y-1 overflow-y-auto flex-grow scrollbar-thin">
            {[
              { name: 'My Dashboard', icon: LayoutDashboard },
              { name: 'Content & Resources', icon: BookOpen },
              { name: 'AI Assistant', icon: BrainCircuit },
              { name: 'Classroom & Batches', icon: Tv },
              { name: 'Assignments & Grading', icon: CheckSquare },
              { name: 'Schedules & Attendance', icon: Calendar },
              { name: 'Analytics & Earnings', icon: BarChart3 },
              { name: 'Communication & Doubts', icon: MessageSquare, badge: doubts.filter(d => d.isNew).length },
              { name: 'Public Profile & Reviews', icon: User }
            ].map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-300 cursor-pointer group relative active:scale-[0.98] ${
                    isActive 
                      ? 'bg-slate-100/55 border border-slate-200/20 text-slate-900 shadow-sm' 
                      : 'text-slate-500 border border-transparent hover:text-slate-900 hover:bg-slate-50/80'
                  }`}
                >
                  {/* Left Accent indicator line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full animate-fade-in" />
                  )}
                  
                  <div className="flex items-center space-x-3.5">
                    {/* Icon Container with glowing effect */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 scale-[1.03]' 
                        : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 group-hover:scale-[1.03]'
                    }`}>
                      <IconComp className={`w-4.5 h-4.5 transition-transform duration-300 ${
                        isActive ? 'animate-pulse' : 'group-hover:rotate-6'
                      }`} />
                    </div>
                    
                    <span className={`transition-colors duration-200 ${isActive ? 'font-extrabold text-slate-900' : 'font-medium'}`}>
                      {item.name}
                    </span>
                  </div>

                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-red-500 text-white shadow-sm">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Aligned Profile Section (Fixed bottom) */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 shrink-0 flex items-center justify-between">
            <button 
              onClick={() => { setActiveTab('Public Profile & Reviews'); setSubTabs(p => ({ ...p, profile: 'public_profile' })); }}
              className="flex items-center space-x-3 min-w-0 hover:opacity-80 transition-opacity text-left cursor-pointer group"
            >
              <img 
                src={teacherProfile.avatar} 
                alt={teacherProfile.name} 
                className="w-10 h-10 rounded-full border-2 object-cover shadow-sm flex-shrink-0 border-slate-200"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-slate-800 leading-none truncate group-hover:text-blue-600 transition-colors">{teacherProfile.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5 truncate">Math Faculty</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer group flex-shrink-0"
              title="Log Out Account"
            >
              <LogOut className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN HUB CONTENT AREA */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP HEADER BAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-20 shrink-0 sticky top-0 shadow-sm">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{greeting},</span> 
              <span className="color-blend-blue">{teacherProfile.name}</span>
            </h1>
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse hidden sm:inline" />
          </div>

          <div className="flex items-center space-x-6">
            {/* Search Input Box */}
            <div className="relative max-w-xs hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-60"
              />
            </div>

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
              >
                <Bell className="w-5 h-5 text-slate-500 group-hover:scale-105 transition-transform" />
                {unreadNotifications.some(n => n.isNew) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border border-white rounded-full animate-bounce"></span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-fade-in text-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Notifications</h3>
                    {unreadNotifications.some(n => n.isNew) && (
                      <button 
                        onClick={() => {
                          setUnreadNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
                          setToastMessage('All notifications read.');
                          setShowToast(true);
                        }}
                        className="text-[10px] font-black text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto pr-1">
                    {unreadNotifications.length > 0 ? (
                      unreadNotifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            setUnreadNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isNew: false } : n));
                            setShowNotificationDropdown(false);
                            setToastMessage(`Notification: "${notif.text}"`);
                            setShowToast(true);
                          }}
                          className="py-3 px-1.5 flex flex-col space-y-1 cursor-pointer transition-colors hover:bg-slate-50/80 rounded-lg text-left"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className={`text-[11px] leading-relaxed ${notif.isNew ? 'font-extrabold text-slate-800' : 'text-slate-500 font-medium'}`}>
                              {notif.text}
                            </span>
                            {notif.isNew && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{notif.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs font-bold text-slate-400">No notifications yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Badge Icon */}
            <div className="flex items-center space-x-2.5 border-l border-slate-100 pl-6">
              <button 
                onClick={() => { setActiveTab('Public Profile & Reviews'); setSubTabs(p => ({ ...p, profile: 'public_profile' })); }}
                className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 transition-all cursor-pointer"
              >
                <img src={teacherProfile.avatar} alt="User" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </header>

        {/* ACTIVE TAB CONTENT */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto space-y-8 scrollbar-thin">
          <div key={activeTab} className="tab-content-enter h-full w-full">
            {getActiveTabContent()}
          </div>
        </main>

      </div>

      {/* ALIVE FLOATING NOTIFICATION TOAST */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl space-x-3.5 border border-slate-800 max-w-sm">
          <AlertCircle className="w-5.5 h-5.5 text-indigo-400 flex-shrink-0" />
          <p className="text-xs font-semibold leading-relaxed pr-2">{toastMessage}</p>
          <button 
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;
