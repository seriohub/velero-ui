'use client';

import { useEffect } from 'react';
import { Center, Loader } from '@mantine/core';

import { useServerStatus } from '@/contexts/ServerStatusContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useAppState } from '@/contexts/AppStateContext';

import { useAppWebSocket } from '@/hooks/useAppWebSocket';
import { useServerConfig } from '@/hooks/useServerConfig';
import { useAgentApiConfigs } from '@/hooks/useAgentConfigs';

import AppShellLayout from '@/components/Layout/App/AppShell.Layout';
import { ServerError } from '@/components/ServerError/ServerError';

interface AppShellBootProps {
  children: any;
}

export default function AppShellBoot({ children }: AppShellBootProps) {
  useServerConfig();
  useAgentApiConfigs();
  useAppWebSocket();

  const serverValues = useServerStatus();
  //const agentValues = useAgentStatus();
  const appValues = useAppState();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 530 has been called`, `color: green; font-weight: bold;`)
    if (serverValues.isServerAvailable) {
      appValues.setAppInitialized(true);
    }
  }, [serverValues.isServerAvailable]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 540 has been called`, `color: green; font-weight: bold;`)
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
      {!appValues.isAppInitialized && (
        <>
          <Center>
            <Loader color="blue" size="lg" />
          </Center>
        </>
      )}
      {appValues.isAppInitialized && <AppShellLayout>{children}</AppShellLayout>}
    </>
  );
}
