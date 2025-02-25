import { useEffect, useState } from 'react';
import { env } from 'next-runtime-env';

import { useApiGet } from '@/hooks/utils/useApiGet';
import { CoreStateManager } from '@/lib/CoreStateManager';

import { useBackend } from '../useBackend';
import { useServerStatus } from '@/contexts/ServerContext';

export const useDiagnosticCore = () => {
  const serverValues = useServerStatus();
  const stateManager = new CoreStateManager();

  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');

  const [uiURL, setUiHost] = useState('');
  const [reload, setReload] = useState(1);
  const [origins, setOrigins] = useState<string | any>('');
  const apiURL = useBackend({ target: 'static' });

  const { data: k8sHealth, getData: getDataK8sHealth } = useApiGet();
  const { data: apiOrigins, getData: getApiOrigins } = useApiGet();
  const { data: apiArch, getData: getApiArch } = useApiGet();
  const { data: compatibility, getData: getCompatibility } = useApiGet();

  useEffect(() => {
    if (serverValues.isServerAvailable) {
      getDataK8sHealth({
        url: '/health/k8s',
        target: 'core',
      });
      getApiOrigins({
        url: '/info/origins',
        target: 'core',
      });
      getApiArch({
        url: '/info/arch',
        target: 'core',
      });
      getCompatibility({
        url: '/info/compatibility-table',
        params: `version=${NEXT_PUBLIC_FRONT_END_BUILD_VERSION}`,
        target: 'core',
      });
    }

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(`${currentURL.protocol}//${currentURL.host}`);
    }
  }, [
    //serverValues.currentServer,
    serverValues.isServerAvailable,
    //serverValues.isCurrentServerControlPlane,
    reload,
  ]);

  useEffect(() => {
    if (apiOrigins !== undefined) {
      setOrigins(apiOrigins);
    }
  }, [apiOrigins]);

  stateManager.setVariable('getUiURL', uiURL !== '');
  stateManager.setVariable('getApiURL', apiURL !== '');
  stateManager.setVariable('checkApiReacheable', serverValues.isServerAvailable === true);
  stateManager.setVariable(
    'getArchitecture',
    serverValues.isServerAvailable === true && apiArch?.platform === undefined
  );
  stateManager.setVariable('getOrigins', origins.length > 0);
  stateManager.setVariable(
    'validateOrigins',
    origins.length > 0 && (origins.includes(uiURL) || origins.includes('*'))
  );
  stateManager.setVariable('getClusterHealth', k8sHealth !== undefined);
  stateManager.hasWarnings = origins.length > 0 && origins.includes('*');
  stateManager.setVariable('getUiApiVerCompatibility', compatibility?.compatibility);
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
