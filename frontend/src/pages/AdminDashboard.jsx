import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import {
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
  Phone,
  Mail,
  MapPin,
  Pencil,
  DollarSign
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
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

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
  // Enquiries List state — fetched from backend
  const [enquiries, setEnquiries] = useState([]);

  const fetchEnquiries = async () => {
    try {
      const data = await api.get('/enquiries');
      setEnquiries(data || []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    }
  };

  // Student roster state - starts empty, populated from backend via syncWithBackend
  const [students, setStudents] = useState([]);
  const [demoBookings, setDemoBookings] = useState([]);
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

  const loadAdminData = async () => {
    try {
      const raw = await api.get('/students');
      const normalized = (raw || []).map(s => ({
        ...s,
        batch: s.standard || 'Class 10',
        date: s.joinDate || '2026-06-19',
        status: s.status === 'active' ? 'Active' : s.status === 'matched' ? 'Active' : s.status === 'pending_test' ? 'Pending Test' : s.status === 'pending_match' ? 'Pending Match' : s.status
      }));
      setStudents(normalized);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }

    try {
      const rawTeachers = await api.get('/teachers');
      const normalizedTeachers = (rawTeachers || []).map(t => ({
        ...t,
        subject: t.subjects_taught ? t.subjects_taught[0] : 'General',
        rate: t.hourly_rate || '₹500/hr',
        batches: t.grade_levels_qualified || ['Class 9'],
        status: t.verification_status || 'Pending'
      }));
      setTeachers(normalizedTeachers);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadAdminData();
      await fetchDemoBookings();
      await fetchPayments();
      await fetchAnnouncements();
      await fetchEnquiries();
      await fetchSettingsFromBackend();
      await fetchNotifications();
    };
    init();
  }, []);

  // Teachers state - populated from backend via syncWithBackend
  const [teachers, setTeachers] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

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
              resume: docs.find(d => d.type === 'Resume' || d.name.toLowerCase().includes('resume') || d.name.toLowerCase().includes('cv'))?.status === 'Approved' ? 'Approved' : 'Under Review'
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
        ...(prev[teacherId] || { degree: 'Under Review', aadhar: 'Under Review', resume: 'Under Review' }),
        [docKey]: nextVal
      }
    }));

    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      const updatedDocs = (teacher.documents || []).map(d => {
        let matches = false;
        if (docKey === 'degree' && (d.type === 'Academic' || d.name.includes('Degree'))) matches = true;
        if (docKey === 'aadhar' && (d.type === 'Identity' || d.name.includes('Aadhaar'))) matches = true;
        if (docKey === 'resume' && (d.type === 'Resume' || d.name.toLowerCase().includes('resume') || d.name.toLowerCase().includes('cv'))) matches = true;
        
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

  // Recent payments state — fetched from backend
  const [recentPayments, setRecentPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments');
      setRecentPayments(data || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  // Announcements state — fetched from backend
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const data = await api.get('/announcements');
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    }
  };

  // Settings state — fetched from backend
  const [settings, setSettings] = useState({
    centreName: 'CoGrad',
    contactEmail: 'admin@cograd.com',
    contactPhone: '+91-9876500000',
    address: 'CoGrad Admin Support Desk',
    session: '2026-2027',
    currency: '₹ (INR)',
    autoReminders: true,
    emailAlerts: true,
    whatsappSync: false
  });

  const fetchSettingsFromBackend = async () => {
    try {
      const data = await api.get('/admin/settings');
      if (data) {
        setSettings({
          centreName: data.centreName || 'CoGrad',
          contactEmail: data.contactEmail || 'admin@cograd.com',
          contactPhone: data.contactPhone || '+91-9876500000',
          address: data.address || 'CoGrad Admin Support Desk',
          session: data.session || '2026-2027',
          currency: data.currency || '₹ (INR)',
          autoReminders: data.autoReminders !== undefined ? data.autoReminders : true,
          emailAlerts: data.emailAlerts !== undefined ? data.emailAlerts : true,
          whatsappSync: data.whatsappSync !== undefined ? data.whatsappSync : false
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const [isEditingSettings, setIsEditingSettings] = useState(false);

  const [supportTickets, setSupportTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const fetchSupportTickets = async () => {
    setLoadingTickets(true);
    try {
      const data = await api.get('/support-tickets');
      setSupportTickets(data || []);
    } catch (err) {
      console.error('Failed to fetch support tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await api.post(`/support-tickets/${ticketId}/resolve`);
      setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t));
      setToastMessage('Support ticket resolved successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to resolve support ticket:', err);
      setToastMessage('Failed to resolve support ticket.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    if (activeTab === 'Support') {
      fetchSupportTickets();
    }
  }, [activeTab]);

  // Tests & Results state (dead — tab removed, kept minimal for compatibility)
  const [tests, setTests] = useState([]);

  // Modal open states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddEnquiry, setShowAddEnquiry] = useState(false);
  const [showPublishTest, setShowPublishTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedTeacherDocs, setSelectedTeacherDocs] = useState(null);
  const [selectedTeacherEarnings, setSelectedTeacherEarnings] = useState(null);
  const [newEarningForm, setNewEarningForm] = useState({ studentName: '', amount: '', status: 'Paid', method: 'Razorpay' });
  const [isSavingEarning, setIsSavingEarning] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState('');

  // Student Form Inputs
  const [newStudent, setNewStudent] = useState({ name: '', email: '', parentName: '', batch: 'Class 9', status: 'Active' });
  // Enquiry Form Inputs
  const [newEnquiry, setNewEnquiry] = useState({ name: '', course: 'Class 9 — All Subjects', phone: '', email: '' });
  // Test Form Inputs
  const [newTest, setNewTest] = useState({ name: '', date: '', batch: 'Class 9', avgScore: '', topScore: '', toppers: '' });



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

  const handleVerifyStep = async (teacherId, step, action) => {
    try {
      const res = await api.post(`/admin/teachers/${teacherId}/verify-step`, {
        step,
        action,
        feedback: adminFeedback
      });
      await syncWithBackend();
      await loadAdminData();
      
      // Update selectedTeacherDocs details locally
      setSelectedTeacherDocs(prev => {
        if (!prev) return null;
        return {
          ...prev,
          onboarding_progress: res.onboarding_progress,
          verification_status: res.verification_status
        };
      });
      
      setAdminFeedback('');
      triggerToast(`Step ${step} ${action === 'verify' ? 'verified' : 'rejected'} successfully.`);
    } catch (err) {
      triggerToast(err.message || 'Failed to update step status');
    }
  };

  const handleFinalApprove = async (teacherId, name) => {
    try {
      await api.post(`/admin/teachers/${teacherId}/approve`);
      await syncWithBackend();
      await loadAdminData();
      setSelectedTeacherDocs(null);
      triggerToast(`${name} is now fully approved & verified!`);
    } catch (err) {
      triggerToast(err.message || 'Failed to approve teacher');
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
  const handleRecordPayment = async (defaulterId, name, amount) => {
    try {
      await api.post('/payments', {
        studentId: defaulterId,
        studentName: name,
        amount,
        method: 'Cash / Manual'
      });
      await fetchPayments();
      triggerToast(`Payment of ${amount} recorded for ${name}!`);
    } catch (err) {
      triggerToast(err.message || 'Failed to record payment');
    }
  };

  // CRM actions
  const handleMoveEnquiry = async (id, name, currentStatus) => {
    let nextStatus = 'Follow-up';
    if (currentStatus === 'Follow-up') {
      nextStatus = 'Enrolled';
    }

    try {
      await api.put(`/enquiries/${id}`, { type: nextStatus });
      await fetchEnquiries();

      if (nextStatus === 'Enrolled') {
        triggerToast(`Enquiry enrolled! ${name} moved to Enrolled stage.`);
      } else {
        triggerToast(`Enquiry ${name} moved to Follow-up.`);
      }
    } catch (err) {
      triggerToast(err.message || 'Failed to update enquiry');
    }
  };

  const handleAddEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!newEnquiry.name || !newEnquiry.phone) {
      triggerToast('Please provide a name and contact number!');
      return;
    }
    try {
      await api.post('/enquiries', {
        name: newEnquiry.name,
        course: newEnquiry.course,
        phone: newEnquiry.phone,
        email: newEnquiry.email || ''
      });
      await fetchEnquiries();
      setShowAddEnquiry(false);
      setNewEnquiry({ name: '', course: 'Class 9 — All Subjects', phone: '', email: '' });
      triggerToast(`Enquiry for ${newEnquiry.name} added to pipeline.`);
    } catch (err) {
      triggerToast(err.message || 'Failed to add enquiry');
    }
  };

  // Communication Actions
  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!announceInput.title || !announceInput.text) {
      triggerToast('Please enter a title and message!');
      return;
    }
    try {
      await api.post('/announcements', {
        title: announceInput.title,
        text: announceInput.text,
        target: announceInput.target,
        priority: announceInput.priority
      });
      await fetchAnnouncements();
      
      const createdNotif = await api.post('/notifications', {
        text: `Announcement: ${announceInput.title}`,
        time: 'Just now'
      });
      setNotifications(prev => [createdNotif, ...prev]);
      setAnnounceInput({ title: '', target: 'All Students & Teachers', priority: 'Medium', text: '' });
      triggerToast('Broadcast announcement published!');
    } catch (err) {
      triggerToast(err.message || 'Failed to publish announcement');
    }
  };

  // Settings Actions
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      setIsEditingSettings(false);
      triggerToast('Centre configurations saved successfully.');
    } catch (err) {
      triggerToast(err.message || 'Failed to save settings');
    }
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
                    <td colSpan="6" className="py-12 text-center">
                      <div className="empty-state">
                        <div className="empty-state-icon mx-auto"><Users className="w-5 h-5" /></div>
                        <p className="empty-state-title">No students found</p>
                        <p className="empty-state-desc">Try adjusting your search or filter.</p>
                      </div>
                    </td>
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

        {filteredTeachers.length > 0 ? (
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
                      {key === 'degree' ? '🎓 Degree' : key === 'aadhar' ? '🪪 Aadhar' : '📄 Resume'}: {val === 'Approved' ? '✓' : '⏳'}
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

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTeacherVerification(teacher.id, teacher.name)}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer text-center border ${
                      teacher.status === 'Verified'
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100/30'
                    }`}
                  >
                    {teacher.status === 'Verified' ? 'Revoke' : 'Verify'}
                  </button>
                  <button
                    onClick={() => setSelectedTeacherDocs(teacher)}
                    className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 hover:text-blue-800 font-bold rounded-xl text-[10px] transition-all cursor-pointer"
                  >
                    Docs
                  </button>
                  <button
                    onClick={() => setSelectedTeacherEarnings(teacher)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-[10px] transition-all cursor-pointer flex items-center gap-0.5"
                  >
                    <DollarSign className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Earnings</span>
                  </button>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="empty-state py-12">
            <div className="empty-state-icon mx-auto"><GraduationCap className="w-5 h-5 text-slate-400" /></div>
            <p className="empty-state-title">No Teachers Found</p>
            <p className="empty-state-desc">There are no registered teachers or none matching your filter criteria.</p>
          </div>
        )}
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
              <h3 className="text-2xl font-black text-emerald-500">{recentPayments.length > 0 ? '100%' : 'N/A'}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1">{recentPayments.length} transactions logged</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-black text-slate-800 tracking-tight">Accounts Defaulters list</h3>
            
            <div className="divide-y divide-slate-100">
              {activeDefaulters.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon"><CreditCard className="w-5 h-5" /></div><p className="empty-state-title">All Fees Cleared!</p><p className="empty-state-desc">No outstanding fee defaulters.</p></div>
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
                    <div className="empty-state py-6"><div className="empty-state-icon"><Users className="w-5 h-5" /></div><p className="empty-state-title">No Leads Here</p><p className="empty-state-desc">No enquiries in this stage.</p></div>
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
        <div className="flex items-center justify-between pb-3 border-b border-slate-50">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">System configuration settings</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Configure general center profile details</p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className={`px-3 py-1.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              isEditingSettings
                ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100/70'
                : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
            }`}
            title={isEditingSettings ? 'Cancel Editing' : 'Edit Settings'}
          >
            {isEditingSettings ? <X className="w-4 h-4" /> : <Pencil className="w-3.5 h-3.5" />}
            <span>{isEditingSettings ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {!isEditingSettings ? (
          /* Presentation (fixed) view mode */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Centre Brand Name</span>
                <p className="text-sm font-extrabold text-slate-800">{settings.centreName}</p>
              </div>

              <div className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Email Address</span>
                <p className="text-sm font-extrabold text-slate-800 truncate" title={settings.contactEmail}>{settings.contactEmail}</p>
              </div>

              <div className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Phone Number</span>
                <p className="text-sm font-extrabold text-slate-800">{settings.contactPhone}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Physical Address</span>
              <p className="text-sm font-extrabold text-slate-800">{settings.address}</p>
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
                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {settings[toggle.key] ? (
                      <span className="text-emerald-600">Active</span>
                    ) : (
                      <span className="text-slate-500">Disabled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Form edit mode */
          <form onSubmit={handleSaveSettings} className="space-y-5 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        )}
      </div>
    );
  };

  const renderHelp = () => {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-500/10 to-secondary-500/10 p-6 rounded-3xl border border-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">CoGrad Help & Support Center</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Manage incoming student, teacher, and parent queries</p>
          </div>
        </div>

        {/* FAQ and Ticket Desk split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Support Tickets Queue */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800 tracking-tight">Incoming Support Queries ({supportTickets.length})</h3>
              <button 
                onClick={fetchSupportTickets} 
                className="text-[10px] font-black text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1 rounded-lg border border-primary-100 cursor-pointer"
              >
                Refresh Queue
              </button>
            </div>
            
            {loadingTickets ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <div className="spinner" aria-label="Loading tickets" />
                <p className="text-xs font-semibold text-slate-400">Loading support tickets…</p>
              </div>
            ) : supportTickets.length === 0 ? (
              <div className="empty-state border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="empty-state-icon">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <p className="empty-state-title">No Open Tickets</p>
                <p className="empty-state-desc">No active support queries from students, teachers, or parents.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {supportTickets.map((t) => (
                  <div key={t.id} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-black uppercase tracking-wider">{t.id}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-black uppercase tracking-wider">{t.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                        t.status === 'Resolved' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-800">{t.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed bg-white border border-slate-100 rounded-xl p-3">{t.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-bold text-slate-400">
                      <div>
                        Submitted by: <span className="text-slate-700 font-extrabold">{t.userName}</span> ({t.userRole})
                      </div>
                      
                      {t.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolveTicket(t.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer font-black text-[9px] uppercase tracking-wider shadow-sm active:scale-95"
                        >
                          Resolve Ticket
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-base font-black text-slate-800 tracking-tight">Frequently Asked Questions</h3>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {[
                { q: 'How do I verify a new teacher partner?', a: 'Navigate to the Teachers tab, click on "Docs" next to the teacher\'s name to review their credentials, and then click "Verify Partner" to activate their portal access.' },
                { q: 'What happens when I complete enrollment for a CRM enquiry lead?', a: 'The lead is marked as Enrolled. The system automatically registers a new student record in the Students portal.' },
                { q: 'Can I disable automatic fee reminders?', a: 'Yes. Go to the Settings tab, scroll down to Automation & parameters, toggle off the "Auto-dispatch overdue fee reminders" option, and save configurations.' }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl transition-all space-y-2 text-left">
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
        </div>

        {/* Official CoGrad Contact Details */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">CoGrad Admin Support Desk Details</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Official business and help desk contact details</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Phone */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400">Call Support</span>
                <p className="text-xs font-black text-slate-800">{settings.contactPhone}</p>
                <p className="text-[9px] text-slate-400 font-bold">Mon–Sat, 10am – 6pm IST</p>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400">Email Address</span>
                <p className="text-xs font-black text-slate-800">
                  <a href={`mailto:${settings.contactEmail}`} className="hover:underline text-emerald-700">{settings.contactEmail}</a>
                </p>
                <p className="text-[9px] text-slate-400 font-bold">We reply within 24 hours</p>
              </div>
            </div>

            {/* Office */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-violet-600" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400">Support Desk Location</span>
                <p className="text-xs font-black text-slate-800">{settings.centreName || 'CoGrad'}</p>
                <p className="text-[9px] text-slate-500 font-medium leading-tight">
                  {settings.address}
                </p>
              </div>
            </div>
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
            <p className="empty-state-title mt-3">No Demo Bookings Yet</p>
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

  const getTabContent = () => {
    switch (activeTab) {
      case 'Dashboard': return renderDashboard();
      case 'Students': return renderStudents();
      case 'Teachers': return renderTeachers();
      case 'Demo Bookings': return renderDemoBookings();
      case 'Fee Management': return renderFeeManagement();
      case 'Settings': return renderSettings();
      case 'Support': return renderHelp();
      default:
        return renderPlaceholder(activeTab);
    }
  };

  return (
    <>



      {/* Manual Override Modal */}
      {showOverrideModal && selectedMatchStudent && (
        <div className="modal-overlay">
          <div className="modal-panel p-6 space-y-4 text-left">
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
                    const isLocalityMatch = selectedMatchStudent && teacher.locality && selectedMatchStudent.locality &&
                      teacher.locality.trim().toLowerCase() === selectedMatchStudent.locality.trim().toLowerCase();

                    return (
                      <div key={teacher.id} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-white transition-all">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-slate-800">{teacher.name}</h4>
                              {isLocalityMatch && (
                                <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-emerald-200">📍 Locality Match</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                              Subjects: {teacher.subjects_taught.join(', ')} | Qualified: {teacher.grade_levels_qualified.join(', ')}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1">
                              Location: {teacher.locality ? `${teacher.locality}, ` : ''}{teacher.city} | Capacity: {teacher.current_student_count}/{teacher.max_student_capacity}
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
                  <div className="empty-state py-4"><p className="empty-state-desc">No verified teachers available.</p></div>
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
        <div className="modal-overlay">
          <div className="modal-panel p-6 space-y-4">
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
                  placeholder="E.g. sid@gmail.com or sid@yahoo.com"
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
        <div className="modal-overlay">
          <div className="modal-panel p-6 space-y-4">
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
                  placeholder="E.g. priya.sh@gmail.com or priya.sh@yahoo.com"
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
        <div className="modal-overlay">
          <div className="modal-panel p-6 space-y-4">
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
        <div className="modal-overlay">
          <div className="modal-panel p-6 space-y-4">
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
        <div className="modal-overlay">
          <div className="modal-panel p-6 space-y-4 max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                <span>Teacher Joining &amp; Vetting Hub</span>
              </h3>
              <button onClick={() => { setSelectedTeacherDocs(null); setAdminFeedback(''); }} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer border-0 bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-left">
              {/* Teacher Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 text-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-base shrink-0 overflow-hidden">
                  {selectedTeacherDocs.avatar ? (
                    <img src={selectedTeacherDocs.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    selectedTeacherDocs.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-slate-800 text-sm">{selectedTeacherDocs.name}</div>
                  <div className="text-slate-505 mt-0.5">{selectedTeacherDocs.email} · {selectedTeacherDocs.phone}</div>
                  <div className="mt-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border
                      ${selectedTeacherDocs.verification_status === 'Verified'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : selectedTeacherDocs.verification_status === 'Pending'
                          ? 'bg-amber-50 border-amber-100 text-amber-700 animate-pulse'
                          : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                      }`}
                    >
                      Status: {selectedTeacherDocs.verification_status || selectedTeacherDocs.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedTeacherDocs.onboarding_progress ? (
                /* ── MULTI-STEP ONBOARDING VETTING VIEW ── */
                <div className="space-y-4 text-xs font-semibold text-slate-705">
                  
                  {/* Feedback Box */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Feedback / Rejection Comments</label>
                    <textarea
                      placeholder="Write feedback here before clicking Reject..."
                      value={adminFeedback}
                      onChange={(e) => setAdminFeedback(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-16"
                    />
                  </div>

                  {/* Step 1: Identity & KYC */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs font-extrabold text-slate-800">1. Identity &amp; KYC Verification</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border
                        ${selectedTeacherDocs.onboarding_progress.step_1_identity.status === 'Verified'
                          ? 'bg-emerald-50 border-emerald-150 text-emerald-600'
                          : selectedTeacherDocs.onboarding_progress.step_1_identity.status === 'Submitted'
                            ? 'bg-blue-50 border-blue-150 text-blue-600 animate-pulse'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {selectedTeacherDocs.onboarding_progress.step_1_identity.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>Aadhaar: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_1_identity.aadhaarNumber || 'N/A'}</strong></div>
                      <div>PAN Card: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_1_identity.panNumber || 'N/A'}</strong></div>
                    </div>

                    {/* Files previews */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedTeacherDocs.onboarding_progress.step_1_identity.aadhaarFileUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ url: selectedTeacherDocs.onboarding_progress.step_1_identity.aadhaarFileUrl, name: 'Aadhaar Card copy', isPdf: selectedTeacherDocs.onboarding_progress.step_1_identity.aadhaarFileUrl.endsWith('.pdf') })}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          👁️ Aadhaar copy
                        </button>
                      )}
                      {selectedTeacherDocs.onboarding_progress.step_1_identity.panFileUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ url: selectedTeacherDocs.onboarding_progress.step_1_identity.panFileUrl, name: 'PAN Card copy', isPdf: selectedTeacherDocs.onboarding_progress.step_1_identity.panFileUrl.endsWith('.pdf') })}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          👁️ PAN copy
                        </button>
                      )}
                      {selectedTeacherDocs.onboarding_progress.step_1_identity.selfieUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ url: selectedTeacherDocs.onboarding_progress.step_1_identity.selfieUrl, name: 'Selfie headshot', isPdf: false })}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          👁️ Selfie picture
                        </button>
                      )}
                    </div>

                    {selectedTeacherDocs.onboarding_progress.step_1_identity.status === 'Submitted' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyStep(selectedTeacherDocs.id, 1, 'verify')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer text-center"
                        >
                          ✓ Approve Identity
                        </button>
                        <button
                          onClick={() => handleVerifyStep(selectedTeacherDocs.id, 1, 'reject')}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer text-center"
                        >
                          ✗ Reject Identity
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Academic Qualifications */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs font-extrabold text-slate-800">2. Academic Credentials Audit</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border
                        ${selectedTeacherDocs.onboarding_progress.step_2_qualification.status === 'Verified'
                          ? 'bg-emerald-50 border-emerald-150 text-emerald-600'
                          : selectedTeacherDocs.onboarding_progress.step_2_qualification.status === 'Submitted'
                            ? 'bg-blue-50 border-blue-150 text-blue-600 animate-pulse'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {selectedTeacherDocs.onboarding_progress.step_2_qualification.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>Degree: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_2_qualification.degreeName || 'N/A'}</strong></div>
                      <div>University: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_2_qualification.universityName || 'N/A'}</strong></div>
                      <div>Graduation: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_2_qualification.graduationYear || 'N/A'}</strong></div>
                      <div>Professional: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_2_qualification.professionalCertName || 'N/A'}</strong></div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {selectedTeacherDocs.onboarding_progress.step_2_qualification.degreeUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ url: selectedTeacherDocs.onboarding_progress.step_2_qualification.degreeUrl, name: 'Degree certificate', isPdf: selectedTeacherDocs.onboarding_progress.step_2_qualification.degreeUrl.endsWith('.pdf') })}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          👁️ Degree copy
                        </button>
                      )}
                      {selectedTeacherDocs.onboarding_progress.step_2_qualification.professionalCertUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ url: selectedTeacherDocs.onboarding_progress.step_2_qualification.professionalCertUrl, name: 'Professional certificate', isPdf: selectedTeacherDocs.onboarding_progress.step_2_qualification.professionalCertUrl.endsWith('.pdf') })}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          👁️ Professional Cert
                        </button>
                      )}
                    </div>

                    {selectedTeacherDocs.onboarding_progress.step_2_qualification.status === 'Submitted' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyStep(selectedTeacherDocs.id, 2, 'verify')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer text-center"
                        >
                          ✓ Approve Credentials
                        </button>
                        <button
                          onClick={() => handleVerifyStep(selectedTeacherDocs.id, 2, 'reject')}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer text-center"
                        >
                          ✗ Reject Credentials
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Competency Test */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs font-extrabold text-slate-800">3. Subject Competency quiz results</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border
                        ${selectedTeacherDocs.onboarding_progress.step_3_competency.status === 'Passed'
                          ? 'bg-emerald-50 border-emerald-150 text-emerald-600'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {selectedTeacherDocs.onboarding_progress.step_3_competency.status}
                      </span>
                    </div>

                    {selectedTeacherDocs.onboarding_progress.step_3_competency.testAttempts && selectedTeacherDocs.onboarding_progress.step_3_competency.testAttempts.length > 0 ? (
                      <div className="space-y-1.5">
                        {selectedTeacherDocs.onboarding_progress.step_3_competency.testAttempts.map((attempt, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] bg-white p-2 border border-slate-100 rounded-lg">
                            <span>Subject: <strong className="text-slate-800">{attempt.subject}</strong></span>
                            <span>Score: <strong className={attempt.passed ? 'text-emerald-600' : 'text-rose-500'}>{attempt.scorePercentage}%</strong></span>
                            <span>Result: <strong className={attempt.passed ? 'text-emerald-600' : 'text-rose-500'}>{attempt.passed ? 'PASSED' : 'FAILED'}</strong></span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">No competency test attempts registered yet.</p>
                    )}
                  </div>

                  {/* Step 4: Demo Class */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs font-extrabold text-slate-800">4. Demo Lesson Evaluation</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border
                        ${selectedTeacherDocs.onboarding_progress.step_4_demo.status === 'Approved'
                          ? 'bg-emerald-50 border-emerald-150 text-emerald-600'
                          : selectedTeacherDocs.onboarding_progress.step_4_demo.status === 'Submitted'
                            ? 'bg-blue-50 border-blue-150 text-blue-600 animate-pulse'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {selectedTeacherDocs.onboarding_progress.step_4_demo.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>Target Grade: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_4_demo.targetGrade || 'N/A'}</strong></div>
                      <div>Topic Explained: <strong className="text-slate-800">{selectedTeacherDocs.onboarding_progress.step_4_demo.topic || 'N/A'}</strong></div>
                    </div>

                    {selectedTeacherDocs.onboarding_progress.step_4_demo.demoVideoUrl && (
                      <div className="pt-1">
                        <a
                          href={selectedTeacherDocs.onboarding_progress.step_4_demo.demoVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                        >
                          🎥 View Demo Video Recording
                        </a>
                      </div>
                    )}

                    {selectedTeacherDocs.onboarding_progress.step_4_demo.status === 'Submitted' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyStep(selectedTeacherDocs.id, 4, 'verify')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer text-center"
                        >
                          ✓ Approve Demo Lesson
                        </button>
                        <button
                          onClick={() => handleVerifyStep(selectedTeacherDocs.id, 4, 'reject')}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer text-center"
                        >
                          ✗ Reject Demo Lesson
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Final Verify Trigger */}
                  {selectedTeacherDocs.verification_status === 'Pending' &&
                    selectedTeacherDocs.onboarding_progress.step_1_identity.status === 'Verified' &&
                    selectedTeacherDocs.onboarding_progress.step_2_qualification.status === 'Verified' &&
                    selectedTeacherDocs.onboarding_progress.step_4_demo.status === 'Approved' && (
                      <button
                        onClick={() => handleFinalApprove(selectedTeacherDocs.id, selectedTeacherDocs.name)}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] text-center"
                      >
                        🛡️ Approve Onboarding &amp; Fully Verify Tutor Partner
                      </button>
                    )
                  }
                </div>
              ) : (
                /* ── OLD BACKWARD COMPATIBLE VETTING VIEW ── */
                <>
                  {/* Per-Document Verification Controls */}
                  <div className="space-y-2.5">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credential Documents — View &amp; Toggle Status</h5>

                    {(() => {
                      const TYPE_MAP = {
                        degree:     (d) => d.type === 'Academic'   || d.name?.toLowerCase().includes('degree'),
                        aadhar:     (d) => d.type === 'Identity'   || d.name?.toLowerCase().includes('aadhaar') || d.name?.toLowerCase().includes('aadhar'),
                        resume:     (d) => d.type === 'Resume'     || d.name?.toLowerCase().includes('resume') || d.name?.toLowerCase().includes('cv'),
                      };
                      const uploadedDocs = selectedTeacherDocs.documents || [];

                      return [
                        { key: 'degree',     label: 'Academic Degree Certificate', icon: '🎓', info: 'M.Sc / B.Ed / Graduation proof from university' },
                        { key: 'aadhar',     label: 'Aadhaar Identity Card',       icon: '🪪', info: 'UIDAI 12-digit unique ID verification' },
                        { key: 'resume',     label: 'Professional Resume / CV',     icon: '📄', info: 'Curriculum Vitae containing details of teaching history' },
                      ].map((doc) => {
                        const status      = (teacherDocStatus[selectedTeacherDocs.id] || {})[doc.key] || 'Under Review';
                        const isApproved  = status === 'Approved';
                        const uploadedDoc = uploadedDocs.find(TYPE_MAP[doc.key]);
                        const fileUrl     = uploadedDoc?.fileUrl || null;
                        const isPdf       = uploadedDoc?.mimetype === 'application/pdf';

                        return (
                          <div key={doc.key} className={`p-3 rounded-xl border transition-all ${
                            isApproved ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'
                          }`}>
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-base">{doc.icon}</span>
                                <div className="min-w-0">
                                  <h6 className="text-xs font-bold text-slate-800 truncate">{doc.label}</h6>
                                  {uploadedDoc
                                    ? <p className="text-[9px] text-slate-500 font-semibold mt-0.5 truncate" title={uploadedDoc.name}>{uploadedDoc.name}</p>
                                    : <p className="text-[9px] text-rose-400 font-semibold mt-0.5">⚠ Not uploaded</p>
                                  }
                                </div>
                              </div>
                              <button
                                onClick={() => toggleDocStatus(selectedTeacherDocs.id, doc.key)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 border cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                                  isApproved
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                                    : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200'
                                }`}
                              >
                                {isApproved ? '✓ Approved' : '⏳ Review'}
                              </button>
                            </div>

                            {fileUrl && (
                              <div className="mt-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc({ url: fileUrl, name: uploadedDoc.name, isPdf: isPdf })}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  👁 Preview
                                </button>
                                <a
                                  href={fileUrl}
                                  download={uploadedDoc.name}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                                >
                                  ⬇ Download
                                </a>
                                {isPdf && (
                                  <span className="px-2 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                    PDF
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
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
                          setTeacherDocStatus(prev => ({
                            ...prev,
                            [selectedTeacherDocs.id]: { degree: 'Approved', aadhar: 'Approved', resume: 'Approved' }
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
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Teacher Earnings Modal */}
      {selectedTeacherEarnings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in text-left">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-black text-slate-800">Manage Earnings: {selectedTeacherEarnings.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Record parent payments, view ledger transaction logs, and verify payouts.</p>
              </div>
              <button 
                onClick={() => setSelectedTeacherEarnings(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Stats Panel */}
              {(() => {
                const logs = selectedTeacherEarnings.earnings_log || [];
                const totalEarned = logs.filter(l => l.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);
                const pendingInvoices = logs.filter(l => l.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);
                const totalWithdrawn = logs.filter(l => l.status === 'Payout').reduce((acc, curr) => acc + (curr.amount || 0), 0);
                const availablePayout = Math.max(0, Math.round(totalEarned * 0.4) - totalWithdrawn);

                return (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Net</span>
                      <span className="text-sm font-black text-slate-800 mt-1 block">₹{totalEarned.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payout Bal</span>
                      <span className="text-sm font-black text-slate-800 mt-1 block">₹{availablePayout.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
                      <span className="text-sm font-black text-slate-800 mt-1 block">₹{pendingInvoices.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Record a New Transaction Form */}
              <div className="bg-slate-50 border border-slate-100/70 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Record New Earning Transaction</h4>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newEarningForm.studentName || !newEarningForm.amount) {
                      triggerToast('Please provide a student name and amount');
                      return;
                    }
                    setIsSavingEarning(true);
                    try {
                      const amountNum = parseFloat(newEarningForm.amount);
                      const newLog = {
                        id: 'INV-' + Math.floor(100000 + Math.random() * 900000),
                        studentName: newEarningForm.studentName,
                        date: new Date().toISOString().split('T')[0],
                        amount: amountNum,
                        status: newEarningForm.status,
                        method: newEarningForm.method
                      };

                      const currentLogs = selectedTeacherEarnings.earnings_log || [];
                      const updatedLogs = [newLog, ...currentLogs];

                      await api.put(`/teachers/${selectedTeacherEarnings.id}`, { earnings_log: updatedLogs });
                      
                      // Update local states
                      setTeachers(prev => prev.map(t => t.id === selectedTeacherEarnings.id ? { ...t, earnings_log: updatedLogs } : t));
                      setSelectedTeacherEarnings({ ...selectedTeacherEarnings, earnings_log: updatedLogs });
                      setNewEarningForm({ studentName: '', amount: '', status: 'Paid', method: 'Razorpay' });
                      triggerToast('Transaction recorded successfully!');
                    } catch (err) {
                      console.error("Failed to add transaction:", err);
                      triggerToast(err.message || 'Failed to record transaction');
                    } finally {
                      setIsSavingEarning(false);
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Student Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Rohan Sharma"
                      value={newEarningForm.studentName}
                      onChange={e => setNewEarningForm(prev => ({ ...prev, studentName: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Amount (₹)</label>
                    <input 
                      type="number" 
                      required 
                      placeholder="e.g. 3500"
                      value={newEarningForm.amount}
                      onChange={e => setNewEarningForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Method</label>
                    <select 
                      value={newEarningForm.method}
                      onChange={e => setNewEarningForm(prev => ({ ...prev, method: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Razorpay">Razorpay</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash / Manual">Cash / Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                    <select 
                      value={newEarningForm.status}
                      onChange={e => setNewEarningForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Paid">Paid (Added to Total & Payout)</option>
                      <option value="Pending">Pending (Invoice generated)</option>
                      <option value="Payout">Payout (Direct withdrawal log)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingEarning}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all disabled:opacity-50 text-center border-0"
                    >
                      {isSavingEarning ? 'Saving Transaction...' : 'Add Transaction to Ledger'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Transactions History Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Ledger Transaction Logs</h4>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {(!selectedTeacherEarnings.earnings_log || selectedTeacherEarnings.earnings_log.length === 0) ? (
                    <p className="text-xs text-slate-400 font-bold py-4 text-center">No transactions recorded for this teacher.</p>
                  ) : (
                    selectedTeacherEarnings.earnings_log.map(log => (
                      <div key={log.id} className="py-3 flex justify-between items-center text-xs border-b border-slate-50 last:border-0">
                        <div>
                          <h5 className="font-extrabold text-slate-700">
                            {log.status === 'Payout' ? 'Payout Withdrawal' : `Tuition Fee - ${log.studentName}`}
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{log.date} | ID: {log.id} {log.method ? `via ${log.method}` : ''}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-black text-slate-800 block">₹{log.amount}</span>
                          <span className={`font-bold text-[8px] px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                            log.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : log.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-100 font-extrabold'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedTeacherEarnings(null)} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="modal-panel max-w-4xl p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-800 truncate max-w-xs sm:max-w-md">{previewDoc.name}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Vetting Document Preview</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.url}
                  download={previewDoc.name}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  ⬇ Download File
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border-0 bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-150 p-2 flex items-center justify-center overflow-auto min-h-[50vh] max-h-[70vh]">
              {previewDoc.isPdf ? (
                <div className="flex flex-col items-center justify-center w-full p-4 space-y-2">
                  <img
                    src={previewDoc.url.replace(/\.pdf$/i, '.jpg')}
                    alt={previewDoc.name}
                    className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm border border-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 font-bold italic tracking-wide">
                    📄 Page 1 Preview. Enable PDF delivery in Cloudinary Settings to download original PDF.
                  </p>
                </div>
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.name}
                  className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-sm"
                />
              )}
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
          { name: 'Fee Management', icon: CreditCard },
          { name: 'Settings', icon: Settings },
          { name: 'Support', icon: HelpCircle }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        roleName="Admin Hub"
        roleColor="violet"
        userName="Admin"
        notifications={notifications}
        onClearNotifs={async () => {
          try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
            setToastMessage('All notifications read.');
            setShowToast(true);
          } catch (err) {
            console.error('Failed to mark notifications read:', err);
          }
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
