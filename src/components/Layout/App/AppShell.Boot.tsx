'use client';

import { useEffect } from 'react';
import { Center, Loader } from '@mantine/core';

import { useServerStatus } from '@/contexts/ServerStatusContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useAppState } from '@/contexts/AppStateContext';

import { useAppWebSocket } from '@/hooks/utils/useAppWebSocket';
import { useServerConfig } from '@/hooks/context/useServerConfig';
import { useAgentApiConfigs } from '@/hooks/context/useAgentConfigs';

import AppShellLayout from '@/components/Layout/App/AppShell.Layout';
import { ServerError } from '@/components/ServerError/ServerError';
import { useUserInfo } from '@/api/User/useUserInfo';
import { useUserCtx } from '@/contexts/UserContext';
import { useUIConfig } from '@/hooks/context/useUIConfig';

interface AppShellBootProps {
  children: any;
}

export default function AppShellBoot({ children }: AppShellBootProps) {
  useServerConfig();
  useAgentApiConfigs();
  useAppWebSocket();
  useUIConfig()

  const serverValues = useServerStatus();
  //
  const userValues = useUserCtx();
  const { data, getUserInfo } = useUserInfo();
  //const serverValues = useServerStatus();
  useEffect(() => {
    if (serverValues.isServerAvailable) getUserInfo();
  }, [serverValues.isServerAvailable]);

  useEffect(() => {
    userValues.setUser(data)
  }, [data]);
  ///
  
  
  //const agentValues = useAgentStatus();
  const appValues = useAppState();

  useEffect(() => {
    if (serverValues.isServerAvailable) {
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 530 has been called`, `color: green; font-weight: bold;`);

      appValues.setAppInitialized(true);
    }
  }, [serverValues.isServerAvailable]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (process.env.NODE_ENV === 'development')
        console.log(`%cuseEffect 540 has been called`, `color: green; font-weight: bold;`);

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
