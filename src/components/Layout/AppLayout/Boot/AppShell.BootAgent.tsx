'use client';

import { useAgentConfig } from '@/hooks/context/useAgentConfig';

import AppShellUserBoot from './AppShell.UserBoot';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';
import AppShellLoader from "@/components/Layout/AppShell.Loader";

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
