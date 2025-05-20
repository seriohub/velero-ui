import { useEffect, useState } from 'react';

import { AgentStateManager } from '@/lib/AgentStateManager';

import { useBackend } from '@/hooks/useBackend';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useServerStatus } from '@/contexts/ServerContext';

export const useDiagnosticAgent = () => {
  const agentStatus = useAgentStatus();
  const serverValues = useServerStatus();
  const stateManager = new AgentStateManager();

  const [uiURL, setUiHost] = useState('');
  const [reload, setReload] = useState(1);
  const apiURL = useBackend();

  useEffect(() => {

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(`${currentURL.protocol}//${currentURL.host}`);
    }
  }, [
    agentStatus.isAgentAvailable,
  ]);

  stateManager.uiURL = uiURL;
  stateManager.apiURL = apiURL;

  stateManager.k8sHealth = agentStatus.k8sHealth;
  stateManager.arch = agentStatus?.arch?.arch;
  stateManager.watchdog = agentStatus?.watchdogStatus?.status;

  if (agentStatus?.origins !== undefined) stateManager.apiOrigins = agentStatus?.origins;

  stateManager.setVariable('getUiURL', uiURL !== '');
  stateManager.setVariable('getApiURL', apiURL !== '');
  stateManager.setVariable('checkApiReachable', agentStatus.isAgentAvailable === true);
  stateManager.setVariable('getArchitecture', agentStatus?.arch?.arch !== undefined);
  stateManager.setVariable('getOrigins', agentStatus?.origins?.length > 0);
  stateManager.setVariable(
    'validateOrigins',
    serverValues.isCurrentServerControlPlane ||
    (agentStatus?.origins?.length > 0 && (agentStatus?.origins.includes(uiURL) || agentStatus?.origins.includes('*')))
  );
  stateManager.setVariable('getWatchdogInfo', agentStatus?.watchdogStatus !== undefined);
  stateManager.setVariable('getClusterHealth', agentStatus?.k8sHealth !== undefined);

  stateManager.hasWarnings =
    !serverValues.isCurrentServerControlPlane && agentStatus?.origins?.length > 0 && agentStatus?.origins?.includes('*');

  return {
    uiURL,
    apiURL,
    stateManager,
    reload,
    setReload,
  };
};
