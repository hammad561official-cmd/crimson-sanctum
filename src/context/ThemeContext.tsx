import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * ThemeContext
 *
 * Crimson Sanctum has one fixed visual identity (Dark Fantasy / Luxury
 * Minimalism) — there is no light-mode toggle in the brief. This provider
 * exists instead to centralize the things that legitimately vary at
 * runtime and that many components need to read:
 *
 *  - prefersReducedMotion: OS-level accessibility signal
 *  - hasInteracted: whether the visitor has made a first interaction yet
 *    (gates autoplay-adjacent behavior — audio, certain intro animations)
 *
 * Keeping this separate from AudioContext means components that only
 * care about motion don't need to import audio logic, and vice versa.
 */

interface ThemeContextValue {
  prefersReducedMotion: boolean;
  hasInteracted: boolean;
  setHasInteracted: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (hasInteracted) return undefined;

    const markInteracted = () => setHasInteracted(true);
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((event) =>
      window.addEventListener(event, markInteracted, { once: true })
    );

    return () => {
      events.forEach((event) => window.removeEventListener(event, markInteracted));
    };
  }, [hasInteracted]);

  const value = useMemo<ThemeContextValue>(
    () => ({ prefersReducedMotion, hasInteracted, setHasInteracted }),
    [prefersReducedMotion, hasInteracted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
