import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, GraduationCap, Shield, BookOpen, Heart,
  Sparkles, LogIn, ChevronRight,
} from 'lucide-react';

/* ─── nav links ─── */
const NAV_LINKS = [
  { label: 'Find Teachers', to: '/student' },
  { label: 'Teach with Us', to: '/teacher' },
  { label: 'Book Demo', to: '/demo-booking' },
  { label: 'About',          to: '/about' },
  { label: 'Contact',        to: '/contact' },
];

/* ─── role cards in modal ─── */
const ROLES = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Access lessons & progress',
    icon: GraduationCap,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100 hover:border-emerald-400',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    desc: 'Manage classes & earnings',
    icon: BookOpen,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100 hover:border-blue-400',
  },
  {
    id: 'parent',
    label: 'Parent',
    desc: "Track your child's progress",
    icon: Heart,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100 hover:border-amber-400',
  },
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Manage the platform',
    icon: Shield,
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-100 hover:border-violet-400',
  },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('cograd_logged_in') === 'true',
  );
  const [modalOpen, setModalOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const modalRef  = useRef(null);

  /* auth sync */
  useEffect(() => {
    const check = () =>
      setIsLoggedIn(localStorage.getItem('cograd_logged_in') === 'true');
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, [location]);

  /* scroll shadow */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 14);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMobileOpen(false);
    }
  }, [location, mobileOpen]);

  /* trap focus / esc on modal */
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => e.key === 'Escape' && setModalOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const logout = () => {
    ['cograd_logged_in', 'cograd_role', 'cograd_teacher_name'].forEach(
      (k) => localStorage.removeItem(k),
    );
    setIsLoggedIn(false);
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* ── NAV SHELL ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-[0_1px_0_0_#e2e8f0] py-0'
            : 'bg-transparent py-1'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[68px]">
            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center flex-shrink-0 group">
              <span className="text-[1.65rem] sm:text-[1.85rem] font-extrabold tracking-tight logo-shimmer">
                Cograd Pathshala
              </span>
            </Link>
            {/* ── DESKTOP LINKS ── */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-all duration-150 ${
                    isActive(to)
                      ? 'text-primary-600 font-semibold bg-primary-50/80'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70'
                  }`}
                >
                  {label}
                  {isActive(to) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* ── DESKTOP CTA ── */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-1 bg-neutral-50/80 border border-neutral-200 rounded-xl px-2 py-1.5 backdrop-blur-sm">
                  {[
                    { label: 'Dashboard', to: (() => {
                      const r = localStorage.getItem('cograd_role');
                      if (r === 'teacher') return '/teacher/dashboard';
                      if (r === 'admin')   return '/admin/dashboard';
                      if (r === 'parent')  return '/parent/dashboard';
                      return '/student/dashboard';
                    })(), color: 'text-primary-600 hover:bg-primary-50' },
                    { label: 'Logout', action: logout, color: 'text-neutral-400 hover:text-rose-600 hover:bg-rose-50' },
                  ].map((item) =>
                    item.action ? (
                      <button
                        key="logout"
                        onClick={item.action}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${item.color}`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${item.color}`}
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Log in
                  </button>
                  <Link
                    to="/demo-booking"
                    className="btn-primary text-[13.5px] px-5 py-2.5 gap-1.5"
                  >
                    Book Free Demo
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <div
          className={`lg:hidden absolute inset-x-0 top-full bg-white border-b border-neutral-100 shadow-xl transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-5 pt-4 pb-6 space-y-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14.5px] font-medium transition-all ${
                  isActive(to)
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {label}
                {isActive(to) && <ChevronRight className="w-4 h-4 text-primary-400" />}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-neutral-100 space-y-2">
              {isLoggedIn ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/student/dashboard" className="py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold text-center">Students</Link>
                  <Link to="/teacher/dashboard" className="py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold text-center">Teachers</Link>
                  <Link to="/admin/dashboard"   className="py-3 bg-violet-50 text-violet-700 rounded-xl text-sm font-semibold text-center">Admin</Link>
                  <button onClick={() => { logout(); }} className="py-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold cursor-pointer">Logout</button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); setModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-semibold"
                  >
                    <LogIn className="w-4 h-4" />
                    Log in
                  </button>
                  <Link to="/demo-booking" className="block w-full btn-primary py-3 text-center text-sm">
                    Book Free Demo
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── ROLE SELECTION MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-900/60 role-modal-backdrop"
            onClick={() => setModalOpen(false)}
          />

          {/* Panel */}
          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-100 p-7 animate-slide-up"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="text-center mb-7">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">Welcome to Cograd</h2>
              <p className="text-sm text-neutral-500 mt-1">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ id, label, desc, icon: Icon, bg, text, border }) => (
                <button
                  key={id}
                  onClick={() => {
                    setModalOpen(false);
                    navigate('/login', { state: { role: id } });
                  }}
                  className={`role-card p-4.5 rounded-xl border-2 bg-white text-left cursor-pointer transition-all ${border}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                    <Icon className={`w-5 h-5 ${text}`} />
                  </div>
                  <p className={`font-semibold text-sm text-neutral-800`}>{label}</p>
                  <p className="text-[11.5px] text-neutral-400 mt-0.5 leading-snug">{desc}</p>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-neutral-400 mt-5">
              New?{' '}
              <Link
                to="/register/student"
                onClick={() => setModalOpen(false)}
                className="text-primary-600 font-medium hover:underline"
              >
                Create a student account
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
