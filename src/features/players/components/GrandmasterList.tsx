'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useGrandmasters } from '../context/GrandmastersContext';
import Loader from '@/shared/ui/Loader';

const GrandmasterList: React.FC = () => {
  const { grandmasters, isLoading, error, isPreloaded, loadGrandmasters } = useGrandmasters();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  // Get visible items based on search or pagination
  const visibleGMs = useMemo(() => {
    if (debouncedQuery.trim()) {
      // Show all search results immediately
      return filteredGMs;
    }
    // Show paginated results
    return filteredGMs.slice(0, visibleCount);
  }, [filteredGMs, debouncedQuery, visibleCount]);

  // Reset visible count when search changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setVisibleCount(30); // Reset for new search
    }
  }, [debouncedQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || debouncedQuery.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleCount < filteredGMs.length) {
          setVisibleCount(prev => Math.min(prev + 30, filteredGMs.length));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredGMs.length, debouncedQuery]);

  // Memoized search input handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

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
        {!searchQuery && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Showing {visibleGMs.length} of {filteredGMs.length} grandmasters
          </div>
        )}
      </div>

      {/* Scrollable Grid Container */}
      <div 
        ref={scrollContainerRef}
        className="max-h-[600px] overflow-y-auto p-2 rounded border border-gray-200 dark:border-gray-700"
      >
        {visibleGMs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-200">
              {visibleGMs.map((username) => (
                <div 
                  key={username}
                  className="bg-white dark:bg-gray-800 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 
                             transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700
                             min-h-[60px] flex items-center justify-center"
                >
                  <a 
                    href={`/profile/${username}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-center px-4 py-3 w-full h-full flex items-center justify-center"
                  >
                    {username}
                  </a>
                </div>
              ))}
            </div>
            
            {/* Load More Trigger */}
            {!debouncedQuery.trim() && visibleCount < filteredGMs.length && (
              <div 
                ref={loadMoreRef}
                className="flex justify-center py-4"
              >
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Loading more...
                </div>
              </div>
            )}
          </>
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