import { create } from 'zustand';
import { Position3D } from '@/types';

type PanelType = 'search' | 'filter' | 'legend' | 'history' | 'settings' | null;
type ModalMode = 'create' | 'edit' | 'view' | null;

interface UIState {
  sidebarOpen: boolean;
  activePanel: PanelType;
  selectedNodeId: string | null;
  modalMode: ModalMode;
  cameraTarget: Position3D | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Actions
  toggleSidebar: () => void;
  setActivePanel: (panel: PanelType) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setModalMode: (mode: ModalMode) => void;
  setCameraTarget: (position: Position3D | null) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
  setError: (message: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activePanel: 'search',
  selectedNodeId: null,
  modalMode: null,
  cameraTarget: null,
  notification: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setActivePanel: (panel) => set({ activePanel: panel }),

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

  setModalMode: (mode) => set({ modalMode: mode }),

  setCameraTarget: (position) => set({ cameraTarget: position }),

  showNotification: (message, type) => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 5000);
  },

  clearNotification: () => set({ notification: null }),

  setError: (message) => {
    set({ notification: { message, type: 'error' } });
  },
}));