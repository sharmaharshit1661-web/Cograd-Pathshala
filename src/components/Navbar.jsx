import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, Shield, BookOpen, Heart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('cograd_logged_in') === 'true';
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('cograd_logged_in') === 'true');
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('cograd_logged_in');
    localStorage.removeItem('cograd_role');
    localStorage.removeItem('cograd_teacher_name');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Teachers', path: '/student' },
    { name: 'Join as Teacher', path: '/teacher' },
    { name: 'Book Demo', path: '/demo-booking' },
    { name: 'About Cograd', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-3' : 'bg-transparent py-4'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Group: Logo & Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-3xl md:text-4xl lg:text-[38px] font-black tracking-tight pb-0.5 logo-shimmer">
                  Cograd Pathshala
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-1 py-2 text-[13px] font-semibold transition-all duration-200 relative group ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all duration-200 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Group: Login / Auth Buttons */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center bg-slate-50/80 backdrop-blur-sm border border-slate-100/80 shadow-sm rounded-full py-1 pl-4 pr-1.5 space-x-3 text-sm">
              <span className="text-gray-500 font-bold text-xs tracking-wide uppercase">Hello,</span>
              <div className="flex items-center space-x-1">
                {localStorage.getItem('cograd_role') === 'parent' && (
                  <Link to="/parent/dashboard" className="bg-[#f59e0b]/10 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-white px-3.5 py-1 rounded-full font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
                    Parents
                  </Link>
                )}
                <Link to="/login" className="bg-[#a855f7]/10 hover:bg-[#a855f7] text-[#a855f7] hover:text-white px-3.5 py-1 rounded-full font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
                  Admin
                </Link>
                <Link to={localStorage.getItem('cograd_role') === 'teacher' ? "/teacher/dashboard" : "/teacher"} className="bg-[#3b82f6]/10 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white px-3.5 py-1 rounded-full font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
                  Teachers
                </Link>
                <Link to="/student" className="bg-[#22c55e]/10 hover:bg-[#22c55e] text-[#22c55e] hover:text-white px-3.5 py-1 rounded-full font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
                  Students
                </Link>
                 <button onClick={handleLogout} className="bg-[#ef4444]/10 hover:bg-[#ef4444] text-[#ef4444] hover:text-white px-3.5 py-1 rounded-full font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow cursor-pointer">
                   Logout
                 </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="btn-primary text-sm px-6 py-2 cursor-pointer"
              >
                Login
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-500 focus:outline-none p-2 rounded-md hover:bg-primary-50 transition-all duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-primary-500 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-500 hover:bg-primary-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-100 px-3">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="text-gray-700 font-bold text-center mb-2">Hello,</div>
                <div className="grid grid-cols-2 gap-2">
                  {localStorage.getItem('cograd_role') === 'parent' && (
                    <Link to="/parent/dashboard" onClick={() => setIsOpen(false)} className="bg-[#f59e0b] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow text-center block">
                      Parents
                    </Link>
                  )}
                  <Link to="/login" onClick={() => setIsOpen(false)} className="bg-[#a855f7] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow text-center block">
                    Admin
                  </Link>
                  <Link to={localStorage.getItem('cograd_role') === 'teacher' ? "/teacher/dashboard" : "/teacher"} onClick={() => setIsOpen(false)} className="bg-[#3b82f6] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow text-center block">
                    Teachers
                  </Link>
                  <Link to="/student" onClick={() => setIsOpen(false)} className="bg-[#22c55e] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow text-center block">
                    Students
                  </Link>
                   <button onClick={() => { handleLogout(); setIsOpen(false); }} className="bg-[#ef4444] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow text-center block cursor-pointer">
                     Logout
                   </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsRoleModalOpen(true);
                }}
                className="w-full btn-primary text-base block py-3 cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Role Selection Modal Overlay */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 role-modal-backdrop"
            onClick={() => setIsRoleModalOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl border border-slate-100/50 transform transition-all duration-300 scale-100 z-10 animate-slide-up">
            {/* Close Button */}
            <button 
              onClick={() => setIsRoleModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary-500 shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Choose Your Role</h3>
              <p className="text-sm text-gray-500 mt-1">Select how you want to access Cograd Pathshala</p>
            </div>

            {/* Grid of Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Student Role */}
              <button 
                onClick={() => {
                  setIsRoleModalOpen(false);
                  navigate('/login', { state: { role: 'student' } });
                }}
                className="role-card border border-slate-100 hover:border-emerald-500/30 hover:bg-emerald-50/20 rounded-2xl p-4 text-left shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100 px-2 py-0.5 rounded-full transition-colors uppercase tracking-wider">Student</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-700 transition-colors">Student</h4>
                  <p className="text-xs text-slate-500 leading-normal">Access your home tuitions, homework, & weekly report grids.</p>
                </div>
              </button>

              {/* Teacher Role */}
              <button 
                onClick={() => {
                  setIsRoleModalOpen(false);
                  navigate('/login', { state: { role: 'teacher' } });
                }}
                className="role-card border border-slate-100 hover:border-blue-500/30 hover:bg-blue-50/20 rounded-2xl p-4 text-left shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors uppercase tracking-wider">Teacher</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-blue-700 transition-colors">Teacher</h4>
                  <p className="text-xs text-slate-500 leading-normal">Manage class calendars, student profiles, & earning dashboards.</p>
                </div>
              </button>

              {/* Parent Role */}
              <button 
                onClick={() => {
                  setIsRoleModalOpen(false);
                  navigate('/login', { state: { role: 'parent' } });
                }}
                className="role-card border border-slate-100 hover:border-amber-500/30 hover:bg-amber-50/20 rounded-2xl p-4 text-left shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 bg-amber-50 group-hover:bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center transition-colors">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 group-hover:bg-amber-100 px-2 py-0.5 rounded-full transition-colors uppercase tracking-wider">Parent</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-amber-700 transition-colors">Parent</h4>
                  <p className="text-xs text-slate-500 leading-normal">Track kids' performance reviews, schedules & billing status.</p>
                </div>
              </button>

              {/* Admin Role */}
              <button 
                onClick={() => {
                  setIsRoleModalOpen(false);
                  navigate('/login', { state: { role: 'admin' } });
                }}
                className="role-card border border-slate-100 hover:border-purple-500/30 hover:bg-purple-50/20 rounded-2xl p-4 text-left shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 bg-purple-50 group-hover:bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center transition-colors">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 group-hover:bg-purple-100 px-2 py-0.5 rounded-full transition-colors uppercase tracking-wider">Admin</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-purple-700 transition-colors">Admin</h4>
                  <p className="text-xs text-slate-500 leading-normal">Manage district operations, teacher vettings, & system grids.</p>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
