import type { ElementType, ReactNode, HTMLAttributes } from 'react';

interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

/**
 * VisuallyHidden — renders content for screen readers only.
 * Useful for the cinematic sections of this site where meaning is often
 * carried visually/atmospherically and needs an explicit text equivalent.
 */
export function VisuallyHidden({ as: Component = 'span', children, ...props }: VisuallyHiddenProps) {
  return (
    <Component className="sr-only" {...props}>
      {children}
    </Component>
  );
}
