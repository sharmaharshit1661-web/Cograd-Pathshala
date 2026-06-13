import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Calendar,
  X
} from 'lucide-react';

const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Computer Science',
  'Economics',
  'Accountancy',
  'Business Studies',
  'Psychology',
  'Sociology'
];

const EXPERIENCE_OPTIONS = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

const RegisterTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    qualifications: '',
    experience: '',
    bio: ''
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject you wish to teach.');
      return;
    }
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-48 h-48 bg-primary-100 rounded-full opacity-40 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-44 h-44 bg-secondary-100 rounded-full opacity-40 animate-float" style={{ animationDelay: '1.2s' }}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight color-blend-text">Join as a Teacher</h2>
          <p className="text-gray-600 font-medium">Start your teaching journey and make a meaningful impact</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
          <form onSubmit={handleRegisterSubmit} className="space-y-8">
            
            {/* Section 1: Basic Info */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Information</h3>
              
              <div>
                <label className="form-label">
                  <User className="w-4 h-4 text-primary-500 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input text-sm py-2.5"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="form-label">
                  <Mail className="w-4 h-4 text-primary-500 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input text-sm py-2.5"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="form-label">
                  <Phone className="w-4 h-4 text-primary-500 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input text-sm py-2.5"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">
                    <Lock className="w-4 h-4 text-primary-500 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input text-sm py-2.5 pr-10"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    <Lock className="w-4 h-4 text-primary-500 mr-2" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input text-sm py-2.5 pr-10"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Teaching Info */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Teaching Information</h3>
              
              <div>
                <label className="form-label">
                  <GraduationCap className="w-4 h-4 text-primary-500 mr-2" />
                  Qualifications
                </label>
                <input
                  type="text"
                  name="qualifications"
                  required
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  className="form-input text-sm py-2.5"
                  placeholder="e.g., M.Sc Mathematics, B.Ed"
                />
              </div>

              <div>
                <label className="form-label">
                  <BookOpen className="w-4 h-4 text-primary-500 mr-2" />
                  Subjects (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto bg-slate-50/50">
                  {SUBJECTS.map(subject => (
                    <label key={subject} className="flex items-center space-x-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => handleSubjectChange(subject)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-xs text-gray-700 font-medium select-none">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">
                    <Calendar className="w-4 h-4 text-primary-500 mr-2" />
                    Teaching Experience
                  </label>
                  <select
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="form-input text-sm py-2.5 bg-white"
                  >
                    <option value="">Select your experience</option>
                    {EXPERIENCE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">
                  <BookOpen className="w-4 h-4 text-primary-500 mr-2" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  required
                  rows="4"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-input text-sm"
                  placeholder="Tell us about yourself, your teaching philosophy, and what makes you unique as a mentor..."
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full btn-primary py-4 font-bold text-center"
              >
                Register as Teacher
              </button>
            </div>

          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

        </div>

      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-gray-100 p-8 text-center relative">
            <button
              onClick={handleSuccessClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Application Received!</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Thank you, <strong>{formData.name}</strong>! Your teacher application has been submitted successfully. Our vetting committee will review your qualifications (<strong>{formData.qualifications}</strong>) and verify your credentials.
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs text-gray-600 mb-6 border border-gray-100">
              <p className="font-bold text-gray-800 mb-2">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Credential verification (within 24 hours).</li>
                <li>Telephonic interview round.</li>
                <li>Profile activation and matching induction.</li>
              </ol>
            </div>

            <button
              onClick={handleSuccessClose}
              className="w-full btn-primary py-3 font-bold"
            >
              Close & Go to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterTeacher;
