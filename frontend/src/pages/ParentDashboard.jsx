import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { api } from '../utils/api';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CreditCard,
  MessageSquare,
  Download,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  ChevronDown,
  TrendingUp,
  Video,
  CheckSquare,
  DollarSign,
  FileText,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Edit3,
  Save,
  Phone,
  Mail,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { getDiagnosticQuestions } from '../utils/mockDb';

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



  const [supportForm, setSupportForm] = useState({ category: 'General Support', title: '', description: '' });
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  // Parent profile metadata - load from API
  const [parentName, setParentName] = useState(localStorage.getItem('cograd_parent_name') || 'Mrs. Sharma');
  const [parentUser, setParentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Child edit & waitlist states
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [editChildData, setEditChildData] = useState({});
  const [showDiagnosticTest, setShowDiagnosticTest] = useState(false);
  const [placementAnswers, setPlacementAnswers] = useState({});

  const [studentsData, setStudentsData] = useState({});
  const [selectedStudentKey, setSelectedStudentKey] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  
  const [dailyReports, setDailyReports] = useState([]);
  const [dailyReportsLoading, setDailyReportsLoading] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Helper function to update child backend data
  const updateChildDataOnBackend = async (childId, updatedFields) => {
    try {
      const isRealStudent = !childId.endsWith('_child');
      if (isRealStudent) {
        // Update the Student document directly on the backend
        const updatedStudent = await api.put(`/students/${childId}`, updatedFields);
        return updatedStudent;
      } else {
        // Update the Parent document since the child is virtual/waitlisted
        const parentPayload = { ...parentUser };
        if (updatedFields.name !== undefined) parentPayload.childName = updatedFields.name;
        if (updatedFields.standard !== undefined) parentPayload.childStandard = updatedFields.standard;
        if (updatedFields.city !== undefined) parentPayload.childCity = updatedFields.city;
        if (updatedFields.locality !== undefined) parentPayload.childLocality = updatedFields.locality;
        if (updatedFields.test_score !== undefined) parentPayload.test_score = updatedFields.test_score;
        if (updatedFields.status !== undefined) parentPayload.status = updatedFields.status;
        
        if (updatedFields.feeDue !== undefined) parentPayload.feeDue = updatedFields.feeDue;
        if (updatedFields.feeStatus !== undefined) parentPayload.feeStatus = updatedFields.feeStatus;
        if (updatedFields.feeDueDate !== undefined) parentPayload.feeDueDate = updatedFields.feeDueDate;
        if (updatedFields.activities !== undefined) parentPayload.activities = updatedFields.activities;
        if (updatedFields.schedule !== undefined) parentPayload.schedule = updatedFields.schedule;
        
        const updatedParent = await api.put(`/parents/${parentUser.id}`, parentPayload);
        setParentUser(updatedParent);
        return updatedParent;
      }
    } catch (err) {
      console.error('Failed to update child backend data:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadParentData = async () => {
      try {
        if (!localStorage.getItem('cograd_token')) return;
        const user = await api.get('/auth/me');
        if (user) {
          setParentUser(user);
          if (user.name) {
            setParentName(user.name);
            localStorage.setItem('cograd_parent_name', user.name);
          }
        }
        
        // Load children, teachers, payments and support tickets from backend
        const [children, teachersList, paymentsData, supportTicketsData] = await Promise.all([
          api.get('/parents/children'),
          api.get('/teachers'),
          api.get('/payments'),
          api.get('/support-tickets')
        ]);

        setPaymentsList(paymentsData || []);
        setTeachers(teachersList || []);
        if (supportTicketsData && user) {
          setSupportTickets(supportTicketsData.filter(t => t.userId === user.id) || []);
        }

        if (children && children.length > 0) {
          const newStudentsData = {};
          children.forEach((child) => {
            const childId = child.id || child._id;
            const childSubjects = child.subjects || ['Mathematics', 'Science'];
            const isActive = child.status === 'active' || child.status === 'Active' || child.status === 'matched';
            
            // Map teachers for these subjects only if matched
            const mappedTeachers = child.assigned_teacher_id ? childSubjects.map((subName) => {
              const matchedT = (teachersList || []).find((t) => 
                t.role === 'teacher' && 
                (t.subjects_taught || []).some(s => s.toLowerCase() === subName.toLowerCase())
              );
              return {
                name: matchedT ? matchedT.name : 'Class Tutor',
                subject: subName,
                avatar: matchedT ? matchedT.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              };
            }) : [];

            const assignedTeacherObj = child.assigned_teacher_id 
              ? (teachersList || []).find(t => t.id === child.assigned_teacher_id)
              : null;
            const primaryTeacherName = assignedTeacherObj 
              ? assignedTeacherObj.name 
              : (mappedTeachers[0]?.name || 'Not Assigned');

            const getSubjectGrade = (sub) => {
              if (child.test_score && typeof child.test_score[sub] === 'number') {
                const score = child.test_score[sub];
                return score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 75 ? 'B+' : score >= 60 ? 'B' : 'C';
              }
              return 'N/A';
            };

            let attendanceAvg = 'N/A';
            if (child.attendance_log && child.attendance_log.length > 0) {
              const presentCount = child.attendance_log.filter(l => l.status === 'Present').length;
              attendanceAvg = Math.round((presentCount / child.attendance_log.length) * 100);
            } else if (child.attendance && child.attendance !== 'N/A') {
              attendanceAvg = parseInt(child.attendance, 10);
            }

            const subjectsProgress = childSubjects.map((subName) => {
              const matchedT = mappedTeachers.find(t => t.subject === subName);
              const grade = getSubjectGrade(subName);
              
              // Extract real scores from mock_tests_log for this subject
              const subjectTests = (child.mock_tests_log || [])
                .filter(t => t.subject && t.subject.toLowerCase() === subName.toLowerCase())
                .sort((a, b) => new Date(a.date) - new Date(b.date));

              let trendPoints = [];
              if (subjectTests.length > 0) {
                trendPoints = subjectTests.map(t => typeof t.percentageNum === 'number' ? t.percentageNum : parseFloat(t.score || t.percentage || 0));
              }

              return {
                name: subName,
                teacher: child.assigned_teacher_id ? (matchedT ? matchedT.name : primaryTeacherName) : 'Not Assigned',
                attendance: attendanceAvg !== 'N/A' ? attendanceAvg : 0,
                grade: grade,
                trend: trendPoints
              };
            });

            const realGrades = subjectsProgress.map(s => s.grade).filter(g => g !== 'N/A');
            const averageGrade = realGrades.length > 0 ? (realGrades.includes('A+') ? 'A+' : realGrades.includes('A') ? 'A' : 'B+') : 'N/A';

            const feeDue = child.feeDue !== undefined ? child.feeDue : (isActive && child.assigned_teacher_id ? 3000 : 0);
            const feeStatus = child.feeStatus || (feeDue > 0 ? 'Unpaid' : 'Paid');
            const feeDueDate = child.feeDueDate || '15 June';

            let liveHomeworks = [];
            if (child.assigned_teacher_id && assignedTeacherObj) {
              const teacherAsgs = assignedTeacherObj.assignments || [];
              const teacherSubs = assignedTeacherObj.submissions || [];
              
              liveHomeworks = teacherAsgs.map(asg => {
                const matchedSub = teacherSubs.find(sub => sub.assignmentName === asg.name && (sub.studentName === child.name || sub.studentId === childId));
                return {
                  id: asg.id || `h_${Date.now()}_${asg.name}`,
                  title: asg.name,
                  subject: childSubjects[0] || 'Mathematics',
                  due: asg.dueDate || 'TBD',
                  status: matchedSub ? (matchedSub.status === 'Graded' ? 'Graded' : 'Submitted') : 'Pending',
                  score: matchedSub && matchedSub.status === 'Graded' ? `${matchedSub.finalScore}/100` : undefined
                };
              });
            }

            newStudentsData[childId] = {
              id: childId,
              name: child.name,
              class: child.standard ? `Class ${child.standard}` : 'High School',
              avatar: child.avatar || 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80',
              attendance: attendanceAvg,
              attendance_log: child.attendance_log || [],
              rank: child.rank !== undefined ? child.rank : 'N/A',
              totalInBatch: child.totalInBatch !== undefined ? child.totalInBatch : 'N/A',
              feeDue: feeDue,
              feeDueDate: feeDueDate,
              feeStatus: feeStatus,
              averageGrade: averageGrade,
              primaryTeacher: child.assigned_teacher_id ? primaryTeacherName : 'Not Assigned',
              teachers: mappedTeachers,
              subjects: subjectsProgress,
              homeworks: liveHomeworks,
              schedule: child.schedule || [],
              activities: child.activities || [],
              mock_tests_log: child.mock_tests_log || [],
              createdAt: child.createdAt
            };
          });

          setStudentsData(newStudentsData);

          const defaultStudentKey = Object.keys(newStudentsData)[0];
          setSelectedStudentKey(defaultStudentKey);
        }
      } catch (err) {
        console.error('Failed to load parent data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadParentData();
  }, []);



  // Dynamic Notifications Effect
  useEffect(() => {
    if (!selectedStudentKey || !studentsData[selectedStudentKey]) return;
    const defStudent = studentsData[selectedStudentKey];
    const generatedNotifications = [];

    const parseDate = (d) => {
      if (!d) return undefined;
      const parsed = new Date(d);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    };

    if (defStudent.attendance_log && defStudent.attendance_log.length > 0) {
      defStudent.attendance_log.slice(-2).forEach((log, index) => {
        generatedNotifications.push({
          id: 'notif_att_' + index + '_' + selectedStudentKey,
          text: `${defStudent.name} was marked ${log.status.toUpperCase()} on ${log.date} by tutor ${log.markedBy}`,
          time: 'Tutor update',
          createdAt: log.createdAt ? new Date(log.createdAt) : parseDate(log.date),
          isNew: false
        });
      });
    }

    if (defStudent.mock_tests_log && defStudent.mock_tests_log.length > 0) {
      defStudent.mock_tests_log.slice(-2).forEach((test, index) => {
        generatedNotifications.push({
          id: 'notif_test_' + index + '_' + selectedStudentKey,
          text: `New result: ${defStudent.name} scored ${test.percentage || (test.percentageNum + '%')} in ${test.testName || test.subject}`,
          time: 'Academic update',
          createdAt: test.createdAt ? new Date(test.createdAt) : parseDate(test.date),
          isNew: true
        });
      });
    }

    const defPayments = (paymentsList || []).filter(p => p.studentId === selectedStudentKey);
    if (defPayments.length > 0) {
      defPayments.slice(-2).forEach((pay, index) => {
        generatedNotifications.push({
          id: 'notif_pay_' + index + '_' + selectedStudentKey,
          text: `Payment of ₹${pay.amount} for ${defStudent.name} is processed successfully`,
          time: 'Billing',
          createdAt: pay.createdAt ? new Date(pay.createdAt) : parseDate(pay.date),
          isNew: false
        });
      });
    }

    if (generatedNotifications.length === 0) {
      generatedNotifications.push({
        id: 'notif_welcome_' + selectedStudentKey,
        text: `Welcome to Cograd! Keep track of your child ${defStudent.name}'s tuition progress here.`,
        time: 'System',
        createdAt: defStudent.createdAt ? new Date(defStudent.createdAt) : new Date(),
        isNew: true
      });
    }

    setNotifications(generatedNotifications);
  }, [selectedStudentKey, studentsData, paymentsList]);

  // Fetch daily learning reports dynamically on active student change
  useEffect(() => {
    if (!selectedStudentKey) return;
    const fetchDailyReports = async () => {
      setDailyReportsLoading(true);
      try {
        const reports = await api.get(`/students/${selectedStudentKey}/daily-reports`);
        setDailyReports(reports || []);
      } catch (err) {
        console.error('Failed to fetch daily reports:', err);
      } finally {
        setDailyReportsLoading(false);
      }
    };
    fetchDailyReports();
  }, [selectedStudentKey]);

  // Current student object based on state selector
  const activeStudent = studentsData[selectedStudentKey] || null;




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
  // eslint-disable-next-line no-unused-vars
  const [supportMessageInput, setSupportMessageInput] = useState(() => {
    return localStorage.getItem(`cograd_parent_message_to_${selectedStudentKey}`) || '';
  });

  const [lastStudentKey, setLastStudentKey] = useState(selectedStudentKey);

  // If active student changed, reset the support message input state
  if (selectedStudentKey !== lastStudentKey) {
    setLastStudentKey(selectedStudentKey);
    setSupportMessageInput(localStorage.getItem(`cograd_parent_message_to_${selectedStudentKey}`) || '');
  }

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
    localStorage.removeItem('cograd_token');
    triggerToast('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  const handleSaveChildDetails = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = { ...parentUser, ...editChildData };

      // Handle city waitlist transitions
      if (editChildData.childCity === 'Other') {
        payload.childMatchingEligible = false;
        payload.status = 'waitlist';
      } else if (parentUser.childCity === 'Other' && (editChildData.childCity === 'Meerut' || editChildData.childCity === 'Allahabad')) {
        payload.childMatchingEligible = true;
        payload.status = 'pending_match';
      }

      await api.put(`/parents/${parentUser.id}`, payload);
      setIsEditingChild(false);
      triggerToast('Child details updated successfully!');
      
      // Page reload to refresh all context safely
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      alert(err.message || 'Failed to update child details.');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fee Payment handler
  const handlePayFeeSubmit = async (e) => {
    e.preventDefault();
    if (activeStudent.feeDue <= 0) {
      triggerToast('Fee is already paid!');
      return;
    }
    if (payMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      triggerToast('Please fill in all card details to proceed.');
      return;
    }
    if (payMethod === 'upi' && !upiId) {
      triggerToast('Please enter your UPI ID to proceed.');
      return;
    }

    setPayLoading(true);
    try {
      if (payMethod === 'card') {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Are you offline?');
        }

        const orderData = await api.post('/payments/razorpay-order', {
          studentId: activeStudent.id,
          amount: String(activeStudent.feeDue)
        });

        if (!orderData || !orderData.id) {
          throw new Error('Failed to initiate Razorpay order.');
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Cograd Pathshala',
          description: `Tuition Fee for ${activeStudent.name}`,
          order_id: orderData.id,
          handler: async (response) => {
            try {
              setPayLoading(true);
              const verifyRes = await api.post('/payments/razorpay-verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                studentId: activeStudent.id,
                amount: String(activeStudent.feeDue)
              });

              if (verifyRes && verifyRes.verified) {
                const oldDue = activeStudent.feeDue;
                const updatedActivities = [
                  {
                    id: 'pay_' + Date.now(),
                    text: `Paid Tuition fee of ₹${oldDue.toLocaleString('en-IN')} successfully via Card / UPI (Razorpay)`,
                    time: 'Just now',
                    tag: 'Billing',
                    type: 'success'
                  },
                  ...(activeStudent.activities || [])
                ];

                const updatedFields = {
                  feeDue: 0,
                  feeStatus: 'Paid',
                  feeDueDate: 'Paid on ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                  activities: updatedActivities
                };

                setStudentsData(prev => {
                  const studentCopy = { ...prev[selectedStudentKey], ...updatedFields };
                  return { ...prev, [selectedStudentKey]: studentCopy };
                });

                setShowPayModal(false);
                triggerToast(`Payment of ₹${oldDue.toLocaleString('en-IN')} was processed successfully!`);
              } else {
                throw new Error('Payment verification failed.');
              }
            } catch (err) {
              console.error('Razorpay verification error:', err);
              triggerToast('Payment verification failed: ' + err.message);
            } finally {
              setPayLoading(false);
            }
          },
          prefill: {
            name: parentName,
            email: parentUser?.email || '',
            contact: parentUser?.phone || '',
          },
          theme: {
            color: '#4F46E5',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setPayLoading(false);
        return;
      }

      // 1. Record payment record (Fallback UPI simulation)
      await api.post('/payments', {
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        amount: String(activeStudent.feeDue),
        method: 'UPI'
      });

      // 2. Prepare updated fields
      const oldDue = activeStudent.feeDue;
      const updatedActivities = [
        {
          id: 'pay_' + Date.now(),
          text: `Paid Tuition fee of ₹${oldDue.toLocaleString('en-IN')} successfully via ${payMethod.toUpperCase()}`,
          time: 'Just now',
          tag: 'Billing',
          type: 'success'
        },
        ...(activeStudent.activities || [])
      ];

      const updatedFields = {
        feeDue: 0,
        feeStatus: 'Paid',
        feeDueDate: 'Paid on ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        activities: updatedActivities
      };

      // 3. Save to backend database
      await updateChildDataOnBackend(selectedStudentKey, updatedFields);

      // 4. Update frontend state
      setStudentsData(prev => {
        const studentCopy = { ...prev[selectedStudentKey], ...updatedFields };
        return { ...prev, [selectedStudentKey]: studentCopy };
      });

      // Append to global notifications
      setNotifications(prev => [
        {
          id: Date.now(),
          text: `Payment of ₹${oldDue.toLocaleString('en-IN')} for ${activeStudent.name} is processed.`,
          time: 'Just now',
          isNew: true
        },
        ...prev
      ]);

      // Reset payment card fields and close
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setUpiId('');
      setShowPayModal(false);
      triggerToast('Payment Processed Successfully!');
    } catch (err) {
      console.error('Payment processing failed:', err);
      triggerToast('Payment failed: ' + err.message);
    } finally {
      setPayLoading(false);
    }
  };

  // PTM Scheduling handler
  const handleBookPTMSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !bookingDate || !bookingTime) {
      triggerToast('Please fill out all booking fields to continue.');
      return;
    }

    setPtmLoading(true);
    try {
      const formattedDate = new Date(bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const [hours, minutes] = bookingTime.split(':');
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const formattedTime = `${parseInt(hours) % 12 || 12}:${minutes} ${ampm}`;

      const ptmScheduleItem = {
         id: 'ptm_' + Date.now(),
         type: 'PTM',
         title: `PTM with ${selectedTeacher}`,
         date: formattedDate,
         time: formattedTime,
         details: `${ptmMode === 'Call' ? 'Telephonic Call' : 'In-Home Visit'} scheduled`,
         icon: ptmMode === 'Call' ? 'phone' : 'home'
      };

      const ptmActivityItem = {
         id: 'ptm_act_' + Date.now(),
         text: `Booked Parent-Teacher Meeting with ${selectedTeacher} for ${formattedDate} at ${formattedTime}`,
         time: 'Just now',
         tag: 'Calendar',
         type: 'primary'
      };

      const updatedSchedule = [ptmScheduleItem, ...(activeStudent.schedule || [])];
      const updatedActivities = [ptmActivityItem, ...(activeStudent.activities || [])];

      await updateChildDataOnBackend(selectedStudentKey, {
        schedule: updatedSchedule,
        activities: updatedActivities
      });

      setStudentsData(prev => {
        const studentCopy = { 
          ...prev[selectedStudentKey], 
          schedule: updatedSchedule, 
          activities: updatedActivities 
        };
        return { ...prev, [selectedStudentKey]: studentCopy };
      });

      setSelectedTeacher('');
      setBookingDate('');
      setBookingTime('');
      setShowPTMModal(false);
      triggerToast('Parent-Teacher Meeting booked successfully!');
    } catch (err) {
      console.error('PTM booking failed:', err);
      triggerToast('PTM booking failed: ' + err.message);
    } finally {
      setPtmLoading(false);
    }
  };

  // Support Ticket Submission handler
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportForm.title || !supportForm.description) {
      triggerToast('Please fill out all fields.');
      return;
    }

    setSupportSubmitting(true);
    try {
      const response = await api.post('/support-tickets', {
        userId: parentUser?.id,
        userName: parentName,
        userRole: 'parent',
        title: supportForm.title,
        description: supportForm.description,
        category: supportForm.category
      });

      if (response && response.ticket) {
        setSupportTickets(prev => [response.ticket, ...prev]);
        setSupportForm({ category: 'General Support', title: '', description: '' });
        triggerToast('Support ticket submitted successfully!');
      } else {
        throw new Error('Failed to submit support ticket.');
      }
    } catch (err) {
      console.error('Failed to submit support ticket:', err);
      triggerToast('Submission failed: ' + (err.message || 'Server error'));
    } finally {
      setSupportSubmitting(false);
    }
  };

  // Compile and download report card
  const handleDownloadReport = async () => {
    setDownloadLoading(true);
    try {
      const updatedActivities = [
        {
          id: 'dl_' + Date.now(),
          text: `Downloaded Academic Report Card for Term Examination`,
          time: 'Just now',
          tag: 'Report',
          type: 'success'
        },
        ...(activeStudent.activities || [])
      ];

      await updateChildDataOnBackend(selectedStudentKey, {
        activities: updatedActivities
      });

      setStudentsData(prev => {
        const studentCopy = { ...prev[selectedStudentKey], activities: updatedActivities };
        return { ...prev, [selectedStudentKey]: studentCopy };
      });

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

      setShowReportModal(false);
      triggerToast('Report Card file downloaded successfully!');
    } catch (err) {
      console.error('Failed to compile report card:', err);
      triggerToast('Failed to compile report card.');
    } finally {
      setDownloadLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} aria-label="Loading" />
          <p className="text-sm font-semibold text-slate-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!activeStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">No Linked Children Found</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
            There are no children linked to your parent account (<strong>{parentName}</strong>). Please register your child via the student portal with your phone number, or contact administration.
          </p>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="mt-6 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Sign Out &amp; Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardShell
        navItems={[
          { name: 'Overview', icon: LayoutDashboard },
          { name: 'Progress', icon: BookOpen },
          { name: 'Daily Learning', icon: Eye },
          { name: 'Fee Manager', icon: CreditCard },
          { name: 'Help & Support', icon: HelpCircle }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        roleName="Parent Dashboard"
        roleColor="amber"
        userName={parentName}
        notifications={notifications}
        onClearNotifs={async () => {
          setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
          try {
            await api.put('/notifications/my-notifications/read-all');
          } catch (e) {
            console.error('Failed to mark user notifications as read:', e);
          }
        }}
        onDeleteNotif={async (id) => {
          setNotifications(p => p.filter(n => n.id !== id));
          try {
            await api.delete(`/notifications/my-notifications/${id}`);
          } catch (e) {
            console.error('Failed to delete notification:', e);
          }
        }}
        onClearAllNotifs={async () => {
          setNotifications([]);
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
            {/* Child Selector Dropdown */}
            <div className="relative">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Active Student</label>
              <div className="flex items-center bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 rounded-xl px-3 py-1.5 cursor-pointer transition-colors shadow-sm relative pr-8">
                <select
                  value={selectedStudentKey}
                  onChange={(e) => setSelectedStudentKey(e.target.value)}
                  className="appearance-none bg-transparent outline-none pr-4 text-xs font-bold text-slate-800 cursor-pointer w-full text-slate-800"
                >
                  {Object.keys(studentsData).map((key) => (
                    <option key={key} value={key}>
                      {studentsData[key].name} - {studentsData[key].class}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
              </div>
            </div>
          </div>
        }
      >
        <div key={activeTab} className="tab-content-enter h-full w-full">
          {parentUser?.childMatchingEligible === false || parentUser?.status === 'waitlist' ? (
            showDiagnosticTest ? (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 no-glass">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="text-left">
                    <span className="text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">Placement Test</span>
                    <h3 className="text-lg font-black text-slate-805 mt-1">Assess Child's Level</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      This short test helps us understand <strong>{parentUser.childName}</strong>'s level in <strong>{parentUser.childSubjects?.join(', ') || 'selected subjects'}</strong>
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-2xl shrink-0">
                    <span className="text-[10px] text-amber-700 font-black block uppercase tracking-wide">
                      {getDiagnosticQuestions(parentUser.childStandard || 'Class 10').reduce((sum, q) => sum + q.marks, 0)} Marks Total
                    </span>
                  </div>
                </div>

                <div className="space-y-5 text-left max-h-[450px] overflow-y-auto pr-2">
                  {getDiagnosticQuestions(parentUser.childStandard || 'Class 10').map((q, qidx) => (
                    <div key={q.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{q.subject} • {q.marks} Marks</span>
                        <div className="text-xs font-bold text-slate-850">Question {qidx + 1}. {q.text}</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = placementAnswers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setPlacementAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              className={`text-left text-xs font-semibold py-2.5 px-3.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-white text-slate-650 border-slate-150 hover:bg-slate-50'
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

                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">
                    Answered {Object.keys(placementAnswers).filter(k => placementAnswers[k] !== '').length} of {getDiagnosticQuestions(parentUser.childStandard || 'Class 10').length} questions
                  </span>
                  <button
                    type="button"
                    disabled={!getDiagnosticQuestions(parentUser.childStandard || 'Class 10').every(q => placementAnswers[q.id] !== undefined && placementAnswers[q.id] !== '')}
                    onClick={async () => {
                      const qs = getDiagnosticQuestions(parentUser.childStandard || 'Class 10');
                      let mathScore = 0, scienceScore = 0, mathTotal = 0, scienceTotal = 0;
                      qs.forEach(q => {
                        const isCorrect = placementAnswers[q.id] === q.correct;
                        const pts = isCorrect ? q.marks : 0;
                        if (q.subject === 'Mathematics') { mathScore += pts; mathTotal += q.marks; }
                        else if (q.subject === 'Science') { scienceScore += pts; scienceTotal += q.marks; }
                      });
                      const scores = {
                        Mathematics: Math.round((mathScore / mathTotal) * 100) || 0,
                        Science: Math.round((scienceScore / scienceTotal) * 100) || 0,
                        mathMarksText: `${mathScore}/${mathTotal}`,
                        scienceMarksText: `${scienceScore}/${scienceTotal}`,
                        totalMarksText: `${mathScore + scienceScore}/${mathTotal + scienceTotal}`
                      };
                      try {
                        const updated = {
                          ...parentUser,
                          test_score: scores,
                          test_completed_at: new Date().toISOString(),
                          status: 'pending_match'
                        };
                        await api.put(`/parents/${parentUser.id}`, updated);
                        setParentUser(updated);
                        setShowDiagnosticTest(false);
                        triggerToast('Child placement test completed successfully!');
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      } catch (err) {
                        alert(err.message || 'Failed to submit test score.');
                      }
                    }}
                    className={`px-6 py-3 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      getDiagnosticQuestions(parentUser.childStandard || 'Class 10').every(q => placementAnswers[q.id] !== undefined && placementAnswers[q.id] !== '')
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Submit & Complete Setup
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-9 h-9 text-amber-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your Child is on Our Waitlist!</h3>
                    <p className="text-slate-500 text-xs mt-2">
                      Welcome to Cograd, parent of <strong>{parentUser.childName}</strong>!
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-100 text-left">
                    <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                      Cograd Pathshala currently operates in <strong>Meerut</strong> and <strong>Allahabad</strong>. We've recorded child's location preference for <strong>{parentUser.childCity || 'your city'}</strong>, and we'll notify you as soon as we expand to your area.
                    </p>
                  </div>

                  {!isEditingChild ? (
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-2">Child's Details</span>
                        <div className="space-y-1.5 text-xs text-slate-650">
                          <p><span className="font-bold text-slate-800">Name:</span> {parentUser.childName}</p>
                          <p><span className="font-bold text-slate-800">Class:</span> {parentUser.childStandard}</p>
                          <p><span className="font-bold text-slate-800">City:</span> {parentUser.childCity}</p>
                          {parentUser.childLocality && <p><span className="font-bold text-slate-800">Locality:</span> {parentUser.childLocality}</p>}
                          <p><span className="font-bold text-slate-800">Subjects:</span> {parentUser.childSubjects?.join(', ')}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditChildData({
                            childName: parentUser.childName,
                            childStandard: parentUser.childStandard,
                            childCity: parentUser.childCity,
                            childLocality: parentUser.childLocality,
                          });
                          setIsEditingChild(true);
                        }}
                        className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Child Details / Change City
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveChildDetails} className="bg-white rounded-2xl p-5 border border-slate-100 text-left space-y-4">
                      <span className="text-xs font-black text-slate-850 block">Update Child's Details</span>
                      
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Child's Full Name</label>
                        <input
                          type="text"
                          required
                          value={editChildData.childName}
                          onChange={(e) => setEditChildData(prev => ({ ...prev, childName: e.target.value }))}
                          className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">City</label>
                          <select
                            value={editChildData.childCity}
                            onChange={(e) => setEditChildData(prev => ({ ...prev, childCity: e.target.value }))}
                            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                          >
                            <option value="Meerut">Meerut</option>
                            <option value="Allahabad">Allahabad</option>
                            <option value="Other">Other</option>
                          </select>
                          {editChildData.childCity === 'Other' && (
                            <p className="text-[10px] text-amber-600 font-semibold mt-1 leading-relaxed">
                              ⚠️ Cograd operates in Meerut and Allahabad. We'll add your child to our waitlist!
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Area / Locality</label>
                          <input
                            type="text"
                            value={editChildData.childLocality || ''}
                            onChange={(e) => setEditChildData(prev => ({ ...prev, childLocality: e.target.value }))}
                            placeholder="e.g. Civil Lines, Sadar"
                            className="w-full text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingChild(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold text-xs rounded-xl transition-all cursor-pointer"
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
          ) : (
            <>
              {/* Upgrade test prompt */}
              {parentUser?.childMatchingEligible && !parentUser?.test_score && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <div>
                    <h4 className="text-base font-black text-slate-805">Placement Assessment Required</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Please complete {parentUser.childName}'s Diagnostic Placement Test to find nearby tutors matching their level.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPlacementAnswers({});
                      setShowDiagnosticTest(true);
                    }}
                    className="btn-primary py-2.5 px-6 text-xs flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Start Placement Test
                  </button>
                </div>
              )}
              {/* ================================== OVERVIEW TAB ================================== */}
              {activeTab === 'Overview' && (
                <div className="space-y-6">              {/* Smart Attendance Alert Banner or Gate Status Banner */}
              {(() => {
                const todayStr = new Date().toISOString().split('T')[0];
                const todayRecord = activeStudent.attendance_log?.find(log => log.date === todayStr);

                if (todayRecord) {
                  if (todayRecord.status === 'Present') {
                    return (
                      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between gap-4 animate-slide-up">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">✅ Center Check-in Status</h4>
                            <p className="text-xs font-bold text-slate-700 mt-0.5">{activeStudent.name} successfully checked in at the center (marked Present by {todayRecord.markedBy}) today.</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">Checked In</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-200 rounded-3xl p-4 flex items-center justify-between gap-4 animate-slide-up">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200 shrink-0">
                            <AlertCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">⚠️ Center Check-in Alert</h4>
                            <p className="text-xs font-bold text-slate-700 mt-0.5">{activeStudent.name} was marked ABSENT today by tutor {todayRecord.markedBy}.</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full font-bold">Absent</span>
                      </div>
                    );
                  }
                }

                // If no entry for today, check overall attendance
                const attendancePct = typeof activeStudent.attendance === 'number' 
                  ? activeStudent.attendance 
                  : parseInt(activeStudent.attendance, 10);

                if (!isNaN(attendancePct) && attendancePct < 90) {
                  return (
                    <div className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-200 rounded-3xl p-4 flex items-center justify-between gap-4 animate-slide-up">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200 shrink-0">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">⚠️ Smart Attendance Alert</h4>
                          <p className="text-xs font-bold text-slate-700 mt-0.5">{activeStudent.name}'s overall attendance has dropped to {activeStudent.attendance}% (below recommended 90%).</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const updatedSchedule = [
                            {
                              id: 'ptm_sync_' + Date.now(),
                              type: 'PTM',
                              title: `PTM with ${activeStudent.primaryTeacher}`,
                              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                              time: '3:00 PM',
                              details: 'Attendance Review Sync (Call)',
                              icon: 'phone'
                            },
                            ...(activeStudent.schedule || [])
                          ];
                          const updatedActivities = [
                            {
                              id: 'ptm_act_sync_' + Date.now(),
                              text: `Requested urgent performance sync with ${activeStudent.primaryTeacher}`,
                              time: 'Just now',
                              tag: 'Calendar',
                              type: 'warning'
                            },
                            ...(activeStudent.activities || [])
                          ];

                          try {
                            await updateChildDataOnBackend(selectedStudentKey, {
                              schedule: updatedSchedule,
                              activities: updatedActivities
                            });
                            setStudentsData(prev => {
                              const studentCopy = { ...prev[selectedStudentKey], schedule: updatedSchedule, activities: updatedActivities };
                              return { ...prev, [selectedStudentKey]: studentCopy };
                            });
                            triggerToast(`Counselor meeting scheduled with ${activeStudent.primaryTeacher}!`);
                          } catch {
                            triggerToast('Failed to schedule sync.');
                          }
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
                      >
                        Request Tutor Sync
                      </button>
                    </div>
                  );
                }

                // Default banner if everything is fine
                return (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between gap-4 animate-slide-up">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">✅ Center Check-in Status</h4>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">Classes are active. No attendance alerts or abnormalities recorded for {activeStudent.name}.</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">Good Standing</span>
                  </div>
                );
              })()}
              
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
                    <span className="text-lg font-black text-slate-800">
                      {activeStudent.attendance === 'N/A' ? 'Pending' : `${activeStudent.attendance}%`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance</span>
                  </div>

                  {/* Home tutor badge */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:scale-[1.02] transition-transform shadow-inner flex flex-col items-center text-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-sm font-black text-slate-800 truncate max-w-full px-1">{activeStudent.primaryTeacher.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Home Tutor</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
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
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Subject-Wise Performance</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Mock examinations and tests progress trend</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Progress')}
                    className="text-xs text-blue-600 font-bold flex items-center hover:underline"
                  >
                    <span>Detailed Analysis</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeStudent.subjects.map((sub, index) => {
                    const hasTrend = sub.trend && sub.trend.length > 0;
                    const trendMin = hasTrend ? Math.min(...sub.trend) : 0;
                    const trendMax = hasTrend ? Math.max(...sub.trend) : 0;
                    const points = hasTrend ? sub.trend.map((val, idx) => {
                      const x = (idx / (sub.trend.length - 1)) * 100;
                      const y = 50 - ((val - trendMin) / (trendMax - trendMin || 1)) * 40;
                      return `${x},${y}`;
                    }).join(' ') : '';

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
                        <div className="w-full h-12 my-3 relative overflow-hidden flex items-center justify-center">
                          {hasTrend ? (
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
                          ) : (
                            <span className="text-[9px] text-slate-400 italic">No score progress</span>
                          )}
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
                    {(activeStudent.activities || []).map((act) => (
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
          {activeTab === 'Progress' && (
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
                  {activeStudent.mock_tests_log && activeStudent.mock_tests_log.length > 0 ? (
                    activeStudent.mock_tests_log.map((test, idx) => {
                      const scoreNum = typeof test.percentageNum === 'number' ? test.percentageNum : parseFloat(test.score || test.percentage || 0);
                      const status = scoreNum >= 85 ? 'Outstanding' : scoreNum >= 70 ? 'Good' : 'Average';
                      const feedback = test.feedback || (scoreNum >= 85 
                        ? `Excellent grasp of ${test.subject || 'subject'} concepts. Maintain this great level of dedication.` 
                        : `Decent conceptual clarity in ${test.subject || 'subject'}. Further practice and query resolution recommended.`);
                      
                      return (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-slate-805 leading-snug truncate max-w-[80%]">{test.title || test.testName || `${test.subject || 'Subject'} Mock Test`}</span>
                              <span className="px-2 py-0.5 text-[9px] bg-blue-50 text-blue-700 font-bold border border-blue-100 rounded">{test.subject || 'General'}</span>
                            </div>
                            <div className="flex justify-between items-end my-3.5">
                              <div>
                                <span className="text-2xl font-black text-slate-800">{test.score || `${scoreNum}%`}</span>
                                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Rank: {test.rank || 'Completed'} • {test.date}</span>
                              </div>
                              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border ${
                                status === 'Outstanding' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                  : 'bg-blue-50 text-blue-700 border-blue-100'
                              }`}>
                                {status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-white border border-slate-100 rounded-xl p-2.5">
                              <strong className="text-slate-700 block text-[9px] uppercase tracking-wide mb-0.5">Mentor Feedback:</strong>
                              "{feedback}"
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="sm:col-span-2 py-10 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-2xl border border-slate-100">
                      No mock tests or examinations have been completed yet.
                    </div>
                  )}
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


          {/* ================================== FEES TAB ================================== */}
          {/* ================================== FEES TAB ================================== */}
          {activeTab === 'Fee Manager' && (
            <div className="space-y-6 text-left tab-content-enter">
              
              {/* Simplified Tuition Billing Stepper */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-4">How Tuition Billing Works</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0">1</div>
                    <div>
                      <h5 className="text-xs font-black text-slate-805">Tutor Records Hours</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">Tutor marks lesson topic and duration after each daily home tuition class.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0">2</div>
                    <div>
                      <h5 className="text-xs font-black text-slate-805">Monthly Invoice Compiled</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">Cograd automatically tallies the logged session hours at your standard rate on the 1st of each month.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0">3</div>
                    <div>
                      <h5 className="text-xs font-black text-slate-805">Easy 1-Click Payment</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">Review your transparent bill summary and clear your due balance securely here using UPI or Card.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Quick Pay Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Billing Card */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Tuition Status</span>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight mt-0.5">Current Billing Cycle</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                        activeStudent.feeDue > 0 
                          ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {activeStudent.feeDue > 0 ? 'Payment Pending' : 'All Fees Paid'}
                      </span>
                    </div>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-850">
                        ₹{activeStudent.feeDue > 0 ? activeStudent.feeDue.toLocaleString('en-IN') : '0'}
                      </span>
                      {activeStudent.feeDue > 0 && (
                        <span className="text-xs font-semibold text-slate-400">due by {activeStudent.feeDueDate}</span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 font-semibold mt-2 leading-relaxed">
                      {activeStudent.feeDue > 0 
                        ? 'Your regular monthly tuition invoice is ready for checkout. Please complete payment to avoid tutoring sessions suspension.' 
                        : 'Awesome! Your account is fully paid and up to date. Next billing invoice will compile on the 1st of next month.'}
                    </p>
                  </div>

                  {activeStudent.feeDue > 0 && (
                    <button 
                      onClick={() => setShowPayModal(true)}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <CreditCard className="w-4 h-4" /> Pay Due Tuition Balance Now
                    </button>
                  )}
                </div>

                {/* Billing Breakdown / Transparency details */}
                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-black text-slate-805 text-sm">Transparent Cost Breakdown</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Billing rates calibrated for your locality matches</p>
                  </div>
                  
                  <div className="space-y-2.5 py-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                      <span>Base Tuition Hours</span>
                      <span className="text-slate-850">₹{activeStudent.feeDue > 0 ? (activeStudent.feeDue - 150).toLocaleString('en-IN') : 'Included'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-655">
                      <span>Platform/Support Charges</span>
                      <span className="text-slate-850">₹{activeStudent.feeDue > 0 ? '150' : 'Included'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                      <span>Tutor matching guarantee</span>
                      <span className="text-emerald-600 font-black">FREE / Included</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-800">
                    <span>Total Due Rate</span>
                    <span>₹{activeStudent.feeDue > 0 ? activeStudent.feeDue.toLocaleString('en-IN') : '0'}</span>
                  </div>
                </div>
              </div>

              {/* Simplified Receipts table */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div>
                  <h3 className="font-black text-slate-800 text-base">Payment Receipts History</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Download your historical tuition fee receipt documents.</p>
                </div>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Billing Date</th>
                        <th className="pb-3 font-extrabold">Amount Paid</th>
                        <th className="pb-3 font-extrabold">Payment Method</th>
                        <th className="pb-3 font-extrabold">Status</th>
                        <th className="pb-3 text-right font-extrabold">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {paymentsList.filter(p => p.studentId === activeStudent.id).map((pay) => (
                        <tr key={pay.id || pay._id} className="hover:bg-slate-50/50 transition-colors text-slate-500">
                          <td className="py-4 font-bold text-slate-600">{pay.date}</td>
                          <td className="py-4 font-black text-slate-850">₹{parseFloat(pay.amount).toLocaleString('en-IN')}</td>
                          <td className="py-4 text-xs font-semibold">Paid via {pay.method.toUpperCase()}</td>
                          <td className="py-4">
                            <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">
                              Paid Success
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => {
                                triggerToast(`Downloading Receipt ${pay.id}...`);
                                const element = document.createElement('a');
                                const file = new Blob([
                                  `=========================================\n`,
                                  `    COGRAD PATHSHALA - PAYMENT RECEIPT   \n`,
                                  `=========================================\n\n`,
                                  `Receipt ID    : ${pay.id}\n`,
                                  `Date          : ${pay.date}\n`,
                                  `Student Name  : ${pay.studentName}\n`,
                                  `Student ID    : ${pay.studentId}\n`,
                                  `Amount Paid   : ₹${pay.amount}\n`,
                                  `Payment Method: ${pay.method}\n`,
                                  `Status        : SUCCESS / PAID\n\n`,
                                  `Thank you for your payment!\n`,
                                  `=========================================\n`
                                ], { type: 'text/plain' });
                                element.href = URL.createObjectURL(file);
                                element.download = `Receipt_${pay.id}.txt`;
                                document.body.appendChild(element);
                                element.click();
                                document.body.removeChild(element);
                              }}
                              className="text-amber-600 hover:text-amber-700 font-extrabold cursor-pointer"
                            >
                              Download Receipt (.TXT)
                            </button>
                          </td>
                        </tr>
                      ))}

                      {paymentsList.filter(p => p.studentId === activeStudent.id).length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-xs text-slate-400 font-medium">
                            No payment records found for this student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                      </div>
            </div>
          )}
          {/* ============================================================ */}
          {/* DAILY LEARNING REPORTS TAB - Shows teacher-submitted reports */}
          {/* ============================================================ */}
          {activeTab === 'Daily Learning' && (() => {
            const today = new Date().toISOString().split('T')[0];
            const todayReports = (dailyReports || []).filter(r => r.date === today);
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
                      <p className="text-xs text-amber-700 font-semibold mt-0.5">Your child's teacher has not submitted a daily report yet. You can coordinate with them or check back later.</p>
                    </div>
                  </div>
                )}

                {dailyReportsLoading ? (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-12 text-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs text-slate-400 font-semibold">Loading daily reports from database...</p>
                  </div>
                ) : !dailyReports || dailyReports.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-12 text-center space-y-3">
                    <div className="text-5xl">📋</div>
                    <h3 className="text-sm font-black text-slate-700">No Reports Yet</h3>
                    <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">Once your child's teacher submits a daily learning report after a session, it will appear here with full details.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dailyReports.map((report, idx) => (
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
                  let upcoming = [];
                  if (activeStudent) {
                    const matchedTeacher = (teachers || []).find(t => t.id === activeStudent.assigned_teacher_id);
                    if (matchedTeacher && matchedTeacher.content_schedule) {
                      const todayDate = new Date();
                      todayDate.setHours(0, 0, 0, 0);
                      upcoming = matchedTeacher.content_schedule.filter(s => new Date(s.date + 'T00:00:00') >= todayDate).slice(0, 5);
                    }
                  }

                  if (upcoming.length === 0) return null;

                  const todayDate = new Date();
                  todayDate.setHours(0, 0, 0, 0);

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
          {activeTab === 'Help & Support' && (
            <div className="space-y-6 text-left">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 rounded-3xl border border-amber-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
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

              {/* Existing Support Tickets List */}
              {supportTickets && supportTickets.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 animate-fade-in mt-6">
                  <h3 className="text-base font-black text-slate-800 tracking-tight">Your Support Tickets</h3>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                    {supportTickets.map((ticket) => (
                      <div key={ticket.id || ticket._id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800">{ticket.title}</span>
                            <span className="text-[9px] bg-slate-50 border border-slate-150 px-2 py-0.5 rounded text-slate-500 font-semibold">{ticket.category}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{ticket.description}</p>
                          <span className="text-[9px] text-slate-400 font-bold block mt-1">Ticket ID: {ticket.id}</span>
                        </div>
                        <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border shrink-0 ${
                          ticket.status === 'Resolved' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </>
        )}
        </div>
      </DashboardShell>

      {/* ================================== MODALS SECTION ================================== */}

      {/* 1. PAY FEE MODAL */}
      {showPayModal && (
        <div className="modal-overlay">
          <div className="modal-panel p-6">
            
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
        <div className="modal-overlay">
          <div className="modal-panel p-6">
            
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




    </>
  );
};

export default ParentDashboard;
