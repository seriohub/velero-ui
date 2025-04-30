import { useEffect } from 'react';

import { useApiGet } from '@/hooks/utils/useApiGet';
import { useServerStatus } from '@/contexts/ServerContext';
// import { isRecordStringAny } from "@/utils/isRecordStringIsType";
// import { useCoreInfo } from "@/api/Core/useCoreInfo";

export const useServerConfig = () => {
  const serverValues = useServerStatus();
  const { data, getData } = useApiGet();

  /*const {
    data: serverInfo,
    getCoreInfo
  } = useCoreInfo();*/

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
      getData({
        url: '/online',
        target: 'static',
      });
    }
    /*if (serverValues.isCurrentServerControlPlane) {
      getCoreInfo();
    }*/
  }, [serverValues.isServerAvailable, serverValues.isCurrentServerControlPlane]);

  useEffect(() => {
    if (data?.type !== undefined) {
      if (data?.type === 'core' || data?.type === 'vui-common') {
        serverValues.setCurrentServerAsControlPlane(true);
      } else {
        serverValues.setCurrentServerAsControlPlane(false);
      }
    }
  }, [data]);

  // server info
  /*useEffect(() => {
    if (serverInfo && isRecordStringAny(serverInfo)) {
      serverValues.setServerInfo(serverInfo);
    }
  }, [serverInfo]);*/
};
