import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  User, Mail, Phone, CheckCircle, ArrowLeft, GraduationCap,
  BookOpen, Calendar, X, Upload, FileText, Trash2, AlertCircle,
  MapPin, Briefcase, FileUp, Sparkles, ShieldCheck, ArrowRight
} from 'lucide-react';
import LocalityAutocomplete from '../components/LocalityAutocomplete';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../utils/firebase';
const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies',
];

const EXPERIENCE_OPTIONS = ['0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

const GRADE_OPTIONS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
];

const INDIAN_CITIES = [
  'Agra', 'Ahmedabad', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 'Amravati', 'Amritsar', 'Aurangabad',
  'Bareilly', 'Belgaum', 'Bengaluru', 'Bhilai Nagar', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur',
  'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack',
  'Dehradun', 'Delhi', 'Dhanbad', 'Durgapur',
  'Faridabad', 'Firozabad',
  'Gandhinagar', 'Gangtok', 'Gaya', 'Ghaziabad', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior',
  'Howrah', 'Hubli-Dharwad', 'Hyderabad',
  'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur',
  'Kalyan-Dombivli', 'Kanpur', 'Karimnagar', 'Kharagpur', 'Kochi', 'Kolhapur', 'Kolkata', 'Kota', 'Kozhikode',
  'Loni', 'Lucknow', 'Ludhiana',
  'Madurai', 'Malegaon', 'Mangalore', 'Meerut', 'Mira-Bhayandar', 'Moradabad', 'Mumbai', 'Mysore',
  'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nellore', 'Noida',
  'Panaji', 'Patiala', 'Patna', 'Pimpri-Chinchwad', 'Pondicherry', 'Pune',
  'Raipur', 'Rajkot', 'Ranchi', 'Rourkela',
  'Saharanpur', 'Salem', 'Sangli', 'Shimla', 'Siliguri', 'Solapur', 'Srinagar', 'Surat',
  'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tumkur',
  'Udaipur', 'Ujjain',
  'Vadodara', 'Varanasi', 'Vasai-Virar', 'Vijayawada', 'Visakhapatnam',
  'Warangal'
];

const DOC_TYPES = [
  {
    id: 'avatar',
    label: 'Profile Picture / Avatar',
    hint: 'Upload a professional headshot image (JPG, PNG)',
    required: true,
    accept: '.jpg,.jpeg,.png',
  },
  {
    id: 'degree',
    label: 'Degree / Qualification Certificate',
    hint: 'Upload your highest academic certificate (PDF, JPG, PNG)',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'id_proof',
    label: 'Government ID Proof',
    hint: 'Aadhar Card, PAN Card, or Passport (PDF, JPG, PNG)',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'resume',
    label: 'Professional Resume / CV',
    hint: 'Upload your latest Resume/CV (PDF, JPG, PNG)',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
  },
];

const MAX_FILE_SIZE_MB = 5;

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ── Single upload zone ── */
const UploadZone = ({ doc, file, onFile, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const validate = (f) => {
    if (!f) return '';
    const ext = f.name.split('.').pop().toLowerCase();
    const allowed = doc.accept.replace(/\./g, '').split(',');
    if (!allowed.includes(ext)) return `Invalid type. Allowed: ${doc.accept}`;
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `File too large (max ${MAX_FILE_SIZE_MB} MB)`;
    return '';
  };

  const handleFile = (f) => {
    const err = validate(f);
    setError(err);
    if (!err) onFile(doc.id, f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          {doc.label}
          {doc.required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      </div>
      <p className="text-[11px] text-slate-400 font-medium mb-2">{doc.hint}</p>

      {file ? (
        /* Uploaded file chip */
        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-800 truncate">{file.name}</p>
            <p className="text-[10px] text-emerald-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => { onRemove(doc.id); setError(''); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer border-0 bg-transparent"
            title="Remove file"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2.5 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
            ${dragging
              ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]'
              : 'border-slate-200 bg-slate-50/50 hover:border-indigo-350 hover:bg-indigo-50/20'
            }`}
        >
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
            <Upload className={`w-4 h-4 transition-colors ${dragging ? 'text-indigo-500' : 'text-slate-405'}`} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-600">
              Drag & drop or <span className="text-indigo-600 hover:underline">browse</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Max {MAX_FILE_SIZE_MB} MB · {doc.accept}</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={doc.accept}
            className="hidden"
            onChange={(e) => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
};

/* ── Main Component ── */
const RegisterTeacher = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    qualifications: '',
    experience: '',
    bio: '',
    primarySubject: '',
    city: '',
    locality: '',
    address: '',
    travelRange: '5 km radius'
  });
  
  const [subjects, setSubjects] = useState([]);
  const [gradeLevels, setGradeLevels] = useState(['Class 9', 'Class 10']);
  const [docs, setDocs] = useState({});

  const handleGradeToggle = (grade) => {
    setGradeLevels(prev => {
      if (prev.includes(grade)) {
        if (prev.length > 1) {
          return prev.filter(g => g !== grade);
        }
        return prev;
      }
      return [...prev, grade];
    });
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyForm, setVerifyForm] = useState({ emailOtp: '', phoneOtp: '' });
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numeric = value.replace(/[^0-9]/g, '');
      if (numeric.length <= 10) {
        setForm((p) => ({ ...p, phone: numeric }));
        setErrors(prev => ({ ...prev, phone: '' }));
      }
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleSubject = (s) => {
    setSubjects((p) => {
      const next = p.includes(s) ? p.filter((x) => x !== s) : [...p, s];
      setForm(f => ({
        ...f,
        primarySubject: f.primarySubject === p.slice(0, 2).join(', ')
          ? next.slice(0, 2).join(', ')
          : f.primarySubject || next.slice(0, 2).join(', ')
      }));
      return next;
    });
  };

  const handleFile = (id, file) => setDocs((p) => ({ ...p, [id]: file }));
  const removeFile  = (id)       => setDocs((p) => { const n = { ...p }; delete n[id]; return n; });

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!form.name.trim()) newErrors.name = 'Full name is required';
      if (!form.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!form.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (form.phone.length !== 10) {
        newErrors.phone = 'Must be exactly 10 digits';
      }
      if (!form.city) newErrors.city = 'Please select a city';
      if (!form.locality.trim()) newErrors.locality = 'Locality is required';
    } else if (currentStep === 2) {
      if (!form.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
      if (subjects.length === 0) newErrors.subjects = 'Select at least one subject';
      if (!form.experience) newErrors.experience = 'Experience level is required';
      if (!form.bio.trim() || form.bio.trim().length < 20) {
        newErrors.bio = 'Please write a brief bio (minimum 20 characters)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendPostRequest = async (endpoint, payload) => {
    let baseUrl = import.meta.env.VITE_API_URL || 'https://cograd-pathshala-ygyi.onrender.com/api';
    let response;
    try {
      response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      const localPrefix = 'http://127.0.0.1:4000/api';
      const localhostPrefix = 'http://localhost:4000/api';
      if (
        (baseUrl.startsWith(localPrefix) || baseUrl.startsWith(localhostPrefix)) &&
        (error.message === 'Failed to fetch' || error.name === 'TypeError')
      ) {
        const prodBaseUrl = 'https://cograd-pathshala-ygyi.onrender.com/api';
        response = await fetch(`${prodBaseUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        throw error;
      }
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step === 1 && !isVerified) {
        setVerifyError('');
        setVerifyLoading(true);
        try {
          // 1. Send Email OTP from backend
          await sendPostRequest('/auth/send-registration-otps', {
            email: form.email
          });

          // 2. Setup Invisible Recaptcha Verifier
          if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              size: 'invisible',
              callback: (response) => {
                // reCAPTCHA solved
              }
            });
          }

          // 3. Trigger Firebase Phone Auth SMS
          let formattedPhone = form.phone.trim();
          if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
          }

          const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
          setConfirmationResult(result);
          setShowVerifyModal(true);
        } catch (err) {
          console.error('Verification initiation error:', err);
          alert(err.message || 'Failed to send verification codes. Please try again.');
        } finally {
          setVerifyLoading(false);
        }
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifyError('');
    setVerifyLoading(true);
    try {
      // 1. Verify Email OTP on our backend
      await sendPostRequest('/auth/verify-registration-otps', {
        email: form.email,
        emailOtp: verifyForm.emailOtp
      });

      // 2. Verify Phone OTP via Firebase confirmationResult
      if (!confirmationResult) {
        throw new Error('Phone verification session has expired. Please resend code.');
      }
      await confirmationResult.confirm(verifyForm.phoneOtp.trim());

      setIsVerified(true);
      setShowVerifyModal(false);
      setStep(2);
    } catch (err) {
      console.error('Verification verification error:', err);
      let errMsg = err.message || 'Invalid verification codes. Please try again.';
      if (err.code === 'auth/invalid-verification-code') {
        errMsg = 'Invalid Phone verification code. Please check your SMS and try again.';
      }
      setVerifyError(errMsg);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCodes = async () => {
    setVerifyError('');
    setVerifyLoading(true);
    try {
      // 1. Resend Email OTP
      await sendPostRequest('/auth/send-registration-otps', {
        email: form.email
      });

      // 2. Resend Phone OTP via Firebase
      let formattedPhone = form.phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
      }
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);

      alert('Verification codes resent successfully!');
    } catch (err) {
      console.error('Verification resend error:', err);
      setVerifyError(err.message || 'Failed to resend codes.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    // Check mandatory docs
    const missingDocs = DOC_TYPES.filter((d) => d.required && !docs[d.id]);
    if (missingDocs.length > 0) {
      alert(`Please upload all required files:\n• ${missingDocs.map((d) => d.label).join('\n• ')}`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name',            form.name);
      fd.append('email',           form.email);
      fd.append('phone',           form.phone);
      fd.append('role',            'teacher');
      fd.append('qualifications',  form.qualifications);
      fd.append('experience',      form.experience);
      fd.append('bio',             form.bio);
      fd.append('primarySubject',   form.primarySubject);
      fd.append('city',            form.city);
      fd.append('locality',        form.locality);
      fd.append('address',         form.address);
      fd.append('travelRange',     form.travelRange);
      fd.append('subjects_taught', JSON.stringify(subjects));
      fd.append('grade_levels_qualified', JSON.stringify(gradeLevels));

      const FIELD_MAP = {
        degree:    'doc_degree',
        id_proof:  'doc_id_proof',
        resume:    'doc_resume',
      };
      for (const [docId, file] of Object.entries(docs)) {
        if (docId === 'avatar') {
          fd.append('avatar', file, file.name);
        } else {
          const fieldName = FIELD_MAP[docId];
          if (fieldName && file) fd.append(fieldName, file, file.name);
        }
      }

      let baseUrl = import.meta.env.VITE_API_URL || 'https://cograd-pathshala-ygyi.onrender.com/api';
      let response;
      try {
        response = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST',
          body: fd,
        });
      } catch (error) {
        const localPrefix = 'http://127.0.0.1:4000/api';
        const localhostPrefix = 'http://localhost:4000/api';
        if (
          (baseUrl.startsWith(localPrefix) || baseUrl.startsWith(localhostPrefix)) &&
          (error.message === 'Failed to fetch' || error.name === 'TypeError')
        ) {
          console.warn('Local backend is unreachable for registration. Falling back to production Render backend:', error.message);
          const prodBaseUrl = 'https://cograd-pathshala-ygyi.onrender.com/api';
          response = await fetch(`${prodBaseUrl}/auth/register`, {
            method: 'POST',
            body: fd,
          });
        } else {
          throw error;
        }
      }

      let data = {};
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        throw new Error(responseText || `Server error (status ${response.status})`, { cause: err });
      }

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setShowSuccess(true);
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      
      <div className="w-full max-w-2xl">
        
        {/* Back Link */}
        <button
          onClick={step > 1 ? handleBack : () => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-805 mb-6 transition-colors border-0 bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Back to Home' : 'Back to Previous Step'}
        </button>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Become a Verified Tutor</h1>
          <p className="text-slate-500 text-sm">Join Cograd Pathshala to connect with registered students nearby.</p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center mb-8 max-w-md mx-auto px-2" role="list" aria-label="Registration steps">
          {[
            { num: 1, label: 'Profile' },
            { num: 2, label: 'Teaching' },
            { num: 3, label: 'Documents' }
          ].map((s, idx) => (
            <div key={s.num} className="flex flex-1 items-center" role="listitem">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`step-dot ${step > s.num ? 'completed' : step === s.num ? 'active' : ''}`}
                  aria-label={`Step ${s.num}: ${s.label}${step > s.num ? ' (completed)' : step === s.num ? ' (current)' : ''}`}
                >
                  {step > s.num ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.num}
                </div>
                <span className={`text-[10px] font-bold mt-1 transition-colors ${step >= s.num ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className="step-connector mx-1 mb-5">
                  <div className="step-connector-fill" style={{ width: step > s.num ? '100%' : '0%' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-150 shadow-md p-6 sm:p-8 text-left no-glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ── STEP 1: Profile & Location ── */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                  1. Basic Profile &amp; Location
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">
                      <User className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Priya Sharma"
                      className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="form-label">
                      <Mail className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. priya@example.com"
                      className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    <Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Phone Number (Numbers Only)
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`form-input ${errors.phone ? 'border-red-400' : ''}`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />City
                    </label>
                    <select
                      name="city"
                      required
                      value={form.city}
                      onChange={handleChange}
                      className="form-input cursor-pointer"
                    >
                      <option value="" disabled>Select your city</option>
                      {INDIAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.city && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="form-label">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Area / Locality
                    </label>
                    <LocalityAutocomplete
                      value={form.locality}
                      onChange={(location) => {
                        setForm(prev => {
                          const updated = {
                            ...prev,
                            locality: location.locality || location.display_name,
                          };
                          if (location.city) {
                            const matchedCity = INDIAN_CITIES.find(c => c.toLowerCase() === location.city.toLowerCase());
                            if (matchedCity) {
                              updated.city = matchedCity;
                            }
                          }
                          return updated;
                        });
                        setErrors(prev => ({ ...prev, locality: '', city: '' }));
                      }}
                    />
                    {errors.locality && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.locality}</p>}
                  </div>
                </div>

                <div className="text-left">
                  <label className="form-label">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Specific Address / House No. / Landmark
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="e.g. House No 42, Near Ram Mandir, Sector 15"
                    className="form-input"
                  />
                  <p className="text-[9px] text-slate-400 font-medium mt-1">Provide specific house numbers or landmarks for easier navigation</p>
                </div>

                <div>
                  <label className="form-label">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Travel / Teaching Radius
                  </label>
                  <select
                    name="travelRange"
                    required
                    value={form.travelRange}
                    onChange={handleChange}
                    className="form-input cursor-pointer"
                  >
                    <option value="3 km radius">3 km radius</option>
                    <option value="5 km radius">5 km radius</option>
                    <option value="10 km radius">10 km radius</option>
                    <option value="15 km radius">15 km radius</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── STEP 2: Teaching Specifications ── */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                  2. Teaching Credentials
                </h3>

                <div>
                  <label className="form-label">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Qualifications
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    required
                    value={form.qualifications}
                    onChange={handleChange}
                    placeholder="e.g. M.Sc Mathematics, B.Ed"
                    className={`form-input ${errors.qualifications ? 'border-red-400' : ''}`}
                  />
                  {errors.qualifications && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.qualifications}</p>}
                </div>

                <div>
                  <label className="form-label">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Subjects You Can Teach (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 border border-slate-200 rounded-2xl bg-slate-50 max-h-48 overflow-y-auto">
                    {SUBJECTS.map((s) => {
                      const selected = subjects.includes(s);
                      return (
                        <label key={s} className="flex items-center gap-2 cursor-pointer py-1 text-xs">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSubject(s)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className={`font-semibold select-none transition-colors ${selected ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                            {s}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.subjects && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.subjects}</p>}
                </div>

                <div>
                  <label className="form-label">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Classes You Can Teach (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 border border-slate-200 rounded-2xl bg-slate-50 max-h-48 overflow-y-auto">
                    {GRADE_OPTIONS.map((g) => {
                      const selected = gradeLevels.includes(g);
                      return (
                        <label key={g} className="flex items-center gap-2 cursor-pointer py-1 text-xs">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleGradeToggle(g)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className={`font-semibold select-none transition-colors ${selected ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                            {g}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Teaching Experience
                    </label>
                    <select
                      name="experience"
                      required
                      value={form.experience}
                      onChange={handleChange}
                      className="form-input cursor-pointer"
                    >
                      <option value="">Select experience</option>
                      {EXPERIENCE_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    {errors.experience && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="form-label">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Primary Subject Focus
                    </label>
                    <input
                      type="text"
                      name="primarySubject"
                      placeholder="e.g. Mathematics, Science"
                      value={form.primarySubject}
                      onChange={handleChange}
                      className="form-input bg-white text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5 inline" />Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    required
                    rows="4"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your teaching philosophy, methodology, and what makes you unique as a mentor…"
                    className={`form-input resize-none ${errors.bio ? 'border-red-400' : ''}`}
                  />
                  {errors.bio && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.bio}</p>}
                </div>
              </div>
            )}

            {/* ── STEP 3: Document Vetting ── */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                  3. Credentials &amp; Documents Verification
                </h3>
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 font-semibold leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Please upload high-quality credentials. These documents are verified by our team. Incomplete or blurred uploads will lead to profile rejection. Note that CV/Resume upload is mandatory.
                  </span>
                </div>

                <div className="space-y-4">
                  {DOC_TYPES.map((doc) => (
                    <UploadZone
                      key={doc.id}
                      doc={doc}
                      file={docs[doc.id] || null}
                      onFile={handleFile}
                      onRemove={removeFile}
                    />
                  ))}
                </div>

                {/* Upload progress summary */}
                <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-150">
                  <div className="flex-1 text-left">
                    <p className="text-xs font-black text-slate-700">
                      {Object.keys(docs).length} of {DOC_TYPES.length} files uploaded
                    </p>
                    <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(Object.keys(docs).length / DOC_TYPES.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-600 ml-2">
                    {Math.round((Object.keys(docs).length / DOC_TYPES.length) * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-white"
                >
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-grow py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10 active:scale-98"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || Object.keys(docs).length < DOC_TYPES.length}
                  className="flex-grow py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 active:scale-98"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting Application…
                    </>
                  ) : 'Submit Vetting Application'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-150 text-center">
            <p className="text-xs text-slate-500 font-semibold">
              Already registered?{' '}
              <Link to="/login" className="text-indigo-600 font-black hover:underline ml-1">Sign in to Dashboard</Link>
            </p>
          </div>
        </div>
      </div>
            {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-100 animate-scale-up relative">
            <button onClick={() => { setShowSuccess(false); navigate('/login'); }} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer border-0 bg-transparent">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm shadow-emerald-500/15">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Vetting Application Submitted!</h3>
            <p className="text-xs text-slate-505 leading-relaxed mb-6">
              Thank you, <strong className="text-slate-800">{form.name}</strong>! Your application has been successfully logged. The Cograd Pathshala administrative team will review your uploads. Credentials will be shared at <strong className="text-slate-800">{form.email}</strong> once approved.
            </p>

            {Object.keys(docs).length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs mb-6 border border-slate-100">
                <p className="font-extrabold text-slate-400 uppercase tracking-widest mb-2.5 text-[9px]">Verified Documents Submitted</p>
                <ul className="space-y-1.5">
                  {Object.entries(docs).map(([id, f]) => (
                    <li key={id} className="flex items-center gap-2 text-xs text-slate-605 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => { setShowSuccess(false); navigate('/login'); }} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0">
              Back to Login Portal
            </button>
          </div>
        </div>
      )}

      {/* ── Verification Modal ── */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100 animate-scale-up relative">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer border-0 bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm shadow-indigo-500/15">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-2">Verify Email & Phone</h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed mb-6">
              We have sent a verification code to your email <strong className="text-slate-800">{form.email}</strong> and SMS to <strong className="text-slate-800">{form.phone}</strong>.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="form-label text-left block mb-1.5">Email Verification Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit email OTP"
                  value={verifyForm.emailOtp}
                  onChange={(e) => setVerifyForm(prev => ({ ...prev, emailOtp: e.target.value }))}
                  className="form-input text-center tracking-widest text-lg font-bold"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="form-label text-left block mb-1.5">Phone Verification Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit phone OTP"
                  value={verifyForm.phoneOtp}
                  onChange={(e) => setVerifyForm(prev => ({ ...prev, phoneOtp: e.target.value }))}
                  className="form-input text-center tracking-widest text-lg font-bold"
                  maxLength={6}
                />
              </div>

              {verifyError && (
                <p className="text-xs text-red-500 font-semibold text-center mt-1">{verifyError}</p>
              )}

              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
              >
                {verifyLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendCodes}
                  disabled={verifyLoading}
                  className="text-xs text-indigo-600 hover:underline font-black bg-transparent border-0 cursor-pointer"
                >
                  Resend Verification Codes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Firebase reCAPTCHA container */}
      <div id="recaptcha-container" className="hidden"></div>
    </div>
  );
};

export default RegisterTeacher;
