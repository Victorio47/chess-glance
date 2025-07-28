'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { fetchGMs } from '@/features/players/api/fetchGMs';
import Loader from '@/shared/ui/Loader';
import Link from 'next/link';

interface GMList {
  players: string[];
}

const ITEM_HEIGHT = 60;
const INITIAL_ITEMS = 50;
const ITEMS_PER_PAGE = 20;

const GrandmasterList: React.FC = () => {
  const [allGMs, setAllGMs] = useState<string[]>([]);
  const [displayedGMs, setDisplayedGMs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on search
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

  // Filter and paginate results
  const filteredGMs = useMemo(() => {
    if (!debouncedQuery.trim()) return displayedGMs;
    
    const query = debouncedQuery.toLowerCase();
    return allGMs.filter(username => 
      username.toLowerCase().includes(query)
    );
  }, [allGMs, displayedGMs, debouncedQuery]);

  // Load more items
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    const startIndex = displayedGMs.length;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = allGMs.slice(startIndex, endIndex);
    
    setDisplayedGMs(prev => [...prev, ...newItems]);
    setHasMore(endIndex < allGMs.length);
    setCurrentPage(prev => prev + 1);
  }, [allGMs, displayedGMs.length, hasMore, loading]);

  // Memoized search input handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Virtualized row renderer
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const username = filteredGMs[index];
    if (!username) return null;

    return (
      <div style={style} className="px-2">
        <div className="bg-white dark:bg-gray-800 rounded shadow p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition h-full">
          <Link href={`/profile/${username}`} className="text-blue-600 dark:text-blue-400 hover:underline block">
            {username}
          </Link>
        </div>
      </div>
    );
  }, [filteredGMs]);

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

      {/* Virtualized List */}
      {filteredGMs.length > 0 ? (
        <div className="h-[600px]">
          <List
            height={600}
            itemCount={filteredGMs.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
            itemData={filteredGMs}
          >
            {Row}
          </List>
          
          {/* Load More Button */}
          {!searchQuery && hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          {searchQuery ? 'No grandmasters found matching your search' : 'No grandmasters found'}
        </div>
      )}
    </div>
  );
};

export default GrandmasterList;
