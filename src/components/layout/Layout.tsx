import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout
 *
 * Shared page chrome. The header now owns the single-page navigation for
 * the current cinematic experience without altering the orchestration
 * flow in the Hero / LoadingScreen sequence.
 *
 * What it DOES own today:
 *  - a skip-to-content link, required for keyboard users to bypass any
 *    future intro/loading sequence
 *  - a skip-intro affordance target (the intro sequence itself will
 *    render its own visible "Skip Intro" control per the accessibility
 *    requirements; this id gives it somewhere to send focus)
 *  - the shared <Navbar /> used across the single-page experience
 *  - the <main> landmark every route renders into
 */
export function Layout({ children }: LayoutProps) {
  return (
    <>
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="pt-20">
        {children}
      </main>
    </>
  );
}
