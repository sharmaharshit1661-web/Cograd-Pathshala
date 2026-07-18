import { useState, useEffect, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import TeacherOnboardingPortal from './TeacherOnboardingPortal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { api } from '../utils/api';
import { 
  LayoutDashboard, 
  BookOpen, 
  UploadCloud, 
  CheckSquare, 
  Clock, 
  Mail, 
  Search, 
  User, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Send, 
  CornerUpLeft, 
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Download,
  Check,
  TrendingUp,
  Edit3,
  ShieldCheck,
  DollarSign,
  FileSpreadsheet,
  Users,
  BrainCircuit,
  Map,
  Phone,
  MapPin,
  HelpCircle,
  Award,
  Lock,
  GraduationCap
} from 'lucide-react';

const InlineGoogleMap = ({ address, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!address) return null;

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2 py-1 rounded-lg transition-all cursor-pointer border border-blue-100"
      >
        <Map className="w-3 h-3" />
        <span>{isOpen ? 'Hide Map' : `View ${label || 'Location'} on Map`}</span>
      </button>
      
      {isOpen && (
        <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-1 animate-scale-up">
          <iframe
            title={`Google Map - ${address}`}
            width="100%"
            height="180"
            style={{ border: 0, borderRadius: '8px' }}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
};

const CONFETTI_COLORS = ['#3b82f6', '#7c3aed', '#ec4899', '#10b981', '#f59e0b'];

const QUALIFICATION_SUGGESTIONS = [
  "B.Ed", "B.Tech", "B.Sc", "B.A", "B.Com", "BCA", "BBA", "B.El.Ed", "B.P.Ed", "B.E", "B.Pharm",
  "M.Ed", "M.Tech", "M.Sc", "M.A", "M.Com", "MCA", "MBA", "M.E", "M.Phil",
  "Ph.D", "D.El.Ed", "D.Ed", "NTT", "CTET", "TET"
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Dashboard navigation states
  const [activeTab, setActiveTab] = useState('My Dashboard');
  const [teacherId, setTeacherId] = useState(null);
  const [subTabs, setSubTabs] = useState({
    content: 'content_manager', // content_manager, sharing, co_creation
    ai: 'lesson_plan', // lesson_plan, teaching_assistance
    classroom: 'batches', // batches, live_class, demo_bookings
    grading: 'assignments', // assignments, test_engine, gradebook
    schedules: 'timetable', // timetable, attendance
    analytics: 'earnings', // performance, earnings
    profile: 'public_profile', // public_profile, reviews
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // CoGrad Certification Program States
  const [certStatus, setCertStatus] = useState(null);
  const [certLectures, setCertLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [certLoading, setCertLoading] = useState(true);
  const [certActionLoading, setCertActionLoading] = useState(false);
  const [activeCertMonth, setActiveCertMonth] = useState(1);

  const fetchCertStatus = async () => {
    setCertLoading(true);
    try {
      const res = await api.get('/teachers/certification/status');
      setCertStatus(res);
      if (res.payment_status === 'paid') {
        const lecturesRes = await api.get('/teachers/certification/lectures');
        setCertLectures(lecturesRes.lectures || []);
      }
    } catch (err) {
      console.error('Error fetching certification status:', err);
    } finally {
      setCertLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'CoGrad Certification') {
      fetchCertStatus();
    }
  }, [activeTab]);

  const [supportForm, setSupportForm] = useState({ category: 'General Support', title: '', description: '' });
  const [supportSubmitting, setSupportSubmitting] = useState(false);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSupportSubmitting(true);
    try {
      await api.post('/support-tickets', {
        userId: teacherId || 'TEACHER_GUEST',
        userName: teacherProfile.name || 'Teacher User',
        userRole: 'Teacher',
        title: supportForm.title,
        description: supportForm.description,
        category: supportForm.category
      });
      setSupportForm({ category: 'General Support', title: '', description: '' });
      triggerToast('Support ticket submitted successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to submit support ticket.');
    } finally {
      setSupportSubmitting(false);
    }
  };

  // Notification center states
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  
  useEffect(() => {
    if (!localStorage.getItem('cograd_token')) return;
    const fetchNotifs = async () => {
      try {
        const dbNotifs = await api.get('/notifications/my-notifications');
        setUnreadNotifications(dbNotifs || []);
      } catch (e) {
        console.error('Failed to fetch user notifications:', e);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000); // Poll every 15 seconds for notifications
    return () => clearInterval(interval);
  }, []);

  // 1. Teacher Profile States
  const [teacherProfile, setTeacherProfile] = useState({
    id: '',
    name: 'Loading...',
    email: '',
    phone: '',
    experience: '',
    qualification: '',
    primarySubject: '',
    medium: '',
    travelRange: '',
    hourlyRate: '',
    city: '',
    locality: '',
    bio: '',
    avatar: '',
    verified: false,
    documents: [],
    certification: {
      payment_status: 'unpaid',
      completed_lectures: [],
      test_attempts: [],
      is_certified: false,
      certified_at: null
    }
  });

  const [editProfileData, setEditProfileData] = useState({ ...teacherProfile });
  const [showProfileQualDropdown, setShowProfileQualDropdown] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const filteredProfileQuals = editProfileData.qualification?.trim() === ""
    ? []
    : QUALIFICATION_SUGGESTIONS.filter(q =>
        q.toLowerCase().startsWith(editProfileData.qualification.toLowerCase()) ||
        q.toLowerCase().includes(editProfileData.qualification.toLowerCase())
      );

  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    const role = localStorage.getItem('cograd_role');
    const token = localStorage.getItem('cograd_token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (role && role !== 'teacher') {
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'parent') navigate('/parent/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Load real teacher profile and child states from backend
  useEffect(() => {
    const loadTeacherProfile = async () => {
      try {
        if (!localStorage.getItem('cograd_token')) return;
        const user = await api.get('/auth/me');
        if (user && user.role && user.role !== 'teacher') {
          localStorage.setItem('cograd_role', user.role);
          if (user.role === 'student') navigate('/student/dashboard');
          else if (user.role === 'parent') navigate('/parent/dashboard');
          else if (user.role === 'admin') navigate('/admin/dashboard');
          return;
        }
        if (user) {
          setTeacherId(user.id);
          const profile = {
            id: user.id,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            experience: user.experience || '',
            qualification: user.qualification || user.qualifications || '',
            primarySubject: user.primarySubject || (user.subjects_taught ? user.subjects_taught.join(', ') : ''),
            medium: user.medium || '',
            travelRange: user.travelRange || '',
            hourlyRate: user.hourly_rate || '',
            city: user.city || '',
            locality: user.locality || '',
            bio: user.bio || '',
            avatar: user.avatar || '',
            verified: user.verification_status === 'Verified',
            documents: user.documents || [],
            certification: user.certification || {
              payment_status: 'unpaid',
              completed_lectures: [],
              test_attempts: [],
              is_certified: false,
              certified_at: null
            }
          };
          setTeacherProfile(profile);
          setEditProfileData(profile);

          if (user.timetable && user.timetable.length > 0) {
            setTimetableSessions(user.timetable[0] || {});
          }
          if (user.study_materials && user.study_materials.length > 0) {
            setResources(user.study_materials);
          }
          if (user.daily_reports && user.daily_reports.length > 0) {
            setDailyReports(user.daily_reports);
          }
          if (user.content_schedule && user.content_schedule.length > 0) {
            setContentSchedule(user.content_schedule);
          }
          if (user.assignments && user.assignments.length > 0) {
            setAssignments(user.assignments);
          }
          if (user.submissions && user.submissions.length > 0) {
            setGradingSubmissions(user.submissions);
          }
          if (user.earnings_log && user.earnings_log.length > 0) {
            setBillingLogs(user.earnings_log);
          } else {
            const initialLogs = [
              { id: 'INV-7901', studentName: 'Rohan Sharma', date: '2026-07-02', amount: 3500, status: 'Paid', method: 'Razorpay' },
              { id: 'INV-7902', studentName: 'Aditya Verma', date: '2026-07-08', amount: 4000, status: 'Paid', method: 'Bank Transfer' },
              { id: 'INV-7903', studentName: 'Priya Patel', date: '2026-07-12', amount: 3000, status: 'Pending', method: 'Cash / Manual' }
            ];
            setBillingLogs(initialLogs);
            api.put(`/teachers/${user.id}`, { earnings_log: initialLogs }).catch(err => console.error("Error saving initial logs:", err));
          }
          if (user.reviews && user.reviews.length > 0) {
            setReviewsList(user.reviews);
          }
          if (user.tests && user.tests.length > 0) {
            setTests(user.tests);
          }
        }
      } catch (err) {
        console.error('Failed to load teacher profile:', err);
      }
    };
    loadTeacherProfile();
  }, []);

  const loadTeacherData = async (tId) => {
    const tid = tId || teacherId;
    if (!tid) return;
    try {
      const allAssignments = await api.get(`/assignments/teacher/${tid}`);
      const allStudents = await api.get('/students');

      const proposed = allAssignments.filter(a => a.status === 'proposed');
      const proposedWithDetails = proposed.map(a => {
        const student = allStudents.find(s => s.id === a.student_id);
        return {
          assignment: a,
          student: student
        };
      }).filter(x => x.student !== undefined);
      
      setPendingAssignments(proposedWithDetails);

      const activeAsgs = allAssignments.filter(a => a.status === 'active');
      const matchedStudents = activeAsgs.map(a => {
        const student = allStudents.find(s => s.id === a.student_id);
        return student;
      }).filter(s => s !== undefined).map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        batchId: 'class-9-10',
        attendanceRate: parseFloat(s.attendance) || 100,
        avgGrade: s.test_score ? (
          s.test_score.Mathematics !== undefined && s.test_score.Science !== undefined
            ? Math.round((s.test_score.Mathematics + s.test_score.Science) / 2)
            : s.test_score.Mathematics !== undefined ? s.test_score.Mathematics : (s.test_score.Science || 90)
        ) : 90,
        status: 'Active',
        homework_submissions: s.homework_submissions || [],
        study_hours_log: s.study_hours_log || []
      }));

      setStudents(matchedStudents);
      if (matchedStudents.length > 0) {
        setScheduleBatch(matchedStudents[0].name);
      }
    } catch (err) {
      console.error('Failed to load teacher data:', err);
    }
  };

  const handleUpdateAssignmentStatus = async (studentId, accept, subject) => {
    try {
      await api.put('/assignments/status', {
        studentId,
        teacherId,
        accept,
        subject
      });
      if (accept) {
        triggerToast('Availability confirmed and assigned to your roster!');
      } else {
        triggerToast('Flagged slot conflict to Cograd support.');
      }
      await loadTeacherData();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to update assignment status.');
    }
  };

  useEffect(() => {
    if (teacherId) {
      loadTeacherData(teacherId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId, activeTab]);





  // 2. Shared Data States
  const [batches, setBatches] = useState([]);



  // Dynamically seed batches from active students
  useEffect(() => {
    if (teacherId && students.length > 0) {
      setBatches(prev => {
        const next = [...prev];
        let updated = false;
        students.forEach(s => {
          const bId = s.batchId || 'class-9-10';
          if (!next.some(b => b.id === bId)) {
            next.push({
              id: bId,
              title: bId === 'class-9-10' ? 'Class 9-10 Mathematics' : bId === 'class-6-8' ? 'Class 6-8 English & Science' : 'Class 1-5 All Subjects',
              badge: bId === 'class-9-10' ? 'C9' : bId === 'class-6-8' ? 'C6' : 'C3',
              badgeColor: bId === 'class-9-10' ? 'bg-blue-500' : 'bg-purple-500',
              cap: '1:1',
              progress: 0
            });
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }
  }, [students, teacherId]);

  const [newBatchTitle, setNewBatchTitle] = useState('');
  const [newBatchCategory, setNewBatchCategory] = useState('Secondary');
  const [newBatchCap, setNewBatchCap] = useState(30);

  const [selectedBatchId, setSelectedBatchId] = useState('class-9-10');

  // 3. Attendance Tab State
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Compute attendance records dynamically from active students
  useEffect(() => {
    if (students.length > 0) {
      setAttendanceRecords(students.map(s => ({
        id: s.id,
        name: s.name,
        present: true
      })));
    } else {
      setAttendanceRecords([]);
    }
  }, [students]);

  const [submittingAttendance, setSubmittingAttendance] = useState(false);

  // 4. Content Management & Resource Sharing State
  const [resources, setResources] = useState([]);


  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [newMaterialDesc, setNewMaterialDesc] = useState('');
  const [newMaterialType, setNewMaterialType] = useState('PDF Document');
  const [newMaterialBatch, setNewMaterialBatch] = useState('Class 9-10 Mathematics');



  // 6. AI Lesson Plan Generator
  const [aiTopic, setAiTopic] = useState('Geometry: Triangles');
  const [aiGrade, setAiGrade] = useState('Class 9 (Secondary)');
  const [aiObjective, setAiObjective] = useState('Understand congruence criteria, apply SSS/SAS/ASA rules, and solve proof problems.');
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
  
  const [aiQuestionTopic, setAiQuestionTopic] = useState('Linear Equations');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiQuestionDifficulty, setAiQuestionDifficulty] = useState('Medium');
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  const [aiGeneratingQuestions, setAiGeneratingQuestions] = useState(false);



  // 9. Demo Class Bookings
  const [demoBookings, setDemoBookings] = useState([]);

  const fetchDemoBookings = async () => {
    if (!teacherId) return;
    try {
      const response = await api.get(`/demo-bookings/teacher/${teacherId}`);
      const mapped = response.map(b => ({
        id: b.id,
        studentName: b.studentName,
        grade: b.studentClass,
        subject: b.subjects.join(', '),
        requestedSlot: `${b.preferredDate} at ${b.preferredTime}`,
        msg: `${b.villageArea}${b.landmark ? ` (Near: ${b.landmark})` : ''} - Contact: +91 ${b.parentPhone}`,
        status: b.status === 'confirmed' ? 'Accepted' : (b.status === 'declined' ? 'Declined' : 'Pending'),
        villageArea: b.villageArea,
        landmark: b.landmark,
        district: b.district
      }));
      setDemoBookings(mapped);
    } catch (error) {
      console.error('Failed to fetch teacher demo bookings:', error.message);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchDemoBookings();
    }
  }, [teacherId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 10.5 Daily Learning Reports
  const [dailyReports, setDailyReports] = useState([]);

  useEffect(() => {
    if (teacherId) {
      const saved = localStorage.getItem(`cograd_daily_reports_${teacherId}`);
      setDailyReports(saved ? JSON.parse(saved) : []);
    }
  }, [teacherId]);

  const [dlrBatch, setDlrBatch] = useState('class-9-10');
  const [dlrTopics, setDlrTopics] = useState('');
  const [dlrHomework, setDlrHomework] = useState('');
  const [dlrEngagement, setDlrEngagement] = useState('Good');
  const [dlrNotes, setDlrNotes] = useState('');
  const [dlrSubmitting, setDlrSubmitting] = useState(false);

  // Persist daily reports to localStorage
  const saveDailyReports = (reports) => {
    if (teacherId) {
      localStorage.setItem(`cograd_daily_reports_${teacherId}`, JSON.stringify(reports));
    }
    setDailyReports(reports);
  };

  // 10.6 Content Pre-Schedule
  const [contentSchedule, setContentSchedule] = useState([]);

  useEffect(() => {
    if (teacherId) {
      const saved = localStorage.getItem(`cograd_content_schedule_${teacherId}`);
      setContentSchedule(saved ? JSON.parse(saved) : []);
    }
  }, [teacherId]);

  const [csDate, setCsDate] = useState('');
  const [csBatch, setCsBatch] = useState('class-9-10');
  const [csChapter, setCsChapter] = useState('');
  const [csObjectives, setCsObjectives] = useState('');
  const [csMaterials, setCsMaterials] = useState('');
  const [csDuration, setCsDuration] = useState(60);
  const [csSubmitting, setCsSubmitting] = useState(false);

  const saveContentSchedule = (schedule) => {
    if (teacherId) {
      localStorage.setItem(`cograd_content_schedule_${teacherId}`, JSON.stringify(schedule));
    }
    setContentSchedule(schedule);
  };

  const deleteScheduleItem = (id) => {
    const updated = contentSchedule.filter(s => s.id !== id);
    saveContentSchedule(updated);
    setToastMessage('Scheduled lesson removed.');
    setShowToast(true);
  };

  // 10. Assignments State
  const [assignments, setAssignments] = useState([]);
  const [doubtAnswers, setDoubtAnswers] = useState({});

  useEffect(() => {
    if (teacherId) {
      const saved = localStorage.getItem(`cograd_teacher_assignments_${teacherId}`);
      setAssignments(saved ? JSON.parse(saved) : []);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      localStorage.setItem(`cograd_teacher_assignments_${teacherId}`, JSON.stringify(assignments));
    }
  }, [assignments, teacherId]);

  const [newAssignName, setNewAssignName] = useState('');
  const [newAssignBatch, setNewAssignBatch] = useState('Class 9-10 Mathematics');
  const [newAssignDueDate, setNewAssignDueDate] = useState('');

  const [gradingSubmissions, setGradingSubmissions] = useState([]);

  useEffect(() => {
    if (teacherId) {
      const saved = localStorage.getItem(`cograd_teacher_submissions_${teacherId}`);
      setGradingSubmissions(saved ? JSON.parse(saved) : []);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      localStorage.setItem(`cograd_teacher_submissions_${teacherId}`, JSON.stringify(gradingSubmissions));
    }
  }, [gradingSubmissions, teacherId]);

  const [selectedGradingSub, setSelectedGradingSub] = useState(null);
  const [rubricAccuracy, setRubricAccuracy] = useState(85);
  const [rubricClarity, setRubricClarity] = useState(80);
  const [rubricTimeliness, setRubricTimeliness] = useState(90);
  const [rubricRemarks, setRubricRemarks] = useState('');

  // 11. Test & Grading Engine (Quiz builder)
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (teacherId) {
      const saved = localStorage.getItem(`cograd_teacher_tests_${teacherId}`);
      setTests(saved ? JSON.parse(saved) : []);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      localStorage.setItem(`cograd_teacher_tests_${teacherId}`, JSON.stringify(tests));
    }
  }, [tests, teacherId]);

  const [newTestName, setNewTestName] = useState('');
  const [newTestBatch, setNewTestBatch] = useState('Class 9-10 Mathematics');
  const [newTestDate, setNewTestDate] = useState('');
  const [newTestDuration, setNewTestDuration] = useState('60 Mins');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQText, setCurrentQText] = useState('');
  const [currentQOptions, setCurrentQOptions] = useState(['', '', '', '']);
  const [currentQCorrect, setCurrentQCorrect] = useState('A');

  // 12. Gradebook & Report Cards State
  const [gradebookRecords, setGradebookRecords] = useState([]);

  useEffect(() => {
    if (students.length > 0) {
      setGradebookRecords(students.map((s, idx) => ({
        studentName: s.name,
        roll: (101 + idx).toString(),
        homework: 90,
        test1: s.avgGrade || 90,
        test2: s.avgGrade || 90,
        project: 90,
        finalGpa: parseFloat(((s.avgGrade || 90) / 10).toFixed(1))
      })));
    } else {
      setGradebookRecords([]);
    }
  }, [students]);

  const [selectedReportStudent, setSelectedReportStudent] = useState(null);

  // 13. Smart Timetable & Scheduling
  const [timetableSessions, setTimetableSessions] = useState({});

  useEffect(() => {
    if (teacherId) {
      const saved = localStorage.getItem(`cograd_teacher_timetable_${teacherId}`);
      setTimetableSessions(saved ? JSON.parse(saved) : {});
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      localStorage.setItem(`cograd_teacher_timetable_${teacherId}`, JSON.stringify(timetableSessions));
    }
  }, [timetableSessions, teacherId]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleSlotKey, setScheduleSlotKey] = useState('');
  const [scheduleBatch, setScheduleBatch] = useState('General Class');
  const [scheduleType, setScheduleType] = useState('Lecture');
  const [scheduleTitle, setScheduleTitle] = useState('');

  // 15. Earnings & Profit States
  const [earningsStats, setEarningsStats] = useState({ totalEarned: 0, availablePayout: 0, pendingInvoices: 0 });
  const [billingLogs, setBillingLogs] = useState([]);

  // Compute dynamic earnings based on actual billing logs in state
  useEffect(() => {
    if (billingLogs && billingLogs.length > 0) {
      const totalEarned = billingLogs.filter(l => l.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const pendingInvoices = billingLogs.filter(l => l.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const totalWithdrawn = billingLogs.filter(l => l.status === 'Payout').reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const availablePayout = Math.max(0, Math.round(totalEarned * 0.4) - totalWithdrawn);
      setEarningsStats({ totalEarned, availablePayout, pendingInvoices });
    } else {
      setEarningsStats({ totalEarned: 0, availablePayout: 0, pendingInvoices: 0 });
    }
  }, [billingLogs]);

  const [payoutProgress, setPayoutProgress] = useState(0);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  // 16. Ratings & Reviews Feed State
  const [reviewsList, setReviewsList] = useState([]);



  const [selectedReviewReplyId, setSelectedReviewReplyId] = useState(null);
  const [reviewReplyInput, setReviewReplyInput] = useState('');

  // Interactive dashboard states
  const [gradingConfetti, setGradingConfetti] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Timetable Sync
  useEffect(() => {
    if (!teacherId || Object.keys(timetableSessions).length === 0) return;
    const syncTimetable = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { timetable: [timetableSessions] });
      } catch (e) {
        console.error('Failed to sync timetable:', e);
      }
    };
    syncTimetable();
  }, [timetableSessions, teacherId]);

  // 2. Study Materials Sync
  useEffect(() => {
    if (!teacherId || resources.length === 0) return;
    const syncResources = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { study_materials: resources });
      } catch (e) {
        console.error('Failed to sync study materials:', e);
      }
    };
    syncResources();
  }, [resources, teacherId]);

  // 3. Daily Reports Sync
  useEffect(() => {
    if (!teacherId || dailyReports.length === 0) return;
    const syncDailyReports = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { daily_reports: dailyReports });
      } catch (e) {
        console.error('Failed to sync daily reports:', e);
      }
    };
    syncDailyReports();
  }, [dailyReports, teacherId]);

  // 3.5 Content Schedule Sync
  useEffect(() => {
    if (!teacherId || contentSchedule.length === 0) return;
    const syncContentSchedule = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { content_schedule: contentSchedule });
      } catch (e) {
        console.error('Failed to sync content schedule:', e);
      }
    };
    syncContentSchedule();
  }, [contentSchedule, teacherId]);

  // 4. Assignments Sync
  useEffect(() => {
    if (!teacherId || assignments.length === 0) return;
    const syncAssignments = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { assignments: assignments });
      } catch (e) {
        console.error('Failed to sync assignments:', e);
      }
    };
    syncAssignments();
  }, [assignments, teacherId]);

  // 5. Submissions Sync
  useEffect(() => {
    if (!teacherId || gradingSubmissions.length === 0) return;
    const syncSubmissions = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { submissions: gradingSubmissions });
      } catch (e) {
        console.error('Failed to sync submissions:', e);
      }
    };
    syncSubmissions();
  }, [gradingSubmissions, teacherId]);

  // 6. Reviews Sync
  useEffect(() => {
    if (!teacherId || reviewsList.length === 0) return;
    const syncReviews = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { reviews: reviewsList });
      } catch (e) {
        console.error('Failed to sync reviews:', e);
      }
    };
    syncReviews();
  }, [reviewsList, teacherId]);

  // 7. Earnings Sync
  useEffect(() => {
    if (!teacherId || billingLogs.length === 0) return;
    const syncEarnings = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { earnings_log: billingLogs });
      } catch (e) {
        console.error('Failed to sync earnings:', e);
      }
    };
    syncEarnings();
  }, [billingLogs, teacherId]);

  // 8. Tests Sync
  useEffect(() => {
    if (!teacherId || tests.length === 0) return;
    const syncTests = async () => {
      try {
        await api.put(`/teachers/${teacherId}`, { tests: tests });
      } catch (e) {
        console.error('Failed to sync tests:', e);
      }
    };
    syncTests();
  }, [tests, teacherId]);

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    localStorage.removeItem('cograd_teacher_name');
    setToastMessage('Logged out successfully. Redirecting...');
    setShowToast(true);
    setTimeout(() => navigate('/'), 900);
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
          const newPayoutLog = {
            id: 'PAY-' + Math.floor(100000 + Math.random() * 900000),
            studentName: 'Payout Withdrawal',
            date: new Date().toISOString().split('T')[0],
            amount: earningsStats.availablePayout,
            status: 'Payout',
            method: 'Bank Transfer'
          };
          setBillingLogs(prev => [...prev, newPayoutLog]);
          setToastMessage(`Payout Successful! ₹${earningsStats.availablePayout.toLocaleString('en-IN')} transferred to your linked bank account.`);
          setShowToast(true);
          triggerConfetti();
        }
      }, 150);
    }
    return () => clearTimeout(withdrawTimer);
  }, [isProcessingPayout, payoutProgress, earningsStats.availablePayout]);

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
      setToastMessage('No available payout balance to withdraw.');
      setShowToast(true);
      return;
    }
    setIsProcessingPayout(true);
    setPayoutProgress(0);
  };





  // AI Parent Feedback generator simulation
  const handleGenerateFeedback = () => {
    const student = students.find(s => s.id === parseInt(aiFeedbackStudent)) || students[0];
    setAiGeneratingFeedback(true);
    setTimeout(() => {
      setAiGeneratingFeedback(false);
      setAiGeneratedFeedback(
        `Subject: Academic Performance Update - ${student.name}\n\nDear Parent,\n\nI am writing to share a brief update on ${student.name}'s progress in our Mathematics batch. Currently, ${student.name} maintains an average grade of ${student.avgGrade}% with a highly commendable attendance record of ${student.attendanceRate}%.\n\nIn our latest sessions covering Algebra and Trigonometry, they have shown ${student.avgGrade > 85 ? 'great analytical logic and quick participation.' : 'steady improvement, but need to practice calculus worksheets more regularly to strengthen fundamentals.'}\n\nWe will be conducting our term quizzes shortly. Feel free to reach out if you have any questions.\n\nWarm regards,\n${teacherProfile.name || 'Priya Sharma'}\nCograd Pathshala Mentor`
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



  // Device file upload handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    startFileUpload(file);
  };

  const startFileUpload = (file) => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    setCustomFileName(file.name);

    // Format file size
    let sizeStr = '0 B';
    if (file.size > 1024 * 1024) {
      sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    } else if (file.size > 1024) {
      sizeStr = (file.size / 1024).toFixed(1) + ' KB';
    } else {
      sizeStr = file.size + ' B';
    }

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          const newFile = {
            id: resources.length + 1,
            name: file.name,
            batch: newMaterialBatch,
            size: sizeStr,
            date: new Date().toISOString().split('T')[0],
            downloads: 0
          };
          setResources(prev => [newFile, ...prev]);
          setToastMessage('New study notes successfully cataloged!');
          setShowToast(true);
          // Reset file input value
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
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

  const submitAttendanceSheet = async () => {
    setSubmittingAttendance(true);
    try {
      let activeTeacherId = teacherId;
      if (!activeTeacherId) {
        const user = await api.get('/auth/me');
        if (user && user.id) {
          activeTeacherId = user.id;
          setTeacherId(user.id);
        }
      }

      if (!activeTeacherId) {
        throw new Error('Teacher session not found. Please log in again.');
      }

      const records = attendanceRecords.map(rec => ({
        studentId: rec.id,
        present: !!rec.present
      }));

      await api.post('/attendance', {
        teacherId: activeTeacherId,
        date: attendanceDate,
        records
      });

      setToastMessage('Attendance saved and synced to database successfully!');
      setShowToast(true);
      triggerConfetti();

      await loadTeacherData(activeTeacherId);
    } catch (err) {
      alert(err.message || 'Failed to submit attendance sheet.');
    } finally {
      setSubmittingAttendance(false);
    }
  };

  // ----------------------------------------------------
  // SUB-PAGES RENDERING
  // ----------------------------------------------------

  const renderDashboard = () => {
    // Filter active student list
    const displayStudents = students.slice(0, 4);

    return (
      <div className="space-y-10 animate-fade-in text-left">
        
        {/* Header Block with Hello & Verification Status (Priority 4) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glow-card p-8">
          <div>
            <h2 className="text-xl font-black text-slate-800">Hello, {teacherProfile.name || 'Mentor'} 👋</h2>
            <p className="text-xs text-slate-500 mt-1">Here is your home tutoring overview for today.</p>
          </div>
          <div className="flex items-center gap-2">
            {teacherProfile.certification?.is_certified && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                CoGrad Certified
              </span>
            )}
            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
              teacherProfile.verified 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {teacherProfile.verified && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>}
              {teacherProfile.verified ? 'Verified Mentor' : 'Verification Pending'}
            </span>
            {teacherProfile.primarySubject && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl border border-blue-100">
                {teacherProfile.primarySubject}
              </span>
            )}
          </div>
        </div>

        {/* Row 1: Active Roster (Priority 1) & Pending Confirmation Requests (Priority 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Assigned Students (Priority 1) */}
          <div className={`${pendingAssignments.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'} glow-card p-8 space-y-6`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-800">My Assigned Students</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Active home tuitions roster</p>
              </div>
              <button 
                onClick={() => setActiveTab('My Students')} 
                className="text-xs font-bold text-blue-600 hover:underline border-0 bg-transparent cursor-pointer"
              >
                View Roster ({students.length})
              </button>
            </div>

            <div className={`grid grid-cols-1 ${pendingAssignments.length > 0 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-6`}>
              {displayStudents.map(student => (
                <div key={student.id} className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center font-extrabold text-blue-600 text-xs uppercase">
                      {student.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{student.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">{student.batchId === 'class-9-10' ? 'Class 9-10' : student.batchId === 'class-6-8' ? 'Class 6-8' : 'Class 1-5'}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-100 text-slate-500">
                      Grade: {student.avgGrade}%
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                      student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pending Assignments (Priority 2) */}
          {pendingAssignments.length > 0 && (
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-750 text-white rounded-3xl p-8 shadow-lg shadow-blue-600/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">📢</span>
                    <h3 className="text-xs font-black uppercase tracking-wider">New Allotment Request</h3>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-lg">Confirm Fit</span>
                </div>
                
                <div className="space-y-4">
                  {pendingAssignments.map(({ assignment, student }) => {
                    const scores = student.test_score || { Mathematics: 0, Science: 0 };
                    return (
                       <div key={assignment.id} className="p-3.5 bg-white/10 rounded-2xl border border-white/5 space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-black">{student.name}</h4>
                            <span className="text-[8px] bg-indigo-500/35 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                              {assignment.subject}
                            </span>
                          </div>
                          <p className="text-[9px] text-white/80 mt-0.5">{student.standard} | Needs: {student.subjects.join(', ')}</p>
                          <div className="flex gap-3 mt-2">
                            <span className="text-[8px] font-extrabold bg-white/20 px-2 py-0.5 rounded-md">Math: {scores.mathMarksText || `${scores.Mathematics}%`}</span>
                            <span className="text-[8px] font-extrabold bg-white/20 px-2 py-0.5 rounded-md">Science: {scores.scienceMarksText || `${scores.Science}%`}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateAssignmentStatus(student.id, false, assignment.subject)}
                            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-xl shadow-sm transition-all cursor-pointer border-0"
                          >
                            Flag Conflict
                          </button>
                          <button
                            onClick={() => handleUpdateAssignmentStatus(student.id, true, assignment.subject)}
                            className="flex-1 py-2 bg-white hover:bg-slate-50 text-indigo-900 font-extrabold text-[10px] rounded-xl shadow-md transition-all cursor-pointer border-0"
                          >
                            Confirm Availability
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Schedule & Availability Settings (Priority 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-7 glow-card p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-800">Today's Schedule</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">3 upcoming sessions today</p>
              </div>
              <button 
                onClick={() => setActiveTab('Schedule & Attendance')} 
                className="text-xs font-bold text-blue-600 hover:underline border-0 bg-transparent cursor-pointer"
              >
                Full Timetable
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { time: '09:00 AM - 10:30 AM', title: 'Class 9 Math (Triangles)', type: 'Completed' },
                { time: '11:00 AM - 12:00 PM', title: 'Class 7 Science (Home visit)', type: 'Ongoing' },
                { time: '02:00 PM - 03:30 PM', title: 'Grade 10 Geometry', type: 'Upcoming' }
              ].map((sc, i) => (
                <div key={i} className={`p-3 rounded-2xl border flex flex-col justify-between h-24 text-left ${
                  sc.type === 'Ongoing'
                    ? 'border-blue-500 bg-blue-50/20'
                    : sc.type === 'Completed'
                      ? 'border-slate-100 bg-slate-50/30 opacity-70'
                      : 'border-slate-150 bg-white'
                }`}>
                  <div>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase block">{sc.time}</span>
                    <h4 className="text-xs font-black text-slate-700 mt-1 line-clamp-2 leading-tight">{sc.title}</h4>
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                      sc.type === 'Ongoing'
                        ? 'bg-blue-600 text-white animate-pulse'
                        : sc.type === 'Completed'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                    }`}>{sc.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Settings Quick-View */}
          <div className="lg:col-span-5 glow-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-black text-slate-800">Availability & Slots</h3>
                <span className="text-[9px] text-slate-400 font-bold">Manage tuition capacity</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">Capacity Status</span>
                  <span className="text-xs font-black text-slate-700 mt-0.5">{students.length} / 5 Students Assigned</span>
                </div>
                <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(students.length / 5) * 100}%` }} />
                </div>
              </div>
            </div>
            <button 
              onClick={() => { setActiveTab('Schedule & Attendance'); setSubTabs(p => ({ ...p, schedules: 'availabilities' })); }}
              className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs transition-colors"
            >
              Edit Weekly Availability Slots
            </button>
          </div>
        </div>

      </div>
    );
  };

  // 2. Content & Resources
  const renderContentResources = () => {
    const isSharing = false;
    const isCoCreation = false;

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Content Repository</h2>
            <p className="text-slate-500 text-xs mt-1">Upload worksheets and study material files for your home tuition students.</p>
          </div>
        </div>

        {/* Content Manager Tab */}
        {!isSharing && !isCoCreation && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Upload Course Material</h3>
              <div 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) startFileUpload(file);
                }}
                className={`border-2 border-dashed p-8 text-center cursor-pointer rounded-2xl hover:bg-blue-50/5 hover:border-blue-500 transition-all ${
                  isUploading ? 'border-blue-300 bg-blue-50/10' : 'border-slate-200'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.zip,.docx,.doc,.txt,.ppt,.pptx,.png,.jpg,.jpeg"
                />
                <UploadCloud className={`w-12 h-12 text-blue-500 mx-auto mb-3 ${isUploading ? 'animate-bounce' : ''}`} />
                <h4 className="text-sm font-bold text-slate-800">Drag & drop files here</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isUploading ? `Uploading ${customFileName} (${uploadProgress}%)` : 'Click to select or browse files (PDF, ZIP, DOCX)'}
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
                {resources.map(mat => (
                  <div key={mat.id} className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className="w-10 h-10 bg-red-50 text-red-500 border border-red-100 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0">PDF</div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-800 truncate">{mat.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{mat.batch} • {mat.size} • {mat.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button onClick={() => { setToastMessage(`Downloading ${mat.name}...`); setShowToast(true); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"><Download className="w-4 h-4" /></button>
                      <button onClick={() => setResources(prev => prev.filter(m => m.id !== mat.id))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}



      </div>
    );
  };

  // 3. AI Assistant
  // eslint-disable-next-line no-unused-vars
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
                  placeholder="e.g. Class 9 (Secondary — Maths)"
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
                    <option>All Classes (1–12)</option>
                    <option>Primary (Class 1–5)</option>
                    <option>Middle (Class 6–8)</option>
                    <option>Secondary (Class 9–10)</option>
                    <option>Senior Secondary (Class 11–12)</option>
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
                      <button onClick={() => { setToastMessage('Downloading lesson outline...'); setShowToast(true); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer" title="Download"><Download className="w-4 h-4" /></button>
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
    const isLive = false;
    const isDemo = subTabs.classroom === 'demo_bookings';
    const isDLR = subTabs.classroom === 'daily_reports';
    const isSchedule = subTabs.classroom === 'content_schedule';
    const isDoubtDesk = subTabs.classroom === 'doubts_desk';

    const handleCreateBatch = (e) => {
      e.preventDefault();
      if (!newBatchTitle) return;
      const newB = {
        id: newBatchTitle.toLowerCase().replace(/\s+/g, '-'),
        title: newBatchTitle,
        badge: newBatchCategory,
        badgeColor: newBatchCategory === 'Secondary' ? 'bg-blue-500' : newBatchCategory === 'Senior' ? 'bg-indigo-500' : newBatchCategory === 'Middle' ? 'bg-purple-500' : 'bg-emerald-500',
        cap: `0/${newBatchCap}`,
        progress: 0
      };
      setBatches(prev => [...prev, newB]);
      setNewBatchTitle('');
      setToastMessage('New batch set up successfully!');
      setShowToast(true);
    };

    const handleAcceptDemo = async (id) => {
      try {
        await api.put(`/demo-bookings/${id}/status`, { status: 'confirmed' });
        setToastMessage('Demo booking accepted and added to timetable!');
        setShowToast(true);
        triggerConfetti();
        await fetchDemoBookings();
      } catch (error) {
        alert('Failed to accept booking: ' + error.message);
      }
    };

    const handleDeclineDemo = async (id) => {
      try {
        await api.put(`/demo-bookings/${id}/status`, { status: 'declined' });
        setToastMessage('Demo booking declined.');
        setShowToast(true);
        await fetchDemoBookings();
      } catch (error) {
        alert('Failed to decline booking: ' + error.message);
      }
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Students</h2>
            <p className="text-slate-500 text-xs mt-1">Manage home tuition students, demo bookings, schedules, and daily reports for parents.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 max-w-full overflow-x-auto scrollbar-none shadow-inner gap-1 shrink-0">
            {[
              { id: 'batches', label: 'My Students', icon: Users },
              { id: 'demo_bookings', label: 'Demo Bookings', icon: Clock },
              { id: 'content_schedule', label: 'Schedule', icon: Calendar },
              { id: 'daily_reports', label: 'Daily Reports', icon: FileSpreadsheet },
              { id: 'doubts_desk', label: 'Doubts Desk', icon: HelpCircle }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSubTabs(prev => ({ ...prev, classroom: tab.id }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    subTabs.classroom === tab.id 
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* My Students tab (Direct Students list) */}
        {!isLive && !isDemo && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 text-left">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>Assigned Students</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Avg Grade</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400 font-bold italic">
                        No assigned students found on your roster.
                      </td>
                    </tr>
                  ) : (
                    students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-extrabold text-slate-850">{s.name}</td>
                        <td className="py-4 px-4 text-slate-500 font-bold">{s.email}</td>
                        <td className="py-4 px-4 text-slate-500 font-bold">{s.phone ? `+91 ${s.phone}` : 'N/A'}</td>
                        <td className="py-4 px-4">{s.attendanceRate}%</td>
                        <td className="py-4 px-4 font-extrabold text-slate-850">{s.avgGrade}%</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            s.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>{s.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                      {demo.status === 'Accepted' && (
                        <span className="bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-green-100">Accepted</span>
                      )}
                      {demo.status === 'Pending' && (
                        <span className="bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-100">Awaiting Approval</span>
                      )}
                      {demo.status === 'Declined' && (
                        <span className="bg-red-50 text-red-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-red-100">Declined</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Subject: <span className="text-slate-700">{demo.subject}</span> | Slot Requested: <span className="text-slate-700">{demo.requestedSlot}</span></p>
                    <p className="text-xs text-slate-400 italic">"Parent notes: {demo.msg}"</p>
                    <InlineGoogleMap address={`${demo.villageArea}, ${demo.landmark ? demo.landmark + ', ' : ''}${demo.district}`} label="Trial Location" />
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
                        onClick={() => handleDeclineDemo(demo.id)} 
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

        {/* Daily Learning Reports tab */}
        {isDLR && (
          <div className="space-y-6">
            {/* Submit New Report Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-800">Submit Today's Learning Report</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Parents will see this report in their dashboard within seconds. Be thorough and honest.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!dlrTopics.trim()) return;
                  setDlrSubmitting(true);
                  setTimeout(() => {
                    const batchObj = batches.find(b => b.id === dlrBatch);
                    const newReport = {
                      id: Date.now(),
                      date: new Date().toISOString().split('T')[0],
                      batch: batchObj?.title || dlrBatch,
                      batchId: dlrBatch,
                      topicsCovered: dlrTopics,
                      homeworkAssigned: dlrHomework,
                      engagement: dlrEngagement,
                      notes: dlrNotes,
                      submittedAt: new Date().toISOString(),
                      teacherName: teacherProfile.name,
                      subject: teacherProfile.primarySubject
                    };
                    const updated = [newReport, ...dailyReports];
                    saveDailyReports(updated);
                    setDlrTopics('');
                    setDlrHomework('');
                    setDlrNotes('');
                    setDlrEngagement('Good');
                    setDlrSubmitting(false);
                    setToastMessage('Daily learning report submitted! Parents can now see it.');
                    setShowToast(true);
                    triggerConfetti();
                  }, 1200);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Batch / Class</label>
                    <select
                      value={dlrBatch}
                      onChange={(e) => setDlrBatch(e.target.value)}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                    >
                      {batches.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Student Engagement</label>
                    <select
                      value={dlrEngagement}
                      onChange={(e) => setDlrEngagement(e.target.value)}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                    >
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Topics Covered Today <span className="text-rose-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={dlrTopics}
                    onChange={(e) => setDlrTopics(e.target.value)}
                    placeholder="E.g. Chapter 5: Limits — Taught 3 types of indeterminate forms. Solved 5 worked examples on L'Hôpital's rule..."
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-semibold text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Homework / Practice Assigned</label>
                  <input
                    type="text"
                    value={dlrHomework}
                    onChange={(e) => setDlrHomework(e.target.value)}
                    placeholder="E.g. Worksheet 5.3 (Q1–Q8), Practice integrations sheet"
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-semibold text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Special Notes for Parents (optional)</label>
                  <textarea
                    rows={2}
                    value={dlrNotes}
                    onChange={(e) => setDlrNotes(e.target.value)}
                    placeholder="E.g. Rahul Varma needs extra practice on integration by parts before the next session..."
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-semibold text-slate-700 resize-none focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={dlrSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  {dlrSubmitting ? 'Submitting report...' : 'Submit & Notify Parents'}
                </button>
              </form>
            </div>

            {/* Recent Submitted Reports */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">Recent Submitted Reports</h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">{dailyReports.length} reports</span>
              </div>
              {dailyReports.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <p className="empty-state-title">No Reports Yet</p>
                  <p className="empty-state-desc">Submit your first daily learning report above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dailyReports.slice(0, 5).map(report => {
                    const engEmoji = report.engagement === 'Excellent' ? '🌟' : report.engagement === 'Good' ? '✅' : report.engagement === 'Average' ? '⚠️' : '❌';
                    return (
                      <div key={report.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">{report.date}</span>
                            <span className="text-[10px] font-bold text-slate-500">{report.batch}</span>
                          </div>
                          <span className="text-xs font-black">{engEmoji} {report.engagement}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide mb-0.5">Topics Covered</p>
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed">{report.topicsCovered}</p>
                        </div>
                        {report.homeworkAssigned && (
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide mb-0.5">Homework Assigned</p>
                            <p className="text-xs text-slate-600 font-semibold">{report.homeworkAssigned}</p>
                          </div>
                        )}
                        {report.notes && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wide mb-0.5">📌 Parent Note</p>
                            <p className="text-xs text-amber-800 font-semibold italic">{report.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* CONTENT PRE-SCHEDULE TAB                          */}
        {/* ================================================= */}
        {isSchedule && (
          <div className="space-y-6">

            {/* Schedule New Lesson Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-base">📅</span>
                  Schedule Upcoming Lesson
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1 ml-10">Plan what you'll teach before the session. Parents will see this in their dashboard.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!csChapter.trim() || !csDate) return;
                  setCsSubmitting(true);
                  setTimeout(() => {
                    const batchObj = batches.find(b => b.id === csBatch);
                    const newItem = {
                      id: Date.now(),
                      date: csDate,
                      batch: batchObj?.title || csBatch,
                      batchId: csBatch,
                      chapter: csChapter,
                      objectives: csObjectives,
                      materials: csMaterials,
                      duration: Number(csDuration),
                      status: 'Upcoming',
                      createdAt: new Date().toISOString(),
                      teacherName: teacherProfile.name
                    };
                    const sorted = [newItem, ...contentSchedule].sort((a, b) => new Date(a.date) - new Date(b.date));
                    saveContentSchedule(sorted);
                    setCsChapter('');
                    setCsObjectives('');
                    setCsMaterials('');
                    setCsDate('');
                    setCsDuration(60);
                    setCsSubmitting(false);
                    setToastMessage('📅 Lesson scheduled! Parents can now see the upcoming topic.');
                    setShowToast(true);
                    triggerConfetti();
                  }, 900);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Session Date <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={csDate}
                      onChange={(e) => setCsDate(e.target.value)}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Batch / Class</label>
                    <select
                      value={csBatch}
                      onChange={(e) => setCsBatch(e.target.value)}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                    >
                      {batches.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Duration (minutes)</label>
                    <input
                      type="number"
                      min={30}
                      max={180}
                      step={15}
                      value={csDuration}
                      onChange={(e) => setCsDuration(e.target.value)}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 focus:outline-none text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Chapter / Topic <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={csChapter}
                    onChange={(e) => setCsChapter(e.target.value)}
                    placeholder="E.g. Chapter 9: Differential Equations — Variable Separable Method"
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Learning Objectives</label>
                  <textarea
                    rows={2}
                    value={csObjectives}
                    onChange={(e) => setCsObjectives(e.target.value)}
                    placeholder="E.g. Students will identify DEs by order, solve 3 types of variable-separable problems, apply to real-world examples..."
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-semibold text-slate-700 resize-none focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Materials / Resources Needed</label>
                  <input
                    type="text"
                    value={csMaterials}
                    onChange={(e) => setCsMaterials(e.target.value)}
                    placeholder="E.g. Textbook Ch.9, DEs Practice Worksheet, Graph paper"
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-semibold text-slate-700 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={csSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-3 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-70"
                >
                  <Calendar className="w-4 h-4" />
                  {csSubmitting ? 'Scheduling...' : 'Save to Upcoming Schedule'}
                </button>
              </form>
            </div>

            {/* Upcoming Lessons Timeline */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">Upcoming Lesson Plan</h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">{contentSchedule.length} sessions planned</span>
              </div>

              {contentSchedule.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><Calendar className="w-5 h-5" /></div>
                  <p className="empty-state-title">No Lessons Scheduled</p>
                  <p className="empty-state-desc">Use the form above to plan your first session.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contentSchedule.map((item, idx) => {
                    const sessionDate = new Date(item.date + 'T00:00:00');
                    const todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    const isPast = sessionDate < todayDate;
                    const isToday = sessionDate.toDateString() === todayDate.toDateString();
                    const daysUntil = Math.round((sessionDate - todayDate) / (1000 * 60 * 60 * 24));

                    return (
                      <div key={item.id || idx} className={`relative p-4 rounded-2xl border flex gap-4 transition-all group ${
                        isToday ? 'bg-indigo-50/80 border-indigo-200 shadow-sm' :
                        isPast ? 'bg-slate-50/50 border-slate-100 opacity-60' :
                        'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm'
                      }`}>
                        {/* Date column */}
                        <div className={`shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-black ${
                          isToday ? 'bg-indigo-600 border-indigo-700 text-white' :
                          isPast ? 'bg-slate-100 border-slate-200 text-slate-400' :
                          'bg-indigo-50 border-indigo-100 text-indigo-700'
                        }`}>
                          <span className="text-[10px] font-extrabold uppercase">{sessionDate.toLocaleDateString('en-IN', { month: 'short' })}</span>
                          <span className="text-xl leading-none">{sessionDate.getDate()}</span>
                          <span className="text-[9px] font-bold">{sessionDate.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-black text-slate-800 leading-snug">{item.chapter}</p>
                              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{item.batch} &bull; {item.duration} min</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isToday && <span className="text-[9px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-full animate-pulse">TODAY</span>}
                              {!isPast && !isToday && daysUntil <= 3 && <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">in {daysUntil}d</span>}
                              {isPast && <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Done</span>}
                              <button
                                onClick={() => deleteScheduleItem(item.id)}
                                className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                                title="Remove scheduled lesson"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {item.objectives && (
                            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                              <span className="font-black text-slate-600">Objectives: </span>{item.objectives}
                            </p>
                          )}

                          {item.materials && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">📚 {item.materials}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {isDoubtDesk && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-800">Student Doubts Desk</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Answer questions and clarify concepts raised by your matched students in real-time.
                </p>
              </div>

              {(() => {
                const allStudentDoubts = [];
                students.forEach(student => {
                  if (student.teacher_doubts && Array.isArray(student.teacher_doubts)) {
                    student.teacher_doubts.forEach(doubt => {
                      if (doubt.teacherName === teacherProfile.name) {
                        allStudentDoubts.push({
                          ...doubt,
                          studentId: student.id,
                          studentName: student.name
                        });
                      }
                    });
                  }
                });

                allStudentDoubts.sort((a, b) => new Date(b.askedAt) - new Date(a.askedAt));

                if (allStudentDoubts.length === 0) {
                  return (
                    <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100/50 space-y-2">
                      <div className="text-3xl">❓</div>
                      <p className="text-xs font-bold text-slate-400">
                        No student doubts yet — doubts from your students will appear here.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {allStudentDoubts.map((doubt) => {
                      const isPending = doubt.status !== 'Resolved';
                      return (
                        <div key={doubt.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-2 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                                {doubt.studentName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">
                                Asked: {new Date(doubt.askedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${
                                isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {doubt.status}
                              </span>
                            </div>
                            <p className="text-xs font-black text-slate-800 leading-relaxed">
                              Question: "{doubt.question}"
                            </p>
                            {!isPending && (
                              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                <p className="text-[9px] font-black text-emerald-700 uppercase tracking-wide">Your Solution</p>
                                <p className="text-xs font-semibold text-slate-700 mt-1">"{doubt.answer}"</p>
                              </div>
                            )}
                          </div>

                          {isPending && (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const ansText = doubtAnswers[doubt.id];
                                if (!ansText || !ansText.trim()) return;
                                
                                try {
                                  // Find the matched student object in our state
                                  const studentMatch = students.find(s => s.id === doubt.studentId);
                                  if (!studentMatch) return;
                                  const originalStudent = studentMatch.originalStudent;
                                  
                                  const updatedDoubts = originalStudent.teacher_doubts.map(d => {
                                    if (d.id === doubt.id) {
                                      return {
                                        ...d,
                                        status: 'Resolved',
                                        answer: ansText.trim(),
                                        resolvedAt: new Date().toISOString()
                                      };
                                    }
                                    return d;
                                  });

                                  await api.put(`/students/${doubt.studentId}`, {
                                    teacher_doubts: updatedDoubts
                                  });

                                  triggerToast('Solution sent successfully to student dashboard!');
                                  setDoubtAnswers(prev => {
                                    const copy = { ...prev };
                                    delete copy[doubt.id];
                                    return copy;
                                  });
                                  await loadTeacherData(teacherId);
                                } catch (err) {
                                  alert(err.message || 'Failed to submit doubt solution.');
                                }
                              }}
                              className="sm:w-64 flex flex-col gap-2 shrink-0 justify-end"
                            >
                              <textarea
                                required
                                value={doubtAnswers[doubt.id] || ''}
                                onChange={(e) => setDoubtAnswers(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                                placeholder="Type your solution/answer here..."
                                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none min-h-[60px]"
                              />
                              <button
                                type="submit"
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-xl shadow-md transition-all cursor-pointer border-0"
                              >
                                Send Solution
                              </button>
                            </form>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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
                    placeholder="e.g. Class 9 Triangles Unit Test"
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
          <div className="modal-overlay">
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
                  onClick={() => { setToastMessage('Downloading report PDF...'); setShowToast(true); setSelectedReportStudent(null); }}
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

    const enrolledStudents = students;
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

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Session Date</label>
              <input 
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-sm focus:outline-none font-bold text-slate-700 cursor-pointer"
              />
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
          <div className="modal-overlay">
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
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Select Student</label>
                  <select 
                    value={scheduleBatch}
                    onChange={(e) => setScheduleBatch(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {students.length === 0 ? (
                      <option value="General Class">General Class (No Students)</option>
                    ) : (
                      students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                    )}
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
  // eslint-disable-next-line no-unused-vars
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
              
              {/* Recharts Interactive Bar Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={students.map(s => ({ name: s.name.split(' ')[0], score: s.avgGrade, fullName: s.name }))} margin={{ top: 12, right: 12, left: -16, bottom: 0 }} barCategoryGap="20%">
                    <defs>
                      <linearGradient id="scoreGradientGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="scoreGradientAmber" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="scoreGradientRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#f87171" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f020" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(99,102,241,0.05)', radius: 8 }}
                      contentStyle={{
                        background: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}
                      labelStyle={{ color: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      itemStyle={{ color: '#a5b4fc', fontSize: 12, fontWeight: 800 }}
                      formatter={(value, name, props) => [`${value}%`, props.payload.fullName]}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={40} animationDuration={1000} animationEasing="ease-out">
                      {students.map((s, idx) => (
                        <Cell key={idx} fill={s.avgGrade >= 70 ? 'url(#scoreGradientGreen)' : s.avgGrade >= 50 ? 'url(#scoreGradientAmber)' : 'url(#scoreGradientRed)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
                     <div key={log.id} className="py-3.5 flex justify-between items-center text-xs border-b border-slate-50 last:border-b-0">
                       <div>
                         <h4 className="font-extrabold text-slate-700">
                           {log.status === 'Payout' ? 'Payout Withdrawal' : `Tuition Fee - ${log.studentName || 'Student'}`}
                         </h4>
                         <p className="text-[10px] text-slate-400 mt-0.5">Logged on {log.date} {log.method ? `via ${log.method}` : ''}</p>
                       </div>
                       <div className="text-right shrink-0">
                         <span className="font-black text-slate-800 block">₹{log.amount}</span>
                         <span className={`font-bold text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                           log.status === 'Paid'
                             ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                             : log.status === 'Pending'
                             ? 'bg-amber-50 text-amber-700 border-amber-100'
                             : 'bg-indigo-50 text-indigo-750 border-indigo-150 font-extrabold'
                         }`}>
                           {log.status}
                         </span>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

            </div>

            {/* Earnings Trend Area Chart */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-800">Monthly Earnings Trend</h3>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={(() => {
                      const monthMap = {};
                      billingLogs.filter(l => l.status === 'Paid').forEach(log => {
                        const month = log.date ? log.date.substring(0, 7) : 'Unknown';
                        monthMap[month] = (monthMap[month] || 0) + (log.amount || 0);
                      });
                      const months = Object.keys(monthMap).sort();
                      if (months.length === 0) {
                        return [{ month: 'Jan', amount: 0 }, { month: 'Feb', amount: 0 }, { month: 'Mar', amount: 0 }];
                      }
                      let cumulative = 0;
                      return months.map(m => {
                        cumulative += monthMap[m];
                        const label = new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short' });
                        return { month: label, amount: monthMap[m], cumulative };
                      });
                    })()}
                    margin={{ top: 12, right: 12, left: -8, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f020" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}
                      labelStyle={{ color: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      itemStyle={{ fontSize: 12, fontWeight: 800 }}
                      formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Earned']}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#earningsGradient)"
                      dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

      </div>
    );
  };

  // 9. Public Profile & Reviews
  const renderPublicProfileReviews = () => {
    const isReviews = subTabs.profile === 'reviews';

    const handleSaveProfile = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          name: editProfileData.name,
          qualification: editProfileData.qualification,
          hourly_rate: editProfileData.hourlyRate,
          medium: editProfileData.medium,
          bio: editProfileData.bio,
          city: editProfileData.city,
          locality: editProfileData.locality,
          travelRange: editProfileData.travelRange
        };
        const updated = await api.put(`/teachers/${teacherId}`, payload);
        if (updated) {
          setTeacherProfile(prev => ({
            ...prev,
            name: updated.name || prev.name,
            qualification: updated.qualification || prev.qualification,
            hourlyRate: updated.hourly_rate || prev.hourlyRate,
            medium: updated.medium || prev.medium,
            bio: updated.bio || prev.bio,
            city: updated.city || prev.city,
            locality: updated.locality || prev.locality,
            travelRange: updated.travelRange || prev.travelRange
          }));
          setIsEditingProfile(false);
          setToastMessage('Profile details synchronized with database!');
          setShowToast(true);
          triggerConfetti();
        }
      } catch (err) {
        console.error('Failed to save profile:', err);
        setToastMessage(err.message || 'Failed to sync updates to database');
        setShowToast(true);
      }
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
                    <div>
                      <span className="text-slate-400">City &amp; Area / Locality:</span>
                      <h4 className="font-extrabold text-slate-700 mt-1">{teacherProfile.locality || 'N/A'}, {teacherProfile.city || 'N/A'}</h4>
                    </div>
                    <div>
                      <span className="text-slate-400">Travel Radius Range:</span>
                      <h4 className="font-extrabold text-slate-700 mt-1">{teacherProfile.travelRange || '5 km radius'}</h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-slate-400">Professional Bio:</span>
                    <p className="text-xs leading-relaxed text-slate-600 font-semibold p-4 bg-slate-50 border border-slate-100 rounded-2xl">{teacherProfile.bio}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="relative">
                        <input 
                          type="text" required value={editProfileData.qualification}
                          onChange={(e) => setEditProfileData(p => ({ ...p, qualification: e.target.value }))}
                          onFocus={() => setShowProfileQualDropdown(true)}
                          onBlur={() => setTimeout(() => setShowProfileQualDropdown(false), 200)}
                          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                        />
                        {showProfileQualDropdown && filteredProfileQuals.length > 0 && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                            {filteredProfileQuals.map((q) => (
                              <button
                                key={q}
                                type="button"
                                onMouseDown={() => {
                                  setEditProfileData(p => ({ ...p, qualification: q }));
                                  setShowProfileQualDropdown(false);
                                }}
                                className="w-full px-4 py-2 text-xs text-left hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border-none cursor-pointer flex items-center gap-2"
                              >
                                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{q}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">City</label>
                      <select 
                        required value={editProfileData.city || ''}
                        onChange={(e) => setEditProfileData(p => ({ ...p, city: e.target.value }))}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="" disabled>Select City</option>
                        <option value="Meerut">Meerut</option>
                        <option value="Allahabad">Allahabad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Area / Locality</label>
                      <input 
                        type="text" required value={editProfileData.locality || ''}
                        onChange={(e) => setEditProfileData(p => ({ ...p, locality: e.target.value }))}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                        placeholder="e.g. Shastri Nagar, Civil Lines"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Travel Radius Range</label>
                      <select 
                        required value={editProfileData.travelRange || '5 km radius'}
                        onChange={(e) => setEditProfileData(p => ({ ...p, travelRange: e.target.value }))}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="3 km radius">3 km radius</option>
                        <option value="5 km radius">5 km radius</option>
                        <option value="10 km radius">10 km radius</option>
                        <option value="15 km radius">15 km radius</option>
                      </select>
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

  const renderHelpSupport = () => {
    return (
      <div className="space-y-6 text-left">
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6 rounded-3xl border border-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Help & Support Desk</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Submit query directly to CoGrad Admin Team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  placeholder="E.g. Class scheduling issue"
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
    );
  };

  const FRONTEND_CERTIFICATION_QUESTIONS = [
    { id: 1, question: 'What is the primary focus of student-centric pedagogy?', options: ['Teacher lectures', 'Student active participation', 'Textbook memorization', 'Strict discipline'] },
    { id: 2, question: 'According to Piaget, which stage involves abstract thinking?', options: ['Sensorimotor', 'Preoperational', 'Concrete operational', 'Formal operational'] },
    { id: 3, question: 'A well-structured lesson plan should always begin with?', options: ['Homework review', 'Learning objectives', 'Attendance check', 'Random questions'] },
    { id: 4, question: 'Which communication technique helps build rapport with shy students?', options: ['Loud instructions', 'Active listening', 'Ignoring them', 'Public questioning'] },
    { id: 5, question: 'What is the best strategy for managing classroom disruptions?', options: ['Shouting at students', 'Preventive planning and clear rules', 'Ignoring all behavior', 'Punishing immediately'] },
    { id: 6, question: 'Inclusive education means?', options: ['Teaching only gifted students', 'Excluding weak students', 'Accommodating all learning needs', 'Using one method for everyone'] },
    { id: 7, question: 'Formative assessment is conducted?', options: ['Only at year-end', 'During the learning process', 'Before admission', 'Never'] },
    { id: 8, question: 'Which EdTech tool is most useful for interactive home tutoring?', options: ['Fax machine', 'Digital whiteboard', 'Typewriter', 'Landline phone'] },
    { id: 9, question: 'How often should parent-teacher communication happen ideally?', options: ['Never', 'Once a year', 'Regularly throughout the term', 'Only during emergencies'] },
    { id: 10, question: 'Intrinsic motivation refers to?', options: ['External rewards', 'Punishment fear', 'Internal desire to learn', 'Parental pressure'] },
    { id: 11, question: 'Professional ethics for a tutor includes?', options: ['Sharing student data publicly', 'Maintaining confidentiality', 'Favoritism', 'Skipping sessions'] },
    { id: 12, question: 'Building a teaching brand involves?', options: ['Hiding your qualifications', 'Collecting reviews and showcasing results', 'Avoiding parents', 'Never updating your profile'] },
    { id: 13, question: 'What is Bloom\'s Taxonomy used for?', options: ['Grading students', 'Classifying learning objectives', 'Scheduling classes', 'Hiring teachers'] },
    { id: 14, question: 'The Zone of Proximal Development (ZPD) was proposed by?', options: ['Piaget', 'Vygotsky', 'Montessori', 'Dewey'] },
    { id: 15, question: 'Which is NOT a characteristic of effective feedback?', options: ['Specific', 'Timely', 'Vague and generic', 'Constructive'] },
    { id: 16, question: 'Differentiated instruction means?', options: ['Teaching the same way to all', 'Adapting teaching to individual needs', 'Only using lectures', 'Ignoring student differences'] },
    { id: 17, question: 'What is the ideal student-teacher ratio for home tutoring?', options: ['1:50', '1:1 to 1:5', '1:100', '1:30'] },
    { id: 18, question: 'Summative assessment examples include?', options: ['Quick class polls', 'Final exams and term papers', 'Entry tickets', 'Think-pair-share'] },
    { id: 19, question: 'Active learning strategies include?', options: ['Only lecturing', 'Group discussions and problem-solving', 'Silent reading only', 'Copying from the board'] },
    { id: 20, question: 'A growth mindset in students is encouraged by?', options: ['Praising effort over talent', 'Punishing mistakes', 'Comparing students', 'Fixed grading'] },
  ];

  const handleCertPay = async () => {
    setCertActionLoading(true);
    try {
      const res = await api.post('/teachers/certification/pay');
      triggerToast('Payment of ₹499 successful! Welcome to the CoGrad Certification program.');
      // Refresh local profile
      const updatedProfile = await api.get('/auth/me');
      setTeacherProfile(prev => ({ ...prev, certification: updatedProfile.certification }));
      await fetchCertStatus();
    } catch (err) {
      triggerToast(err.message || 'Payment failed.');
    } finally {
      setCertActionLoading(false);
    }
  };

  const handleCompleteLecture = async (lectureId) => {
    try {
      await api.post('/teachers/certification/complete-lecture', { lectureId });
      triggerToast('Lecture marked as completed!');
      await fetchCertStatus();
    } catch (err) {
      triggerToast(err.message || 'Failed to complete lecture.');
    }
  };

  const handleSubmitTest = async () => {
    // Validate that all questions are answered
    const unanswered = FRONTEND_CERTIFICATION_QUESTIONS.filter(q => testAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      triggerToast(`Please answer all questions before submitting. (${unanswered.length} left)`);
      return;
    }

    setCertActionLoading(true);
    try {
      const res = await api.post('/teachers/certification/submit-test', { answers: testAnswers });
      setTestResult(res);
      setIsTakingTest(false);
      if (res.passed) {
        triggerToast('Congratulations! You passed the CoGrad Certification Exam!');
        const updatedProfile = await api.get('/auth/me');
        setTeacherProfile(prev => ({ ...prev, certification: updatedProfile.certification }));
      } else {
        triggerToast(`You scored ${res.score}%. Unfortunately, you did not pass. The passing score is 60%. Please try again!`);
      }
      await fetchCertStatus();
    } catch (err) {
      triggerToast(err.message || 'Failed to submit test.');
    } finally {
      setCertActionLoading(false);
    }
  };

  const renderCertification = () => {
    if (certLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-xs font-semibold text-slate-400">Loading course curriculum...</span>
        </div>
      );
    }

    const cert = certStatus || { payment_status: 'unpaid', completed_lectures: [], test_attempts: [], is_certified: false };
    const isPaid = cert.payment_status === 'paid';
    const completedCount = cert.completed_lectures?.length || 0;
    const isCurriculumFinished = completedCount >= cert.total_lectures;
    const isCertified = cert.is_certified;

    // LOCKED PAYWALL VIEW
    if (!isPaid) {
      return (
        <div className="max-w-4xl mx-auto space-y-10 text-left animate-fade-in">
          <div className="glow-card p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase px-4 py-2 rounded-bl-3xl border-l border-b border-blue-500/20">
              CoGrad Academy
            </div>
            <div className="flex-1 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl border border-blue-100">
                PRO EDUCATOR CERTIFICATION
              </span>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">
                Unlock the CoGrad Certified Badge
              </h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Elevate your professional profile, earn parent trust, and unlock premium home tutoring opportunities. Complete our curated 2-3 months training program and clear the certification exam to showcase your skills.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span>12 Pedagogy & Management Lectures</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span>Interactive 100-mark Certification Exam</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span>Gold Badge on CoGrad Parents Roster</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span>Premium Conversion (Up to 35% higher)</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between items-center text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Program Price</span>
                <p className="text-3xl font-black text-slate-800 mt-1">₹499</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">One-time registration fee</p>
              </div>
              <button
                onClick={handleCertPay}
                disabled={certActionLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                {certActionLoading ? 'Unlocking...' : 'Unlock Now'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // TAKING TEST VIEW
    if (isTakingTest) {
      return (
        <div className="max-w-4xl mx-auto space-y-8 text-left animate-fade-in">
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-800">CoGrad Certification Exam</h2>
              <p className="text-xs text-slate-500 mt-0.5">20 Pedagogy & Methodology Questions • 5 Marks Each</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to exit the exam? Your progress will be lost.')) {
                  setIsTakingTest(false);
                }
              }}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer bg-white"
            >
              Exit Exam
            </button>
          </div>

          <div className="space-y-6 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            {FRONTEND_CERTIFICATION_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="p-5 bg-slate-50/50 border border-slate-100/50 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-slate-800 leading-relaxed">
                  {idx + 1}. {q.question}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        testAnswers[q.id] === optIdx
                          ? 'bg-blue-50/80 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-200/50 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={testAnswers[q.id] === optIdx}
                        onChange={() => setTestAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSubmitTest}
              disabled={certActionLoading}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer border-0"
            >
              {certActionLoading ? 'Submitting Answers...' : 'Submit Certification Exam'}
            </button>
          </div>
        </div>
      );
    }

    // CERTIFIED SUCCESS VIEW
    if (isCertified) {
      return (
        <div className="max-w-3xl mx-auto space-y-10 text-center animate-fade-in">
          {/* Confetti container or certificate card */}
          <div className="glow-card p-10 flex flex-col items-center space-y-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
            
            <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center animate-bounce shadow-md">
              <Award className="w-10 h-10 text-amber-500 fill-amber-500/20" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100">
                COGRAD ACADEMY CERTIFIED
              </span>
              <h2 className="text-2xl font-black text-slate-800">Congratulations, {teacherProfile.name}!</h2>
              <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
                You have successfully unlocked the learning curriculum, completed all training components, and cleared the general exam.
              </p>
            </div>

            {/* Certificate visual card */}
            <div className="w-full max-w-lg bg-slate-50 border-2 border-dashed border-amber-500/30 rounded-3xl p-8 relative space-y-6 shadow-inner text-left">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CERTIFICATE NO: CG-CERT-{teacherProfile.id?.slice(-6).toUpperCase() || 'MEMBER'}</span>
                <span className="text-[9px] font-black text-amber-600 uppercase bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">PASSED ✓</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-800">CoGrad Professional Tutoring Certification</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  This certifies that <strong className="text-slate-800">{teacherProfile.name}</strong> has demonstrated expert competency in child pedagogy, classroom management, and lesson planning.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span>Issued: {cert.certified_at ? new Date(cert.certified_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                <span className="font-bold text-slate-700">CoGrad Admin Panel</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActiveTab('My Dashboard');
                  triggerToast('Your badge is now live on your profile.');
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer border-0"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    // LEARNING CURRICULUM VIEW (Paid, not yet completed)
    const activeLectureDetails = certLectures.find(l => l.id === selectedLecture);

    return (
      <div className="max-w-5xl mx-auto space-y-8 text-left animate-fade-in">
        
        {/* Progress Tracker Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 space-y-2">
            <h2 className="text-base font-black text-slate-800">Professional Certification Course</h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / cert.total_lectures) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-black text-slate-700">{completedCount}/{cert.total_lectures} Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isCurriculumFinished ? (
              <button
                onClick={() => {
                  setTestAnswers({});
                  setIsTakingTest(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer border-0 flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Take Certification Exam
              </button>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-50 border border-slate-150 text-slate-400 px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-not-allowed">
                <Lock className="w-3.5 h-3.5" />
                Exam Unlocks at 12/12
              </span>
            )}
          </div>
        </div>

        {/* Video Lecture Player Panel */}
        {activeLectureDetails && (
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white space-y-6 animate-scale-up border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">LECTURE {activeLectureDetails.id} • MONTH {activeLectureDetails.month}</span>
                <h3 className="text-base font-black mt-1">{activeLectureDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLecture(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Mockup Screen */}
            <div className="aspect-video w-full max-w-2xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10"></div>
              
              <div className="z-20 self-end w-full space-y-3">
                {/* Control bar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/20 transition-all">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden relative cursor-pointer">
                    <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">14:02 / {activeLectureDetails.duration}</span>
                </div>
              </div>

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">CoGrad Lecture Series</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-400 font-semibold max-w-md">{activeLectureDetails.description}</p>
              {!activeLectureDetails.completed && (
                <button
                  onClick={() => {
                    handleCompleteLecture(activeLectureDetails.id);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer border-0 shrink-0"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        )}

        {/* Curriculum Selector Tabs */}
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-slate-100 pb-2">
            {[1, 2, 3].map(month => (
              <button
                key={month}
                onClick={() => setActiveCertMonth(month)}
                className={`px-4 py-2 text-xs font-black tracking-wide border-0 bg-transparent transition-all cursor-pointer ${
                  activeCertMonth === month
                    ? 'text-blue-600 border-b-2 border-blue-500 font-black'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Month {month} Lectures
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certLectures
              .filter(l => l.month === activeCertMonth)
              .map(lecture => (
                <div
                  key={lecture.id}
                  onClick={() => setSelectedLecture(lecture.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-sm ${
                    lecture.completed
                      ? 'bg-emerald-50/20 border-emerald-100 hover:bg-emerald-50/40'
                      : 'bg-white border-slate-150 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                        lecture.completed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {lecture.completed ? 'Completed' : `Lecture ${lecture.id}`}
                      </span>
                      <h4 className="text-xs font-black text-slate-800 mt-2">{lecture.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 line-clamp-2">{lecture.description}</p>
                    </div>
                    <span className="text-[9px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded shrink-0">{lecture.duration}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    );
  };

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'CoGrad Certification': return renderCertification();
      case 'Study Materials': return renderContentResources();
      case 'My Students': return renderClassroomBatches();
      case 'Homework': return renderAssignmentsGrading();
      case 'Schedule & Attendance': return renderSchedulesAttendance();
      case 'Help & Support': return renderHelpSupport();

      case 'My Earnings': return renderAnalyticsEarnings();
      case 'Profile & Reviews': return renderPublicProfileReviews();
      case 'My Dashboard':
      default:
        return renderDashboard();
    }
  };

  if (!teacherId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-slate-400">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (teacherProfile && !teacherProfile.verified) {
    return <TeacherOnboardingPortal />;
  }

  return (
    <>
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

      <DashboardShell
        navItems={[
          { name: 'My Dashboard', icon: LayoutDashboard },
          { name: 'My Students', icon: Users },
          { name: 'Study Materials', icon: BookOpen },
          { name: 'Homework', icon: CheckSquare },
          { name: 'Schedule & Attendance', icon: Calendar },
          { name: 'My Earnings', icon: DollarSign },
          { name: 'CoGrad Certification', icon: Award },
          { name: 'Profile & Reviews', icon: User },
          { name: 'Help & Support', icon: HelpCircle }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        roleName="Teacher Hub"
        roleColor="blue"
        userName={teacherProfile.name}
        notifications={unreadNotifications}
        onClearNotifs={async () => {
          setUnreadNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
          setToastMessage('All notifications read.');
          setShowToast(true);
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
        toast={{ show: showToast, message: toastMessage }}
        headerRight={
          <div className="flex items-center gap-4">
            {/* Search Input Box */}
            {activeTab !== 'Profile & Reviews' && (
              <div className="relative max-w-xs hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/50 rounded-xl text-xs font-semibold placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-48 focus:w-60 text-slate-800"
                />
              </div>
            )}
          </div>
        }
      >
        <div key={activeTab} className="tab-content-enter h-full w-full">
          {getActiveTabContent()}
        </div>
      </DashboardShell>
    </>
  );
};

export default TeacherDashboard;
