import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App.tsx';
import { APP_CONFIG } from './constants/config';
import { TOKENS } from './constants/tokens';

// Suppress Firefox/Zen Browser deprecation warnings triggered by Leaflet 1.9.4
if (typeof MouseEvent !== 'undefined') {
  Object.defineProperties(MouseEvent.prototype, {
    mozPressure: { get: function() { return 0; }, configurable: true },
    mozInputSource: { get: function() { return 0; }, configurable: true }
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.CACHE.STALE_TIME_MS,
      gcTime: APP_CONFIG.CACHE.GC_TIME_MS,
      refetchOnWindowFocus: false,
      retry: APP_CONFIG.CACHE.RETRY,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion={TOKENS.ANIMATION.REDUCED_MOTION as "user" | "always" | "never"}>
        <App />
      </MotionConfig>
    </QueryClientProvider>
  </StrictMode>,
);
