import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

let lenis = null; // module-level singleton

export function useSmoothScroll() {
  const { pathname } = useLocation();

  // Boot Lenis once on mount
  useEffect(() => {
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

    // RAF loop
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenis = null;
    };
  }, []);

  // On every route change — scroll to top instantly (no smooth)
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);
}

/** Call from anywhere to programmatically smooth-scroll to an element or position */
export function scrollTo(target, options = {}) {
  if (lenis) lenis.scrollTo(target, options);
}
