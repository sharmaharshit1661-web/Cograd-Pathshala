import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import {
  User, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight,
  Upload, FileText, Trash2, HelpCircle, Clock, Video, CheckCircle,
  FileCheck, BookOpen, GraduationCap, Phone, Mail, Award, X
} from 'lucide-react';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:4000/api'
  : 'https://cograd-pathshala-ygyi.onrender.com/api';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Science', 'Coding'];

const GRADE_LEVELS = ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];

const QUALIFICATION_SUGGESTIONS = [
  "B.Ed", "B.Tech", "B.Sc", "B.A", "B.Com", "BCA", "BBA", "B.El.Ed", "B.P.Ed", "B.E", "B.Pharm",
  "M.Ed", "M.Tech", "M.Sc", "M.A", "M.Com", "MCA", "MBA", "M.E", "M.Phil",
  "Ph.D", "D.El.Ed", "D.Ed", "NTT", "CTET", "TET"
];

// Timed MCQ Test questions per subject
const TEST_QUESTIONS = {
  Mathematics: [
    { id: 1, q: 'What is the derivative of x^2 + 3x with respect to x?', options: ['2x', '2x + 3', 'x + 3', '3x'], ans: 1 },
    { id: 2, q: 'If log_2(x) = 5, what is the value of x?', options: ['10', '25', '32', '64'], ans: 2 },
    { id: 3, q: 'What is the sum of angles in a hexagon?', options: ['360°', '540°', '720°', '900°'], ans: 2 },
    { id: 4, q: 'Solve for x: 3x - 7 = 5x + 9', options: ['-8', '8', '-1', '1'], ans: 0 },
    { id: 5, q: 'What is the probability of flipping a fair coin three times and getting all heads?', options: ['1/2', '1/4', '1/6', '1/8'], ans: 3 }
  ],
  Science: [
    { id: 1, q: 'Which organelle is known as the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], ans: 1 },
    { id: 2, q: 'What is the chemical formula of ozone?', options: ['O2', 'O3', 'CO2', 'H2O'], ans: 1 },
    { id: 3, q: 'Which component of blood is responsible for clotting?', options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], ans: 2 },
    { id: 4, q: 'What is the acceleration due to gravity on Earth?', options: ['9.8 m/s^2', '8.9 m/s^2', '1.6 m/s^2', '10.5 m/s^2'], ans: 0 },
    { id: 5, q: 'Which chemical element has the symbol Fe?', options: ['Fluorine', 'Iron', 'Fermium', 'Lead'], ans: 1 }
  ],
  English: [
    { id: 1, q: 'Choose the correct spelling:', options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accomoddate'], ans: 1 },
    { id: 2, q: 'What is the antonym of "Meticulous"?', options: ['Careful', 'Sloppy', 'Detailed', 'Precise'], ans: 1 },
    { id: 3, q: 'Identify the passive voice sentence:', options: ['She wrote a book.', 'The book was written by her.', 'She is writing a book.', 'She will write a book.'], ans: 1 },
    { id: 4, q: 'Which word describes a person who speaks many languages?', options: ['Polygamy', 'Polyglot', 'Polygon', 'Polymorphic'], ans: 1 },
    { id: 5, q: 'Complete the sentence: "By the time we arrived, they ______ already left."', options: ['have', 'had', 'has', 'were'], ans: 1 }
  ],
  'Social Science': [
    { id: 1, q: 'Who is known as the Father of the Indian Constitution?', options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'], ans: 1 },
    { id: 2, q: 'Which is the largest desert in the world?', options: ['Sahara', 'Gobi', 'Antarctic Desert', 'Arabian'], ans: 2 },
    { id: 3, q: 'In which year did World War I begin?', options: ['1914', '1918', '1939', '1945'], ans: 0 },
    { id: 4, q: 'Which line separates India and China?', options: ['Radcliffe Line', 'McMahon Line', 'Durand Line', 'Line of Control'], ans: 1 },
    { id: 5, q: 'What type of economy is India?', options: ['Capitalist', 'Socialist', 'Mixed', 'Traditional'], ans: 2 }
  ],
  Coding: [
    { id: 1, q: 'Which keyword is used to declare a block-scoped variable in JavaScript?', options: ['var', 'let', 'define', 'constOnly'], ans: 1 },
    { id: 2, q: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], ans: 1 },
    { id: 3, q: 'Which protocol is used to transmit hypertext over the web securely?', options: ['HTTP', 'HTTPS', 'FTP', 'SSH'], ans: 1 },
    { id: 4, q: 'What is the output of `typeof null` in JavaScript?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], ans: 2 },
    { id: 5, q: 'Which HTML tag is used to reference an external JavaScript file?', options: ['<link>', '<script>', '<js>', '<style>'], ans: 1 }
  ]
};

export default function TeacherOnboardingPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [onboarding, setOnboarding] = useState(null);

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(true);

  // Form Fields Step 1
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [selfie, setSelfie] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  // Form Fields Step 2
  const [degreeName, setDegreeName] = useState('');
  const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);
  const [universityName, setUniversityName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [professionalCertName, setProfessionalCertName] = useState('');
  const [degreeFile, setDegreeFile] = useState(null);
  const [professionalFile, setProfessionalFile] = useState(null);

  const filteredDegrees = degreeName.trim() === ""
    ? []
    : QUALIFICATION_SUGGESTIONS.filter(q =>
        q.toLowerCase().startsWith(degreeName.toLowerCase()) ||
        q.toLowerCase().includes(degreeName.toLowerCase())
      );

  // Test Console Step 3
  const [testSubject, setTestSubject] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testTimeLeft, setTestTimeLeft] = useState(300); // 5 minutes (300s)
  const [testScore, setTestScore] = useState(null);
  const [testPassed, setTestPassed] = useState(null);
  const timerRef = useRef(null);

  // Form Fields Step 4
  const [targetGrade, setTargetGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [demoVideoFile, setDemoVideoFile] = useState(null);

  const handleFileChange = (setter, file, fileType = 'document') => {
    if (!file) return;
    const isImage = fileType === 'image';
    const isVideo = fileType === 'video';
    const limit = isImage ? 150 * 1024 : isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const limitStr = isImage ? '150 KB' : isVideo ? '50 MB' : '10 MB';
    if (file.size > limit) {
      alert(`File too large! Maximum allowed size for ${fileType}s is ${limitStr}.`);
      return;
    }
    setter(file);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (testStarted && testTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTestTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitTestAutomatically();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [testStarted, testTimeLeft]);

  const fetchStatus = async () => {
    try {
      const me = await api.get('/auth/me');
      setProfile(me);
      
      const res = await api.get('/teachers/onboarding/status');
      setOnboarding(res.onboarding_progress);
      
      // Pre-fill existing data if submitted/failed
      if (res.onboarding_progress) {
        const s1 = res.onboarding_progress.step_1_identity;
        setAadhaarNumber(s1.aadhaarNumber || '');
        setPanNumber(s1.panNumber || '');
        setOtpVerified(true);

        const s2 = res.onboarding_progress.step_2_qualification;
        setDegreeName(s2.degreeName || '');
        setUniversityName(s2.universityName || '');
        setGraduationYear(s2.graduationYear || '');
        setProfessionalCertName(s2.professionalCertName || '');
        
        const s3 = res.onboarding_progress.step_3_competency;
        if (s3.status === 'Passed') {
          setTestPassed(true);
        }

        const s4 = res.onboarding_progress.step_4_demo;
        setTargetGrade(s4.targetGrade || '');
        setTopic(s4.topic || '');
        setDemoVideoUrl(s4.demoVideoUrl || '');
      }
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      await api.post('/auth/send-registration-otps', { email: profile.email });
      setOtpSent(true);
      alert('Verification OTP sent to your registered email address.');
    } catch (err) {
      alert(err.message || 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      alert('Please enter a 6-digit OTP code.');
      return;
    }
    setOtpLoading(true);
    try {
      await api.post('/auth/verify-registration-otps', { email: profile.email, emailOtp: otpCode });
      setOtpVerified(true);
      alert('Email and Mobile identity verified successfully.');
    } catch (err) {
      alert(err.message || 'Invalid OTP code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 1 Submission
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please complete the Email OTP verification first.');
      return;
    }
    if (aadhaarNumber.length !== 12 || isNaN(aadhaarNumber)) {
      alert('Please enter a valid 12-digit Aadhaar Number.');
      return;
    }
    if (panNumber.length !== 10) {
      alert('Please enter a valid 10-character PAN Card Number.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('aadhaarNumber', aadhaarNumber);
      fd.append('panNumber', panNumber);
      if (selfie) fd.append('selfie', selfie);
      if (aadhaarFile) fd.append('doc_aadhaar', aadhaarFile);
      if (panFile) fd.append('doc_pan', panFile);

      const token = localStorage.getItem('cograd_token');
      const response = await fetch(`${API_BASE_URL}/teachers/onboarding/identity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Identity submission failed');

      setOnboarding(data.onboarding_progress);
      alert('Step 1 details submitted successfully.');
      fetchStatus();
    } catch (err) {
      alert(err.message || 'Verification error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2 Submission
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!degreeName || !universityName || !graduationYear) {
      alert('Please fill out all required academic details.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('degreeName', degreeName);
      fd.append('universityName', universityName);
      fd.append('graduationYear', graduationYear);
      fd.append('professionalCertName', professionalCertName);
      if (degreeFile) fd.append('doc_degree', degreeFile);
      if (professionalFile) fd.append('doc_professional', professionalFile);

      const token = localStorage.getItem('cograd_token');
      const response = await fetch(`${API_BASE_URL}/teachers/onboarding/qualification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Academic submission failed');

      setOnboarding(data.onboarding_progress);
      alert('Step 2 details submitted successfully.');
      fetchStatus();
    } catch (err) {
      alert(err.message || 'Verification error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3 Test Initiation
  const startCompetencyTest = (subject) => {
    setTestSubject(subject);
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setTestTimeLeft(300);
    setTestScore(null);
    setTestPassed(null);
    setTestStarted(true);
  };

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const submitTest = async (finalAnswers = selectedAnswers) => {
    clearInterval(timerRef.current);
    setTestStarted(false);
    setSubmitting(true);

    const questions = TEST_QUESTIONS[testSubject];
    let correctCount = 0;
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.ans) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= 75;

    setTestScore(scorePercentage);
    setTestPassed(passed);

    try {
      const res = await api.post('/teachers/onboarding/competency-test/submit', {
        subject: testSubject,
        scorePercentage
      });
      setOnboarding(res.onboarding_progress);
      if (passed) {
        alert(`Congratulations! You passed the ${testSubject} exam with ${scorePercentage}%.`);
      } else {
        alert(`You scored ${scorePercentage}%. Minimum passing score is 75%. Feel free to retake the test!`);
      }
      fetchStatus();
    } catch (error) {
      alert(error.message || 'Failed to submit exam results.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitTestAutomatically = () => {
    alert('Time has expired! Submitting your answers automatically.');
    submitTest();
  };

  // Step 4 Submission
  const handleStep4Submit = async (e) => {
    e.preventDefault();
    if (!targetGrade || !topic) {
      alert('Please enter your target grade and explaining topic.');
      return;
    }
    if (!demoVideoFile && !demoVideoUrl) {
      alert('Please upload a video file or paste a public video sharing link.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('targetGrade', targetGrade);
      fd.append('topic', topic);
      fd.append('demoVideoUrl', demoVideoUrl);
      if (demoVideoFile) fd.append('demo_video', demoVideoFile);

      const token = localStorage.getItem('cograd_token');
      const response = await fetch(`${API_BASE_URL}/teachers/onboarding/demo-class`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Demo class submission failed');

      setOnboarding(data.onboarding_progress);
      alert('Demo lesson submitted! Your application is now in administrative review.');
      fetchStatus();
    } catch (err) {
      alert(err.message || 'Verification error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-650" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-slate-500">Loading Onboarding Portal...</span>
        </div>
      </div>
    );
  }

  const currentStep = onboarding?.current_step || 1;
  const isPendingFinalApproval = profile?.verification_status === 'Pending';

  const isWaitingPhase1 = onboarding &&
    (onboarding.step_1_identity.status === 'Submitted' || onboarding.step_1_identity.status === 'Verified') &&
    (onboarding.step_2_qualification.status === 'Submitted' || onboarding.step_2_qualification.status === 'Verified') &&
    !(onboarding.step_1_identity.status === 'Verified' && onboarding.step_2_qualification.status === 'Verified');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-600" /> Tutor Joining Board
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1.5">
              Welcome, <span className="text-indigo-600 font-bold">{profile?.name}</span>. Complete these four joining tasks to get verified.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="mt-4 sm:mt-0 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-950 transition-all text-xs font-extrabold rounded-xl text-slate-700 shadow-sm"
          >
            Sign Out
          </button>
        </div>

        {isPendingFinalApproval ? (
          /* Under Review Alert Card */
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-md">
            <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Joining Vetting Under Administrative Review</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Thank you for submitting all four onboarding steps! Our administration matches your degree, selfie identity, and demo session. We will email you at <strong className="text-indigo-600">{profile?.email}</strong> once your tutor partner account is approved.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs mb-1">
              <p className="font-extrabold text-slate-400 uppercase tracking-widest mb-3.5 text-[9px]">Vetting Progress Summary</p>
              <div className="space-y-2.5 font-semibold text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Step 1: Identity Vetting</span>
                  <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Checked</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Step 2: Credentials Audit</span>
                  <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Step 3: Competency Exam</span>
                  <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Passed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Step 4: Demo Session Evaluation</span>
                  <span className="text-amber-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Under Review</span>
                </div>
              </div>
            </div>
          </div>
        ) : isWaitingPhase1 ? (
          /* Phase 1 Review Card */
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-md">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Clock className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Phase 1 Vetting Under Administrative Review</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Thank you for submitting your identity details and academic qualifications! Our administrative team is currently verifying your Aadhaar, PAN, and degree certificates. 
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs mb-1">
              <p className="font-extrabold text-slate-400 uppercase tracking-widest mb-3.5 text-[9px]">Vetting Progress Summary</p>
              <div className="space-y-2.5 font-semibold text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Step 1: Identity &amp; KYC Verification</span>
                  <span className={onboarding.step_1_identity.status === 'Verified' ? "text-emerald-600 flex items-center gap-1" : "text-amber-600 flex items-center gap-1"}>
                    {onboarding.step_1_identity.status === 'Verified' ? <><CheckCircle className="w-3.5 h-3.5" /> Approved</> : <><Clock className="w-3.5 h-3.5 animate-pulse" /> Under Review</>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Step 2: Academic Credentials Audit</span>
                  <span className={onboarding.step_2_qualification.status === 'Verified' ? "text-emerald-600 flex items-center gap-1" : "text-amber-600 flex items-center gap-1"}>
                    {onboarding.step_2_qualification.status === 'Verified' ? <><CheckCircle className="w-3.5 h-3.5" /> Approved</> : <><Clock className="w-3.5 h-3.5 animate-pulse" /> Under Review</>}
                  </span>
                </div>
                <hr className="border-slate-100 my-2" />
                <p className="text-[10px] text-slate-500 italic mt-2 text-center">
                  Once our team approves these initial steps, you will unlock the Subject Competency Test (Step 3) and Demo Class Video (Step 4).
                </p>
              </div>
            </div>
            <button
              onClick={fetchStatus}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0"
            >
              🔄 Check Verification Status
            </button>
          </div>
        ) : (
          /* Multi-Step Wizard */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Steps sidebar */}
            <div className="md:col-span-4 space-y-3.5" role="list">
              {[
                { num: 1, label: 'Identity Verification', desc: 'Aadhaar, PAN & Selfies', status: onboarding?.step_1_identity?.status },
                { num: 2, label: 'Academic Credentials', desc: 'Degrees & Board verification', status: onboarding?.step_2_qualification?.status },
                { num: 3, label: 'Competency Test', desc: 'Subject proficiency quiz', status: onboarding?.step_3_competency?.status },
                { num: 4, label: 'Demo Class Upload', desc: 'Present a short lesson topic', status: onboarding?.step_4_demo?.status }
              ].map((s) => {
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num || s.status === 'Verified' || s.status === 'Passed' || s.status === 'Approved';
                const isRejected = s.status === 'Rejected' || s.status === 'Failed';
                
                return (
                  <div
                    key={s.num}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden
                      ${isActive
                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                        : isCompleted
                          ? 'bg-slate-50 border-slate-100 opacity-75'
                          : 'bg-transparent border-slate-200/50 opacity-50'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border
                          ${isCompleted
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : isRejected
                              ? 'bg-rose-50 border-rose-200 text-rose-600'
                              : isActive
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-850">{s.label}</h4>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    {/* Status Pill */}
                    {s.status && (
                      <span className={`absolute top-2.5 right-3 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border
                        ${s.status === 'Verified' || s.status === 'Passed' || s.status === 'Approved'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : s.status === 'Submitted'
                            ? 'bg-blue-50 border-blue-100 text-blue-700'
                            : 'bg-rose-50 border-rose-100/50 text-rose-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right form editor view */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              
              {/* STEP 1: IDENTITY */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-800">Step 1: Identity &amp; KYC Verification</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Verify your email and enter your government credentials to build proof.</p>
                  </div>

                  {onboarding?.step_1_identity?.rejectionReason && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-705 rounded-2xl text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold uppercase tracking-wider text-[10px] mb-1">Previous Attempt Rejected</p>
                        <p className="text-rose-600">{onboarding.step_1_identity.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  {/* OTP Verification */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-indigo-650" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">OTP Account verification</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Registered Email</label>
                        <p className="text-sm font-semibold text-slate-800 mt-1">{profile?.email}</p>
                      </div>
                      <div className="flex items-end">
                        {!otpVerified ? (
                          !otpSent ? (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpLoading}
                              className="w-full py-2 bg-indigo-650 hover:bg-indigo-755 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              {otpLoading ? 'Sending...' : 'Trigger Verification OTP'} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="flex gap-2 w-full">
                              <input
                                type="text"
                                maxLength="6"
                                placeholder="Enter 6-digit OTP"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-2/3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-750 placeholder-slate-400 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={otpLoading}
                                className="w-1/3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                              >
                                {otpLoading ? '...' : 'Verify'}
                              </button>
                            </div>
                          )
                        ) : (
                          <div className="w-full py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 select-none shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Identity Verification Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar Card Number (12 Digits)</label>
                      <input
                        type="text"
                        maxLength="12"
                        required
                        placeholder="e.g. 543210987654"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">PAN Card Number (10 Alphanumeric)</label>
                      <input
                        type="text"
                        maxLength="10"
                        required
                        placeholder="e.g. ABCDE1234F"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4 pt-2">
                    {/* Selfie Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xs font-black text-slate-800">Live Selfie Verification</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Upload a clear headshot image (JPG, PNG) · Max 150 KB</p>
                      </div>
                      <div className="shrink-0">
                        <label className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 cursor-pointer rounded-xl text-[10px] font-bold text-slate-650 transition-all inline-block shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-slate-450 inline mr-1.5" />
                          {selfie ? selfie.name : 'Select Selfie'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(setSelfie, e.target.files[0], 'image')} />
                        </label>
                      </div>
                    </div>

                    {/* Aadhaar File Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xs font-black text-slate-800">Aadhaar Card copy</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Upload copy of Aadhaar (PDF, JPG, PNG) · Max 10 MB</p>
                      </div>
                      <div className="shrink-0">
                        <label className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 cursor-pointer rounded-xl text-[10px] font-bold text-slate-650 transition-all inline-block shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-slate-450 inline mr-1.5" />
                          {aadhaarFile ? aadhaarFile.name : 'Select File'}
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(setAadhaarFile, e.target.files[0], 'document')} />
                        </label>
                      </div>
                    </div>

                    {/* PAN File Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xs font-black text-slate-800">PAN Card copy</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Upload copy of PAN (PDF, JPG, PNG) · Max 10 MB</p>
                      </div>
                      <div className="shrink-0">
                        <label className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 cursor-pointer rounded-xl text-[10px] font-bold text-slate-650 transition-all inline-block shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-slate-450 inline mr-1.5" />
                          {panFile ? panFile.name : 'Select File'}
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(setPanFile, e.target.files[0], 'document')} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all hover:shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 mt-4"
                  >
                    {submitting ? 'Uploading Documents...' : 'Verify and Save Step 1'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: QUALIFICATION */}
              {currentStep === 2 && (
                <form onSubmit={handleStep2Submit} className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-800">Step 2: Qualification Auditing</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Verify your degree certificates and professional university credentials.</p>
                  </div>

                  {onboarding?.step_2_qualification?.rejectionReason && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-705 rounded-2xl text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold uppercase tracking-wider text-[10px] mb-1">Previous Attempt Rejected</p>
                        <p className="text-rose-600">{onboarding.step_2_qualification.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Degree Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. B.Sc Mathematics, B.Ed"
                          value={degreeName}
                          onChange={(e) => setDegreeName(e.target.value)}
                          onFocus={() => setShowDegreeDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDegreeDropdown(false), 200)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                        />
                        {showDegreeDropdown && filteredDegrees.length > 0 && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                            {filteredDegrees.map((q) => (
                              <button
                                key={q}
                                type="button"
                                onMouseDown={() => {
                                  setDegreeName(q);
                                  setShowDegreeDropdown(false);
                                }}
                                className="w-full px-4 py-2.5 text-xs text-left hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border-none cursor-pointer flex items-center gap-2"
                              >
                                <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{q}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">University / Board</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi University"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Graduation Year</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2021"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Professional Certification (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. CTET, TET Qualified"
                        value={professionalCertName}
                        onChange={(e) => setProfessionalCertName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Degree uploads */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <GraduationCap className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xs font-black text-slate-800">Degree Certificate Upload</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Upload degree / highest transcript (PDF, JPG, PNG) · Max 10 MB</p>
                      </div>
                      <div className="shrink-0">
                        <label className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 cursor-pointer rounded-xl text-[10px] font-bold text-slate-650 transition-all inline-block shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-slate-450 inline mr-1.5" />
                          {degreeFile ? degreeFile.name : 'Select File'}
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(setDegreeFile, e.target.files[0], 'document')} />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <FileCheck className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xs font-black text-slate-800">Professional Certificate (B.Ed., CTET)</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Upload certified document (PDF, JPG, PNG) · Max 10 MB</p>
                      </div>
                      <div className="shrink-0">
                        <label className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 cursor-pointer rounded-xl text-[10px] font-bold text-slate-650 transition-all inline-block shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-slate-450 inline mr-1.5" />
                          {professionalFile ? professionalFile.name : 'Select File'}
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(setProfessionalFile, e.target.files[0], 'document')} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all hover:shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 mt-4"
                  >
                    {submitting ? 'Saving Certificates...' : 'Verify and Save Step 2'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 3: COMPETENCY TEST */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-800">Step 3: Subject Competency Exam</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Verify your command of subjects by taking a timed online examination.</p>
                  </div>

                  {!testStarted ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-2xl text-xs leading-relaxed flex items-start gap-2.5 font-semibold">
                        <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold uppercase tracking-wider text-[10px] mb-1">Exam Rules &amp; Protocols</p>
                          <ul className="list-disc pl-4 space-y-1 mt-1 font-medium text-indigo-600">
                            <li>The exam consists of 5 multiple-choice questions (MCQs) of your choice of subject.</li>
                            <li>You have a total of 5 minutes (300 seconds) to submit the examination.</li>
                            <li>A minimum passing score of **75%** is required to unlock step 4.</li>
                            <li>If you fail, you can immediately retake the exam for practice.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SUBJECTS.map((subject) => (
                          <div
                            key={subject}
                            className="p-5 border border-slate-150 bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-300/50 rounded-2xl transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-indigo-600" />
                              <span className="text-sm font-extrabold text-slate-800">{subject} Test</span>
                            </div>
                            <button
                              onClick={() => startCompetencyTest(subject)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase rounded-lg transition-all cursor-pointer border-0"
                            >
                              Start Exam
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Active Test Console UI */
                    <div className="bg-slate-50 border border-slate-150 rounded-3xl p-6 relative">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600">{testSubject} Exam Console</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-750">
                          <Clock className="w-4 h-4 text-indigo-650 animate-pulse" />
                          <span>{Math.floor(testTimeLeft / 60)}:{(testTimeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Question {currentQIndex + 1} of 5</span>
                          <h3 className="text-base font-extrabold text-slate-850">{TEST_QUESTIONS[testSubject][currentQIndex].q}</h3>
                        </div>

                        {/* Options List */}
                        <div className="space-y-2.5">
                          {TEST_QUESTIONS[testSubject][currentQIndex].options.map((opt, idx) => {
                            const isSelected = selectedAnswers[TEST_QUESTIONS[testSubject][currentQIndex].id] === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectOption(TEST_QUESTIONS[testSubject][currentQIndex].id, idx)}
                                className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer
                                  ${isSelected
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                  }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Nav Buttons */}
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-8">
                          <button
                            type="button"
                            disabled={currentQIndex === 0}
                            onClick={() => setCurrentQIndex(prev => prev - 1)}
                            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-30 cursor-pointer"
                          >
                            Previous
                          </button>
                          {currentQIndex < 4 ? (
                            <button
                              type="button"
                              onClick={() => setCurrentQIndex(prev => prev + 1)}
                              className="px-5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Next Question
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Are you sure you want to submit your exam answers?')) {
                                  submitTest();
                                }
                              }}
                              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
                            >
                              Submit Examination
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: DEMO CLASS */}
              {currentStep === 4 && (
                <form onSubmit={handleStep4Submit} className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-805">Step 4: Demo Class Audition</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Upload or share a 10–15 minute recording of you explaining an educational topic.</p>
                  </div>

                  {onboarding?.step_4_demo?.feedback && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-705 rounded-2xl text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold uppercase tracking-wider text-[10px] mb-1">Previous Demo Rejected</p>
                        <p className="text-rose-600">{onboarding.step_4_demo.feedback}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Target Grade Level</label>
                      <select
                        required
                        value={targetGrade}
                        onChange={(e) => setTargetGrade(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="">Select Target Grade</option>
                        {GRADE_LEVELS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Explaining Topic Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Quadratic Equations, Photosynthesis"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Public Link Input */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Demo Video Link (Loom, YouTube, Drive)</label>
                    <input
                      type="url"
                      placeholder="e.g. https://www.loom.com/share/..."
                      value={demoVideoUrl}
                      onChange={(e) => setDemoVideoUrl(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 font-semibold mt-1.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[9px] text-slate-500 mt-1 font-semibold">Recommended: Upload your video to Loom or YouTube and paste the link to avoid large file wait times.</p>
                  </div>

                  {/* Divider */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-[9px] text-slate-400 font-black uppercase tracking-wider">or Upload Video file</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  {/* File Upload Zone */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Video className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xs font-black text-slate-800">Upload Class MP4/MOV file</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Max size 50MB, length 10-15 minutes</p>
                    </div>
                    <div className="shrink-0">
                      <label className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 cursor-pointer rounded-xl text-[10px] font-bold text-slate-650 transition-all inline-block shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-slate-450 inline mr-1.5" />
                        {demoVideoFile ? demoVideoFile.name : 'Select File'}
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(setDemoVideoFile, e.target.files[0], 'video')} />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all hover:shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 mt-4"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Uploading Demo Class Recording...
                      </>
                    ) : 'Submit Vetting Portfolio'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
