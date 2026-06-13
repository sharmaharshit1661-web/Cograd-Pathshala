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
  X
} from 'lucide-react';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
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
      
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-44 h-44 bg-primary-100 rounded-full opacity-40 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-100 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight color-blend-text">Join as a Student</h2>
          <p className="text-gray-600 font-medium">Begin your learning adventure with expert doorstep tutors</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Basic Information</h3>
            
            {/* Name */}
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

            {/* Email */}
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

            {/* Phone */}
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

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full btn-primary py-3.5 font-bold"
              >
                Register as Student
              </button>
            </div>

          </form>

          {/* Existing account redirect */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back Home link */}
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

            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Registration Successful!</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Welcome, <strong>{formData.name}</strong>! Your student account has been registered successfully. You can now log in to find verified home tutors and book demo classes.
            </p>

            <button
              onClick={handleSuccessClose}
              className="w-full btn-primary py-3 font-bold"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterStudent;
