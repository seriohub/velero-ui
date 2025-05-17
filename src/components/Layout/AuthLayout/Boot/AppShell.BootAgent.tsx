'use client';

import { useAgentConfig } from '@/hooks/context/useAgentConfig';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';

import AppShellLoader from '../../AppShell.Loader';
import AuthShellLayout from '../AuthShell.Layout';
import { Alert } from "@mantine/core";

interface AppShellBootProps {
  children: any;
}

export default function AppShellBootAgent({ children }: AppShellBootProps) {
  useAgentConfig();

  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  return (
    <>
      {/*!serverValues.isServerAvailable && !appValues.isAuthenticated && (
      <AppShellLoader description="Waiting server is available..."/>
      })}*/}
      {/*(serverValues.isServerAvailable || appValues.isAuthenticated) && (*/}
      <AuthShellLayout>
        {!serverValues.isServerAvailable && !appValues.isAuthenticated && (
          <>
            {/*<AppShellLoader description="Waiting server is available..." />*/}
            <Alert variant="light" color="red" title="Error">
              Server is not available...
            </Alert>
          </>
        )}
        {children}
      </AuthShellLayout>
      {/*})}*/}
    </>
  );
}
