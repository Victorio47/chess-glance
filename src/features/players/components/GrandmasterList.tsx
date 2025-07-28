'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useGrandmasters } from '../context/GrandmastersContext';
import Loader from '@/shared/ui/Loader';

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: string[];
}

const GrandmasterList: React.FC = () => {
  const { grandmasters, isLoading, error, isPreloaded, loadGrandmasters } = useGrandmasters();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const listRef = useRef<List>(null);

  // Load data if not preloaded
  useEffect(() => {
    if (!isPreloaded && !isLoading) {
      loadGrandmasters();
    }
  }, [isPreloaded, isLoading, loadGrandmasters]);

  // Create optimized search index
  const searchIndex = useMemo(() => {
    return grandmasters.reduce((acc, username, index) => {
      const lowerUsername = username.toLowerCase();
      // Create prefixes for instant search
      for (let i = 1; i <= Math.min(lowerUsername.length, 10); i++) {
        const prefix = lowerUsername.substring(0, i);
        if (!acc[prefix]) acc[prefix] = [];
        acc[prefix].push(index);
      }
      return acc;
    }, {} as Record<string, number[]>);
  }, [grandmasters]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200); // Reduced debounce time for better UX

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Optimized filtering with search index
  const filteredGMs = useMemo(() => {
    if (!debouncedQuery.trim()) return grandmasters;
    
    const query = debouncedQuery.toLowerCase();
    
    // Use search index for instant prefix matches
    const matchingIndices = searchIndex[query] || [];
    const prefixMatches = matchingIndices.map(index => grandmasters[index]);
    
    // Also check for partial matches (for non-prefix searches)
    const partialMatches = grandmasters.filter(username => 
      username.toLowerCase().includes(query) && 
      !matchingIndices.includes(grandmasters.indexOf(username))
    );
    
    return [...new Set([...prefixMatches, ...partialMatches])];
  }, [grandmasters, debouncedQuery, searchIndex]);

  // Memoized search input handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Row renderer for virtualized list
  const Row = useCallback(({ index, style, data }: RowProps) => {
    const username = data[index];
    return (
      <div style={style} className="px-2">
        <div className="bg-white dark:bg-gray-800 rounded shadow p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <a 
            href={`/profile/${username}`}
            className="text-blue-600 dark:text-blue-400 hover:underline block"
          >
            {username}
          </a>
        </div>
      </div>
    );
  }, []);

  // Scroll to top when search changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  }, [debouncedQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading {grandmasters.length > 0 ? 'search results' : 'grandmasters'}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={loadGrandmasters}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search grandmasters..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
        />
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Found {filteredGMs.length} of {grandmasters.length} grandmasters
          </div>
        )}
      </div>

      {/* Virtualized Results */}
      <div className="h-[600px]">
        {filteredGMs.length > 0 ? (
          <List
            ref={listRef}
            height={600}
            itemCount={filteredGMs.length}
            itemSize={50}
            itemData={filteredGMs}
            width="100%"
            className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            overscanCount={5} // Pre-render 5 items above/below viewport
          >
            {Row}
          </List>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {searchQuery ? 'No grandmasters found matching your search' : 'No grandmasters found'}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrandmasterList; 