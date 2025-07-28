import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Chess Glance</h1>
      <p className="mb-8 text-gray-600">Quickly browse Chess.com Grandmasters and their profiles</p>
      <Link href="/players">
        <span className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition cursor-pointer font-semibold">Grandmasters List</span>
      </Link>
    </main>
  );
};

export default HomePage; 