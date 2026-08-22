import {
  useCallback,
  useEffect,
  useReducer,
  type ComponentType,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { fadeUp, fadeUpReduced, fadeIn } from '@/lib/animationVariants';
import { durations } from '@/theme/tokens';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/cn';
import educationData from '@/data/education.json';

/**
 * Hero — developer documentation
 * =========================================================================
 *
 * RESPONSIBILITY
 * -------------------------------------------------------------------------
 * Orchestration only — this is the Hero's equivalent of `LoadingScreen`,
 * not of `IntroAnimation`. It owns:
 *
 *  - the Hero's own lifecycle (`HeroPhase`), gated by an `active` prop
 *    the parent flips once the intro has finished
 *  - the "brief silence" beat before anything happens
 *  - a typed slot (`chamber`) for the actual cinematic content — camera
 *    move, darkness, the falling light beam, rising particles, the
 *    stroke-by-stroke name-forging, and its transformation into an
 *    engraved monument. That content does not exist yet; building it is
 *    a separate, presentation-only component (the Hero's equivalent of
 *    `IntroAnimation`), authored and approved next.
 *  - the subtitle (owner name / title / school) and the "Scroll to
 *    Begin" cue — simple, static chrome, owned directly here the same
 *    way `LoadingScreen` owned its Skip button rather than delegating
 *    it to `IntroAnimation`
 *  - a `onNavigationReveal` callback, fired once the sequence reaches
 *    the point where "navigation quietly awakens" — this component
 *    does NOT render navigation itself (that's a separate, not-yet-
 *    built component), it only owns *when* that moment happens
 *
 * Why split this way: the cinematic chamber content is almost certainly
 * going to be the most visually iterated-on part of the entire site —
 * lighting, particle count, the name-forging technique will all get
 * tuned repeatedly. None of that should risk touching lifecycle,
 * accessibility, or timing logic, and vice versa. The same reasoning
 * that separated `LoadingScreen` from `IntroAnimation` applies here, at
 * slightly larger scale, because the Hero's chrome (subtitle,
 * navigation cue, scroll cue) has real *causal* dependencies on the
 * cinematic content finishing — which is why, unlike `LoadingScreen`'s
 * opaque `children: ReactNode` slot, the `chamber` slot here is a
 * component reference that receives an explicit `onComplete` callback.
 * `LoadingScreen` never needed to know when its intro animation
 * finished internally; the Hero's subtitle explicitly cannot appear
 * until the monument transformation completes, so that signal has to
 * exist in the type system, not just as visual timing coincidence.
 *
 * LIFECYCLE
 * -------------------------------------------------------------------------
 *   idle → silence → chamber → subtitle → navigation → scrollCue → settled
 *
 *   - idle: mounted but dormant. The Hero is expected to already be in
 *     the DOM (beneath the still-visible `LoadingScreen`) so the
 *     handoff between them is seamless rather than a mount flash.
 *   - silence: a brief, deliberate pause after `active` becomes true,
 *     before the chamber content begins.
 *   - chamber: the injected `chamber` component renders and plays. This
 *     phase only ends when that component calls its `onComplete` prop.
 *     If no `chamber` component is supplied yet, a configurable
 *     fallback timer advances the phase instead, so the rest of this
 *     sequence (subtitle, navigation, scroll cue) is previewable and
 *     testable before the cinematic content exists.
 *   - subtitle: owner name / title / school fades in (`fadeUp`, reused
 *     from the shared animation library), then reports completion via
 *     `onAnimationComplete`.
 *   - navigation: `onNavigationReveal` fires once, then a short
 *     configurable dwell before advancing — modeling the "navigation
 *     quietly awakens" beat without this component rendering real nav.
 *   - scrollCue: the "Scroll to Begin" indicator fades in, then reports
 *     completion the same way the subtitle does.
 *   - settled: terminal. The visitor has full control; nothing further
 *     is orchestrated.
 *
 * All transitions are centralized in `heroPhaseReducer`, matching the
 * explicit-state-machine pattern established in `LoadingScreen`.
 *
 * MOBILE & REDUCED MOTION
 * -------------------------------------------------------------------------
 * `isCompact` (via `useMediaQuery`) and `prefersReducedMotion` are both
 * computed once, here, and threaded down to the `chamber` component as
 * props — not re-derived independently inside it. One source of truth
 * for "how much visual cost can this device/visitor afford" keeps every
 * future scene component agreeing with each other automatically.
 *
 * CONTENT
 * -------------------------------------------------------------------------
 * `ownerName`/`ownerTitle`/`ownerSchool` default from existing project
 * data (`SITE.owner`, `data/education.json`) rather than duplicating
 * those strings as new hardcoded literals — consistent with this
 * project's standing rule that editable content lives in structured
 * data, not scattered across components. They remain overridable props
 * for flexibility/testing.
 */

export type HeroPhase =
  | 'idle'
  | 'silence'
  | 'chamber'
  | 'subtitle'
  | 'navigation'
  | 'scrollCue'
  | 'settled';

type HeroAction =
  | { type: 'ACTIVATE' }
  | { type: 'SILENCE_COMPLETE' }
  | { type: 'CHAMBER_COMPLETE' }
  | { type: 'SUBTITLE_COMPLETE' }
  | { type: 'NAVIGATION_COMPLETE' }
  | { type: 'SETTLE' };

/** The complete lifecycle state machine — every valid transition lives here. */
function heroPhaseReducer(phase: HeroPhase, action: HeroAction): HeroPhase {
  switch (action.type) {
    case 'ACTIVATE':
      return phase === 'idle' ? 'silence' : phase;
    case 'SILENCE_COMPLETE':
      return phase === 'silence' ? 'chamber' : phase;
    case 'CHAMBER_COMPLETE':
      return phase === 'chamber' ? 'subtitle' : phase;
    case 'SUBTITLE_COMPLETE':
      return phase === 'subtitle' ? 'navigation' : phase;
    case 'NAVIGATION_COMPLETE':
      return phase === 'navigation' ? 'scrollCue' : phase;
    case 'SETTLE':
      return phase === 'scrollCue' ? 'settled' : phase;
    default:
      return phase;
  }
}

/**
 * Props passed to whatever component is supplied via the `chamber` slot.
 * This is the contract the future cinematic-content component must
 * satisfy — see module docs above for why it's a typed component
 * reference rather than an opaque `children: ReactNode`.
 */
export interface HeroChamberProps {
  /** True only during the `chamber` phase — the component should not animate outside this window. */
  active: boolean;
  isCompact: boolean;
  prefersReducedMotion: boolean;
  /** Must be called exactly once, when the chamber's own cinematic sequence finishes. */
  onComplete: () => void;
}

const primaryEducation = educationData[0];
const DEFAULT_OWNER_NAME = SITE.owner;
const DEFAULT_OWNER_TITLE = primaryEducation ? `${primaryEducation.program} Student` : '';
const DEFAULT_OWNER_SCHOOL = primaryEducation?.institution ?? '';

const DEFAULT_SILENCE_MS = 500;
const DEFAULT_CHAMBER_FALLBACK_MS = durations.slower.seconds * 1000; // used only if no `chamber` is supplied
const DEFAULT_NAVIGATION_DWELL_MS = 600;
const REDUCED_MOTION_HOLD_MS = durations.fast.seconds * 1000;

export interface HeroProps {
  /** Flip to true once the intro sequence has handed off control. Defaults to false. */
  active?: boolean;
  /**
   * The cinematic content component (camera move, light, particles,
   * name-forging, monument transform). Optional so this component is
   * previewable before that piece exists — see Lifecycle docs above.
   */
  chamber?: ComponentType<HeroChamberProps>;
  /** Only used when `chamber` is not supplied. */
  chamberFallbackDurationMs?: number;
  /** Milliseconds to hold on `silence` before the chamber begins. */
  silenceDurationMs?: number;
  /** Milliseconds to dwell on `navigation` after `onNavigationReveal` fires, before the scroll cue appears. */
  navigationDwellMs?: number;
  /** Fires once, when the sequence reaches the `navigation` phase. This component renders no navigation itself. */
  onNavigationReveal?: () => void;

  ownerName?: string;
  ownerTitle?: string;
  ownerSchool?: string;
  scrollCueLabel?: string;

  className?: string;
  /** Optional additional content — not part of the cinematic sequence, rendered statically behind it. */
  children?: ReactNode;
}

export function Hero({
  active = false,
  chamber: Chamber,
  chamberFallbackDurationMs = DEFAULT_CHAMBER_FALLBACK_MS,
  silenceDurationMs = DEFAULT_SILENCE_MS,
  navigationDwellMs = DEFAULT_NAVIGATION_DWELL_MS,
  onNavigationReveal,
  ownerName = DEFAULT_OWNER_NAME,
  ownerTitle = DEFAULT_OWNER_TITLE,
  ownerSchool = DEFAULT_OWNER_SCHOOL,
  scrollCueLabel = 'Scroll to Begin',
  className,
  children,
}: HeroProps) {
  const [phase, dispatch] = useReducer(heroPhaseReducer, 'idle');
  const prefersReducedMotion = useReducedMotion();
  // Same performance bar as IntroAnimation: mid-range Android first.
  // Computed once here and threaded to the chamber component below,
  // rather than re-derived per scene — see module docs.
  const isCompact = useMediaQuery('(max-width: 640px)');

  // idle -> silence, once the parent hands off control
  useEffect(() => {
    if (active) dispatch({ type: 'ACTIVATE' });
  }, [active]);

  // silence -> chamber, after the configured pause. Reduced motion
  // still respects a pause (this is a narrative beat, not a transition
  // to skip), but uses a short fixed hold rather than the full
  // configured duration.
  useEffect(() => {
    if (phase !== 'silence') return;
    const holdMs = prefersReducedMotion ? REDUCED_MOTION_HOLD_MS : silenceDurationMs;
    const timer = window.setTimeout(() => dispatch({ type: 'SILENCE_COMPLETE' }), holdMs);
    return () => window.clearTimeout(timer);
  }, [phase, prefersReducedMotion, silenceDurationMs]);

  // chamber -> subtitle: normally signaled by the injected component's
  // onComplete; falls back to a timer if no chamber component is
  // supplied, so this file is testable standalone.
  const handleChamberComplete = useCallback(() => dispatch({ type: 'CHAMBER_COMPLETE' }), []);
  useEffect(() => {
    if (phase !== 'chamber' || Chamber) return; // real component owns its own completion signal
    const timer = window.setTimeout(
      () => dispatch({ type: 'CHAMBER_COMPLETE' }),
      prefersReducedMotion ? 0 : chamberFallbackDurationMs
    );
    return () => window.clearTimeout(timer);
  }, [phase, Chamber, chamberFallbackDurationMs, prefersReducedMotion]);

  // subtitle -> navigation: the subtitle's own fade-up transition
  // reports completion via onAnimationComplete below; reduced motion
  // has no transition to wait on, so it advances immediately.
  useEffect(() => {
    if (phase === 'subtitle' && prefersReducedMotion) {
      dispatch({ type: 'SUBTITLE_COMPLETE' });
    }
  }, [phase, prefersReducedMotion]);

  // Entering `navigation`: fire the reveal callback exactly once, then
  // dwell briefly before the scroll cue appears.
  useEffect(() => {
    if (phase !== 'navigation') return;
    onNavigationReveal?.();
    const timer = window.setTimeout(
      () => dispatch({ type: 'NAVIGATION_COMPLETE' }),
      prefersReducedMotion ? 0 : navigationDwellMs
    );
    return () => window.clearTimeout(timer);
  }, [phase, onNavigationReveal, navigationDwellMs, prefersReducedMotion]);

  // scrollCue -> settled: same pattern — reduced motion advances
  // immediately, otherwise the cue's own fade-in reports completion.
  useEffect(() => {
    if (phase === 'scrollCue' && prefersReducedMotion) {
      dispatch({ type: 'SETTLE' });
    }
  }, [phase, prefersReducedMotion]);

  const showSubtitle =
    phase === 'subtitle' || phase === 'navigation' || phase === 'scrollCue' || phase === 'settled';
  const showScrollCue = phase === 'scrollCue' || phase === 'settled';

  return (
    <section
      id="hero"
      aria-label="Hero"
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-obsidian',
        className
      )}
    >
      {/* Cinematic content slot. Renders nothing but the dark backdrop
          above until `active` is set and the `silence` beat has
          elapsed — see module docs for why this section is expected to
          already be mounted beneath LoadingScreen rather than mounting
          fresh after it. */}
      {Chamber && (
        <Chamber
          active={phase === 'chamber'}
          isCompact={isCompact}
          prefersReducedMotion={prefersReducedMotion}
          onComplete={handleChamberComplete}
        />
      )}

      {/* Subtitle — static chrome owned directly here, not delegated to
          the chamber component, matching how LoadingScreen owned its
          own Skip button rather than pushing it into IntroAnimation. */}
      <motion.div
        className="relative z-content mt-6 flex flex-col items-center gap-2 text-center"
        initial="hidden"
        animate={showSubtitle ? 'visible' : 'hidden'}
        variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
        onAnimationComplete={(definition) => {
          if (definition === 'visible' && phase === 'subtitle') {
            dispatch({ type: 'SUBTITLE_COMPLETE' });
          }
        }}
      >
        <p className="font-display text-lg tracking-wide text-parchment md:text-xl">{ownerName}</p>
        <p className="font-body text-sm text-parchment-muted md:text-base">{ownerTitle}</p>
        <p className="font-utility text-xs uppercase tracking-widest text-parchment-faint">
          {ownerSchool}
        </p>
      </motion.div>

      {children}

      {/* Scroll cue — simple, self-contained, reused-variant chrome. */}
      <motion.div
        className="absolute inset-x-0 bottom-10 z-content flex flex-col items-center gap-2"
        initial="hidden"
        animate={showScrollCue ? 'visible' : 'hidden'}
        variants={prefersReducedMotion ? fadeUpReduced : fadeIn}
        onAnimationComplete={(definition) => {
          if (definition === 'visible' && phase === 'scrollCue') {
            dispatch({ type: 'SETTLE' });
          }
        }}
      >
        <span className="font-utility text-xs uppercase tracking-widest text-parchment-faint">
          {scrollCueLabel}
        </span>
        <motion.span
          aria-hidden="true"
          className="block h-8 w-px bg-charcoal-500"
          animate={prefersReducedMotion ? { scaleY: 1 } : { scaleY: [0.4, 1, 0.4] }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
