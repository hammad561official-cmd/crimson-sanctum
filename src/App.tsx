import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/context/ThemeContext';
import { AudioProvider } from '@/context/AudioContext';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

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
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AudioProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AudioProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
