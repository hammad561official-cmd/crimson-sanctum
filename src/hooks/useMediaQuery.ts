import { useEffect, useState } from 'react';

/**
 * useMediaQuery — generic breakpoint/capability hook.
 * Used e.g. to decide whether to mount the full Three.js scene or a
 * lighter static fallback on small/low-power viewports:
 *
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
