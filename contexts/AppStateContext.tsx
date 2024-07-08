import React, { createContext, useContext, useState, useEffect } from 'react';
import { VeleroApiConfig, loadVeleroApiConfigs } from '@/components/BackendApi';
import { AgentApiConfig } from '@/hooks/useAgentConfigs';
import { env } from 'next-runtime-env';

interface AppState {
  servers: Array<VeleroApiConfig>;
  currentServer: VeleroApiConfig | undefined;
  agents: Array<AgentApiConfig> | null;
  currentAgent: AgentApiConfig | undefined;
  apiRequest: Array<any>;
  apiResponse: Array<any>;
  socketStatus: string;
  notificationHistory: Array<any>;
  isAppInitialized: boolean;
  isAuthenticated: boolean;
  //online: boolean;
  messagesHistory: Array<string>;
  refreshDatatableAfter: Number;
  refreshRecent: Number;
  isCurrentServerControlPlane: Boolean | undefined;
}

interface AppStateContextProps extends AppState {
  setServers: React.Dispatch<React.SetStateAction<Array<VeleroApiConfig>>>;
  setCurrentBackend: React.Dispatch<React.SetStateAction<VeleroApiConfig | undefined>>;
  setAgents: React.Dispatch<React.SetStateAction<Array<AgentApiConfig> | null>>;
  setCurrentAgent: React.Dispatch<React.SetStateAction<AgentApiConfig | undefined>>;
  setApiRequest: React.Dispatch<React.SetStateAction<Array<any>>>;
  setApiResponse: React.Dispatch<React.SetStateAction<Array<any>>>;
  setSocketStatus: React.Dispatch<React.SetStateAction<string>>;
  setNotificationHistory: React.Dispatch<React.SetStateAction<Array<any>>>;
  setAppInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  //setOnline: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHistory: React.Dispatch<React.SetStateAction<Array<string>>>;
  setRefreshDatatableAfter: React.Dispatch<React.SetStateAction<Number>>;
  setRefreshRecent: React.Dispatch<React.SetStateAction<Number>>;
  setCurrentServerAsControlPlane: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const NEXT_PUBLIC_REFRESH_DATATABLE_AFTER = env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER');
  const NEXT_PUBLIC_REFRESH_RECENT = env('NEXT_PUBLIC_REFRESH_RECENT');

  const veleroApiConfigs: VeleroApiConfig[] = loadVeleroApiConfigs();
  const [servers, setServers] = useState<Array<VeleroApiConfig>>(veleroApiConfigs);
  const [currentServer, setCurrentBackend] = useState<VeleroApiConfig | undefined>(undefined);
  const [agents, setAgents] = useState<Array<AgentApiConfig> | null>(null);
  const [currentAgent, setCurrentAgent] = useState<AgentApiConfig | undefined>(undefined);
  const [apiRequest, setApiRequest] = useState<Array<any>>([]);
  const [apiResponse, setApiResponse] = useState<Array<any>>([]);
  const [socketStatus, setSocketStatus] = useState<string>('');
  const [notificationHistory, setNotificationHistory] = useState<Array<any>>([]);
  const [isAppInitialized, setAppInitialized] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  //const [online, setOnline] = useState(true);
  const [messagesHistory, setMessageHistory] = useState<Array<string>>([]);
  const [refreshDatatableAfter, setRefreshDatatableAfter] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_DATATABLE_AFTER}`)
  );
  const [refreshRecent, setRefreshRecent] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_RECENT}`)
  );
  const [isCurrentServerControlPlane, setCurrentServerAsControlPlane] = useState<Boolean | undefined>(undefined);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const clusterIndex =
      localStorage.getItem('cluster') &&
      Number(localStorage.getItem('cluster')) < veleroApiConfigs.length
        ? Number(localStorage.getItem('cluster'))
        : 0;
    setCurrentBackend(veleroApiConfigs[clusterIndex]);
    setInit(true);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        servers,
        currentServer,
        agents,
        currentAgent,
        apiRequest,
        apiResponse,
        socketStatus,
        notificationHistory,
        isAppInitialized,
        isAuthenticated,
        messagesHistory,
        refreshDatatableAfter,
        refreshRecent,
        isCurrentServerControlPlane,
        setServers,
        setCurrentBackend,
        setAgents,
        setCurrentAgent,
        setApiRequest,
        setApiResponse,
        setSocketStatus,
        setNotificationHistory,
        setAppInitialized,
        setAuthenticated,
        setMessageHistory,
        setRefreshDatatableAfter,
        setRefreshRecent,
        setCurrentServerAsControlPlane,
      }}
    >
      {init && children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
