import { useEffect, useState } from 'react';

/**
 * useScrollProgress
 *
 * Returns overall page scroll progress as a 0–1 value. Intended for
 * subtle UI like a vault-seal progress indicator, not for driving heavy
 * per-frame 3D work (use useFrame + scroll refs directly in R3F for that,
 * to avoid React re-renders on every scroll tick).
 *
 * Throttled via requestAnimationFrame to avoid flooding React state
 * updates during fast scrolling.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const next = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, next)));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
