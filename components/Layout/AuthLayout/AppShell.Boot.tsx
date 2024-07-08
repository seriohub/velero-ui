'use client';

import { useAgentApiConfigs } from '@/hooks/useAgentConfigs';
import { useClusterConfigs } from '@/hooks/useClusterConfig';

import AppShellLayout from '@/components/Layout/AuthLayout/AuthShell.Layout';
import { useContext, useEffect, useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';

interface AppShellBootProps {
  children: any;
}
//import AppShellLayout from '@/components/Layout/App/AppShell.Layout';

export default function AppShellBoot({ children }: AppShellBootProps) {
  const appValues = useAppState();
  useClusterConfigs();
  useAgentApiConfigs();
  //const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!appValues.isAppInitialized && appValues.isCurrentServerControlPlane !== undefined) {
      appValues.setAppInitialized(true);
    }
  }, [appValues.isAppInitialized, appValues.isCurrentServerControlPlane]);

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
  //if (!initialized) return null;
  return <AppShellLayout>{children}</AppShellLayout>;
}
