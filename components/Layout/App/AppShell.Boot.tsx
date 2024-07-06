'use client';

import { useAppWebSocket } from '@/hooks/useAppWebSocket';

import { useAgentApiConfigs } from '@/hooks/useAgentConfigs';
import { useClusterConfigs } from '@/hooks/useClusterConfig';

import AppShellLayout from '@/components/Layout/App/AppShell.Layout';
import { useContext, useEffect, useState } from 'react';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { Center, Loader, Stack } from '@mantine/core';
import { ServerError } from '@/components/ServerError/ServerError';

interface AppShellBootProps {
  children: any;
}
//import AppShellLayout from '@/components/Layout/App/AppShell.Layout';

export default function AppShellBoot({ children }: AppShellBootProps) {
  const appValues = useContext(VeleroAppContexts);
  useClusterConfigs();
  useAgentApiConfigs();
  useAppWebSocket();
  //const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (
      !appValues.state.initialized &&
      appValues.state.isCore !== undefined &&
      appValues.state.isCore == false
    ) {
      appValues.setInitialized(true);
    }
  }, [appValues.state.initialized, appValues.state.isCore]);

  useEffect(() => {
    if (!appValues.state.initialized && appValues.state.currentAgent !== undefined) {
      appValues.setInitialized(true);
    }
  }, [appValues.state.initialized, appValues.state.currentAgent]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('token');
      if (jwtToken !== null) {

        appValues.setLogged(true)
      } else {
        appValues.setLogged(false)
      }
    }
  }, []);

  if (appValues.state.initialized == false)
    return (
      <>
        <ServerError />
        <Stack justify="center" h="100vh">
          <Center>
            <Loader color="blue" size="lg" />
          </Center>
        </Stack>
      </>
    );

  return (
    <>
      <ServerError />
      <AppShellLayout>{children}</AppShellLayout>
    </>
  );
}
