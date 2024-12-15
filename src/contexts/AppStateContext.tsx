import React, { createContext, useContext, useEffect, useState } from 'react';
import { env } from 'next-runtime-env';
import { useDisclosure } from '@mantine/hooks';
// import { Open_Sans } from 'next/font/google';
// const open_sans = Open_Sans({subsets: ['latin']})

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

  // primaryColor: any;
  showBottomDebugBar: boolean;
  showDebugAside: boolean;

  openedUIDrawer: boolean;

  // uiFontFamily: any
  // uiFontSize: any | undefined
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

  //setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  setShowDebugAside: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBottomDebugBar: React.Dispatch<React.SetStateAction<boolean>>;

  toggleUIDrawer: React.Dispatch<React.SetStateAction<boolean>>;

  // setUiFontFamily: React.Dispatch<React.SetStateAction<boolean>>;
  // setUiFontSize: React.Dispatch<React.SetStateAction<any>>;
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

  // const [primaryColor, setPrimaryColor] = useState('blue');
  const [showDebugAside, setShowDebugAside] = useState(false);

  // const [uiFontFamily, setUiFontFamily] = useState({name: 'open sans', fontFamily:open_sans});
  // const [uiFontSize, setUiFontSize] = useState(undefined);

  const [showBottomDebugBar, setShowBottomDebugBar] = useState(false);

  // const [showUIDrawer, setShowUIDrawer] = useState(false);
  const [openedUIDrawer, { toggle: toggleUIDrawer }] = useDisclosure();

  useEffect(() => {
    setShowDebugAside(localStorage.getItem('showDebugAside') === 'true' || false);

    setShowBottomDebugBar(localStorage.getItem('showBottomDebugBar') === 'true' || false);
  }, []);

  useEffect(() => {
    localStorage.setItem('showDebugAside', showDebugAside.toString());
  }, [showDebugAside]);

  useEffect(() => {
    localStorage.setItem('showBottomDebugBar', showBottomDebugBar.toString());
  }, [showBottomDebugBar]);

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

        //primaryColor,
        showBottomDebugBar,
        showDebugAside,
        openedUIDrawer,

        // uiFontFamily,
        // uiFontSize,

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

        //setPrimaryColor,
        setShowDebugAside,
        setShowBottomDebugBar,

        toggleUIDrawer,
        // setUiFontFamily,
        // setUiFontSize,
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
