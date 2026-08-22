import { motion, type MotionStyle } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeUp, fadeUpReduced, scrollViewport } from '@/lib/animationVariants';

interface SectionWrapperProps {
  id: string;
  label: string;
  className?: string;
  style?: MotionStyle;
  children?: ReactNode;
}

/**
 * SectionWrapper
 *
 * Standard shell for every page section (Hero, About, Skills, etc.).
 * Handles:
 *  - consistent vertical rhythm between sections
 *  - the scroll-triggered fade-up reveal, with a reduced-motion fallback
 *  - a semantic <section> with a required aria-label for screen reader
 *    navigation between an otherwise visually-driven page
 *
 * Individual sections should NOT hand-roll their own motion.section
 * wrapper — compose their content inside this instead, so the reveal
 * language stays identical site-wide.
 */
export function SectionWrapper({ id, label, className, style, children }: SectionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? fadeUpReduced : fadeUp;

  return (
    <motion.section
      id={id}
      aria-label={label}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={variants}
      {...(style !== undefined ? { style } : {})}
      className={cn('relative py-section-y-mobile md:py-section-y-desktop', className)}
    >
      {children}
    </motion.section>
  );
}
