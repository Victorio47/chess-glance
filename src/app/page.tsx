'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useGrandmasters } from '@/features/players/context/GrandmastersContext';

export default function HomePage() {
  const { loadGrandmasters } = useGrandmasters();

  // Preload grandmasters data when user visits home page
  useEffect(() => {
    loadGrandmasters();
  }, [loadGrandmasters]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Chess Glance</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        Explore chess grandmasters and their profiles
      </p>
      <Link 
        href="/players" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        View Grandmasters
      </Link>
    </main>
  );
} 