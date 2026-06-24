import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

import {
  User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, GraduationCap, BookOpen, Calendar, X,
} from 'lucide-react';

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies',
];

const EXPERIENCE_OPTIONS = ['0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

const RegisterTeacher = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', qualifications: '', experience: '', bio: '' });
  const [subjects, setSubjects] = useState([]);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleSubject = (s) => setSubjects((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { alert('Passwords do not match.'); return; }
    if (subjects.length === 0) { alert('Please select at least one subject.'); return; }
    
    try {
      const registrationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'teacher',
        qualifications: form.qualifications,
        experience: form.experience,
        bio: form.bio,
        subjects_taught: subjects,
        grade_levels_qualified: ['Class 9', 'Class 10', 'Class 8', 'Class 7'],
        city: 'Meerut', // default city for tutor verification
      };

      await api.post('/auth/register', registrationData);
      setShowSuccess(true);
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-6">

      <div className="max-w-2xl mx-auto">

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-neutral-900 mb-1.5">Join as a Teacher</h1>
          <p className="text-neutral-500 text-sm">Start your teaching journey and make a meaningful impact</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Basic Info */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-neutral-900 pb-3 border-b border-neutral-100">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label"><User className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Full Name</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} className="form-input" placeholder="Your full name" />
                </div>
                <div>
                  <label className="form-label"><Mail className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Email Address</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" />
                </div>
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
            </div>

            {/* Teaching Info */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-neutral-900 pb-3 border-b border-neutral-100">
                Teaching Information
              </h3>

              <div>
                <label className="form-label"><GraduationCap className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Qualifications</label>
                <input type="text" name="qualifications" required value={form.qualifications} onChange={handleChange} className="form-input" placeholder="e.g. M.Sc Mathematics, B.Ed" />
              </div>

              <div>
                <label className="form-label mb-2"><BookOpen className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Subjects (select all that apply)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 border border-neutral-200 rounded-xl bg-neutral-50 max-h-48 overflow-y-auto">
                  {SUBJECTS.map((s) => {
                    const selected = subjects.includes(s);
                    return (
                      <label key={s} className="flex items-center gap-2 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSubject(s)}
                          className="w-3.5 h-3.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className={`text-xs font-medium select-none transition-colors ${selected ? 'text-primary-700' : 'text-neutral-600'}`}>
                          {s}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {subjects.length > 0 && (
                  <p className="mt-2 text-xs text-emerald-600 font-medium">
                    {subjects.length} subject{subjects.length !== 1 ? 's' : ''} selected: {subjects.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label"><Calendar className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Teaching Experience</label>
                <select name="experience" required value={form.experience} onChange={handleChange} className="form-input bg-white cursor-pointer">
                  <option value="">Select your experience</option>
                  {EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label"><BookOpen className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Professional Bio</label>
                <textarea name="bio" required rows="4" value={form.bio} onChange={handleChange} className="form-input resize-none" placeholder="Tell us about your teaching philosophy and what makes you unique as a mentor…" />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3.5 text-base">
              Submit Application
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
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Application Received!</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-5">
              Thank you, <strong className="text-neutral-700">{form.name}</strong>! Our vetting committee will review your qualifications and contact you within 24 hours.
            </p>
            <div className="bg-neutral-50 rounded-xl p-4 text-left text-sm mb-5 border border-neutral-100">
              <p className="font-semibold text-neutral-800 mb-2 text-xs uppercase tracking-wide">Next Steps</p>
              <ol className="list-decimal list-inside space-y-1 text-neutral-500 text-xs">
                <li>Credential verification (within 24 hours)</li>
                <li>Telephonic interview round</li>
                <li>Profile activation and matching induction</li>
              </ol>
            </div>
            <button onClick={() => { setShowSuccess(false); navigate('/login'); }} className="w-full btn-primary py-3">
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterTeacher;
