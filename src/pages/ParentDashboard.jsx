import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CreditCard,
  MessageSquare,
  Download,
  Plus,
  Bell,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  X,
  ChevronDown,
  Award,
  TrendingUp,
  Video,
  CheckSquare,
  DollarSign,
  FileText,
  Users,
  Eye,
  ShieldCheck
} from 'lucide-react';

// Helper to safely resolve icons stored as string or serialized objects from localStorage
const getScheduleIcon = (icon) => {
  if (!icon) return Clock;
  if (typeof icon === 'string') {
    const lower = icon.toLowerCase();
    if (lower === 'video') return Video;
    if (lower === 'file-text' || lower === 'filetext' || lower === 'file') return FileText;
    return Clock;
  }
  // If it's a React component (e.g. forwardRef object or function), use it
  if (typeof icon === 'function' || (typeof icon === 'object' && icon.$$typeof)) {
    return icon;
  }
  return Clock;
};

const ParentDashboard = () => {
  const navigate = useNavigate();
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState('Overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parent profile metadata
  const parentName = localStorage.getItem('cograd_parent_name') || 'Mrs. Sharma';

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Aarav Mehta was marked PRESENT today at 08:35 AM', time: '1h ago', isNew: true },
    { id: 2, text: 'Teacher shared feedback on Rahul Varma\'s Class 9 Unit Test', time: '4h ago', isNew: true },
    { id: 3, text: 'Fee Invoice for Class 11 tuition generated successfully', time: '2d ago', isNew: false }
  ]);

  // Dynamic state for Child data
  // Deep schema validator for cached parent-students data to prevent runtime crashes
  const isValidStudent = (s) => {
    if (!s) return false;
    if (typeof s.name !== 'string' || typeof s.class !== 'string' || typeof s.avatar !== 'string') return false;
    if (typeof s.feeDue !== 'number' || typeof s.feeStatus !== 'string' || typeof s.attendance !== 'number') return false;
    if (!Array.isArray(s.teachers) || !Array.isArray(s.subjects) || !Array.isArray(s.homeworks) || !Array.isArray(s.schedule) || !Array.isArray(s.activities) || !Array.isArray(s.chatHistory)) return false;
    
    // Validate each subject contains a trend score array
    for (const sub of s.subjects) {
      if (!sub || typeof sub.name !== 'string' || !Array.isArray(sub.trend) || sub.trend.length === 0) return false;
    }
    // Validate schedule items and check for serialized React icons
    for (const item of s.schedule) {
      if (!item || typeof item.icon === 'object') return false;
    }
    return true;
  };

  // Dynamic state for Child data
  // Using LocalStorage to persist updates (payments, PTM bookings, chat messages)
  const [studentsData, setStudentsData] = useState(() => {
    const cached = localStorage.getItem('cograd_parent_students_data');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && isValidStudent(parsed.rahul) && isValidStudent(parsed.aarav)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing student cache:', e);
      }
      // Outdated or corrupt cache, remove it
      localStorage.removeItem('cograd_parent_students_data');
    }
    return {
      'aarav': {
        id: 'CP-2026-STU42',
        name: 'Aarav Mehta',
        class: 'Class 10 (Secondary Board)',
        avatar: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80',
        attendance: 91,
        rank: 5,
        totalInBatch: 22,
        feeDue: 2000,
        feeDueDate: '3 days left (16 June)',
        feeStatus: 'Unpaid',
        averageGrade: 'A-',
        primaryTeacher: 'Dr. Sanjay Verma',
        teachers: [
          { name: 'Dr. Sanjay Verma', subject: 'Mathematics', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
          { name: 'Ms. Anjali Rao', subject: 'Physics', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
          { name: 'Mr. Robert D\'Souza', subject: 'Literature', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' }
        ],
        subjects: [
          { name: 'Mathematics', teacher: 'Dr. Sanjay Verma', attendance: 92, grade: 'A', trend: [60, 68, 75, 80, 85, 88, 92] },
          { name: 'Physics', teacher: 'Ms. Anjali Rao', attendance: 89, grade: 'B+', trend: [70, 72, 75, 78, 80, 85, 84] },
          { name: 'Literature', teacher: 'Mr. Robert D\'Souza', attendance: 93, grade: 'A-', trend: [80, 82, 85, 87, 88, 90, 91] }
        ],
        homeworks: [
          { id: 'h1', title: 'Algebra Worksheet 4', subject: 'Mathematics', due: 'Tomorrow', status: 'Pending' },
          { id: 'h2', title: 'Light Reflection Exercise', subject: 'Physics', due: '2 days ago', status: 'Submitted', score: '18/20' },
          { id: 'h3', title: 'Shakespeare Essay', subject: 'Literature', due: '4 days ago', status: 'Graded', score: 'A-' }
        ],
        schedule: [
          { id: 's1', type: 'PTM', title: 'PTM with Dr. Sanjay Verma', date: '15 June', time: '4:00 PM', details: 'Home Visit (30 Mins)', icon: 'home' },
          { id: 's2', type: 'Exam', title: 'Term Exam: Physics', date: '18 June', time: '9:00 AM', details: 'Home Tuition Paper', icon: 'file-text' }
        ],
        activities: [
          { id: 'a1', text: 'Tutor checked-in at home', time: '08:35 AM today', tag: 'Attendance', type: 'info' },
          { id: 'a2', text: 'Submitted Physics Exercise', time: 'Yesterday', tag: 'Homework', type: 'success' },
          { id: 'a3', text: 'Graded in Literature: Shakespeare Essay (A-)', time: '3 days ago', tag: 'Academic', type: 'primary' },
          { id: 'a4', text: 'Monthly tuition fee invoice generated', time: '4 days ago', tag: 'Billing', type: 'warning' }
        ],
        chatHistory: [
          { sender: 'teacher', text: 'Hello Mrs. Sharma! I wanted to check if Aarav completed the trigonometry revisions.', time: '3 days ago' },
          { sender: 'parent', text: 'Yes Dr. Verma, I monitored him completing it last night. He had some minor doubts in Identities.', time: '2 days ago' },
          { sender: 'teacher', text: 'Great. Tell him to attend the special morning slot tomorrow, Ms. Rao and I will resolve those doubts.', time: 'Yesterday' }
        ]
      },
      'rahul': {
        id: 'CP-2026-STU88',
        name: 'Rahul Varma',
        class: 'Class 11 (Science Stream)',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        attendance: 94,
        rank: 2,
        totalInBatch: 50,
        feeDue: 4500,
        feeDueDate: '5 days left (18 June)',
        feeStatus: 'Unpaid',
        averageGrade: 'A',
        primaryTeacher: 'Priya Sharma',
        teachers: [
          { name: 'Priya Sharma', subject: 'Mathematics Advanced', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
          { name: 'Neha Gupta', subject: 'Chemistry', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
          { name: 'Amit Sen', subject: 'Physics', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' }
        ],
        subjects: [
          { name: 'Mathematics Advanced', teacher: 'Priya Sharma', attendance: 95, grade: 'A', trend: [75, 78, 82, 85, 90, 92, 95] },
          { name: 'Chemistry', teacher: 'Neha Gupta', attendance: 92, grade: 'A-', trend: [65, 70, 75, 78, 82, 85, 88] },
          { name: 'Physics', teacher: 'Amit Sen', attendance: 94, grade: 'A', trend: [80, 82, 84, 88, 90, 91, 93] }
        ],
        homeworks: [
          { id: 'h1', title: 'Chapter 5 Triangles Homework', subject: 'Class 9 Mathematics', due: '2 days', status: 'Pending' },
          { id: 'h2', title: 'Organic Synthesis Lab Report', subject: 'Chemistry', due: 'Yesterday', status: 'Submitted', score: 'Pending Grade' },
          { id: 'h3', title: 'Thermodynamics Assignment', subject: 'Physics', due: '3 days ago', status: 'Graded', score: '24/25' }
        ],
        schedule: [
          { id: 's1', type: 'Exam', title: 'Class 9 Maths Unit Test', date: '16 June', time: '10:00 AM', details: 'Home Tuition Paper', icon: 'file-text' },
          { id: 's2', type: 'PTM', title: 'PTM with Priya Sharma', date: '20 June', time: '5:00 PM', details: 'Home Visit (30 Mins)', icon: 'home' }
        ],
        activities: [
          { id: 'a1', text: 'Tutor checked-in at home', time: '08:28 AM today', tag: 'Attendance', type: 'info' },
          { id: 'a2', text: 'Completed Gradebook Upload: Chemistry Test #2 (88%)', time: 'Yesterday', tag: 'Academic', type: 'success' },
          { id: 'a3', text: 'Submitted Triangles Homework', time: 'Yesterday', tag: 'Homework', type: 'success' },
          { id: 'a4', text: 'Tuition Fee Invoice generated', time: '3 days ago', tag: 'Billing', type: 'warning' }
        ],
        chatHistory: [
          { sender: 'parent', text: 'Hello teacher, how is Rahul performing in the advanced calculus lectures?', time: '4 days ago' },
          { sender: 'teacher', text: 'Hello! Rahul is performing exceptionally well. He is quick to grasp complex integration concepts, but needs to focus slightly more on homework submission speed.', time: '4 days ago' },
          { sender: 'parent', text: 'Understood. I will push him to complete drafts earlier.', time: '3 days ago' }
        ]
      }
    };
  });

  // Active student key (starts with Rahul Varma CP-2026-STU88 to demonstrate integration with Priya Sharma, or Aarav Mehta)
  const [selectedStudentKey, setSelectedStudentKey] = useState('rahul');

  // Trigger cache save when student state changes
  useEffect(() => {
    localStorage.setItem('cograd_parent_students_data', JSON.stringify(studentsData));
  }, [studentsData]);

  // Current student object based on state selector
  const activeStudent = studentsData[selectedStudentKey];

  // Modals Visibility
  const [showPayModal, setShowPayModal] = useState(false);
  // showChatModal removed since messaging is redirected to WhatsApp
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPTMModal, setShowPTMModal] = useState(false);

  // Pay Fee Form Inputs
  const [cardHolder, setCardHolder] = useState(parentName);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [payMethod, setPayMethod] = useState('card'); // 'card' or 'upi'
  const [payLoading, setPayLoading] = useState(false);

  // PTM Booking Form Inputs
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [ptmMode, setPtmMode] = useState('In-Home');
  const [ptmLoading, setPtmLoading] = useState(false);

  // Parent Support Message Input State
  const [supportMessageInput, setSupportMessageInput] = useState(() => {
    return localStorage.getItem(`cograd_parent_message_to_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`) || '';
  });

  // Chat States
  const [chatInput, setChatInput] = useState('');
  const [selectedChatTeacherState, setSelectedChatTeacherState] = useState('');
  const [lastStudentKey, setLastStudentKey] = useState(selectedStudentKey);

  // If active student changed, reset the teacher state to default
  if (selectedStudentKey !== lastStudentKey) {
    setLastStudentKey(selectedStudentKey);
    setSelectedChatTeacherState('');
    setSupportMessageInput(localStorage.getItem(`cograd_parent_message_to_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`) || '');
  }

  // Derive the active chat teacher name
  const selectedChatTeacher = selectedChatTeacherState || activeStudent.primaryTeacher;

  // Parent Assigned Quiz Generator States
  const [quizSubject, setQuizSubject] = useState('Mathematics');
  const [quizTopic, setQuizTopic] = useState('Triangles & Geometry');
  const [quizQuestionsCount, setQuizQuestionsCount] = useState(3);
  const [quizLoading, setQuizLoading] = useState(false);



  // Home Study Hours Planner States
  const [studyHours, setStudyHours] = useState(4);
  const [restHours, setRestHours] = useState(8);
  const [playHours, setPlayHours] = useState(2);

  // Report Card Download State
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Log Out Handler
  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    triggerToast('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  // Fee Payment handler
  const handlePayFeeSubmit = (e) => {
    e.preventDefault();
    if (activeStudent.feeDue <= 0) {
      triggerToast('Fee is already paid!');
      return;
    }
    if (payMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert('Please fill out all card fields.');
      return;
    }
    if (payMethod === 'upi' && !upiId) {
      alert('Please fill out your UPI ID.');
      return;
    }

    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setShowPayModal(false);

      // Update student data status
      setStudentsData(prev => {
        const studentCopy = { ...prev[selectedStudentKey] };
        const oldDue = studentCopy.feeDue;
        studentCopy.feeDue = 0;
        studentCopy.feeStatus = 'Paid';
        studentCopy.feeDueDate = 'Paid on ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        
        // Append payment activity
        studentCopy.activities = [
          {
            id: 'pay_' + Date.now(),
            text: `Paid Tuition fee of ₹${oldDue.toLocaleString('en-IN')} successfully via ${payMethod.toUpperCase()}`,
            time: 'Just now',
            tag: 'Billing',
            type: 'success'
          },
          ...studentCopy.activities
        ];
        return {
          ...prev,
          [selectedStudentKey]: studentCopy
        };
      });

      // Append to global notifications
      setNotifications(prev => [
        {
          id: Date.now(),
          text: `Payment of ₹${activeStudent.feeDue.toLocaleString('en-IN')} for ${activeStudent.name} is processed.`,
          time: 'Just now',
          isNew: true
        },
        ...prev
      ]);

      // Reset payment card fields
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setUpiId('');

      triggerToast('Payment Processed Successfully!');
    }, 1800);
  };

  // Message Send handler with simulator reply
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessageText = chatInput.trim();
    setChatInput('');

    // Append parent message
    setStudentsData(prev => {
      const studentCopy = { ...prev[selectedStudentKey] };
      studentCopy.chatHistory = [
        ...studentCopy.chatHistory,
        { sender: 'parent', text: userMessageText, time: 'Just now' }
      ];
      return {
        ...prev,
        [selectedStudentKey]: studentCopy
      };
    });

    // Simulate teacher reply
    setTimeout(() => {
      let replyText = '';
      if (selectedChatTeacher === 'Priya Sharma') {
        replyText = `Hello Mrs. Sharma. Thank you for the message. I have reviewed Rahul's mock calculus grades. He did exceptionally well, but we should make sure he keeps practicing integration worksheets for the board exam.`;
      } else if (selectedChatTeacher === 'Dr. Sanjay Verma') {
        replyText = `Hello! I received your inquiry about Aarav's board exam prep. Aarav is active in mathematics lectures. I'll provide an extra worksheets kit this weekend.`;
      } else {
        replyText = `Thank you for your message. I am currently in a live lecture session. I will review this query and respond to you as soon as possible.`;
      }

      setStudentsData(prev => {
        const studentCopy = { ...prev[selectedStudentKey] };
        studentCopy.chatHistory = [
          ...studentCopy.chatHistory,
          { sender: 'teacher', text: replyText, time: 'Just now' }
        ];
        return {
          ...prev,
          [selectedStudentKey]: studentCopy
        };
      });

      triggerToast(`New message from ${selectedChatTeacher}`);
    }, 1500);
  };

  // PTM Scheduling handler
  const handleBookPTMSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeacher || !bookingDate || !bookingTime) {
      alert('Please fill out all booking fields.');
      return;
    }

    setPtmLoading(true);
    setTimeout(() => {
      setPtmLoading(false);
      setShowPTMModal(false);

      const formattedDate = new Date(bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const [hours, minutes] = bookingTime.split(':');
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const formattedTime = `${parseInt(hours) % 12 || 12}:${minutes} ${ampm}`;

      setStudentsData(prev => {
        const studentCopy = { ...prev[selectedStudentKey] };
        
        // Append schedule event
        studentCopy.schedule = [
          {
            id: 'ptm_' + Date.now(),
            type: 'PTM',
            title: `PTM with ${selectedTeacher}`,
            date: formattedDate,
            time: formattedTime,
            details: `${ptmMode === 'Call' ? 'Telephonic Call' : 'In-Home Visit'} scheduled`,
            icon: ptmMode === 'Call' ? 'phone' : 'home'
          },
          ...studentCopy.schedule
        ];

        // Append activity log
        studentCopy.activities = [
          {
            id: 'ptm_act_' + Date.now(),
            text: `Booked Parent-Teacher Meeting with ${selectedTeacher} for ${formattedDate} at ${formattedTime}`,
            time: 'Just now',
            tag: 'Calendar',
            type: 'primary'
          },
          ...studentCopy.activities
        ];

        return {
          ...prev,
          [selectedStudentKey]: studentCopy
        };
      });

      triggerToast('Parent-Teacher Meeting booked successfully!');
      // Reset fields
      setSelectedTeacher('');
      setBookingDate('');
      setBookingTime('');
    }, 1500);
  };

  // Simulate downloading report card
  const handleDownloadReport = () => {
    setDownloadLoading(true);
    setTimeout(() => {
      setDownloadLoading(false);
      setShowReportModal(false);

      // Create dummy link download
      const element = document.createElement('a');
      const file = new Blob([
        `=========================================\n`,
        `   COGRAD PATHSHALA - ACADEMIC REPORT     \n`,
        `=========================================\n\n`,
        `Student Name  : ${activeStudent.name}\n`,
        `Student ID    : ${activeStudent.id}\n`,
        `Class Standard: ${activeStudent.class}\n`,
        `Term Season   : Summer Term 2026\n`,
        `Attendance    : ${activeStudent.attendance}%\n`,
        `Batch Rank    : #${activeStudent.rank} out of ${activeStudent.totalInBatch}\n`,
        `Average Grade : ${activeStudent.averageGrade}\n\n`,
        `SUBJECT-WISE SCORES & REMARKS:\n`,
        activeStudent.subjects.map(s => ` - ${s.name}: Grade ${s.grade} (Mentored by ${s.teacher})`).join('\n'),
        `\n\nGenerated on  : ${new Date().toLocaleString()}\n`,
        `Verification Code: MD-COGRAD-889021\n`,
        `=========================================\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${activeStudent.name.replace(/\s+/g, '_')}_Report_Card.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Add to activities
      setStudentsData(prev => {
        const studentCopy = { ...prev[selectedStudentKey] };
        studentCopy.activities = [
          {
            id: 'dl_' + Date.now(),
            text: `Downloaded Academic Report Card for Term Examination`,
            time: 'Just now',
            tag: 'Report',
            type: 'success'
          },
          ...studentCopy.activities
        ];
        return {
          ...prev,
          [selectedStudentKey]: studentCopy
        };
      });

      triggerToast('Report Card file downloaded successfully!');
    }, 1600);
  };

  // Helper for activity tag styling
  const getActivityTagStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'primary':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'info':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500';
      case 'warning':
        return 'border-amber-500';
      case 'primary':
        return 'border-blue-500';
      case 'info':
      default:
        return 'border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative admin-page-enter">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className={`w-full md:w-64 bg-white border-r border-slate-100/60 flex flex-col justify-between shrink-0 h-auto md:h-screen md:sticky md:top-0 z-20 ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="flex flex-col overflow-y-auto flex-grow">
          {/* Logo Header */}
          <div className="px-5 py-5 border-b border-slate-100/60 flex items-center justify-between">
            <div>
              <span className="logo-shimmer font-black text-lg leading-none tracking-tight">Cograd Pathshala</span>
              <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-1">Parent Dashboard</div>
            </div>
            {/* Close button for mobile menu */}
            <button className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-4 space-y-0.5">
            {[
              { name: 'Overview', icon: LayoutDashboard },
              { name: 'Academics', icon: BookOpen },
              { name: 'Home Support & Quizzes', icon: Sparkles },
              { name: 'Daily Learning', icon: Eye },
              { name: 'Fee Manager', icon: CreditCard },
              { name: 'PTM & Support', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer group ${
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
                  <span className={isActive ? 'font-bold' : ''}>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Block */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2.5 text-left flex-grow">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center border border-amber-200 text-sm shrink-0">
                {parentName.replace(/Mrs\.|Mr\./, '').trim().charAt(0) || 'P'}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">{parentName}</div>
                <div className="text-[10px] font-semibold text-slate-400">Parent Account</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVBAR */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-10 px-6 py-0 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Hamburger button for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            {/* Child Selector Dropdown */}
            <div className="relative">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Active Student Profile</label>
              <div className="flex items-center bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl px-4 py-2 cursor-pointer transition-colors shadow-sm relative pr-10">
                <select
                  value={selectedStudentKey}
                  onChange={(e) => setSelectedStudentKey(e.target.value)}
                  className="appearance-none bg-transparent outline-none pr-6 text-sm font-bold text-slate-800 cursor-pointer w-full"
                >
                  <option value="rahul">Rahul Varma - Class 11</option>
                  <option value="aarav">Aarav Mehta - Class 10</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => n.isNew) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-slate-100 shadow-xl py-3 z-30 animate-slide-up">
                  <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-100">
                    <span className="font-extrabold text-xs text-slate-700 uppercase">Alert Notifications</span>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isNew: false })))}
                      className="text-[10px] text-blue-600 font-bold hover:underline"
                    >
                      Clear Badge
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-3 text-xs leading-relaxed transition-colors hover:bg-slate-50 ${notif.isNew ? 'bg-blue-50/20 font-medium' : ''}`}>
                        <div className="text-slate-800">{notif.text}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-1">{notif.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Greeting */}
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-800">Welcome, {parentName}!</div>
              <div className="text-[10px] font-semibold text-slate-400">Viewing child progress summary</div>
            </div>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">

          {/* ================================== OVERVIEW TAB ================================== */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              
              {/* Smart Attendance Alert Banner */}
              {selectedStudentKey === 'aarav' ? (
                <div className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-200 rounded-3xl p-4 flex items-center justify-between gap-4 animate-slide-up">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200 shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">⚠️ Smart Attendance Alert</h4>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">Aarav's physics class attendance has dropped to 89% (below recommended 92%).</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStudentsData(prev => {
                        const studentCopy = { ...prev['aarav'] };
                        const exists = studentCopy.schedule.some(s => s.title.includes('Anjali Rao'));
                        if (!exists) {
                          studentCopy.schedule = [
                            {
                              id: 'ptm_anjali_' + Date.now(),
                              type: 'PTM',
                              title: 'PTM with Ms. Anjali Rao',
                              date: '17 June',
                              time: '3:00 PM',
                              details: 'Physics Review Sync (Call)',
                              icon: 'phone'
                            },
                            ...studentCopy.schedule
                          ];
                          studentCopy.activities = [
                            {
                              id: 'ptm_act_anjali_' + Date.now(),
                              text: 'Requested urgent Physics performance sync with Ms. Anjali Rao',
                              time: 'Just now',
                              tag: 'Calendar',
                              type: 'warning'
                            },
                            ...studentCopy.activities
                          ];
                        }
                        return { ...prev, aarav: studentCopy };
                      });
                      triggerToast('Counselor meeting scheduled with Ms. Anjali Rao!');
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    Request Tutor Sync
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between gap-4 animate-slide-up">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">✅ Center Check-in Status</h4>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">Rahul successfully checked in at the Meerut tuition center gate at 08:28 AM today.</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">Checked In</span>
                </div>
              )}
              
              {/* Active Child Profile Summary Card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-10 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-40"></div>

                <div className="flex items-center space-x-4 relative z-10">
                  <img
                    src={activeStudent.avatar}
                    alt={activeStudent.name}
                    className="w-18 h-18 rounded-2xl object-cover border-2 border-blue-500/20 shadow-md"
                  />
                  <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center">
                      {activeStudent.name}
                      <span className="ml-2.5 px-2.5 py-1 text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded-full">
                        {activeStudent.id}
                      </span>
                    </h2>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">{activeStudent.class}</p>
                    
                    {/* Secondary Teacher Quick Info */}
                    <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-500 font-semibold">
                      <span>Primary Mentor:</span>
                      <span className="text-slate-700 font-bold">{activeStudent.primaryTeacher}</span>
                    </div>
                  </div>
                </div>

                {/* Score Summary badges grid */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 min-w-[280px] sm:min-w-[400px]">
                  
                  {/* Attendance badge */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:scale-[1.02] transition-transform shadow-inner flex flex-col items-center text-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className="text-lg font-black text-slate-800">{activeStudent.attendance}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance</span>
                  </div>

                  {/* Batch Rank badge */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:scale-[1.02] transition-transform shadow-inner flex flex-col items-center text-center justify-center">
                    <Award className="w-5 h-5 text-amber-500 mb-1" />
                    <span className="text-lg font-black text-slate-800">#{activeStudent.rank}<span className="text-xs text-slate-400">/{activeStudent.totalInBatch}</span></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Batch Rank</span>
                  </div>

                  {/* Avg Grade badge */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:scale-[1.02] transition-transform shadow-inner flex flex-col items-center text-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-500 mb-1" />
                    <span className="text-lg font-black text-slate-800">{activeStudent.averageGrade}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Grade</span>
                  </div>

                </div>
              </div>

              {/* Fee Alert Box */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tuition Fee Billing Status */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Tuition Fees Invoice</h3>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                        activeStudent.feeStatus === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                      }`}>
                        {activeStudent.feeStatus}
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="text-3xl font-black text-slate-800">
                        ₹{activeStudent.feeDue > 0 ? activeStudent.feeDue.toLocaleString('en-IN') : '0'}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-1">
                        {activeStudent.feeStatus === 'Paid' ? 'No pending balance due' : `Deadline: ${activeStudent.feeDueDate}`}
                      </div>
                    </div>
                  </div>

                  {activeStudent.feeDue > 0 ? (
                    <button
                      onClick={() => setShowPayModal(true)}
                      className="w-full btn-primary flex items-center justify-center space-x-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer mt-4"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Pending Fee</span>
                    </button>
                  ) : (
                    <div className="w-full bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl p-3 text-center text-xs font-bold flex items-center justify-center space-x-1.5 mt-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No outstanding fees. Invoice paid.</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons Card */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between lg:col-span-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-2">Interactive Parent Toolkit</h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">Select quick workflows to interact with mentors or review progress documents.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Chat with Primary Teacher */}
                    <button 
                      onClick={() => {
                        window.open(`https://wa.me/919876543210?text=Hello%20${activeStudent.primaryTeacher}%2C%20I%20am%20the%20parent%20of%20${activeStudent.name}.`, "_blank");
                      }}
                      className="bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:-translate-y-0.5 group active:scale-[0.98]"
                    >
                      <div className="p-3 bg-blue-100 rounded-full text-blue-700 mb-2 group-hover:scale-105 transition-transform">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">Chat with Teacher</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-1">Redirect to WhatsApp Chat</span>
                    </button>

                    {/* Book PTM Slots */}
                    <button 
                      onClick={() => {
                        setSelectedTeacher(activeStudent.primaryTeacher);
                        setShowPTMModal(true);
                      }}
                      className="bg-purple-50/50 hover:bg-purple-50 border border-purple-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:-translate-y-0.5 group active:scale-[0.98]"
                    >
                      <div className="p-3 bg-purple-100 rounded-full text-purple-700 mb-2 group-hover:scale-105 transition-transform">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">Schedule PTM</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-1">Book home visit / call</span>
                    </button>

                    {/* Download Report Card */}
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:-translate-y-0.5 group active:scale-[0.98]"
                    >
                      <div className="p-3 bg-emerald-100 rounded-full text-emerald-700 mb-2 group-hover:scale-105 transition-transform">
                        <Download className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">Progress Report</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-1">Generate & download Card</span>
                    </button>

                  </div>
                </div>

              </div>

              {/* Subject Academic List Mini Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Subject Academic cards with miniature graphs */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Subject-Wise Performance</h3>
                      <p className="text-[11px] text-slate-400 font-semibold">Mock examinations and tests progress trend</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('Academics')}
                      className="text-xs text-blue-600 font-bold flex items-center hover:underline"
                    >
                      <span>Detailed Analysis</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeStudent.subjects.map((sub, index) => {
                      const trendMin = Math.min(...sub.trend);
                      const trendMax = Math.max(...sub.trend);
                      const points = sub.trend.map((val, idx) => {
                        const x = (idx / (sub.trend.length - 1)) * 100;
                        const y = 50 - ((val - trendMin) / (trendMax - trendMin || 1)) * 40;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <div key={index} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow group">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-slate-800 leading-snug">{sub.name}</span>
                              <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded-lg">{sub.grade}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-1">Mentor: {sub.teacher}</span>
                          </div>

                          {/* Mini SVG Trend Line Chart */}
                          <div className="w-full h-12 my-3 relative overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path
                                d={`M 0,50 L ${points} L 100,50 Z`}
                                fill={`url(#grad-${index})`}
                              />
                              <polyline
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="2"
                                points={points}
                              />
                            </svg>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-100">
                            <span>Attendance</span>
                            <span className="text-slate-800">{sub.attendance}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Upcoming schedule log */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Upcoming Events</span>
                      <span className="px-2 py-0.5 text-[9px] bg-purple-50 text-purple-700 font-bold border border-purple-100 rounded-full">{activeStudent.schedule.length} Active</span>
                    </h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {activeStudent.schedule.map((item, index) => {
                        const Icon = getScheduleIcon(item.icon);
                        return (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-slate-100">
                            <div className="p-2 bg-white rounded-xl border border-slate-200 text-blue-600 shadow-sm shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-extrabold uppercase tracking-wide ${item.type === 'PTM' ? 'text-purple-600' : 'text-blue-600'}`}>
                                  {item.type}
                                </span>
                                <span className="text-[9px] text-slate-400 font-semibold">{item.date}</span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center">
                                <Clock className="w-3 h-3 mr-1 inline shrink-0" />
                                {item.time} | {item.details}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTeacher(activeStudent.primaryTeacher);
                      setShowPTMModal(true);
                    }}
                    className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl py-2.5 text-xs font-bold flex items-center justify-center space-x-1 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Parent Meeting</span>
                  </button>
                </div>

              </div>

              {/* Homework Tracker and Activity log */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Homework check card */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Homework & Assignment Log</h3>
                      <p className="text-[11px] text-slate-400 font-semibold">Weekly home tutorials check log</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded-full">
                      {activeStudent.homeworks.filter(h => h.status === 'Pending').length} Pending
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                    {activeStudent.homeworks.map((h, index) => (
                      <div key={index} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-start space-x-3">
                          <div className={`mt-0.5 p-1 rounded-lg border ${h.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : h.status === 'Submitted' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            <CheckSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800">{h.title}</span>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                              <span className="text-slate-600 font-bold">{h.subject}</span>
                              <span>•</span>
                              <span>Due: {h.due}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {h.status === 'Pending' ? (
                            <span className="px-2.5 py-1 text-[9px] bg-amber-50 text-amber-700 border border-amber-100 rounded-lg font-bold uppercase tracking-wider">
                              Pending
                            </span>
                          ) : h.status === 'Submitted' ? (
                            <div className="text-right">
                              <span className="px-2.5 py-1 text-[9px] bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-bold uppercase tracking-wider">
                                Submitting
                              </span>
                              <span className="text-[9px] text-slate-400 font-semibold block mt-1">{h.score || 'Pending Grade'}</span>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className="px-2.5 py-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg font-bold uppercase tracking-wider">
                                Graded
                              </span>
                              <span className="text-xs text-emerald-600 font-extrabold block mt-0.5">{h.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent activity timeline feed */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4">Live Activity Log</h3>

                  <div className="relative border-l border-slate-100 ml-3.5 space-y-4 max-h-72 overflow-y-auto pr-1 pl-4">
                    {activeStudent.activities.map((act) => (
                      <div key={act.id} className="relative">
                        {/* Bullet point indicator */}
                        <div className={`absolute -left-[23.5px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 ${getBorderColor(act.type)} shadow-sm`}></div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide border rounded-md ${getActivityTagStyles(act.type)}`}>
                            {act.tag}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">{act.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 font-semibold leading-relaxed">{act.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* ================================== ACADEMICS TAB ================================== */}
          {activeTab === 'Academics' && (
            <div className="space-y-6">
              
              {/* Header card with student information and selector */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={activeStudent.avatar} 
                      alt={activeStudent.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
                    />
                    <div>
                      <h2 className="text-xl font-black">{activeStudent.name} - Academic Grid</h2>
                      <p className="text-blue-100 text-xs font-semibold mt-0.5">{activeStudent.class}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/10">Attendance: {activeStudent.attendance}%</span>
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/10">Average Grade: {activeStudent.averageGrade}</span>
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/10">Rank: #{activeStudent.rank} in Batch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeStudent.subjects.map((sub, sIdx) => {
                  const trendMin = Math.min(...sub.trend);
                  const trendMax = Math.max(...sub.trend);
                  const points = sub.trend.map((val, idx) => {
                    const x = (idx / (sub.trend.length - 1)) * 150;
                    const y = 80 - ((val - trendMin) / (trendMax - trendMin || 1)) * 60;
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <div key={sIdx} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-slate-800 text-base">{sub.name}</span>
                          <span className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded-lg">{sub.grade}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-1 mb-4">
                          <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            {/* Fetch match teacher avatar */}
                            <img 
                              src={activeStudent.teachers.find(t => t.name === sub.teacher)?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                              alt={sub.teacher} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Mentor</span>
                            <span className="text-xs font-bold text-slate-700">{sub.teacher}</span>
                          </div>
                        </div>

                        {/* Large Performance Chart for subject */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 my-3">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-2 uppercase">
                            <span>Score progression</span>
                            <span className="text-blue-600">Peak: {trendMax}%</span>
                          </div>
                          <div className="w-full h-24 relative overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 150 90" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id={`grad-large-${sIdx}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path
                                d={`M 0,90 L ${points} L 150,90 Z`}
                                fill={`url(#grad-large-${sIdx})`}
                              />
                              <polyline
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="2.5"
                                points={points}
                              />
                              {/* Draw dots */}
                              {sub.trend.map((val, idx) => {
                                const x = (idx / (sub.trend.length - 1)) * 150;
                                const y = 80 - ((val - trendMin) / (trendMax - trendMin || 1)) * 60;
                                return (
                                  <circle
                                    key={idx}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill="#1d4ed8"
                                    stroke="#ffffff"
                                    strokeWidth="1"
                                  />
                                );
                              })}
                            </svg>
                          </div>
                          <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-2">
                            <span>Mock Test #1</span>
                            <span>Mid-Term</span>
                            <span>Mock Test #4</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-3 border-t border-slate-100 mt-4">
                        <span>Attendance rate</span>
                        <span className="text-slate-800">{sub.attendance}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Exam & Mock Result Center */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Exam & Result Records</h3>
                    <p className="text-xs text-slate-400 font-semibold">Official mock examination performance reports and score distributions</p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 rounded-lg uppercase tracking-wide">
                    New Result Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: selectedStudentKey === 'rahul' ? 'Class 9 Maths Unit Test' : 'English Grammar Chapter Test',
                      subject: selectedStudentKey === 'rahul' ? 'Chemistry' : 'Mathematics',
                      score: selectedStudentKey === 'rahul' ? '88 / 100' : '92 / 100',
                      percentage: selectedStudentKey === 'rahul' ? '88%' : '92%',
                      rank: selectedStudentKey === 'rahul' ? 'Rank #4 / 120' : 'Rank #2 / 22',
                      status: 'Outstanding',
                      feedback: selectedStudentKey === 'rahul' ? 'Excellent reaction mapping grasp. Kinetics numericals speed can be improved.' : 'Outstanding algebraic manipulations. Coordinate geometry sheets revision advised.',
                      teacher: selectedStudentKey === 'rahul' ? 'Neha Gupta' : 'Dr. Sanjay Verma'
                    },
                    {
                      title: selectedStudentKey === 'rahul' ? 'Physics Mock Test (Mechanics & Waves)' : 'Physics Chapter Test (Optics & Wave)',
                      subject: 'Physics',
                      score: selectedStudentKey === 'rahul' ? '76 / 100' : '74 / 100',
                      percentage: selectedStudentKey === 'rahul' ? '76%' : '74%',
                      rank: selectedStudentKey === 'rahul' ? 'Rank #12 / 120' : 'Rank #11 / 22',
                      status: 'Good',
                      feedback: selectedStudentKey === 'rahul' ? 'Sound rotational kinematics knowledge. Needs minor support in Wave interference math.' : 'Good conceptual clarity. Wave optics equations practice needed.',
                      teacher: selectedStudentKey === 'rahul' ? 'Amit Sen' : 'Ms. Anjali Rao'
                    }
                  ].map((result, rIdx) => (
                    <div key={rIdx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-800 leading-snug truncate max-w-[80%]">{result.title}</span>
                          <span className="px-2 py-0.5 text-[9px] bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded">{result.subject}</span>
                        </div>
                        <div className="flex justify-between items-end my-3.5">
                          <div>
                            <span className="text-2xl font-black text-slate-800">{result.score}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{result.rank}</span>
                          </div>
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border ${
                            result.status === 'Outstanding' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-white border border-slate-100 rounded-xl p-2.5">
                          <strong className="text-slate-700 block text-[9px] uppercase tracking-wide mb-0.5">Feedback from {result.teacher}:</strong>
                          "{result.feedback}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Report Card Summary Preview block */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-black text-slate-800 text-base">Verified Academic Reports</h3>
                    <p className="text-xs text-slate-400 font-medium">Download the stamped progress certificates issued by the regional directorate.</p>
                  </div>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="btn-outline-primary flex items-center justify-center space-x-2 py-3 px-6 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    <Download className="w-4.5 h-4.5" />
                    <span>Download Term Report Card</span>
                  </button>
                </div>
              </div>

            </div>
          )}


          {activeTab === 'Home Support & Quizzes' && (
            <div className="space-y-6">
              
              {/* Row 1: Child Well-being Summary & Parent Messaging */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Mood and mental health check */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Mental Health & Well-being</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                    </h3>

                    {/* Check if mood is set in localStorage */}
                    {(() => {
                      const loggedMood = localStorage.getItem(`cograd_student_mood_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`) || (selectedStudentKey === 'rahul' ? 'Focused' : 'Stressed');
                      const moodMap = {
                        Focused: { emoji: '🎯', desc: 'Rahul is highly concentrated on revision topics today.', color: 'bg-blue-50 text-blue-800 border-blue-100' },
                        Stressed: { emoji: '😫', desc: 'Aarav is feeling overloaded with exam syllabus topics.', color: 'bg-rose-50 text-rose-800 border-rose-100' },
                        Exhausted: { emoji: '😴', desc: 'Student needs power breaks to rest and recharge.', color: 'bg-amber-50 text-amber-800 border-amber-100' },
                        Confident: { emoji: '💪', desc: 'Student is feeling highly confident about mock quizzes.', color: 'bg-indigo-50 text-indigo-800 border-indigo-100' },
                        Happy: { emoji: '😊', desc: 'Excellent mood parameters logged today in workspace.', color: 'bg-emerald-50 text-emerald-800 border-emerald-100' }
                      };
                      const moodDetails = moodMap[loggedMood] || moodMap.Focused;
                      
                      return (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-2xl border ${moodDetails.color} flex items-center space-x-3.5`}>
                            <span className="text-3xl shrink-0">{moodDetails.emoji}</span>
                            <div>
                              <span className="text-[10px] uppercase font-extrabold block tracking-wide">Last Logged Mood</span>
                              <span className="text-sm font-black block mt-0.5">{loggedMood}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {moodDetails.desc} Logged mood data updates dynamically from their student workspace portal.
                          </p>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[10px] text-slate-600 font-bold leading-relaxed">
                            <strong className="text-slate-800 block mb-0.5">Counselor Advice:</strong>
                            {loggedMood === 'Stressed' 
                              ? 'We advise maintaining a 10-minute resting gap for every 50 minutes of tuition revision.' 
                              : 'Keep student in flow state. Make sure study room has minimal background noises.'}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Send supportive note */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-2">Support Message to Child</h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">Write a positive motivating note. It will appear at the top of your child's home feed in their workspace.</p>
                    
                    <textarea
                      value={supportMessageInput}
                      onChange={(e) => setSupportMessageInput(e.target.value)}
                      placeholder="e.g. We are so proud of your hard work, Rahul! Remember to take short breaks and sleep on time. You got this!"
                      rows="4"
                      className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none rounded-2xl p-4 text-xs font-semibold text-slate-700 leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
                    <span className="text-[10px] text-slate-400 font-bold">Saves instantly to student dashboard</span>
                    <button
                      onClick={() => {
                        if (!supportMessageInput.trim()) {
                          alert('Please write a message first.');
                          return;
                        }
                        const key = `cograd_parent_message_to_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`;
                        localStorage.setItem(key, supportMessageInput.trim());
                        triggerToast('Supportive message sent to child workspace!');
                      }}
                      className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Publish Supportive Note
                    </button>
                  </div>
                </div>

              </div>

              {/* Row 2: Assigned Tests Center & Study Planner */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Topic-wise test generator */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Topic-Wise Test Assignment</h3>
                    <p className="text-xs text-slate-400 font-semibold">Generate customized assessments for your child to test concept clarity at home.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Subject selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Select Subject</label>
                      <select
                        value={quizSubject}
                        onChange={(e) => {
                          setQuizSubject(e.target.value);
                          const defaults = {
                            Mathematics: 'Triangles & Geometry',
                            Physics: 'Newton Laws',
                            Chemistry: 'Chemical Kinetics'
                          };
                          setQuizTopic(defaults[e.target.value] || 'General Review');
                        }}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                      </select>
                    </div>

                    {/* Topic select */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Select Chapter Topic</label>
                      <select
                        value={quizTopic}
                        onChange={(e) => setQuizTopic(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                      >
                        {quizSubject === 'Mathematics' && (
                          <>
                            <option value="Triangles & Geometry">Triangles & Geometry</option>
                            <option value="Trigonometric Identities">Trigonometric Identities</option>
                            <option value="Definite Integration">Definite Integration</option>
                          </>
                        )}
                        {quizSubject === 'Physics' && (
                          <>
                            <option value="Newton Laws">Newton's Laws of Motion</option>
                            <option value="Wave Optics Interference">Wave Optics Interference</option>
                            <option value="Electrostatics Charges">Electrostatics Charges</option>
                          </>
                        )}
                        {quizSubject === 'Chemistry' && (
                          <>
                            <option value="Chemical Kinetics">Chemical Kinetics</option>
                            <option value="Carbonyl Roadmaps">Carbonyl Compounds</option>
                            <option value="Coordination Compounds">Coordination Compounds</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Count select */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Questions Count</label>
                      <select
                        value={quizQuestionsCount}
                        onChange={(e) => setQuizQuestionsCount(parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                      >
                        <option value={3}>3 Questions (Quick Test)</option>
                        <option value={5}>5 Questions (Standard Test)</option>
                        <option value={10}>10 Questions (Complete Test)</option>
                      </select>
                    </div>

                  </div>

                  <button
                    onClick={() => {
                      setQuizLoading(true);
                      setTimeout(() => {
                        setQuizLoading(false);
                        const testData = {
                          id: 'quiz_' + Date.now(),
                          subject: quizSubject,
                          topic: quizTopic,
                          questionCount: quizQuestionsCount,
                          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                          status: 'Pending'
                        };
                        const targetKey = `cograd_assigned_tests_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`;
                        localStorage.setItem(targetKey, JSON.stringify(testData));
                        localStorage.removeItem(`cograd_assigned_tests_result_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`);
                        triggerToast(`Assigned Topic-wise test to ${activeStudent.name}!`);
                      }, 1200);
                    }}
                    disabled={quizLoading}
                    className="w-full btn-primary py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {quizLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Generating Test Paper...</span>
                      </>
                    ) : (
                      <span>Generate & Assign Test to Child Dashboard</span>
                    )}
                  </button>

                  {/* Active Assigned Tests list table */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-3">Active Assigned Test Tracker</span>

                    {(() => {
                      const key = `cograd_assigned_tests_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`;
                      const raw = localStorage.getItem(key);
                      if (!raw) {
                        return (
                          <p className="text-xs text-slate-400 font-semibold text-center py-4 bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                            No customized test papers assigned yet. Generate one above.
                          </p>
                        );
                      }
                      try {
                        const testObj = JSON.parse(raw);
                        if (!testObj || !testObj.topic) throw new Error();
                        const score = localStorage.getItem(`cograd_assigned_tests_result_${selectedStudentKey === 'rahul' ? 'Rahul_Varma' : 'Aarav_Mehta'}`);
                        return (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-slate-800">{testObj.topic}</span>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                                <span>Subject: {testObj.subject}</span>
                                <span>•</span>
                                <span>Assigned: {testObj.date}</span>
                              </div>
                            </div>

                            <div>
                              {score ? (
                                <div className="text-right">
                                  <span className="px-2.5 py-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded font-bold uppercase">Completed</span>
                                  <span className="text-xs text-emerald-600 font-extrabold block mt-0.5">Score: {score}</span>
                                </div>
                              ) : (
                                <div className="text-right">
                                  <span className="px-2.5 py-0.5 text-[9px] bg-amber-50 text-amber-700 border border-amber-100 rounded font-bold uppercase animate-pulse">Pending Attempt</span>
                                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{testObj.questionCount} Questions</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      } catch {
                        return (
                          <p className="text-xs text-slate-400 font-semibold text-center py-4 bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                            No customized test papers assigned yet. Generate one above.
                          </p>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Home Study Hours Planner */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-2">Home Study Scheduler</h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">Set recommended study intervals for home learning routines.</p>

                    <div className="space-y-4">
                      
                      {/* Study hours */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                          <span>Revision Study Hours</span>
                          <span className="text-blue-600">{studyHours} hrs/day</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          value={studyHours}
                          onChange={(e) => setStudyHours(parseInt(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                        />
                      </div>

                      {/* Sleep hours */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                          <span>Sleep & Rest Hours</span>
                          <span className="text-blue-600">{restHours} hrs/day</span>
                        </div>
                        <input
                          type="range"
                          min="6"
                          max="10"
                          value={restHours}
                          onChange={(e) => setRestHours(parseInt(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                        />
                      </div>

                      {/* Leisure/Play hours */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                          <span>Leisure & Hobbies</span>
                          <span className="text-blue-600">{playHours} hrs/day</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={playHours}
                          onChange={(e) => setPlayHours(parseInt(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                        />
                      </div>

                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerToast('Home study routine updated and synced with child dashboard!');
                    }}
                    className="w-full mt-6 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl py-3 text-xs font-bold flex items-center justify-center space-x-1 hover:text-slate-900 transition-colors"
                  >
                    <span>Sync Home Routine Schedule</span>
                  </button>
                </div>

              </div>

              {/* Home learning support guides list */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4">Home Learning Support Guides</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Mitigating Board Exam Stress',
                      desc: 'A parent manual on structuring a calm home study environment, ensuring balanced nutrition, and supporting emotional wellness.',
                      readTime: '5 Mins Read'
                    },
                    {
                      title: 'Reviewing Math Homework sheets',
                      desc: 'Simple strategies to monitor Calculus or Algebra worksheets. Focus on steps verification over final answer grades.',
                      readTime: '3 Mins Read'
                    },
                    {
                      title: 'Building study routines for board exams',
                      desc: 'How to manage daily schedules, balance school topics, and align with coaching tutorials recommendations.',
                      readTime: '7 Mins Read'
                    }
                  ].map((guide, gIdx) => (
                    <div key={gIdx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 mb-1">{guide.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{guide.desc}</p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-blue-600 font-bold mt-4 pt-3 border-t border-slate-100">
                        <span className="hover:underline cursor-pointer" onClick={() => alert(`Opening PDF Guide: ${guide.title}`)}>Read Guide PDF</span>
                        <span className="text-slate-400 font-semibold">{guide.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================================== FEES TAB ================================== */}
          {activeTab === 'Fee Manager' && (
            <div className="space-y-6">
              
              {/* Top Banner billing totals */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Due Invoice Summary */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3 text-slate-400">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Pending Balance</span>
                  </div>
                  <div className="text-3xl font-black text-slate-800">
                    ₹{activeStudent.feeDue > 0 ? activeStudent.feeDue.toLocaleString('en-IN') : '0'}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    {activeStudent.feeDue > 0 ? `Invoice due by: ${activeStudent.feeDueDate}` : 'No outstanding balances'}
                  </p>
                </div>

                {/* Paid total summary */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3 text-slate-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Total Paid (FY 2026)</span>
                  </div>
                  <div className="text-3xl font-black text-slate-800">
                    ₹{activeStudent.feeDue === 0 ? (24000 + (selectedStudentKey === 'rahul' ? 4500 : 2000)).toLocaleString('en-IN') : '24,000'}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Including taxes and service parameters
                  </p>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center space-x-3 mb-1 text-slate-400">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Saved Methods</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 py-1 flex items-center justify-between">
                    <span>HDFC Credit Card (•••• 8820)</span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">Primary</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Click Pay Fee to choose card or UPI</p>
                </div>

              </div>

              {/* Invoices list */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-black text-slate-800 text-base">Invoices & Receipts</h3>
                    <p className="text-xs text-slate-400 font-semibold">Track historical tuition receipts and active monthly invoices.</p>
                  </div>
                  {activeStudent.feeDue > 0 && (
                    <button 
                      onClick={() => setShowPayModal(true)}
                      className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-98"
                    >
                      Pay Due Invoice
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Invoice ID</th>
                        <th className="pb-3 font-extrabold">Bill description</th>
                        <th className="pb-3 font-extrabold">Due Date</th>
                        <th className="pb-3 font-extrabold">Amount</th>
                        <th className="pb-3 font-extrabold">Status</th>
                        <th className="pb-3 text-right font-extrabold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      
                      {/* Current monthly invoice */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 text-blue-600 font-bold">INV-2026-M06</td>
                        <td className="py-4">
                          <div>Tuition Fee - June 2026</div>
                          <span className="text-[10px] text-slate-400 font-medium">Regular monthly mentorship class fees</span>
                        </td>
                        <td className="py-4">{activeStudent.feeDueDate}</td>
                        <td className="py-4 font-black">₹{activeStudent.feeDue > 0 ? activeStudent.feeDue.toLocaleString('en-IN') : (selectedStudentKey === 'rahul' ? '4,500' : '2,000')}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-lg border ${
                            activeStudent.feeDue === 0 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {activeStudent.feeDue === 0 ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {activeStudent.feeDue > 0 ? (
                            <button 
                              onClick={() => setShowPayModal(true)}
                              className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                alert(`Receipt INV-2026-M06 generated for ${activeStudent.name}. Opening PDF view (mocked).`);
                              }}
                              className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                            >
                              Receipt PDF
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Older invoices */}
                      <tr className="hover:bg-slate-50/50 transition-colors text-slate-500">
                        <td className="py-4">INV-2026-M05</td>
                        <td className="py-4">
                          <div>Tuition Fee - May 2026</div>
                          <span className="text-[10px] text-slate-400 font-medium">Paid via HDFC card</span>
                        </td>
                        <td className="py-4">15 May 2026</td>
                        <td className="py-4 font-bold">₹{selectedStudentKey === 'rahul' ? '4,500' : '2,000'}</td>
                        <td className="py-4">
                          <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">
                            Paid
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => alert('Opening Receipt INV-2026-M05')}
                            className="text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
                          >
                            Receipt PDF
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/50 transition-colors text-slate-500">
                        <td className="py-4">INV-2026-M04</td>
                        <td className="py-4">
                          <div>Tuition Fee - April 2026</div>
                          <span className="text-[10px] text-slate-400 font-medium">Paid via HDFC card</span>
                        </td>
                        <td className="py-4">15 Apr 2026</td>
                        <td className="py-4 font-bold">₹{selectedStudentKey === 'rahul' ? '4,500' : '2,000'}</td>
                        <td className="py-4">
                          <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">
                            Paid
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => alert('Opening Receipt INV-2026-M04')}
                            className="text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
                          >
                            Receipt PDF
                          </button>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ================================== PTM & SUPPORT TAB ================================== */}
          {activeTab === 'PTM & Support' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Side: Teacher Directory list and scheduler trigger */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-base mb-2">Subject Mentors</h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">Click a teacher profile card to launch a direct WhatsApp chat.</p>

                  <div className="space-y-3">
                    {activeStudent.teachers.map((teacher, index) => {
                      return (
                        <div 
                          key={index}
                          onClick={() => window.open(`https://wa.me/919876543210?text=Hello%20${teacher.name}%2C%20I%20am%20the%20parent%20of%20${activeStudent.name}.`, "_blank")}
                          className="p-3 rounded-2xl border bg-slate-50 border-slate-100 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={teacher.avatar}
                              alt={teacher.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{teacher.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{teacher.subject}</p>
                            </div>
                          </div>

                          <div className="w-2 h-2 rounded-full bg-emerald-500" title="Online"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <button 
                    onClick={() => {
                      setSelectedTeacher(activeStudent.primaryTeacher);
                      setShowPTMModal(true);
                    }}
                    className="w-full btn-outline-primary flex items-center justify-center space-x-2 py-3 rounded-2xl text-xs font-bold cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Calendar PTM Slot</span>
                  </button>
                </div>
              </div>

              {/* Right Side: WhatsApp Info Card */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col justify-between h-[520px]">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Direct WhatsApp Communications</h3>
                      <p className="text-emerald-600 text-xs font-bold mt-1">Active Coordination • Vetted Safety</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                      At Cograd Pathshala, we value direct, secure, and immediate parent-teacher contact. To ensure transparency, we redirect all conversations directly to **official WhatsApp chats** instead of hosting isolated in-app messaging.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-1.5">
                        <div className="text-xs font-bold text-slate-800">For Parents</div>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Instantly reach home tutors, check homework completion updates, or receive check-in confirmations directly on your phone.</p>
                      </div>
                      <div className="p-4 bg-white border border-slate-100 rounded-xl space-y-1.5">
                        <div className="text-xs font-bold text-slate-800">For Mentors</div>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Tutors provide daily learning reports, request pre-schedules, and solve specific student doubt worksheets via WhatsApp.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-400">
                    <span className="text-emerald-500 mt-0.5">✔</span>
                    <p className="leading-relaxed font-semibold">Clicking on any tutor card on the left will immediately launch a WhatsApp chat pre-filled with your student's details.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => window.open("https://wa.me/919876543210?text=Hello%2C%20I%20need%20help%20coordinating%20my%20child's%20tuition%20schedule.", "_blank")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-emerald-600/15 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>Chat with Support Coordinator</span>
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedTeacher(activeStudent.primaryTeacher);
                      setShowPTMModal(true);
                    }}
                    className="sm:w-max px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-2xl transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Schedule PTM Visit
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* ============================================================ */}
          {/* DAILY LEARNING REPORTS TAB - Shows teacher-submitted reports */}
          {/* ============================================================ */}
          {activeTab === 'Daily Learning' && (() => {
            // Read daily reports from localStorage (written by Teacher Dashboard)
            let reports = [];
            try {
              const saved = localStorage.getItem('cograd_daily_reports');
              reports = saved ? JSON.parse(saved) : [];
            } catch { reports = []; }

            const today = new Date().toISOString().split('T')[0];
            const todayReports = reports.filter(r => r.date === today);
            const hasReportToday = todayReports.length > 0;

            const engEmoji = (e) => e === 'Excellent' ? '🌟' : e === 'Good' ? '✅' : e === 'Average' ? '⚠️' : '❌';
            const engColor = (e) => e === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : e === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-100' : e === 'Average' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100';

            return (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Daily Learning Feed
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Real-time reports submitted by your child's teacher after each session.</p>
                </div>

                {/* Missing report alert */}
                {!hasReportToday && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-amber-900">⚠️ No Learning Report for Today ({today})</p>
                      <p className="text-xs text-amber-700 font-semibold mt-0.5">Your child's teacher has not submitted a daily report yet. You can message the teacher from the PTM &amp; Messaging tab to follow up.</p>
                    </div>
                  </div>
                )}

                {reports.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center space-y-3">
                    <div className="text-5xl">📋</div>
                    <h3 className="text-sm font-black text-slate-700">No Reports Yet</h3>
                    <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">Once your child's teacher submits a daily learning report after a session, it will appear here with full details.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report, idx) => (
                      <div key={report.id || idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow">
                        {/* Report header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4.5 h-4.5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">{report.date}</span>
                                {report.date === today && <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full animate-pulse">TODAY</span>}
                              </div>
                              <p className="text-xs font-bold text-slate-700 mt-0.5">{report.batch || 'General Class'} {report.teacherName ? `• ${report.teacherName}` : ''}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border ${engColor(report.engagement)}`}>
                            {engEmoji(report.engagement)} {report.engagement}
                          </span>
                        </div>

                        {/* Topics Covered */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Topics Covered in This Session</p>
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed">{report.topicsCovered}</p>
                        </div>

                        {/* Homework */}
                        {report.homeworkAssigned && (
                          <div className="flex items-start gap-2.5 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3">
                            <CheckSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[9px] font-black text-blue-600 uppercase tracking-wide">Homework Assigned</p>
                              <p className="text-xs text-slate-700 font-semibold mt-0.5">{report.homeworkAssigned}</p>
                            </div>
                          </div>
                        )}

                        {/* Parent notes */}
                        {report.notes && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-wide mb-1">📌 Special Note for You</p>
                            <p className="text-xs text-amber-800 font-semibold italic">{report.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upcoming Schedule Section */}
                {(() => {
                  let schedule = [];
                  try {
                    const saved = localStorage.getItem('cograd_content_schedule');
                    schedule = saved ? JSON.parse(saved) : [];
                  } catch { schedule = []; }

                  const todayDate = new Date();
                  todayDate.setHours(0, 0, 0, 0);
                  const upcoming = schedule.filter(s => new Date(s.date + 'T00:00:00') >= todayDate).slice(0, 5);

                  if (upcoming.length === 0) return null;

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pt-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-sm font-black text-slate-800">Upcoming Lessons Scheduled by Teacher</h3>
                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">{upcoming.length} ahead</span>
                      </div>

                      {upcoming.map((item, idx) => {
                        const sessionDate = new Date(item.date + 'T00:00:00');
                        const isToday = sessionDate.toDateString() === todayDate.toDateString();
                        const daysUntil = Math.round((sessionDate - todayDate) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={item.id || idx} className={`bg-white rounded-2xl border p-4 flex gap-3 ${isToday ? 'border-indigo-200 bg-indigo-50/60' : 'border-slate-100'}`}>
                            <div className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-black text-center ${isToday ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                              <span className="text-[9px] font-extrabold uppercase">{sessionDate.toLocaleDateString('en-IN', { month: 'short' })}</span>
                              <span className="text-lg leading-none">{sessionDate.getDate()}</span>
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-xs font-black text-slate-800 truncate">{item.chapter}</p>
                                {isToday && <span className="text-[8px] font-black text-white bg-indigo-600 px-1.5 py-0.5 rounded-full">TODAY</span>}
                                {!isToday && daysUntil <= 3 && <span className="text-[8px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">In {daysUntil}d</span>}
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold">{item.batch} &bull; {item.duration} min</p>
                              {item.objectives && <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-relaxed truncate">{item.objectives}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              </div>
            );
          })()}


        </main>
      </div>

      {/* ================================== MODALS SECTION ================================== */}

      {/* 1. PAY FEE MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-slide-up">
            
            <button 
              onClick={() => setShowPayModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 font-extrabold uppercase px-2.5 py-1 rounded-full">Secure Sandbox Gateway</span>
              <h3 className="text-lg font-black text-slate-800 mt-2">Simulate Tuition Fee Payment</h3>
              <p className="text-xs text-slate-400 font-semibold">Paying Tuition Fee invoice for <span className="text-slate-700 font-bold">{activeStudent.name}</span></p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">June 2026 Tuition Fee</span>
                <span className="text-xs font-bold text-slate-700 block">Class Standard Mentorship</span>
              </div>
              <span className="text-xl font-black text-slate-800">₹{activeStudent.feeDue.toLocaleString('en-IN')}</span>
            </div>

            <form onSubmit={handlePayFeeSubmit} className="space-y-4">
              
              {/* Payment Method selector */}
              <div className="flex border border-slate-100 bg-slate-50 p-1 rounded-xl shadow-inner">
                <button
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${payMethod === 'card' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  Credit/Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('upi')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${payMethod === 'upi' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  UPI Pay ID
                </button>
              </div>

              {payMethod === 'card' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      value={cardHolder} 
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Mrs. Alok Sharma"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      required
                      maxLength={19}
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      placeholder="4220 8890 2201 1120"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        maxLength={5}
                        value={cardExpiry} 
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">CVV Code</label>
                      <input 
                        type="password" 
                        required
                        maxLength={3}
                        value={cardCvv} 
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">UPI Address ID</label>
                  <input 
                    type="text" 
                    required
                    value={upiId} 
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. sharma@hdfcbank"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5">You will receive a payment request notification on your linked UPI app.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={payLoading}
                className="w-full btn-primary py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                {payLoading ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing Sandbox Payment...</span>
                  </>
                ) : (
                  <span>Submit Payment (₹{activeStudent.feeDue.toLocaleString('en-IN')})</span>
                )}
              </button>

            </form>
          </div>
        </div>
      )}


      {/* 2. MSG CHAT OVERLAY MODAL REMOVED (Redirection to WhatsApp enabled) */}


      {/* 3. REPORT CARD PREVIEW MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-slide-up">
            
            <button 
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 font-extrabold uppercase px-2.5 py-1 rounded-full">Official Progress Certificate</span>
              <h3 className="text-lg font-black text-slate-800 mt-2">Academic Report Preview</h3>
              <p className="text-xs text-slate-400 font-semibold">Review parameters for {activeStudent.name} before compiling.</p>
            </div>

            {/* Report Card miniature layout block */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 font-mono text-[10px] text-slate-600 space-y-2 border-dashed">
              <div className="text-center font-bold text-slate-800 border-b border-slate-200 pb-2">
                COGRAD PATHSHALA TUITION CENTER
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1.5">
                <div>NAME: <span className="font-bold text-slate-800">{activeStudent.name}</span></div>
                <div>ID: <span className="font-bold text-slate-800">{activeStudent.id}</span></div>
                <div>STREAM: <span className="font-bold text-slate-800">{activeStudent.class.slice(0, 18)}</span></div>
                <div>ATTENDANCE: <span className="font-bold text-slate-800">{activeStudent.attendance}%</span></div>
              </div>
              <div className="border-t border-slate-200 my-2 pt-2">
                <div className="font-bold text-slate-800 mb-1">GRADES SYSTEM SUMMARY:</div>
                {activeStudent.subjects.map((s, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className="font-bold text-slate-800">{s.grade} (Mentored by {s.teacher.split(' ')[1] || s.teacher})</span>
                  </div>
                ))}
              </div>
              <div className="text-center border-t border-slate-200 pt-2 text-[8px] text-slate-400">
                REGIONAL DIRECTORATE REPORT VERIFIED
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleDownloadReport}
                disabled={downloadLoading}
                className="w-full btn-primary py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                {downloadLoading ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Compiling Report PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Confirm & Download Receipt/Report</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-2xl text-xs font-bold text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}


      {/* 4. BOOK PTM MODAL */}
      {showPTMModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-slide-up">
            
            <button 
              onClick={() => setShowPTMModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] text-purple-600 bg-purple-50 border border-purple-100 font-extrabold uppercase px-2.5 py-1 rounded-full">PTM Calendar Hub</span>
              <h3 className="text-lg font-black text-slate-800 mt-2">Book Parent-Teacher Meeting</h3>
              <p className="text-xs text-slate-400 font-semibold">Select a time slot for personal discussion about {activeStudent.name}.</p>
            </div>

            <form onSubmit={handleBookPTMSubmit} className="space-y-4">
              
              {/* Select Mentor */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Select Mentor Teacher</label>
                <select 
                  required
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="">-- Choose teacher --</option>
                  {activeStudent.teachers.map((t, idx) => (
                    <option key={idx} value={t.name}>{t.name} ({t.subject})</option>
                  ))}
                </select>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Meeting Mode</label>
                <div className="flex border border-slate-100 bg-slate-50 p-1 rounded-xl shadow-inner">
                  <button
                    type="button"
                    onClick={() => setPtmMode('In-Home')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${ptmMode === 'In-Home' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    Home Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPtmMode('Call')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${ptmMode === 'Call' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    Telephonic Call
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={ptmLoading}
                className="w-full btn-primary py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-2 mt-2 cursor-pointer"
              >
                {ptmLoading ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Booking Meeting Slot...</span>
                  </>
                ) : (
                  <span>Schedule PTM Session</span>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Global Toast Alert banner */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 border border-slate-800 z-50 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default ParentDashboard;
