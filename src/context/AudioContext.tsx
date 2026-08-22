import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { audioManager } from '@/lib/audioManager';
import { useTheme } from '@/context/ThemeContext';

/**
 * AudioContext
 *
 * Site-wide audio state. Audio starts OFF and stays OFF until the visitor
 * explicitly enables it via the Audio Toggle — this provider enforces that
 * rule structurally by only ever unmuting in response to a user action,
 * never on mount.
 */

interface AudioContextValue {
  enabled: boolean;
  enableAudio: () => void;
  disableAudio: () => void;
  toggleAudio: () => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const { hasInteracted } = useTheme();

  // Keep Howler's global mute state in sync with the toggle.
  useEffect(() => {
    audioManager.setMuted(!enabled);
  }, [enabled]);

  const enableAudio = useCallback(() => {
    // Defensive guard: never allow enabling before a real user gesture,
    // since some browsers will silently block/throw on unprompted playback.
    if (!hasInteracted) return;
    setEnabled(true);
  }, [hasInteracted]);

  const disableAudio = useCallback(() => setEnabled(false), []);

  const toggleAudio = useCallback(() => {
    setEnabled((prev) => (hasInteracted ? !prev : prev));
  }, [hasInteracted]);

  const value = useMemo<AudioContextValue>(
    () => ({ enabled, enableAudio, disableAudio, toggleAudio }),
    [enabled, enableAudio, disableAudio, toggleAudio]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
