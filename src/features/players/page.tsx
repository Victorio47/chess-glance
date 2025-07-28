import React from 'react';
import GrandmasterList from '@/features/players/components/GrandmasterList';

const PlayersPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Chess.com Grandmasters List</h1>
      <GrandmasterList />
    </div>
  );
};

export default PlayersPage; 