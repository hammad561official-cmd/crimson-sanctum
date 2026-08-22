/**
 * Design Tokens — Crimson Sanctum
 *
 * Single source of truth for every color, type scale, spacing value,
 * shadow, z-index layer, duration, and breakpoint used across the
 * project. Nothing downstream (Tailwind config, components, animation
 * variants) should hardcode a raw value that has a token here — import
 * from this file instead, so a future palette or rhythm change happens
 * in one place.
 *
 * `tailwind.config.ts` imports this module directly and maps tokens
 * into Tailwind's theme, so Tailwind utility classes (`bg-obsidian`,
 * `text-parchment`, `shadow-vault`, etc.) and any token consumed
 * directly in TS/TSX (e.g. Framer Motion variants) always agree.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------
// Derived from the approved brief: Obsidian Black / Charcoal Gray /
// Deep Crimson / Ruby Red / Soft White. No neon, no RGB gaming accents —
// every shade is desaturated except the two crimson accents, which stay
// deliberate and sparse.
export const colors = {
  obsidian: {
    DEFAULT: '#0A0908',
    950: '#050504',
    900: '#0A0908',
    800: '#121110',
  },
  charcoal: {
    DEFAULT: '#1C1B1A',
    700: '#242322',
    600: '#2E2C2A',
    500: '#3A3836',
  },
  crimson: {
    DEFAULT: '#6E0D25', // Deep Crimson — primary accent, used sparingly
    deep: '#6E0D25',
    ruby: '#9B1B30', // Ruby Red — secondary accent for hover/active states
  },
  parchment: {
    DEFAULT: '#F5F1EA', // Soft White — primary text on dark surfaces
    muted: '#C9C4BB', // dimmed body text
    faint: '#8C8880', // captions, metadata
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
// Cinzel for headings (monumental, fantasy-inspired without feeling
// dated), Inter for body (clean, highly readable), JetBrains Mono for
// technical/UI labels.
export const typography = {
  fontFamily: {
    display: ['"Cinzel"', 'serif'],
    body: ['"Inter"', 'system-ui', 'sans-serif'],
    utility: ['"JetBrains Mono"', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem', // 12px — captions, metadata
    sm: '0.875rem', // 14px — small UI text
    base: '1rem', // 16px — body copy
    lg: '1.125rem', // 18px — lead paragraphs
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px — small headings
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px — hero-scale display type
    '7xl': '4.5rem', // 72px
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.02em',
    widest: '0.1em',
    widest2: '0.35em', // used for eyebrow labels, e.g. "404"
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.3',
    normal: '1.6',
    relaxed: '1.8',
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------
// General scale extends Tailwind's default rem-based spacing (left
// untouched — it's already token-driven). These are Crimson-Sanctum-
// specific named values layered on top, for rhythm that repeats across
// many sections (e.g. section vertical padding).
export const spacing = {
  sectionPaddingY: {
    mobile: '6rem', // 96px
    desktop: '8rem', // 128px
  },
  containerMaxWidth: '72rem', // 1152px — matches Container's max-w-6xl
  containerPaddingX: {
    mobile: '1.5rem', // 24px
    desktop: '2.5rem', // 40px
  },
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------
// Deliberately restrained — sharp, architectural edges over soft
// rounded-everything, consistent with "premium architectural
// installation" rather than a generic SaaS look.
export const radii = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '8px',
  full: '9999px',
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------
export const shadows = {
  vault: '0 0 60px -15px rgba(110, 13, 37, 0.35)',
  soft: '0 4px 24px -8px rgba(0, 0, 0, 0.5)',
} as const;

// ---------------------------------------------------------------------------
// Z-index layers
// ---------------------------------------------------------------------------
// Named layers instead of ad-hoc numbers, so stacking order is legible
// and collisions are caught at a glance rather than by trial and error.
export const zIndex = {
  base: '0',
  scene: '10', // Three.js canvases sitting behind HTML content
  content: '20', // ordinary section content
  skipLink: '50', // accessibility skip-to-content link
  overlay: '40', // dimming layers, e.g. behind a modal
  modal: '60',
  toast: '70',
} as const;

// ---------------------------------------------------------------------------
// Animation durations & easing
// ---------------------------------------------------------------------------
// Seconds (for Framer Motion) and the matching millisecond string (for
// Tailwind's `transition-duration` utilities) are kept side by side so
// CSS-driven and Framer-Motion-driven animation stay in sync.
export const durations = {
  fast: { seconds: 0.3, ms: '300ms' },
  base: { seconds: 0.6, ms: '600ms' },
  slow: { seconds: 0.8, ms: '800ms' },
  slower: { seconds: 1, ms: '1000ms' },
  ambient: { seconds: 1.2, ms: '1200ms' },
} as const;

export const easings = {
  // A slow, deliberate settle rather than a bouncy default — the
  // signature motion feel referenced throughout the animation system.
  sanctum: [0.16, 1, 0.3, 1] as const,
} as const;

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------
// Mobile-first, min-width based (matches Tailwind's default model and
// the project's mobile-first optimization requirement).
export const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ---------------------------------------------------------------------------
// Aggregate export
// ---------------------------------------------------------------------------
export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  durations,
  easings,
  breakpoints,
} as const;

export type DesignTokens = typeof tokens;

export default tokens;
