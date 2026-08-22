import type { Variants } from 'framer-motion';
import { durations, easings } from '@/theme/tokens';

/**
 * animationVariants
 *
 * Central library of Framer Motion variants for Crimson Sanctum. Sections
 * should import from here rather than defining ad-hoc animation objects
 * inline — this keeps easing, duration, and distance consistent across
 * the whole experience ("emotion before animation" only works if the
 * animation language is coherent site-wide).
 *
 * Every duration and easing curve used below comes from the centralized
 * design tokens (`@/theme/tokens`) rather than being redeclared here.
 *
 * Every variant has a `reduced` counterpart consumers can swap to when
 * `prefersReducedMotion` is true (see useReducedMotion hook). Reduced
 * variants keep the opacity change but drop translation/scale so content
 * still appears, just without motion.
 */

// Re-exported for call sites that need the raw curve (e.g. CSS-in-JS).
export const SANCTUM_EASE = easings.sanctum;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow.seconds, ease: SANCTUM_EASE },
  },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.fast.seconds } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.slower.seconds, ease: SANCTUM_EASE },
  },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.ambient.seconds, ease: SANCTUM_EASE },
  },
};

export const scaleRevealReduced: Variants = fadeUpReduced;

/**
 * staggerContainer — wraps a group of children (e.g. skill list, cert grid)
 * so they reveal in sequence rather than all at once. Pair with fadeUp on
 * each child.
 */
export function staggerContainer(staggerDelay = 0.12): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };
}

/**
 * Standard viewport config for scroll-triggered reveals. `once: true` so
 * elements don't re-animate every time the visitor scrolls past — motion
 * should mark a moment, not repeat itself.
 */
export const scrollViewport = { once: true, margin: '-10% 0px -10% 0px' } as const;

/**
 * Resolves the correct variant set based on the visitor's motion
 * preference. Usage: const variants = resolveMotion(fadeUp, fadeUpReduced, prefersReducedMotion)
 */
export function resolveMotion(
  fullVariant: Variants,
  reducedVariant: Variants,
  prefersReducedMotion: boolean
): Variants {
  return prefersReducedMotion ? reducedVariant : fullVariant;
}
