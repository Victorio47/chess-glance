'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchGMs } from '@/features/players/api/fetchGMs';
import Loader from '@/shared/ui/Loader';
import Link from 'next/link';

interface GMList {
  players: string[];
}

const GrandmasterList: React.FC = () => {
  const [allGMs, setAllGMs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Create search index for faster filtering
  const searchIndex = useMemo(() => {
    return allGMs.reduce((acc, username, index) => {
      const lowerUsername = username.toLowerCase();
      // Create prefixes for faster search
      for (let i = 1; i <= lowerUsername.length; i++) {
        const prefix = lowerUsername.substring(0, i);
        if (!acc[prefix]) acc[prefix] = [];
        acc[prefix].push(index);
      }
      return acc;
    }, {} as Record<string, number[]>);
  }, [allGMs]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load all data
  useEffect(() => {
    const loadGMs = async () => {
      try {
        console.log('Loading GMs...');
        const data: GMList = await fetchGMs();
        console.log('GMs loaded:', data);
        const players = data.players || [];
        setAllGMs(players);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading GMs:', err);
        setError(err.message || 'Failed to load grandmasters');
        setLoading(false);
      }
    };

    loadGMs();
  }, []);

  // Optimized filtering with search index
  const filteredGMs = useMemo(() => {
    if (!debouncedQuery.trim()) return allGMs;
    
    const query = debouncedQuery.toLowerCase();
    
    // Use search index for faster filtering
    const matchingIndices = searchIndex[query] || [];
    const allMatchingUsernames = matchingIndices.map(index => allGMs[index]);
    
    // Also check for partial matches
    const partialMatches = allGMs.filter(username => 
      username.toLowerCase().includes(query) && 
      !matchingIndices.includes(allGMs.indexOf(username))
    );
    
    return [...new Set([...allMatchingUsernames, ...partialMatches])];
  }, [allGMs, debouncedQuery, searchIndex]);

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
