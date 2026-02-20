import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  display: {
    showLabels: boolean;
    showConnections: boolean;
    showGrid: boolean;
  };
  performance: {
    maxVisibleNodes: number;
    targetFPS: number;
  };
  ai: {
    enableSuggestions: boolean;
    similarityThreshold: number;
  };
}

interface SettingsState {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  display: {
    showLabels: false,
    showConnections: true,
    showGrid: true,
  },
  performance: {
    maxVisibleNodes: 500,
    targetFPS: 60,
  },
  ai: {
    enableSuggestions: true,
    similarityThreshold: 0.65,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (partial) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
            display: { ...state.settings.display, ...partial.display },
            performance: { ...state.settings.performance, ...partial.performance },
            ai: { ...state.settings.ai, ...partial.ai },
          },
        })),

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'nihiltheism-settings',
    }
  )
);