'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { fetchGMs } from '@/features/players/api/fetchGMs';
import Loader from '@/shared/ui/Loader';
import Link from 'next/link';

interface GMList {
  players: string[];
}

const INITIAL_ITEMS = 50;
const ITEMS_PER_PAGE = 20;

const GrandmasterList: React.FC = () => {
  const [allGMs, setAllGMs] = useState<string[]>([]);
  const [displayedGMs, setDisplayedGMs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load initial data
  useEffect(() => {
    const loadGMs = async () => {
      try {
        console.log('Loading GMs...');
        const data: GMList = await fetchGMs();
        console.log('GMs loaded:', data);
        const players = data.players || [];
        setAllGMs(players);
        setDisplayedGMs(players.slice(0, INITIAL_ITEMS));
        setHasMore(players.length > INITIAL_ITEMS);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading GMs:', err);
        setError(err.message || 'Failed to load grandmasters');
        setLoading(false);
      }
    };

    loadGMs();
  }, []);

  // Auto-load more on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isLoadingMore || searchQuery) return;

      const container = containerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom) {
        loadMore();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, isLoadingMore, searchQuery]);

  // Filter results
  const filteredGMs = useMemo(() => {
    if (!debouncedQuery.trim()) return displayedGMs;
    
    const query = debouncedQuery.toLowerCase();
    return allGMs.filter(username => 
      username.toLowerCase().includes(query)
    );
  }, [allGMs, displayedGMs, debouncedQuery]);

  // Load more items
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const startIndex = displayedGMs.length;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = allGMs.slice(startIndex, endIndex);
    
    setDisplayedGMs(prev => [...prev, ...newItems]);
    setHasMore(endIndex < allGMs.length);
    setIsLoadingMore(false);
  }, [allGMs, displayedGMs.length, hasMore, isLoadingMore]);

  // Memoized search input handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

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
            Found {filteredGMs.length} of {allGMs.length} grandmasters
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div 
        ref={containerRef}
        className="h-[600px] overflow-y-auto pr-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}
      >
        {filteredGMs.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {filteredGMs.map((username) => (
              <li key={username} className="bg-white dark:bg-gray-800 rounded shadow p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Link href={`/profile/${username}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {username}
                </Link>
              </li>
            ))}
            {isLoadingMore && (
              <li className="col-span-full text-center py-4">
                <Loader />
              </li>
            )}
          </ul>
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
