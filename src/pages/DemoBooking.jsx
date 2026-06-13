import { useState } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  X,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Calculator,
  Compass,
  Languages,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Globe
} from 'lucide-react';

const CLASSES = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography'
];

const SUBJECT_ICONS = {
  'Mathematics': Calculator,
  'Science': Compass,
  'English': Languages,
  'Hindi': BookOpen,
  'Physics': Atom,
  'Chemistry': FlaskConical,
  'Biology': Dna,
  'History': Landmark,
  'Geography': Globe
};

const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM'
];

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const CONFETTI_PARTICLES = Array.from({ length: 40 }).map((_, i) => {
  const left = Math.random() * 100;
  const size = Math.random() * 8 + 6;
  const delay = Math.random() * 3;
  const color = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 7)];
  const duration = Math.random() * 2 + 2;
  return { id: i, left, size, delay, color, duration };
});

const DemoBooking = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentPhone: '',
    studentClass: '',
    preferredDate: '',
    preferredTime: '',
    district: '',
    villageArea: '',
    landmark: ''
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [demoRefCode, setDemoRefCode] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [direction, setDirection] = useState('next');
  const [shakeActive, setShakeActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'parentPhone') {
      // Restrict to digits only and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  const handleDayChange = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const validateStep1 = () => {
    if (!formData.studentName.trim()) {
      alert('Please enter student name.');
      return false;
    }
    const phoneRegex = /^[6789]\d{9}$/;
    if (!phoneRegex.test(formData.parentPhone)) {
      alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return false;
    }
    if (!formData.studentClass) {
      alert('Please select student class.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject.');
      return false;
    }
    if (!formData.preferredDate) {
      alert('Please select a preferred date.');
      return false;
    }
    if (!formData.preferredTime) {
      alert('Please select a preferred time.');
      return false;
    }
    if (selectedDays.length === 0) {
      alert('Please select at least one preferred day.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.district) {
      alert('Please select a district.');
      return false;
    }
    if (!formData.villageArea.trim()) {
      alert('Please enter a village or area.');
      return false;
    }
    return true;
  };

  const triggerShake = () => {
    setShakeActive(true);
    setTimeout(() => setShakeActive(false), 400);
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validateStep1()) {
        setDirection('next');
        setActiveStep(2);
      } else {
        triggerShake();
      }
    } else if (activeStep === 2) {
      if (validateStep2()) {
        setDirection('next');
        setActiveStep(3);
      } else {
        triggerShake();
      }
    }
  };

  const handlePrevStep = () => {
    setDirection('prev');
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep1() && validateStep2() && validateStep3()) {
      setDemoRefCode('DEMO-' + Math.floor(100000 + Math.random() * 900000));
      setShowSuccess(true);
    } else {
      triggerShake();
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    // Reset form
    setFormData({
      studentName: '',
      parentPhone: '',
      studentClass: '',
      preferredDate: '',
      preferredTime: '',
      district: '',
      villageArea: '',
      landmark: ''
    });
    setSelectedSubjects([]);
    setSelectedDays([]);
    setActiveStep(1);
  };

  // Get tomorrow's date for date minimum value
  const getMinDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Header */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100 bg-dot-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1.5 rounded-full mb-6 shadow-md animate-fade-in">
              <CheckCircle className="w-4.5 h-4.5 text-white" />
              <span className="text-xs font-bold uppercase tracking-wider">100% Free Demo</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-slide-up">
              Book Your <span className="color-blend-text">Free Demo</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '150ms' }}>
              Experience quality home tuition with our expert teachers. No commitment required - just see the difference quality education can make.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side: Form Card */}
            <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-slide-in-left transition-all duration-300 ${shakeActive ? 'animate-shake' : ''}`}>
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white text-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-1">Book Free Demo Class</h2>
                <p className="text-white/95 text-sm">Fill in details to experience learning at home</p>
              </div>

              <div className="p-6 md:p-8">
                
                {/* Progress Tracker */}
                <div className="mb-8 px-2">
                  <div className="relative flex items-center justify-between w-full max-w-md mx-auto">
                    
                    {/* Background track line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
                    
                    {/* Active filled line */}
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full z-0 transition-all duration-500 ease-out"
                      style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}
                    ></div>

                    {/* Step 1 Node */}
                    <div className="flex flex-col items-center z-10 relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        activeStep > 1 
                          ? 'bg-[#059669] text-white ring-4 ring-emerald-100 shadow-md scale-105' 
                          : activeStep === 1
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white ring-4 ring-primary-100 shadow-md scale-105'
                            : 'bg-white text-gray-400 border border-slate-200'
                      }`}>
                        {activeStep > 1 ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span>1</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 transition-colors ${activeStep >= 1 ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
                        Student
                      </span>
                    </div>

                    {/* Step 2 Node */}
                    <div className="flex flex-col items-center z-10 relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        activeStep > 2 
                          ? 'bg-[#059669] text-white ring-4 ring-emerald-100 shadow-md scale-105' 
                          : activeStep === 2
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white ring-4 ring-primary-100 shadow-md scale-105 animate-pulse'
                            : 'bg-white text-gray-400 border border-slate-200'
                      }`}>
                        {activeStep > 2 ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span>2</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 transition-colors ${activeStep >= 2 ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
                        Schedule
                      </span>
                    </div>

                    {/* Step 3 Node */}
                    <div className="flex flex-col items-center z-10 relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        activeStep === 3
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white ring-4 ring-primary-100 shadow-md scale-105'
                          : 'bg-white text-gray-400 border border-slate-200'
                      }`}>
                        <span>3</span>
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 transition-colors ${activeStep === 3 ? 'text-gray-900 font-extrabold' : 'text-gray-400'}`}>
                        Location
                      </span>
                    </div>

                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Step container keyed by activeStep for slide transitions */}
                  <div key={activeStep} className={direction === 'next' ? 'step-enter-next' : 'step-enter-prev'}>
                    
                    {/* Step 1: Student Information */}
                    {activeStep === 1 && (
                      <div className="space-y-5">
                        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                          <div className="w-6 h-6 bg-primary-100 text-primary-700 font-bold rounded-full flex items-center justify-center text-[10px] shadow-sm">
                            1
                          </div>
                          <h3 className="text-sm font-bold text-gray-800">Student Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="form-label text-xs">
                              <User className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                              Student Name *
                            </label>
                            <div className="relative focus-within-icon-parent">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <User className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                              </div>
                              <input
                                type="text"
                                name="studentName"
                                required
                                value={formData.studentName}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm placeholder-gray-400"
                                placeholder="Enter student name"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="form-label text-xs">
                              <Phone className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                              Parent Phone Number *
                            </label>
                            <div className="relative flex shadow-sm rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all duration-200 overflow-hidden">
                              <div className="flex items-center pl-3.5 pr-2.5 border-r border-slate-200 text-sm font-semibold text-gray-500 select-none bg-slate-100/30">
                                <span className="mr-1.5" role="img" aria-label="India">🇮🇳</span>
                                +91
                              </div>
                              <input
                                type="tel"
                                name="parentPhone"
                                required
                                pattern="[6-9][0-9]{9}"
                                maxLength="10"
                                title="Please enter a valid 10-digit mobile number"
                                value={formData.parentPhone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-3 focus:outline-none text-gray-700 bg-transparent text-sm"
                                placeholder="Enter 10-digit mobile number"
                              />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1.5">Format: 10 digits starting with 6-9 (e.g., 9876543210)</p>
                          </div>
                        </div>

                        {/* Class Selection Grid */}
                        <div>
                          <label className="form-label text-xs">
                            <GraduationCap className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                            Student Class *
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {CLASSES.map(c => (
                              <button
                                type="button"
                                key={c}
                                onClick={() => setFormData(prev => ({ ...prev, studentClass: c }))}
                                className={`py-2 text-center text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                                  formData.studentClass === c
                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-transparent shadow-md scale-[1.03]'
                                    : 'bg-white text-gray-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                {c.replace('Class ', '')}
                              </button>
                            ))}
                          </div>
                          <input type="hidden" name="studentClass" value={formData.studentClass} required />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Subjects & Timing */}
                    {activeStep === 2 && (
                      <div className="space-y-5">
                        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                          <div className="w-6 h-6 bg-primary-100 text-primary-700 font-bold rounded-full flex items-center justify-center text-[10px] shadow-sm">
                            2
                          </div>
                          <h3 className="text-sm font-bold text-gray-800">Subjects & Timing</h3>
                        </div>

                        {/* Subjects Selection */}
                        <div>
                          <label className="form-label text-xs mb-2">
                            <BookOpen className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                            Subjects (Select Multiple) *
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {SUBJECTS.map(subject => {
                              const IconComponent = SUBJECT_ICONS[subject] || BookOpen;
                              const isSelected = selectedSubjects.includes(subject);
                              return (
                                <button
                                  type="button"
                                  key={subject}
                                  onClick={() => handleSubjectChange(subject)}
                                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer active:scale-95 ${
                                    isSelected
                                      ? 'border-primary-500 bg-primary-50/30 ring-2 ring-primary-500/10 text-primary-900 scale-[1.02] shadow-sm'
                                      : 'border-slate-200 bg-white text-gray-700 hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 transition-all ${
                                    isSelected ? 'bg-primary-100 text-primary-600 scale-105' : 'bg-slate-100 text-gray-500'
                                  }`}>
                                    <IconComponent className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[10px] font-bold tracking-tight leading-tight">{subject}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Scheduling Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="form-label text-xs">
                              <Calendar className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                              Preferred Date *
                            </label>
                            <div className="relative focus-within-icon-parent">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Calendar className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                              </div>
                              <input
                                type="date"
                                name="preferredDate"
                                required
                                min={getMinDateString()}
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm"
                              />
                            </div>
                          </div>

                          {/* Time Slots Grid */}
                          <div>
                            <label className="form-label text-xs mb-2">
                              <Clock className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                              Preferred Time *
                            </label>
                            <div className="grid grid-cols-4 gap-1.5">
                              {TIME_SLOTS.map(time => {
                                const isSelected = formData.preferredTime === time;
                                return (
                                  <button
                                    type="button"
                                    key={time}
                                    onClick={() => setFormData(prev => ({ ...prev, preferredTime: time }))}
                                    className={`py-2 px-0.5 text-center text-[9px] font-bold rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-transparent shadow-md scale-[1.03]'
                                        : 'bg-white text-gray-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                  >
                                    {time}
                                  </button>
                                );
                              })}
                            </div>
                            <input type="hidden" name="preferredTime" value={formData.preferredTime} required />
                          </div>
                        </div>

                        {/* Preferred Days Checkboxes */}
                        <div>
                          <label className="form-label text-xs">
                            <Calendar className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                            Preferred Days *
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {DAYS.map(day => (
                              <button
                                type="button"
                                key={day}
                                onClick={() => handleDayChange(day)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer active:scale-95 ${
                                  selectedDays.includes(day)
                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-transparent shadow-md scale-[1.02]'
                                    : 'bg-white text-gray-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                {day.substring(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Location Details */}
                    {activeStep === 3 && (
                      <div className="space-y-5">
                        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                          <div className="w-6 h-6 bg-primary-100 text-primary-700 font-bold rounded-full flex items-center justify-center text-[10px] shadow-sm">
                            3
                          </div>
                          <h3 className="text-sm font-bold text-gray-800">Location Details</h3>
                        </div>
                        
                        <div className="space-y-5">
                          <div>
                            <label className="form-label text-xs mb-2.5">
                              <Compass className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                              District *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              {['Meerut', 'Allahabad'].map(d => {
                                const isSelected = formData.district === d;
                                return (
                                  <button
                                    type="button"
                                    key={d}
                                    onClick={() => setFormData(prev => ({ ...prev, district: d }))}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer active:scale-95 ${
                                      isSelected
                                        ? 'border-primary-500 bg-primary-50/30 ring-2 ring-primary-500/10 text-primary-900 scale-[1.02] shadow-sm'
                                        : 'border-slate-200 bg-white text-gray-700 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                  >
                                    <MapPin className={`w-4 h-4 mb-1 transition-all ${isSelected ? 'text-primary-500 animate-pin-bounce' : 'text-gray-400'}`} />
                                    <span className="text-xs font-bold">{d}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <input type="hidden" name="district" value={formData.district} required />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="form-label text-xs">
                                <MapPin className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                                Village/Area *
                              </label>
                              <div className="relative focus-within-icon-parent">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                  <MapPin className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                                </div>
                                <input
                                  type="text"
                                  required
                                  name="villageArea"
                                  value={formData.villageArea}
                                  onChange={handleInputChange}
                                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm placeholder-gray-400"
                                  placeholder="Enter village or area"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="form-label text-xs">
                                <Landmark className="w-3.5 h-3.5 text-primary-500 mr-1.5" />
                                Landmark
                              </label>
                              <div className="relative focus-within-icon-parent">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                  <Landmark className="w-4.5 h-4.5 text-gray-400 input-icon-float" />
                                </div>
                                <input
                                  type="text"
                                  name="landmark"
                                  value={formData.landmark}
                                  onChange={handleInputChange}
                                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm placeholder-gray-400"
                                  placeholder="Near school, market, temple"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Navigation Buttons based on activeStep */}
                  {activeStep === 1 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.01] hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer btn-shimmer active:scale-95"
                      >
                        <span>Continue to Schedule</span>
                        <ArrowRight className="w-4.5 h-4.5 animate-pulse" />
                      </button>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="pt-2 flex gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-200 active:scale-95"
                      >
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.01] hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer btn-shimmer active:scale-95"
                      >
                        <span>Continue to Location</span>
                        <ArrowRight className="w-4.5 h-4.5 animate-pulse" />
                      </button>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="pt-2 flex gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-200 active:scale-95"
                      >
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        className="flex-2 bg-gradient-to-r from-primary-500 to-[#059669] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.01] hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer btn-shimmer active:scale-95 shadow-md font-extrabold"
                      >
                        <span>Book Free Demo Class</span>
                        <CheckCircle className="w-4.5 h-4.5 animate-pulse" />
                      </button>
                    </div>
                  )}

                </form>
              </div>
            </div>

            {/* Right Side: Informative Panel */}
            <div className="space-y-8 lg:sticky lg:top-24 animate-slide-in-right">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
                  Why Choose Our <span className="color-blend-text">Demo Classes</span>?
                </h2>
                
                <div className="space-y-6">
                  <div className="reveal-on-scroll flex items-start space-x-4" style={{ transitionDelay: '100ms' }}>
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-200/50">
                      <GraduationCap className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Expert Teachers</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Learn from vetted, experienced teachers who understand localized educational challenges.
                      </p>
                    </div>
                  </div>

                  <div className="reveal-on-scroll flex items-start space-x-4" style={{ transitionDelay: '200ms' }}>
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-200/50">
                      <Clock className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Flexible Timing</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Choose timings that work best for your child, with convenient weekly arrangements.
                      </p>
                    </div>
                  </div>

                  <div className="reveal-on-scroll flex items-start space-x-4" style={{ transitionDelay: '300ms' }}>
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-200/50">
                      <MapPin className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Home Convenience</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Say goodbye to travel hassles. Tutors come to your home to conduct personalized lessons.
                      </p>
                    </div>
                  </div>

                  <div className="reveal-on-scroll flex items-start space-x-4" style={{ transitionDelay: '400ms' }}>
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-200/50">
                      <CheckCircle className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Personalized Learning</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        One-on-one attention matching your child's pace, addressing weak points and building strong roots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Onboarding steps */}
              <div className="reveal-on-scroll bg-gray-50 rounded-2xl p-6 border border-gray-100" style={{ transitionDelay: '450ms' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <span className="text-gray-700 font-semibold">Fill out the demo booking form</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <span className="text-gray-700 font-semibold">We will contact you within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <span className="text-gray-700 font-semibold">Schedule your free demo class at home</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <span className="text-gray-700 font-semibold">Experience quality education firsthand</span>
                  </div>
                </div>
              </div>

              {/* Branding trust metrics */}
              <div className="reveal-on-scroll bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100/30" style={{ transitionDelay: '500ms' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trust Cograd</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
                    <span className="font-medium">Shark Tank featured EdTech brand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">50+ rural schools successfully opened</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">10,000+ students actively learning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">4.9/5 parent satisfaction rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
          
          {/* Falling Confetti Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI_PARTICLES.map(p => (
              <div
                key={p.id}
                className="confetti-particle animate-pulse"
                style={{
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`
                }}
              />
            ))}
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-gray-100 p-8 text-center relative z-10 animate-slide-up">
            <button
              onClick={closeSuccessModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Demo Class Booked!</h3>
            <p className="text-sm text-gray-500 mb-6">Inquiry Reference Code: {demoRefCode}</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 text-sm text-gray-700 mb-6 border border-gray-100">
              <p><strong>Student Name:</strong> {formData.studentName}</p>
              <p><strong>Class:</strong> {formData.studentClass}</p>
              <p><strong>Date & Time:</strong> {formData.preferredDate} at {formData.preferredTime}</p>
              <p><strong>District:</strong> {formData.district}</p>
              <p><strong>Subjects:</strong> {selectedSubjects.join(', ')}</p>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Our rural coordination officer will call you at <strong>+91 {formData.parentPhone}</strong> within 24 hours to confirm the teacher allocation.
            </p>

            <button
              onClick={closeSuccessModal}
              className="w-full btn-primary py-3 font-bold cursor-pointer btn-shimmer active:scale-95"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default DemoBooking;
