import React, { createContext, useState, useContext } from 'react';
import { ServerApiConfig, loadServerApiConfigs } from '@/lib/ServerBackendApi';

interface ServerStatus {
  servers: Array<ServerApiConfig>;
  currentServer: ServerApiConfig | undefined;
  isServerAvailable: Boolean | undefined;
  isCurrentServerControlPlane: Boolean | undefined;
}
interface ServerStatusContextProps extends ServerStatus {
  setServers: React.Dispatch<React.SetStateAction<Array<ServerApiConfig>>>;
  setCurrentBackend: React.Dispatch<React.SetStateAction<ServerApiConfig | undefined>>;
  setIsServerAvailable: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
  setCurrentServerAsControlPlane: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
  setInit: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
}

const ServerStatusContext = createContext<ServerStatusContextProps | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // console.log('ServerStatusProvider');
  const serverApiConfigs: ServerApiConfig[] = loadServerApiConfigs();
  const [servers, setServers] = useState<Array<ServerApiConfig>>(serverApiConfigs);

  const [currentServer, setCurrentBackend] = useState<ServerApiConfig | undefined>(undefined);
  const [isCurrentServerControlPlane, setCurrentServerAsControlPlane] = useState<
    Boolean | undefined
  >(undefined);
  const [isServerAvailable, setIsServerAvailable] = useState<Boolean | undefined>(undefined);

  const [init, setInit] = useState<Boolean | undefined>(undefined);

  return (
    <ServerStatusContext.Provider
      value={{
        servers,
        currentServer,
        isServerAvailable,
        isCurrentServerControlPlane,
        setServers,
        setCurrentBackend,
        setIsServerAvailable,
        setCurrentServerAsControlPlane,
        setInit,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = (): ServerStatusContextProps => {
  const context = useContext(ServerStatusContext);
  if (context === undefined) {
    throw new Error('ServerStatusContext must be used within an ServerStateProvider');
  }
  return context;
};
