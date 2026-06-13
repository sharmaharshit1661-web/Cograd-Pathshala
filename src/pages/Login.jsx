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
  Heart
} from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialRole = location.state?.role || 'student';
  const [role, setRole] = useState(initialRole);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getRoleInfo = () => {
    switch (role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          desc: 'Access district parameters, vetting records, and school registries',
          btnText: 'Sign In as Admin',
          gradient: 'from-purple-500 to-indigo-600 shadow-purple-500/20',
          Icon: ShieldCheck
        };
      case 'teacher':
        return {
          title: 'Teacher Portal',
          desc: 'Manage classrooms, upload schedules, and view earnings data',
          btnText: 'Sign In as Teacher',
          gradient: 'from-blue-500 to-indigo-600 shadow-blue-500/20',
          Icon: BookOpen
        };
      case 'parent':
        return {
          title: 'Parent Portal',
          desc: 'Monitor kids\' progress, attendance metrics, and pending bills',
          btnText: 'Sign In as Parent',
          gradient: 'from-amber-500 to-orange-600 shadow-amber-500/20',
          Icon: Heart
        };
      case 'student':
      default:
        return {
          title: 'Student Portal',
          desc: 'Open your home tuition center, practice grids, and report cards',
          btnText: 'Sign In as Student',
          gradient: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
          Icon: GraduationCap
        };
    }
  };

  const roleInfo = getRoleInfo();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      localStorage.setItem('cograd_logged_in', 'true');
      localStorage.setItem('cograd_role', role);
      if (role === 'teacher') {
        localStorage.setItem('cograd_teacher_name', 'Priya Sharma');
        alert(`Successfully logged in as ${role.toUpperCase()}! Redirecting you to your Dashboard.`);
        navigate('/teacher/dashboard');
      } else if (role === 'admin') {
        alert(`Successfully logged in as ${role.toUpperCase()}! Redirecting you to your Admin Dashboard.`);
        navigate('/admin/dashboard');
      } else if (role === 'student') {
        localStorage.setItem('cograd_student_name', 'Rahul Sharma');
        alert(`Successfully logged in as ${role.toUpperCase()}! Redirecting you to your Student Dashboard.`);
        navigate('/student/dashboard');
      } else if (role === 'parent') {
        localStorage.setItem('cograd_parent_name', 'Mrs. Sharma');
        alert(`Successfully logged in as ${role.toUpperCase()}! Redirecting you to your Parent Dashboard.`);
        navigate('/parent/dashboard');
      } else {
        alert(`Successfully logged in as ${role.toUpperCase()}! Redirecting you to Home.`);
        navigate('/');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Floating Home Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-all duration-200 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 z-20 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 text-slate-500" />
        <span>Back to Home</span>
      </Link>

      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-44 h-44 bg-primary-100/30 rounded-full opacity-40 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-52 h-52 bg-secondary-100/30 rounded-full opacity-40 animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Logo and Greeting */}
        <div className="text-center mb-6">
          <Link to="/" className={`w-14 h-14 bg-gradient-to-r ${roleInfo.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg hover:scale-105 transition-transform duration-200`}>
            <roleInfo.Icon className="w-7 h-7 text-white" />
          </Link>
          <h2 className="text-3xl font-black mb-1.5 tracking-tight color-blend-text">{roleInfo.title}</h2>
          <p className="text-slate-500 text-sm font-medium">{roleInfo.desc}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100/80">
          
          {/* Role Tab Selector */}
          <div className="flex border border-slate-100 bg-slate-50 p-1.5 rounded-2xl mb-6 shadow-inner">
            {[
              { id: 'student', name: 'Student', activeClass: 'text-emerald-700 bg-white shadow-sm border border-emerald-500/10 font-bold' },
              { id: 'teacher', name: 'Teacher', activeClass: 'text-blue-700 bg-white shadow-sm border border-blue-500/10 font-bold' },
              { id: 'parent', name: 'Parent', activeClass: 'text-amber-700 bg-white shadow-sm border border-amber-500/10 font-bold' },
              { id: 'admin', name: 'Admin', activeClass: 'text-purple-700 bg-white shadow-sm border border-purple-500/10 font-bold' }
            ].map((item) => {
              const isActive = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`flex-1 text-center py-2 px-1 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? item.activeClass
                      : 'text-slate-400 hover:text-slate-700 hover:bg-white/40'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            
            {/* Email input */}
            <div>
              <label className="form-label text-slate-700 mb-1.5 flex items-center">
                <Mail className="w-4 h-4 text-primary-500 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input text-sm py-2.5 px-4"
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="form-label text-slate-700 mb-1.5 flex items-center">
                <Lock className="w-4 h-4 text-primary-500 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input text-sm py-2.5 pl-4 pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Box for Student Role */}
            {role === 'student' && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs font-semibold text-emerald-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-slide-up">
                <div>
                  <div className="font-extrabold text-emerald-900 mb-0.5">Demo Student Credentials</div>
                  <div>Email: <span className="underline select-all">student@cograd.com</span> | PW: <span className="underline select-all">password</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('student@cograd.com');
                    setPassword('password');
                  }}
                  className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer self-start sm:self-auto text-[10px] uppercase tracking-wide"
                >
                  Quick Fill
                </button>
              </div>
            )}

            {/* Quick Fill Box for Teacher Role */}
            {role === 'teacher' && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs font-semibold text-blue-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-slide-up">
                <div>
                  <div className="font-extrabold text-blue-900 mb-0.5">Demo Teacher Credentials</div>
                  <div>Email: <span className="underline select-all">priya@cograd.com</span> | PW: <span className="underline select-all">password</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('priya@cograd.com');
                    setPassword('password');
                  }}
                  className="bg-primary-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer self-start sm:self-auto text-[10px] uppercase tracking-wide"
                >
                  Quick Fill
                </button>
              </div>
            )}

            {/* Quick Fill Box for Parent Role */}
            {role === 'parent' && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs font-semibold text-amber-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-slide-up">
                <div>
                  <div className="font-extrabold text-amber-900 mb-0.5">Demo Parent Credentials</div>
                  <div>Email: <span className="underline select-all">parent@cograd.com</span> | PW: <span className="underline select-all">password</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('parent@cograd.com');
                    setPassword('password');
                  }}
                  className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer self-start sm:self-auto text-[10px] uppercase tracking-wide"
                >
                  Quick Fill
                </button>
              </div>
            )}

            {/* Quick Fill Box for Admin Role */}
            {role === 'admin' && (
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-xs font-semibold text-purple-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-slide-up">
                <div>
                  <div className="font-extrabold text-purple-900 mb-0.5">Demo Admin Credentials</div>
                  <div>Email: <span className="underline select-all">admin@cograd.com</span> | PW: <span className="underline select-all">password</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@cograd.com');
                    setPassword('password');
                  }}
                  className="bg-purple-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer self-start sm:self-auto text-[10px] uppercase tracking-wide"
                >
                  Quick Fill
                </button>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-slate-500 font-medium select-none">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Forgot password helper: A reset link has been dispatched to your email address (mocked).')}
                className="text-primary-500 hover:text-primary-700 font-bold transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full btn-primary py-3 text-sm font-bold text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                {submitted ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>{roleInfo.btnText}</span>
                )}
              </button>
            </div>

          </form>

          {/* Registration redirects */}
          <p className="text-center text-xs text-slate-500 mt-6">
            New to Cograd?{' '}
            <Link to="/register/student" className="text-primary-500 hover:underline font-bold transition-colors">
              Join as Student
            </Link>
            {' '}or{' '}
            <Link to="/register/teacher" className="text-secondary-500 hover:underline font-bold transition-colors">
              Teacher
            </Link>
          </p>

        </div>

        {/* Footer secure tags */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Trusted Platform</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-green-500" />
            <span>10,000+ Users</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;
