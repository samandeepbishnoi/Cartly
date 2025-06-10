import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ProductFilters() {
  const { state, dispatch } = useApp();

  // Get all unique tags from products
  const allTags = Array.from(
    new Set(
      state.products.flatMap((product) => product.tags)
    )
  ).sort();

  const toggleTag = (tag: string) => {
    const newSelectedTags = state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag];
    
    dispatch({ type: 'SET_SELECTED_TAGS', payload: newSelectedTags });
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: [] });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  const hasActiveFilters = state.selectedTags.length > 0 || state.searchQuery.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Active Filters:
          </h4>
          <div className="flex flex-wrap gap-2">
            {state.searchQuery && (
              <Badge variant="info\" className="flex items-center space-x-1">
                <span>Search: "{state.searchQuery}"</span>
                <button
                  onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {state.selectedTags.map((tag) => (
              <Badge key={tag} variant="success" className="flex items-center space-x-1">
                <span>{tag}</span>
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      {allTags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Filter by Category:
          </h4>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  state.selectedTags.includes(tag)
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-200'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}