import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { AudioToggle, type AudioToggleProps } from '@/components/common/AudioToggle';
import { VisuallyHidden } from '@/components/common/VisuallyHidden';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeIn, fadeUpReduced } from '@/lib/animationVariants';
import { durations } from '@/theme/tokens';
import { cn } from '@/lib/cn';

/**
 * LoadingScreen — developer documentation
 * =========================================================================
 *
 * RESPONSIBILITY
 * -------------------------------------------------------------------------
 * LoadingScreen owns the *lifecycle* of the intro experience — when it
 * appears, how long it stays, how it can be dismissed, and when the rest
 * of the site is allowed to take over. It does NOT own:
 *
 *  - the intro animation itself (vault reveal, particles, logo) — that's
 *    rendered via `children`, authored and approved as a separate
 *    component (`IntroAnimation`, pending)
 *  - the audio on/off decision UI — that's `AudioToggle`, composed here
 *    but implemented and reused independently
 *
 * Orchestration is kept separate from animation/presentation
 * deliberately: it means the intro's visual choreography can be
 * redesigned, replaced, or A/B tested without touching timing, focus
 * management, or accessibility logic, and vice versa — the lifecycle
 * rules here don't change based on what the animation looks like.
 *
 * LIFECYCLE
 * -------------------------------------------------------------------------
 * Four explicit, named phases (see `LoadingPhase`), each with a single
 * clear entry condition:
 *
 *   initializing → ready → leaving → completed
 *
 *   - initializing: mounted, overlay fully visible, waiting on both
 *     `isReady` (prop, default true) and an internal minimum-duration
 *     timer (`minimumDurationMs`).
 *   - ready: both gates above are satisfied. Momentary today — the
 *     component auto-advances straight into `leaving` — but modeled as
 *     its own state so a future requirement (e.g. "wait for an explicit
 *     Enter click once ready") can be added without restructuring the
 *     state machine, just by not auto-dispatching `LEAVE` on entry.
 *   - leaving: the exit fade plays. Skipping (button or Escape) jumps
 *     directly here from `initializing` or `ready`, bypassing the
 *     readiness gates entirely.
 *   - completed: terminal. Reached either when the exit fade's
 *     `onAnimationComplete` fires, or immediately upon entering
 *     `leaving` if the visitor prefers reduced motion (no transition to
 *     wait on). `onComplete` and focus restoration fire exactly once,
 *     as a side effect of *reaching* this state — not from an
 *     imperative "have we already done this?" flag, since the reducer
 *     guarantees `completed` can only be entered a single time.
 *
 * All transitions are centralized in `loadingPhaseReducer` below, so the
 * full set of valid state changes is visible in one place rather than
 * scattered across effects.
 *
 * PROPS
 * -------------------------------------------------------------------------
 * See `LoadingScreenProps`. Every user-facing string (status text, skip
 * label, dialog aria-label) has a sensible Crimson-Sanctum-flavored
 * default but is overridable — this component has no hardcoded copy, so
 * it can be reused for a different intro/loading context without
 * touching its implementation. Audio-specific copy lives in
 * `AudioToggleProps` and is forwarded via `audioToggleProps`, rather
 * than duplicated here.
 */

const DEFAULT_MINIMUM_DURATION_MS = durations.ambient.seconds * 1000;

export type LoadingPhase = 'initializing' | 'ready' | 'leaving' | 'completed';

type LoadingAction = { type: 'READY' } | { type: 'LEAVE' } | { type: 'COMPLETE' };

/**
 * The complete lifecycle state machine. Every valid transition — and,
 * implicitly, every invalid one (anything not listed is a no-op) — is
 * defined here.
 */
function loadingPhaseReducer(phase: LoadingPhase, action: LoadingAction): LoadingPhase {
  switch (action.type) {
    case 'READY':
      return phase === 'initializing' ? 'ready' : phase;
    case 'LEAVE':
      return phase === 'initializing' || phase === 'ready' ? 'leaving' : phase;
    case 'COMPLETE':
      return phase === 'leaving' ? 'completed' : phase;
    default:
      return phase;
  }
}

export interface LoadingScreenProps {
  /**
   * Fires exactly once, as a side effect of the state machine reaching
   * `completed`. The parent is responsible for removing
   * `<LoadingScreen />` from the tree in response — this component
   * never unmounts itself.
   */
  onComplete: () => void;
  /**
   * Whether the underlying page/assets are actually ready to be shown.
   * The overlay won't advance past `initializing` until this is true
   * AND the minimum duration has elapsed. Defaults to `true` for cases
   * where there's nothing async to wait on yet.
   */
  isReady?: boolean;
  /**
   * Floor on how long the overlay stays visible, in milliseconds, even
   * if `isReady` is true immediately. Defaults to the "ambient"
   * duration token (1200ms).
   */
  minimumDurationMs?: number;
  /** Element to return keyboard focus to once `completed`. Falls back to `document.body`. */
  restoreFocusRef?: RefObject<HTMLElement>;
  /** Slot for the actual intro animation/content — see module docs above. */
  children?: ReactNode;
  className?: string;

  /** Accessible name for the overlay's `role="dialog"`. */
  ariaLabel?: string;
  /** Screen-reader status text during `initializing` / `ready`. */
  loadingStatusText?: string;
  /** Screen-reader status text during `leaving` / `completed`. */
  readyStatusText?: string;
  /** Label for the always-visible skip control. */
  skipButtonLabel?: string;
  /** Forwarded to the embedded `<AudioToggle variant="expanded" />` — see `AudioToggleProps` for individual copy overrides. */
  audioToggleProps?: Partial<AudioToggleProps>;
}

export function LoadingScreen({
  onComplete,
  isReady = true,
  minimumDurationMs = DEFAULT_MINIMUM_DURATION_MS,
  restoreFocusRef,
  children,
  className,
  ariaLabel = 'Crimson Sanctum introduction',
  loadingStatusText = 'Loading Crimson Sanctum',
  readyStatusText = 'Entering Crimson Sanctum',
  skipButtonLabel = 'Skip Intro',
  audioToggleProps,
}: LoadingScreenProps) {
  const [phase, dispatch] = useReducer(loadingPhaseReducer, 'initializing');
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // --- Minimum-duration timer ---------------------------------------------
  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumElapsed(true), minimumDurationMs);
    return () => window.clearTimeout(timer);
  }, [minimumDurationMs]);

  // --- initializing -> ready, once both gates are satisfied ---------------
  useEffect(() => {
    if (isReady && minimumElapsed) {
      dispatch({ type: 'READY' });
    }
  }, [isReady, minimumElapsed]);

  // --- ready -> leaving, auto-advance (see module docs: `ready` exists as
  //     its own state for future extensibility, not because anything
  //     currently pauses here) ------------------------------------------
  useEffect(() => {
    if (phase === 'ready') {
      dispatch({ type: 'LEAVE' });
    }
  }, [phase]);

  // --- Manual skip: initializing|ready -> leaving, bypassing the gates ---
  const skip = useCallback(() => {
    dispatch({ type: 'LEAVE' });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skip]);

  // --- leaving -> completed, immediately, when motion is reduced (there's
  //     no transition to wait on — see module docs) -----------------------
  useEffect(() => {
    if (phase === 'leaving' && prefersReducedMotion) {
      dispatch({ type: 'COMPLETE' });
    }
  }, [phase, prefersReducedMotion]);

  // --- Side effects of reaching `completed` — runs exactly once, since
  //     the reducer guarantees `completed` is only ever entered once. ----
  useEffect(() => {
    if (phase !== 'completed') return;
    const restoreTarget = restoreFocusRef?.current ?? document.body;
    restoreTarget.focus();
    onComplete();
  }, [phase, onComplete, restoreFocusRef]);

  // --- Focus management on mount ------------------------------------------
  useEffect(() => {
    skipButtonRef.current?.focus();
  }, []);

  const isLeaving = phase === 'leaving' || phase === 'completed';
  const statusMessage = isLeaving ? readyStatusText : loadingStatusText;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      initial="hidden"
      animate={isLeaving ? 'hidden' : 'visible'}
      variants={prefersReducedMotion ? fadeUpReduced : fadeIn}
      onAnimationComplete={(definition) => {
        if (definition === 'hidden' && phase === 'leaving') {
          dispatch({ type: 'COMPLETE' });
        }
      }}
      className={cn(
        'fixed inset-0 z-modal flex flex-col items-center justify-center bg-obsidian',
        isLeaving && 'pointer-events-none',
        className
      )}
    >
      {/* Screen-reader-only status announcement — the overlay itself is a
          visual cue, so this is the non-visual equivalent. */}
      <VisuallyHidden as="p" role="status" aria-live="polite">
        {statusMessage}
      </VisuallyHidden>

      {/* Slot for the actual intro animation, authored separately. */}
      <div className="flex flex-1 items-center justify-center">{children}</div>

      {/* Persistent, always-visible controls — never hidden behind hover
          or focus-only states, per the project's accessibility standard. */}
      <div className="absolute inset-x-0 bottom-8 flex w-full max-w-md flex-col items-center gap-6 px-6 md:bottom-12">
        <AudioToggle variant="expanded" {...audioToggleProps} />

        <Button ref={skipButtonRef} type="button" variant="ghost" size="sm" onClick={skip}>
          {skipButtonLabel}
        </Button>
      </div>
    </motion.div>
  );
}
