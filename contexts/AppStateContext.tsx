import React, { createContext, useContext, useState, useEffect } from 'react';
import { VeleroApiConfig, loadVeleroApiConfigs } from '@/components/BackendApi';
import { AgentApiConfig } from '@/hooks/useAgentConfigs';
import { env } from 'next-runtime-env';

interface AppState {
  apiBackends: Array<VeleroApiConfig>;
  currentBackend: VeleroApiConfig | undefined;
  agents: Array<AgentApiConfig> | null;
  currentAgent: AgentApiConfig | undefined;
  apiRequest: Array<any>;
  apiResponse: Array<any>;
  socketStatus: string;
  notificationHistory: Array<any>;
  initialized: boolean;
  logged: boolean;
  online: boolean;
  messagesHistory: Array<string>;
  refreshDatatableAfter: Number;
  refreshRecent: Number;
  isCore: Boolean | undefined;
}

interface AppStateContextProps extends AppState {
  setApiBackends: React.Dispatch<React.SetStateAction<Array<VeleroApiConfig>>>;
  setCurrentBackend: React.Dispatch<React.SetStateAction<VeleroApiConfig | undefined>>;
  setAgents: React.Dispatch<React.SetStateAction<Array<AgentApiConfig> | null>>;
  setCurrentAgent: React.Dispatch<React.SetStateAction<AgentApiConfig | undefined>>;
  setApiRequest: React.Dispatch<React.SetStateAction<Array<any>>>;
  setApiResponse: React.Dispatch<React.SetStateAction<Array<any>>>;
  setSocketStatus: React.Dispatch<React.SetStateAction<string>>;
  setNotificationHistory: React.Dispatch<React.SetStateAction<Array<any>>>;
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  setOnline: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHistory: React.Dispatch<React.SetStateAction<Array<string>>>;
  setRefreshDatatableAfter: React.Dispatch<React.SetStateAction<Number>>;
  setRefreshRecent: React.Dispatch<React.SetStateAction<Number>>;
  setIsCore: React.Dispatch<React.SetStateAction<Boolean | undefined>>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const veleroApiConfigs: VeleroApiConfig[] = loadVeleroApiConfigs();
  const [appBackends, setAppBackends] = useState<Array<VeleroApiConfig>>(veleroApiConfigs);
  const [appCurrentBackend, setAppCurrentBackend] = useState<VeleroApiConfig | undefined>(undefined);
  const [appAgents, setAppAgents] = useState<Array<AgentApiConfig> | null>(null);
  const [appCurrentAgent, setAppCurrentAgent] = useState<AgentApiConfig | undefined>(undefined);
  const [appApiRequest, setAppApiRequest] = useState<Array<any>>([]);
  const [appApiResponse, setAppApiResponse] = useState<Array<any>>([]);
  const [appSocketStatus, setAppSocketStatus] = useState<string>('');
  const [appNotificationHistory, setAppNotificationHistory] = useState<Array<any>>([]);
  const [appInitialized, setAppInitialized] = useState(false);
  const [appLogged, setAppLogged] = useState(false);
  const [appOnline, setAppOnline] = useState(true);
  const [appMessagesHistory, setAppMessagesHistory] = useState<Array<string>>([]);
  const NEXT_PUBLIC_REFRESH_DATATABLE_AFTER = env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER');
  const NEXT_PUBLIC_REFRESH_RECENT = env('NEXT_PUBLIC_REFRESH_RECENT');
  const [appRefreshDatatableAfter, setAppRefreshDatatableAfter] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_DATATABLE_AFTER}`)
  );
  const [appRefreshRecent, setAppRefreshRecent] = useState<Number>(
    Number(`${NEXT_PUBLIC_REFRESH_RECENT}`)
  );
  const [appIsCore, setAppIsCore] = useState<Boolean | undefined>(undefined);

  const [init, setInit] = useState(false);

  useEffect(() => {
    const clusterIndex =
      localStorage.getItem('cluster') &&
      Number(localStorage.getItem('cluster')) < veleroApiConfigs.length
        ? Number(localStorage.getItem('cluster'))
        : 0;
    setAppCurrentBackend(veleroApiConfigs[clusterIndex]);
    setInit(true);
  }, [veleroApiConfigs]);

  return (
    <AppStateContext.Provider
      value={{
        apiBackends: appBackends,
        currentBackend: appCurrentBackend,
        agents: appAgents,
        currentAgent: appCurrentAgent,
        apiRequest: appApiRequest,
        apiResponse: appApiResponse,
        socketStatus: appSocketStatus,
        notificationHistory: appNotificationHistory,
        initialized: appInitialized,
        logged: appLogged,
        online: appOnline,
        messagesHistory: appMessagesHistory,
        refreshDatatableAfter: appRefreshDatatableAfter,
        refreshRecent: appRefreshRecent,
        isCore: appIsCore,
        setApiBackends: setAppBackends,
        setCurrentBackend: setAppCurrentBackend,
        setAgents: setAppAgents,
        setCurrentAgent: setAppCurrentAgent,
        setApiRequest: setAppApiRequest,
        setApiResponse: setAppApiResponse,
        setSocketStatus: setAppSocketStatus,
        setNotificationHistory: setAppNotificationHistory,
        setInitialized: setAppInitialized,
        setLogged: setAppLogged,
        setOnline: setAppOnline,
        setMessageHistory: setAppMessagesHistory,
        setRefreshDatatableAfter: setAppRefreshDatatableAfter,
        setRefreshRecent: setAppRefreshRecent,
        setIsCore: setAppIsCore,
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
