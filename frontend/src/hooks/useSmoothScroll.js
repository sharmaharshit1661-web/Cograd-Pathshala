import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

let lenis = null; // module-level singleton
let rafId = null;

const noSmoothScrollPaths = [
  '/login',
  '/register/student',
  '/register/teacher',
  '/teacher/dashboard',
  '/admin/dashboard',
  '/student/dashboard',
  '/parent/dashboard'
];

function initLenis() {
  if (lenis) return;

  lenis = new Lenis({
    duration: 1.2,          // scroll duration in seconds (higher = smoother/slower)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) {
    if (lenis) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
  }
  rafId = requestAnimationFrame(raf);
}

function destroyLenis() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function useSmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldDisable = noSmoothScrollPaths.includes(pathname) || pathname.includes('/dashboard');

    if (shouldDisable) {
      destroyLenis();
    } else {
      initLenis();
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      destroyLenis();
    };
  }, []);
}

/** Call from anywhere to programmatically smooth-scroll to an element or position */
export function scrollTo(target, options = {}) {
  if (lenis) lenis.scrollTo(target, options);
}
