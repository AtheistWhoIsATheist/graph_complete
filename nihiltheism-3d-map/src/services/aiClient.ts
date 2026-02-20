import { Position3D } from '@/types';

const AI_BASE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8001';

async function fetchAI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${AI_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`AI service request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function generateEmbedding(nodeId: string, text: string, category: string) {
  return fetchAI('/embeddings', {
    method: 'POST',
    body: JSON.stringify({ nodeId, text, category }),
  });
}

export async function calculateSimilarities(
  sourceNodeId: string,
  targetNodeIds: string[],
  threshold: number = 0.65
) {
  return fetchAI('/similarity', {
    method: 'POST',
    body: JSON.stringify({ sourceNodeId, targetNodeIds, threshold }),
  });
}

export async function calculateOptimalPlacement(
  newNode: { id: string; category: string; title: string; description: string },
  existingNodes: Array<{ id: string; category: string; position: Position3D }>,
  learningRate: number = 0.05,
  maxIterations: number = 100
) {
  return fetchAI('/placement', {
    method: 'POST',
    body: JSON.stringify({
      newNode,
      existingNodes,
      learningRate,
      maxIterations,
    }),
  });
}

export async function checkAIHealth() {
  return fetchAI('/health');
}