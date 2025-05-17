'use client';

import { useEffect } from 'react';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';
import { SocketProvider } from '@/contexts/SocketContext';

import { useServerConfig } from '@/hooks/context/useServerConfig';
import { useUIConfig } from '@/hooks/context/useUIConfig';

import AppShellBootConnection from './Boot/AppShell.BootConnection';
import AppShellLoader from '../AppShell.Loader';
import { useAppConfig } from "@/hooks/context/useAppConfig";

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
        <AppShellLoader description="Loading server configuration..."/>
      )}
      {serverValues.currentServer && (
        <SocketProvider>
          <AppShellBootConnection>{children}</AppShellBootConnection>
        </SocketProvider>
      )}
    </>
  );
}
