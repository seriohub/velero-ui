'use client';

import { useEffect } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';
import { useUIConfig } from '@/hooks/context/useUIConfig';
import { useAppConfig } from '@/hooks/context/useAppConfig';

import { useServerConfig } from '@/hooks/context/useServerConfig';

import AppShellBootConnection from './Boot/AppShell.BootConnection';
import AppShellLoader from '../AppShell.Loader';
import { SocketProvider } from '@/contexts/SocketContext';

interface AppShellBootProps {
  children: any;
}

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
