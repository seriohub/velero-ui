'use client';

import { useAgentConfig } from '@/hooks/context/useAgentConfig';

import AppShellUserBoot from './AppShell.UserBoot';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';
import AppShellLoader from "@/components/Layout/AppShell.Loader";
import { useAgentStatus } from "@/contexts/AgentContext";
import React, { useEffect, useState } from "react";

interface AppShellBootProps {
  children: any;
}

export default function AppShellBootAgent({ children }: AppShellBootProps) {
  useAgentConfig();

  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  const agentValues = useAgentStatus()
  const [reload, setReload] = useState(1);

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      console.log('Agent available');
      setReload(prev => prev + 1);
    }
  }, [agentValues.isAgentAvailable]);
  return (
    <>
      {!serverValues.isServerAvailable && !appValues.isAuthenticated && (
        <>
          <AppShellLoader description="Waiting server is available..."/>
        </>
      )}
      {(serverValues.isServerAvailable || appValues.isAuthenticated) && (
        <AppShellUserBoot key={reload}>
          <>
            {React.cloneElement(children, { key: reload })}
          </>
        </AppShellUserBoot>
      )}
    </>
  );
}
