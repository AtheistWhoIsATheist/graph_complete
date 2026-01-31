import React, { useEffect, useState } from 'react';
import { useGraphStore } from '@/store/graphStore';
import { useUIStore } from '@/store/uiStore';
import { Node, Connection } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function NodeModal() {
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const modalMode = useUIStore((state) => state.modalMode);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setModalMode = useUIStore((state) => state.setModalMode);

  const nodes = useGraphStore((state) => state.nodes);
  const addNode = useGraphStore((state) => state.addNode);
  const updateNode = useGraphStore((state) => state.updateNode);
  const deleteNode = useGraphStore((state) => state.deleteNode);
  const connections = useGraphStore((state) => state.connections);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const [formData, setFormData] = useState<Partial<Node>>({
    title: '',
    description: '',
    category: 'ontology',
    tags: [],
  });

  useEffect(() => {
    if (selectedNode && modalMode === 'edit') {
      setFormData(selectedNode);
    } else if (modalMode === 'create') {
      setFormData({
        title: '',
        description: '',
        category: 'ontology',
        tags: [],
        position: { x: 0, y: 0, z: 0 },
      });
    }
  }, [selectedNode, modalMode]);

  if (!modalMode) return null;

  const handleClose = () => {
    setModalMode(null);
    setSelectedNode(null);
  };

  const handleSave = async () => {
    if (modalMode === 'create') {
      const newNode: Node = {
        id: uuidv4(),
        title: formData.title || 'Untitled',
        description: formData.description || '',
        category: formData.category || 'ontology',
        tags: formData.tags || [],
        position: formData.position || { x: 0, y: 0, z: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await addNode(newNode);
    } else if (modalMode === 'edit' && selectedNode) {
      const updatedNode: Node = {
        ...selectedNode,
        ...formData,
        updatedAt: new Date(),
      };
      await updateNode(updatedNode);
    }
    handleClose();
  };

  const handleDelete = async () => {
    if (selectedNode && window.confirm('Delete this node?')) {
      await deleteNode(selectedNode.id);
      handleClose();
    }
  };

  const connectedNodes = connections
    .filter(
      (c) => c.sourceId === selectedNodeId || c.targetId === selectedNodeId
    )
    .map((c) => {
      const otherId =
        c.sourceId === selectedNodeId ? c.targetId : c.sourceId;
      return nodes.find((n) => n.id === otherId);
    })
    .filter(Boolean);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modalMode === 'create' ? 'Create Node' : 'Edit Node'}</h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category || 'ontology'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Node['category'],
                })
              }
            >
              <option value="ontology">Ontology</option>
              <option value="epistemology">Epistemology</option>
              <option value="ethics">Ethics</option>
              <option value="mysticism">Mysticism</option>
              <option value="existentialism">Existentialism</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((t) => t.trim()),
                })
              }
            />
          </div>

          {modalMode === 'edit' && connectedNodes.length > 0 && (
            <div className="form-group">
              <label>Connected Nodes ({connectedNodes.length})</label>
              <ul className="connected-nodes-list">
                {connectedNodes.map((node) => (
                  <li key={node!.id}>{node!.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          {modalMode === 'edit' && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}