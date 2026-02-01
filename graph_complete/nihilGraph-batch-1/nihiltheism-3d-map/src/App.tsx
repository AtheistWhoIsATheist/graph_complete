import React, { useEffect } from 'react';
import { Scene3D } from './components/Scene3D';
import { Sidebar } from './components/Sidebar';
import { NodeModal } from './components/NodeModal';
import { useGraphStore } from './store/graphStore';
import { useUIStore } from './store/uiStore';
import { initializeDatabase } from './services/database';

function App() {
  const loadNodes = useGraphStore((state) => state.loadNodes);
  const loadConnections = useGraphStore((state) => state.loadConnections);
  const setError = useUIStore((state) => state.setError);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        await loadNodes();
        await loadConnections();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setError('Failed to load application data');
      }
    };

    initialize();
  }, [loadNodes, loadConnections, setError]);

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Scene3D />
      </main>
      <NodeModal />
    </div>
  );
}

export default App;