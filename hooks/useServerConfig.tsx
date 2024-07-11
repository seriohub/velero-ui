import { useEffect } from 'react';

import { useApiGet } from '@/hooks/useApiGet';
import { useServerStatus } from '@/contexts/ServerStatusContext';

export const useServerConfig = () => {
  const serverValues = useServerStatus();
  const { data, getData } = useApiGet();

  // 1
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 10 has been called`, `color: green; font-weight: bold;`)
    const clusterIndex =
      localStorage.getItem('cluster') &&
      Number(localStorage.getItem('cluster')) < serverValues.servers.length
        ? Number(localStorage.getItem('cluster'))
        : 0;
    serverValues.setCurrentBackend(serverValues.servers[clusterIndex]);
    serverValues.setInit(true);
  }, [serverValues.servers]);

  // 2
  useEffect(() => {
    // check is core or agent server
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 20 has been called`, `color: green; font-weight: bold;`)
    if (serverValues.isServerAvailable) {
      getData({ url: '/online', target: 'static' });
    }
  }, [serverValues.isServerAvailable]);

  // 3
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 30 has been called`, `color: green; font-weight: bold;`)
    // set core or agent server
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
