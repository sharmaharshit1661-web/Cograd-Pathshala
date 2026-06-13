import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, X } from 'lucide-react';

const RegisterStudent = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { alert('Passwords do not match.'); return; }
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-16 px-4 sm:px-6">

      <div className="w-full max-w-lg">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-neutral-900 mb-1.5">Join as a Student</h1>
          <p className="text-neutral-500 text-sm">Begin your learning journey with expert doorstep tutors</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="form-label"><User className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Full Name</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} className="form-input" placeholder="Your full name" />
            </div>

            <div>
              <label className="form-label"><Mail className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Email Address</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" />
            </div>

            <div>
              <label className="form-label"><Phone className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Phone Number</label>
              <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="form-input" placeholder="10-digit mobile number" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label"><Lock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange} className="form-input pr-10" placeholder="Create a password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer">
                    {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label"><Lock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Confirm Password</label>
                <div className="relative">
                  <input type={showCPw ? 'text' : 'password'} name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} className="form-input pr-10" placeholder="Confirm your password" />
                  <button type="button" onClick={() => setShowCPw(!showCPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer">
                    {showCPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3.5 text-base mt-2">
              Register as Student
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-800">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-neutral-100 animate-slide-up relative">
            <button onClick={() => { setShowSuccess(false); navigate('/login'); }} className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer">
              <X className="w-4.5 h-4.5" />
            </button>
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Registration Successful!</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              Welcome, <strong className="text-neutral-700">{form.name}</strong>! Your account is ready. You can now find verified home tutors.
            </p>
            <button onClick={() => { setShowSuccess(false); navigate('/login'); }} className="w-full btn-primary py-3">
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterStudent;
