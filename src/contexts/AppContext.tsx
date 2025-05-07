'use client';

import React, { createContext, useContext, useState } from 'react';
import { env } from 'next-runtime-env';

interface AppStatus {
  socketStatus: string;
  isAppInitialized: boolean;
  isAuthenticated: boolean;
  isUserLoaded: boolean;
  refreshDatatableAfter: number;
  refreshRecent: number;
  xProcessTimer: Array<number>;
  repoVersion: any;
  refreshGithubRepoVersion: any | undefined;
  appInfo: any;
}

interface AppStatusContextProps extends AppStatus {
  setSocketStatus: React.Dispatch<React.SetStateAction<string>>;
  setAppInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUserLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshDatatableAfter: React.Dispatch<React.SetStateAction<number>>;
  setRefreshRecent: React.Dispatch<React.SetStateAction<number>>;
  addXProcessTimer: React.Dispatch<React.SetStateAction<Array<number>>>;
  setRepoVersion: React.Dispatch<React.SetStateAction<any>>;
  setRefreshRepoVersion: React.Dispatch<React.SetStateAction<any>>;
  setAppInfo: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const AppStatusContext = createContext<AppStatusContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const NEXT_PUBLIC_REFRESH_DATATABLE_AFTER = env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER');
  const NEXT_PUBLIC_REFRESH_RECENT = env('NEXT_PUBLIC_REFRESH_RECENT');

  const [socketStatus, setSocketStatus] = useState<string>('');
  const [isAppInitialized, setAppInitialized] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [xProcessTimer, addXProcessTimer] = useState<Array<number>>([]);

  const [refreshDatatableAfter, setRefreshDatatableAfter] = useState<number>(
    Number(`${NEXT_PUBLIC_REFRESH_DATATABLE_AFTER}`)
  );
  const [refreshRecent, setRefreshRecent] = useState<number>(
    Number(`${NEXT_PUBLIC_REFRESH_RECENT}`)
  );

  const [refreshGithubRepoVersion, setRefreshRepoVersion] = useState<number>(
    Number(`${NEXT_PUBLIC_REFRESH_RECENT}`)
  );

  const [repoVersion, setRepoVersion] = useState<any | undefined>(undefined);

  const [appInfo, setAppInfo] = useState<any>([]);

  return (
    <AppStatusContext.Provider
      value={{
        socketStatus,
        isAppInitialized,
        isAuthenticated,
        isUserLoaded,
        refreshDatatableAfter,
        refreshRecent,
        xProcessTimer,
        repoVersion,
        refreshGithubRepoVersion,
        appInfo,
        setSocketStatus,
        setAppInitialized,
        setAuthenticated,
        setIsUserLoaded,
        setRefreshDatatableAfter,
        setRefreshRecent,
        addXProcessTimer,
        setRepoVersion,
        setRefreshRepoVersion,
        setAppInfo,
      }}
    >
      {children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatus = (): AppStatusContextProps => {
  const context = useContext(AppStatusContext);
  if (context === undefined) {
    throw new Error('useAppStatus must be used within an AppStateProvider');
  }
  return context;
};
