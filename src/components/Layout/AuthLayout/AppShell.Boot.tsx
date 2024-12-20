'use client';
import { useEffect } from 'react';

import AppShellLayout from '@/components/Layout/AuthLayout/AuthShell.Layout';

import { useAppState } from '@/contexts/AppStateContext';

import { useAgentApiConfigs } from '@/hooks/context/useAgentConfigs';
import { useServerConfig } from '@/hooks/context/useServerConfig';
import { useAppWebSocket } from '@/hooks/utils/useAppWebSocket';
import { useUIConfig } from '@/hooks/context/useUIConfig';

interface AppShellBootProps {
  children: any;
}

export default function AppShellBoot({ children }: AppShellBootProps) {
  useServerConfig();
  useAgentApiConfigs();
  useAppWebSocket();
  

  const appValues = useAppState();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 570 has been called`, `color: green; font-weight: bold;`)
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('token');
      if (jwtToken !== null) {
        appValues.setAuthenticated(true);
      } else {
        appValues.setAuthenticated(false);
      }
    }
  }, []);
  return <AppShellLayout>{children}</AppShellLayout>;
}
