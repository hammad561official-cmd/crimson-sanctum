import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary
 *
 * Class component (React requires this — no hooks equivalent exists yet)
 * that catches render errors in its subtree. Primarily wraps the R3F
 * <Canvas> tree: a WebGL context loss or Three.js error should never take
 * down the whole page, especially since the underlying content (resume
 * information) must remain reachable regardless of 3D support.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production this could report to an error-tracking service.
    console.error('[ErrorBoundary] Caught render error:', error, info);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
