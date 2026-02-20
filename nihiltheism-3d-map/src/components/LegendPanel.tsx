

const CATEGORY_COLORS = [
  { category: 'ontology', color: '#FF6B6B', description: 'Being and existence' },
  { category: 'epistemology', color: '#4ECDC4', description: 'Knowledge and belief' },
  { category: 'ethics', color: '#45B7D1', description: 'Morality and values' },
  { category: 'mysticism', color: '#9B59B6', description: 'Transcendent experience' },
  { category: 'existentialism', color: '#F39C12', description: 'Human existence' },
];

const CONNECTION_TYPES = [
  { type: 'supports', color: '#2ECC71', description: 'Reinforces or validates' },
  { type: 'contradicts', color: '#E74C3C', description: 'Opposes or refutes' },
  { type: 'relates', color: '#3498DB', description: 'Connected or similar' },
  { type: 'extends', color: '#9B59B6', description: 'Builds upon' },
  { type: 'questions', color: '#F39C12', description: 'Challenges or probes' },
];

export function LegendPanel() {
  return (
    <div className="legend-panel">
      <div className="legend-header">
        <h3>Legend</h3>
      </div>

      <div className="legend-section">
        <h4>Node Categories</h4>
        <div className="legend-items">
          {CATEGORY_COLORS.map((item) => (
            <div key={item.category} className="legend-item">
              <div
                className="legend-color-box"
                style={{ backgroundColor: item.color }}
              />
              <div className="legend-text">
                <div className="legend-label">{item.category}</div>
                <div className="legend-description">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="legend-section">
        <h4>Connection Types</h4>
        <div className="legend-items">
          {CONNECTION_TYPES.map((item) => (
            <div key={item.type} className="legend-item">
              <div
                className="legend-line"
                style={{ backgroundColor: item.color }}
              />
              <div className="legend-text">
                <div className="legend-label">{item.type}</div>
                <div className="legend-description">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="legend-section">
        <h4>Controls</h4>
        <div className="legend-controls">
          <div className="legend-control-item">
            <strong>Left Click + Drag:</strong> Rotate view
          </div>
          <div className="legend-control-item">
            <strong>Right Click + Drag:</strong> Pan view
          </div>
          <div className="legend-control-item">
            <strong>Scroll:</strong> Zoom in/out
          </div>
          <div className="legend-control-item">
            <strong>Click Node:</strong> Select and view details
          </div>
        </div>
      </div>
    </div>
  );
}