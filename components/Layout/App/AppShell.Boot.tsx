'use client';

import { useAppWebSocket } from '@/hooks/useAppWebSocket';

import { useAgentApiConfigs } from '@/hooks/useAgentConfigs';
import { useClusterConfigs } from '@/hooks/useClusterConfig';

import AppShellLayout from '@/components/Layout/App/AppShell.Layout';
import { useContext, useEffect, useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Center, Loader } from '@mantine/core';
import { ServerError } from '@/components/ServerError/ServerError';
import { ServerStatusProvider, useServerStatus } from '@/contexts/ServerStatusContext';
import { AgentError } from '@/components/AgentError/AgentError';
import { useAgentStatus } from '@/contexts/AgentStatusContext';

interface AppShellBootProps {
  children: any;
}
//import AppShellLayout from '@/components/Layout/App/AppShell.Layout';

export default function AppShellBoot({ children }: AppShellBootProps) {
  const appValues = useAppState();
  useClusterConfigs();
  useAgentApiConfigs();
  useAppWebSocket();
  
  const isServerAvailable = useServerStatus()
  const isAgentAvailable = useAgentStatus()

  /*useEffect(() => {
    if (!appValues.isAppInitialized && appValues.isCurrentServerControlPlane == false) {
      appValues.setAppInitialized(true);
    }
  }, [appValues.isAppInitialized, appValues.isCurrentServerControlPlane]);

  useEffect(() => {
    if (
      !appValues.isAppInitialized &&
      appValues.isCurrentServerControlPlane == true &&
      appValues.currentAgent !== undefined
    ) {
      appValues.setAppInitialized(true);
    }
  }, [appValues.isAppInitialized, appValues.isCurrentServerControlPlane, appValues.currentAgent]);

  /*useEffect(() => {
    if (!appValues.isAppInitialized && appValues.currentServerIsControlPlane !== undefined) {
      appValues.setAppInitialized(true);
    }
  }, [appValues.isAppInitialized, appValues.currentServerIsControlPlane]);*/

  useEffect(()=>{
      if (isServerAvailable && isAgentAvailable){
        console.log("@@@",isServerAvailable,isAgentAvailable)
        appValues.setAppInitialized(true);
      }
  }, [isServerAvailable, isAgentAvailable])

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

  /*if (appValues.initialized == false)
    return (
      <>
        <ServerError />
        <Stack justify="center" h="100vh">
          <Center>
            <Loader color="blue" size="lg" />
          </Center>
        </Stack>
      </>
    );*/

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
