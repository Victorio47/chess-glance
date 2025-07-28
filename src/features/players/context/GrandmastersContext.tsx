'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { fetchGMs } from '../api/fetchGMs';

interface GrandmastersContextType {
  grandmasters: string[];
  isLoading: boolean;
  error: string | null;
  isPreloaded: boolean;
  loadGrandmasters: () => Promise<void>;
  preloadGrandmasters: () => void;
}

const GrandmastersContext = createContext<GrandmastersContextType | undefined>(undefined);

export const useGrandmasters = () => {
  const context = useContext(GrandmastersContext);
  if (!context) {
    throw new Error('useGrandmasters must be used within a GrandmastersProvider');
  }
  return context;
};

interface GrandmastersProviderProps {
  children: ReactNode;
}

export const GrandmastersProvider: React.FC<GrandmastersProviderProps> = ({ children }) => {
  const [grandmasters, setGrandmasters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const loadGrandmasters = useCallback(async () => {
    if (grandmasters.length > 0) return; // Already loaded
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading grandmasters...');
      const data = await fetchGMs();
      const players = data.players || [];
      setGrandmasters(players);
      setIsPreloaded(true);
      console.log(`Loaded ${players.length} grandmasters`);
    } catch (err: any) {
      console.error('Error loading grandmasters:', err);
      setError(err.message || 'Failed to load grandmasters');
    } finally {
      setIsLoading(false);
    }
  }, [grandmasters.length]);

  const preloadGrandmasters = useCallback(() => {
    if (grandmasters.length === 0 && !isLoading) {
      loadGrandmasters();
    }
  }, [grandmasters.length, isLoading, loadGrandmasters]);

  const value: GrandmastersContextType = {
    grandmasters,
    isLoading,
    error,
    isPreloaded,
    loadGrandmasters,
    preloadGrandmasters,
  };

  return (
    <GrandmastersContext.Provider value={value}>
      {children}
    </GrandmastersContext.Provider>
  );
}; 