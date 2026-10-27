import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@/styles/global.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const resetInitialScroll = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
};

resetInitialScroll();
window.requestAnimationFrame(resetInitialScroll);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element (#root) not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
