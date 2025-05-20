'use client';

import { useEffect } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';
import { SocketProvider } from '@/contexts/SocketContext';

import AppShellLoader from '../AppShell.Loader';
import { ServerError } from "@/components/Features/Errors/ServerError";
import AppShellRuntime from "@/components/Layout/AppLayout/AppShell.Runtime";

interface AppShellBootProps {
  children: any;
}

export default function AppShellStartup({ children }: AppShellBootProps) {
  const appValues = useAppStatus();
  const serverValues = useServerStatus();

  useEffect(() => {
    if (serverValues.currentServer) {
      appValues.setAppInitialized(true); // currentServer is initialized and window is available
    }
  }, [serverValues.currentServer]);

  return (
    <>
      {!appValues.isAppInitialized &&
          <AppShellLoader description="Loading server configuration..."/>
      }
      <SocketProvider>
        <>
          <ServerError/>
          <AppShellRuntime>{children}</AppShellRuntime>
        </>
      </SocketProvider>
    </>
  );
}
