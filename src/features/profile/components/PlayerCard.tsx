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
    <div className="bg-white rounded shadow p-4 flex flex-col items-center max-w-xs mx-auto">
      {avatar && (
        <img
          src={avatar}
          alt={username}
          className="w-24 h-24 rounded-full mb-2 border"
        />
      )}
      <h2 className="text-lg font-bold">{name || username}</h2>
      <div className="text-gray-500 text-sm mb-2">@{username}</div>
      {country && (
        <div className="text-gray-400 text-xs mb-1">Country: {country.split('/').pop()}</div>
      )}
      {status && (
        <div className="text-xs mb-1">Status: <span className="font-medium">{status}</span></div>
      )}
      {joined && (
        <div className="text-xs text-gray-400">On Chess.com since {new Date(joined * 1000).toLocaleDateString()}</div>
      )}
    </div>
  );
};

export default PlayerCard; 