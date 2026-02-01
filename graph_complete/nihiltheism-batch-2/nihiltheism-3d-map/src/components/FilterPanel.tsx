import React from 'react';
import { useGraphStore } from '@/store/graphStore';

export function FilterPanel() {
  const filters = useGraphStore((state) => state.filters);
  const setFilters = useGraphStore((state) => state.setFilters);

  const categories = ['ontology', 'epistemology', 'ethics', 'mysticism', 'existentialism'];

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const toggleAllCategories = () => {
    if (filters.categories.length === categories.length) {
      setFilters({ ...filters, categories: [] });
    } else {
      setFilters({ ...filters, categories: [...categories] });
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="btn btn-sm" onClick={toggleAllCategories}>
          {filters.categories.length === categories.length ? 'Clear All' : 'Select All'}
        </button>
      </div>

      <div className="filter-section">
        <h4>Categories</h4>
        <div className="filter-options">
          {categories.map((category) => (
            <label key={category} className="filter-option">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <span className="filter-label">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Date Range</h4>
        <div className="filter-date-inputs">
          <input
            type="date"
            value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, start: new Date(e.target.value) },
              })
            }
          />
          <span>to</span>
          <input
            type="date"
            value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: new Date(e.target.value) },
              })
            }
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Search by Tag</h4>
        <input
          type="text"
          className="filter-input"
          placeholder="Enter tag name..."
          value={filters.tags.join(', ')}
          onChange={(e) =>
            setFilters({
              ...filters,
              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
            })
          }
        />
      </div>

      <button
        className="btn btn-secondary btn-full-width"
        onClick={() =>
          setFilters({
            categories: [...categories],
            tags: [],
            dateRange: {},
          })
        }
      >
        Reset Filters
      </button>
    </div>
  );
}