import type { ReactElement } from 'react';
import { Button } from '@/components/common/Button';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/cn';

/**
 * AudioToggle
 *
 * Single source of truth for the site's audio on/off control. Both
 * presentations below read and write the same `useAudio()` state
 * (backed by `AudioContext`), so enabling or disabling audio from
 * anywhere in the app stays in sync everywhere else it's shown — there
 * is exactly one place audio state lives, this component just renders
 * two views onto it.
 *
 *  - `variant="expanded"` — two labeled choice buttons with supporting
 *    copy. Used once, at the intro (`LoadingScreen`), where the visitor
 *    is making a deliberate first decision about audio.
 *  - `variant="compact"` — a single icon-only toggle. Intended for
 *    persistent chrome (header/nav, once built) where audio is a quick
 *    toggle rather than a first-time decision.
 *
 * On the transition between variants: this component does not animate
 * "expanded morphing into compact." That's intentional and mirrors the
 * same orchestration/animation split used in `LoadingScreen` — this
 * component is responsible for rendering each state correctly, not for
 * choreographing the handoff between them. Whoever composes that
 * transition (e.g. the Hero or a page-level layout component) owns the
 * cross-fade.
 */

export interface AudioToggleProps {
  variant?: 'expanded' | 'compact';
  /** Expanded variant: label for the choice that turns audio ON. */
  enableLabel?: string;
  /** Expanded variant: supporting copy under the enable choice. */
  enableDescription?: string;
  /** Expanded variant: label for the choice that keeps audio OFF. */
  disableLabel?: string;
  /** Expanded variant: supporting copy under the disable choice. */
  disableDescription?: string;
  /** Compact variant: accessible name while audio is ON (the button mutes). */
  compactMuteLabel?: string;
  /** Compact variant: accessible name while audio is OFF (the button enables). */
  compactEnableLabel?: string;
  className?: string;
}

const DEFAULTS = {
  enableLabel: '🔊 Awaken the Sanctum',
  enableDescription: 'Enable immersive ambient audio and interaction sounds.',
  disableLabel: '🔇 Enter Quietly',
  disableDescription: 'Continue without audio.',
  compactMuteLabel: 'Mute ambient audio',
  compactEnableLabel: 'Enable ambient audio',
} as const;

export function AudioToggle({
  variant = 'expanded',
  enableLabel = DEFAULTS.enableLabel,
  enableDescription = DEFAULTS.enableDescription,
  disableLabel = DEFAULTS.disableLabel,
  disableDescription = DEFAULTS.disableDescription,
  compactMuteLabel = DEFAULTS.compactMuteLabel,
  compactEnableLabel = DEFAULTS.compactEnableLabel,
  className,
}: AudioToggleProps) {
  const { enabled, enableAudio, disableAudio, toggleAudio } = useAudio();

  if (variant === 'compact') {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-pressed={enabled}
        aria-label={enabled ? compactMuteLabel : compactEnableLabel}
        onClick={toggleAudio}
        className={cn('aspect-square p-2', className)}
      >
        {enabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </Button>
    );
  }

  // Expanded variant deliberately does NOT reuse the shared `Button`
  // primitive's default layout — `Button` assumes single-line,
  // horizontally-centered content, whereas each choice here stacks a
  // label over supporting copy. Rather than fight that with overriding
  // classes (which risks Tailwind class-order conflicts with `Button`'s
  // own base styles), these are plain buttons that borrow the same
  // focus-ring/transition treatment directly for visual consistency.
  const choiceClassName = cn(
    'flex flex-1 flex-col items-start gap-1 rounded-sm border border-charcoal-500 px-5 py-4 text-left',
    'bg-transparent text-parchment transition-colors duration-300 ease-sanctum hover:border-crimson-ruby',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-ruby focus-visible:outline-offset-2'
  );

  return (
    <div
      role="group"
      aria-label="Audio preference"
      className={cn('flex w-full flex-col gap-3 sm:flex-row sm:gap-4', className)}
    >
      <button type="button" aria-pressed={enabled} onClick={enableAudio} className={choiceClassName}>
        <span className="font-body font-medium">{enableLabel}</span>
        <span className="text-sm font-normal text-parchment-muted">{enableDescription}</span>
      </button>

      <button type="button" aria-pressed={!enabled} onClick={disableAudio} className={choiceClassName}>
        <span className="font-body font-medium">{disableLabel}</span>
        <span className="text-sm font-normal text-parchment-muted">{disableDescription}</span>
      </button>
    </div>
  );
}

/**
 * Minimal inline icons for the compact variant. Kept local rather than
 * pulling in an icon library dependency for two glyphs — revisit if the
 * project ends up needing a broader icon set.
 */
function SpeakerOnIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="4,9 8,9 12,5 12,19 8,15 4,15" />
      <path d="M16 8a5 5 0 0 1 0 8" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SpeakerOffIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="4,9 8,9 12,5 12,19 8,15 4,15" />
      <line x1="16" y1="9" x2="21" y2="14" />
      <line x1="21" y1="9" x2="16" y2="14" />
    </svg>
  );
}
