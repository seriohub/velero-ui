'use client';

import React, { createContext, useState, useContext } from 'react';
import { ServerApiConfig, ApiManager } from '@/lib/ApiManager';

interface ServerStatus {
  servers: Array<ServerApiConfig>;
  currentServer: ServerApiConfig | undefined;
  isServerAvailable: Boolean | undefined;
  serverInfo: any;
  isCurrentServerControlPlane: Boolean | undefined;
}

interface ServerStatusContextProps extends ServerStatus {
  setServers: React.Dispatch<React.SetStateAction<Array<ServerApiConfig>>>;
  setCurrentBackend: React.Dispatch<React.SetStateAction<ServerApiConfig | undefined>>;
  setIsServerAvailable: React.Dispatch<React.SetStateAction<any | undefined>>;
  setCurrentServerAsControlPlane: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
  setServerInfo: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const serverApiConfigs: ServerApiConfig[] = ApiManager();
  const [servers, setServers] = useState<Array<ServerApiConfig>>(serverApiConfigs);

  const [currentServer, setCurrentBackend] = useState<ServerApiConfig | undefined>(undefined);
  const [isCurrentServerControlPlane, setCurrentServerAsControlPlane] = useState<
    Boolean | undefined
  >(undefined);

  const [isServerAvailable, setIsServerAvailable] = useState<Boolean | undefined>(undefined);
  const [serverInfo, setServerInfo] = useState<any>([]);

  return (
    <ServerStatusContext.Provider
      value={{
        servers,
        currentServer,
        isServerAvailable,
        isCurrentServerControlPlane,
        serverInfo,
        //init,
        setServers,
        setCurrentBackend,
        setIsServerAvailable,
        setCurrentServerAsControlPlane,
        setServerInfo,
        //setInit,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = (): ServerStatusContextProps => {
  const context = useContext(ServerStatusContext);
  if (context === undefined) {
    throw new Error('useServerStatus must be used within an ServerStateProvider');
  }
  return context;
};
