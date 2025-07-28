'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useGrandmasters } from '../context/GrandmastersContext';
import Loader from '@/shared/ui/Loader';
import Card from '@/shared/ui/Card';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

const GrandmasterList: React.FC = () => {
  const { grandmasters, isLoading, error, loadGrandmasters } = useGrandmasters();
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load data on mount
  useEffect(() => {
    if (grandmasters.length === 0 && !isLoading) {
      loadGrandmasters();
    }
  }, [grandmasters.length, isLoading, loadGrandmasters]);

  // Simple filtering
  const filteredGMs = useMemo(() => {
    if (!searchQuery.trim()) return grandmasters;
    return grandmasters.filter((gm) => 
      gm.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [grandmasters, searchQuery]);

  // Get visible items based on search or pagination
  const visibleGMs = useMemo(() => {
    if (searchQuery.trim()) {
      // Show all search results immediately
      return filteredGMs;
    }
    // Show paginated results
    return filteredGMs.slice(0, visibleCount);
  }, [filteredGMs, searchQuery, visibleCount]);

  // Reset visible count when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setVisibleCount(30);
    }
  }, [searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || searchQuery.trim()) return;

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
  }, [visibleCount, filteredGMs.length, searchQuery]);

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
        <Button onClick={loadGrandmasters}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-6">
        <Input
          placeholder="Search grandmasters..."
          value={searchQuery}
          onChange={handleSearchChange}
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
      <div className="max-h-[600px] overflow-y-auto p-4 rounded">
        {visibleGMs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-200">
              {visibleGMs.map((username) => (
                <Card 
                  key={username}
                  className="min-h-[60px] flex items-center justify-center cursor-pointer"
                >
                  <a 
                    href={`/profile/${username}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-center px-4 py-3 w-full h-full flex items-center justify-center"
                  >
                    {username}
                  </a>
                </Card>
              ))}
            </div>
            
            {/* Load More Trigger */}
            {!searchQuery.trim() && visibleCount < filteredGMs.length && (
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