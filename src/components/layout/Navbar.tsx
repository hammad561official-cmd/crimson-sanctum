import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SECTIONS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const navItems = SECTIONS.filter((section) => section.id !== 'hero');

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [clock, setClock] = useState('');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Intl.DateTimeFormat(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date())
      );
    };

    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const elements = navItems
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      setActiveId('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        setActiveId(visible ? visible.target.id : '');
      },
      {
        root: null,
        threshold: [0.2, 0.5, 0.8],
        rootMargin: '-18% 0px -40% 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleSelect = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    setActiveId(id);
    setMenuOpen(false);
  };

  return (
    <header className="reference-nav fixed inset-x-0 top-0 z-modal border-b border-charcoal-600/80 bg-obsidian/80 backdrop-blur-sm">
      <nav aria-label="Primary navigation" className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <a
          href="#hero"
          className="font-display text-sm uppercase tracking-[0.32em] text-parchment transition-colors duration-300 hover:text-crimson-ruby"
        >
          Crimson Sanctum
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((section) => {
            const isActive = activeId === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSelect(section.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] transition-colors duration-300',
                  isActive
                    ? 'bg-crimson-deep text-parchment'
                    : 'text-parchment-muted hover:bg-charcoal-700 hover:text-parchment'
                )}
              >
                {section.label}
              </button>
            );
          })}
        </div>

        <time className="hidden font-utility text-[11px] tracking-[0.08em] text-parchment-faint lg:block" dateTime={new Date().toISOString()}>
          {clock}
        </time>

        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-sm border border-charcoal-500 p-2 text-parchment transition-colors duration-300 hover:border-crimson-ruby hover:text-crimson-ruby md:hidden"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="flex flex-col gap-1.5">
            <span
              className={cn(
                'block h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
                menuOpen && 'translate-y-2 rotate-45'
              )}
            />
            <span
              className={cn(
                'block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300',
                menuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'block h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
                menuOpen && '-translate-y-2 -rotate-45'
              )}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            className="border-t border-charcoal-600 bg-obsidian md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-3">
              {navItems.map((section) => {
                const isActive = activeId === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleSelect(section.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-sm px-3 py-3 text-left text-sm uppercase tracking-[0.22em] transition-colors duration-300',
                      isActive ? 'bg-crimson-deep text-parchment' : 'text-parchment-muted hover:bg-charcoal-700 hover:text-parchment'
                    )}
                  >
                    <span>{section.label}</span>
                    {isActive && <span aria-hidden="true">•</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
