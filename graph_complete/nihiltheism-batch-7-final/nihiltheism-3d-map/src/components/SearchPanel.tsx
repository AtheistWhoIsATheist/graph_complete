import React, { useState, useEffect } from 'react';
import { useGraphStore } from '@/store/graphStore';
import { useUIStore } from '@/store/uiStore';
import { searchNodes } from '@/utils/search';
import { debounce } from '@/utils/debounce';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const nodes = useGraphStore((state) => state.nodes);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const setCameraTarget = useUIStore((state) => state.setCameraTarget);

  const debouncedSearch = debounce((searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    const searchResults = searchNodes(nodes, searchQuery);
    setResults(searchResults);
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const handleResultClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(nodeId);
      setCameraTarget(node.position);
    }
  };

  return (
    <div className="search-panel">
      <div className="search-header">
        <h3>Search Nodes</h3>
      </div>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, description, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
          >
            ✕
          </button>
        )}
      </div>
      <div className="search-results">
        {query.length < 2 && (
          <div className="search-hint">Type at least 2 characters to search</div>
        )}
        {query.length >= 2 && results.length === 0 && (
          <div className="search-no-results">No results found</div>
        )}
        {results.map((result) => (
          <div
            key={result.item.id}
            className="search-result-item"
            onClick={() => handleResultClick(result.item.id)}
          >
            <div className="search-result-title">{result.item.title}</div>
            <div className="search-result-category">{result.item.category}</div>
            <div className="search-result-description">
              {result.item.description.substring(0, 100)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}