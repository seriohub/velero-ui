'use client';

import React, { createContext, useState, useContext } from 'react';
import { ServerApiConfig, ApiManager } from '@/lib/ApiManager';

interface ServerStatus {
  servers: Array<ServerApiConfig>;
  currentServer: ServerApiConfig | undefined;
  isServerAvailable: Boolean | undefined;
  serverInfo: any;
  isCurrentServerControlPlane: Boolean | undefined;
  origins: any;
  arch: any;
  k8sHealth: any;
  uiURL: string | undefined;
  apiURL: string | undefined;
}

interface ServerStatusContextProps extends ServerStatus {
  setServers: React.Dispatch<React.SetStateAction<Array<ServerApiConfig>>>;
  setCurrentBackend: React.Dispatch<React.SetStateAction<ServerApiConfig | undefined>>;
  setIsServerAvailable: React.Dispatch<React.SetStateAction<any | undefined>>;
  setCurrentServerAsControlPlane: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
  setServerInfo: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setOrigins: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setArch: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setK8sHealth: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setApiURL: React.Dispatch<React.SetStateAction<string | undefined>>;
  setUiURL: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  const [serverInfo, setServerInfo] = useState<Record<string, any>>([]);
  const [origins, setOrigins] = useState<Record<string, any>>([]);
  const [arch, setArch] = useState<Record<string, any>>([]);
  const [k8sHealth, setK8sHealth] = useState<Record<string, any>>([]);
  const [uiURL, setUiURL] = useState<string | undefined>(undefined);
  const [apiURL, setApiURL] = useState<string | undefined>(undefined);

  return (
    <ServerStatusContext.Provider
      value={{
        servers,
        currentServer,
        isServerAvailable,
        isCurrentServerControlPlane,
        serverInfo,
        origins,
        arch,
        k8sHealth,
        uiURL,
        apiURL,
        setServers,
        setCurrentBackend,
        setIsServerAvailable,
        setCurrentServerAsControlPlane,
        setServerInfo,
        setOrigins,
        setArch,
        setK8sHealth,
        setUiURL,
        setApiURL,
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
