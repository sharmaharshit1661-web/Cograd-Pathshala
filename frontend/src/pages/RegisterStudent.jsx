import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, 
  ArrowLeft, ArrowRight, BookOpen, MapPin, 
  CheckSquare, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { getDiagnosticQuestions } from '../utils/mockDb';
import { api } from '../utils/api';

const CITIES = [
  'Adoni', 'Agartala', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola', 'Alappuzha', 'Aligarh', 'Allahabad', 'Alwar', 'Ambala', 'Ambattur', 'Ambikapur', 'Amravati', 'Amreli', 'Amritsar', 'Amroha', 'Anand', 'Anantapur', 'Arrah', 'Asansol', 'Aurangabad', 'Avadi', 'Azamgarh',
  'Badlapur', 'Bagaha', 'Bahadurgarh', 'Baharampur', 'Bahraich', 'Balasore', 'Ballia', 'Banda', 'Bangalore', 'Banswara', 'Barasat', 'Baraut', 'Bardhaman', 'Bareilly', 'Barmer', 'Barnala', 'Barrackpore', 'Basirhat', 'Basti', 'Batala', 'Bathinda', 'Begusarai', 'Belgaum', 'Bellary', 'Bengaluru', 'Bettiah', 'Betul', 'Bhagalpur', 'Bharatpur', 'Bharuch', 'Bhavnagar', 'Bhilai', 'Bhilwara', 'Bhimavaram', 'Bhind', 'Bhiwandi', 'Bhiwani', 'Bhopal', 'Bhubaneswar', 'Bhuj', 'Bhusawal', 'Bidar', 'Bihar Sharif', 'Bijapur', 'Bikaner', 'Bilaspur', 'Bokaro Steel City', 'Bulandshahr', 'Bundi', 'Burdwan', 'Burhanpur',
  'Chandigarh', 'Chandrapur', 'Chapra', 'Chennai', 'Chhattarpur', 'Chhindwara', 'Chikkamagaluru', 'Chitradurga', 'Chittoor', 'Churu', 'Coimbatore', 'Cuddalore', 'Cuttack',
  'Daltonganj', 'Daman', 'Darbhanga', 'Darjeeling', 'Davangere', 'Dehradun', 'Delhi', 'Delhi NCR', 'Deoria', 'Dewas', 'Dhanbad', 'Dharamshala', 'Dharwad', 'Dhule', 'Dibrugarh', 'Dimapur', 'Dindigul', 'Dombivli', 'Durg', 'Durgapur',
  'Eluru', 'Erode', 'Etah', 'Etawah',
  'Faridabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Firozpur',
  'Gandhidham', 'Gandhinagar', 'Gangtok', 'Gaya', 'Ghaziabad', 'Ghazipur', 'Giridih', 'Goa', 'Godhra', 'Gonda', 'Gondia', 'Gorakhpur', 'Greater Noida', 'Gulbarga', 'Guna', 'Guntur', 'Gurugram', 'Guwahati', 'Gwalior',
  'Haldia', 'Haldwani', 'Hapur', 'Hardoi', 'Haridwar', 'Hassan', 'Hathras', 'Hazaribagh', 'Hisar', 'Hoshiarpur', 'Hospet', 'Howrah', 'Hubli-Dharwad', 'Hyderabad',
  'Ichalkaranji', 'Imphal', 'Indore', 'Itanagar',
  'Jabalpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 'Jalna', 'Jalpaiguri', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jaunpur', 'Jhansi', 'Jhunjhunu', 'Jind', 'Jodhpur', 'Jorhat', 'Junagadh',
  'Kadapa', 'Kakinada', 'Kalaburagi', 'Kalyan-Dombivli', 'Kanpur', 'Kanyakumari', 'Karimnagar', 'Karnal', 'Karur', 'Kashipur', 'Katihar', 'Katni', 'Khammam', 'Khandwa', 'Kharagpur', 'Kochi', 'Kohima', 'Kolhapur', 'Kolkata', 'Kollam', 'Korba', 'Kota', 'Kottayam', 'Kozhikode', 'Kullu', 'Kumbakonam', 'Kurnool', 'Kurukshetra',
  'Lakhimpur', 'Latur', 'Lucknow', 'Ludhiana',
  'Machilipatnam', 'Madurai', 'Mahbubnagar', 'Mainpuri', 'Malappuram', 'Malegaon', 'Mandi', 'Mangaluru', 'Mathura', 'Meerut', 'Mehsana', 'Mirzapur', 'Moga', 'Mohali', 'Moradabad', 'Morena', 'Motihari', 'Mumbai', 'Munger', 'Muzaffarnagar', 'Muzaffarpur', 'Mysuru',
  'Nadiad', 'Nagaon', 'Nagaur', 'Nagercoil', 'Nagpur', 'Nainital', 'Nanded', 'Nandyal', 'Nashik', 'Navi Mumbai', 'Navsari', 'Neemuch', 'Nellore', 'New Delhi', 'Nizamabad', 'Noida',
  'Ongole', 'Orai', 'Osmanabad',
  'Palakkad', 'Palanpur', 'Palghar', 'Palwal', 'Panaji', 'Panchkula', 'Panipat', 'Panvel', 'Parbhani', 'Pathankot', 'Patiala', 'Patna', 'Pimpri-Chinchwad', 'Porbandar', 'Port Blair', 'Puducherry', 'Pune', 'Puri', 'Purnia',
  'Raichur', 'Raipur', 'Rajahmundry', 'Rajkot', 'Rajnandgaon', 'Rampur', 'Ranchi', 'Ratlam', 'Ratnagiri', 'Rewa', 'Rewari', 'Rishikesh', 'Rohtak', 'Roorkee', 'Rourkela', 'Rudrapur',
  'Sagar', 'Saharanpur', 'Saharsa', 'Salem', 'Sambalpur', 'Sambhal', 'Sangli', 'Sangrur', 'Satara', 'Satna', 'Secunderabad', 'Shahjahanpur', 'Shamli', 'Shillong', 'Shimla', 'Shivamogga', 'Sikar', 'Silchar', 'Siliguri', 'Silvassa', 'Singrauli', 'Sirsa', 'Sitapur', 'Sivakasi', 'Siwan', 'Solan', 'Solapur', 'Sonipat', 'Srinagar', 'Surat',
  'Thane', 'Thanjavur', 'Thiruvananthapuram', 'Thoothukudi', 'Thrissur', 'Tinsukia', 'Tiruchirappalli', 'Tirupati', 'Tiruppur', 'Tumakuru',
  'Udaipur', 'Ujjain', 'Ulhasnagar', 'Unnao',
  'Vadodara', 'Valsad', 'Vapi', 'Varanasi', 'Vasai-Virar', 'Vellore', 'Vidisha', 'Vijayawada', 'Visakhapatnam', 'Vizianagaram',
  'Warangal', 'Wardha',
  'Yamunanagar', 'Yavatmal',
  'Other'
];

const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies',
];

const getPasswordRequirements = (password) => {
  return [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least 1 number', met: /[0-9]/.test(password) },
    { label: 'At least 1 special character (e.g. @, #, $, %, etc.)', met: /[^A-Za-z0-9]/.test(password) }
  ];
};

const RegisterStudent = () => {
  const navigate = useNavigate();

  // Wizard Steps: 1 = Credentials, 2 = Academic & Location, 3 = Test, 4 = Success
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  // Form states
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    standard: 'Class 10',
    subjects: ['Mathematics', 'Science'], // Default subjects
    city: '',
    locality: '',
    parentName: '',
    parentPhone: ''
  });

  // Validation states
  const [cityError, setCityError] = useState('');
  const [cityTouched, setCityTouched] = useState(false);

  // Diagnostic Test States
  const [placementAnswers, setPlacementAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [isOtherCity, setIsOtherCity] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Restrict phone fields to digits only
    if (name === 'phone' || name === 'parentPhone') {
      const digitsOnly = value.replace(/\D/g, '');
      setForm(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, city: value }));
    setCityTouched(true);
    if (!value) {
      setCityError('Please select your city to find nearby teachers');
    } else {
      setCityError('');
    }
  };

  const handleCityBlur = () => {
    setCityTouched(true);
    if (!form.city) {
      setCityError('Please select your city to find nearby teachers');
    } else {
      setCityError('');
    }
  };

  const handleSubjectToggle = (sub) => {
    setForm(prev => {
      const subs = [...prev.subjects];
      if (subs.includes(sub)) {
        if (subs.length > 1) { // Require at least one subject
          return { ...prev, subjects: subs.filter(s => s !== sub) };
        }
      } else {
        subs.push(sub);
      }
      return { ...prev, subjects: subs };
    });
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    const requirements = getPasswordRequirements(form.password);
    const unmet = requirements.filter(r => !r.met);
    if (unmet.length > 0) {
      alert('Password does not meet all security requirements:\n' + unmet.map(r => '• ' + r.label).join('\n'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setStep(2);
  };

  const handleAcademicSubmit = async (e) => {
    e.preventDefault();
    setStep(3);
    setPlacementAnswers({});
    setIsOtherCity(false);
  };

  const handleTestSubmit = async () => {
    const questions = getDiagnosticQuestions(form.standard);
    let mathScore = 0;
    let scienceScore = 0;
    let mathTotal = 0;
    let scienceTotal = 0;

    questions.forEach(q => {
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
      totalMarksText: `${mathScore + scienceScore}/${mathTotal + scienceTotal}`
    };

    setTestResult(scores);

    try {
      // Save student record to database via API
      const registrationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'student',
        standard: form.standard,
        subjects: form.subjects,
        test_score: scores,
        test_completed_at: new Date().toISOString(),
        assigned_teacher_id: null,
        status: 'pending_match',
        city: form.city,
        locality: form.locality,
        parentName: form.parentName,
        parentPhone: form.parentPhone,
        address: `House No. 101, Near Main Chowk, ${form.city}`,
      };

      const data = await api.post('/auth/register', registrationData);

      // Set logged in user details for instant dashboard access
      localStorage.setItem('cograd_token', data.token);
      localStorage.setItem('cograd_logged_in', 'true');
      localStorage.setItem('cograd_role', 'student');
      localStorage.setItem('cograd_logged_in_email', form.email);
      localStorage.setItem('cograd_student_name', form.name);

      setStep(4);
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  const questions = getDiagnosticQuestions(form.standard);
  const isAllAnswered = questions.every(q => placementAnswers[q.id] !== undefined && placementAnswers[q.id] !== '');

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      
      <div className="w-full max-w-2xl">
        
        {/* Back Link */}
        {step < 4 && (
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} 
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Back to Home' : 'Back to Previous Step'}
          </button>
        )}

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Join as a Student</h1>
          <p className="text-slate-500 text-sm">Create an account and match with vetted home tutors based on your actual level</p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center mb-8 max-w-md mx-auto px-2" role="list" aria-label="Registration steps">
          {[
            { num: 1, label: 'Credentials' },
            { num: 2, label: 'Academic' },
            { num: 3, label: 'Placement Test' }
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
                  <div
                    className="step-connector-fill"
                    style={{ width: step > s.num ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step Cards */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 no-glass">
          
          {/* STEP 1: Account credentials */}
          {step === 1 && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label className="form-label"><User className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={form.name} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="Student's full name" 
                />
              </div>

              <div>
                <label className="form-label"><Mail className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={form.email} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="your@email.com" 
                />
              </div>

              <div>
                <label className="form-label"><Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={form.phone} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label"><User className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Parent/Guardian Name</label>
                  <input 
                    type="text" 
                    name="parentName" 
                    required 
                    value={form.parentName} 
                    onChange={handleChange} 
                    className="form-input" 
                    placeholder="Parent's full name" 
                  />
                </div>
                <div>
                  <label className="form-label"><Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Parent/Guardian Phone</label>
                  <input 
                    type="tel" 
                    name="parentPhone" 
                    required 
                    value={form.parentPhone} 
                    onChange={handleChange} 
                    className="form-input" 
                    placeholder="Parent's phone number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    title="Please enter a valid 10-digit phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label"><Lock className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Password</label>
                  <div className="relative">
                    <input 
                      type={showPw ? 'text' : 'password'} 
                      name="password" 
                      required 
                      value={form.password} 
                      onChange={handleChange} 
                      className="form-input pr-10" 
                      placeholder="Create a password" 
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent">
                      {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2.5 space-y-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Password Strength Requirements</p>
                      {getPasswordRequirements(form.password).map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10.5px]">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${req.met ? 'text-emerald-500 fill-emerald-50' : 'text-slate-300'}`} />
                          <span className={`${req.met ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="form-label"><Lock className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showCPw ? 'text' : 'password'} 
                      name="confirmPassword" 
                      required 
                      value={form.confirmPassword} 
                      onChange={handleChange} 
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
                Continue to Academic Setup
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Academic & Location Info */}
          {step === 2 && (
            <form onSubmit={handleAcademicSubmit} className="space-y-6">
              <div className="text-left">
                <label className="form-label"><BookOpen className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Select Your Class / Grade</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {CLASSES.map((cls) => {
                    const isSelected = form.standard === cls;
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, standard: cls }))}
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

              <div className="text-left">
                <label className="form-label"><CheckSquare className="w-3.5 h-3.5 text-slate-400 mr-1.5" />Subjects Needed for Tuition</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {SUBJECTS.map((sub) => {
                    const isChecked = form.subjects.includes(sub);
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
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-black ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                        }`}>{isChecked ? '✓' : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-3.5 text-sm mt-3 flex items-center justify-center gap-1.5">
                Proceed to Diagnostic Placement Test
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
                  <h3 className="text-lg font-black text-slate-800 mt-1">Assess Your Diagnostic Potential</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Calibrated for {form.standard} Level</p>
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
                            onClick={() => setPlacementAnswers(prev => ({ ...prev, [q.id]: opt }))}
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
                  Answered {Object.keys(placementAnswers).filter(k => placementAnswers[k] !== '').length} of {questions.length} questions
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
                  Welcome to Cograd, <strong>{form.name}</strong>!
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-5 max-w-md mx-auto border border-amber-100 text-left">
                <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                  You're on our waitlist for <strong>{form.city}</strong>.<br /><br />
                  We'll reach out as soon as Cograd Pathshala launches in your area.<br /><br />
                  Complete your profile now and we'll fast-track your matching when we arrive.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto border border-slate-100 text-left">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-2">Your Details</span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p><span className="font-bold text-slate-800">Name:</span> {form.name}</p>
                  <p><span className="font-bold text-slate-800">Class:</span> {form.standard}</p>
                  <p><span className="font-bold text-slate-800">City:</span> {form.city}</p>
                  {form.locality && <p><span className="font-bold text-slate-800">Locality:</span> {form.locality}</p>}
                  <p><span className="font-bold text-slate-800">Subjects:</span> {form.subjects.join(', ')}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/student/dashboard')}
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
                  Welcome to Cograd, <strong>{form.name}</strong>! Your diagnostic test has been evaluated and recorded.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto border border-slate-100 text-left">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-3 text-center">
                  Placement Score Assessment (Total: {testResult.totalMarksText} Marks)
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
                    Our matching algorithm is placing you in the Cograd Central Queue. An admin will finalize your matching tutor details shortly.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/student/dashboard')}
                className="w-full max-w-sm btn-primary py-3.5 text-sm gap-2 mx-auto flex items-center justify-center"
              >
                Go to Student Dashboard
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

export default RegisterStudent;
