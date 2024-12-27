'use client';

import { ServerError } from '@/components/ServerError/ServerError';
import { useAgentConfig } from '@/hooks/context/useAgentConfig';

import { useAppWebSocket } from '@/hooks/context/useAppWebSocket';
import AppShellUserBoot from './AppShell.UserBoot';
import { useServerStatus } from '@/contexts/ServerContext';
import AppShellLoader from '../../AppShell.Loader';
import { useAppStatus } from '@/contexts/AppContext';
import { SocketProvider } from '@/contexts/SocketContext';

interface AppShellBootProps {
  children: any;
}

export default function AppShellBootAgent({ children }: AppShellBootProps) {
  useAgentConfig();

  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  return (
    <>
      {!serverValues.isServerAvailable && !appValues.isAuthenticated && (
        <>
          <AppShellLoader description="Waiting server is available..." />
        </>
      )}
      {(serverValues.isServerAvailable || appValues.isAuthenticated) && (
        <AppShellUserBoot>{children}</AppShellUserBoot>
      )}
    </>
  );
}
