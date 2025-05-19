'use client';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';
import React from 'react';
import AppShellLoader from '@/components/Layout/AppShell.Loader';
import { useAppStatus } from "@/contexts/AppContext";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function WithAgentAndServerAvailable({
                                                      children,
                                                      fallback
                                                    }: Props) {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const appValues = useAppStatus();

  const isReady =
    serverValues?.isServerAvailable &&
    serverValues?.isCurrentServerControlPlane !== undefined &&
    agentValues?.isAgentAvailable && appValues.isAuthenticated;

  if (!isReady) {
    return fallback ?? (
      <AppShellLoader description="Waiting for server and agent..."/>
    );
  }

  return <>{children}</>;
}
