import { useEffect } from 'react';

import { useApiGet } from '@/hooks/utils/useApiGet';
import { useServerStatus } from '@/contexts/ServerContext';

export const useServerConfig = () => {
  const serverValues = useServerStatus();
  const { data, getData } = useApiGet();

  useEffect(() => {
    const clusterIndex =
      localStorage.getItem('cluster') &&
      Number(localStorage.getItem('cluster')) < serverValues.servers.length
        ? Number(localStorage.getItem('cluster'))
        : 0;
    serverValues.setCurrentBackend(serverValues.servers[clusterIndex]);
  }, [serverValues.servers]);

  useEffect(() => {
    if (serverValues.isServerAvailable) {
      getData({ url: '/online', target: 'static' });
    }
  }, [serverValues.isServerAvailable]);

  useEffect(() => {
    if (data?.payload?.type !== undefined) {
      if (data?.payload?.type == 'core') {
        serverValues.setCurrentServerAsControlPlane(true);
      } else {
        serverValues.setCurrentServerAsControlPlane(false);
      }
    }
  }, [data]);

  return;
};
