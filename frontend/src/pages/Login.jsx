import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle,
  ShieldCheck, GraduationCap, BookOpen, Heart, ArrowLeft,
} from 'lucide-react';

const ROLES = [
  { id: 'student', label: 'Student', Icon: GraduationCap },
  { id: 'teacher', label: 'Teacher', Icon: BookOpen },
  { id: 'parent',  label: 'Parent',  Icon: Heart },
  { id: 'admin',   label: 'Admin',   Icon: ShieldCheck },
];

const DASHBOARD_MAP = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  parent:  '/parent/dashboard',
  admin:   '/admin/dashboard',
};

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [role,      setRole]      = useState(location.state?.role || 'student');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const identifier = email.trim();
    if (!identifier) { setError('Please enter your email or phone number.'); return; }
    const isPhone = /^\+?[0-9\s\-()]{10,}$/.test(identifier) && !identifier.includes('@');
    if (!isPhone && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      setError('Enter a valid email address or 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email: identifier, password, role });
      localStorage.setItem('cograd_token',           data.token);
      localStorage.setItem('cograd_logged_in',       'true');
      localStorage.setItem('cograd_role',            data.user.role);
      localStorage.setItem('cograd_logged_in_email', data.user.email);
      if (data.user.role === 'teacher') localStorage.setItem('cograd_teacher_name', data.user.name);
      if (data.user.role === 'student') localStorage.setItem('cograd_student_name', data.user.name);
      if (data.user.role === 'parent')  localStorage.setItem('cograd_parent_name',  data.user.name);
      navigate(DASHBOARD_MAP[data.user.role] || '/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  const handleOauth = async (provider) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/auth/login', {
        email: 'student@cograd.com', password: 'password', role: 'student',
      });
      localStorage.setItem('cograd_token',           data.token);
      localStorage.setItem('cograd_logged_in',       'true');
      localStorage.setItem('cograd_role',            'student');
      localStorage.setItem('cograd_logged_in_email', data.user.email);
      localStorage.setItem('cograd_student_name',    data.user.name);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'OAuth sign-in failed.');
    } finally { setLoading(false); }
  };

  const activeRole = ROLES.find((r) => r.id === role);

  return (
    <div className="min-h-screen bg-neutral-50 bg-dot-subtle flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-[420px] animate-fade-in">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to homepage
        </Link>

        {/* Brand */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-block mb-2">
            <span
              className="text-2xl font-black logo-shimmer"
              style={{ fontFamily: "'Sora','Inter',sans-serif" }}
            >
              Cograd Pathshala
            </span>
          </Link>
          <p className="text-sm text-neutral-500">Sign in to continue</p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden no-glass"
          style={{ boxShadow: '0 4px 32px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.04)' }}
        >
          {/* ── Role selector ── */}
          <div className="p-3 border-b border-neutral-100 bg-neutral-50/50">
            <div className="relative flex bg-neutral-100 rounded-xl p-1 gap-0.5" role="tablist" aria-label="Select your role">
              {/* Animated sliding pill */}
              {ROLES.map(({ id }, i) => id === role && (
                <div
                  key="indicator"
                  aria-hidden="true"
                  className="absolute top-1 bottom-1 bg-white rounded-lg"
                  style={{
                    width: `calc(${100 / ROLES.length}% - 4px)`,
                    left: `calc(${i * (100 / ROLES.length)}% + 2px)`,
                    transition: 'left 0.3s cubic-bezier(0.22,1,0.36,1)',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.09)',
                  }}
                />
              ))}
              {ROLES.map(({ id, label, Icon }) => {
                const active = role === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => { setRole(id); setError(''); }}
                    className="relative z-10 flex-1 flex items-center justify-center gap-1 py-2 rounded-lg cursor-pointer border-0 bg-transparent transition-all duration-200"
                  >
                    <Icon
                      className="w-3.5 h-3.5 hidden sm:inline-block transition-colors duration-200"
                      style={{ color: active ? '#2563eb' : '#9ca3af' }}
                      aria-hidden="true"
                    />
                    <span
                      className="transition-all duration-200"
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: active ? 700 : 500,
                        color: active ? '#1e40af' : '#9ca3af',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Global error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3.5 py-2.5 text-xs font-medium animate-slide-up"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {/* Email / Phone */}
            <div>
              <label htmlFor="login-email" className="form-label">
                <Mail className="w-3.5 h-3.5 text-neutral-400 mr-1.5" aria-hidden="true" />
                Email or Phone Number
              </label>
              <input
                id="login-email"
                type="text"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className={`form-input ${error && !email ? 'form-error' : ''}`}
                placeholder="you@example.com or 9876543210"
                autoComplete="username"
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="form-label mb-0">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" aria-hidden="true" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link would be sent to your email.')}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="form-input pr-11"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors rounded cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 accent-primary-600 cursor-pointer"
              />
              <span className="text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                Keep me signed in
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                relative overflow-hidden w-full flex items-center justify-center gap-2
                py-3 rounded-full text-white text-sm font-semibold
                transition-all duration-200 cursor-pointer
                ${loading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg shadow-primary-600/25'
                }
              `}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-sm" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                `Sign in as ${activeRole?.label}`
              )}
              {/* Shine sweep */}
              {!loading && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500 pointer-events-none"
                />
              )}
            </button>

            {/* OAuth (students only) */}
            {role === 'student' && (
              <>
                <div className="relative flex items-center py-1">
                  <div className="flex-1 border-t border-neutral-200" />
                  <span className="px-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">or</span>
                  <div className="flex-1 border-t border-neutral-200" />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      name: 'Google',
                      svg: (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                      ),
                    },
                    {
                      name: 'Apple',
                      svg: (
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#111" aria-hidden="true">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                        </svg>
                      ),
                    },
                  ].map(({ name, svg }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleOauth(name)}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-xs font-medium border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer disabled:opacity-50"
                    >
                      {svg}
                      <span className="hidden sm:inline">Continue with </span>{name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-neutral-50/80 border-t border-neutral-100 text-center text-xs text-neutral-500">
            {role === 'student' && (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                  Sign up free
                </Link>
              </>
            )}
            {role === 'parent' && (
              <>
                New here?{' '}
                <Link to="/register/parent" className="font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                  Register as Parent
                </Link>
              </>
            )}
            {role === 'teacher' && (
              <>
                Want to teach?{' '}
                <Link to="/register/teacher" className="font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">
                  Apply as Teacher
                </Link>
              </>
            )}
            {role === 'admin' && (
              <span className="text-neutral-400">Admin accounts are managed internally.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
