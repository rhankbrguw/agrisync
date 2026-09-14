import { useState, useEffect, useCallback } from 'react';

export function useNetworkStatus(onOnline?: () => void, onOffline?: () => void) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    onOnline?.();
  }, [onOnline]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    onOffline?.();
  }, [onOffline]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline };
}
