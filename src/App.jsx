import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import DemoBooking from './pages/DemoBooking';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterTeacher from './pages/RegisterTeacher';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';

// Scroll to Top behavior & Scroll Reveal setup on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

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
          rootMargin: '0px 0px -50px 0px' // triggers slightly before entering the screen
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
  const hideHeaderFooter = ['/login', '/register/student', '/register/teacher', '/teacher/dashboard', '/admin/dashboard', '/student/dashboard', '/parent/dashboard'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<Student />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/demo-booking" element={<DemoBooking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/teacher" element={<RegisterTeacher />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
        </Routes>
      </LayoutWrapper>
      <Analytics />
    </Router>
  );
}

export default App;
