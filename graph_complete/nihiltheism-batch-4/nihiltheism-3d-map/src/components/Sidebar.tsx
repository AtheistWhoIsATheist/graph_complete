import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { SearchPanel } from './SearchPanel';
import { FilterPanel } from './FilterPanel';
import { LegendPanel } from './LegendPanel';
import { HistoryPanel } from './HistoryPanel';
import { SettingsPanel } from './SettingsPanel';

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const activePanel = useUIStore((state) => state.activePanel);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setActivePanel = useUIStore((state) => state.setActivePanel);

  const panels = [
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'filter', icon: '🌪️', label: 'Filter' },
    { id: 'legend', icon: '🗺️', label: 'Legend' },
    { id: 'history', icon: '🕒', label: 'History' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ] as const;

  return (
    <aside className={`sidebar ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      <div className="sidebar-tabs">
        {panels.map((panel) => (
          <button
            key={panel.id}
            className={`sidebar-tab ${activePanel === panel.id ? 'active' : ''}`}
            onClick={() => setActivePanel(panel.id)}
            title={panel.label}
          >
            <span className="sidebar-tab-icon">{panel.icon}</span>
            <span className="sidebar-tab-label">{panel.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-content">
        {activePanel === 'search' && <SearchPanel />}
        {activePanel === 'filter' && <FilterPanel />}
        {activePanel === 'legend' && <LegendPanel />}
        {activePanel === 'history' && <HistoryPanel />}
        {activePanel === 'settings' && <SettingsPanel />}
        {!activePanel && (
          <div className="sidebar-placeholder">
            <p>Select a tool from the tabs above</p>
          </div>
        )}
      </div>
    </aside>
  );
}