import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { Mail, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from location state
  const email = location.state?.email || localStorage.getItem('cograd_pending_verify_email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60); // 1-minute countdown
  
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // Countdown timer for Resend Code
  useEffect(() => {
    if (countdown > 0 && !success) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, success]);

  // Handle OTP inputs change
  const handleChange = (index, value) => {
    // Only allow digits
    const val = value.replace(/\D/g, '');
    if (!val && value !== '') return;

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle backspace / key down
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handle paste OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs[5].current.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.post('/auth/verify-email', { email, code: otpCode });
      
      // Verification successful! Set localstorage and navigate
      localStorage.setItem('cograd_token',           data.token);
      localStorage.setItem('cograd_logged_in',       'true');
      localStorage.setItem('cograd_role',            data.user.role);
      localStorage.setItem('cograd_logged_in_email', data.user.email);
      
      if (data.user.role === 'teacher') localStorage.setItem('cograd_teacher_name', data.user.name);
      if (data.user.role === 'student') localStorage.setItem('cograd_student_name', data.user.name);
      if (data.user.role === 'parent')  localStorage.setItem('cograd_parent_name',  data.user.name);
      
      // Clean up verification email
      localStorage.removeItem('cograd_pending_verify_email');
      
      setSuccess(true);
      
      // Redirect to dashboard after a brief delay for animation
      setTimeout(() => {
        const dashboardMap = {
          student: '/student/dashboard',
          teacher: '/teacher/dashboard',
          parent:  '/parent/dashboard',
          admin:   '/admin/dashboard',
        };
        navigate(dashboardMap[data.user.role] || '/');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await api.post('/auth/resend-verification', { email });
      setCountdown(60);
      alert('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 bg-dot-subtle flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] animate-fade-in text-center">
        
        {/* Back Link */}
        <button
          onClick={() => {
            localStorage.removeItem('cograd_pending_verify_email');
            navigate('/login');
          }}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </button>

        {/* Card */}
        <div
          className="bg-white rounded-2xl border border-neutral-200/80 p-8 overflow-hidden no-glass"
          style={{ boxShadow: '0 4px 32px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.04)' }}
        >
          {success ? (
            <div className="py-8 space-y-4 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-neutral-800">Email Verified!</h2>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                Thank you. Your email has been successfully verified. Logging you into your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Header */}
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto border border-primary-100">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-neutral-800 tracking-tight">Verify your Gmail</h2>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  We've sent a 6-digit verification code to <br />
                  <strong className="text-neutral-700">{email}</strong>. <br />
                  Please enter it below to activate your account.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-left animate-slide-up"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* OTP Input Fields */}
              <div className="flex justify-between gap-2 py-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-black text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.some(d => !d)}
                className={`
                  relative overflow-hidden w-full flex items-center justify-center gap-2
                  py-3 rounded-full text-white text-sm font-semibold
                  transition-all duration-200 cursor-pointer
                  ${loading || otp.some(d => !d)
                    ? 'bg-neutral-300 cursor-not-allowed text-neutral-500'
                    : 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg shadow-primary-600/25'
                  }
                `}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              {/* Resend Timer & Links */}
              <div className="pt-2 text-xs text-neutral-400">
                {countdown > 0 ? (
                  <span>Resend code in <strong className="text-neutral-600 font-bold">{countdown}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-primary-600 hover:text-primary-800 font-semibold cursor-pointer flex items-center gap-1 mx-auto transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Resend Code
                  </button>
                )}
              </div>
              
            </form>
          )}

        </div>
        
        {/* Footer Info */}
        <p className="text-[11px] text-neutral-400 mt-6 max-w-xs mx-auto">
          Need help? Contact support at <a href="mailto:support@cograd.com" className="text-neutral-500 hover:underline">support@cograd.com</a>
        </p>
        
      </div>
    </div>
  );
}
