import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import {
  getStudents,
  saveStudents,
  getTeachers,
  findSuggestedTeachers,
  allotTutor,
  syncWithBackend
} from '../utils/mockDb';
import { api } from '../utils/api';

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
  Search, 
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
  Download,
  Clock,
  User,
  Map,
  List
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedMatchStudent, setSelectedMatchStudent] = useState(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideTeacherSearch, setOverrideTeacherSearch] = useState('');

  
  // Notification center
  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem('cograd_admin_notifications') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Reminders sent tracking
  const [remindersSent, setRemindersSent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cograd_admin_reminders_sent') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_reminders_sent', JSON.stringify(remindersSent));
  }, [remindersSent]);
  // Enquiries List state
  const [enquiries, setEnquiries] = useState(() => {
    return JSON.parse(localStorage.getItem('cograd_admin_enquiries') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Student roster state - starts empty, populated from backend via syncWithBackend
  const [students, setStudents] = useState([]);
  const [demoBookings, setDemoBookings] = useState([]);
  const [parents, setParents] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState({});

  const handleTeacherChange = (bookingId, teacherId) => {
    setSelectedTeachers((prev) => ({
      ...prev,
      [bookingId]: teacherId,
    }));
  };

  const fetchDemoBookings = async () => {
    try {
      const bookings = await api.get('/demo-bookings');
      setDemoBookings(bookings);
    } catch (error) {
      console.error('Failed to fetch demo bookings:', error.message);
    }
  };

  const loadAdminData = () => {
    const raw = getStudents();
    const normalized = raw.map(s => ({
      ...s,
      batch: s.standard || 'Class 10',
      date: s.joinDate || '2026-06-19',
      status: s.status === 'active' ? 'Active' : s.status === 'matched' ? 'Active' : s.status === 'pending_test' ? 'Pending Test' : s.status === 'pending_match' ? 'Pending Match' : s.status
    }));
    setStudents(normalized);

    const rawTeachers = getTeachers();
    const normalizedTeachers = rawTeachers.map(t => ({
      ...t,
      subject: t.subjects_taught ? t.subjects_taught[0] : 'General',
      rate: t.hourly_rate || '₹500/hr',
      batches: t.grade_levels_qualified || ['Class 9'],
      status: t.verification_status || 'Pending'
    }));
    setTeachers(normalizedTeachers);
  };

  const fetchParents = async () => {
    try {
      const parentsData = await api.get('/parents');
      setParents(parentsData);
    } catch (error) {
      // Silent fail
    }
  };

  useEffect(() => {
    const init = async () => {
      const isCleared = localStorage.getItem('cograd_dashboards_cleared_mock');
      if (!isCleared) {
        localStorage.removeItem('cograd_admin_defaulters');
        localStorage.removeItem('cograd_admin_enquiries');
        localStorage.removeItem('cograd_admin_payments');
        localStorage.removeItem('cograd_admin_announcements');
        localStorage.removeItem('cograd_admin_tests');
        localStorage.removeItem('cograd_admin_tickets');
        localStorage.removeItem('cograd_admin_reminders_sent');
        localStorage.removeItem('cograd_admin_notifications');
        for (let i = 1; i <= 10; i++) {
          localStorage.removeItem(`cograd_teacher_timetable_${i}`);
          localStorage.removeItem(`cograd_teacher_assignments_${i}`);
          localStorage.removeItem(`cograd_teacher_submissions_${i}`);
          localStorage.removeItem(`cograd_teacher_earnings_${i}`);
        }
        localStorage.setItem('cograd_dashboards_cleared_mock', 'true');
        
        // Clear react states to keep them empty initially
        setRecentPayments([]);
        setAnnouncements([]);
        setTests([]);
        setTickets([]);
        setEnquiries([]);
      }
      await syncWithBackend();
      loadAdminData();
      await fetchDemoBookings();
      await fetchParents();
    };
    init();
  }, []);

  // Teachers state - populated from backend via syncWithBackend
  const [teachers, setTeachers] = useState([]);

  // Per-teacher document verification state (keyed by teacher id)
  const [teacherDocStatus, setTeacherDocStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('cograd_admin_teacher_doc_status');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_teacher_doc_status', JSON.stringify(teacherDocStatus));
  }, [teacherDocStatus]);

  // Synchronize dynamic documents status from backend teachers when they load
  useEffect(() => {
    if (teachers.length > 0) {
      setTeacherDocStatus(prev => {
        let updated = false;
        const next = { ...prev };
        teachers.forEach(t => {
          if (!next[t.id]) {
            const docs = t.documents || [];
            next[t.id] = {
              degree: docs.find(d => d.type === 'Academic' || d.name.includes('Degree'))?.status === 'Approved' ? 'Approved' : 'Under Review',
              aadhar: docs.find(d => d.type === 'Identity' || d.name.includes('Aadhaar'))?.status === 'Approved' ? 'Approved' : 'Under Review',
              experience: docs.find(d => d.type === 'Experience' || d.name.includes('Experience'))?.status === 'Approved' ? 'Approved' : 'Under Review'
            };
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }
  }, [teachers]);

  // Toggle individual document status for a teacher and sync back to backend
  const toggleDocStatus = async (teacherId, docKey) => {
    const currentVal = (teacherDocStatus[teacherId] || {})[docKey] || 'Under Review';
    const nextVal = currentVal === 'Approved' ? 'Under Review' : 'Approved';

    setTeacherDocStatus(prev => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] || { degree: 'Under Review', aadhar: 'Under Review', experience: 'Under Review' }),
        [docKey]: nextVal
      }
    }));

    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      const updatedDocs = (teacher.documents || []).map(d => {
        let matches = false;
        if (docKey === 'degree' && (d.type === 'Academic' || d.name.includes('Degree'))) matches = true;
        if (docKey === 'aadhar' && (d.type === 'Identity' || d.name.includes('Aadhaar'))) matches = true;
        if (docKey === 'experience' && (d.type === 'Experience' || d.name.includes('Experience'))) matches = true;
        
        if (matches) {
          return { ...d, status: nextVal === 'Approved' ? 'Approved' : 'Under Review' };
        }
        return d;
      });

      try {
        await api.put(`/teachers/${teacherId}`, { documents: updatedDocs });
        await syncWithBackend();
        loadAdminData();
      } catch (err) {
        console.error('Failed to sync document status update to backend:', err);
      }
    }
  };

  // Check if all docs for a teacher are approved
  const areAllDocsApproved = (teacherId) => {
    const docs = teacherDocStatus[teacherId];
    if (!docs) return false;
    return Object.values(docs).every(v => v === 'Approved');
  };

  // Recent payments state
  const [recentPayments, setRecentPayments] = useState(() => {
    return JSON.parse(localStorage.getItem('cograd_admin_payments') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_payments', JSON.stringify(recentPayments));
  }, [recentPayments]);

  // Announcements state
  const [announcements, setAnnouncements] = useState(() => {
    return JSON.parse(localStorage.getItem('cograd_admin_announcements') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cograd_admin_settings');
    return saved ? JSON.parse(saved) : {
      centreName: 'Sharma Classes',
      contactEmail: 'admin@sharmaclasses.edu.in',
      contactPhone: '+91 98765 43210',
      address: 'Sector 15, Dwarka, New Delhi',
      session: '2026-2027',
      currency: '₹ (INR)',
      autoReminders: true,
      emailAlerts: true,
      whatsappSync: false
    };
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_settings', JSON.stringify(settings));
  }, [settings]);

  // Tests & Results state
  const [tests, setTests] = useState(() => {
    return JSON.parse(localStorage.getItem('cograd_admin_tests') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_tests', JSON.stringify(tests));
  }, [tests]);

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
  const [tickets, setTickets] = useState(() => {
    return JSON.parse(localStorage.getItem('cograd_admin_tickets') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('cograd_admin_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const [newTicket, setNewTicket] = useState({ title: '', category: 'General Support', description: '' });

  // Derive activeDefaulters from students list and payments ledger
  const activeDefaulters = students
    .filter(s => {
      const hasPaid = recentPayments.some(p => p.name === s.name && p.status === 'Paid');
      return !hasPaid;
    })
    .map(s => ({
      id: s.id,
      name: s.name,
      amount: '₹3,000',
      status: remindersSent[s.id] ? 'Sent' : 'Pending'
    }));

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
    setRemindersSent(prev => ({ ...prev, [id]: true }));
    triggerToast(`Fee reminder dispatched to ${name}!`);
  };


  // Student actions
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) {
      triggerToast('Please fill out student name and email!');
      return;
    }
    const id = `stu_${Date.now()}`;
    const newEntry = {
      name: newStudent.name,
      email: newStudent.email,
      parentName: newStudent.parentName || 'TBD',
      standard: newStudent.batch || 'Class 9',
      subjects: ['Mathematics'],
      city: 'Meerut',
      state: 'Uttar Pradesh',
      id,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post('/students', newEntry);
      await syncWithBackend();
      loadAdminData();
      setShowAddStudent(false);
      setNewStudent({ name: '', email: '', parentName: '', batch: 'Class 9', status: 'Active' });
      triggerToast(`Student ${newEntry.name} enrolled successfully!`);
    } catch (err) {
      triggerToast(err.message || 'Failed to add student');
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        await api.delete(`/students/${id}`);
        await syncWithBackend();
        loadAdminData();
        triggerToast(`Student ${name} removed from registry.`);
      } catch (err) {
        triggerToast(err.message || 'Failed to delete student');
      }
    }
  };

  const toggleStudentStatus = async (id, name) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    const newStatus = student.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.put(`/students/${id}`, { status: newStatus });
      await syncWithBackend();
      loadAdminData();
      triggerToast(`Status toggled for ${name}.`);
    } catch (err) {
      triggerToast(err.message || 'Failed to toggle status');
    }
  };

  // Teacher actions
  const toggleTeacherVerification = async (id, name) => {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    const newStatus = teacher.status === 'Verified' ? 'Pending' : 'Verified';
    try {
      await api.put(`/teachers/${id}`, { verification_status: newStatus });
      await syncWithBackend();
      loadAdminData();
      triggerToast(`Verification toggled for ${name}.`);
    } catch (err) {
      triggerToast(err.message || 'Failed to update teacher status');
    }
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
    const newTx = {
      id: recentPayments.length + 1,
      name,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      method: 'Cash / Manual'
    };
    setRecentPayments(prev => [newTx, ...prev]);

    // Update parent's local storage data for cross-dashboard sync
    try {
      const parentDataRaw = localStorage.getItem('cograd_parent_students_data');
      if (parentDataRaw) {
        const parentData = JSON.parse(parentDataRaw);
        let updated = false;
        Object.keys(parentData).forEach(key => {
          if (parentData[key].name === name || parentData[key].id === defaulterId) {
            parentData[key].feeDue = 0;
            parentData[key].feeStatus = 'Paid';
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem('cograd_parent_students_data', JSON.stringify(parentData));
        }
      }
    } catch (e) {
      console.error('Failed to sync payment to parent local storage:', e);
    }

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
  const renderDashboard = () => {
    const pendingStudents = students.filter(s => s.status === 'pending_match');

    return (
      <div className="space-y-12 animate-fade-in text-left">
        
        {/* Row 1: Primary Action Screen - Tutor Match Queue */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Active Matching Queue</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Primary Admin Action: Match incoming students with local home tutors based on placement test scores</p>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="glow-card p-8 text-center max-w-xl">
              <span className="text-3xl">🎉</span>
              <h3 className="text-sm font-black text-slate-800 mt-3">All Student Matches Completed!</h3>
              <p className="text-xs text-slate-400 mt-1">No students are currently waiting for tutor allotment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingStudents.map(student => {
                const suggestions = findSuggestedTeachers(student);
                const scores = student.test_score || { Mathematics: 0, Science: 0 };
                
                return (
                  <div key={student.id} className="glow-card p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Student Details & Scores */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center space-x-3 text-left">
                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-slate-150" />
                        <div>
                          <h3 className="text-xs font-black text-slate-800">{student.name}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold">{student.standard} | {student.city}, {student.state || 'Choose your State'}</p>
                          <InlineGoogleMap address={`${student.city}, ${student.state || ''}`} label="Student City" />
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl text-left">
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider block mb-2">
                          Diagnostic Test Scores (Total: {scores.totalMarksText || '0/35'} Marks)
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <span className="text-[9px] text-slate-500 font-bold block">Mathematics</span>
                            <span className="text-xs font-black text-blue-600 mt-0.5 block">{scores.mathMarksText || `0/16`}</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <span className="text-[9px] text-slate-500 font-bold block">Science</span>
                            <span className="text-xs font-black text-blue-600 mt-0.5 block">{scores.scienceMarksText || `0/19`}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-2">Subjects needed: {student.subjects.join(', ')}</span>
                      </div>
                    </div>

                    {/* Right Column: Suggested Matches */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider">Suggested Local Tutors</span>
                        <span className="text-[9px] text-slate-400 font-semibold">Location matches city: {student.city}</span>
                      </div>

                      {suggestions.length === 0 ? (
                        <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                          <p className="text-xs text-slate-500 font-bold">No eligible teachers found in {student.city}.</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Ensure tutors are registered in this city and have matching subject qualifications.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {suggestions.slice(0, 3).map(({ teacher, score, reasons }) => (
                            <div key={teacher.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div className="flex items-center space-x-3 text-left">
                                <img src={teacher.avatar} alt={teacher.name} className="w-8 h-8 rounded-full object-cover" />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-xs font-black text-slate-800">{teacher.name}</h4>
                                    <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-black uppercase">Verified</span>
                                  </div>
                                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                                    {teacher.experience} Exp | {teacher.qualification}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {reasons.map((r, ri) => (
                                      <span key={ri} className="bg-blue-50/70 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-full">{r}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-right sm:mr-1">
                                  <span className="text-[10px] text-slate-400 font-bold block">Compatibility</span>
                                  <span className="text-xs font-black text-blue-600 block">{score}% Match</span>
                                </div>
                                <button
                                  onClick={() => {
                                    allotTutor(student.id, teacher.id);
                                    triggerToast(`Proposed match: Allotted ${teacher.name} to ${student.name}. Pending teacher confirmation.`);
                                    loadAdminData();
                                  }}
                                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-xl shadow-sm transition-all cursor-pointer border-0"
                                >
                                  Allot Tutor
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Row 2: Secondary Summary Strip - Overall Stats */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Overall Platform Stats</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100/50' },
              { title: 'Verified Tutors', value: teachers.filter(t => t.verification_status === 'Verified').length, icon: GraduationCap, color: 'bg-purple-50 text-purple-600 border-purple-100/50' },
              { title: 'Active Matches', value: students.filter(s => s.status === 'active').length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100/50' },
              { title: 'Pending Allotments', value: pendingStudents.length, icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100/50' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`p-6 glow-card flex items-center space-x-4 transition-all duration-300 ${stat.color}`} style={{ '--glow-gradient': stat.title.includes('Students') ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' : stat.title.includes('Tutors') ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : stat.title.includes('Active') ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                  <div className="p-2 rounded-xl bg-white shadow-sm relative z-20">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider relative z-20">{stat.title}</span>
                    <span className="text-base font-black text-slate-800 block mt-0.5 relative z-20">{stat.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Row 3: Management Tools (Separate Section) */}
        <section className="glow-card p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-800">Quick Platform Management</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Admin tools to override and manage rosters</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveTab('Teachers')}
              className="p-6 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl text-left flex flex-col justify-between h-36 cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-700 block">Manage & Verify Teachers</span>
                <span className="text-[9px] text-slate-400 mt-1 block">Verify teacher registrations and qualifications</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('Students')}
              className="p-6 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl text-left flex flex-col justify-between h-36 cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-700 block">View All Students</span>
                <span className="text-[9px] text-slate-400 mt-1 block">Roster list and active assignments tracker</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/register/teacher')}
              className="p-6 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl text-left flex flex-col justify-between h-36 cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-700 block">Register New Teacher</span>
                <span className="text-[9px] text-slate-400 mt-1 block">Create a verified teacher profile for matching</span>
              </div>
            </button>
          </div>
        </section>

      </div>
    );
  };

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
            <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow text-left min-w-0 overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center space-x-3 min-w-0">
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
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 truncate">
                      {teacher.name}
                      {allDocsOk && teacher.status === 'Verified' && (
                        <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-black px-1.5 py-0.5 rounded tracking-wide shrink-0">✓ VERIFIED</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold truncate">{teacher.subject} Specialist</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                  teacher.status === 'Verified' && allDocsOk ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {teacher.status === 'Verified' && allDocsOk ? 'Verified' : 'Pending Docs'}
                </span>
              </div>

              {/* Doc status mini pills */}
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(teacherDocStatus[teacher.id] || {}).map(([key, val]) => (
                  <span key={key} className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${
                    val === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                  }`}>
                    {key === 'degree' ? '🎓 Degree' : key === 'aadhar' ? '🪪 Aadhar' : '📄 Exp. Letter'}: {val === 'Approved' ? '✓' : '⏳'}
                  </span>
                ))}
              </div>

              <div className="border-t border-b border-slate-50 py-3 text-[11px] font-semibold text-slate-500 space-y-2 min-w-0">
                <div className="flex justify-between gap-2 min-w-0">
                  <span className="shrink-0">Email:</span>
                  <span className="text-slate-700 font-bold truncate" title={teacher.email}>{teacher.email}</span>
                </div>
                <div className="flex justify-between gap-2 min-w-0">
                  <span className="shrink-0">Hourly Billing:</span>
                  <span className="text-slate-700 font-bold truncate">{teacher.rate}</span>
                </div>
                <div className="flex justify-between gap-2 min-w-0">
                  <span className="shrink-0">Rating:</span>
                  <span className="text-slate-800 font-extrabold shrink-0">★ {teacher.rating}</span>
                </div>
                <div className="flex justify-between gap-2 min-w-0">
                  <span className="shrink-0">Active Batches:</span>
                  <span className="text-slate-700 font-bold truncate" title={teacher.batches.join(', ')}>{teacher.batches.join(', ')}</span>
                </div>
                <div className="flex justify-between gap-2 min-w-0">
                  <span className="shrink-0">Base Location:</span>
                  <span className="text-slate-700 font-bold truncate">{teacher.city || 'Meerut'}</span>
                </div>
                <div>
                  <InlineGoogleMap address={teacher.city || 'Meerut'} label="Tutor Location" />
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
          <div className="text-center sm:border-l sm:border-slate-200/60 border-l-0">
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider block">Present</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">
              {activeBatchStudents.filter(s => attendanceLogs[s.id] === 'Present').length}
            </span>
          </div>
          <div className="text-center sm:border-l sm:border-slate-200/60 border-l-0">
            <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider block">Absent</span>
            <span className="text-xl font-black text-rose-600 mt-1 block">
              {activeBatchStudents.filter(s => attendanceLogs[s.id] === 'Absent').length}
            </span>
          </div>
          <div className="text-center sm:border-l sm:border-slate-200/60 border-l-0">
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
    const totalDefaultersAmount = activeDefaulters.reduce((acc, d) => {
      const numeric = parseInt(d.amount.replace(/[^\d]/g, ''), 10);
      return acc + numeric;
    }, 0);

    const targetAmount = students.length * 3000;
    const collectedAmount = Math.max(0, targetAmount - totalDefaultersAmount);
    const progressPercent = students.length > 0 ? Math.round((collectedAmount / targetAmount) * 100) : 100;

    return (
      <div className="space-y-6 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Collection target</span>
            <h3 className="text-2xl font-black text-slate-800">₹{targetAmount.toLocaleString('en-IN')}</h3>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>Progress ({progressPercent}%)</span>
                <span className="text-slate-700 font-extrabold">₹{collectedAmount.toLocaleString('en-IN')} collected</span>
              </div>
              <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
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

  const renderMatchQueue = () => {
    const pendingStudents = students.filter(s => s.status === 'pending_match');

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tutor Allotment Match Queue</h2>
          <p className="text-slate-500 text-xs mt-1">Review diagnostic placement test results and assign vetted home tutors based on compatibility rankings.</p>
        </div>

        {pendingStudents.length === 0 ? (
          <div className="glow-card p-8 text-center max-w-xl mx-auto">
            <span className="text-4xl">🎉</span>
            <h3 className="text-lg font-black text-slate-800 mt-4">All Matches Completed!</h3>
            <p className="text-xs text-slate-400 mt-2">No students are currently waiting for tutor matching in the queue.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingStudents.map(student => {
              const suggestions = findSuggestedTeachers(student);
              const scores = student.test_score || { Mathematics: 0, Science: 0 };
              
              return (
                <div key={student.id} className="glow-card p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Student Details & Scores */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center space-x-3 text-left">
                      <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-full object-cover border border-slate-150" />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">{student.name}</h3>
                        <p className="text-[10px] text-slate-400 font-semibold">{student.standard} | {student.city}</p>
                        <InlineGoogleMap address={student.city} label="Student Location" />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl text-left">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mb-2">
                        Diagnostic Test Scores (Total: {scores.totalMarksText || '0/35'} Marks)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100/50">
                          <span className="text-[10px] text-slate-500 font-semibold block">Mathematics</span>
                          <span className="text-sm font-black text-blue-600 mt-1 block">{scores.mathMarksText || `0/16`}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100/50">
                          <span className="text-[10px] text-slate-500 font-semibold block">Science</span>
                          <span className="text-sm font-black text-blue-600 mt-1 block">{scores.scienceMarksText || `0/19`}</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium block mt-2">Subjects needed: {student.subjects.join(', ')}</span>
                    </div>
                  </div>

                  {/* Right Column: Suggested Matches */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Top Tutor Recommendations</span>
                      <button
                        onClick={() => { setSelectedMatchStudent(student); setShowOverrideModal(true); }}
                        className="text-blue-500 hover:text-blue-700 text-xs font-black flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        ⚙️ Manual Override
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {suggestions.slice(0, 2).map((sug) => {
                        const t = sug.teacher;
                        return (
                          <div key={t.id} className="p-3.5 border border-slate-100 hover:border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 hover:bg-white transition-all text-left">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-black text-slate-800">{t.name}</span>
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-lg border border-emerald-100">{sug.score}% Match</span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                                {t.experience} | {t.qualification}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                {sug.reasons.map((r, ri) => (
                                  <span key={ri} className="bg-blue-50/70 text-blue-700 border border-blue-100/30 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">{r}</span>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                allotTutor(student.id, t.id);
                                triggerToast(`Allotted ${t.name} to ${student.name}!`);
                                loadAdminData();
                              }}
                              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1 shrink-0 active:scale-95 text-center"
                            >
                              Confirm Match
                            </button>
                          </div>
                        );
                      })}
                      {suggestions.length === 0 && (
                        <div className="p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20 text-center">
                          <p className="text-xs text-slate-400 font-semibold">No vetted home tutors in {student.city} qualified for this score-band/subject match.</p>
                          <button
                            onClick={() => { setSelectedMatchStudent(student); setShowOverrideModal(true); }}
                            className="mt-2.5 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                          >
                            Allot Tutor Manually
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleConfirmBooking = async (booking) => {
    const finalTeacherId = selectedTeachers[booking.id] || booking.assigned_teacher_id;
    if (!finalTeacherId) {
      alert('Please select a teacher to assign for this demo class.');
      return;
    }
    try {
      await api.put(`/demo-bookings/${booking.id}/confirm`, { teacherId: finalTeacherId });
      setToastMessage(`Demo booking ${booking.id} confirmed and assigned to tutor!`);
      setShowToast(true);
      await fetchDemoBookings();
    } catch (error) {
      alert('Failed to confirm demo booking: ' + error.message);
    }
  };

  const renderDemoBookings = () => {
    const mapDistrictToCity = (district) => {
      if (!district) return '';
      return district.toLowerCase().trim();
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Demo Class Bookings</h2>
          <p className="text-slate-500 text-xs mt-1">
            Manage incoming visitor demo class requests, verify auto-matched nearby tutors, and dispatch requests to tutors for acceptance.
          </p>
        </div>

        {demoBookings.length === 0 ? (
          <div className="glow-card p-8 text-center max-w-xl mx-auto">
            <span className="text-4xl">🗓️</span>
            <h3 className="text-lg font-black text-slate-800 mt-4">No Demo Bookings Found</h3>
            <p className="text-xs text-slate-400 mt-2">
              There are no demo bookings recorded in the system yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {demoBookings.map((booking) => {
              const targetCity = mapDistrictToCity(booking.district);
              
              const nearbyTeachers = teachers.filter(
                (t) =>
                  t.verification_status === 'Verified' &&
                  t.city &&
                  t.city.toLowerCase() === targetCity
              );

              const otherVerifiedTeachers = teachers.filter(
                (t) =>
                  t.verification_status === 'Verified' &&
                  (!t.city || t.city.toLowerCase() !== targetCity)
              );

              const assignedTeacher = teachers.find(
                (t) => t.id === (selectedTeachers[booking.id] || booking.assigned_teacher_id)
              );

              return (
                <div key={booking.id} className="glow-card p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
                  {/* Left Column: Student Details & Timing */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-slate-800">{booking.studentName}</h3>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                            {booking.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Class: {booking.studentClass} | District: {booking.district}
                        </p>
                      </div>
                      <div>
                        {(() => {
                          switch (booking.status) {
                            case 'pending_admin_confirmation':
                              return (
                                <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                  Awaiting Admin
                                </span>
                              );
                            case 'pending_teacher_acceptance':
                              return (
                                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                  Awaiting Tutor
                                </span>
                              );
                            case 'confirmed':
                              return (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                  Confirmed
                                </span>
                              );
                            case 'declined':
                              return (
                                <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                  Declined
                                </span>
                              );
                            default:
                              return (
                                <span className="bg-slate-50 text-slate-600 border border-slate-200 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                                  {booking.status}
                                </span>
                              );
                          }
                        })()}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">
                            Requested Slot
                          </span>
                          <span className="font-bold text-slate-700">{booking.preferredDate} at {booking.preferredTime}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">
                            Preferred Days
                          </span>
                          <span className="font-bold text-slate-700">{booking.preferredDays.join(', ')}</span>
                        </div>
                      </div>
                      <div className="text-xs pt-1 border-t border-slate-200/50">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">
                          Subjects Needed
                        </span>
                        <span className="font-bold text-slate-700">{booking.subjects.join(', ')}</span>
                      </div>
                      <div className="text-xs pt-1 border-t border-slate-200/50">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">
                          Location Details
                        </span>
                        <span className="font-semibold text-slate-600 block">
                          {booking.villageArea}
                          {booking.landmark && <span className="text-slate-400 font-normal"> (Near: {booking.landmark})</span>}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Parent Contact: +91 {booking.parentPhone}</span>
                        <InlineGoogleMap address={`${booking.villageArea}, ${booking.landmark ? booking.landmark + ', ' : ''}${booking.district}`} label="Booking Site" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Teacher Assignment & Confirmation Actions */}
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">
                        Tutor Allotment (Nearby City Match: {booking.district})
                      </span>
                      
                      {booking.status === 'pending_admin_confirmation' ? (
                        <div className="space-y-3">
                          <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                            {assignedTeacher ? (
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-black text-slate-800">{assignedTeacher.name}</span>
                                  <span className="ml-2 bg-emerald-50 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                                    {assignedTeacher.city === booking.district || assignedTeacher.city?.toLowerCase() === targetCity ? 'Nearby Match' : 'Manual Fit'}
                                  </span>
                                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                                    Rating: ⭐ {assignedTeacher.rating || '5.0'} | Experience: {assignedTeacher.experience || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className="text-xs text-rose-500 font-extrabold">⚠️ No tutor auto-matched near {booking.district}</span>
                                <p className="text-[9px] text-slate-400 mt-0.5">Please manually select a verified teacher from the dropdown below.</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                              Select / Override Tutor
                            </label>
                            <select
                              value={selectedTeachers[booking.id] || booking.assigned_teacher_id || ''}
                              onChange={(e) => handleTeacherChange(booking.id, e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            >
                              <option value="">-- Choose a teacher --</option>
                              {nearbyTeachers.length > 0 && (
                                <optgroup label={`Recommended Tutors (in ${booking.district})`}>
                                  {nearbyTeachers.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      {t.name} (⭐{t.rating || '5.0'} - {t.subjects_taught?.slice(0, 2).join(', ')})
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                              <optgroup label="Other Verified Tutors">
                                {otherVerifiedTeachers.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name} ({t.city || 'No City'} - ⭐{t.rating || '5.0'})
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>

                          <button
                            onClick={() => handleConfirmBooking(booking)}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black text-xs py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                          >
                            <span>Confirm & Allot Trial Class</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">
                                Assigned Tutor
                              </span>
                              <span className="text-xs font-black text-slate-800">
                                {assignedTeacher ? assignedTeacher.name : 'Unknown Tutor'}
                              </span>
                            </div>
                            <div>
                              {booking.status === 'pending_teacher_acceptance' && (
                                <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded border border-blue-100">
                                  Pending Tutor Review
                                </span>
                              )}
                              {booking.status === 'confirmed' && (
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-100">
                                  Tutor Accepted
                                </span>
                              )}
                              {booking.status === 'declined' && (
                                <div className="space-y-1.5 text-right">
                                  <span className="bg-rose-50 text-rose-700 text-[9px] font-black px-2 py-0.5 rounded border border-rose-100">
                                    Tutor Declined
                                  </span>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await api.put(`/demo-bookings/${booking.id}/confirm`, { teacherId: booking.assigned_teacher_id });
                                        setToastMessage('Re-sent demo booking to teacher!');
                                        setShowToast(true);
                                        await fetchDemoBookings();
                                      } catch (err) {
                                        alert('Error re-sending: ' + err.message);
                                      }
                                    }}
                                    className="block text-[9px] text-blue-500 hover:text-blue-700 underline font-bold mt-1 ml-auto cursor-pointer"
                                  >
                                    Re-allot / Retry
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          {booking.status === 'declined' && (
                            <div className="pt-2 border-t border-slate-100">
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">
                                Re-assign to another tutor:
                              </span>
                              <div className="flex gap-2">
                                <select
                                  value={selectedTeachers[booking.id] || ''}
                                  onChange={(e) => handleTeacherChange(booking.id, e.target.value)}
                                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none"
                                >
                                  <option value="">-- Re-assign --</option>
                                  {nearbyTeachers.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name} (Nearby)</option>
                                  ))}
                                  {otherVerifiedTeachers.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleConfirmBooking(booking)}
                                  className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Re-assign
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderWaitlist = () => {
    // Waitlisted students (matching_eligible = false or status = 'waitlist')
    const waitlistedStudents = students.filter(s => s.matching_eligible === false || s.status === 'waitlist' || s.status === 'Waitlist');
    
    // Waitlisted parents (childMatchingEligible = false or status = 'waitlist')
    const waitlistedParents = parents.filter(p => p.childMatchingEligible === false || p.status === 'waitlist' || p.status === 'Waitlist');

    const waitlisted = [...waitlistedStudents, ...waitlistedParents];

    // Group by city
    const groupedByCity = {};
    waitlisted.forEach(u => {
      const city = u.city || u.childCity || 'Unknown';
      const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
      if (!groupedByCity[normalizedCity]) {
        groupedByCity[normalizedCity] = [];
      }
      groupedByCity[normalizedCity].push(u);
    });

    const cityNames = Object.keys(groupedByCity).sort();

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Waitlist</h2>
          <p className="text-slate-500 text-xs mt-1">
            Users who registered from unsupported cities. They'll be notified when Cograd launches in their area.
          </p>
        </div>

        {waitlisted.length === 0 ? (
          <div className="glow-card p-8 text-center max-w-xl mx-auto">
            <span className="text-4xl">📋</span>
            <h3 className="text-lg font-black text-slate-800 mt-4">Waitlist is Empty</h3>
            <p className="text-xs text-slate-400 mt-2">No users are currently on the waitlist.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-blue-800">Total Waitlist: <strong>{waitlisted.length}</strong> users</p>
                <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Across {cityNames.length} cities</p>
              </div>
            </div>

            {cityNames.map(city => (
              <div key={city} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-black text-slate-800">{city}</h3>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-lg border border-amber-100">
                    {groupedByCity[city].length} waiting
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {groupedByCity[city].map(user => (
                    <div key={user.id} className="glow-card p-4 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800">{user.name}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">
                            {user.role === 'parent' ? 'Parent' : 'Student'} 
                            {user.role === 'parent' && user.childName && ` — Child: ${user.childName}`}
                            {user.role === 'student' && ` — ${user.standard || ''}`}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            {user.email} | {user.phone}
                          </p>
                          {user.role === 'parent' && user.childSubjects && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {user.childSubjects.map(sub => (
                                <span key={sub} className="bg-blue-50/70 text-blue-700 border border-blue-100/30 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}
                          {user.role === 'student' && user.subjects && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {user.subjects.map(sub => (
                                <span key={sub} className="bg-blue-50/70 text-blue-700 border border-blue-100/30 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="bg-amber-50 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded-lg border border-amber-100 whitespace-nowrap">
                          Waitlist
                        </span>
                        <span className="text-[8px] text-slate-400 font-medium">
                          Joined: {user.joinDate || user.createdAt ? new Date(user.joinDate || user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'Dashboard': return renderDashboard();
      case 'Students': return renderStudents();
      case 'Teachers': return renderTeachers();
      case 'Demo Bookings': return renderDemoBookings();
      case 'Match Queue': return renderMatchQueue();
      case 'Waitlist': return renderWaitlist();
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
    <>



      {/* Manual Override Modal */}
      {showOverrideModal && selectedMatchStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-lg w-full space-y-4 animate-scale-up text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Manual Tutor Allotment: {selectedMatchStudent.name}
              </h3>
              <button onClick={() => { setShowOverrideModal(false); setSelectedMatchStudent(null); }} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search teachers by name or subject..."
                  value={overrideTeacherSearch}
                  onChange={(e) => setOverrideTeacherSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2.5">
                {getTeachers()
                  .filter(t => t.verification_status === 'Verified' && (
                    t.name.toLowerCase().includes(overrideTeacherSearch.toLowerCase()) ||
                    t.subjects_taught.some(s => s.toLowerCase().includes(overrideTeacherSearch.toLowerCase()))
                  ))
                  .map(teacher => {
                    const isWithinCapacity = teacher.current_student_count < teacher.max_student_capacity;
                    return (
                      <div key={teacher.id} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-white transition-all">
                        <div>
                          <h4 className="text-xs font-black text-slate-800">{teacher.name}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                            Subjects: {teacher.subjects_taught.join(', ')} | Qualified: {teacher.grade_levels_qualified.join(', ')}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1">
                            City: {teacher.city} | Capacity: {teacher.current_student_count}/{teacher.max_student_capacity}
                          </p>
                        </div>
                        <button
                          disabled={!isWithinCapacity}
                          onClick={() => {
                            allotTutor(selectedMatchStudent.id, teacher.id);
                            triggerToast(`Allotted ${teacher.name} to ${selectedMatchStudent.name}`);
                            setShowOverrideModal(false);
                            setSelectedMatchStudent(null);
                            loadAdminData();
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all hover:bg-blue-700 cursor-pointer"
                        >
                          Allot
                        </button>
                      </div>
                    );
                  })}
                {getTeachers().filter(t => t.verification_status === 'Verified').length === 0 && (
                  <p className="text-center text-xs text-slate-400 font-semibold py-4">No verified teachers available.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setShowOverrideModal(false); setSelectedMatchStudent(null); }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  { key: 'experience', label: 'Experience Letter', icon: '📄', info: 'Letter from previous institute or employer' }
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

      <DashboardShell
        navItems={[
          { name: 'Dashboard', icon: LayoutDashboard },
          { name: 'Students', icon: Users },
          { name: 'Teachers', icon: GraduationCap },
          { name: 'Demo Bookings', icon: BookOpen },
          { name: 'Match Queue', icon: Sliders },
          { name: 'Waitlist', icon: List },
          { name: 'Attendance', icon: UserCheck },
          { name: 'Tests & Results', icon: CheckSquare },
          { name: 'Fee Management', icon: CreditCard },
          { name: 'Settings', icon: Settings },
          { name: 'Help', icon: HelpCircle }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        roleName="Admin Hub"
        roleColor="violet"
        userName="Admin"
        notifications={notifications}
        onClearNotifs={() => {
          setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
          setToastMessage('All notifications read.');
          setShowToast(true);
        }}
        onLogout={handleLogout}
        toast={{ show: showToast, message: toastMessage }}
      >
        <div key={activeTab} className="tab-content-enter h-full w-full">
          {getTabContent()}
        </div>
      </DashboardShell>
    </>
  );
};

export default AdminDashboard;
