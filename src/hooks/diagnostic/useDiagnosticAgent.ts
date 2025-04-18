import { useEffect, useState } from 'react';
import { env } from 'next-runtime-env';

import { useApiGet } from '@/hooks/utils/useApiGet';
import { AgentStateManager } from '@/lib/AgentStateManager';

import { useBackend } from '../useBackend';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';

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
    if (agentStatus.isAgentAvailable) {

      getDataK8sHealth({ url: '/health/k8s' });
      getApiOrigins({
        url: '/info/origins',
        //target: 'agent',
      });
      getApiArch({
        url: '/info/arch',
        //target: 'agent',
      });
      getWatchdog({
        url: '/health/watchdog',
        target: 'agent',
      });
      getCompatibility({
        url: '/info/compatibility-table',
        params: `version=${NEXT_PUBLIC_FRONT_END_BUILD_VERSION}`,
       // target: 'agent',
      });
    }

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(`${currentURL.protocol}//${currentURL.host}`);
    }
  }, [
    //agentStatus.currentAgent,
    agentStatus.isAgentAvailable,
    //serverValues.isCurrentServerControlPlane,
    reload,
  ]);

  useEffect(() => {
    if (apiOrigins !== undefined) {

      setOrigins(apiOrigins);
    }
  }, [apiOrigins]);

  stateManager.uiURL = uiURL;
  stateManager.apiURL = apiURL;

  stateManager.k8sHealth = k8sHealth;
  stateManager.arch = apiArch?.arch;
  stateManager.watchdog = watchdog?.status;
  stateManager.compatibility = compatibility?.compatibility;
  if (apiOrigins !== undefined) stateManager.apiOrigins = apiOrigins;

  stateManager.setVariable('getUiURL', uiURL !== '');
  stateManager.setVariable('getApiURL', apiURL !== '');
  stateManager.setVariable('checkApiReachable', agentStatus.isAgentAvailable === true);
  stateManager.setVariable('getArchitecture', apiArch?.arch !== undefined);
  stateManager.setVariable('getOrigins', origins.length > 0);
  stateManager.setVariable(
    'validateOrigins',
    serverValues.isCurrentServerControlPlane ||
      (origins.length > 0 && (origins.includes(uiURL) || origins.includes('*')))
  );
  stateManager.setVariable('getWatchdogInfo', !!(watchdog && true));
  stateManager.setVariable('getClusterHealth', k8sHealth !== undefined);

  stateManager.setVariable('getUiApiVerCompatibility', compatibility?.compatibility);

  stateManager.hasWarnings =
    !serverValues.isCurrentServerControlPlane && origins.length > 0 && origins.includes('*');

  return {
    uiURL,
    apiURL,
    apiArch,
    origins,
    k8sHealth,
    stateManager,
    reload,
    setReload,
  };
};
