'use client';

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchGMs()
      .then((data: GMList) => {
        setGMs(data.players || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {gms && gms.length > 0 ? (
          gms.map((username) => (
            <li key={username} className="bg-white rounded shadow p-2 hover:bg-gray-50 transition">
              <Link href={`/profile/${username}`} className="text-blue-600 hover:underline">
                {username}
              </Link>
            </li>
          ))
        ) : (
          <li className="col-span-full text-center text-gray-500">No grandmasters found</li>
        )}
      </ul>
    </div>
  );
};

export default GrandmasterList;
