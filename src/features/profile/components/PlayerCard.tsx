import React from 'react';

export interface PlayerCardProps {
  username: string;
  avatar?: string;
  name?: string;
  country?: string;
  last_online?: number;
  joined?: number;
  status?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  username,
  avatar,
  name,
  country,
  last_online,
  joined,
  status,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col items-center max-w-xs mx-auto">
      {avatar && (
        <img
          src={avatar}
          alt={username}
          className="w-24 h-24 rounded-full mb-2 border"
        />
      )}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{name || username}</h2>
      <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">@{username}</div>
      {country && (
        <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Country: {country.split('/').pop() || country}</div>
      )}
      {status && (
        <div className="text-xs mb-1 text-gray-700 dark:text-gray-300">Status: <span className="font-medium">{status}</span></div>
      )}
      {joined && (
        <div className="text-xs text-gray-500 dark:text-gray-400">On Chess.com since {new Date(joined * 1000).toLocaleDateString()}</div>
      )}
    </div>
  );
};

export default PlayerCard; 