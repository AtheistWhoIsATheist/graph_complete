import { create } from 'zustand';
import { Node, Connection, Filters } from '@/types';
import * as api from '@/services/api';
import { db } from '@/services/database';

interface GraphState {
  nodes: Node[];
  connections: Connection[];
  filters: Filters;
  loading: boolean;
  error: string | null;

  // Actions
  loadNodes: () => Promise<void>;
  loadConnections: () => Promise<void>;
  addNode: (node: Node) => Promise<void>;
  updateNode: (node: Node) => Promise<void>;
  deleteNode: (nodeId: string) => Promise<void>;
  addConnection: (connection: Connection) => Promise<void>;
  deleteConnection: (connectionId: string) => Promise<void>;
  setFilters: (filters: Filters) => void;
  getVisibleNodes: () => Node[];
  syncWithBackend: () => Promise<void>;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  connections: [],
  filters: {
    categories: ['ontology', 'epistemology', 'ethics', 'mysticism', 'existentialism'],
    tags: [],
    dateRange: {},
  },
  loading: false,
  error: null,

  loadNodes: async () => {
    set({ loading: true, error: null });
    try {
      const nodes = await db.nodes.toArray();
      set({ nodes, loading: false });
    } catch (error) {
      console.error('Failed to load nodes:', error);
      set({ error: 'Failed to load nodes', loading: false });
    }
  },

  loadConnections: async () => {
    set({ loading: true, error: null });
    try {
      const connections = await db.connections.toArray();
      set({ connections, loading: false });
    } catch (error) {
      console.error('Failed to load connections:', error);
      set({ error: 'Failed to load connections', loading: false });
    }
  },

  addNode: async (node: Node) => {
    try {
      await db.nodes.add(node);
      set((state) => ({ nodes: [...state.nodes, node] }));

      // Sync to backend
      try {
        await api.createNode(node);
      } catch (error) {
        console.warn('Failed to sync node to backend:', error);
      }
    } catch (error) {
      console.error('Failed to add node:', error);
      throw error;
    }
  },

  updateNode: async (node: Node) => {
    try {
      await db.nodes.update(node.id, node);
      set((state) => ({
        nodes: state.nodes.map((n) => (n.id === node.id ? node : n)),
      }));

      // Sync to backend
      try {
        await api.updateNode(node.id, node);
      } catch (error) {
        console.warn('Failed to sync node update to backend:', error);
      }
    } catch (error) {
      console.error('Failed to update node:', error);
      throw error;
    }
  },

  deleteNode: async (nodeId: string) => {
    try {
      await db.nodes.delete(nodeId);
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== nodeId),
        connections: state.connections.filter(
          (c) => c.sourceId !== nodeId && c.targetId !== nodeId
        ),
      }));

      // Sync to backend
      try {
        await api.deleteNode(nodeId);
      } catch (error) {
        console.warn('Failed to sync node deletion to backend:', error);
      }
    } catch (error) {
      console.error('Failed to delete node:', error);
      throw error;
    }
  },

  addConnection: async (connection: Connection) => {
    try {
      await db.connections.add(connection);
      set((state) => ({ connections: [...state.connections, connection] }));

      // Sync to backend
      try {
        await api.createConnection(connection);
      } catch (error) {
        console.warn('Failed to sync connection to backend:', error);
      }
    } catch (error) {
      console.error('Failed to add connection:', error);
      throw error;
    }
  },

  deleteConnection: async (connectionId: string) => {
    try {
      await db.connections.delete(connectionId);
      set((state) => ({
        connections: state.connections.filter((c) => c.id !== connectionId),
      }));

      // Sync to backend
      try {
        await api.deleteConnection(connectionId);
      } catch (error) {
        console.warn('Failed to sync connection deletion to backend:', error);
      }
    } catch (error) {
      console.error('Failed to delete connection:', error);
      throw error;
    }
  },

  setFilters: (filters: Filters) => {
    set({ filters });
  },

  getVisibleNodes: () => {
    const { nodes, filters } = get();
    return nodes.filter((node) => {
      if (filters.categories.length > 0 && !filters.categories.includes(node.category)) {
        return false;
      }
      if (filters.tags.length > 0) {
        const hasTag = node.tags.some((tag) => filters.tags.includes(tag));
        if (!hasTag) return false;
      }
      if (filters.dateRange.start && node.createdAt < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && node.createdAt > filters.dateRange.end) {
        return false;
      }
      return true;
    });
  },

  syncWithBackend: async () => {
    try {
      const backendNodes = await api.getNodes();
      const backendConnections = await api.getConnections();

      // Merge with local data (backend takes precedence)
      await db.nodes.clear();
      await db.connections.clear();
      await db.nodes.bulkAdd(backendNodes);
      await db.connections.bulkAdd(backendConnections);

      set({ nodes: backendNodes, connections: backendConnections });
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  },
}));