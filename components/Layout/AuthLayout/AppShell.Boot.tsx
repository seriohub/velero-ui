'use client';

import { useAgentApiConfigs } from '@/hooks/useAgentConfigs';
import { useClusterConfigs } from '@/hooks/useClusterConfig';

import AppShellLayout from '@/components/Layout/AuthLayout/AuthShell.Layout';
import { useContext, useEffect, useState } from 'react';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';

interface AppShellBootProps {
  children: any;
}
//import AppShellLayout from '@/components/Layout/App/AppShell.Layout';

export default function AppShellBoot({ children }: AppShellBootProps) {
  const appValues = useContext(VeleroAppContexts);
  useClusterConfigs();
  //useAgentApiConfigs();
  //const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!appValues.state.initialized && appValues.state.isCore !== undefined) {
      appValues.setInitialized(true);
    }
  }, [appValues.state.initialized, appValues.state.isCore]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('token');
      if (jwtToken !== null) {
        appValues.setLogged(true);
      } else {
        appValues.setLogged(false);
      }
    }
  }, []);
  //if (!initialized) return null;

  return <AppShellLayout>{children}</AppShellLayout>;
}
