import { create } from 'zustand';

interface DashboardState {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  viewMode: 'MAP' | 'LIST';
  setViewMode: (mode: 'MAP' | 'LIST') => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
  viewMode: 'MAP',
  setViewMode: (mode) => set({ viewMode: mode }),
}));

import { useEffect } from 'react';
export function useMapFocus() {
  const setViewMode = useDashboardStore(state => state.setViewMode);
  useEffect(() => {
    const handleFocus = () => setViewMode('MAP');
    window.addEventListener('focus-map-report', handleFocus);
    return () => window.removeEventListener('focus-map-report', handleFocus);
  }, [setViewMode]);
}
