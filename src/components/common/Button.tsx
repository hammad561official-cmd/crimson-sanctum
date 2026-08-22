import { forwardRef } from 'react';
import type { ElementType, ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';

/**
 * Button
 *
 * Single source of truth for interactive button styling. Two variants
 * cover the brief's restrained palette: `primary` (crimson, for the one
 * or two calls-to-action that should carry weight) and `ghost` (outlined,
 * for everything else). Resist adding more variants without a real need —
 * visual restraint is a stated design priority.
 *
 * The `as` prop allows rendering as a different element/component (e.g.
 * React Router's `Link`, which needs a `to` prop) while keeping
 * consistent styling. Typed permissively for `as`-specific props (e.g.
 * `to`) via a passthrough index signature, since fully precise polymorphic
 * typing adds significant complexity for a component this small — if the
 * project grows a design-system package, revisit with a proper
 * `PolymorphicComponentProps` helper.
 */

const VARIANTS = {
  primary: 'bg-crimson-deep text-parchment hover:bg-crimson-ruby active:bg-crimson-deep',
  ghost:
    'bg-transparent text-parchment border border-charcoal-500 hover:border-crimson-ruby hover:text-parchment',
} as const;

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
} as const;

type ButtonVariant = keyof typeof VARIANTS;
type ButtonSize = keyof typeof SIZES;

export interface ButtonProps {
  as?: ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
  /** Passthrough for `as`-specific props (e.g. `to` on React Router's Link, `href` on `a`). */
  [key: string]: unknown;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(
  ({ as: Component = 'button', variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const El = Component as ElementType;
    const variantKey = variant as ButtonVariant;
    const sizeKey = size as ButtonSize;
    const resolvedClassName = typeof className === 'string' ? className : undefined;

    return (
      <El
        ref={ref as Ref<never>}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-sm font-body font-medium tracking-wide',
          'transition-colors duration-300 ease-sanctum',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-ruby focus-visible:outline-offset-2',
          'disabled:opacity-40 disabled:pointer-events-none',
          VARIANTS[variantKey],
          SIZES[sizeKey],
          resolvedClassName
        )}
        {...props}
      >
        {children}
      </El>
    );
  }
);

Button.displayName = 'Button';
