import Fuse from 'fuse.js';
import { Node, SearchResult } from '@/types';

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
};

export function searchNodes(nodes: Node[], query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const fuse = new Fuse(nodes, fuseOptions);
  const results = fuse.search(query);

  return results.map((result) => ({
    item: result.item,
    score: 1 - (result.score || 0),
    matches: result.matches?.map((m) => m.key || '') || [],
  }));
}

export function filterNodesByCategory(nodes: Node[], categories: string[]): Node[] {
  if (categories.length === 0) return nodes;
  return nodes.filter((node) => categories.includes(node.category));
}

export function filterNodesByTags(nodes: Node[], tags: string[]): Node[] {
  if (tags.length === 0) return nodes;
  return nodes.filter((node) => node.tags.some((tag) => tags.includes(tag)));
}

export function sortNodesByRelevance(nodes: Node[], searchResults: SearchResult[]): Node[] {
  const scoreMap = new Map(searchResults.map((r) => [r.item.id, r.score]));
  return [...nodes].sort((a, b) => {
    const scoreA = scoreMap.get(a.id) || 0;
    const scoreB = scoreMap.get(b.id) || 0;
    return scoreB - scoreA;
  });
}