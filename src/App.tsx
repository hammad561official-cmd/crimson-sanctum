import { ReferencePortfolio } from '@/ReferencePortfolio';

/**
 * App
 *
 * Provider order matters: ThemeProvider must wrap AudioProvider, since
 * AudioProvider reads `hasInteracted` from ThemeContext to enforce the
 * "no audio before user gesture" rule.
 *
 * Routing is in place for future expansion (e.g. a standalone case-study
 * route under Current Works & Future Ventures) even though today there's
 * only one real route — the single-page scroll experience at "/".
 */
export default function App() {
  return <ReferencePortfolio />;
}
