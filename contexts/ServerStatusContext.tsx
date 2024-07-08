import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAppState } from './AppStateContext';
import { useAppWebSocket } from '@/hooks/useAppWebSocket';
import { useClusterConfigs } from '@/hooks/useClusterConfig';

const ServerStatusContext = createContext();

export const ServerStatusProvider = ({ children }: any) => {
  //useClusterConfigs();
  const { isServerAvailable } = useAppWebSocket();

  return (
    <ServerStatusContext.Provider value={isServerAvailable}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => useContext(ServerStatusContext);
