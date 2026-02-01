import { Node, Connection } from '@/types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Nodes
export async function getNodes(): Promise<Node[]> {
  return fetchAPI('/api/nodes');
}

export async function getNode(id: string): Promise<Node> {
  return fetchAPI(`/api/nodes/${id}`);
}

export async function createNode(node: Node): Promise<Node> {
  return fetchAPI('/api/nodes', {
    method: 'POST',
    body: JSON.stringify(node),
  });
}

export async function updateNode(id: string, node: Partial<Node>): Promise<Node> {
  return fetchAPI(`/api/nodes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(node),
  });
}

export async function deleteNode(id: string): Promise<void> {
  return fetchAPI(`/api/nodes/${id}`, {
    method: 'DELETE',
  });
}

// Connections
export async function getConnections(): Promise<Connection[]> {
  return fetchAPI('/api/connections');
}

export async function createConnection(connection: Connection): Promise<Connection> {
  return fetchAPI('/api/connections', {
    method: 'POST',
    body: JSON.stringify(connection),
  });
}

export async function deleteConnection(id: string): Promise<void> {
  return fetchAPI(`/api/connections/${id}`, {
    method: 'DELETE',
  });
}

// AI Services
export async function getSimilarNodes(nodeId: string, threshold: number = 0.65): Promise<any> {
  return fetchAPI(`/api/ai/similar/${nodeId}?threshold=${threshold}`);
}

export async function suggestPlacement(nodeData: any): Promise<any> {
  return fetchAPI('/api/ai/placement', {
    method: 'POST',
    body: JSON.stringify(nodeData),
  });
}