import React, { createContext, useContext, useState } from 'react';
import { env } from 'next-runtime-env';

interface AppState {
  backendInfo: any;
  apiRequest: Array<any>;
  apiResponse: Array<any>;
  socketStatus: string;
  notificationHistory: Array<any>;
  isAppInitialized: boolean;
  isAuthenticated: boolean;

  messagesHistory: Array<string>;
  refreshDatatableAfter: number;
  refreshRecent: number;
}

interface AppStateContextProps extends AppState {
  setBackendInfo: React.Dispatch<React.SetStateAction<Array<any>>>;
  setApiRequest: React.Dispatch<React.SetStateAction<Array<any>>>;
  setApiResponse: React.Dispatch<React.SetStateAction<Array<any>>>;
  setSocketStatus: React.Dispatch<React.SetStateAction<string>>;
  setNotificationHistory: React.Dispatch<React.SetStateAction<Array<any>>>;
  setAppInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;

  setMessageHistory: React.Dispatch<React.SetStateAction<Array<string>>>;
  setRefreshDatatableAfter: React.Dispatch<React.SetStateAction<number>>;
  setRefreshRecent: React.Dispatch<React.SetStateAction<number>>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // console.log('AppStateProvider');
  const NEXT_PUBLIC_REFRESH_DATATABLE_AFTER = env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER');
  const NEXT_PUBLIC_REFRESH_RECENT = env('NEXT_PUBLIC_REFRESH_RECENT');

  const [backendInfo, setBackendInfo] = useState<any>([]);
  const [apiRequest, setApiRequest] = useState<Array<any>>([]);
  const [apiResponse, setApiResponse] = useState<Array<any>>([]);
  const [socketStatus, setSocketStatus] = useState<string>('');
  const [notificationHistory, setNotificationHistory] = useState<Array<any>>([]);
  const [isAppInitialized, setAppInitialized] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const [messagesHistory, setMessageHistory] = useState<Array<string>>([]);
  const [refreshDatatableAfter, setRefreshDatatableAfter] = useState<number>(
    Number(`${NEXT_PUBLIC_REFRESH_DATATABLE_AFTER}`)
  );
  const [refreshRecent, setRefreshRecent] = useState<number>(
    Number(`${NEXT_PUBLIC_REFRESH_RECENT}`)
  );

  return (
    <AppStateContext.Provider
      value={{
        backendInfo,
        apiRequest,
        apiResponse,
        socketStatus,
        notificationHistory,
        isAppInitialized,
        isAuthenticated,
        messagesHistory,
        refreshDatatableAfter,
        refreshRecent,
        
        setBackendInfo,
        setApiRequest,
        setApiResponse,
        setSocketStatus,
        setNotificationHistory,
        setAppInitialized,
        setAuthenticated,
        setMessageHistory,
        setRefreshDatatableAfter,
        setRefreshRecent,
      }}
    >
      {children}
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
