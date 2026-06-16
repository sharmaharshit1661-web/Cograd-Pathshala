import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  CheckSquare, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Search, 
  TrendingUp, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight, 
  Sliders, 
  CheckCircle2, 
  Plus,
  Trash2,
  FileText,
  Megaphone,
  Save,
  Download
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Notification center
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Aaryan Khanna submitted a new admission enquiry', time: '5m ago', isNew: true },
    { id: 2, text: 'Class 9-10 batch syllabus is 70% complete for this term', time: '1h ago', isNew: true },
    { id: 3, text: 'Monthly fee collection target achieved', time: '3h ago', isNew: false }
  ]);

  // Defaulters List state
  const [defaulters, setDefaulters] = useState([
    { id: 1, name: 'Siddharth Malhotra', amount: '₹12,500', status: 'Pending' },
    { id: 2, name: 'Isha Ambani', amount: '₹8,000', status: 'Pending' },
    { id: 3, name: 'Varun Dhawan', amount: '₹15,200', status: 'Pending' }
  ]);

  // Enquiries List state
  const [enquiries, setEnquiries] = useState([
    { id: 1, name: 'Aaryan Khanna', course: 'Class 5 — Maths & English', type: 'New', color: 'bg-blue-100 text-blue-800', phone: '+91 91111 22222', email: 'aaryan@gmail.com' },
    { id: 2, name: 'Priya Sharma', course: 'Class 10 — Maths & Science', type: 'Follow-up', color: 'bg-amber-100 text-amber-800', phone: '+91 93333 44444', email: 'priya.sh@gmail.com' },
    { id: 3, name: 'Rahul Gupta', course: 'Class 6 — All Subjects', type: 'Enrolled', color: 'bg-emerald-100 text-emerald-800', phone: '+91 95555 66666', email: 'rahul.g@gmail.com' }
  ]);

  // Student roster state
  const [students, setStudents] = useState([
    { id: 1, name: 'Rahul Malhotra', email: 'rahul.m@gmail.com', parentName: 'Siddharth Malhotra', batch: 'Class 9', date: '2026-01-10', status: 'Active' },
    { id: 2, name: 'Sanya Sen', email: 'sanya.s@yahoo.com', parentName: 'Deepak Sen', batch: 'Class 8', date: '2026-02-15', status: 'Active' },
    { id: 3, name: 'Arjun Kapoor', email: 'arjun.k@cograd.com', parentName: 'Sanjay Kapoor', batch: 'Class 9', date: '2026-03-01', status: 'Active' },
    { id: 4, name: 'Isha Verma', email: 'isha.v@gmail.com', parentName: 'Mukesh Verma', batch: 'Class 3', date: '2026-01-20', status: 'Active' },
    { id: 5, name: 'Varun Sharma', email: 'varun.s@gmail.com', parentName: 'David Sharma', batch: 'Class 7', date: '2026-02-28', status: 'Active' },
    { id: 6, name: 'Sara Mehta', email: 'sara.m@gmail.com', parentName: 'Ali Mehta', batch: 'Class 2', date: '2026-03-12', status: 'Suspended' }
  ]);

  // Teachers state
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Satish Sharma', subject: 'Mathematics', email: 'satish.sharma@cograd.com', rating: 4.9, rate: '₹600/hr', batches: ['Class 9', 'Class 3'], status: 'Verified' },
    { id: 2, name: 'Prof. Amit Verma', subject: 'Science', email: 'amit.verma@cograd.com', rating: 4.8, rate: '₹550/hr', batches: ['Class 9', 'Class 7'], status: 'Verified' },
    { id: 3, name: 'Ms. Neha Gupta', subject: 'English', email: 'neha.gupta@cograd.com', rating: 4.7, rate: '₹500/hr', batches: ['Class 7'], status: 'Verified' },
    { id: 4, name: 'Mr. Rohan Das', subject: 'Social Studies', email: 'rohan.das@cograd.com', rating: 4.5, rate: '₹450/hr', batches: ['Class 2'], status: 'Pending' },
    { id: 5, name: 'Mrs. S. Iyer', subject: 'Hindi', email: 's.iyer@cograd.com', rating: 4.6, rate: '₹480/hr', batches: ['Class 5'], status: 'Verified' }
  ]);

  // Per-teacher document verification state (keyed by teacher id)
  const [teacherDocStatus, setTeacherDocStatus] = useState({
    1: { degree: 'Approved', aadhar: 'Approved', experience: 'Approved', police: 'Approved' },
    2: { degree: 'Approved', aadhar: 'Approved', experience: 'Approved', police: 'Approved' },
    3: { degree: 'Approved', aadhar: 'Approved', experience: 'Approved', police: 'Approved' },
    4: { degree: 'Approved', aadhar: 'Under Review', experience: 'Under Review', police: 'Under Review' },
    5: { degree: 'Approved', aadhar: 'Approved', experience: 'Approved', police: 'Approved' }
  });

  // Toggle individual document status for a teacher
  const toggleDocStatus = (teacherId, docKey) => {
    setTeacherDocStatus(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [docKey]: prev[teacherId][docKey] === 'Approved' ? 'Under Review' : 'Approved'
      }
    }));
  };

  // Check if all docs for a teacher are approved
  const areAllDocsApproved = (teacherId) => {
    const docs = teacherDocStatus[teacherId];
    if (!docs) return false;
    return Object.values(docs).every(v => v === 'Approved');
  };


  // Recent payments state
  const [recentPayments, setRecentPayments] = useState([
    { id: 1, name: 'Rahul Malhotra', amount: '₹12,500', date: '2026-06-10', status: 'Paid', method: 'UPI' },
    { id: 2, name: 'Sanya Sen', amount: '₹15,000', date: '2026-06-09', status: 'Paid', method: 'Net Banking' },
    { id: 3, name: 'Isha Ambani', amount: '₹8,000', date: '2026-06-08', status: 'Paid', method: 'Credit Card' },
    { id: 4, name: 'Varun Dhawan', amount: '₹15,200', date: '2026-06-07', status: 'Failed', method: 'Debit Card' }
  ]);

  // Announcements state
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Summer Batch Timetable Revision', target: 'All Students & Teachers', priority: 'Medium', date: '2026-06-12', text: 'Please note the Class 9-10 batch timings will shift by 30 mins starting next Monday.' },
    { id: 2, title: 'Term 1 Exam Scheduling', target: 'All Students', priority: 'High', date: '2026-06-10', text: 'Term 1 progress assessments are scheduled to start from June 25th for all classes.' }
  ]);

  // Settings state
  const [settings, setSettings] = useState({
    centreName: 'Sharma Classes',
    contactEmail: 'admin@sharmaclasses.edu.in',
    contactPhone: '+91 98765 43210',
    address: 'Sector 15, Dwarka, New Delhi',
    session: '2026-2027',
    currency: '₹ (INR)',
    autoReminders: true,
    emailAlerts: true,
    whatsappSync: false
  });

  // Tests & Results state
  const [tests, setTests] = useState([
    { id: 1, name: 'Class 9 Mathematics Unit Test', date: '2026-06-08', batch: 'Class 9', avgScore: '74%', topScore: '98%', toppers: ['Arjun Kapoor (98%)', 'Rahul Malhotra (94%)'] },
    { id: 2, name: 'Class 8 Science Chapter Test', date: '2026-06-05', batch: 'Class 8', avgScore: '68%', topScore: '95%', toppers: ['Sanya Sen (95%)', 'Varun Sharma (90%)'] },
    { id: 3, name: 'Class 3 Maths Worksheet Assessment', date: '2026-06-01', batch: 'Class 3', avgScore: '82%', topScore: '100%', toppers: ['Sara Mehta (100%)', 'Isha Verma (96%)'] }
  ]);

  // Modal open states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddEnquiry, setShowAddEnquiry] = useState(false);
  const [showPublishTest, setShowPublishTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedTeacherDocs, setSelectedTeacherDocs] = useState(null);

  // Student Form Inputs
  const [newStudent, setNewStudent] = useState({ name: '', email: '', parentName: '', batch: 'Class 9', status: 'Active' });
  // Enquiry Form Inputs
  const [newEnquiry, setNewEnquiry] = useState({ name: '', course: 'Class 9 — All Subjects', phone: '', email: '' });
  // Test Form Inputs
  const [newTest, setNewTest] = useState({ name: '', date: '', batch: 'Class 9', avgScore: '', topScore: '', toppers: '' });

  // Attendance Sheet Filter State
  const [attendanceFilter, setAttendanceFilter] = useState({ batch: 'Class 9', date: '2026-06-13' });
  // Attendance Students Presence State (temporary session logs)
  const [attendanceLogs, setAttendanceLogs] = useState({
    1: 'Present',
    2: 'Present',
    3: 'Present',
    4: 'Absent',
    5: 'Present',
    6: 'Absent'
  });

  // Search/Filter states
  const [crmSearch, setCrmSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBatchFilter, setStudentBatchFilter] = useState('All');
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');
  const [teacherSearch, setTeacherSearch] = useState('');

  // Communications Form Input
  const [announceInput, setAnnounceInput] = useState({ title: '', target: 'All Students & Teachers', priority: 'Medium', text: '' });

  // Export report states
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  // Help Center states
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: '', category: 'General Support', description: '' });

  const handleRaiseTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) {
      triggerToast('Please fill out all ticket details!');
      return;
    }
    const id = tickets.length + 1;
    const newEntry = {
      ...newTicket,
      id,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };
    setTickets(prev => [newEntry, ...prev]);
    setNewTicket({ title: '', category: 'General Support', description: '' });
    triggerToast(`Support ticket #${id} submitted successfully!`);
  };

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    triggerToast('Logged out successfully.');
    setTimeout(() => navigate('/login'), 500);
  };

  const sendReminder = (id, name) => {
    setDefaulters(prev => prev.map(d => d.id === id ? { ...d, status: 'Sent' } : d));
    triggerToast(`Fee reminder dispatched to ${name}!`);
  };


  // Student actions
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) {
      triggerToast('Please fill out student name and email!');
      return;
    }
    const id = students.length + 1;
    const newEntry = {
      ...newStudent,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    setStudents(prev => [newEntry, ...prev]);

    setShowAddStudent(false);
    setNewStudent({ name: '', email: '', parentName: '', batch: 'Class 9', status: 'Active' });
    triggerToast(`Student ${newEntry.name} enrolled successfully!`);
  };

  const handleDeleteStudent = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      triggerToast(`Student ${name} removed from registry.`);
    }
  };

  const toggleStudentStatus = (id, name) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s));
    triggerToast(`Status toggled for ${name}.`);
  };

  // Teacher actions
  const toggleTeacherVerification = (id, name) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Verified' ? 'Pending' : 'Verified' } : t));
    triggerToast(`Verification toggled for ${name}.`);
  };



  // Test actions
  const handlePublishTestSubmit = (e) => {
    e.preventDefault();
    if (!newTest.name || !newTest.date || !newTest.avgScore || !newTest.topScore) {
      triggerToast('Please fill out all test fields!');
      return;
    }
    const id = tests.length + 1;
    const toppersArray = newTest.toppers ? newTest.toppers.split(',').map(s => s.trim()) : ['TBD'];
    const newEntry = {
      ...newTest,
      id,
      toppers: toppersArray
    };
    setTests(prev => [newEntry, ...prev]);
    setShowPublishTest(false);
    setNewTest({ name: '', date: '', batch: 'Class 9', avgScore: '', topScore: '', toppers: '' });
    triggerToast(`Test results for ${newEntry.name} published!`);
  };

  // Fee actions
  const handleRecordPayment = (defaulterId, name, amount) => {
    setDefaulters(prev => prev.map(d => d.id === defaulterId ? { ...d, status: 'Paid' } : d));
    const newTx = {
      id: recentPayments.length + 1,
      name,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      method: 'Cash / Manual'
    };
    setRecentPayments(prev => [newTx, ...prev]);
    triggerToast(`Payment of ${amount} recorded for ${name}!`);
  };

  // CRM actions
  const handleMoveEnquiry = (id, name, currentStatus, course, email) => {
    let nextStatus = 'Follow-up';
    let nextColor = 'bg-amber-100 text-amber-800';
    if (currentStatus === 'Follow-up') {
      nextStatus = 'Enrolled';
      nextColor = 'bg-emerald-100 text-emerald-800';
    }

    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, type: nextStatus, color: nextColor } : e));

    if (nextStatus === 'Enrolled') {
      const newStudentEntry = {
        id: students.length + 1,
        name,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        parentName: 'TBD',
        batch: course.includes('Class 11') || course.includes('Class 12') ? 'Class 11-12 Senior D1' : course.includes('Class 9') || course.includes('Class 10') ? 'Class 9-10 Secondary C1' : course.includes('Class 6') || course.includes('Class 7') || course.includes('Class 8') ? 'Class 6-8 Middle B1' : 'Class 1-5 Primary A1',
        date: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setStudents(prev => [newStudentEntry, ...prev]);
      triggerToast(`Enquiry enrolled! Student ${name} added to ${newStudentEntry.batch}.`);
    } else {
      triggerToast(`Enquiry ${name} moved to Follow-up.`);
    }
  };

  const handleAddEnquirySubmit = (e) => {
    e.preventDefault();
    if (!newEnquiry.name || !newEnquiry.phone) {
      triggerToast('Please provide a name and contact number!');
      return;
    }
    const id = enquiries.length + 1;
    const newEntry = {
      id,
      name: newEnquiry.name,
      course: newEnquiry.course,
      type: 'New',
      color: 'bg-blue-100 text-blue-800',
      phone: newEnquiry.phone,
      email: newEnquiry.email || 'N/A'
    };
    setEnquiries(prev => [newEntry, ...prev]);
    setShowAddEnquiry(false);
    setNewEnquiry({ name: '', course: 'Class 9 — All Subjects', phone: '', email: '' });
    triggerToast(`Enquiry for ${newEntry.name} added to pipeline.`);
  };

  // Communication Actions
  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!announceInput.title || !announceInput.text) {
      triggerToast('Please enter a title and message!');
      return;
    }
    const id = announcements.length + 1;
    const newAnn = {
      ...announceInput,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    
    const newAlert = {
      id: notifications.length + 1,
      text: `Announcement: ${newAnn.title}`,
      time: 'Just now',
      isNew: true
    };
    setNotifications(prev => [newAlert, ...prev]);
    setAnnounceInput({ title: '', target: 'All Students & Teachers', priority: 'Medium', text: '' });
    triggerToast('Broadcast announcement published!');
  };

  // Settings Actions
  const handleSaveSettings = (e) => {
    e.preventDefault();
    triggerToast('Centre configurations saved successfully.');
  };

  // Reports Actions
  const simulateReportDownload = (type) => {
    if (type === 'PDF') {
      setExportingPDF(true);
      setTimeout(() => {
        setExportingPDF(false);
        triggerToast('PDF Report downloaded successfully!');
      }, 1200);
    } else {
      setExportingCSV(true);
      setTimeout(() => {
        setExportingCSV(false);
        triggerToast('CSV Data exported successfully!');
      }, 1200);
    }
  };

  // Sub-views implementations
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <h3 className="text-2xl font-black text-slate-800 mt-0.5">{students.length + 841}</h3>
            </div>
          </div>
          <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>12%</span>
          </div>
        </div>

        {/* Verified Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Teachers</p>
              <h3 className="text-2xl font-black text-slate-800 mt-0.5">{teachers.filter(t => t.status === 'Verified').length}</h3>
            </div>
          </div>
          <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Active</span>
          </div>
        </div>

        {/* Fee Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Collected</p>
              <h3 className="text-2xl font-black text-slate-800 mt-0.5">₹4,82,000</h3>
            </div>
          </div>
          <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>8%</span>
          </div>
        </div>

        {/* Teachers Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teachers Today</p>
              <h3 className="text-2xl font-black text-slate-800 mt-0.5">{teachers.length} <span className="text-xs font-bold text-slate-400">/ {teachers.length}</span></h3>
            </div>
          </div>
          <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>2%</span>
          </div>
        </div>

      </div>

      {/* Row 1 Layout: Today's Home Tuitions & Pending Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Home Tuitions Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Today's Home Tuitions</h3>
            <button 
              onClick={() => setActiveTab('Attendance')}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors flex items-center cursor-pointer"
            >
              <span>View Attendance</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {[
              { time: '09:00 AM - 10:00 AM', subject: 'Class 3 — Maths & English', teacher: 'Mr. Rohan Das', status: 'ONGOING', badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
              { time: '11:00 AM - 12:00 PM', subject: 'Class 7 — Science', teacher: 'Prof. Amit Verma', status: 'UPCOMING', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100' },
              { time: '04:00 PM - 05:00 PM', subject: 'Class 9 — Mathematics', teacher: 'Dr. Satish Sharma', status: 'UPCOMING', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100' },
              { time: '05:30 PM - 06:30 PM', subject: 'Class 5 — Hindi', teacher: 'Mrs. S. Iyer', status: 'UPCOMING', badgeColor: 'bg-amber-50 text-amber-600 border border-amber-100' }
            ].map((c, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" style={{ backgroundColor: c.status === 'ONGOING' ? '#10b981' : c.status === 'UPCOMING' ? '#f59e0b' : '#94a3b8' }}></div>
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-slate-700 block sm:inline mr-2">{c.time}</span>
                    <span className="text-xs font-black text-slate-800 truncate">{c.subject}</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Instructor: {c.teacher}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex-shrink-0 ${c.badgeColor}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Teacher Verifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Pending Verifications</h3>
          
          <div className="space-y-3 mt-4">
            {teachers.filter(t => t.status === 'Pending').length > 0 ? (
              teachers.filter(t => t.status === 'Pending').map(t => (
                <div key={t.id} className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl">
                  <span className="font-extrabold text-xs text-slate-800 block">{t.name}</span>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">{t.subject} • Documents under review</p>
                  <button
                    onClick={() => setActiveTab('Teachers')}
                    className="mt-2 text-[10px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                  >
                    Review documents →
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">All teachers verified.</p>
            )}
          </div>

          <div className="space-y-3 mt-4 pt-4 border-t border-slate-50">
            {[
              { name: 'Student Attendance', val: '92%', progress: 92, color: 'bg-primary-500' },
              { name: 'Fee Regularity', val: '78%', progress: 78, color: 'bg-amber-500' },
              { name: 'Parent Feedback', val: '88%', progress: 88, color: 'bg-emerald-500' }
            ].map((p, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>{p.name}</span>
                  <span className="text-slate-700 font-extrabold">{p.val}</span>
                </div>
                <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full transition-all duration-500`} style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2 Layout: Demo Requests & Fee Defaulters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Demo Booking Requests */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Demo Booking Requests</h3>
          </div>

          <div className="space-y-3">
            {enquiries.filter(e => e.type !== 'Enrolled').map((e) => (
              <div key={e.id} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl transition-all flex flex-col space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">{e.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${e.color}`}>
                    {e.type}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{e.course}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Defaulters List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Fee Defaulters</h3>

          <div className="divide-y divide-slate-50">
            {defaulters.filter(d => d.status === 'Pending' || d.status === 'Sent').map(d => (
              <div key={d.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800">{d.name}</h4>
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5">Overdue: {d.amount}</p>
                </div>
                <button
                  onClick={() => d.status === 'Pending' && sendReminder(d.id, d.name)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                    d.status === 'Pending'
                      ? 'border border-slate-200 hover:border-primary-500 text-slate-600 hover:text-primary-600 bg-white hover:bg-primary-50/20'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                  }`}
                >
                  {d.status === 'Pending' ? (
                    <span>Send Reminder</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Sent</span>
                    </>
                  )}
                </button>
              </div>
            ))}
            {defaulters.filter(d => d.status === 'Pending' || d.status === 'Sent').length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No outstanding fee defaulters.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );

  const renderStudents = () => {
    const filteredStudents = students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.parentName.toLowerCase().includes(studentSearch.toLowerCase());
      const matchBatch = studentBatchFilter === 'All' || s.batch === studentBatchFilter;
      const matchStatus = studentStatusFilter === 'All' || s.status === studentStatusFilter;
      return matchSearch && matchBatch && matchStatus;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, emails, parent..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-full"
              />
            </div>
            <select
              value={studentBatchFilter}
              onChange={(e) => setStudentBatchFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="All">All Classes</option>
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={studentStatusFilter}
              onChange={(e) => setStudentStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddStudent(true)}
            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Student</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Batch</th>
                  <th className="py-4 px-6">Parent Name</th>
                  <th className="py-4 px-6">Enrolment Date</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-slate-400 font-bold">No students found matching criteria.</td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-extrabold text-slate-800">{student.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{student.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-[10px] font-bold">
                          {student.batch}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-bold">{student.parentName}</td>
                      <td className="py-4 px-6 text-slate-500 font-bold">{student.date}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          student.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => toggleStudentStatus(student.id, student.name)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer text-[10px]"
                        >
                          {student.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTeachers = () => {
    const filteredTeachers = teachers.filter(t => 
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
    );
    const pendingTeachers = teachers.filter(t => !areAllDocsApproved(t.id) || t.status === 'Pending');

    return (
      <div className="space-y-6">
        {/* Pending Verification Alert Banner */}
        {pendingTeachers.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-grow">
              <p className="text-xs font-black text-amber-900 uppercase tracking-wide">⚠️ Document Verification Required</p>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                {pendingTeachers.map(t => t.name).join(', ')} — credential documents are pending admin review. Parents cannot see a verified badge until all docs are approved.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-black rounded-full shrink-0">
              {pendingTeachers.length} Pending
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search teachers, subjects..."
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map(teacher => {
            const allDocsOk = areAllDocsApproved(teacher.id);
            return (
            <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow text-left">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                    {allDocsOk && teacher.status === 'Verified' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      {teacher.name}
                      {allDocsOk && teacher.status === 'Verified' && (
                        <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-black px-1.5 py-0.5 rounded tracking-wide">✓ VERIFIED</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold">{teacher.subject} Specialist</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  teacher.status === 'Verified' && allDocsOk ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {teacher.status === 'Verified' && allDocsOk ? 'Verified' : 'Pending Docs'}
                </span>
              </div>

              {/* Doc status mini pills */}
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(teacherDocStatus[teacher.id] || {}).map(([key, val]) => (
                  <span key={key} className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    val === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                  }`}>
                    {key === 'degree' ? '🎓 Degree' : key === 'aadhar' ? '🪪 Aadhar' : key === 'experience' ? '📄 Exp. Letter' : '🛡️ Police Check'}: {val === 'Approved' ? '✓' : '⏳'}
                  </span>
                ))}
              </div>

              <div className="border-t border-b border-slate-50 py-3 text-[11px] font-semibold text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-slate-700 font-bold">{teacher.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hourly Billing:</span>
                  <span className="text-slate-700 font-bold">{teacher.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="text-slate-800 font-extrabold">★ {teacher.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Batches:</span>
                  <span className="text-slate-700 font-bold">{teacher.batches.join(', ')}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => toggleTeacherVerification(teacher.id, teacher.name)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                    teacher.status === 'Verified'
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100/30'
                  }`}
                >
                  {teacher.status === 'Verified' ? 'Revoke Verify' : 'Verify Partner'}
                </button>
                <button
                  onClick={() => setSelectedTeacherDocs(teacher)}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 hover:text-blue-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Review Docs
                </button>
              </div>
            </div>
          )})}
        </div>
      </div>
    );
  };



  const renderAttendance = () => {
    const activeBatchStudents = students.filter(s => s.batch === attendanceFilter.batch);

    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-5 gap-4">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Systemic Attendance Register</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Select batch and date to view logs</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={attendanceFilter.batch}
              onChange={(e) => setAttendanceFilter(prev => ({ ...prev, batch: e.target.value }))}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="date"
              value={attendanceFilter.date}
              onChange={(e) => setAttendanceFilter(prev => ({ ...prev, date: e.target.value }))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Enrolled</span>
            <span className="text-xl font-black text-slate-800 mt-1 block">{activeBatchStudents.length}</span>
          </div>
          <div className="text-center border-l border-slate-200/60">
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider block">Present</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">
              {activeBatchStudents.filter(s => attendanceLogs[s.id] === 'Present').length}
            </span>
          </div>
          <div className="text-center border-l border-slate-200/60">
            <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider block">Absent</span>
            <span className="text-xl font-black text-rose-600 mt-1 block">
              {activeBatchStudents.filter(s => attendanceLogs[s.id] === 'Absent').length}
            </span>
          </div>
          <div className="text-center border-l border-slate-200/60">
            <span className="text-[10px] text-primary-500 font-black uppercase tracking-wider block">Rate</span>
            <span className="text-xl font-black text-primary-600 mt-1 block">
              {activeBatchStudents.length > 0 
                ? `${Math.round((activeBatchStudents.filter(s => attendanceLogs[s.id] === 'Present').length / activeBatchStudents.length) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeBatchStudents.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold text-xs">No active students registered under this batch.</div>
          ) : (
            activeBatchStudents.map(student => {
              const status = attendanceLogs[student.id] || 'Present';
              return (
                <div key={student.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      status === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{student.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAttendanceLogs(prev => ({ ...prev, [student.id]: 'Present' }))}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        status === 'Present'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => setAttendanceLogs(prev => ({ ...prev, [student.id]: 'Absent' }))}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        status === 'Absent'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {activeBatchStudents.length > 0 && (
          <div className="pt-2 text-right">
            <button
              onClick={() => triggerToast(`Attendance sheet saved for ${attendanceFilter.batch} on ${attendanceFilter.date}!`)}
              className="btn-primary py-2 px-5 rounded-xl text-xs font-bold cursor-pointer"
            >
              Save Attendance Sheet
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTestsAndResults = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">Academics & Tests Registry</h3>
          <button
            onClick={() => setShowPublishTest(true)}
            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Publish Test Results</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {tests.map(test => (
            <div key={test.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{test.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Batch: {test.batch} | Date: {test.date}</p>
                  </div>
                  <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    {test.avgScore} Class Avg
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl text-[11px] font-semibold text-slate-600 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Summary</div>
                  <div className="flex justify-between text-slate-700">
                    <span>Target Class:</span>
                    <span className="font-extrabold text-slate-800">{test.batch}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Average Marks:</span>
                    <span className="font-extrabold text-slate-800">{test.avgScore}</span>
                  </div>
                </div>
              </div>

              <div className="text-right pt-2 border-t border-slate-50">
                <button
                  onClick={() => setSelectedTest(test)}
                  className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors flex items-center justify-end cursor-pointer ml-auto"
                >
                  <span>View Test Details</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeeManagement = () => {
    const activeDefaulters = defaulters.filter(d => d.status === 'Pending' || d.status === 'Sent');
    const totalDefaultersAmount = activeDefaulters.reduce((acc, d) => {
      const numeric = parseInt(d.amount.replace(/[^\d]/g, ''), 10);
      return acc + numeric;
    }, 0);

    return (
      <div className="space-y-6 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Collection target</span>
            <h3 className="text-2xl font-black text-slate-800">₹6,00,000</h3>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>Progress (80%)</span>
                <span className="text-slate-700 font-extrabold">₹4,82,000 collected</span>
              </div>
              <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Outstanding defaulters</span>
            <div>
              <h3 className="text-2xl font-black text-rose-500">₹{totalDefaultersAmount.toLocaleString('en-IN')}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1">{activeDefaulters.length} outstanding accounts</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Transaction Success</span>
            <div>
              <h3 className="text-2xl font-black text-emerald-500">97.8%</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1">4 failures logged this cycle</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-black text-slate-800 tracking-tight">Accounts Defaulters list</h3>
            
            <div className="divide-y divide-slate-100">
              {activeDefaulters.length === 0 ? (
                <div className="py-10 text-center text-slate-400 font-bold text-xs">All center students are fully paid!</div>
              ) : (
                activeDefaulters.map(d => (
                  <div key={d.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{d.name}</h4>
                      <p className="text-[10px] text-rose-500 font-bold mt-1">Overdue balance: {d.amount}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => d.status === 'Pending' && sendReminder(d.id, d.name)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                          d.status === 'Pending'
                            ? 'border-slate-200 hover:border-primary-500 text-slate-600 hover:text-primary-600 bg-white hover:bg-primary-50/20'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100 cursor-default'
                        }`}
                      >
                        {d.status === 'Pending' ? 'Send Reminder' : 'Reminder Sent'}
                      </button>
                      <button
                        onClick={() => handleRecordPayment(d.id, d.name, d.amount)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] transition-all cursor-pointer shadow shadow-emerald-500/10 hover:shadow-md"
                      >
                        Record Pay
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-black text-slate-800 tracking-tight">Recent ledger transactions</h3>
            
            <div className="space-y-3">
              {recentPayments.map(p => (
                <div key={p.id} className="p-3 bg-slate-50/50 border border-slate-100/50 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{p.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1">{p.date} | via {p.method}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800">{p.amount}</span>
                    <span className={`block text-[8px] font-black uppercase tracking-wider mt-0.5 ${
                      p.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const renderEnquiriesCRM = () => {
    const filteredCRM = enquiries.filter(e => 
      e.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
      e.course.toLowerCase().includes(crmSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search enquiries by name or course..."
              value={crmSearch}
              onChange={(e) => setCrmSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-full"
            />
          </div>
          <button
            onClick={() => setShowAddEnquiry(true)}
            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>New Enquiry</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {['New', 'Follow-up', 'Enrolled'].map((stage) => {
            const stageItems = filteredCRM.filter(e => e.type === stage);
            const headerColor = stage === 'New' ? 'text-blue-500 bg-blue-50' : stage === 'Follow-up' ? 'text-amber-500 bg-amber-50' : 'text-emerald-500 bg-emerald-50';

            return (
              <div key={stage} className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200/40 pb-2.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{stage} Stage</h4>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${headerColor}`}>{stageItems.length}</span>
                </div>

                <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[500px]">
                  {stageItems.length === 0 ? (
                    <div className="text-center text-[10px] text-slate-400 py-10 font-bold">No leads in this stage.</div>
                  ) : (
                    stageItems.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm space-y-3 hover:shadow-md transition-shadow relative">
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-800">{item.name}</h5>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Interested: {item.course}</p>
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 space-y-0.5 border-t border-slate-50 pt-2">
                          <div>Tel: {item.phone}</div>
                          <div>Email: {item.email}</div>
                        </div>

                        {stage !== 'Enrolled' && (
                          <div className="pt-1 text-right">
                            <button
                              onClick={() => handleMoveEnquiry(item.id, item.name, item.type, item.course, item.email)}
                              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center ml-auto"
                            >
                              <span>{stage === 'New' ? 'Move to Follow-up' : 'Enrol Student'}</span>
                              <ChevronRight className="w-3 h-3 ml-0.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const renderReports = () => {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-8 text-left">
        <div>
          <h3 className="text-base font-black text-slate-800 tracking-tight">System performance analytics</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Historical parameters & reporting registries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-50 pb-6">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Key indicators overview</h4>
            
            {[
              { name: 'Average Student Attendance', val: '92%', progress: 92, color: 'bg-primary-500' },
              { name: 'Fee Collection Progress', val: '80%', progress: 80, color: 'bg-emerald-500' },
              { name: 'Average Exam Pass Rate', val: '85%', progress: 85, color: 'bg-primary-600' },
              { name: 'Student Retention Index', val: '96%', progress: 96, color: 'bg-indigo-500' }
            ].map((p, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>{p.name}</span>
                  <span className="text-slate-800 font-black">{p.val}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full transition-all duration-500`} style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Simulated batch reports generation</h4>
              <p className="text-slate-400 text-xs font-semibold mt-1">Export academic assessments, registration spreadsheets, parent feedback indicators, and collection lists locally.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => simulateReportDownload('PDF')}
                disabled={exportingPDF}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {exportingPDF ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4.5 h-4.5" />
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>

              <button
                onClick={() => simulateReportDownload('CSV')}
                disabled={exportingCSV}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {exportingCSV ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                    <span>Exporting Excel...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4.5 h-4.5" />
                    <span>Export CSV Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Academic session logs</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Best Class Average', val: '82%', desc: 'Class 1-5 Primary A1 leads assessment averages.' },
              { title: 'New Admissions', val: '+4 enrolled', desc: 'Admission conversion up by 15% this quarter.' }
            ].map((card, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{card.title}</span>
                <span className="text-lg font-black text-slate-800 mt-1 block">{card.val}</span>
                <span className="text-[10px] text-slate-500 font-medium mt-1 block leading-normal">{card.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const renderCommunications = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">System Broadcaster Center</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Publish notices & alerts to platform users</p>
          </div>

          <form onSubmit={handlePublishAnnouncement} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Term 1 Exam Schedule"
                  value={announceInput.title}
                  onChange={(e) => setAnnounceInput(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Audience Target</label>
                <select
                  value={announceInput.target}
                  onChange={(e) => setAnnounceInput(prev => ({ ...prev, target: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                >
                  <option value="All Students & Teachers">All Students & Teachers</option>
                  <option value="All Students">All Students</option>
                  <option value="All Teachers">All Teachers</option>
                  <option value="All Parents">All Parents</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Notice priority</label>
              <div className="flex space-x-3">
                {['Low', 'Medium', 'High'].map(priority => (
                  <label key={priority} className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-600">
                    <input
                      type="radio"
                      name="priority"
                      checked={announceInput.priority === priority}
                      onChange={() => setAnnounceInput(prev => ({ ...prev, priority }))}
                      className="rounded-full text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
                    />
                    <span>{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Announcement Text Body</label>
              <textarea
                required
                value={announceInput.text}
                onChange={(e) => setAnnounceInput(prev => ({ ...prev, text: e.target.value }))}
                className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700 font-semibold"
                placeholder="Broadcast important details here..."
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="btn-primary py-2 px-5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer ml-auto"
              >
                <Megaphone className="w-4 h-4" />
                <span>Publish Announcement</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-black text-slate-800 tracking-tight">Announcements registry</h3>
          
          <div className="space-y-4 overflow-y-auto max-h-[400px]">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 space-y-2 text-left relative">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-xs text-slate-800 max-w-[70%]">{ann.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    ann.priority === 'High' ? 'bg-rose-100 text-rose-800' : ann.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {ann.priority}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-normal">{ann.text}</p>
                <div className="flex justify-between text-[9px] text-slate-400 font-bold pt-1 border-t border-slate-200/40">
                  <span>To: {ann.target}</span>
                  <span>{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-3xl mx-auto text-left">
        <div>
          <h3 className="text-base font-black text-slate-800 tracking-tight">System configuration settings</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Configure general center profile details</p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Centre Brand Name</label>
              <input
                type="text"
                required
                value={settings.centreName}
                onChange={(e) => setSettings(prev => ({ ...prev, centreName: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Contact Email address</label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Contact Phone number</label>
              <input
                type="text"
                required
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Academic Session</label>
              <input
                type="text"
                required
                value={settings.session}
                onChange={(e) => setSettings(prev => ({ ...prev, session: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Physical address</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
            />
          </div>

          <div className="border-t border-slate-50 pt-5 space-y-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Automation & parameters</h4>
            
            {[
              { key: 'autoReminders', label: 'Auto-dispatch overdue fee reminders', desc: 'Sends notifications to parent handles on balance thresholds.' },
              { key: 'emailAlerts', label: 'Email notification dispatches', desc: 'Allows the system to broadcast notices to teacher/student inbox.' },
              { key: 'whatsappSync', label: 'WhatsApp messaging synchronization', desc: 'Syncs enquiry pipeline updates to registered numbers.' }
            ].map(toggle => (
              <div key={toggle.key} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="max-w-[75%]">
                  <h5 className="font-extrabold text-xs text-slate-800">{toggle.label}</h5>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">{toggle.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200 cursor-pointer shrink-0 text-[10px] font-black uppercase tracking-wider"
                >
                  {settings[toggle.key] ? (
                    <span className="text-emerald-600">Active</span>
                  ) : (
                    <span className="text-slate-500">Disabled</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="text-right pt-2">
            <button
              type="submit"
              className="btn-primary py-2 px-5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer ml-auto"
            >
              <Save className="w-4 h-4" />
              <span>Save Configurations</span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderHelp = () => {
    return (
      <div className="space-y-6 text-left">
        {/* Header and Search */}
        <div className="bg-gradient-to-br from-primary-500/10 to-secondary-500/10 p-6 rounded-3xl border border-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Cograd Pathshala Help Center</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Access system guides, FAQs, and submit developer tickets</p>
          </div>
        </div>

        {/* Quick Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Student Onboarding', desc: 'Manage profiles, change status, and update active batch counts.', icon: Users },
            { title: 'Teacher Verification', desc: 'Vetting credential documents, approving profiles, and billing configurations.', icon: GraduationCap },
            { title: 'Batch Scheduling', desc: 'Creating courses, scheduling class slots, and assigning verified teachers.', icon: BookOpen },
            { title: 'Ledger & Defaulters', desc: 'Manual payment recordings, balance tracking, and auto-reminders.', icon: CreditCard }
          ].map((topic, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <topic.icon className="w-5 h-5 text-primary-500" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-800">{topic.title}</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ and Ticket form split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQs Accordion */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-base font-black text-slate-800 tracking-tight">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              {[
                { q: 'How do I verify a new teacher partner?', a: 'Navigate to the Teachers tab, click on "Docs" next to the teacher\'s name to review their credentials, and then click "Verify Partner" to activate their portal access.' },
                { q: 'What happens when I complete enrollment for a CRM enquiry lead?', a: 'The lead is marked as Enrolled. The system automatically registers a new student record in the Students portal.' },
                { q: 'Can I disable automatic fee reminders?', a: 'Yes. Go to the Settings tab, scroll down to Automation & parameters, toggle off the "Auto-dispatch overdue fee reminders" option, and save configurations.' }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl transition-all space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-800 flex items-start space-x-2">
                    <span className="text-primary-500 shrink-0">Q.</span>
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed pl-4">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Raise Support Ticket Form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Submit Help Ticket</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Get developer assistance</p>
              </div>

              <form onSubmit={handleRaiseTicketSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Ticket Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Error exporting CSV data"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Billing & Invoicing">Billing & Invoicing</option>
                    <option value="Portal Bug / Defect">Portal Bug / Defect</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700 font-semibold"
                    placeholder="Describe your issue..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Submit Ticket
                </button>
              </form>
            </div>

            {/* Raised Tickets Log */}
            {tickets.length > 0 && (
              <div className="border-t border-slate-50 pt-4 mt-2 space-y-2 max-h-[150px] overflow-y-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-left">Your open tickets ({tickets.length})</span>
                <div className="space-y-2">
                  {tickets.map(t => (
                    <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-[10px] font-bold">
                      <div className="text-left">
                        <span className="text-slate-800 block truncate max-w-[120px]">{t.title}</span>
                        <span className="text-slate-400 text-[9px] font-medium">{t.category}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholder = (title) => (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center py-20 animate-fade-in max-w-3xl mx-auto space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
        <Sliders className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-800 tracking-tight">{title} Portal</h3>
        <p className="text-slate-400 text-xs font-bold mt-1.5 leading-relaxed">Access administrative registers, batch details, and systemic parameters.</p>
      </div>
      <button 
        onClick={() => {
          triggerToast(`Simulating details in ${title}...`);
        }}
        className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
      >
        Refresh Registry
      </button>
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case 'Dashboard': return renderDashboard();
      case 'Students': return renderStudents();
      case 'Teachers': return renderTeachers();
      case 'Attendance': return renderAttendance();
      case 'Tests & Results': return renderTestsAndResults();
      case 'Fee Management': return renderFeeManagement();
      case 'Settings': return renderSettings();
      case 'Help': return renderHelp();
      default:
        return renderPlaceholder(activeTab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative overflow-hidden admin-page-enter">
      
      {/* Action Toast Alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl flex items-center space-x-2.5 shadow-2xl animate-slide-up border border-slate-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold tracking-tight">{toastMessage}</span>
        </div>
      )}



      {/* Student Form Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <Users className="w-5 h-5 text-primary-600" />
                <span>Register New Student</span>
              </h3>
              <button onClick={() => setShowAddStudent(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Siddharth Sen"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="E.g. sid@gmail.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Parent Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Siddharth Malhotra"
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, parentName: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Assign Class</label>
                <select
                  value={newStudent.batch}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, batch: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                >
                  {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowAddStudent(false)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow shadow-primary-500/10 cursor-pointer">
                  Enrol Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enquiry Form Modal */}
      {showAddEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <MessageSquare className="w-5 h-5 text-primary-600" />
                <span>Log New Enquiry Lead</span>
              </h3>
              <button onClick={() => setShowAddEnquiry(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEnquirySubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Applicant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Priya Sharma"
                  value={newEnquiry.name}
                  onChange={(e) => setNewEnquiry(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Contact Number</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. +91 94444 88888"
                  value={newEnquiry.phone}
                  onChange={(e) => setNewEnquiry(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="E.g. priya.sh@gmail.com"
                  value={newEnquiry.email}
                  onChange={(e) => setNewEnquiry(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Interested Program</label>
                <select
                  value={newEnquiry.course}
                  onChange={(e) => setNewEnquiry(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                >
                  <option value="Class 1 — All Subjects">Class 1 — All Subjects</option>
                  <option value="Class 2 — All Subjects">Class 2 — All Subjects</option>
                  <option value="Class 3 — All Subjects">Class 3 — All Subjects</option>
                  <option value="Class 4 — All Subjects">Class 4 — All Subjects</option>
                  <option value="Class 5 — All Subjects">Class 5 — All Subjects</option>
                  <option value="Class 6 — All Subjects">Class 6 — All Subjects</option>
                  <option value="Class 7 — All Subjects">Class 7 — All Subjects</option>
                  <option value="Class 8 — All Subjects">Class 8 — All Subjects</option>
                  <option value="Class 9 — All Subjects">Class 9 — All Subjects</option>
                  <option value="Class 10 — Maths & Science">Class 10 — Maths & Science</option>
                  <option value="Class 11 — Science Stream">Class 11 — Science Stream</option>
                  <option value="Class 12 — All Subjects">Class 12 — All Subjects</option>
                  <option value="Class 10 CBSE Maths">Class 10 CBSE Maths</option>
                  <option value="Foundation Physics">Foundation Physics</option>
                  <option value="Computer Science CS1">Computer Science CS1</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowAddEnquiry(false)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow shadow-primary-500/10 cursor-pointer">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Test Results Modal */}
      {showPublishTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <CheckSquare className="w-5 h-5 text-primary-600" />
                <span>Publish Academic Test Results</span>
              </h3>
              <button onClick={() => setShowPublishTest(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishTestSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Test Assessment Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. JEE Physics Mock 5"
                  value={newTest.name}
                  onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Target Batch</label>
                  <select
                    value={newTest.batch}
                    onChange={(e) => setNewTest(prev => ({ ...prev, batch: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                  >
                    {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Conducted Date</label>
                  <input
                    type="date"
                    required
                    value={newTest.date}
                    onChange={(e) => setNewTest(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Class Average Score (%)</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 78%"
                    value={newTest.avgScore}
                    onChange={(e) => setNewTest(prev => ({ ...prev, avgScore: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Topper Score (%)</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 98%"
                    value={newTest.topScore}
                    onChange={(e) => setNewTest(prev => ({ ...prev, topScore: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Toppers List (comma-separated)</label>
                <input
                  type="text"
                  placeholder="E.g. Sanya Sen (98%), Varun Dhawan (95%)"
                  value={newTest.toppers}
                  onChange={(e) => setNewTest(prev => ({ ...prev, toppers: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowPublishTest(false)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow shadow-primary-500/10 cursor-pointer">
                  Publish Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leaderboard Details Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <span>Test Performance details</span>
              </h3>
              <button onClick={() => setSelectedTest(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-xs space-y-1">
                <div className="font-extrabold text-slate-800 text-sm">{selectedTest.name}</div>
                <div className="text-slate-500">Target Batch: {selectedTest.batch}</div>
                <div className="text-slate-500">Conducted on: {selectedTest.date}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Class Average</span>
                    <span className="text-xl font-black text-primary-600 mt-1 block">{selectedTest.avgScore}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Top Mark</span>
                    <span className="text-xl font-black text-emerald-600 mt-1 block">{selectedTest.topScore}</span>
                  </div>
                </div>

              <button onClick={() => setSelectedTest(null)} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer text-center">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Verification Documents Modal — Full Per-Doc Control */}
      {selectedTeacherDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-lg w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                <span>Document Verification Portal</span>
              </h3>
              <button onClick={() => setSelectedTeacherDocs(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-left">
              {/* Teacher Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 text-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-base shrink-0">
                  {selectedTeacherDocs.name.charAt(0)}
                </div>
                <div>
                  <div className="font-extrabold text-slate-800 text-sm">{selectedTeacherDocs.name}</div>
                  <div className="text-slate-500 mt-0.5">{selectedTeacherDocs.subject} Specialist</div>
                  <div className="mt-1">
                    {areAllDocsApproved(selectedTeacherDocs.id) ? (
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">🛡️ All documents cleared</span>
                    ) : (
                      <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">⚠️ Documents pending review</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Per-Document Verification Controls */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credential Documents — Click to Toggle Status</h5>
                
                {[
                  { key: 'degree', label: 'Academic Degree Certificate', icon: '🎓', info: 'M.Sc / B.Ed / Graduation proof from university' },
                  { key: 'aadhar', label: 'Aadhaar Identity Card', icon: '🪪', info: 'UIDAI 12-digit unique ID verification' },
                  { key: 'experience', label: 'Experience Letter', icon: '📄', info: 'Letter from previous institute or employer' },
                  { key: 'police', label: 'Police Verification Certificate', icon: '🛡️', info: 'Background check clearance from local authority' }
                ].map((doc) => {
                  const status = (teacherDocStatus[selectedTeacherDocs.id] || {})[doc.key] || 'Under Review';
                  const isApproved = status === 'Approved';
                  return (
                    <div key={doc.key} className={`p-3 rounded-xl border flex justify-between items-center gap-3 transition-all ${
                      isApproved ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'
                    }`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{doc.icon}</span>
                        <div className="min-w-0">
                          <h6 className="text-xs font-bold text-slate-800 truncate">{doc.label}</h6>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{doc.info}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDocStatus(selectedTeacherDocs.id, doc.key)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 border cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                          isApproved 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200'
                        }`}
                        title={isApproved ? 'Click to reject this document' : 'Click to approve this document'}
                      >
                        {isApproved ? '✓ Approved' : '⏳ Review'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Overall Action Buttons */}
              <div className="flex space-x-3 pt-1">
                {areAllDocsApproved(selectedTeacherDocs.id) && selectedTeacherDocs.status !== 'Verified' && (
                  <button
                    onClick={() => {
                      toggleTeacherVerification(selectedTeacherDocs.id, selectedTeacherDocs.name);
                      triggerToast(`${selectedTeacherDocs.name} is now a Verified Partner!`);
                      setSelectedTeacherDocs(null);
                    }}
                    className="flex-grow py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all text-center cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    🛡️ Activate Verified Badge
                  </button>
                )}
                {!areAllDocsApproved(selectedTeacherDocs.id) && (
                  <button
                    onClick={() => {
                      // Approve all docs at once
                      setTeacherDocStatus(prev => ({
                        ...prev,
                        [selectedTeacherDocs.id]: { degree: 'Approved', aadhar: 'Approved', experience: 'Approved', police: 'Approved' }
                      }));
                      triggerToast('All documents approved! You can now grant the Verified badge.');
                    }}
                    className="flex-grow py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all text-center cursor-pointer"
                  >
                    Approve All Documents
                  </button>
                )}
                <button onClick={() => setSelectedTeacherDocs(null)} className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-40 transition-transform duration-300 ease-in-out shrink-0 shadow-[1px_0_0_0_#f1f5f9] ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand area */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center shrink-0 bg-white">
            <div>
              <div className="text-lg font-black tracking-tight logo-shimmer leading-none">Cograd Pathshala</div>
              <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mt-0.5">Admin Hub</div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 py-3 space-y-0.5 overflow-y-auto flex-grow scrollbar-thin">
            {[
              { name: 'Dashboard',      icon: LayoutDashboard },
              { name: 'Students',       icon: Users },
              { name: 'Teachers',       icon: GraduationCap },
              { name: 'Attendance',     icon: UserCheck },
              { name: 'Tests & Results', icon: CheckSquare },
              { name: 'Fee Management', icon: CreditCard },
              { name: 'Settings',       icon: Settings },
            ].map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => { setActiveTab(item.name); setMobileSidebarOpen(false); }}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`sidebar-nav-icon ${isActive ? 'active' : ''}`}>
                      <IconComp className="w-[1.05rem] h-[1.05rem]" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom items */}
          <div className="px-3 pb-3 border-t border-slate-100 pt-3 space-y-0.5 shrink-0">
            <button
              onClick={() => setActiveTab('Help')}
              className={`sidebar-nav-item ${activeTab === 'Help' ? 'active' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`sidebar-nav-icon ${activeTab === 'Help' ? 'active' : ''}`}><HelpCircle className="w-[1.05rem] h-[1.05rem]" /></div>
                <span>Help Center</span>
              </div>
            </button>
            <button onClick={handleLogout} className="sidebar-nav-item text-rose-500 hover:!text-rose-700 hover:!bg-rose-50">
              <div className="flex items-center space-x-3">
                <div className="sidebar-nav-icon !bg-rose-50 !text-rose-400"><LogOut className="w-[1.05rem] h-[1.05rem]" /></div>
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN HUB CONTENT AREA */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 z-20 shrink-0 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-[1.05rem] font-bold text-slate-900 tracking-tight leading-none">
                {activeTab === 'Dashboard' ? 'Overview' : activeTab}
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium hidden sm:block">
                {activeTab === 'Dashboard' ? 'Home tuition platform overview' : `Manage ${activeTab.toLowerCase()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search…"
                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-52"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5 text-slate-600" />
                {notifications.some(n => n.isNew) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-[1.5px] border-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 animate-fade-in overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-800">Notifications</span>
                    {notifications.some(n => n.isNew) && (
                      <button onClick={() => setNotifications(p => p.map(n => ({ ...n, isNew: false })))} className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => { setNotifications(p => p.map(x => x.id === n.id ? { ...x, isNew: false } : x)); setShowNotifications(false); }}
                        className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${n.isNew ? 'bg-blue-50/40' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isNew ? 'bg-blue-500' : 'bg-slate-300'}`} />
                        <div>
                          <p className={`text-xs leading-relaxed ${n.isNew ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{n.text}</p>
                          <p className="text-[10.5px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                A
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden lg:block">Admin</span>
            </div>
          </div>
        </header>

        {/* ACTIVE TAB CONTENT */}
        <main className="flex-grow p-5 lg:p-7 overflow-y-auto max-w-[1400px] w-full mx-auto scrollbar-thin">
          <div key={activeTab} className="tab-content-enter">
            {getTabContent()}
          </div>
        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;
