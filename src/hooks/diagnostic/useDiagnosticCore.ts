'use client';

import { CoreStateManager } from '@/lib/CoreStateManager';

import { useServerStatus } from '@/contexts/ServerContext';

export const useDiagnosticCore = () => {
  const serverValues = useServerStatus();
  const stateManager = new CoreStateManager();

  stateManager.setVariable('getUiURL', serverValues?.uiURL !== '');
  stateManager.setVariable('getApiURL', serverValues?.apiURL !== '');
  stateManager.setVariable('checkApiReachable', serverValues.isServerAvailable === true);
  stateManager.setVariable(
    'getArchitecture',
    serverValues.isServerAvailable === true && serverValues?.arch?.platform === undefined
  );
  stateManager.setVariable('getOrigins', serverValues?.origins.length > 0);
  stateManager.setVariable(
    'validateOrigins',
    serverValues?.origins.length > 0 && (serverValues?.origins.includes(serverValues?.uiURL) || serverValues?.origins.includes('*'))
  );
  stateManager.setVariable('getClusterHealth', serverValues?.k8sHealth !== undefined);
  stateManager.hasWarnings = serverValues?.origins.length > 0 && serverValues?.origins.includes('*');

  return stateManager
};
