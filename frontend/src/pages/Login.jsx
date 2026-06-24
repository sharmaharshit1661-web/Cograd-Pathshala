import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Heart,
  CheckCircle2,
} from 'lucide-react';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    Icon: GraduationCap,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    activeBorder: 'border-emerald-400',
    activeText: 'text-emerald-700',
    activeBg: 'bg-emerald-600',
    bar: 'bg-emerald-500',
    demo: { email: 'student@cograd.com', pw: 'password' },
  },
  {
    id: 'teacher',
    label: 'Teacher',
    Icon: BookOpen,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    activeBorder: 'border-primary-400',
    activeText: 'text-primary-700',
    activeBg: 'bg-primary-600',
    bar: 'bg-primary-500',
    demo: { email: 'priya@cograd.com', pw: 'password' },
  },
  {
    id: 'parent',
    label: 'Parent',
    Icon: Heart,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    activeBorder: 'border-amber-400',
    activeText: 'text-amber-700',
    activeBg: 'bg-amber-600',
    bar: 'bg-amber-500',
    demo: { email: 'parent@cograd.com', pw: 'password' },
  },
  {
    id: 'admin',
    label: 'Admin',
    Icon: ShieldCheck,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    activeBorder: 'border-violet-400',
    activeText: 'text-violet-700',
    activeBg: 'bg-violet-600',
    bar: 'bg-violet-500',
    demo: { email: 'admin@cograd.com', pw: 'password' },
  },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await api.post('/auth/login', { email, password, role });
      localStorage.setItem('cograd_token', data.token);
      localStorage.setItem('cograd_logged_in', 'true');
      localStorage.setItem('cograd_role', data.user.role);
      localStorage.setItem('cograd_logged_in_email', data.user.email);
      
      if (data.user.role === 'teacher') localStorage.setItem('cograd_teacher_name', data.user.name);
      if (data.user.role === 'student') localStorage.setItem('cograd_student_name', data.user.name);
      if (data.user.role === 'parent') localStorage.setItem('cograd_parent_name', data.user.name);
      
      navigate(DASHBOARD_MAP[data.user.role] || '/');
    } catch (error) {
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 bg-dot-subtle flex flex-col items-center justify-center py-10 px-4">

      {/* Back */}
      <Link
        to="/"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:-translate-y-px"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>

      <div className="w-full max-w-[400px]">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-2xl font-black logo-shimmer">Cograd Pathshala</span>
          </Link>
          <h2 className="text-xl font-bold text-neutral-900 mt-3 mb-1">Welcome back</h2>
          <p className="text-sm text-neutral-500">
            Sign in to your <span className="font-semibold text-neutral-700">{activeRole?.label}</span> account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">

          {/* Role tabs */}
          <div className="grid grid-cols-4 border-b border-neutral-100">
            {ROLES.map((r) => {
              const Icon = r.Icon;
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  id={`role-tab-${r.id}`}
                  className={`relative flex flex-col items-center gap-1 py-3.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive ? r.activeText : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? r.bg : 'bg-transparent'
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? r.color : 'text-neutral-400'}`} />
                  </div>
                  <span>{r.label}</span>
                  {isActive && (
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${r.bar}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Form body */}
          <div className="p-6 space-y-4">

            {/* Demo hint */}
            <div className="flex items-center justify-between gap-3 bg-neutral-50 border border-neutral-100 rounded-xl px-3.5 py-2.5">
              <div className="text-xs text-neutral-500 min-w-0">
                <span className="font-semibold text-neutral-700 block mb-0.5">Demo credentials</span>
                <span className="font-mono text-neutral-500 truncate block">{activeRole?.demo.email}</span>
              </div>
              <button
                type="button"
                id="btn-fill-demo"
                onClick={() => { setEmail(activeRole.demo.email); setPassword(activeRole.demo.pw); }}
                className={`shrink-0 text-xs font-bold text-white px-3 py-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-85 ${activeRole?.activeBg}`}
              >
                Fill
              </button>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">
                <Mail className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="form-label">
                <Lock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 accent-primary-600"
                />
                <span className="text-neutral-500 font-medium">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('A reset link would be sent to your email (mocked).')}
                className="text-primary-600 hover:text-primary-800 font-semibold transition-colors cursor-pointer text-xs"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={submitting}
              onClick={handleSubmit}
              className="w-full btn-primary py-3 text-[14px] gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
            New to Cograd?{' '}
            <Link to="/register/student" className="text-primary-600 hover:text-primary-800 font-semibold">
              Register as Student
            </Link>
            {' '}or{' '}
            <Link to="/register/teacher" className="text-secondary-600 hover:text-secondary-800 font-semibold">
              Teacher
            </Link>
          </div>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-5 mt-5 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Secure Login
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Trusted Platform
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            10,000+ Users
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
