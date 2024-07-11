import { useEffect, useState } from 'react';
import { env } from 'next-runtime-env';

import { useApiGet } from '@/hooks/useApiGet';
import { AgentStateManager } from '@/lib/AgentStateManager';

import { useBackend } from './useBackend';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

export const useDiagnosticAgent = () => {
  const agentStatus = useAgentStatus();
  const serverValues = useServerStatus();

  const stateManager = new AgentStateManager();

  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');

  const [uiURL, setUiHost] = useState('');
  const [reload, setReload] = useState(1);
  const [origins, setOrigins] = useState<string | any>('');
  const apiURL = useBackend();

  const { data: k8sHealth, getData: getDataK8sHealth } = useApiGet();
  const { data: apiOrigins, getData: getApiOrigins } = useApiGet();
  const { data: apiArch, getData: getApiArch } = useApiGet();
  const { data: watchdog, getData: getWatchdog } = useApiGet();
  const { data: compatibility, getData: getCompatibility } = useApiGet();
  // const { isUrlAvailable, checkAvailability } = useUrlAvailability();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 70 has been called`, `color: green; font-weight: bold;`)
    if (agentStatus.isAgentAvailable) {
      getDataK8sHealth({ url: '/info/health-k8s', target: 'agent' });
      getApiOrigins({ url: '/info/origins', target: 'agent' });
      getApiArch({ url: '/info/arch', target: 'agent' });
      getWatchdog({ url: '/info/watchdog', target: 'agent' });
      getCompatibility({
        url: '/info/get-ui-comp',
        param: 'version=' + NEXT_PUBLIC_FRONT_END_BUILD_VERSION,
        target: 'agent',
      });
    }

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(currentURL.protocol + '//' + currentURL.host);
    }
  }, [
    //agentStatus.currentAgent,
    agentStatus.isAgentAvailable,
    //serverValues.isCurrentServerControlPlane,
    reload
  ]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 80 has been called`, `color: green; font-weight: bold;`)
    if (apiOrigins !== undefined) {
      setOrigins(apiOrigins.payload);
    }
  }, [apiOrigins]);

  stateManager.setVariable('getUiURL', uiURL != '');
  stateManager.setVariable('getApiURL', apiURL != '');
  stateManager.setVariable('checkApiReacheable', agentStatus.isAgentAvailable == true);
  stateManager.setVariable('getArchitecture', apiArch?.payload?.arch !== undefined);
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

  return { uiURL, apiURL, apiArch, origins, k8sHealth, stateManager, reload, setReload };
};
