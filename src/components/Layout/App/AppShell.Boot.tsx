'use client';

import { useEffect } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';

import { useServerConfig } from '@/hooks/context/useServerConfig';

import { useUIConfig } from '@/hooks/context/useUIConfig';

import AppShellBootConnection from './Boot/AppShell.BootConnection';
import AppShellLoader from '../AppShell.Loader';
import { SocketProvider } from '@/contexts/SocketContext';
import { useAppConfig } from '@/hooks/context/useAppConfig';

interface AppShellBootProps {
  children: any;
}
/*
export default function AppShellBoot({ children }: AppShellBootProps) {
  useAppWebSocket();
  useUIConfig();
  useServerConfig();
  useAgentConfig();

  const serverValues = useServerStatus();
  const appValues = useAppStatus();
  const userValues = useUserStatus();

  const { data, getUserInfo } = useUserInfo();

  useEffect(() => {
    if (data !== undefined) {
      userValues.setUser(data);
      appValues.setIsUserLoaded(true);
    }
  }, [data]);

  useEffect(() => {
    if (serverValues.isServerAvailable) {
      appValues.setAppInitialized(true);
      getUserInfo();
    }
  }, [serverValues.isServerAvailable]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('token');
      if (jwtToken !== null) {
        appValues.setAuthenticated(true);
      } else {
        appValues.setAuthenticated(false);
      }
    }
  }, []);

  return (
    <>
      <ServerError />
      {!appValues.isAppInitialized ||
        (!appValues.isAuthenticated && (
          <>
            <Center>
              <Loader color="blue" size="lg" />
            </Center>
          </>
        ))}
      {appValues.isAppInitialized && appValues.isAuthenticated && (
        <AppShellLayout>{children}</AppShellLayout>
      )}
    </>
  );
}
*/

export default function AppShellBoot({ children }: AppShellBootProps) {
  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  useAppConfig();
  useUIConfig();

  useServerConfig();

  useEffect(() => {
    if (serverValues.currentServer && typeof window !== 'undefined') {
      appValues.setAppInitialized(true); // currentServer is available and widow is available
    }
  }, [serverValues.currentServer]);

  return (
    <>
      {!serverValues.currentServer && (
        <AppShellLoader description="Loading server configuration..." />
      )}
      {serverValues.currentServer && (
        <SocketProvider>
          <AppShellBootConnection>{children}</AppShellBootConnection>
        </SocketProvider>
      )}
    </>
  );
}
