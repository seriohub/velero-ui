'use client';

import { useAgentConfig } from '@/hooks/context/useAgentConfig';
import AppShellUserRuntime from './AppShell.UserRuntime';
import { useServerStatus } from '@/contexts/ServerContext';
import AppShellLoader from "@/components/Layout/AppShell.Loader";
import { useAgentStatus } from "@/contexts/AgentContext";
import React, { useEffect, useState, useRef } from "react";

interface AppShellBootProps {
  children: any;
}

export default function AppShellRuntime({ children }: AppShellBootProps) {
  useAgentConfig();
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const [reload, setReload] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    // evita il trigger al primo mount
    if (mountedRef.current && agentValues.isAgentAvailable) {
      setReload(prev => prev + 1);
    }
    mountedRef.current = true;
  }, [agentValues.isAgentAvailable]);

  return (
    <>
      {!serverValues.isServerAvailable && (
        <AppShellLoader description="Waiting server is available..." />
      )}

      {serverValues.isServerAvailable && (
        <AppShellUserRuntime reload={reload}>
          {children}
        </AppShellUserRuntime>
      )}
    </>
  );
}
