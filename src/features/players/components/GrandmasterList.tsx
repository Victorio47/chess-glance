'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchGMs } from '@/features/players/api/fetchGMs';
import Loader from '@/shared/ui/Loader';
import Link from 'next/link';

interface GMList {
  players: string[];
}

const GrandmasterList: React.FC = () => {
  const [gms, setGMs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadGMs = async () => {
      try {
        console.log('Loading GMs...');
        const data: GMList = await fetchGMs();
        console.log('GMs loaded:', data);
        setGMs(data.players || []);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading GMs:', err);
        setError(err.message || 'Failed to load grandmasters');
        setLoading(false);
      }
    };

    loadGMs();
  }, []);

  // Memoized filtered results
  const filteredGMs = useMemo(() => {
    if (!debouncedQuery.trim()) return gms;
    
    const query = debouncedQuery.toLowerCase();
    return gms.filter(username => 
      username.toLowerCase().includes(query)
    );
  }, [gms, debouncedQuery]);

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
            Found {filteredGMs.length} of {gms.length} grandmasters
          </div>
        )}
      </div>

      {/* Results */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {filteredGMs && filteredGMs.length > 0 ? (
          filteredGMs.map((username) => (
            <li key={username} className="bg-white dark:bg-gray-800 rounded shadow p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <Link href={`/profile/${username}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {username}
              </Link>
            </li>
          ))
        ) : (
          <li className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
            {searchQuery ? 'No grandmasters found matching your search' : 'No grandmasters found'}
          </li>
        )}
      </ul>
    </div>
  );
};

export default GrandmasterList;
