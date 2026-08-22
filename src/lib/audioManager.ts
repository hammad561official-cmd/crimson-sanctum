import { Howl, Howler } from 'howler';

/**
 * audioManager
 *
 * Thin wrapper around Howler for Crimson Sanctum's ambient audio system.
 * Per the approved spec: audio NEVER autoplays, stays subtle, and is
 * fully visitor-controlled. This module owns loading/caching of sound
 * assets so components never touch Howl instances directly.
 *
 * Sound categories (files added later, once assets are sourced):
 *  - ambience: soft orchestral / atmospheric electronic bed, loops, low volume
 *  - ui: elegant clicks for interactive elements
 *  - chime: crystal chime for milestone moments (e.g. entering Hall of Achievement)
 *  - vault: ancient vault ambience, used contextually in that section
 */

export type SoundCategory = 'ambience' | 'ui' | 'chime' | 'vault';

interface RegisterOptions {
  src: string | string[];
  category?: SoundCategory;
  loop?: boolean;
}

const DEFAULT_VOLUME: Record<SoundCategory, number> = {
  ambience: 0.25,
  ui: 0.35,
  chime: 0.4,
  vault: 0.3,
};

// Registry of loaded Howl instances, keyed by sound id.
// Empty until real audio files are added under src/assets/audio.
const sounds = new Map<string, Howl>();

/**
 * Registers a sound so it can be played by id later.
 * Call this once per sound, typically from a small manifest module.
 */
function register(id: string, { src, category = 'ui', loop = false }: RegisterOptions): Howl {
  const existing = sounds.get(id);
  if (existing) return existing;

  const howl = new Howl({
    src: Array.isArray(src) ? src : [src],
    loop,
    volume: DEFAULT_VOLUME[category],
    preload: false, // load on first play, not on registration
  });

  sounds.set(id, howl);
  return howl;
}

function play(id: string): void {
  const howl = sounds.get(id);
  if (!howl) {
    console.warn(`[audioManager] Attempted to play unregistered sound: "${id}"`);
    return;
  }
  howl.play();
}

function stop(id: string): void {
  sounds.get(id)?.stop();
}

function fadeOut(id: string, duration = 800): void {
  const howl = sounds.get(id);
  if (!howl) return;
  howl.fade(howl.volume(), 0, duration);
}

function fadeIn(id: string, targetVolume: number, duration = 800): void {
  const howl = sounds.get(id);
  if (!howl) return;
  howl.volume(0);
  howl.play();
  howl.fade(0, targetVolume, duration);
}

/** Global mute switch — mirrors the site-wide Audio Toggle. */
function setMuted(muted: boolean): void {
  Howler.mute(muted);
}

export const audioManager = {
  register,
  play,
  stop,
  fadeIn,
  fadeOut,
  setMuted,
  DEFAULT_VOLUME,
};
