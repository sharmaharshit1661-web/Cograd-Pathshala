import { useEffect, lazy, Suspense } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Safe dynamic import to handle chunk loading failures (e.g. cached deployment hashes)
const safeLazy = (importFn) => {
  return lazy(() =>
    importFn().catch((err) => {
      console.warn("Chunk load failed, forcing page reload...", err);
      const hasReloaded = window.sessionStorage.getItem('chunk_load_reloaded');
      if (!hasReloaded) {
        window.sessionStorage.setItem('chunk_load_reloaded', 'true');
        window.location.reload();
      }
      return { default: () => <PageLoader /> };
    })
  );
};

// Pages loaded dynamically using Code Splitting
const Home = safeLazy(() => import('./pages/Home'));
const Student = safeLazy(() => import('./pages/Student'));
const Teacher = safeLazy(() => import('./pages/Teacher'));
const DemoBooking = safeLazy(() => import('./pages/DemoBooking'));
const About = safeLazy(() => import('./pages/About'));
const Contact = safeLazy(() => import('./pages/Contact'));
const Login = safeLazy(() => import('./pages/Login'));
const RegisterStudent = safeLazy(() => import('./pages/RegisterStudent'));
const RegisterTeacher = safeLazy(() => import('./pages/RegisterTeacher'));
const RoleSelector = safeLazy(() => import('./pages/RoleSelector'));
const RegisterParent = safeLazy(() => import('./pages/RegisterParent'));
const TeacherDashboard = safeLazy(() => import('./pages/TeacherDashboard'));
const AdminDashboard = safeLazy(() => import('./pages/AdminDashboard'));
const StudentDashboard = safeLazy(() => import('./pages/StudentDashboard'));
const ParentDashboard = safeLazy(() => import('./pages/ParentDashboard'));
const VerifyEmail = safeLazy(() => import('./pages/VerifyEmail'));

// Premium loading spinner fallback for dynamic routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

// Scroll Reveal on route change (Lenis handles scrollTo-top via useSmoothScroll)
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Short timeout to ensure React has fully committed the new route DOM
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
      };
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

// Layout Wrapper to hide footer on login/signup pages
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/register', '/register/student', '/register/parent', '/register/teacher', '/teacher/dashboard', '/admin/dashboard', '/student/dashboard', '/parent/dashboard', '/verify-email'].includes(location.pathname);

  // Boot Lenis smooth scroll globally
  useSmoothScroll();

  return (
    <div className="liquid-glass-active min-h-[100dvh] relative overflow-x-hidden">
      {/* Drifting Liquid Glass Background Orbs */}
      <div className="orb orb-1 opacity-75" aria-hidden="true" />
      <div className="orb orb-2 opacity-65" aria-hidden="true" />
      <div className="orb orb-3 opacity-55" aria-hidden="true" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        {!hideHeaderFooter && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
        {!hideHeaderFooter && <Footer />}
      </div>
    </div>
  );
};

// Automatic session termination on 10 minutes of inactivity
const InactivityTimer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('cograd_logged_in') === 'true';
    if (!isLoggedIn) return;

    let timeoutId;

    const logoutUser = () => {
      localStorage.removeItem('cograd_logged_in');
      localStorage.removeItem('cograd_role');
      localStorage.removeItem('cograd_token');
      localStorage.removeItem('cograd_logged_in_email');
      localStorage.removeItem('cograd_teacher_name');
      localStorage.removeItem('cograd_student_name');
      localStorage.removeItem('cograd_parent_name');
      
      navigate('/login');
      alert("Your session has expired due to inactivity. Please log in again.");
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 10 minutes = 10 * 60 * 1000 = 600,000 ms
      timeoutId = setTimeout(logoutUser, 600000);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimer();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate, location.pathname]);

  return null;
};

function App() {
  useEffect(() => {
    window.sessionStorage.removeItem('chunk_load_reloaded');
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <InactivityTimer />
        <ScrollToTop />
        <LayoutWrapper>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/student" element={<Student />} />
              <Route path="/teacher" element={<Teacher />} />
              <Route path="/demo-booking" element={<DemoBooking />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RoleSelector />} />
              <Route path="/register/student" element={<RegisterStudent />} />
              <Route path="/register/parent" element={<RegisterParent />} />
              <Route path="/register/teacher" element={<RegisterTeacher />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
          </Suspense>
        </LayoutWrapper>
        <Analytics />
      </Router>
    </ThemeProvider>
  );
}

export default App;
