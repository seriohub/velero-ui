import { useContext, useEffect, useState } from 'react';
import { env } from 'next-runtime-env';

import { useAppState } from '@/contexts/AppStateContext';
import { useApiGet } from '@/hooks/useApiGet';
import { CoreStateManager } from '@/lib/CoreStateManager';

import { useUrlAvailability } from './useUrlAvailability';
import { useBackend } from './useBackend';
import { useServerStatus } from '@/contexts/ServerStatusContext';

export const useDiagnosticCore = () => {
  const appValues = useAppState();
  const stateManager = new CoreStateManager();

  const NEXT_PUBLIC_FRONT_END_BUILD_VERSION = env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION');

  const [uiURL, setUiHost] = useState('');
  const [origins, setOrigins] = useState<string | any>('');
  const apiURL = useBackend({ target: 'core' });

  const { data: k8sHealth, getData: getDataK8sHealth } = useApiGet();
  const { data: apiOrigins, getData: getApiOrigins } = useApiGet();
  const { data: apiArch, getData: getApiArch } = useApiGet();
  const { data: compatibility, getData: getCompatibility } = useApiGet();

  //const { isUrlAvailable, checkAvailability } = useUrlAvailability();
  const isConnected = useServerStatus();

  useEffect(() => {
    getDataK8sHealth({ url: '/info/health-k8s', target: 'core' });
    getApiOrigins({ url: '/info/origins', target: 'core' });
    getApiArch({ url: '/info/arch', target: 'core' });
    getCompatibility({
      url: '/info/get-ui-comp',
      param: 'version=' + NEXT_PUBLIC_FRONT_END_BUILD_VERSION,
      target: 'core',
    });

    if (window) {
      const currentURL = new URL(window.location.href);
      setUiHost(currentURL.protocol + '//' + currentURL.host);
    }
  }, [appValues.currentServer]);

  /*useEffect(() => {
    if (apiURL !== undefined) {
      checkAvailability(apiURL + '/info/health');
    }
  }, [apiURL]);*/

  useEffect(() => {
    if (apiOrigins !== undefined) {
      setOrigins(apiOrigins.payload);
    }
  }, [apiOrigins]);

  stateManager.setVariable('getUiURL', uiURL != '');
  stateManager.setVariable('getApiURL', apiURL != '');
  stateManager.setVariable('checkApiReacheable', isConnected==true);
  stateManager.setVariable(
    'getArchitecture',
    isConnected==true && apiArch?.payload?.platform == undefined
  );
  stateManager.setVariable('getOrigins', origins.length > 0);
  stateManager.setVariable(
    'validateOrigins',
    origins.length > 0 && (origins.includes(uiURL) || origins.includes('*'))
  );
  stateManager.setVariable('getClusterHealth', k8sHealth != undefined);
  stateManager.hasWarnings = origins.length > 0 && origins.includes('*');
  stateManager.setVariable('getUiApiVerCompatibility', compatibility?.payload?.compatibility);
  return { uiURL, apiURL, apiArch, origins, k8sHealth, stateManager };
};
