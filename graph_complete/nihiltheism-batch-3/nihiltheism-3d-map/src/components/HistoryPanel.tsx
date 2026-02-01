import React from 'react';
import { useGraphStore } from '@/store/graphStore';
import { useUIStore } from '@/store/uiStore';
import { formatDistanceToNow } from 'date-fns';

export function HistoryPanel() {
  const nodes = useGraphStore((state) => state.nodes);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setCameraTarget = useUIStore((state) => state.setCameraTarget);

  const recentNodes = [...nodes]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 20);

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(nodeId);
      setCameraTarget(node.position);
    }
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Recent Activity</h3>
      </div>

      <div className="history-list">
        {recentNodes.length === 0 && (
          <div className="history-empty">No recent activity</div>
        )}
        {recentNodes.map((node) => (
          <div
            key={node.id}
            className="history-item"
            onClick={() => handleNodeClick(node.id)}
          >
            <div className="history-item-header">
              <div className="history-item-title">{node.title}</div>
              <div className="history-item-time">
                {formatDistanceToNow(node.updatedAt, { addSuffix: true })}
              </div>
            </div>
            <div className="history-item-category">{node.category}</div>
            <div className="history-item-action">
              {node.createdAt.getTime() === node.updatedAt.getTime()
                ? 'Created'
                : 'Updated'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}