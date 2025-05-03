'use client';

import { useEffect } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';
import { useUIConfig } from '@/hooks/context/useUIConfig';
import { useAppConfig } from '@/hooks/context/useAppConfig';

import { useServerConfig } from '@/hooks/context/useServerConfig';

import AppShellLoader from '../AppShell.Loader';
import { SocketProvider } from '@/contexts/SocketContext';
import { ServerError } from "@/components/Features/Errors/ServerError";
import AppShellBootAgent from "@/components/Layout/AppLayout/Boot/AppShell.BootAgent";

interface AppShellBootProps {
  children: any;
}

export default function AppShellBoot({ children }: AppShellBootProps) {
  const appValues = useAppStatus();
  const serverValues = useServerStatus();

  useUIConfig();
  useAppConfig();
  useServerConfig();

  useEffect(() => {
    if (serverValues.currentServer && serverValues.isCurrentServerControlPlane !== undefined) {
      appValues.setAppInitialized(true); // currentServer is available and widow is available
    }
  }, [serverValues.currentServer, serverValues.isCurrentServerControlPlane]);

  return (
    <>
      {!appValues.isAppInitialized &&
          <AppShellLoader description="Loading server configuration..."/>
      }
      <SocketProvider>
        <>
          <ServerError/>
          <AppShellBootAgent>{children}</AppShellBootAgent>
        </>
      </SocketProvider>
    </>
  );
}
