import { useTheme } from '@/context/ThemeContext';

/**
 * useReducedMotion — convenience hook so components don't need to know
 * the value lives on ThemeContext. Prefer this in section components.
 */
export function useReducedMotion(): boolean {
  const { prefersReducedMotion } = useTheme();
  return prefersReducedMotion;
}
