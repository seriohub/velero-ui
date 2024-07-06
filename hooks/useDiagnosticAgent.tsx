import { useContext, useEffect, useState } from 'react';
import { env } from 'next-runtime-env';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useApiGet } from '@/hooks/useApiGet';
import { AgentStateManager } from '@/lib/AgentStateManager';

import { useUrlAvailability } from './useUrlAvailability';
import { useBackend } from './useBackend';

export const useDiagnosticAgent = () => {
  const appValues = useContext(VeleroAppContexts);
  const stateManager = new AgentStateManager();

  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');

  const [uiURL, setUiHost] = useState('');
  const [origins, setOrigins] = useState<string | any>('');
  const apiURL = useBackend();

  const { data: k8sHealth, getData: getDataK8sHealth } = useApiGet();
  const { data: apiOrigins, getData: getApiOrigins } = useApiGet();
  const { data: apiArch, getData: getApiArch } = useApiGet();
  const { data: watchdog, getData: getWatchdog } = useApiGet();
  const { data: compatibility, getData: getCompatibility } = useApiGet();
  const { isUrlAvailable, checkAvailability } = useUrlAvailability();

  useEffect(() => {
    getDataK8sHealth('/info/health-k8s');
    getApiOrigins('/info/origins');
    getApiArch('/info/arch');
    getWatchdog('/info/watchdog');
    getCompatibility('/info/get-ui-comp', 'version=' + NEXT_PUBLIC_FRONT_END_BUILD_VERSION);

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(currentURL.protocol + '//' + currentURL.host);
    }
  }, [appValues.state.currentBackend]);

  useEffect(() => {
    if (apiURL !== undefined) {
      checkAvailability(apiURL + '/info/health');
    }
  }, [apiURL]);

  useEffect(() => {
    if (apiOrigins !== undefined) {
      setOrigins(apiOrigins.payload);
    }
  }, [apiOrigins]);

  stateManager.setVariable('getUiURL', uiURL != '');
  stateManager.setVariable('getApiURL', apiURL != '');
  stateManager.setVariable('checkApiReacheable', isUrlAvailable);
  stateManager.setVariable(
    'getArchitecture',
    isUrlAvailable && apiArch?.payload?.platform == undefined
  );
  stateManager.setVariable('getOrigins', origins.length > 0);
  stateManager.setVariable(
    'validateOrigins',
    origins.length > 0 && (origins.includes(uiURL) || origins.includes('*'))
  );
  stateManager.setVariable(
    'getWatchdogInfo',
    watchdog && watchdog?.payload !== undefined ? true : false
  );
  stateManager.setVariable('getClusterHealth', k8sHealth != undefined);
  stateManager.hasWarnings = origins.length > 0 && origins.includes('*');
  stateManager.setVariable('getUiApiVerCompatibility', compatibility?.payload?.compatibility);

  return { uiURL, apiURL, apiArch, origins, k8sHealth, stateManager };
};
