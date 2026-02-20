
import { useSettingsStore } from '@/store/settingsStore';

export function SettingsPanel() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Settings</h3>
      </div>

      <div className="settings-section">
        <h4>Display</h4>
        <label className="settings-option">
          <input
            type="checkbox"
            checked={settings.display.showLabels}
            onChange={(e) =>
              updateSettings({
                display: { ...settings.display, showLabels: e.target.checked },
              })
            }
          />
          <span>Show all node labels</span>
        </label>
        <label className="settings-option">
          <input
            type="checkbox"
            checked={settings.display.showConnections}
            onChange={(e) =>
              updateSettings({
                display: {
                  ...settings.display,
                  showConnections: e.target.checked,
                },
              })
            }
          />
          <span>Show connections</span>
        </label>
        <label className="settings-option">
          <input
            type="checkbox"
            checked={settings.display.showGrid}
            onChange={(e) =>
              updateSettings({
                display: { ...settings.display, showGrid: e.target.checked },
              })
            }
          />
          <span>Show grid</span>
        </label>
      </div>

      <div className="settings-section">
        <h4>Performance</h4>
        <label className="settings-label">
          Max visible nodes: {settings.performance.maxVisibleNodes}
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={settings.performance.maxVisibleNodes}
          onChange={(e) =>
            updateSettings({
              performance: {
                ...settings.performance,
                maxVisibleNodes: parseInt(e.target.value),
              },
            })
          }
        />
        <label className="settings-label">
          Target FPS: {settings.performance.targetFPS}
        </label>
        <input
          type="range"
          min="30"
          max="144"
          step="1"
          value={settings.performance.targetFPS}
          onChange={(e) =>
            updateSettings({
              performance: {
                ...settings.performance,
                targetFPS: parseInt(e.target.value),
              },
            })
          }
        />
      </div>

      <div className="settings-section">
        <h4>AI Suggestions</h4>
        <label className="settings-option">
          <input
            type="checkbox"
            checked={settings.ai.enableSuggestions}
            onChange={(e) =>
              updateSettings({
                ai: { ...settings.ai, enableSuggestions: e.target.checked },
              })
            }
          />
          <span>Enable AI-powered suggestions</span>
        </label>
        <label className="settings-label">
          Similarity threshold: {settings.ai.similarityThreshold}
        </label>
        <input
          type="range"
          min="0.3"
          max="0.95"
          step="0.05"
          value={settings.ai.similarityThreshold}
          onChange={(e) =>
            updateSettings({
              ai: {
                ...settings.ai,
                similarityThreshold: parseFloat(e.target.value),
              },
            })
          }
        />
      </div>

      <div className="settings-section">
        <h4>Data Management</h4>
        <button className="btn btn-secondary btn-full-width">
          Export Graph Data
        </button>
        <button className="btn btn-secondary btn-full-width">
          Import Graph Data
        </button>
        <button className="btn btn-danger btn-full-width">
          Clear All Data
        </button>
      </div>
    </div>
  );
}