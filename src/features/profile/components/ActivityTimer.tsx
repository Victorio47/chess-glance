'use client';

import React, { useEffect, useState } from 'react';

interface ActivityTimerProps {
  last_online: number; // unix timestamp (seconds)
}

function formatTimeAgo(secondsAgo: number): string {
  if (secondsAgo < 60) return `${secondsAgo} sec ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} h ago`;
  return `${Math.floor(secondsAgo / 86400)} d ago`;
}

const ActivityTimer: React.FC<ActivityTimerProps> = ({ last_online }) => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Устанавливаем начальное время только на клиенте
    setNow(Date.now());
    
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Не рендерим ничего пока не загрузились на клиенте
  if (now === null) {
    return <div className="text-xs text-gray-500 dark:text-white mt-2">Loading...</div>;
  }

  const secondsAgo = Math.floor((now - last_online * 1000) / 1000);

  return (
    <div className="text-xs text-gray-500 dark:text-white mt-2">Last seen: {formatTimeAgo(secondsAgo)}</div>
  );
};

export default ActivityTimer; 