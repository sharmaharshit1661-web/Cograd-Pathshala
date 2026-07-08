import { useState, useEffect, useRef } from 'react';
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

  // OTP Login states
  const [loginType, setLoginType] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPasswordText, setNewPasswordText] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Timer Effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoogleLoginCallback = async (response) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/auth/google-login', {
        credentialToken: response.credential,
        role: role
      });

      if (data.require_registration) {
        localStorage.setItem('cograd_pending_google_email', data.email);
        localStorage.setItem('cograd_pending_google_name', data.name);
        localStorage.setItem('cograd_pending_google_avatar', data.avatar);
        localStorage.setItem('cograd_pending_google_token', response.credential);

        if (role === 'parent') {
          navigate('/register/parent', { state: { googleUser: data } });
        } else if (role === 'teacher') {
          navigate('/register/teacher', { state: { googleUser: data } });
        } else {
          navigate('/register/student', { state: { googleUser: data } });
        }
      } else {
        localStorage.setItem('cograd_token',           data.token);
        localStorage.setItem('cograd_logged_in',       'true');
        localStorage.setItem('cograd_role',            data.user.role);
        localStorage.setItem('cograd_logged_in_email', data.user.email);
        if (data.user.role === 'teacher') localStorage.setItem('cograd_teacher_name', data.user.name);
        if (data.user.role === 'student') localStorage.setItem('cograd_student_name', data.user.name);
        if (data.user.role === 'parent')  localStorage.setItem('cograd_parent_name',  data.user.name);
        navigate(DASHBOARD_MAP[data.user.role] || '/');
      }
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallbackRef = useRef(handleGoogleLoginCallback);
  useEffect(() => {
    handleGoogleCallbackRef.current = handleGoogleLoginCallback;
  }, [handleGoogleLoginCallback]);

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        if (!window.google_initialized) {
          window.google.accounts.id.initialize({
            client_id: googleClientId || '123456-dummy-client-id.apps.googleusercontent.com',
            callback: (res) => handleGoogleCallbackRef.current(res),
          });
          window.google_initialized = true;
        }

        const container = document.getElementById('google-signin-btn');
        if (container) {
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: 370,
            text: 'continue_with',
            shape: 'pill'
          });
        }
      }
    };

    const checkInterval = setInterval(() => {
      if (window.google) {
        initializeGoogleSignIn();
        const container = document.getElementById('google-signin-btn');
        if (container || !googleClientId) {
          clearInterval(checkInterval);
        }
      }
    }, 200);

    return () => clearInterval(checkInterval);
  }, [role]);

  const handleSendOTP = async () => {
    setError('');
    const identifier = email.trim();
    if (!identifier) {
      setError('Please enter your email or phone number.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/auth/send-login-otp', { identifier, role });
      setOtpSent(true);
      setCountdown(60);
      setError(''); // Clear error on success
      alert(data.message || 'OTP sent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const identifier = email.trim();
    if (!identifier || !otpVal) {
      setError('Please enter your email/phone and OTP.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/auth/verify-login-otp', { identifier, role, otp: otpVal });
      
      localStorage.setItem('cograd_token',           data.token);
      localStorage.setItem('cograd_logged_in',       'true');
      localStorage.setItem('cograd_role',            data.user.role);
      localStorage.setItem('cograd_logged_in_email', data.user.email);
      if (data.user.role === 'teacher') localStorage.setItem('cograd_teacher_name', data.user.name);
      if (data.user.role === 'student') localStorage.setItem('cograd_student_name', data.user.name);
      if (data.user.role === 'parent')  localStorage.setItem('cograd_parent_name',  data.user.name);
      navigate(DASHBOARD_MAP[data.user.role] || '/');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendOTP = async () => {
    setForgotError('');
    setForgotSuccess('');
    const identifier = forgotIdentifier.trim();
    if (!identifier) {
      setForgotError('Please enter your email or phone number.');
      return;
    }
    setForgotLoading(true);
    try {
      const data = await api.post('/auth/forgot-password-otp', { identifier, role });
      setForgotOtpSent(true);
      setForgotSuccess(data.message || 'Reset OTP sent successfully!');
    } catch (err) {
      setForgotError(err.message || 'Failed to send reset OTP.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    if (e) e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    const identifier = forgotIdentifier.trim();
    if (!identifier || !forgotOtp || !newPasswordText) {
      setForgotError('Please fill in all fields.');
      return;
    }
    setForgotLoading(true);
    try {
      const data = await api.post('/auth/reset-password-otp', {
        identifier,
        role,
        otp: forgotOtp,
        newPassword: newPasswordText
      });
      setForgotSuccess(data.message || 'Password reset successfully!');
      setTimeout(() => {
        setShowForgotModal(false);
        // Reset modal fields
        setForgotIdentifier('');
        setForgotOtpSent(false);
        setForgotOtp('');
        setNewPasswordText('');
      }, 2000);
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

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
      if (err.requiresVerification) {
        localStorage.setItem('cograd_pending_verify_email', err.email);
        navigate('/verify-email', { state: { email: err.email } });
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally { setLoading(false); }
  };

  const handleOauth = async (provider) => {
    if (provider === 'Google') {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        // Fallback/Mock mode for developer experience
        setLoading(true);
        setError('');
        try {
          const mockEmail = role === 'student' ? 'student@gmail.com' : role === 'parent' ? 'parent@gmail.com' : 'teacher@gmail.com';
          const mockToken = `mock-google-token-${mockEmail}`;
          await handleGoogleLoginCallback({ credential: mockToken });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
        return;
      }
      try {
        window.google.accounts.id.prompt();
      } catch (e) {
        setError('Google Sign-In library error. Please ensure Google Client ID is configured.');
      }
    } else {
      alert(`${provider} sign-in is not supported. Use Google instead.`);
    }
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

          {/* Login Type Selector */}
          <div className="flex border-b border-neutral-200 px-6">
            <button
              type="button"
              onClick={() => { setLoginType('password'); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                loginType === 'password'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('otp'); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                loginType === 'otp'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              OTP Login
            </button>
          </div>

          {/* ── Form ── */}
          <form onSubmit={loginType === 'password' ? handleSubmit : handleVerifyOTP} className="p-6 space-y-4">

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
              <div className="relative">
                <input
                  id="login-email"
                  type="text"
                  required
                  disabled={loginType === 'otp' && otpSent}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`form-input ${(loginType === 'otp' && otpSent) ? 'bg-neutral-100 cursor-not-allowed' : ''} ${error && !email ? 'form-error' : ''}`}
                  placeholder="you@example.com or 9876543210"
                  autoComplete="username"
                  aria-describedby={error ? 'login-error' : undefined}
                />
                {loginType === 'otp' && otpSent && (
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpVal(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-600 hover:text-primary-800 cursor-pointer border-0 bg-transparent"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            {/* Password */}
            {loginType === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="form-label mb-0">
                    <Lock className="w-3.5 h-3.5 text-neutral-400 mr-1.5" aria-hidden="true" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(email);
                      setShowForgotModal(true);
                      setForgotError('');
                      setForgotSuccess('');
                    }}
                    className="text-[11px] font-semibold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer border-0 bg-transparent"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors rounded cursor-pointer border-0 bg-transparent"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Verification Input */}
            {loginType === 'otp' && otpSent && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-otp" className="form-label mb-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 mr-1.5" aria-hidden="true" />
                    Enter 6-Digit OTP
                  </label>
                  <div className="text-[11px] font-semibold text-neutral-500">
                    {countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-primary-600 hover:text-primary-800 font-semibold cursor-pointer border-0 bg-transparent"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
                <input
                  id="login-otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otpVal}
                  onChange={(e) => { setOtpVal(e.target.value.replace(/\D/g, '')); setError(''); }}
                  className="form-input text-center text-lg tracking-[8px] font-bold"
                  placeholder="000000"
                />
              </div>
            )}

            {/* Remember me */}
            {loginType === 'password' && (
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
            )}

            {/* Submit */}
            {loginType === 'otp' && !otpSent ? (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className={`
                  relative overflow-hidden w-full flex items-center justify-center gap-2
                  py-3 rounded-full text-white text-sm font-semibold
                  transition-all duration-200 cursor-pointer border-0
                  ${loading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg shadow-primary-600/25'
                  }
                `}
              >
                {loading ? 'Sending OTP…' : 'Send OTP via Email / SMS'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`
                  relative overflow-hidden w-full flex items-center justify-center gap-2
                  py-3 rounded-full text-white text-sm font-semibold
                  transition-all duration-200 cursor-pointer border-0
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
                  loginType === 'password' ? `Sign in as ${activeRole?.label}` : 'Verify & Sign In'
                )}
                {!loading && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500 pointer-events-none"
                  />
                )}
              </button>
            )}


            {/* OAuth (students only) */}
            {role === 'student' && (
              <>
                <div className="relative flex items-center py-1">
                  <div className="flex-1 border-t border-neutral-200" />
                  <span className="px-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">or</span>
                  <div className="flex-1 border-t border-neutral-200" />
                </div>

                <div className="flex flex-col items-center gap-3 py-1">
                  <div id="google-signin-btn" className="w-full flex justify-center"></div>
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
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-100 animate-slide-up">
            <div className="px-6 py-5 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
                Reset Your Password
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleForgotReset} className="p-6 space-y-4">
              {forgotError && (
                <div role="alert" className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3.5 py-2.5 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}
              {forgotSuccess && (
                <div role="alert" className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3.5 py-2.5 text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              <div>
                <label className="form-label">Email or Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={forgotOtpSent}
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Enter registered email or phone"
                    className={`form-input ${forgotOtpSent ? 'bg-neutral-100 cursor-not-allowed' : ''}`}
                  />
                  {forgotOtpSent && (
                    <button
                      type="button"
                      onClick={() => { setForgotOtpSent(false); setForgotOtp(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-600 hover:text-primary-800 cursor-pointer border-0 bg-transparent"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              {forgotOtpSent && (
                <>
                  <div>
                    <label className="form-label">6-Digit Reset OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="form-input text-center text-lg tracking-[8px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPasswordText}
                      onChange={(e) => setNewPasswordText(e.target.value)}
                      placeholder="Enter new password"
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {!forgotOtpSent ? (
                <button
                  type="button"
                  onClick={handleForgotSendOTP}
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-md cursor-pointer border-0"
                >
                  {forgotLoading ? 'Sending Reset OTP…' : 'Send Reset OTP'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-md cursor-pointer border-0"
                >
                  {forgotLoading ? 'Resetting Password…' : 'Verify & Update Password'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
