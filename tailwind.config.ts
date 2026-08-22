import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  breakpoints,
  easings,
} from './src/theme/tokens';

/**
 * Tailwind configuration.
 *
 * This file intentionally contains no raw design values of its own —
 * every color, font, radius, shadow, z-index, and breakpoint is imported
 * from `src/theme/tokens.ts` and mapped into Tailwind's theme. If a
 * value needs to change, change it in tokens.ts; this file should never
 * need a second edit.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      spacing: {
        'section-y-mobile': spacing.sectionPaddingY.mobile,
        'section-y-desktop': spacing.sectionPaddingY.desktop,
        'container-x-mobile': spacing.containerPaddingX.mobile,
        'container-x-desktop': spacing.containerPaddingX.desktop,
      },
      maxWidth: {
        container: spacing.containerMaxWidth,
      },
      borderRadius: radii,
      boxShadow: shadows,
      zIndex,
      screens: breakpoints,
      transitionTimingFunction: {
        sanctum: `cubic-bezier(${easings.sanctum.join(', ')})`,
      },
      backgroundImage: {
        'vault-radial':
          'radial-gradient(circle at center, rgba(110,13,37,0.15) 0%, rgba(10,9,8,0) 70%)',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
