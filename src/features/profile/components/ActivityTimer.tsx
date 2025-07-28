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
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const secondsAgo = Math.floor((now - last_online * 1000) / 1000);

  return (
    <div className="text-xs text-gray-500 mt-2">Last seen: {formatTimeAgo(secondsAgo)}</div>
  );
};

export default ActivityTimer; 