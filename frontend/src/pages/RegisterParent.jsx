import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle,
  ArrowLeft, ArrowRight, BookOpen, MapPin, Heart,
  CheckSquare, CheckCircle2, Calendar, Home, Wifi, ArrowLeftRight,
  AlertTriangle,
} from 'lucide-react';
import { getDiagnosticQuestions } from '../utils/mockDb';
import { api } from '../utils/api';

const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
];

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Sanskrit', 'Other',
];

const RELATIONSHIPS = ['Mother', 'Father', 'Guardian'];

const CITIES = ['Meerut', 'Allahabad', 'Other'];

const TUITION_MODES = [
  { value: 'home', label: 'Home Visit', icon: Home },
  { value: 'online', label: 'Online', icon: Wifi },
  { value: 'either', label: 'Either', icon: ArrowLeftRight },
];

const RegisterParent = () => {
  const navigate = useNavigate();

  // Step: 1 = Your Details, 2 = Child's Details, 3 = Diagnostic Test, 4 = Success
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [isOtherCity, setIsOtherCity] = useState(false);

  // Parent form state
  const [parentForm, setParentForm] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Child form state
  const [childForm, setChildForm] = useState({
    name: '',
    dob: '',
    standard: 'Class 10',
    subjects: ['Mathematics', 'Science'],
    city: '',
    locality: '',
    tuitionMode: 'home',
  });

  // Validation states
  const [cityError, setCityError] = useState('');
  const [cityTouched, setCityTouched] = useState(false);

  // Diagnostic Test States
  const [placementAnswers, setPlacementAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChildChange = (e) => {
    const { name, value } = e.target;
    setChildForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setChildForm((prev) => ({ ...prev, city: value }));
    setCityTouched(true);
    if (!value) {
      setCityError('Please select your city to find nearby teachers');
    } else {
      setCityError('');
    }
  };

  const handleCityBlur = () => {
    setCityTouched(true);
    if (!childForm.city) {
      setCityError('Please select your city to find nearby teachers');
    } else {
      setCityError('');
    }
  };

  const handleSubjectToggle = (sub) => {
    setChildForm((prev) => {
      const subs = [...prev.subjects];
      if (subs.includes(sub)) {
        if (subs.length > 1) {
          return { ...prev, subjects: subs.filter((s) => s !== sub) };
        }
      } else {
        subs.push(sub);
      }
      return { ...prev, subjects: subs };
    });
  };

  // Validate child age from DOB (5–18)
  const isValidChildAge = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 5 && age <= 18;
  };

  const handleParentSubmit = (e) => {
    e.preventDefault();
    if (parentForm.password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    if (!/\d/.test(parentForm.password)) {
      alert('Password must contain at least 1 number.');
      return;
    }
    if (parentForm.password !== parentForm.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!/^\d{10}$/.test(parentForm.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    setStep(2);
  };

  const handleChildSubmit = async (e) => {
    e.preventDefault();
    setCityTouched(true);

    if (!childForm.city) {
      setCityError('Please select your city to find nearby teachers');
      return;
    }

    if (!isValidChildAge(childForm.dob)) {
      alert("Child's age must be between 5 and 18 years.");
      return;
    }
    if (childForm.subjects.length === 0) {
      alert('Please select at least one subject.');
      return;
    }

    // If city is "Other", skip diagnostic test and register as waitlist
    if (childForm.city === 'Other') {
      setIsOtherCity(true);
      try {
        const registrationData = {
          name: parentForm.name,
          email: parentForm.email,
          phone: parentForm.phone,
          password: parentForm.password,
          role: 'parent',
          relationship: parentForm.relationship,
          childName: childForm.name,
          childDob: childForm.dob,
          childStandard: childForm.standard,
          childSubjects: childForm.subjects,
          childCity: childForm.city,
          childLocality: childForm.locality,
          childTuitionMode: childForm.tuitionMode,
          status: 'waitlist',
        };

        const data = await api.post('/auth/register', registrationData);

        localStorage.setItem('cograd_token', data.token);
        localStorage.setItem('cograd_logged_in', 'true');
        localStorage.setItem('cograd_role', 'parent');
        localStorage.setItem('cograd_logged_in_email', parentForm.email);
        localStorage.setItem('cograd_parent_name', parentForm.name);

        setStep(4);
      } catch (error) {
        alert(error.message || 'Registration failed. Please try again.');
      }
      return;
    }

    setStep(3);
    setPlacementAnswers({});
    setIsOtherCity(false);
  };

  const handleTestSubmit = async () => {
    const questions = getDiagnosticQuestions(childForm.standard);
    let mathScore = 0;
    let scienceScore = 0;
    let mathTotal = 0;
    let scienceTotal = 0;

    questions.forEach((q) => {
      const isCorrect = placementAnswers[q.id] === q.correct;
      const points = isCorrect ? q.marks : 0;
      if (q.subject === 'Mathematics') {
        mathScore += points;
        mathTotal += q.marks;
      } else if (q.subject === 'Science') {
        scienceScore += points;
        scienceTotal += q.marks;
      }
    });

    const scores = {
      Mathematics: Math.round((mathScore / mathTotal) * 100) || 0,
      Science: Math.round((scienceScore / scienceTotal) * 100) || 0,
      mathMarksText: `${mathScore}/${mathTotal}`,
      scienceMarksText: `${scienceScore}/${scienceTotal}`,
      totalMarksText: `${mathScore + scienceScore}/${mathTotal + scienceTotal}`,
    };

    setTestResult(scores);

    try {
      const registrationData = {
        name: parentForm.name,
        email: parentForm.email,
        phone: parentForm.phone,
        password: parentForm.password,
        role: 'parent',
        relationship: parentForm.relationship,
        childName: childForm.name,
        childDob: childForm.dob,
        childStandard: childForm.standard,
        childSubjects: childForm.subjects,
        childCity: childForm.city,
        childLocality: childForm.locality,
        childTuitionMode: childForm.tuitionMode,
        test_score: scores,
        test_completed_at: new Date().toISOString(),
        status: 'pending_match',
      };

      const data = await api.post('/auth/register', registrationData);

      localStorage.setItem('cograd_token', data.token);
      localStorage.setItem('cograd_logged_in', 'true');
      localStorage.setItem('cograd_role', 'parent');
      localStorage.setItem('cograd_logged_in_email', parentForm.email);
      localStorage.setItem('cograd_parent_name', parentForm.name);

      setStep(4);
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  const questions = getDiagnosticQuestions(childForm.standard);
  const isAllAnswered = questions.every(
    (q) => placementAnswers[q.id] !== undefined && placementAnswers[q.id] !== ''
  );

  const STEP_LABELS = ['Your Details', "Child's Details", 'Diagnostic Test'];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl">

        {/* Back Link */}
        {step < 4 && (
          <button
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else navigate('/register');
            }}
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Back to Role Selection' : `Back to ${STEP_LABELS[step - 2]}`}
          </button>
        )}

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Register as Parent / Guardian</h1>
          <p className="text-slate-500 text-sm">Find the best home tutor for your child with a data-driven match</p>
        </div>

        {/* Progress Tracker */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-8 max-w-md mx-auto px-4">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1;
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                        step >= stepNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 whitespace-nowrap">{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-slate-200 mx-2 mb-4">
                      <div
                        className={`h-full bg-blue-600 transition-all duration-300 ${
                          step > stepNum ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Step Cards */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 no-glass">

          {/* STEP 1: Parent's credentials */}
          {step === 1 && (
            <form onSubmit={handleParentSubmit} className="space-y-5">
              <div>
                <label className="form-label"><User className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Your Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  minLength={2}
                  value={parentForm.name}
                  onChange={handleParentChange}
                  className="form-input"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="form-label"><Heart className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Relationship to Child</label>
                <select
                  name="relationship"
                  required
                  value={parentForm.relationship}
                  onChange={handleParentChange}
                  className="form-input pr-8"
                >
                  <option value="" disabled>Select relationship</option>
                  {RELATIONSHIPS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label"><Mail className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Your Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={parentForm.email}
                  onChange={handleParentChange}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="form-label"><Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Your Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={parentForm.phone}
                  onChange={handleParentChange}
                  className="form-input"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label"><Lock className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      name="password"
                      required
                      value={parentForm.password}
                      onChange={handleParentChange}
                      className="form-input pr-10"
                      placeholder="Min 8 chars, 1 number"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent">
                      {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="form-label"><Lock className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showCPw ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={parentForm.confirmPassword}
                      onChange={handleParentChange}
                      className="form-input pr-10"
                      placeholder="Confirm your password"
                    />
                    <button type="button" onClick={() => setShowCPw(!showCPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent">
                      {showCPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-3.5 text-sm mt-3 flex items-center justify-center gap-1.5">
                Continue to Child's Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Child's Details */}
          {step === 2 && (
            <form onSubmit={handleChildSubmit} className="space-y-6">
              <div>
                <label className="form-label"><User className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Child's Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={childForm.name}
                  onChange={handleChildChange}
                  className="form-input"
                  placeholder="Your child's full name"
                />
              </div>

              <div>
                <label className="form-label"><Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Child's Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={childForm.dob}
                  onChange={handleChildChange}
                  className="form-input"
                />
              </div>

              <div className="text-left">
                <label className="form-label"><BookOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Child's Class / Grade</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {CLASSES.map((cls) => {
                    const isSelected = childForm.standard === cls;
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setChildForm((p) => ({ ...p, standard: cls }))}
                        className={`py-2 px-3 border rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* City — required dropdown */}
              <div className="text-left">
                <label className="form-label"><MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5" />City</label>
                <select
                  name="city"
                  value={childForm.city}
                  onChange={handleCityChange}
                  onBlur={handleCityBlur}
                  className={`form-input pr-8 ${cityError && cityTouched ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                >
                  <option value="" disabled>Select your city</option>
                  {CITIES.map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
                {cityError && cityTouched && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{cityError}</p>
                )}
                {childForm.city === 'Other' && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                      Cograd Pathshala currently operates in Meerut and Allahabad. 
                      We'll notify you when we expand to your city.
                    </p>
                  </div>
                )}
              </div>

              {/* Area / Locality — optional */}
              <div className="text-left">
                <label className="form-label"><MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Area / Locality</label>
                <input
                  type="text"
                  name="locality"
                  value={childForm.locality}
                  onChange={handleChildChange}
                  className="form-input"
                  placeholder="e.g. Civil Lines, Sadar, Shastri Nagar"
                  maxLength={100}
                />
                <p className="text-[9px] text-slate-400 font-medium mt-1">Helps us match you with a teacher nearby</p>
              </div>

              <div className="text-left">
                <label className="form-label"><CheckSquare className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Subjects Needed</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {SUBJECTS.map((sub) => {
                    const isChecked = childForm.subjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubjectToggle(sub)}
                        className={`p-3.5 border rounded-xl font-black text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50/50 border-blue-500 text-blue-700'
                            : 'bg-white text-slate-500 border-slate-150 hover:bg-slate-50'
                        }`}
                      >
                        <span>{sub}</span>
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-black ${
                            isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-left">
                <label className="form-label">Preferred Tuition Mode</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {TUITION_MODES.map(({ value, label, icon: Icon }) => {
                    const isSelected = childForm.tuitionMode === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setChildForm((p) => ({ ...p, tuitionMode: value }))}
                        className={`p-3 border rounded-xl text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold block">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-3.5 text-sm mt-3 flex items-center justify-center gap-1.5">
                {childForm.city === 'Other' ? 'Complete Registration' : 'Continue to Diagnostic Test'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: Diagnostic Placement Test */}
          {step === 3 && !isOtherCity && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="text-left">
                  <span className="text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">Placement Test</span>
                  <h3 className="text-lg font-black text-slate-800 mt-1">
                    Assess {childForm.name ? childForm.name.split(' ')[0] : 'Your Child'}'s Level
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    This short test helps us understand <strong>{childForm.name || 'your child'}</strong>'s current level in <strong>{childForm.subjects.join(', ')}</strong>
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-2xl shrink-0">
                  <span className="text-[10px] text-amber-700 font-black block uppercase tracking-wide">
                    {questions.reduce((sum, q) => sum + q.marks, 0)} Marks Total
                  </span>
                </div>
              </div>

              <div className="space-y-5 text-left max-h-[450px] overflow-y-auto pr-2">
                {questions.map((q, qidx) => (
                  <div key={q.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{q.subject} • {q.marks} Marks</span>
                      <div className="text-xs font-bold text-slate-800">Question {qidx + 1}. {q.text}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isSelected = placementAnswers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPlacementAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                            className={`text-left text-xs font-semibold py-2.5 px-3.5 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50'
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
                  Answered {Object.keys(placementAnswers).filter((k) => placementAnswers[k] !== '').length} of {questions.length} questions
                </span>
                <button
                  type="button"
                  disabled={!isAllAnswered}
                  onClick={handleTestSubmit}
                  className={`px-6 py-3 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    isAllAnswered
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
                  }`}
                >
                  Submit & Complete Signup
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success — Waitlist (for "Other" city) */}
          {step === 4 && isOtherCity && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-9 h-9 text-amber-500" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">You're on Our Waitlist!</h3>
                <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto">
                  Welcome to Cograd, <strong>{parentForm.name}</strong>!
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-5 max-w-md mx-auto border border-amber-100 text-left">
                <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                  You're on our waitlist for <strong>{childForm.city}</strong>.<br /><br />
                  We'll reach out as soon as Cograd Pathshala launches in your area.<br /><br />
                  Complete your profile now and we'll fast-track your matching when we arrive.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto border border-slate-100 text-left">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-2">Child's Details</span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p><span className="font-bold text-slate-800">Name:</span> {childForm.name}</p>
                  <p><span className="font-bold text-slate-800">Class:</span> {childForm.standard}</p>
                  <p><span className="font-bold text-slate-800">City:</span> {childForm.city}</p>
                  {childForm.locality && <p><span className="font-bold text-slate-800">Locality:</span> {childForm.locality}</p>}
                  <p><span className="font-bold text-slate-800">Subjects:</span> {childForm.subjects.join(', ')}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/parent/dashboard')}
                className="w-full max-w-sm btn-primary py-3.5 text-sm gap-2 mx-auto flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: Success & Score Breakdown (for supported cities) */}
          {step === 4 && !isOtherCity && testResult && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9 text-emerald-600 animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Registration & Assessment Complete!</h3>
                <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto">
                  Welcome to Cograd, <strong>{parentForm.name}</strong>! {childForm.name}'s diagnostic test has been evaluated and recorded.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto border border-slate-100 text-left">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-3 text-center">
                  {childForm.name}'s Placement Score (Total: {testResult.totalMarksText} Marks)
                </span>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-150">
                    <span className="text-[10px] text-slate-400 font-bold block">Mathematics</span>
                    <span className="text-lg font-black text-blue-600 block mt-1">{testResult.mathMarksText}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{testResult.Mathematics}% Score</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-150">
                    <span className="text-[10px] text-slate-400 font-bold block">Science</span>
                    <span className="text-lg font-black text-blue-600 block mt-1">{testResult.scienceMarksText}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{testResult.Science}% Score</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Our matching algorithm is placing {childForm.name} in the Cograd Central Queue. An admin will finalize matching tutor details shortly.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/parent/dashboard')}
                className="w-full max-w-sm btn-primary py-3.5 text-sm gap-2 mx-auto flex items-center justify-center"
              >
                Go to Parent Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step < 4 && (
            <div className="mt-5 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Already registered?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800">Sign in here</Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegisterParent;
