import { useEffect, lazy, Suspense } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages loaded dynamically using Code Splitting (React.lazy)
const Home = lazy(() => import('./pages/Home'));
const Student = lazy(() => import('./pages/Student'));
const Teacher = lazy(() => import('./pages/Teacher'));
const DemoBooking = lazy(() => import('./pages/DemoBooking'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const RegisterStudent = lazy(() => import('./pages/RegisterStudent'));
const RegisterTeacher = lazy(() => import('./pages/RegisterTeacher'));
const RoleSelector = lazy(() => import('./pages/RoleSelector'));
const RegisterParent = lazy(() => import('./pages/RegisterParent'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

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

function App() {
  return (
    <Router>
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
  );
}

export default App;
