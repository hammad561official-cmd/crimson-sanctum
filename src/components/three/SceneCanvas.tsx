import { Suspense, type ReactNode } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SceneCanvasProps extends Omit<CanvasProps, 'children' | 'dpr' | 'frameloop'> {
  children: ReactNode;
  fallback?: ReactNode;
  disableBelow?: string;
  frameloop?: CanvasProps['frameloop'];
  dpr?: CanvasProps['dpr'];
}

/**
 * SceneCanvas
 *
 * Shared wrapper around R3F's <Canvas>, used by every 3D moment in the
 * site — per the approved decision, that's the Intro, Hero, and Hall of
 * Achievement only. Every other section stays HTML/CSS + Framer Motion.
 *
 *  - dpr capped at [1, 2] so 3x+ device pixel ratios don't quietly tank
 *    frame rate on high-density mobile screens
 *  - `frameloop="demand"` by default: scenes only re-render when their
 *    contents actually change (camera move, animation tick requested),
 *    not on a constant 60fps loop — needed to hit the 45–60fps mobile /
 *    60fps desktop target across three separate 3D moments
 *  - wrapped in ErrorBoundary + Suspense so a WebGL failure or slow
 *    asset load never blocks the underlying content
 *  - `fallback` prop renders instead of the canvas entirely on viewports
 *    below the given breakpoint, per the agreed low-end-device strategy
 *
 * Actual scene content (geometry, lighting, models) is composed as
 * children by each section, and each section component itself should be
 * `React.lazy`-loaded so the Three.js/R3F/drei bundle only downloads
 * when a visitor actually scrolls near that section.
 */
export function SceneCanvas({
  children,
  fallback = null,
  disableBelow = '(max-width: 480px)',
  frameloop = 'demand',
  dpr = [1, 2],
  className,
  ...canvasProps
}: SceneCanvasProps) {
  const shouldDisable = useMediaQuery(disableBelow);

  if (shouldDisable) {
    return <>{fallback}</>;
  }

  return (
    <ErrorBoundary fallback={fallback}>
      <Canvas
        dpr={dpr}
        frameloop={frameloop}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className={className}
        {...canvasProps}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
