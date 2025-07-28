import React from 'react';
import GrandmasterList from '@/features/players/components/GrandmasterList';

const PlayersPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Chess.com Grandmasters List</h1>
      <GrandmasterList />
    </div>
  );
};

export default PlayersPage; 