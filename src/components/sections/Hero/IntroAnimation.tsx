import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { fadeIn, fadeUp, fadeUpReduced } from '@/lib/animationVariants';
import { easings } from '@/theme/tokens';
import { cn } from '@/lib/cn';

/**
 * IntroAnimation — developer documentation
 * =========================================================================
 *
 * RESPONSIBILITY
 * -------------------------------------------------------------------------
 * Pure presentation. This component owns the cinematic visual sequence
 * and its internal timing — nothing else. Specifically, it:
 *
 *  - does NOT know about `LoadingScreen`'s lifecycle phases
 *    (initializing/ready/leaving/completed)
 *  - does NOT read or write audio state (no `useAudio`)
 *  - does NOT navigate, route, or touch anything outside its own DOM
 *  - communicates upward through exactly one callback prop,
 *    `onSequenceComplete`, fired once the visual sequence finishes —
 *    what that means to the rest of the app is entirely the caller's
 *    business
 *
 * This keeps the split established by `LoadingScreen` intact: lifecycle
 * orchestration lives there, choreography lives here. Either can be
 * redesigned independently.
 *
 * SEQUENCE
 * -------------------------------------------------------------------------
 * A single linear timeline, `SEQUENCE`, each step dwelling for a fixed
 * duration (`DEFAULT_STEP_ADVANCE_MS`, overridable via `sequenceTiming`)
 * before advancing to the next:
 *
 *   dark → point → seal → fog → energy → title → unlock → camera → done
 *
 *   1. dark   — nothing rendered but the black backdrop.
 *   2–3. point — a small crimson point fades in and grows.
 *   4. seal   — the point resolves into a thin circular seal (stroke draws in).
 *   5. fog    — soft atmospheric gradient fades in behind the seal,
 *      reusing the existing `vault-radial` background token and the
 *      shared `fadeIn` variant — no blur filters, since a gradient is
 *      far cheaper to composite than an actual blur layer. Placed
 *      before `energy` deliberately: the atmosphere should exist
 *      before the energy awakens within it.
 *   6. energy — crimson light travels along the seal's engraved lines
 *      (animated `stroke-dashoffset`, not particles).
 *   7. title  — "CRIMSON SANCTUM" / tagline fade up, reusing the shared
 *      `fadeUp` variant from the animation library rather than a
 *      one-off transition.
 *   8. unlock — the seal's outer ring rotates open slightly and
 *      brightens.
 *   9. camera — a gentle forward push: the whole scene scales up by a
 *      few percent with a slight upward drift. Implemented as a CSS
 *      transform on a wrapping element rather than an actual 3D camera —
 *      React Three Fiber is intentionally not used anywhere in this
 *      component; every element here is cheaper to animate with CSS
 *      transforms/opacity than to justify standing up a WebGL context.
 *   10. done  — `onSequenceComplete` fires exactly once (guaranteed by
 *      the effect only running when `step` transitions *into* `done`,
 *      not on every render).
 *
 * `DEFAULT_STEP_ADVANCE_MS` is intentionally its own local timing table,
 * not pulled from the global `durations` design token (which covers
 * ~300–1200ms micro-interactions). A one-time, multi-second cinematic
 * sequence is a different semantic scale from UI feedback timing, and
 * conflating the two would mean either bloating the shared token file
 * with cinematic-only values or awkwardly stretching UI durations to
 * fit a narrative beat. The shared *easing* curve (`easings.sanctum`)
 * is still reused throughout, since the "feel" should match the rest
 * of the site even though the pacing is unique to this sequence.
 *
 * Per-step timing is overridable via the `sequenceTiming` prop (merged
 * over the defaults) rather than hardcoded, so a future variation —
 * a shorter teaser, a slower "director's cut", an A/B test — is a
 * config change at the call site, not an edit to this file.
 *
 * PROPS
 * -------------------------------------------------------------------------
 * See `IntroAnimationProps`. `playing` lets a parent pause the sequence
 * at its current step boundary (e.g. once the visitor has skipped and
 * `LoadingScreen`'s own overlay has begun fading) without resetting
 * progress, so a visitor who skips mid-sequence never sees it silently
 * reset or jump.
 */

const SEQUENCE = [
  'dark',
  'point',
  'seal',
  'fog',
  'energy',
  'title',
  'unlock',
  'camera',
  'done',
] as const;

type SequenceStep = (typeof SEQUENCE)[number];

/** Default milliseconds to dwell in each step before advancing to the next. */
const DEFAULT_STEP_ADVANCE_MS: Record<SequenceStep, number> = {
  dark: 300,
  point: 900,
  seal: 1100,
  fog: 700,
  energy: 1200,
  title: 1200,
  unlock: 900,
  camera: 1400,
  done: 0, // terminal — never advanced past
};

/** Reduced-motion visitors skip straight to the final frame, quickly. */
const REDUCED_MOTION_HOLD_MS = 300;

function hasReached(step: SequenceStep, current: SequenceStep): boolean {
  return SEQUENCE.indexOf(current) >= SEQUENCE.indexOf(step);
}

export interface IntroAnimationProps {
  /** Fires exactly once, when the sequence reaches its final frame. */
  onSequenceComplete?: () => void;
  /**
   * Pauses the sequence at its current step boundary when false; resumes
   * from where it left off when true again. Defaults to true.
   */
  playing?: boolean;
  /** Overridable so this component can be reused for a different intro/title elsewhere. */
  title?: string;
  tagline?: string;
  className?: string;
  /**
   * Per-step duration overrides (ms), shallow-merged over
   * `DEFAULT_STEP_ADVANCE_MS`. Only the steps you want to change need
   * to be included.
   *
   * Note: a fresh object literal is a new reference on every render.
   * Changing this prop takes effect from the *next* step onward — it
   * won't reschedule a step that's already in flight, so passing an
   * inline literal every render is safe and won't cause timer churn.
   */
  sequenceTiming?: Partial<Record<SequenceStep, number>>;
}

export function IntroAnimation({
  onSequenceComplete,
  playing = true,
  title = 'CRIMSON SANCTUM',
  tagline = 'An Interactive Portfolio Experience',
  className,
  sequenceTiming,
}: IntroAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  // Mid-range Android is the stated performance bar — treat anything
  // narrower than a small tablet as "compact" and trim the more
  // expensive visual layers accordingly (fewer engraved lines, smaller
  // seal, smaller camera push). The adaptive strategy itself is
  // unchanged from the previous revision — only computational cost is
  // reduced, the experience is not simplified.
  const isCompact = useMediaQuery('(max-width: 640px)');

  // Merge caller overrides over the defaults for render-time use
  // (transition durations in JSX below always reflect the latest
  // value). Kept separately in a ref for the scheduling effect — see
  // that effect for why.
  const stepAdvanceMs = useMemo<Record<SequenceStep, number>>(
    () => ({ ...DEFAULT_STEP_ADVANCE_MS, ...sequenceTiming }),
    [sequenceTiming]
  );
  const stepAdvanceMsRef = useRef(stepAdvanceMs);
  useEffect(() => {
    stepAdvanceMsRef.current = stepAdvanceMs;
  }, [stepAdvanceMs]);

  const [stepIndex, setStepIndex] = useState(0);
  const step: SequenceStep = SEQUENCE[stepIndex] ?? 'done';

  // Reduced motion: jump straight to the final frame rather than
  // playing the sequence at a faster rate — respecting the preference
  // means not animating, not animating briefly.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const timer = window.setTimeout(() => {
      setStepIndex(SEQUENCE.length - 1);
    }, REDUCED_MOTION_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Standard timeline: advance one step after the current step's dwell
  // time, but only while `playing` and motion isn't reduced. Pausing
  // simply means "don't schedule the next advance" — already-visible
  // elements stay exactly as they are.
  //
  // Reads the current duration from `stepAdvanceMsRef` rather than
  // depending on `stepAdvanceMs` directly: if `sequenceTiming` were a
  // dependency here, a caller passing a new object literal every render
  // would cancel and reschedule this timer on every render, potentially
  // never letting it fire. Reading via ref means the *next* scheduled
  // step always uses the latest configured duration, without making
  // already-pending timers unstable.
  useEffect(() => {
    if (prefersReducedMotion || !playing || step === 'done') return;
    const timer = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, SEQUENCE.length - 1));
    }, stepAdvanceMsRef.current[step]);
    return () => window.clearTimeout(timer);
  }, [step, playing, prefersReducedMotion]);

  // Fires once, as a side effect of reaching the terminal step — this
  // effect only re-runs when `step` actually changes, and `step` can
  // only reach 'done' a single time (the timeline never resets), so no
  // separate "have we already fired?" flag is needed.
  useEffect(() => {
    if (step === 'done') {
      onSequenceComplete?.();
    }
  }, [step, onSequenceComplete]);

  const sealSize = isCompact ? 160 : 220;
  const engravedLineCount = isCompact ? 6 : 10;
  const cameraPushScale = isCompact ? 1.03 : 1.06;

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      {/* Camera push — a subtle scale/drift on the whole scene, not an
          actual 3D camera. */}
      <motion.div
        className="flex flex-col items-center justify-center"
        animate={
          prefersReducedMotion
            ? { scale: 1, y: 0 }
            : { scale: hasReached('camera', step) ? cameraPushScale : 1, y: hasReached('camera', step) ? -8 : 0 }
        }
        transition={{ duration: stepAdvanceMs.camera / 1000, ease: easings.sanctum }}
      >
        {/* Fog — reuses the existing `vault-radial` background token and
            the shared `fadeIn` variant. Enters before `energy` so the
            atmosphere is already present when the seal awakens. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-vault-radial"
          initial="hidden"
          animate={hasReached('fog', step) ? 'visible' : 'hidden'}
          variants={prefersReducedMotion ? fadeUpReduced : fadeIn}
        />

        {/* Seal */}
        <svg
          width={sealSize}
          height={sealSize}
          viewBox="0 0 200 200"
          role="img"
          aria-hidden="true"
          className="overflow-visible"
        >
          {/* Center point — grows into the seal's core */}
          <motion.circle
            cx={100}
            cy={100}
            fill="#9B1B30"
            animate={{ r: hasReached('point', step) ? 3 : 0, opacity: hasReached('point', step) ? 1 : 0 }}
            transition={{ duration: stepAdvanceMs.point / 1000, ease: easings.sanctum }}
          />

          {/* Outer seal ring — strokes in, then rotates open on `unlock` */}
          <motion.circle
            cx={100}
            cy={100}
            r={78}
            fill="none"
            stroke="#6E0D25"
            strokeWidth={1.5}
            style={{ transformOrigin: '100px 100px' }}
            initial={{ pathLength: 0, opacity: 0, rotate: 0 }}
            animate={{
              pathLength: hasReached('seal', step) ? 1 : 0,
              opacity: hasReached('seal', step) ? 1 : 0,
              rotate: hasReached('unlock', step) ? 8 : 0,
            }}
            transition={{
              pathLength: { duration: stepAdvanceMs.seal / 1000, ease: easings.sanctum },
              opacity: { duration: stepAdvanceMs.seal / 1000, ease: easings.sanctum },
              rotate: { duration: stepAdvanceMs.unlock / 1000, ease: easings.sanctum },
            }}
          />

          {/* Inner seal ring */}
          <motion.circle
            cx={100}
            cy={100}
            r={58}
            fill="none"
            stroke="#3A3836"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: hasReached('seal', step) ? 1 : 0,
              opacity: hasReached('seal', step) ? 1 : 0,
            }}
            transition={{ duration: stepAdvanceMs.seal / 1000, ease: easings.sanctum, delay: 0.15 }}
          />

          {/* Engraved lines — radial strokes between the two rings.
              Energy "travels" along them via animated stroke-dashoffset
              rather than any particle system, matching the restraint
              this sequence calls for. Count is trimmed on compact
              viewports to reduce the number of animated elements. */}
          {Array.from({ length: engravedLineCount }).map((_, index) => {
            const angle = (index / engravedLineCount) * Math.PI * 2;
            const x1 = 100 + Math.cos(angle) * 58;
            const y1 = 100 + Math.sin(angle) * 58;
            const x2 = 100 + Math.cos(angle) * 78;
            const y2 = 100 + Math.sin(angle) * 78;
            const lineLength = 20; // matches the ~20px gap between rings

            return (
              <motion.line
                key={`engraved-line-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#9B1B30"
                strokeWidth={1}
                strokeDasharray={lineLength}
                initial={{ strokeDashoffset: lineLength, opacity: 0 }}
                animate={{
                  strokeDashoffset: hasReached('energy', step) ? 0 : lineLength,
                  opacity: hasReached('energy', step) ? 1 : 0,
                }}
                transition={{
                  duration: stepAdvanceMs.energy / 1000,
                  ease: easings.sanctum,
                  delay: (index / engravedLineCount) * 0.4,
                }}
              />
            );
          })}
        </svg>

        {/* Title — reuses the shared fadeUp/fadeUpReduced variants from
            the animation library rather than a one-off transition. */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 text-center"
          initial="hidden"
          animate={hasReached('title', step) ? 'visible' : 'hidden'}
          variants={prefersReducedMotion ? fadeUpReduced : fadeUp}
        >
          <h1 className="font-display text-3xl tracking-widest text-parchment md:text-4xl">
            {title}
          </h1>
          <p className="font-utility text-xs uppercase tracking-widest2 text-parchment-faint md:text-sm">
            {tagline}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
