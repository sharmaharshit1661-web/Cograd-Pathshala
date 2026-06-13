import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Users,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Heart,
} from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Student', Icon: GraduationCap, ring: 'ring-emerald-500', activeBar: 'bg-emerald-500', activeBg: 'bg-emerald-600', demo: { email: 'student@cograd.com', pw: 'password' } },
  { id: 'teacher', label: 'Teacher', Icon: BookOpen, ring: 'ring-blue-500', activeBar: 'bg-blue-500', activeBg: 'bg-blue-600', demo: { email: 'priya@cograd.com', pw: 'password' } },
  { id: 'parent', label: 'Parent', Icon: Heart, ring: 'ring-amber-500', activeBar: 'bg-amber-500', activeBg: 'bg-amber-600', demo: { email: 'parent@cograd.com', pw: 'password' } },
  { id: 'admin', label: 'Admin', Icon: ShieldCheck, ring: 'ring-violet-500', activeBar: 'bg-violet-500', activeBg: 'bg-violet-600', demo: { email: 'admin@cograd.com', pw: 'password' } },
];

const DASHBOARD_MAP = {
  teacher: '/teacher/dashboard',
  admin: '/admin/dashboard',
  student: '/student/dashboard',
  parent: '/parent/dashboard',
};

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialRole = location.state?.role || 'student';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activeRole = ROLES.find((r) => r.id === role);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      localStorage.setItem('cograd_logged_in', 'true');
      localStorage.setItem('cograd_role', role);
      if (role === 'teacher') localStorage.setItem('cograd_teacher_name', 'Priya Sharma');
      if (role === 'student') localStorage.setItem('cograd_student_name', 'Rahul Sharma');
      if (role === 'parent') localStorage.setItem('cograd_parent_name', 'Mrs. Sharma');
      navigate(DASHBOARD_MAP[role] || '/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center py-12 px-4 relative">

      {/* Back */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200 px-3.5 py-1.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/">
            <span className="text-2xl font-black logo-shimmer">Cograd Pathshala</span>
          </Link>
          <h2 className="text-xl font-bold text-neutral-900 mt-4 mb-1">Welcome back</h2>
          <p className="text-sm text-neutral-500">Sign in to your {activeRole?.label} account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">

          {/* Role tabs */}
          <div className="flex border-b border-neutral-100">
            {ROLES.map((r) => {
              const Icon = r.Icon;
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all cursor-pointer relative ${
                    isActive ? 'text-neutral-800' : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{r.label}</span>
                  {isActive && <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${r.activeBar}`} />}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-7 space-y-5">

            {/* Demo credential hint */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="text-xs text-neutral-500">
                <span className="font-semibold text-neutral-700">Demo credentials:</span>{' '}
                <span className="font-mono">{activeRole?.demo.email}</span> / <span className="font-mono">{activeRole?.demo.pw}</span>
              </div>
              <button
                type="button"
                onClick={() => { setEmail(activeRole.demo.email); setPassword(activeRole.demo.pw); }}
                className={`text-xs font-semibold text-white px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-all ${activeRole?.activeBg}`}
              >
                Fill
              </button>
            </div>

            <div>
              <label className="form-label">
                <Mail className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="form-label">
                <Lock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-neutral-500 font-medium">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('A reset link would be sent to your email (mocked).')}
                className="text-primary-600 hover:text-primary-800 font-medium transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3.5 text-[15px] gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                `Sign in as ${activeRole?.label}`
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="px-7 pb-6 text-center text-sm text-neutral-500 border-t border-neutral-100 pt-5">
            New to Cograd?{' '}
            <Link to="/register/student" className="text-primary-600 hover:text-primary-800 font-medium">
              Register as Student
            </Link>{' '}
            or{' '}
            <Link to="/register/teacher" className="text-secondary-600 hover:text-secondary-800 font-medium">
              Teacher
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-6 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Secure Login
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Trusted Platform
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            10,000+ Users
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
