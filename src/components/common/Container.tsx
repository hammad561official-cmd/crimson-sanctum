import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}

/**
 * Container — consistent max-width and horizontal padding wrapper.
 * Every section should nest its content in this rather than redefining
 * padding/width rules, so the page reads as one authored layout instead
 * of independently-built sections.
 */
export function Container({ as: Component = 'div', className, children, ...props }: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-container px-container-x-mobile md:px-container-x-desktop',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
