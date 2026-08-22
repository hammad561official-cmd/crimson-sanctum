import { Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';

interface LazyMountProps {
  /** A React.lazy()-wrapped component to mount once in view. */
  component: ComponentType;
  /** Shown before the section scrolls into view and while it's loading. */
  placeholder?: ReactNode;
  /** IntersectionObserver rootMargin — how far ahead to start loading. */
  rootMargin?: string;
}

/**
 * LazyMount
 *
 * Defers both the network fetch (via React.lazy/dynamic import) and the
 * mount of a heavy section — used for the three sections approved for
 * heavy Three.js use (Intro, Hero, Hall of Achievement) so their R3F
 * bundle and scene setup cost is only paid when the visitor is actually
 * about to see them, not on initial page load.
 *
 * Usage:
 *   const HallOfAchievement = lazy(() => import('@/components/sections/HallOfAchievement'));
 *   <LazyMount component={HallOfAchievement} placeholder={<SectionSkeleton />} />
 */
export function LazyMount({ component: Component, placeholder = null, rootMargin = '200px' }: LazyMountProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={placeholder}>
          <Component />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}
