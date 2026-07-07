import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, GraduationCap, Shield, BookOpen, Heart,
  Sparkles, LogIn, ChevronRight, LayoutDashboard, LogOut,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Find Teachers', to: '/student' },
  { label: 'Teach with Us', to: '/teacher' },
  { label: 'About',          to: '/about' },
  { label: 'Contact',        to: '/contact' },
];

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

const ROLE_DASHBOARD = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/parent/dashboard',
  admin: '/admin/dashboard',
};

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

  /* close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

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

  /* lock body scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const logout = () => {
    ['cograd_logged_in', 'cograd_role', 'cograd_teacher_name', 'cograd_token'].forEach(
      (k) => localStorage.removeItem(k),
    );
    setIsLoggedIn(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    const r = localStorage.getItem('cograd_role');
    return ROLE_DASHBOARD[r] || '/student/dashboard';
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* ── NAV SHELL ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-xl shadow-[0_1px_0_0_#e2e8f0] py-0'
            : 'bg-transparent py-1'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── LOGO ── */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0 group"
              aria-label="Cograd Pathshala home"
            >
              <span className="text-[1.65rem] sm:text-[1.85rem] font-extrabold tracking-tight logo-shimmer">
                Cograd Pathshala
              </span>
            </Link>

            {/* ── DESKTOP LINKS ── */}
            <div className="hidden lg:flex items-center gap-1" role="menubar">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  role="menuitem"
                  className={`relative px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-all duration-150 ${
                    isActive(to)
                      ? 'text-primary-600 font-semibold bg-primary-50/80'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70'
                  }`}
                >
                  {label}
                  {/* active dot indicator */}
                  {isActive(to) && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"
                      style={{ boxShadow: '0 0 6px rgba(37,99,235,0.5)' }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── DESKTOP CTA ── */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-1 bg-neutral-50/90 border border-neutral-200 rounded-xl px-2 py-1.5 backdrop-blur-sm">
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                  <div className="w-px h-4 bg-neutral-200" aria-hidden="true" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-all cursor-pointer"
                    aria-haspopup="dialog"
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
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
            >
              <div className={`transition-transform duration-300 ${mobileOpen ? 'rotate-90' : ''}`}>
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 top-[68px] bg-neutral-900/30 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          id="mobile-drawer"
          role="dialog"
          aria-label="Mobile navigation"
          aria-modal="true"
          className={`lg:hidden absolute inset-x-0 top-full bg-white border-b border-neutral-100 z-50
            shadow-[0_16px_48px_rgba(15,23,42,0.12)]
            transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            overflow-y-auto ${mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-2 opacity-0 pointer-events-none'}`}
        >
          <div className="px-5 pt-4 pb-6 space-y-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[14.5px] font-medium transition-all border-l-2 ${
                  isActive(to)
                    ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-primary-50/10 border-primary-500 font-semibold shadow-sm shadow-primary-500/5'
                    : 'text-neutral-700 hover:bg-neutral-50 border-transparent'
                }`}
              >
                <span>{label}</span>
                {isActive(to)
                  ? <ChevronRight className="w-4 h-4 text-primary-400" />
                  : <ChevronRight className="w-4 h-4 text-neutral-300" />
                }
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-neutral-100 space-y-2">
              {isLoggedIn ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center justify-center gap-1.5 py-3 bg-primary-50 text-primary-700 rounded-xl text-sm font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="flex items-center justify-center gap-1.5 py-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); setModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    Log in
                  </button>
                  <Link
                    to="/demo-booking"
                    className="block w-full btn-primary py-3.5 text-center text-sm rounded-xl"
                  >
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
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md role-modal-backdrop"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-100 p-7 animate-slide-up no-glass"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-7">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 id="modal-title" className="text-xl font-bold text-neutral-900">Welcome to Cograd</h2>
              <p className="text-sm text-neutral-500 mt-1">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {ROLES.map(({ id, label, desc, icon: Icon, bg, text, border }) => (
                <button
                  key={id}
                  onClick={() => {
                    setModalOpen(false);
                    navigate('/login', { state: { role: id } });
                  }}
                  className={`role-card p-3 sm:p-4 rounded-xl border-2 bg-white text-left cursor-pointer transition-all ${border} focus-visible:outline-2 focus-visible:outline-primary-500`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 ${bg}`}>
                    <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${text}`} />
                  </div>
                  <p className="font-semibold text-xs sm:text-sm text-neutral-800">{label}</p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-snug">{desc}</p>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-neutral-400 mt-5">
              New here?{' '}
              <button
                onClick={() => { setModalOpen(false); navigate('/register'); }}
                className="text-primary-600 font-semibold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
