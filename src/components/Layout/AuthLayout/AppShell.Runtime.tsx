'use client';

import { useEffect, useState } from 'react';
import { useAgentConfig } from '@/hooks/context/useAgentConfig';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from '@/contexts/AppContext';

import AuthShellLayout from './AuthShell.Layout';
import { Alert } from "@mantine/core";

interface AppShellBootProps {
  children: any;
}

export default function AppShellRuntime({ children }: AppShellBootProps) {
  useAgentConfig();

  const serverValues = useServerStatus();
  const appValues = useAppStatus();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (!serverValues.isServerAvailable && !appValues.isAuthenticated) {
      // Set debounce before showing alert
      timeout = setTimeout(() => {
        setShowAlert(true);
      }, 1000);
    } else {
      // If it becomes available again, reset immediately
      setShowAlert(false);
      if (timeout) clearTimeout(timeout);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };

  }, [serverValues.isServerAvailable, appValues.isAuthenticated]);

  return (
    <AuthShellLayout>
      {showAlert && (
        <Alert variant="light" color="red" title="Error">
          Server is not available...
        </Alert>
      )}
      {children}
    </AuthShellLayout>
  );
}
