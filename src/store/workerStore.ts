import { create } from 'zustand';

interface WorkerState {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export const useWorkerStore = create<WorkerState>((set) => ({
  showHistory: false,
  setShowHistory: (show) => set({ showHistory: show }),
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
}));
