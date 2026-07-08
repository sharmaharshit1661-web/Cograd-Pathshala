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
      return;
    }

    const autoVerify = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.post('/auth/verify-email', { email, code: '123456' });
        
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
        }, 1200);

      } catch (err) {
        console.error('Auto verify error:', err);
        setError(err.message || 'Verification failed. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    autoVerify();
  }, [email, navigate]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
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
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto border border-primary-100">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <h2 className="text-xl font-black text-neutral-800">Verifying Email...</h2>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                Bypassing Gmail OTP verification and initializing your session...
              </p>
              {error && (
                <p className="text-xs text-red-500 font-semibold mt-2">{error}</p>
              )}
            </div>
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
