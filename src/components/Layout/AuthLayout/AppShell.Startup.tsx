'use client';

import { useEffect } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';
import { SocketProvider } from '@/contexts/SocketContext';

import AppShellLoader from '../AppShell.Loader';
import AppShellRuntime from "./AppShell.Runtime";

interface AppShellBootProps {
  children: any;
}

export default function AppShellStartup({ children }: AppShellBootProps) {
  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  useEffect(() => {
    if (serverValues.currentServer && typeof window !== 'undefined') {
      appValues.setAppInitialized(true); // currentServer is initialized and window is available
    }
  }, [serverValues.currentServer]);

  return (
    <>
      {!serverValues.currentServer && (
        <AppShellLoader description="Loading server configuration..."/>
      )}
      {serverValues.currentServer && (
        <SocketProvider>
          <AppShellRuntime>{children}</AppShellRuntime>
        </SocketProvider>
      )}
    </>
  );
}
